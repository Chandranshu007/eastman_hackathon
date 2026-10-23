import { Image as ImageIcon } from "lucide-react";
import { useState } from "react";

export default function ProductImage({ src, alt, className = "" }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className={`image-placeholder ${className}`} role="img" aria-label={alt}>
        <ImageIcon size={34} strokeWidth={1.4} aria-hidden="true" />
        <span>Image unavailable</span>
      </div>
    );
  }

  return (
    <img
      className={className}
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}
