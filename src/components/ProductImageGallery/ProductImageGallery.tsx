import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import styles from "./ProductImageGallery.module.css";

type ProductImageGalleryProps = {
  images: string[];
  productName: string;
};

const SWIPE_THRESHOLD = 50;

const ProductImageGallery = ({ images, productName }: ProductImageGalleryProps) => {
  const [activeImage, setActiveImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const hasMultipleImages = images.length > 1;

  const goToPrevious = useCallback(() => {
    setActiveImage((current) => (current === 0 ? images.length - 1 : current - 1));
  }, [images.length]);

  const goToNext = useCallback(() => {
    setActiveImage((current) => (current === images.length - 1 ? 0 : current + 1));
  }, [images.length]);

  useEffect(() => {
    setActiveImage(0);
  }, [images]);

  useEffect(() => {
    if (!lightboxOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setLightboxOpen(false);
      }
      if (event.key === "ArrowLeft") {
        goToPrevious();
      }
      if (event.key === "ArrowRight") {
        goToNext();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [lightboxOpen, goToNext, goToPrevious]);

  const handleTouchStart = (event: React.TouchEvent) => {
    touchStartX.current = event.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (event: React.TouchEvent) => {
    if (touchStartX.current === null || !hasMultipleImages) return;

    const touchEndX = event.changedTouches[0]?.clientX ?? touchStartX.current;
    const delta = touchEndX - touchStartX.current;
    touchStartX.current = null;

    if (Math.abs(delta) < SWIPE_THRESHOLD) return;

    if (delta > 0) {
      goToPrevious();
      return;
    }

    goToNext();
  };

  return (
    <>
      <div className={styles.gallery}>
        <div
          className={styles.mainImage}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onClick={() => setLightboxOpen(true)}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              setLightboxOpen(true);
            }
          }}
          role="button"
          tabIndex={0}
          aria-label="Open image viewer"
        >
          <img src={images[activeImage]} alt={productName} />

          {hasMultipleImages && (
            <span className={styles.imageCounter}>
              {activeImage + 1} / {images.length}
            </span>
          )}

          <button
            type="button"
            className={styles.viewBtn}
            onClick={(event) => {
              event.stopPropagation();
              setLightboxOpen(true);
            }}
            aria-label="View full image"
          >
            <ZoomIn size={14} />
            View
          </button>

          {hasMultipleImages && (
            <>
              <button
                type="button"
                className={`${styles.navBtn} ${styles.navBtnPrev}`}
                onClick={(event) => {
                  event.stopPropagation();
                  goToPrevious();
                }}
                aria-label="Previous image"
              >
                <ChevronLeft size={22} />
              </button>
              <button
                type="button"
                className={`${styles.navBtn} ${styles.navBtnNext}`}
                onClick={(event) => {
                  event.stopPropagation();
                  goToNext();
                }}
                aria-label="Next image"
              >
                <ChevronRight size={22} />
              </button>
            </>
          )}
        </div>

        {hasMultipleImages && (
          <div className={styles.thumbnailTrack}>
            {images.map((image, index) => (
              <button
                key={`${image}-${index}`}
                type="button"
                className={`${styles.thumbnail} ${
                  activeImage === index ? styles.activeThumb : ""
                }`}
                onClick={() => setActiveImage(index)}
                aria-label={`View image ${index + 1}`}
              >
                <img src={image} alt={`${productName} ${index + 1}`} />
              </button>
            ))}
          </div>
        )}
      </div>

      {lightboxOpen && (
        <div
          className={styles.lightbox}
          role="dialog"
          aria-modal="true"
          aria-label={`${productName} image viewer`}
          onClick={() => setLightboxOpen(false)}
        >
          <div
            className={styles.lightboxContent}
            onClick={(event) => event.stopPropagation()}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <button
              type="button"
              className={styles.lightboxClose}
              onClick={() => setLightboxOpen(false)}
              aria-label="Close image viewer"
            >
              <X size={22} />
            </button>

            <img
              src={images[activeImage]}
              alt={productName}
              className={styles.lightboxImage}
            />

            {hasMultipleImages && (
              <>
                <button
                  type="button"
                  className={`${styles.lightboxNav} ${styles.lightboxNavPrev}`}
                  onClick={goToPrevious}
                  aria-label="Previous image"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  type="button"
                  className={`${styles.lightboxNav} ${styles.lightboxNavNext}`}
                  onClick={goToNext}
                  aria-label="Next image"
                >
                  <ChevronRight size={24} />
                </button>

                <div className={styles.lightboxThumbs}>
                  {images.map((image, index) => (
                    <button
                      key={`lightbox-${image}-${index}`}
                      type="button"
                      className={`${styles.lightboxThumb} ${
                        activeImage === index ? styles.lightboxThumbActive : ""
                      }`}
                      onClick={() => setActiveImage(index)}
                      aria-label={`View image ${index + 1}`}
                    >
                      <img src={image} alt={`${productName} ${index + 1}`} />
                    </button>
                  ))}
                </div>

                <span className={styles.lightboxCounter}>
                  {activeImage + 1} / {images.length}
                </span>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ProductImageGallery;
