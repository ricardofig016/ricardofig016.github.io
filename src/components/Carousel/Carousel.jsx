import { Children, useCallback, useEffect, useMemo, useRef, useState } from "react";
import PropTypes from "prop-types";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import styles from "./Carousel.module.css";

function Carousel({ children, ariaLabel, className, slideClassName, contentClassName, showDots = false, imageMeta = null }) {
  const slides = useMemo(() => Children.toArray(children).filter(Boolean), [children]);
  const carouselRef = useRef(null);
  const viewportRef = useRef(null);
  const scrollFrameRef = useRef(null);
  const [visibleSlides, setVisibleSlides] = useState(2);
  const [activeIndex, setActiveIndex] = useState(0);
  const [inlineStyle, setInlineStyle] = useState({});

  const pageCount = Math.max(slides.length - visibleSlides + 1, 1);
  const maxPageIndex = pageCount - 1;

  const readVisibleSlides = useCallback(() => {
    const carouselElement = carouselRef.current;

    if (!carouselElement || typeof window === "undefined") {
      return 1;
    }

    const rawValue = window.getComputedStyle(carouselElement).getPropertyValue("--carousel-visible-slides").trim();
    const parsedValue = Number.parseInt(rawValue, 10);
    return Number.isFinite(parsedValue) && parsedValue > 0 ? parsedValue : 1;
  }, []);

  useEffect(() => {
    // If image metadata is provided, derive preferred visible slides and media height
    if (imageMeta && Array.isArray(imageMeta) && imageMeta.length > 0 && typeof window !== "undefined") {
      // collect valid ratios
      const ratios = imageMeta.map((m) => (m && m.ratio ? m.ratio : null)).filter(Boolean);
      const medianRatio = (() => {
        if (ratios.length === 0) return 1.5;
        const sorted = [...ratios].sort((a, b) => a - b);
        const mid = Math.floor(sorted.length / 2);
        return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
      })();

      // Choose slides based on median aspect ratio
      let desiredSlides = 2;
      if (medianRatio < 0.8) desiredSlides = 3;
      else if (medianRatio >= 1.5) desiredSlides = 1;
      else desiredSlides = 2;

      // compute reasonable max height based on viewport width
      const carouselElement = carouselRef.current;
      let maxHeightPx = null;
      if (carouselElement) {
        const viewportWidth = carouselElement.clientWidth || window.innerWidth;
        const slideWidth = Math.max(100, Math.floor(viewportWidth / Math.max(1, desiredSlides)));
        maxHeightPx = Math.min(1200, Math.round(slideWidth / Math.max(0.1, medianRatio)));
      }

      const styleVars = {
        "--carousel-visible-slides": desiredSlides,
      };
      if (maxHeightPx) styleVars["--carousel-media-max-height"] = `${maxHeightPx}px`;

      setInlineStyle(styleVars);
    }
    const updateVisibleSlides = () => {
      setVisibleSlides((currentVisibleSlides) => {
        const nextVisibleSlides = readVisibleSlides();
        return currentVisibleSlides === nextVisibleSlides ? currentVisibleSlides : nextVisibleSlides;
      });
    };

    updateVisibleSlides();

    const carouselElement = carouselRef.current;
    if (typeof ResizeObserver !== "undefined" && carouselElement) {
      const observer = new ResizeObserver(updateVisibleSlides);
      observer.observe(carouselElement);
      return () => observer.disconnect();
    }

    window.addEventListener("resize", updateVisibleSlides);
    return () => window.removeEventListener("resize", updateVisibleSlides);
  }, [readVisibleSlides, imageMeta]);

  useEffect(() => {
    const viewport = viewportRef.current;

    if (!viewport) {
      return undefined;
    }

    const syncFromScroll = () => {
      if (scrollFrameRef.current !== null) {
        return;
      }

      scrollFrameRef.current = window.requestAnimationFrame(() => {
        scrollFrameRef.current = null;
        const slideWidth = viewport.clientWidth / Math.max(visibleSlides, 1);
        const nextIndex = Math.max(0, Math.min(maxPageIndex, Math.round(viewport.scrollLeft / slideWidth)));

        setActiveIndex((currentIndex) => (currentIndex === nextIndex ? currentIndex : nextIndex));
      });
    };

    syncFromScroll();
    viewport.addEventListener("scroll", syncFromScroll, { passive: true });

    return () => {
      viewport.removeEventListener("scroll", syncFromScroll);

      if (scrollFrameRef.current !== null) {
        window.cancelAnimationFrame(scrollFrameRef.current);
        scrollFrameRef.current = null;
      }
    };
  }, [maxPageIndex, visibleSlides]);

  const scrollToIndex = useCallback(
    (index, behavior = "smooth") => {
      const viewport = viewportRef.current;

      if (!viewport) {
        return;
      }

      const nextIndex = ((index % pageCount) + pageCount) % pageCount;
      const slideWidth = viewport.clientWidth / Math.max(visibleSlides, 1);

      viewport.scrollTo({ left: nextIndex * slideWidth, behavior });
    },
    [pageCount, visibleSlides],
  );

  const handlePrevious = () => {
    if (pageCount <= 1) return;
    scrollToIndex(activeIndex - 1);
  };

  const handleNext = () => {
    if (pageCount <= 1) return;
    scrollToIndex(activeIndex + 1);
  };

  useEffect(() => {
    setActiveIndex((currentIndex) => {
      const clampedIndex = Math.min(currentIndex, maxPageIndex);

      if (clampedIndex !== currentIndex) scrollToIndex(clampedIndex, "auto");

      return clampedIndex;
    });
  }, [maxPageIndex, scrollToIndex]);

  if (slides.length === 0) {
    return null;
  }

  return (
    <div ref={carouselRef} style={inlineStyle} className={`${styles.carousel} ${className || ""}`.trim()} aria-roledescription="carousel" aria-label={ariaLabel}>
      <button className={`${styles.navButton} ${styles.prevButton}`} type="button" onClick={handlePrevious} aria-label="Previous page" disabled={pageCount <= 1}>
        <FaChevronLeft aria-hidden="true" />
      </button>

      <div className={styles.viewport} ref={viewportRef} tabIndex={0} style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
        <div className={styles.track}>
          {slides.map((slide, index) => (
            <div className={`${styles.slide} ${slideClassName || ""}`.trim()} key={slide.key ?? index}>
              <div className={`${styles.slideContent} ${contentClassName || ""}`.trim()}>{slide}</div>
            </div>
          ))}
        </div>
      </div>

      <button className={`${styles.navButton} ${styles.nextButton}`} type="button" onClick={handleNext} aria-label="Next page" disabled={pageCount <= 1}>
        <FaChevronRight aria-hidden="true" />
      </button>

      {showDots && pageCount > 1 && (
        <div className={styles.dots} aria-label="Carousel pagination">
          {Array.from({ length: pageCount }).map((_, index) => (
            <button
              key={index}
              type="button"
              className={`${styles.dot} ${index === activeIndex ? styles.dotActive : ""}`.trim()}
              onClick={() => scrollToIndex(index)}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === activeIndex ? "true" : undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
}

Carousel.propTypes = {
  children: PropTypes.node.isRequired,
  ariaLabel: PropTypes.string.isRequired,
  className: PropTypes.string,
  slideClassName: PropTypes.string,
  contentClassName: PropTypes.string,
  showDots: PropTypes.bool,
  imageMeta: PropTypes.array,
};

export default Carousel;
