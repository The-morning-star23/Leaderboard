import { useEffect, useRef } from "react";

// Creates multiple sparkles and floating ribbons in background
function BackgroundDecorations() {
  const containerRef = useRef();

  useEffect(() => {
    const container = containerRef.current;

    // Generate sparkles
    for (let i = 0; i < 30; i++) {
      const sparkle = document.createElement("div");
      sparkle.className = "sparkle";
      sparkle.style.left = `${Math.random() * 100}%`;
      sparkle.style.top = `${Math.random() * 100}%`;
      sparkle.style.animationDelay = `${Math.random() * 5}s`;
      container.appendChild(sparkle);
    }

    // Generate floating ribbons
    for (let i = 0; i < 5; i++) {
      const ribbon = document.createElement("div");
      ribbon.className = "ribbon";
      ribbon.style.left = `${Math.random() * 100}%`;
      ribbon.style.animationDelay = `${Math.random() * 10}s`;
      container.appendChild(ribbon);
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 -z-10 pointer-events-none overflow-hidden"
    />
  );
}

export default BackgroundDecorations;
