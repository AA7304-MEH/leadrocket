import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface ArcMeterProps {
  score: number;
  size?: number;
  strokeWidth?: number;
}

export default function ArcMeter({ score, size = 200, strokeWidth = 15 }: ArcMeterProps) {
  const [displayScore, setDisplayScore] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const arcLength = circumference * 0.75; // 270 degree arc
  const offset = arcLength - (score / 100) * arcLength;

  useEffect(() => {
    let frameId: number;
    const start = displayScore;
    const end = score;
    const duration = 1000;
    let startTime: number | null = null;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const current = start + (end - start) * progress;
      setDisplayScore(current);

      if (progress < 1) {
        frameId = requestAnimationFrame(animate);
      }
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [score]);

  const getColor = (s: number) => {
    if (s <= 40) return "#EF4444"; // Red
    if (s <= 70) return "#F59E0B"; // Amber
    return "#10B981"; // Success Green
  };

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-[225deg]">
        {/* Background Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={`${arcLength} ${circumference}`}
          strokeLinecap="round"
          className="text-white/5"
        />
        {/* Active Progress */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke={getColor(displayScore)}
          strokeWidth={strokeWidth}
          strokeDasharray={`${arcLength} ${circumference}`}
          initial={{ strokeDashoffset: arcLength }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeOut" }}
          strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 8px ${getColor(displayScore)}40)` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-5xl font-black tracking-tighter" style={{ color: getColor(displayScore) }}>
          {Math.round(displayScore)}
        </span>
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mt-1">
          Predicted Success
        </span>
      </div>
    </div>
  );
}
