import { useRef, useState, useEffect } from "react";

interface Item {
  tag?: string;
  image: Image;
  quote: string;
  name: string;
  role: string;
}

export default function TestimonialsCarousel({ items }: { items: Item[] }) {
  const carousel = useRef<HTMLDivElement>(null);
  const carouselWindow = useRef<HTMLDivElement>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [hovered, setHovered] = useState(false);
  const activeSlideRef = useRef(0);
  const hoveredRef = useRef(false);

  const toggleActive = (i: number) => {
    setActiveSlide(i);
    activeSlideRef.current = i;

    setTimeout(() => {
      carouselWindow.current.style.height =
        carousel.current.querySelector(".testimonials-carousel__slide--active")
          .offsetHeight + "px";
    }, 100);
  };

  useEffect(() => {
    let slides: HTMLElement[];

    carouselWindow.current.style.height =
      carousel.current.querySelector(".testimonials-carousel__slide--active")
        .offsetHeight + "px";
    slides = carousel.current.querySelectorAll(".testimonials-carousel__slide");

    const interval = setInterval(() => {
      if (!hoveredRef.current && window.innerWidth > 639) {
        const next =
          activeSlideRef.current + 1 >= slides.length
            ? 0
            : activeSlideRef.current + 1;
        toggleActive(next);
      }
    }, 4000);

    const handleResize = () => toggleActive(0);
    window.addEventListener("resize", handleResize);

    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div
      ref={carousel}
      className={"testimonials-carousel"}
      onMouseEnter={() => {
        setHovered(true);
        hoveredRef.current = true;
      }}
      onMouseLeave={() => {
        setHovered(false);
        hoveredRef.current = false;
      }}
    >
      <div ref={carouselWindow} className={"testimonials-carousel__window"}>
        {items?.map((item, i) => (
          <div
            key={i}
            className={`testimonials-carousel__slide testimonials-carousel__slide--${i} ${
              activeSlide == i ? "testimonials-carousel__slide--active" : ""
            }`}
            onClick={() => {
              toggleActive(i + 1 == items.length ? 0 : i + 1);
            }}
          >
            <picture>
              <source media="(min-width:768px)" srcSet={item.image.srcset} />
              <img src={item.image.src} alt={item.image.alt} />
            </picture>
            <div className={"testimonials-carousel__context"}>
              <p>"{item.quote}"</p>
              <div className={"testimonials-carousel__name"}>
                <strong>{item.name},</strong> {item.role}
              </div>
            </div>
          </div>
        ))}
      </div>
      <ul className={"testimonials-carousel__controls"}>
        {items?.map((item, i) => (
          <li key={i}>
            <button
              className={`${activeSlide == i ? "active" : ""}`}
              onClick={() => {
                toggleActive(i);
              }}
            >
              <span className={"sr-only"}>Navigate to slide {i}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
