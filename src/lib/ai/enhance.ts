import {
  replicate,
  AI_MODELS,
  STYLE_PROMPTS,
  NEGATIVE_PROMPT,
  AIEnhancementOptions,
  AIEnhancementResult,
} from "./replicate";

/**
 * Upscale an image using Real-ESRGAN
 */
export async function upscaleImage(
  imageUrl: string,
  scale: 2 | 4 = 2
): Promise<AIEnhancementResult> {
  try {
    const output = await replicate.run(AI_MODELS.upscale, {
      input: {
        image: imageUrl,
        scale,
        face_enhance: false,
      },
    });

    // Replicate returns the output URL directly or as an array
    const resultUrl = Array.isArray(output) ? output[0] : output;

    if (typeof resultUrl === "string") {
      return { success: true, imageUrl: resultUrl };
    }

    return { success: false, error: "Invalid response from upscaler" };
  } catch (error) {
    console.error("Upscale error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Upscaling failed",
    };
  }
}

/**
 * Enhance image with style-specific AI processing
 */
export async function enhanceWithStyle(
  imageUrl: string,
  style: string
): Promise<AIEnhancementResult> {
  const prompt = STYLE_PROMPTS[style] || STYLE_PROMPTS["midnight-gold"];

  try {
    // Use ControlNet to maintain map structure while applying style
    const output = await replicate.run(AI_MODELS.controlnet, {
      input: {
        image: imageUrl,
        prompt: `${prompt}, high quality, detailed, 8k`,
        negative_prompt: NEGATIVE_PROMPT,
        num_inference_steps: 20,
        guidance_scale: 7.5,
        controlnet_conditioning_scale: 0.8,
      },
    });

    const resultUrl = Array.isArray(output) ? output[0] : output;

    if (typeof resultUrl === "string") {
      return { success: true, imageUrl: resultUrl };
    }

    return { success: false, error: "Invalid response from style enhancer" };
  } catch (error) {
    console.error("Style enhancement error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Style enhancement failed",
    };
  }
}

/**
 * Full AI enhancement pipeline
 */
export async function enhanceImage(
  options: AIEnhancementOptions
): Promise<AIEnhancementResult> {
  let currentImageUrl = options.imageUrl;

  // Step 1: Apply style enhancement if requested
  if (options.enhanceStyle) {
    const styleResult = await enhanceWithStyle(currentImageUrl, options.style);
    if (!styleResult.success) {
      return styleResult;
    }
    currentImageUrl = styleResult.imageUrl!;
  }

  // Step 2: Upscale if requested
  if (options.upscale) {
    const upscaleResult = await upscaleImage(
      currentImageUrl,
      options.upscaleFactor || 2
    );
    if (!upscaleResult.success) {
      return upscaleResult;
    }
    currentImageUrl = upscaleResult.imageUrl!;
  }

  return { success: true, imageUrl: currentImageUrl };
}

/**
 * Check if AI enhancement is available (API token is configured)
 */
export function isAIAvailable(): boolean {
  return !!process.env.REPLICATE_API_TOKEN;
}

/**
 * Estimate the cost of AI enhancement in credits
 */
export function estimateAICost(options: AIEnhancementOptions): number {
  let cost = 0;

  if (options.enhanceStyle) {
    cost += 5; // ~5 credits for ControlNet
  }

  if (options.upscale) {
    cost += options.upscaleFactor === 4 ? 3 : 2; // 2-3 credits for upscaling
  }

  return cost;
}
