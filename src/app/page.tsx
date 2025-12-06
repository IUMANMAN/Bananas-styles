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
      <div className="mb-16 text-center space-y-6 px-4">
        <div className="inline-block">
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tight mb-4">
            Your Photo Prompts Collection
          </h1>
        </div>
        
        <p className="text-gray-600 text-base md:text-lg max-w-3xl mx-auto leading-relaxed">
          Discover curated prompts for <span className="font-semibold text-orange-500">Bananas</span> image generation and editing. 
          Transform your ideas into stunning visuals with our handpicked prompt library.
        </p>
        
        <div className="flex flex-wrap items-center justify-center gap-3">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-yellow-100 to-orange-100 border border-yellow-200 rounded-full text-sm font-semibold text-yellow-800 shadow-sm">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 11H9v-2h2v2zm0-4H9V5h2v4z"/>
            </svg>
            <span>{totalStyles} Prompts</span>
          </div>
          
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-100 to-cyan-100 border border-blue-200 rounded-full text-sm font-semibold text-blue-700 shadow-sm">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"/>
            </svg>
            <span>Community Curated</span>
          </div>
        </div>
      </div>

      <InfiniteMasonryGrid 
        initialStyles={initialStyles} 
        initialLikedIds={initialLikedIds} 
      />
    </div>
  );
}
