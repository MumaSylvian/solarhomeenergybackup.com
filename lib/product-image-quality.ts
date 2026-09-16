/**
 * Reject an image when its visible subject is absent or occupies only a thin
 * slice of the supplied canvas. This runs in the browser so PNG, JPEG, WebP,
 * and AVIF catalog assets receive the same check.
 */
export function hasCompleteProductFrame(image: HTMLImageElement) {
  if (!image.naturalWidth || !image.naturalHeight) return false;

  try {
    const longestSide = 180;
    const scale = Math.min(1, longestSide / Math.max(image.naturalWidth, image.naturalHeight));
    const width = Math.max(1, Math.round(image.naturalWidth * scale));
    const height = Math.max(1, Math.round(image.naturalHeight * scale));
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d', { willReadFrequently: true });
    if (!context) return false;

    canvas.width = width;
    canvas.height = height;
    context.drawImage(image, 0, 0, width, height);
    const pixels = context.getImageData(0, 0, width, height).data;
    const cornerOffsets = [0, (width - 1) * 4, (height - 1) * width * 4, ((height - 1) * width + width - 1) * 4];
    const cornerColors = cornerOffsets.map((offset) => `${pixels[offset]}:${pixels[offset + 1]}:${pixels[offset + 2]}:${pixels[offset + 3]}`);
    const background = cornerColors.sort((left, right) => cornerColors.filter((color) => color === right).length - cornerColors.filter((color) => color === left).length)[0].split(':').map(Number);
    let minX = width;
    let minY = height;
    let maxX = -1;
    let maxY = -1;
    let subjectPixels = 0;
    let sampledPixels = 0;

    for (let y = 0; y < height; y += 2) {
      for (let x = 0; x < width; x += 2) {
        const offset = (y * width + x) * 4;
        const difference = Math.abs(pixels[offset] - background[0])
          + Math.abs(pixels[offset + 1] - background[1])
          + Math.abs(pixels[offset + 2] - background[2])
          + Math.abs(pixels[offset + 3] - background[3]);
        sampledPixels += 1;
        if (difference <= 70) continue;
        subjectPixels += 1;
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      }
    }

    if (!subjectPixels || subjectPixels / sampledPixels < 0.008) return false;
    return (maxX - minX + 2) / width >= 0.22 && (maxY - minY + 2) / height >= 0.22;
  } catch {
    // A frame that cannot be inspected must not be presented as a product photo.
    return false;
  }
}
