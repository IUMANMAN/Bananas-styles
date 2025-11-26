import Image from "next/image";
import MasonryGrid from "@/components/MasonryGrid";
import InfiniteMasonryGrid from "@/components/InfiniteMasonryGrid";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Initial Fetch (Page 1, 30 items)
  const ITEMS_PER_PAGE = 30;
  
  const { data: styles, count } = await supabase
    .from("styles")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(0, ITEMS_PER_PAGE - 1);

  const totalStyles = count || 0;
  const initialStyles = styles || [];

  // Fetch Initial User Likes if logged in
  let initialLikedIds: string[] = [];
  if (user && initialStyles.length > 0) {
    const styleIds = initialStyles.map(s => s.id);
    const { data: likes } = await supabase
      .from("user_likes")
      .select("style_id")
      .eq("user_id", user.id)
      .in("style_id", styleIds);
    
    if (likes) {
      initialLikedIds = likes.map(l => l.style_id);
    }
  }

  return (
    <div className="min-h-screen pb-20">
      <div className="mb-12 text-center space-y-4">
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500">
          Discover AI Styles
        </h1>
        <p className="text-gray-500 text-lg max-w-2xl mx-auto">
          Explore a curated collection of prompts and styles for your next generation.
        </p>
        <div className="inline-block px-4 py-1.5 bg-gray-100 rounded-full text-sm font-medium text-gray-600">
          Total Styles: {totalStyles}
        </div>
      </div>

      <InfiniteMasonryGrid 
        initialStyles={initialStyles} 
        initialLikedIds={initialLikedIds} 
      />
    </div>
  );
}
