import imageCompression from 'browser-image-compression'

/**
 * Compress and grayscale an image before sending to Tesseract.
 * Smaller, higher-contrast input → faster OCR + better accuracy.
 *
 * Targets ~1MB output, max dimension 1600px (enough for label text).
 */
export async function compressForOCR(file: File | Blob): Promise<File> {
  const compressed = await imageCompression(file as File, {
    maxSizeMB: 1,
    maxWidthOrHeight: 1600,
    useWebWorker: true,
    initialQuality: 0.85,
  })

  // Optional: convert to grayscale via canvas for sharper OCR
  return grayscale(compressed)
}

async function grayscale(file: File): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        URL.revokeObjectURL(url)
        return resolve(file) // fallback: return original
      }
      ctx.drawImage(img, 0, 0)
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const d = imageData.data
      for (let i = 0; i < d.length; i += 4) {
        // Luminance formula — preserves text contrast better than averaging
        const gray = d[i] * 0.299 + d[i + 1] * 0.587 + d[i + 2] * 0.114
        d[i] = d[i + 1] = d[i + 2] = gray
      }
      ctx.putImageData(imageData, 0, 0)
      canvas.toBlob(blob => {
        URL.revokeObjectURL(url)
        if (!blob) return reject(new Error('canvas.toBlob failed'))
        resolve(new File([blob], file.name, { type: 'image/jpeg' }))
      }, 'image/jpeg', 0.9)
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('image load failed'))
    }
    img.src = url
  })
}
