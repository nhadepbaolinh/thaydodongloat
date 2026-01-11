import { GoogleGenAI, Part } from "@google/genai";

const EDIT_PROMPT = `Use the BASE IMAGE as the strict source of identity, pose, camera angle, lighting, and background.
Edit ONLY the clothing to match the exact outfit from the OUTFIT IMAGE.

Requirements:
- Keep the original face identity, hair, skin tone, expression, and body proportions exactly as in the base image.
- Keep the same background and environment as the base image.
- Replace clothing (and shoes/accessories if present in outfit) to match the outfit image exactly: same design, silhouette, color, fabric, patterns, seams, buttons/zippers. Any logos or text on the outfit should be removed or made blank.
- Photorealistic fabric behavior: correct drape, folds, shadows, and texture.
- No distortion, no deformation, no clipping.
- Full-body framing consistent with the base image.
- Output: 9:16 aspect ratio, 8K resolution quality, ultra realistic.
- No text, no watermark, no branding.`;

const NEGATIVE_PROMPT = `AVOID the following: face change, identity change, different person, beautified face, altered facial features, altered skin tone, background change, new location, cropped head, extra limbs, bad hands, bad feet, broken anatomy, warped body, stretched background, deformed clothing, melted fabric, clipping, transparent clothes, wrong outfit, inaccurate pattern, wrong color, incorrect silhouette, text, logo, watermark, brand name, caption, UI elements, artifacts, blur, lowres, noise.`;

const fullPrompt = `${EDIT_PROMPT}\n\n${NEGATIVE_PROMPT}`;


async function fileToGenerativePart(file: File): Promise<Part> {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result.split(',')[1]);
      } else {
        // This should not happen with readAsDataURL
        resolve('');
      }
    };
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
}

export async function generateEditedImage(baseImageFile: File, outfitImageFile: File): Promise<string> {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const model = 'gemini-2.5-flash-image';

  const baseImagePart = await fileToGenerativePart(baseImageFile);
  const outfitImagePart = await fileToGenerativePart(outfitImageFile);

  const textPart = { text: fullPrompt };

  const contents = {
    parts: [
      textPart,
      baseImagePart,
      outfitImagePart,
    ],
  };

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents,
      config: {
        imageConfig: {
          aspectRatio: "9:16"
        }
      }
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        const base64Data = part.inlineData.data;
        const mimeType = part.inlineData.mimeType;
        return `data:${mimeType};base64,${base64Data}`;
      }
    }
    
    throw new Error("No image data found in the API response.");

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        throw new Error(`Gemini API Error: ${error.message}`);
    }
    throw new Error("An unknown error occurred while calling the Gemini API.");
  }
}
