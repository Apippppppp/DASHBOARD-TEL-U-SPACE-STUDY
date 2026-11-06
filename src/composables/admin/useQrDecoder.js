import jsQR from 'jsqr'

// Bungkus BarcodeDetector bila ada, fallback jsqr pada frame kanvas.
export function useQrDecoder() {
  const native = typeof window !== 'undefined' && 'BarcodeDetector' in window
  const method = native ? 'BarcodeDetector' : 'jsqr'
  let detector = null
  let canvas = null
  let ctx = null

  if (native) {
    try {
      detector = new window.BarcodeDetector({ formats: ['qr_code'] })
    } catch {
      detector = null
    }
  }

  async function decode(video) {
    if (!video || video.readyState < 2 || !video.videoWidth) return null
    if (detector) {
      try {
        const codes = await detector.detect(video)
        return codes?.[0]?.rawValue ?? null
      } catch {
        return null
      }
    }
    if (!canvas) {
      canvas = document.createElement('canvas')
      ctx = canvas.getContext('2d', { willReadFrequently: true })
    }
    const w = video.videoWidth
    const h = video.videoHeight
    canvas.width = w
    canvas.height = h
    ctx.drawImage(video, 0, 0, w, h)
    const image = ctx.getImageData(0, 0, w, h)
    const result = jsQR(image.data, w, h)
    return result?.data ?? null
  }

  return { method, decode }
}
