import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

export function formatDate(dateString: string): string {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

export const TAMIL_ARTISTS = [
  {
    id: "1",
    name: "A.R. Rahman",
    image_url: "https://i.pinimg.com/736x/8a/33/7e/8a337e8142145d98801ea4a5700d60fb.jpg",
    bio: "A. R. Rahman is an Indian film composer, record producer, singer, songwriter, musician, multi-instrumentalist and philanthropist, popular for his works in Tamil and Hindi cinema.",
  },
  {
    id: "2",
    name: "Anirudh Ravichander",
    image_url: "https://i.pinimg.com/474x/d4/30/cf/d430cf27f229dbe958dd53752c4fd081.jpg",
    bio: "Anirudh Ravichander is an Indian film composer and singer who primarily works in Tamil cinema. He made his debut as a music composer in the Tamil film 3.",
  },
  {
    id: "3",
    name: "Sid Sriram",
    image_url: "https://artistsimages.b-cdn.net/sid-sriram/sid-sriram-1.jpg",
    bio: "Sid Sriram is an American-born Indian Carnatic musician and playback singer in Tamil cinema. He made his debut as a playback singer in the Tamil film Kadal.",
  },
  {
    id: "4",
    name: "Shreya Ghoshal",
    image_url: "https://s1.ticketm.net/dam/a/060/1264c7e7-b28b-493c-8977-c4756be9a060_112081_RETINA_PORTRAIT_3_2.jpg",
    bio: "Shreya Ghoshal is an Indian playback singer who works predominantly in Hindi, Tamil, Telugu, Malayalam, Kannada, and Bengali films.",
  },
  {
    id: "5",
    name: "Yuvan Shankar Raja",
    image_url: "https://i.pinimg.com/originals/e9/7e/31/e97e317a75ab3eedcc1603fbe6d5eaf4.jpg",
    bio: "Yuvan Shankar Raja is an Indian film score and soundtrack composer and singer-songwriter. He predominantly scores music for Tamil films.",
  }
];

export const SAMPLE_SONGS = [
  // Romantic Songs
  {
    id: "1",
    title: "Ennodu Nee Irundhaal",
    artist_id: "1",
    album: "I",
    genre: "Romantic",
    duration: 244,
    image_url: "https://i.ytimg.com/vi/GkJPENir4KA/maxresdefault.jpg",
    song_url: "https://www.youtube.com/watch?v=EhhiY11Z9-U",
    is_premium: true,
    price: 1.99,
  },
  {
    id: "2",
    title: "Thangamey",
    artist_id: "5",
    album: "Naanum Rowdy Dhaan",
    genre: "Romantic",
    duration: 218,
    image_url: "https://i.ytimg.com/vi/o8U769AKtFA/hqdefault.jpg",
    song_url: "https://www.youtube.com/watch?v=4bZ-MAOLbGc",
    is_premium: true,
    price: 1.99,
  },
  {
    id: "3",
    title: "Maruvaarthai",
    artist_id: "3",
    album: "Enai Noki Paayum Thota",
    genre: "Romantic",
    duration: 267,
    image_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQIihd7775yrdLfja7uBzeUur4XgOIjSZQkA&s",
    song_url: "https://youtu.be/rpIlP6pI8fo?si=jfo2nEMAaKQNAoVT",
    is_premium: false,
    price: null,
  },
  // Folk Songs
  {
    id: "4",
    title: "Otha Solala",
    artist_id: "2",
    album: "Kanaa",
    genre: "Folk",
    duration: 231,
    image_url: "https://c-cdnet.cdn.smule.com/rs-s82/arr/90/d4/18e4ce72-aa89-4c97-9572-98e5d68cd8c8.jpg",
    song_url: "https://youtu.be/FNLrzbv0Vdg?si=whyGFUUlbKWHtIrd",
    is_premium: true,
    price: 2.49,
  },
  {
    id: "5",
    title: "Karuthavanlaam Galeejaam",
    artist_id: "4",
    album: "Velaikaran",
    genre: "Folk",
    duration: 290,
    image_url: "https://i.ytimg.com/vi/zH6RCVYh-UE/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLCgDambYx6EiPbtkcMmZ65KdrgGEw",
    song_url: "https://youtu.be/es-5OLRrUf8?si=KpaMryXqfDqbE2UD",
    is_premium: false,
    price: null,
  },
  // Dance Songs
  {
    id: "6",
    title: "Arabic Kuthu",
    artist_id: "2",
    album: "Beast",
    genre: "Dance",
    duration: 211,
    image_url: "https://i.ytimg.com/vi/KUN5Uf9mObQ/maxresdefault.jpg",
    song_url: "https://www.youtube.com/watch?v=KUN5Uf9mObQ",
    is_premium: true,
    price: 1.49,
  },
  {
    id: "7",
    title: "Rowdy Baby",
    artist_id: "2",
    album: "Maari 2",
    genre: "Dance",
    duration: 254,
    image_url: "https://i.ytimg.com/vi/x6Q7c9RyMzk/maxresdefault.jpg",
    song_url: "https://www.youtube.com/watch?v=x6Q7c9RyMzk",
    is_premium: false,
    price: null,
  },
  // Classical Songs
  {
    id: "8",
    title: "Munbe Vaa",
    artist_id: "1",
    album: "Sillunu Oru Kaadhal",
    genre: "Classical",
    duration: 238,
    image_url: "https://i.ytimg.com/vi/UPQZ4vuvW2s/sddefault.jpg",
    song_url: "https://youtu.be/UPQZ4vuvW2s?si=y_yPOTpDgMd5RHN3",
    is_premium: true,
    price: 1.99,
  },
  {
    id: "9",
    title: "Vaseegara",
    artist_id: "1",
    album: "Minnale",
    genre: "Classical",
    duration: 245,
    image_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXyRO5VG17dcKT5Jweeva3Vh3PaIt1XNhb5w&s",
    song_url: "https://youtu.be/ew1fKCWb_M4?si=nRZaW4rfOUb73Fxs",
    is_premium: true,
    price: 1.99,
  },
  // Devotional Songs
  {
    id: "10",
    title: "Manikka Vinayagam",
    artist_id: "1",
    album: "Devotional Hits",
    genre: "Devotional",
    duration: 320,
    image_url: "https://i.ytimg.com/vi/T-0FQbFErRI/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLDjjHSEPyHNXjvLPQOh2jNgXGQDzA",
    song_url: "https://youtu.be/tDrflKVPoyQ?si=BaStFl3sQHSrBz52",
    is_premium: false,
    price: null,
  },
  {
    id: "11",
    title: "Om Shivoham",
    artist_id: "1",
    album: "Naan Kadavul",
    genre: "Devotional",
    duration: 298,
    image_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRNVZ4tVXA7A-mxObzoMV3Nwi0ee5ZkIqtt1Q&s",
    song_url: "https://youtu.be/Xm9kjceWeEc?si=JZxufrtGXXs4XQeQ",
    is_premium: true,
    price: 2.49,
  },
  // Pop Songs
  {
    id: "12",
    title: "Chilla Chilla",
    artist_id: "2",
    album: "Thunivu",
    genre: "Pop",
    duration: 242,
    image_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjUo493r3Lqf4Q-NSYdP_GqHyPzdw7isxjiw&s",
    song_url: "https://youtu.be/oOQiBLrsIYs?si=OZDzH0G0Gd4XhhSH",
    is_premium: true,
    price: 1.99,
  },
  {
    id: "13",
    title: "Private Party",
    artist_id: "2",
    album: "Beast",
    genre: "Pop",
    duration: 233,
    image_url: "https://a10.gaanacdn.com/gn_img/song/NOXWVgbkqL/XWVJaZYwWk/size_m_1652358842.jpg",
    song_url: "https://youtu.be/SPmec1w1sXU?si=NMOv4zdn6-u7a-jY",
    is_premium: false,
    price: null,
  },
  // Hip Hop Songs
  {
    id: "14",
    title: "Enjoy Enjaami",
    artist_id: "2",
    album: "Singles",
    genre: "Hip Hop",
    duration: 278,
    image_url: "https://i.ytimg.com/vi/eYq7WapuDLU/maxresdefault.jpg",
    song_url: "https://youtu.be/eYq7WapuDLU?si=wNB1fzeG-VKsb9Fn",
    is_premium: true,
    price: 2.99,
  },
  {
    id: "15",
    title: "Vaathi Raid",
    artist_id: "2",
    album: "Master",
    genre: "Hip Hop",
    duration: 256,
    image_url: "https://a10.gaanacdn.com/gn_img/song/D0PKLrWGl9/PKLZzrqrWG/size_m_1610715602.webp",
    song_url: "https://youtu.be/eHoIUNY-bG4?si=xXqg08l-yvd_hhiU",
    is_premium: false,
    price: null,
  }
];

export const SAMPLE_PLAYLISTS = [
  {
    id: "1",
    name: "Romantic Tamil Hits",
    user_id: "user_id_1",
    description: "A collection of the most romantic Tamil songs of all time",
    image_url: "https://media.istockphoto.com/id/491840821/photo/vintage-audio-cassette.jpg?s=612x612&w=0&k=20&c=olm_Mlnct7FB5qfQ_Caeq9wNDKdtMy2O5VhhxarTDgs=",
    is_public: true,
  },
  {
    id: "2",
    name: "Tamil Dance Beats",
    user_id: "user_id_1",
    description: "Energetic Tamil songs that will make you dance",
    image_url: "https://i.ytimg.com/vi/GXc1TeClfto/sddefault.jpg",
    is_public: true,
  },
  {
    id: "3",
    name: "Melody Moments",
    user_id: "user_id_1",
    description: "Soft and melodious Tamil songs for your peaceful moments",
    image_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTMyEyDZMWgikMr_ESOEVHaIRhuwu_dw2rnlw&s",
    is_public: true,
  }
];

export const GENRES = [
  "Romantic",
  "Folk",
  "Dance",
  "Classical",
  "Devotional",
  "Pop",
  "Hip Hop"
];