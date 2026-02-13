import React, { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";

export default function NotFoundPage() {
  const titleRef = useRef(null);
  const linkRef = useRef(null);

  useEffect(() => {
    if (titleRef.current) {
      gsap.fromTo(titleRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" });
    }
    if (linkRef.current) {
      gsap.fromTo(linkRef.current, { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, delay: 0.2, ease: "power2.out" });
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-[var(--color-bg)]">
      <p ref={titleRef} className="text-8xl md:text-9xl font-bold text-[var(--color-primary)]/30 select-none">
        404
      </p>
      <p className="mt-4 text-xl text-[var(--color-text-muted)] text-center">
        Page not found
      </p>
      <Link
        ref={linkRef}
        to="/dashboard"
        className="mt-8 px-6 py-3 rounded-[var(--radius)] bg-[var(--color-primary)] text-white font-medium hover:bg-[var(--color-primary-hover)] transition-colors"
      >
        Go to Dashboard
      </Link>
    </div>
  );
}
