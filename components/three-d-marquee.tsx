"use client";

import { motion } from "framer-motion";
import React from "react";

export interface MarqueeImage {
  src: string;
  alt: string;
  href?: string;
  target?: "_blank" | "_self" | "_parent" | "_top";
}

export interface ThreeDMarqueeProps {
  images: MarqueeImage[];
  className?: string;
  cols?: number; // default is 4
  onImageClick?: (image: MarqueeImage, index: number) => void;
}

export const ThreeDMarquee: React.FC<ThreeDMarqueeProps> = ({
  images,
  className = "",
  cols = 4,
  onImageClick,
}) => {
  // Clone the image list twice
  const duplicatedImages = [...images, ...images];

  const groupSize = Math.ceil(duplicatedImages.length / cols);
  const imageGroups = Array.from({ length: cols }, (_, index) =>
    duplicatedImages.slice(index * groupSize, (index + 1) * groupSize)
  );

  const handleImageClick = (image: MarqueeImage, globalIndex: number) => {
    if (onImageClick) {
      onImageClick(image, globalIndex);
    } else if (image.href) {
      window.open(image.href, image.target || "_self");
    }
  };

  return (
    <section
      className={`mx-auto block h-[600px] max-sm:h-[400px] 
        overflow-hidden rounded-3xl bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 shadow-2xl ${className}`}
    >
      <div
        className="flex w-full h-full items-center justify-center p-8"
        style={{
          transform: "rotateX(55deg) rotateY(0deg) rotateZ(45deg)",
          transformStyle: "preserve-3d",
        }}
      >
        <div className="w-full overflow-hidden scale-90 sm:scale-100">
          <div
            className="relative grid h-full w-full origin-center gap-6"
            style={{
              gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
            }}
          >
            {imageGroups.map((imagesInGroup, idx) => (
              <motion.div
                key={`column-${idx}`}
                animate={{ y: idx % 2 === 0 ? [0, 100, 0] : [0, -100, 0] }}
                transition={{
                  duration: idx % 2 === 0 ? 20 : 25,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="flex flex-col items-center gap-8 relative"
              >
                {imagesInGroup.map((image, imgIdx) => {
                  const globalIndex = idx * groupSize + imgIdx;
                  const isClickable = image.href || onImageClick;

                  return (
                    <motion.div 
                      key={`img-${imgIdx}`} 
                      className="relative group"
                      whileHover={{ scale: 1.05, z: 50 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                    >
                      <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl opacity-0 group-hover:opacity-75 blur transition-opacity duration-300" />
                      <motion.img
                        src={image.src}
                        alt={image.alt}
                        width={970}
                        height={700}
                        className={`relative aspect-[4/3] w-full max-w-[220px] rounded-xl object-cover shadow-2xl border-2 border-white/20 dark:border-gray-700/50 ${
                          isClickable ? "cursor-pointer" : ""
                        }`}
                        onClick={() => handleImageClick(image, globalIndex)}
                      />
                      {isClickable && (
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl flex items-center justify-center">
                          <div className="bg-white/90 dark:bg-gray-800/90 p-3 rounded-full">
                            <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                            </svg>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ThreeDMarquee;
