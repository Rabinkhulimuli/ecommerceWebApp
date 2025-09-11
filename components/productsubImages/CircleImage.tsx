'use client';
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

type Props = {
  images: { url: string }[];
  setSelectedImage: React.Dispatch<React.SetStateAction<string>>;
};

export default function ActivityPathCarousel({ images, setSelectedImage }: Props) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const pathRef = useRef<SVGPathElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const total = images.length;

  const [dimensions, setDimensions] = useState({ width: 400, height: 200 });
  const [pathLength, setPathLength] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const [imagePositions, setImagePositions] = useState<number[]>([]);
  const [gradientOffset, setGradientOffset] = useState(0);

  // Initialize component
  useEffect(() => {
    setIsMounted(true);
    // Initialize positions
    const positions = Array.from({ length: total }, (_, i) => i);
    setImagePositions(positions);
  }, [total]);

  // Update dimensions on resize
  useEffect(() => {
    if (!isMounted) return;

    const updateDimensions = () => {
      if (containerRef.current) {
        const { width } = containerRef.current.getBoundingClientRect();
        const calculatedWidth = Math.max(250, Math.min(500, width));
        const calculatedHeight = calculatedWidth * 0.5;
        setDimensions({ width: calculatedWidth, height: calculatedHeight });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [isMounted]);

  // Update path length after dimensions are set
  useEffect(() => {
    if (!isMounted || !pathRef.current) return;

    const timer = setTimeout(() => {
      const length = pathRef.current?.getTotalLength() || 0;
      setPathLength(length);
    }, 100);

    return () => clearTimeout(timer);
  }, [dimensions, isMounted]);

  // Animate gradient offset
  useEffect(() => {
    if (!isMounted) return;

    const interval = setInterval(() => {
      setGradientOffset(prev => (prev + 0.005) % 1);
    }, 50);

    return () => clearInterval(interval);
  }, [isMounted]);

  // Generate S-shaped path
  const getPathData = () => {
    const { width, height } = dimensions;
    const centerY = height / 2;
    const curveHeight = height * 0.4;

    return `M ${width * 0.1} ${centerY - curveHeight}
            C ${width * 0.3} ${centerY - curveHeight}, 
              ${width * 0.3} ${centerY + curveHeight}, 
              ${width * 0.5} ${centerY + curveHeight}
            C ${width * 0.7} ${centerY + curveHeight}, 
              ${width * 0.7} ${centerY - curveHeight}, 
              ${width * 0.9} ${centerY - curveHeight}`;
  };

  // Handle image selection
  const handleImageSelect = (index: number) => {
    if (index === selectedIndex) return;

    // Calculate new positions for all images
    const newPositions = [...imagePositions];
    const currentPosition = newPositions[index];

    // Move all images that are ahead of the selected one back one position
    for (let i = 0; i < total; i++) {
      if (newPositions[i] < currentPosition) {
        newPositions[i] += 1;
      }
    }

    // Set the selected image to position 0 (front of the train)
    newPositions[index] = 0;

    setImagePositions(newPositions);
    setSelectedIndex(index);
    setSelectedImage(images[index].url);
  };

  // Update the selected image when index changes
  useEffect(() => {
    if (images.length > 0) {
      setSelectedImage(images[selectedIndex].url);
    }
  }, [selectedIndex, images, setSelectedImage]);

  // Show loading state only initially
  if (!isMounted) {
    return (
      <div
        ref={containerRef}
        className='relative flex h-[200px] w-full items-center justify-center rounded-lg bg-gray-100'
      >
        <div className='text-gray-500'>Loading carousel...</div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className='relative mx-auto mb-8 w-full max-w-[500px]'
      style={{ height: `${dimensions.height}px`, minHeight: '150px' }}
    >
      {/* SVG Path */}
      <svg
        viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
        className='pointer-events-none absolute inset-0 h-full w-full'
        key={`svg-${dimensions.width}-${dimensions.height}`}
      >
        <defs>
          {/* Main path gradient */}
          <linearGradient id='pathGradient' x1='0%' y1='0%' x2='100%' y2='0%'>
            <stop offset='0%' stopColor='#3b82f6' />
            <stop offset='50%' stopColor='#6366f1' />
            <stop offset='100%' stopColor='#8b5cf6' />
          </linearGradient>

          {/* Animated glow gradient */}
          <linearGradient id='glowGradient' x1='0%' y1='0%' x2='100%' y2='0%'>
            <stop offset={gradientOffset} stopColor='#3b82f6' stopOpacity='0.8' />
            <stop offset={gradientOffset + 0.1} stopColor='#6366f1' stopOpacity='0.9' />
            <stop offset={gradientOffset + 0.2} stopColor='#8b5cf6' stopOpacity='0.8' />
            <stop offset={gradientOffset + 0.3} stopColor='#3b82f6' stopOpacity='0.7' />
            <stop offset={gradientOffset + 0.4} stopColor='#6366f1' stopOpacity='0.6' />
            <stop offset={gradientOffset + 0.5} stopColor='#8b5cf6' stopOpacity='0.5' />
            <stop offset={gradientOffset + 0.6} stopColor='#3b82f6' stopOpacity='0.4' />
            <stop offset={gradientOffset + 0.7} stopColor='#6366f1' stopOpacity='0.3' />
            <stop offset={gradientOffset + 0.8} stopColor='#8b5cf6' stopOpacity='0.2' />
            <stop offset={gradientOffset + 0.9} stopColor='#3b82f6' stopOpacity='0.1' />
          </linearGradient>

          {/* Glow filter */}
          <filter id='glow' x='-20%' y='-20%' width='140%' height='140%'>
            <feGaussianBlur stdDeviation='4' result='blur' />
            <feComposite in='SourceGraphic' in2='blur' operator='over' />
          </filter>
        </defs>

        {/* Background path with glow effect */}
        <path
          d={getPathData()}
          stroke='url(#glowGradient)'
          strokeWidth='8'
          fill='none'
          filter='url(#glow)'
          opacity='0.7'
        />

        {/* Main path */}
        <path
          ref={pathRef}
          d={getPathData()}
          stroke='url(#pathGradient)'
          strokeWidth='3'
          fill='none'
          strokeDasharray='6,4'
        />

        {/* Animated moving dot */}
        {pathLength > 0 && (
          <motion.circle
            cx={0}
            cy={0}
            r='4'
            fill='#fff'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <animateMotion dur='5s' repeatCount='indefinite' path={getPathData()} />
          </motion.circle>
        )}
      </svg>

      {/* Thumbnails */}
      {pathLength > 0 &&
        images.map((image, index) => {
          // Calculate position based on the image's position in the sequence
          const spacing = pathLength / total;
          const positionOffset = imagePositions[index] * spacing;
          const point = pathRef.current!.getPointAtLength(positionOffset);
          const isActive = index === selectedIndex;
          const thumbnailSize = dimensions.width * 0.1;

          return (
            <motion.button
              key={`${image.url}-${index}`}
              onClick={() => handleImageSelect(index)}
              initial={{
                x: point.x - thumbnailSize / 2,
                y: point.y - thumbnailSize / 2,
                scale: 0.8,
                opacity: 0,
              }}
              animate={{
                x: point.x - thumbnailSize / 2,
                y: point.y - thumbnailSize / 2,
                scale: isActive ? 1.1 : 0.9,
                opacity: 1,
              }}
              transition={{
                duration: 0.7,
                ease: 'easeOut',
              }}
              className={`absolute overflow-hidden rounded-full border-2 shadow-lg ${
                isActive ? 'z-20 border-blue-500 shadow-xl' : 'z-10 border-gray-300'
              }`}
              style={{
                width: `${thumbnailSize}px`,
                height: `${thumbnailSize}px`,
              }}
              whileHover={{ scale: 1.05 }}
            >
              <Image
                src={image.url || '/placeholder.svg'}
                alt={`Image ${index + 1}`}
                fill
                className='object-cover'
                sizes='(max-width: 768px) 50px, 64px'
              />
              {isActive && <div className='absolute inset-0 rounded-full border-2 border-white' />}
            </motion.button>
          );
        })}

      {/* Navigation Dots */}
      <div className='absolute bottom-2 left-1/2 z-30 flex -translate-x-1/2 transform space-x-2'>
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => handleImageSelect(index)}
            className={`h-2 w-2 rounded-full transition-all duration-300 ${
              index === selectedIndex ? 'scale-125 bg-blue-500' : 'bg-gray-300'
            }`}
            aria-label={`Go to image ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
