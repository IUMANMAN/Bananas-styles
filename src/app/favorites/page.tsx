import MasonryGrid from "@/components/MasonryGrid";
import StyleCard from "@/components/StyleCard";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function FavoritesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  const { data: likes } = await supabase
    .from("user_likes")
    .select("style_id, styles (*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const likedStyles = likes?.map((like) => like.styles) || [];

  return (
    <div className="min-h-screen pb-20">
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-gray-900">My Favorites</h1>
        <p className="text-gray-500 mt-2">Styles you've saved for later.</p>
      </div>

      {likedStyles.length > 0 ? (
        <MasonryGrid>
          {likedStyles.map((style: any) => (
            <StyleCard
              key={style.id}
              id={style.id}
              title={style.title}
              imageUrl={style.generated_image_url}
              originalImageUrl={style.original_image_url}
              introduction={style.introduction}
              prompt={style.prompt}
              initialLiked={true}
            />
          ))}
        </MasonryGrid>
      ) : (
        <div className="text-center py-20">
          <p className="text-gray-400">You haven't liked any styles yet.</p>
        </div>
      )}
    </div>
  );
}
