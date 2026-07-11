/**
 * Center-crops an image File to a square and re-encodes it, so every logo
 * stored by the app is guaranteed 1:1 regardless of what the admin uploads.
 * `size` controls the output resolution (square, in pixels).
 */
export function cropImageToSquare(file: File, size = 512): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      const minSide = Math.min(img.width, img.height);
      const sx = (img.width - minSide) / 2;
      const sy = (img.height - minSide) / 2;

      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        URL.revokeObjectURL(objectUrl);
        reject(new Error("Canvas not supported"));
        return;
      }

      ctx.drawImage(img, sx, sy, minSide, minSide, 0, 0, size, size);
      URL.revokeObjectURL(objectUrl);

      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error("Failed to encode cropped image"));
        },
        "image/png",
        0.92
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Could not read the selected image"));
    };

    img.src = objectUrl;
  });
}
