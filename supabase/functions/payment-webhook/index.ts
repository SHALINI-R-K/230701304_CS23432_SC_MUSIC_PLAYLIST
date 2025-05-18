// This function handles payment webhooks from Stripe

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.7.1";

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
    // Create Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Parse webhook payload
    const payload = await req.json();
    
    // Example handling Stripe webhook event
    if (payload.type === "payment_intent.succeeded") {
      const paymentIntent = payload.data.object;
      
      // Update purchase record
      const { error } = await supabase
        .from("purchases")
        .update({ 
          status: "completed",
        })
        .eq("id", paymentIntent.metadata.purchase_id);
        
      if (error) {
        console.error("Error updating purchase:", error);
        return new Response(JSON.stringify({ error: "Failed to update purchase" }), {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        });
      }
    }
    
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });

  } catch (error) {
    console.error("Error processing webhook:", error);
    
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  }
});