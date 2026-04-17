import type { Config } from "tailwindcss";

// 融合 DNA：
// 動森 → 柔和粉彩 + 圓角 + 天空草地漸層 (sky / leaf / rose)
// 寶可夢 → 徽章光暈 + 稀有度閃光 + 對比金 (sunshine / berry)
// 皮克敏 → 自然嫩芽 + 四原色 (orange / sprout / azure / crimson)
const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        empire: {
          // 背景 / 基調
          sky:      "#8fcff5", // 動森天空
          cloud:    "#e6f3fc",
          mist:     "#f6fbff",
          grass:    "#8ed172", // 皮克敏草綠
          leaf:     "#cfe9b4", // 嫩葉
          cream:    "#fff5e0",
          // 主題 / 強調
          rose:     "#ffc1d6", // 動森粉彩粉
          berry:    "#ff7fa1", // 寶可夢戀愛紅
          sunshine: "#ffd447", // 寶可夢徽章金
          orange:   "#ff9052", // 皮克敏橘
          sprout:   "#6cba3d", // 皮克敏苗綠
          azure:    "#5aa4ff", // 皮克敏藍
          crimson:  "#ff4f60",
          // 字
          ink:      "#2d4f6a",
          mute:     "#6b8ca7",
          // 稀有度
          n:        "#b4c3d4",
          r:        "#7cc2f3",
          sr:       "#d280ff",
          ssr:      "#ffd447",
        },
      },
      fontFamily: {
        sans: ["'Noto Sans TC'", "'Rounded Mplus 1c'", "system-ui", "sans-serif"],
        display: ["'M PLUS Rounded 1c'", "'Noto Sans TC'", "sans-serif"],
      },
      boxShadow: {
        card: "0 6px 20px rgba(58, 102, 148, 0.08)",
        lift: "0 12px 28px rgba(58, 102, 148, 0.15)",
        glow: "0 0 30px rgba(255, 180, 220, 0.55)",
        emblem: "0 4px 0 #1a3a56",
        "emblem-sm": "0 3px 0 #1a3a56",
        sprout: "0 4px 0 #4a8128",
      },
      borderRadius: {
        bubble: "28px",
      },
      animation: {
        "float-slow": "float-slow 3.6s ease-in-out infinite",
        "bob": "bob 2.4s ease-in-out infinite",
        "shimmer": "shimmer 2.5s linear infinite",
        "rainbow": "rainbow 3.6s linear infinite",
        "pop": "pop 0.45s ease-out",
        "sparkle": "sparkle 1.6s ease-in-out infinite",
      },
      keyframes: {
        "float-slow": {
          "0%, 100%": { transform: "translateY(0) rotate(0)" },
          "50%": { transform: "translateY(-8px) rotate(2deg)" },
        },
        bob: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        rainbow: {
          "0%": { filter: "hue-rotate(0deg)" },
          "100%": { filter: "hue-rotate(360deg)" },
        },
        pop: {
          "0%": { transform: "scale(0.85)", opacity: "0.5" },
          "70%": { transform: "scale(1.08)" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        sparkle: {
          "0%, 100%": { opacity: "0.3", transform: "scale(0.9)" },
          "50%": { opacity: "1", transform: "scale(1.2)" },
        },
      },
      backgroundImage: {
        "sky-grass": "linear-gradient(180deg, #bfe3f9 0%, #d8eefd 45%, #e7f4d5 60%, #cfe9b4 100%)",
        "emblem-gold": "radial-gradient(circle at 30% 30%, #ffe38a 0%, #ffb547 55%, #e8902a 100%)",
        "ssr-rainbow": "linear-gradient(110deg, #fff1c4, #ffb8de, #b8d8ff, #b8ffca, #fff1c4)",
      },
    },
  },
  plugins: [],
};

export default config;
