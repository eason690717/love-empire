"use client";

import type { Attribute } from "@/lib/types";

interface Props {
  attrs: Record<Attribute, number>;
  size?: number;
}

const ORDER: Attribute[] = ["intimacy", "communication", "romance", "care", "surprise"];
const LABELS: Record<Attribute, string> = {
  intimacy: "親密",
  communication: "溝通",
  romance: "浪漫",
  care: "照顧",
  surprise: "驚喜",
};

export function AttributeRadar({ attrs, size = 260 }: Props) {
  const cx = size / 2;
  const cy = size / 2;
  const maxR = size * 0.38;
  const rings = [0.25, 0.5, 0.75, 1];

  // 5 軸的角度：從正上方開始，逆時針
  const angles = ORDER.map((_, i) => -Math.PI / 2 + (i * 2 * Math.PI) / ORDER.length);

  const point = (attr: Attribute, scale: number) => {
    const idx = ORDER.indexOf(attr);
    const angle = angles[idx];
    const r = maxR * scale;
    return [cx + Math.cos(angle) * r, cy + Math.sin(angle) * r];
  };

  const polyPoints = ORDER.map((a) => {
    const val = Math.max(0, Math.min(100, attrs[a] ?? 0)) / 100;
    const [x, y] = point(a, val);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="mx-auto">
      <defs>
        <radialGradient id="radar-fill" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#ffc1d6" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#8fcff5" stopOpacity="0.35" />
        </radialGradient>
      </defs>

      {/* 同心圓 */}
      {rings.map((ring) => (
        <polygon
          key={ring}
          points={ORDER.map((a) => {
            const [x, y] = point(a, ring);
            return `${x.toFixed(1)},${y.toFixed(1)}`;
          }).join(" ")}
          fill="none"
          stroke="#d8eefd"
          strokeWidth={1}
        />
      ))}

      {/* 軸線 */}
      {ORDER.map((a) => {
        const [x, y] = point(a, 1);
        return <line key={a} x1={cx} y1={cy} x2={x} y2={y} stroke="#d8eefd" strokeWidth={1} />;
      })}

      {/* 資料多邊形 */}
      <polygon
        points={polyPoints}
        fill="url(#radar-fill)"
        stroke="#ff7fa1"
        strokeWidth={2.5}
        strokeLinejoin="round"
      />

      {/* 節點 */}
      {ORDER.map((a) => {
        const val = Math.max(0, Math.min(100, attrs[a] ?? 0)) / 100;
        const [x, y] = point(a, val);
        return <circle key={a} cx={x} cy={y} r={4} fill="#ff7fa1" stroke="#fff" strokeWidth={1.5} />;
      })}

      {/* 標籤 */}
      {ORDER.map((a) => {
        const [x, y] = point(a, 1.18);
        return (
          <g key={a}>
            <text
              x={x}
              y={y - 4}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={13}
              fontWeight={700}
              fill="#2d4f6a"
            >
              {LABELS[a]}
            </text>
            <text
              x={x}
              y={y + 11}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={11}
              fill="#6b8ca7"
            >
              {attrs[a]}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
