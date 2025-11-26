import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

const scrapedData = [
    {
        "title": "1. Nano Banana 3D Action Figure",
        "introduction": "Easily generate lifelike 3D action figures from your images﻿ with Nano Banana prompts, turning your picture into stunning, detailed models. Try to use Google Gemini 3 Pro prompt copy and paste to quickly apply your prompts and streamline the creative process.",
        "prompt": "create a 1/7 scale commercialized figure of thecharacter in the illustration, in a realistic styie and environment.Place the figure on a computer desk, using a circular transparent acrylic base without any text.On the computer screen, display the ZBrush modeling process of the figure.Next to the computer screen, place a BANDAI-style toy packaging box printedwith the original artwork.",
        "images": [
            "/img/3d-action-figure-original-image.jpg",
            "/img/3d-action-figure-generated-image.jpg"
        ]
    },
    {
        "title": "2. Chibi Knitted Doll",
        "introduction": "Quickly transform your images into cute chibi-style knitted dolls with Gemini 3 Pro AI prompt copy and paste. With Gemini AI prompt copy paste, you can easily apply pre-made prompts to achieve consistent, high-quality results every time.",
        "prompt": "A close-up, professionally composed photograph showcasing a hand-crocheted yarn doll gently cradled by two hands. The doll has a rounded shape, featuring the cute chibi image of the [upload image] character, with vivid contrasting colors and rich details. The hands holding the doll are natural and gentle, with clearly visible finger postures, and natural skin texture and light/shadow transitions, conveying a warm and realistic touch. The background is slightly blurred, depicting an indoor environment with a warm wooden tabletop and natural light streaming in from a window, creating a comfortable and intimate atmosphere. The overall image conveys a sense of exquisite craftsmanship and cherished warmth.",
        "images": [
            "/img/chibi-knitted-doll-original-image.jpg",
            "/img/chibi-knitted-doll-generated-image.jpg"
        ]
    },
    {
        "title": "3. Character Capsules",
        "introduction": "Create compact, stylized character capsules from your images using Nano Banana Pro/Nano Banana prompt example. For convenience, try a Gemini 3 Pro AI photo prompt copy paste to quickly replicate high-quality results.",
        "prompt": "A detailed, transparent gashapon capsule diorama, held between fingers, featuring [NAME] in their [ICONIC POSE / STYLE]. Inside: [short description of figure’s look, clothing, and accessories], with background elements such as [relevant setting: stadium, stage, lecture hall, etc.]. Lighting should be dramatic and cinematic, matching their theme. The capsule has a transparent top and a colored base [choose fitting color: e.g., royal blue, gold, black, red], decorated with [motifs related to the person]. The base is labeled with [NAME or NICKNAME] in a matching font style. The design should look like a miniature collectible, with photorealistic detail and soft bokeh. 👀 Note: Replace [NAME], [ICONIC POSE / STYLE], [short description of figure’s look, clothing, and accessories], [relevant setting: stadium, stage, lecture hall, etc.], [choose fitting color: e.g., royal blue, gold, black, red], and [NAME or NICKNAME] in the prompt with specific descriptions.",
        "images": [
            "/img/character-capsules-original-girl.jpg",
            "/img/character-capsules-generated-girl.jpg"
        ]
    },
    {
        "title": "4. Character Plush Toys",
        "introduction": "Transform your characters into adorable plush toys instantly with Nano Banana pro model prompts. You can also try AI prompt copy paste to quickly apply ready-made prompts and achieve consistent, high-quality results.",
        "prompt": "A soft, high-quality plush toy of [CHARACTER], with an oversized head, small body, and stubby limbs. Made of fuzzy fabric with visible stitching and embroidered facial features. The plush is shown sitting or standing against a neutral background. The expression is cute or expressive, and it wears simple clothes or iconic accessories if relevant. Lighting is soft and even, with a realistic, collectible plush look. Centered, full-body view. 👀 Note: Replace [CHARACTER] in the prompt with specific descriptions.",
        "images": [
            "/img/character-plush-toy-original-image.jpg",
            "/img/character-plush-toy-generated-image.jpg"
        ]
    },
    {
        "title": "5. iPhone Selfie",
        "introduction": "Generate realistic iPhone-style selfies from your photos using the trending prompt for Nano Banana pro. Try using Google Gemini AI prompt copy and paste for ready-made prompts that make it easy to generate high-quality, consistent selfies.",
        "prompt": "Please draw an extremely ordinary and unremarkable iPhone selfie, with no clear subject or sense of composition — just like a random snapshot taken casually. The photo should include slight motion blur, with uneven lighting caused by sunlight or indoor lights, resulting in mild overexposure. The angle is awkward, the composition is messy, and the overall aesthetic is deliberately plain — as if it were accidentally taken while pulling the phone out of a pocket. The subjects are [Names], taken at night, next to the [Location]. 👀 Note: Replace [name] and [Location] in the prompt with specific descriptions.",
        "images": [
            "/img/iphone-selfie-original-boy_2025-09-19-072354_rvqv.jpg",
            "/img/iphone-selfie-generated-boy_2025-09-19-072454_tqix.jpg"
        ]
    },
    {
        "title": "6. Chibi Emoji Sticker",
        "introduction": "Copy and paste this trending AI photo prompt to create playful chibi emoji stickers from any image using different poses. Simply use a Gemini prompt copy paste to speed up the process and get fun, shareable results.",
        "prompt": "Making a playful peace sign with both hands and winking. Tearful eyes and slightly trembling lips, showing a cute crying expression. Arms wide open in a warm, enthusiastic hug pose. Lying on their side asleep, resting on a tiny pillow with a sweet smile. Pointing forward with confidence, surrounded by shining visual effects. Blowing a kiss, with heart symbols floating around. Maintain the chibi aesthetic. Exaggerated, expressive big eyes. Soft facial lines. Background: Vibrant red with star or colorful confetti elements for decoration. Leave some clean white space around each sticker. Aspect ratio: 9:16",
        "images": [
            "/img/chibi-emoji-sticker-original-image.jpg",
            "/img/chibi-emoji-sticker-generated-image.jpg"
        ]
    },
    {
        "title": "7. Funko Pop Figure",
        "introduction": "Quickly turn your photos into collectible Funko Pop-style figures﻿ with Gemini AI photo prompt copy and paste.",
        "prompt": "Create a detailed 3D render of a chibi Funko Pop figure, strictly based on the provided reference photo. The figure should accurately reflect the person's appearance, hairstyle, attire, and characteristic style from the photo. High detail, studio lighting, photorealistic texture, pure white background. 👀 Note: Replace [name] in the prompt with specific descriptions.",
        "images": [
            "/img/funko-pop-figure-original-image.jpg",
            "/img/funko-pop-figure-generated-image.jpg"
        ]
    },
    {
        "title": "8. Ghibli Style",
        "introduction": "Transform your images into enchanting scenes inspired by Studio Ghibli image style﻿ with Google Gemini AI prompt copy and paste.",
        "prompt": "Redraw this photo in Ghibli style",
        "images": [
            "/img/ghibli-style-original-image.jpg",
            "/img/ghibli-style-generated-image.jpg"
        ]
    },
    {
        "title": "9. Game UI",
        "introduction": "Convert your designs into immersive game UI elements with Nano Banana/Nano Banana Pro model prompts. With Google Gemini prompt copy paste, you can quickly apply ready-to-use instructions and keep your interface consistent and visually striking.",
        "prompt": "A vibrant rhythm dance game screenshot featuring the 3D animated character from the reference photo, keeping its unique style, hat, outfit, and confident dance pose. Immersive cinematic lighting with neon pink and purple glow, glossy reflective dance floor shining under spotlights, and dynamic 3D cartoon style. Rhythm game interface with immersive UI: score meter at the top, colorful music waveform animations synced to the beat, stage timer countdown, and floating combo numbers. Highly detailed, game-like atmosphere with energy bars, neon particle effects, and immersive arcade rhythm game HUD elements. Ultra-detailed, cinematic, immersive, 3D animation.",
        "images": [
            "/img/game-ui-original-image_2025-09-19-073041_irtp.jpg",
            "/img/game-ui-generated-image_2025-09-19-073058_vcab.jpg",
            "/img/combine-multiple-images-original-image.jpg",
            "/img/combine-multiple-images-generated-image.jpg"
        ]
    },
    {
        "title": "10. Image Fusion: Combine Multiple Images",
        "introduction": "Seamlessly merge multiple photos into one﻿ cohesive and visually striking image with Nano Banana prompt guide. For faster results, try a Google Gemini AI prompt copy paste to apply pre-set instructions and enhance creativity without extra effort.",
        "prompt": "Combine multiple images ([Image1], [Image2], [Image3], …) into a single cohesive image. Keep all key subjects recognizable and maintain their proportions and details. Blend the images naturally with consistent lighting, shadows, perspective, and style. Photorealistic, high-resolution, seamless integration.",
        "images": [
            "/img/combine-multiple-images-original-image.jpg",
            "/img/combine-multiple-images-generated-image.jpg"
        ]
    },
    {
        "title": "11. Style Fusion",
        "introduction": "Blend the styles of two images to create a unique, harmonious look with the Nano Banana prompt generator. You can also explore Gemini AI photo prompt copy paste options to quickly try trending styles and refine your creative results.",
        "prompt": "Transform this image [Image1] into the artistic style of [Image2]. Keep the main subject, composition, and details from [Image1], but apply the colors, textures, and overall aesthetic of [Image2]. High-quality, [illustraition] style, consistent details. 👀 Note: Replace [illustraition] in the prompt with specific descriptions.",
        "images": [
            "/img/style-fusion-original-picture.jpg",
            "/img/style-fusion-generated-picture.jpg"
        ]
    },
    {
        "title": "12. Virtual Change Clothes",
        "introduction": "Instantly use Gemini AI photo prompt copy and paste to change outfits﻿ on your subjects to see them in new styles and looks.",
        "prompt": "Keep the character in [Image1] unchanged, but replace her pant with the outfit in [Image2]. Maintain the same pose, body proportions, and facial features, while applying the color, texture, and style of the pants in [Image2]. High-quality, realistic, consistent detail.",
        "images": [
            "/img/virtual-change-clothes-original-image.jpg",
            "/img/virtual-change-clothes-generated-image.jpg"
        ]
    },
    {
        "title": "13. Facial Expression Control",
        "introduction": "Adjust facial expressions﻿ to make your subjects smile, frown, or show any emotion using Nano Banana model prompts. For quick edits, use Gemini prompt copy paste to apply ready-made instructions and keep results consistent.",
        "prompt": "Keep the person from [Image1] unchanged, but change their facial expression to [desired expression, e.g., smiling, surprised, angry]. Preserve the pose, body proportions, hairstyle, and overall appearance. Maintain realistic lighting, shadows, and photorealistic details.",
        "images": [
            "/img/facial-expression-control-original-image.jpg",
            "/img/facial-expression-control-generated-image.jpg"
        ]
    },
    {
        "title": "14. Pose Control",
        "introduction": "Change the posture of your subjects to achieve dynamic or natural poses with the Google Gemini AI prompt copy and paste.",
        "prompt": "Take the two men and place them in the exact poses of the man in green carrying the man in red. Preserve their identities, body proportions, and clothing details. Ensure the pose is natural and realistic, with consistent lighting, shadows, and perspective. Photorealistic, high-resolution result.",
        "images": [
            "/img/pose-control-original-image.jpg",
            "/img/pose-control-generated-image.jpg"
        ]
    },
    {
        "title": "15. Body Reshape",
        "introduction": "Easily transform body shapes, from muscular to slim or fuller, with a few simple Google Gemini AI prompt copy and paste adjustments.",
        "prompt": "Reshape the body of the person in [Image1] into a [target body type]. Keep the face, identity, hairstyle, and clothing consistent. Ensure realistic anatomy, natural proportions, and photorealistic details.",
        "images": [
            "/img/muscular-body-original-image.jpg",
            "/img/muscular-body-generated-image.jpg"
        ]
    },
    {
        "title": "16. 3x3 Grid Portrait",
        "introduction": "Generate a 3x3 grid of portraits showcasing different life experience using Nano Banana model prompts. To simplify the process, try Google Gemini prompt copy paste for quick, consistent results across all portraits.",
        "prompt": "Using the uploaded photo as a reference, generate a set of 9 vibrant half-length portraits featuring natural life. Each portrait should show a different pose and be placed in a unique setting, with rich, colorful details that highlight the diversity of nature.",
        "images": [
            "/img/3x3-grid-portrait-original-image.jpg",
            "/img/3x3-grid-portrait-generated-image.jpg"
        ]
    },
    {
        "title": "17. Change Image Background",
        "introduction": "Type in prompts for Nano Banana to replace any image background with a new scene while keeping the subject intact. You can also use trending AI photo prompt text to apply pre-built edits and achieve professional results faster.",
        "prompt": "Replace the background of [Image1] with [desired background description, e.g., a beach, a forest, a city skyline]. Keep the main subject (person/object) unchanged, maintaining original proportions, lighting, and details. Ensure the subject blends naturally with the new environment. Photorealistic, high-resolution, seamless integration.",
        "images": [
            "/img/change-background-original-image_2025-09-11-111529_zsfa.jpg",
            "/img/change-background-generated-image_2025-09-11-111528_usho.jpg"
        ]
    },
    {
        "title": "18. Add and Remove Object from Image",
        "introduction": "Add Object to Image Easily insert new objects into your images and make them blend naturally. For faster creative edits, try AI prompt copy paste to apply pre-designed instructions and keep results seamless.",
        "prompt": "Add [desired element, e.g., a tree, a lamp, a dog] to [Image1]. Place it naturally in the scene, matching the lighting, perspective, and style. Keep the original elements unchanged. Photorealistic, seamless integration.",
        "images": [
            "/img/add-object-to-image-original-picture.jpg",
            "/img/add-object-to-image-generated-image.jpg"
        ]
    },
    {
        "title": "19. Change Camera Angle",
        "introduction": "Adjust the camera perspective to capture your subject from any viewpoint with this trending AI photo prompt. You can also try treding AI photo prompt text to quickly apply pre-made instructions and achieve consistent, professional results.",
        "prompt": "Recreate the person from [Image1] in four different camera perspectives.Keep the subject’s identity, body proportions, and clothing consistent across all four images. Maintain the same background environment as [Image1], with photorealistic lighting, natural shadows, and high-quality details. Generate four variations side by side:",
        "images": [
            "/img/change-camera-angle-original-image_batcheditor_fotor.jpg",
            "/img/change-camera-angle-generated-image_batcheditor_fotor.jpg"
        ]
    },
    {
        "title": "20. Edit Text in Image",
        "introduction": "Modify or replace text within your images﻿ while keeping the design intact. For easier edits, you can use Google Gemini pro AI photo prompt copy paste to quickly apply ready-made instructions and maintain consistency.",
        "prompt": "Edit the text in [Image1]. Replace the existing text with “[your new text]” while keeping the background, design, and other elements unchanged. Match the font style, size, and color to look natural and consistent with the image. Photorealistic, seamless integration.",
        "images": [
            "/img/edit-text-in-image-original-image.jpg",
            "/img/edit-text-in-image-generated-image.jpg"
        ]
    },
    {
        "title": "21. Time-Based Image Generation",
        "introduction": "Generate scenes that reflect specific moments in time, like 10 minutes later or at sunset, controlling time using the Nano Banana prompt example.",
        "prompt": "Generate an image of the same scene as [Image1], but showing how it looks 10 minutes later. Keep the environment and style consistent, but add natural changes over time such as light, weather, people and so on. Photorealistic, seamless continuity.",
        "images": [
            "/img/Time-Based-image-original-image.jpg",
            "/img/Time-Based-image-generated-image.jpg"
        ]
    },
    {
        "title": "22. Object Extraction",
        "introduction": "Easily isolate and extract specific objects from any image for further editing or reuse.",
        "prompt": "Extract the clothing from [Image1] and present it as a clean e-commerce product photo. Remove the model’s body completely. Keep the outfit in natural 3D shape, with realistic fabric folds, seams, and textures. Display the garment as if photographed on a mannequin or neatly laid flat, centered on a pure white or transparent background. High-resolution, professional lighting, suitable for online fashion catalog.",
        "images": [
            "/img/object-extraction-original-image.jpg",
            "/img/object-extraction-generated-image.jpg"
        ]
    },
    {
        "title": "23. Enhance Image",
        "introduction": "Improve image quality﻿, sharpening details and boosting clarity with minimal effort.",
        "prompt": "Enhance [Image1] to improve overall quality and detail. Keep the original composition, colors, and style intact. Increase resolution, sharpness, texture clarity, and lighting realism. Output as a photorealistic, high-resolution image.",
        "images": [
            "/img/enhance-image-original-image.jpg",
            "/img/enhance-image-generated-image.jpg"
        ]
    },
    {
        "title": "24. Change the Weath﻿﻿﻿er",
        "introduction": "Transform the scene’s weather instantly, from sunny to rainy, snowy, or foggy, with realistic effects with Nano Banana pro/Nano Banana prompt.",
        "prompt": "Change the weather in [Image1] to [desired weather, e.g., rainy, snowy, foggy, sunny]. Keep the main subject and overall scene intact. Adjust lighting, shadows, colors, and environmental effects to match the new weather. Photorealistic, seamless integration, high-resolution.",
        "images": [
            "/img/change-the-weather-original-image.jpg",
            "/img/change-the-weather-generated-image.jpg"
        ]
    },
    {
        "title": "25. Change Image Color",
        "introduction": "Easily adjust the colors of your images to match any mood, style, or aesthetic.",
        "prompt": "Change the colors in [Image1] to [desired color/style, e.g., warm tones, cool blue tones, pastel colors]. Keep the main subject and composition intact. Adjust lighting, shadows, and overall color balance to match the new color scheme. Photorealistic, high-resolution, natural-looking result.",
        "images": [
            "/img/change-image-color-original-image.jpg",
            "/img/change-image-color-generated-image.jpg"
        ]
    },
    {
        "title": "26. Image Replace",
        "introduction": "Swap specific elements or subjects in your image seamlessly with new ones.",
        "prompt": "Replace [target element or area] in [Image1] with [new element or reference, e.g., a different person, object, or scene]. Keep all other parts of the image unchanged. Ensure the replacement blends naturally with lighting, perspective, and overall style. Photorealistic, high-resolution, seamless integration.",
        "images": [
            "/img/image-replace-original-image.jpg",
            "/img/image-replace-generated-image.jpg"
        ]
    },
    {
        "title": "27. Image Outpainting",
        "introduction": "Extend your images beyond the original borders, creating natural and seamless new content.",
        "prompt": "Extend [Image1] beyond its original borders using outpainting. Keep the main subject and composition intact. Generate new content around the edges that matches the style, colors, lighting, and perspective of the original image. Photorealistic, high-resolution, seamless integration.",
        "images": [
            "/img/image-outpainting-original-image.jpg",
            "/img/image-outpainting-generated-image.jpg",
            "/img/the-original-image-to-be-outpainted.jpg",
            "/img/the-image-for-ratio-referrence.jpg"
        ]
    },
    {
        "title": "28. Line to Image",
        "introduction": "turn line art or sketches into an image that is fully colored and detailed with realistic or stylized effects.",
        "prompt": "Convert the line art in [Image1] into a fully colored and detailed image. Preserve all original outlines and compositions. Apply [desired style, e.g., photorealistic, anime, cartoon, digital painting] with realistic lighting, shadows, and textures. High-resolution, natural, seamless rendering.",
        "images": [
            "/img/line-to-image-original-image.jpg",
            "/img/line-to-image-generated-image.jpg"
        ]
    },
    {
        "title": "29. 3x3 Photo Grid Pose",
        "introduction": "Generate a 3x3 photo grid with varied poses, giving your portraits a dynamic and stylish presentation.",
        "prompt": "Turn the photo into a 3x3 grid of photo strips with different studio-style poses and expressions.",
        "images": [
            "/img/3x3-photo-grid-pose-original-image_2025-09-12-081605_load.jpg",
            "/img/3x3-photo-grid-pose-generated-image_2025-09-12-081619_cvrb.jpg"
        ]
    },
    {
        "title": "31. ﻿﻿Ingredients to Dish",
        "introduction": "Turn raw ingredients into a beautifully plated dish AI-generated picture from Nano Banana prompt generator.",
        "prompt": "Here are the items available: [List of items]. Based on these items, create an image of a [type of object/scene] that can be made or represented by combining them. The composition should make logical sense, considering the relationship between the items. Ensure the image is [visual style]. It should be with appropriate proportions and clear placement of each item. 👀 Note: Replace [List of items], [type of object/scene], [visual style]﻿ in the prompt with specific descriptions.",
        "images": [
            "/img/ingredients-to-dish-original-image.jpg",
            "/img/ingredients-to-dish-generated-image.jpg"
        ]
    },
    {
        "title": "32. ﻿﻿Anatomy Illustration",
        "introduction": "Generate precise and detailed anatomical illustrations for study or creative projects with prompt for Nano Banana AI model.",
        "prompt": "Draw a bilaterally symmetrical frontal anatomical illustration of the [Character], styled similarly to an infographic. The image should show the creature's external features on both sides, with its internal anatomy partially exposed. Detailed text should flank the image, explaining the creature's biology, abilities, behavior, habitat, and the specific functions of its anatomical structures. The overall design should be clear, informative, and in the style of a scientific illustration. 👀 Note: Replace [Character]﻿ in the prompt with specific descriptions.",
        "images": [
            "/img/anatomy-illustration-original-image.jpg",
            "/img/anatomy-illustration-after-image.jpg"
        ]
    },
    {
        "title": "33. ﻿﻿﻿﻿16-Bit Video Game Character",
        "introduction": "Use Nano Banana prompt text to convert your photos into pixelated, retro-game-style images that look straight out of a classic 16-bit video game.",
        "prompt": "Recreate this [Character] as a 16-bit video game character, and place the character in a level of a 2D 16-bit platform video game. 👀 Note: Replace [Character]﻿ in the prompt with specific descriptions.",
        "images": [
            "/img/16-bit-video-game-character-original-image.jpg",
            "/img/16-bit-video-game-character-generated-image.jpg"
        ]
    },
    {
        "title": "34. Gemini AI Polaroid-Style Photo",
        "introduction": "Gemini turns your snapshots into vintage AI Polaroid-style images﻿ with a nostalgic, retro aesthetic with Gemini AI photo prompts.",
        "prompt": "Take a picture with a Polaroid camera. The photo should look like a normal photo, without any clear subject or props. The photo should have a slight blur a consistent light source. Such as a flash from a dark room, spread throughout the photo. Do not change the faces. Replace the background behind the two people with a white curtain.",
        "images": [
            "/img/gemini-ai-polaroid-style-original-photo.jpg",
            "/img/gemini-ai-polaroid-style-generated-photo.jpg"
        ]
    },
    {
        "title": "35. AI Saree",
        "introduction": "Gemini instantly dresses your photo in a traditional saree﻿, blending cultural elegance with simple AI photo text prompts.",
        "prompt": "Create A soft, sunlit portrait wearing a flowing sheer yellow saree with delicate floral embroidery. Sit gracefully against a plain wall, bathed in warm natural light with a triangular patch of sunlight casting artistic shadows. Hold a vibrant bouquet of sunflowers close to the chest, and a small white flower is tucked behind he ear. Gentle expression, loose hair strands moving slightly, and the dreamy golden glow create a serene, poetic, and romantic.",
        "images": [
            "/img/AI-saree-original-image.jpg",
            "/img/AI-saree-generated-image.jpg"
        ]
    },
    {
        "title": "36. AI Hug Younger Self",
        "introduction": "Create a touching image of your present self hugging your younger self﻿, capturing warmth by Gemini AI photo prompt text copy and paste.",
        "prompt": "Take a photo taken with a Polaroid camera. The photo should look like an ordinary photograph, without an explicit subject or property. The photo should have a slight blur and a consistent light source, like a flash from a dark room, scattered throughout the photo. Don’t change the face. Change the background behind those two people with white curtains. Make it look like both people in the reference picture are hugging each other.",
        "images": [
            "/img/ai-hug-younger-self-original-image.jpg",
            "/img/ai-hug-younger-self-generated-image.jpg"
        ]
    },
    {
        "title": "37. AI B&W Studio Portrait",
        "introduction": "Nano Banana generates a classic black-and-white studio portrait with professional lighting and timeless elegance with Gemini AI photo prompts.",
        "prompt": "Please generate a top-angle and close-up black and white portrait of my face, focused on the head facing forward. Use a 35mm lens look, 10.7K 4HD quality. Proud expression. Deep black shadow background - only the face, the upper chest, and the shoulder.",
        "images": [
            "/img/ai-bw-studio-portrait-original-image.jpg",
            "/img/ai-bw-studio-portrait-generated-image.jpg"
        ]
    },
    {
        "title": "38. AI Cinematic Portrait",
        "introduction": "Gemini transforms your photo into a dramatic, movie-style portrait with rich lighting, depth, and cinematic flair using Nano Banana prompt text. You can get the same AI cinematic portrait effect using our free Nano Banana/Nano Banana pro prompt as an alternative to Banana prompts xyz.",
        "prompt": "Create a vertical potrait shot using the exact same face features, characterized by stark cinematic lighting and intense contrast. Captured in a slightly low, upward-facing angle that dramatized the subject’s jawline and neck, the composition evokes quite dominance and sculptural elegance. The background is a deep, saturated crimson red, creating a bold visual clash with the model’s luminous skin and dark wardrobe.",
        "images": [
            "/img/ai-cinematic-portrait-original-image.jpg",
            "/img/ai-cinematic-portrait-generated-image.jpg"
        ]
    },
    {
        "title": "39. Internal Structure Diagram",
        "introduction": "Easily generate detailed internal structure diagrams of any product using Nano Banana prompts, highlighting components and layers with clarity. For convenience, you can try Gemini AI prompt copy paste to quickly apply ready-made instructions and achieve precise, professional results.",
        "prompt": "Ultra-detailed exploded view of a product, metallic parts and electronic components floating in mid-air, perfectly aligned, revealing inner structure, futuristic technology aesthetic, 8K resolution, soft cinematic lighting, highly realistic.",
        "images": [
            "/img/internal-structural-diagram-original-picture.jpg",
            "/img/internal-structural-diagram-generated-picture.jpg"
        ]
    }
]


export async function GET() {
    const supabase = await createClient()
    let count = 0

    for (const item of scrapedData) {
        let original_image_url = null
        let generated_image_url = ''

        const images = item.images
        if (images.length > 0) {
            const generated = images.find(url => url.includes('generated'))
            const original = images.find(url => url.includes('original'))

            if (generated) {
                generated_image_url = generated
            } else {
                generated_image_url = images[images.length - 1]
            }

            if (original) {
                original_image_url = original
            } else {
                if (images[0] !== generated_image_url) {
                    original_image_url = images[0]
                }
            }
        }

        if (!generated_image_url) continue

        const { error } = await supabase.from('styles').insert({
            title: item.title,
            introduction: item.introduction,
            prompt: item.prompt,
            original_image_url,
            generated_image_url
        })

        if (!error) {
            count++
        } else {
            console.error('Insert error:', error)
            return NextResponse.json({ success: false, error, count })
        }
    }

    return NextResponse.json({ success: true, count })
}
