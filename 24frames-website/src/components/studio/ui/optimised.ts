/* Serve the studio's photographs through Next's image optimiser: resized
   to the width actually shown and re-encoded as AVIF/WebP, instead of the
   full-size JPEG. Only site images under /images are routed (uploaded
   media lives behind the studio session, which the optimiser can't use).
   Widths must be listed in next.config images.deviceSizes / imageSizes. */
export type OptWidth = 256 | 384 | 640 | 828 | 1080 | 1200;

export function optimised(src: string | undefined | null, width: OptWidth = 640): string {
  if (!src) return "";
  if (!src.startsWith("/images/") || /\.(svg|gif)$/i.test(src)) return src;
  return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=75`;
}
