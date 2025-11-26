import { createClient } from "@/lib/supabase/server";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Copy } from "lucide-react";

export default async function StyleDetailPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  
  // In a real app, fetch from DB. For now, we might need to handle the mock data case if DB is empty.
  // But let's assume we are fetching from DB or falling back to notFound if not in DB (since we can't easily mock dynamic routes without a store).
  // Actually, I'll fetch and if it fails/empty, I'll show a mock for demonstration if the ID matches my mock IDs.
  
  let style: any = null;
  
  const { data } = await supabase.from("styles").select("*").eq("id", params.id).single();
  style = data;

  if (!style) {
    // Fallback for demo purposes if DB is empty
    const mockStyles: Record<string, any> = {
      "1": {
        id: "1",
        title: "Chibi Emoji Sticker",
        introduction: "Create playful chibi emoji stickers from any image using different poses.",
        prompt: "Making a playful peace sign with both hands and winking. Tearful eyes and slightly trembling lips...",
        generated_image_url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop",
        original_image_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1000&auto=format&fit=crop"
      }
    };
    style = mockStyles[params.id];
  }

  if (!style) {
    return notFound();
  }

  return (
    <div className="min-h-screen pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left Column: Images */}
        <div className="space-y-8">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-sm font-medium text-gray-500 mb-4 uppercase tracking-wider">Generated Result</h3>
            <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden">
              <Image
                src={style.generated_image_url}
                alt={style.title}
                fill
                className="object-cover"
              />
            </div>
          </div>
          
          {style.original_image_url && (
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-sm font-medium text-gray-500 mb-4 uppercase tracking-wider">Original Reference</h3>
              <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden">
                 <Image
                  src={style.original_image_url}
                  alt="Original"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Details */}
        <div className="space-y-8 lg:sticky lg:top-24 h-fit">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{style.title}</h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              {style.introduction}
            </p>
          </div>

          <div className="bg-yellow-50 border border-yellow-100 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-yellow-900 flex items-center gap-2">
                <span className="text-xl">🍌</span> Nano Banana Prompt
              </h3>
              <button className="text-yellow-700 hover:text-yellow-900 transition-colors">
                <Copy className="w-5 h-5" />
              </button>
            </div>
            <div className="bg-white/50 rounded-xl p-4 text-gray-800 font-mono text-sm leading-relaxed border border-yellow-100/50">
              {style.prompt}
            </div>
            <p className="mt-4 text-center text-sm text-yellow-700 font-medium">
              ✨ Click copy icon to grab this prompt ✨
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
