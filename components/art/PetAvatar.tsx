"use client";

import Image from "next/image";
import { motion } from "framer-motion";

/**
 * 寵物頭像 — 依 stage 載入對應 SVG
 * stages 0 蛋 / 1 幼體 / 2 成型 / 3 傳說 / 4 神話
 */
interface Props {
  stage: 0 | 1 | 2 | 3 | 4;
  size?: number;
  animate?: boolean;
  className?: string;
}

const LABELS = ["蛋", "幼體", "成型", "傳說", "神話"] as const;

export function PetAvatar({ stage, size = 120, animate = true, className = "" }: Props) {
  const src = `/art/pet/stage-${stage}.svg`;
  const content = (
    <Image
      src={src}
      alt={`寵物 · ${LABELS[stage]}階段`}
      width={size}
      height={size}
      priority={stage <= 1}
      style={{ width: size, height: size }}
      unoptimized
    />
  );

  if (!animate) return <div className={className}>{content}</div>;

  return (
    <motion.div
      className={`inline-block ${className}`}
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
    >
      {content}
    </motion.div>
  );
}

export const PET_STAGE_LABEL = LABELS;
