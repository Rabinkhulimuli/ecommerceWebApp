'use client';
import { useEffect, useState } from 'react';

export default function NightSky() {
  const [shootingStars, setShootingStars] = useState<number[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setShootingStars(prev => [...prev, Date.now()]);
      setTimeout(() => {
        setShootingStars(prev => prev.slice(1));
      }, 2000); // remove after animation
    }, 5000); // every 5s a shooting star

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="sky mb-5 rounded-sm bg-[url('/sky/nightsky.png')]">
      {/* Moon */}
      <div className='moon'></div>

      {/* Twinkling Stars */}
      <div className='star tiny' style={{ top: '50px', left: '200px', animationDelay: '1s' }}></div>
      <div
        className='star small'
        style={{ top: '120px', left: '350px', animationDelay: '2s' }}
      ></div>
      <div
        className='star medium'
        style={{ top: '250px', left: '500px', animationDelay: '0.5s' }}
      ></div>
      <div
        className='star tiny'
        style={{ top: '400px', left: '700px', animationDelay: '3s' }}
      ></div>
      <div
        className='star small'
        style={{ top: '180px', left: '900px', animationDelay: '1.5s' }}
      ></div>
      <div
        className='star tiny'
        style={{ top: '320px', left: '1100px', animationDelay: '2.5s' }}
      ></div>

      {/* Shooting Stars */}
      {shootingStars.map(id => {
        const randomLeft = Math.floor(Math.random() * window.innerWidth);
        const randomTop = Math.floor(Math.random() * (window.innerHeight / 3));

        return (
          <div key={id} className='shooting-star' style={{ top: randomTop, left: randomLeft }} />
        );
      })}
    </div>
  );
}
