"use client";

import { useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  useMotionTemplate,
} from "framer-motion";
import { cn } from "@/lib/utils";

export const InteractiveCard = ({
  children,
  className,
  InteractiveColor = "#07eae6ff",
  borderRadius = "24px",
  rotationFactor = 0.4,
  transitionDuration = 0.3,
  transitionEasing = "easeInOut",
  tailwindBgClass = "bg-white/10 dark:bg-black/10 backdrop-blur-xl border border-white/20 dark:border-white/10",
}: {
  children: React.ReactNode;
  className?: string;
  InteractiveColor?: string;
  borderRadius?: string;
  rotationFactor?: number;
  transitionDuration?: number;
  transitionEasing?: string;
  tailwindBgClass?: string;
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateXTrans = useTransform(
    y,
    [0, 1],
    [rotationFactor * 15, -rotationFactor * 15]
  );
  const rotateYTrans = useTransform(
    x,
    [0, 1],
    [-rotationFactor * 15, rotationFactor * 15]
  );

  const handlePointerMove = (e: React.PointerEvent) => {
    const bounds = cardRef.current?.getBoundingClientRect();
    if (!bounds) return;

    const px = (e.clientX - bounds.left) / bounds.width;
    const py = (e.clientY - bounds.top) / bounds.height;

    x.set(px);
    y.set(py);
  };

  const xPercentage = useTransform(x, (val) => `${val * 100}%`);
  const yPercentage = useTransform(y, (val) => `${val * 100}%`);

  const interactiveBackground = useMotionTemplate`radial-gradient(circle at ${xPercentage} ${yPercentage}, ${InteractiveColor} 0%, transparent 80%)`;

  return (
    <motion.div
      ref={cardRef}
      onPointerMove={handlePointerMove}
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => setIsHovered(false)}
      style={{
        perspective: 1000,
        borderRadius,
      }}
      className={cn("relative w-full isolate", className)}
    >
      <motion.div
        style={{
          rotateX: rotateXTrans,
          rotateY: rotateYTrans,
          transformStyle: "preserve-3d",
          transition: `transform ${transitionDuration}s ${transitionEasing}`,
        }}
        className="w-full h-full rounded-xl overflow-hidden shadow-2xl"
      >
        {/* Background Interactive Layer */}
        <motion.div
          className="absolute inset-0 rounded-xl z-0"
          style={{
            background: interactiveBackground,
            transition: `opacity ${transitionDuration}s ${transitionEasing}`,
            opacity: isHovered ? 0.6 : 0,
            pointerEvents: "none",
          }}
        />

        {/* Content */}
        <div
          className={cn(
            "relative z-10 w-full h-full p-6",
            tailwindBgClass,
            "text-foreground"
          )}
          style={{
            borderRadius,
          }}
        >
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
};
