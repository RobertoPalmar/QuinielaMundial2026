"use client";

import { useEffect, useState } from "react";

/**
 * Botón flotante (abajo-derecha) que aparece al hacer scroll hacia abajo
 * y devuelve la vista al inicio de la página con scroll suave.
 */
export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 320);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      aria-label="Volver arriba"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={`fixed bottom-5 right-5 z-50 grid place-items-center w-12 h-12 rounded-full
        text-on-primary bg-gradient-to-br from-primary to-primary-dark
        shadow-[0_8px_24px_rgba(37,99,235,0.4)] hover:brightness-110 active:scale-95
        transition-all duration-300 ${
          visible ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-3 pointer-events-none"
        }`}
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 15l-6-6-6 6" />
      </svg>
    </button>
  );
}
