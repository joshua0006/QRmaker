/**
 * Utility functions for extracting dominant colors from images
 */

interface RGB {
  r: number;
  g: number;
  b: number;
}

interface ColorCount {
  color: string;
  count: number;
}

/**
 * Convert RGB values to hex color string
 */
function rgbToHex({ r, g, b }: RGB): string {
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

/**
 * Quantize a color value to reduce the number of unique colors
 */
function quantizeColor(value: number, levels: number): number {
  const step = 255 / (levels - 1);
  return Math.round(Math.round(value / step) * step);
}

/**
 * Extract dominant colors from an image
 */
export async function extractDominantColors(imageUrl: string, maxColors: number = 5): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      // Create canvas and get context
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      // Set canvas size to image size
      canvas.width = img.width;
      canvas.height = img.height;

      // Draw image on canvas
      ctx.drawImage(img, 0, 0);

      // Get image data
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;

      // Count color occurrences (with color quantization for better grouping)
      const colorCounts = new Map<string, number>();
      
      for (let i = 0; i < pixels.length; i += 4) {
        // Skip fully transparent pixels
        if (pixels[i + 3] < 128) continue;

        // Quantize colors to reduce unique colors
        const rgb: RGB = {
          r: quantizeColor(pixels[i], 8),
          g: quantizeColor(pixels[i + 1], 8),
          b: quantizeColor(pixels[i + 2], 8)
        };
        
        const hex = rgbToHex(rgb);
        colorCounts.set(hex, (colorCounts.get(hex) || 0) + 1);
      }

      // Convert to array and sort by count
      const sortedColors = Array.from(colorCounts.entries())
        .map(([color, count]): ColorCount => ({ color, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, maxColors)
        .map(({ color }) => color);

      resolve(sortedColors);
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    img.src = imageUrl;
  });
}