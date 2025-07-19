import { useEffect, useRef } from "react";

// Creates sparkles and floating ribbons
function BackgroundDecorations() {
  const containerRef = useRef();

  useEffect(() => {
    const container = containerRef.current;

    // Clear existing children on remount
    container.innerHTML = "";

    // Generate sparkles
    for (let i = 0; i < 30; i++) {
      const sparkle = document.createElement("div");
      sparkle.className = "sparkle";
      sparkle.style.left = `${Math.random() * 100}%`;
      sparkle.style.top = `${Math.random() * 100}%`;
      sparkle.style.animationDelay = `${Math.random() * 5}s`;
      container.appendChild(sparkle);
    }

    // Generate floating ribbons with elegant tone
    const ribbonColors = [
      "linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.05))", // subtle white
      "linear-gradient(135deg, rgba(255, 215, 128, 0.4), rgba(255, 165, 0, 0.2))",    // soft amber
      "linear-gradient(135deg, rgba(194, 151, 70, 0.3), rgba(255, 222, 130, 0.1))"    // bronze-gold
    ];

    for (let i = 0; i < 5; i++) {
      const ribbon = document.createElement("div");
      ribbon.className = "ribbon";
      ribbon.style.left = `${Math.random() * 100}%`;
      ribbon.style.animationDelay = `${Math.random() * 10}s`;
      ribbon.style.background = ribbonColors[i % ribbonColors.length];
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
