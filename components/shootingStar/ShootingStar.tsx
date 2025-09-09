"use client";
import { useEffect, useState } from "react";

export default function ShootingStars() {
  const [stars, setStars] = useState<number[]>([]);

  useEffect(() => {
    // Generate random shooting stars
    const interval = setInterval(() => {
      setStars((prev) => [...prev, Date.now()]);
      setTimeout(() => {
        setStars((prev) => prev.slice(1));
      }, 3000); // remove after animation
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="starry-background">
      {stars.map((id) => {
        const randomLeft = Math.floor(Math.random() * window.innerWidth);
        const randomTop = Math.floor(Math.random() * (window.innerHeight / 2));

        return (
          <div
            key={id}
            className="shooting-star"
            style={{ top: randomTop, left: randomLeft }}
          />
        );
      })}
    </div>
  );
}
