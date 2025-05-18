// This function creates a Stripe payment session for premium song purchases

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.7.1";
import Stripe from "npm:stripe@12.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    // Initialize Stripe
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY") || "";
    const stripe = new Stripe(stripeKey, {
      apiVersion: "2023-10-16",
    });

    // Create Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get user from authorization header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "No authorization header" }), {
        status: 401,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      });
    }

    // Verify the user
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      });
    }

    // Parse request body
    const { songId } = await req.json();
    
    if (!songId) {
      return new Response(JSON.stringify({ error: "Song ID is required" }), {
        status: 400,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      });
    }

    // Get song details
    const { data: song, error: songError } = await supabase
      .from("songs")
      .select("*")
      .eq("id", songId)
      .single();
    
    if (songError || !song) {
      return new Response(JSON.stringify({ error: "Song not found" }), {
        status: 404,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      });
    }

    // Create a purchase record
    const { data: purchase, error: purchaseError } = await supabase
      .from("purchases")
      .insert({
        user_id: user.id,
        song_id: songId,
        amount: song.price,
        status: "pending",
      })
      .select()
      .single();
    
    if (purchaseError || !purchase) {
      return new Response(JSON.stringify({ error: "Failed to create purchase" }), {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      });
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: song.title,
              description: `Premium Tamil song`,
              images: [song.image_url],
            },
            unit_amount: Math.round(song.price * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${req.headers.get("Origin")}/purchases?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("Origin")}/purchases?canceled=true`,
      metadata: {
        purchase_id: purchase.id,
      },
    });

    return new Response(JSON.stringify({ sessionId: session.id, url: session.url }), {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });

  } catch (error) {
    console.error("Error creating payment:", error);
    
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  }
});