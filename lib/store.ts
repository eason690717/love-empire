"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  Couple, Task, Submission, Reward, Redemption, MemoryCard, Pet, IslandItem,
  Ritual, Streak, CoupleSummary, Alliance, Friendship, Gift, Moment, MomentType, PikminHelper,
} from "./types";
import { CATEGORY_META } from "./types";
import { QUEEN_COIN_BONUS, isSpecialDay, SPECIAL_DAY_MULTIPLIER } from "./passive";
import { inFestivalWindow, PIKMIN_BY_CATEGORY, getTodayVisitor } from "./festival";
import {
  INITIAL_COUPLE, INITIAL_TASKS, INITIAL_SUBMISSIONS, INITIAL_REWARDS, INITIAL_REDEMPTIONS,
  INITIAL_CODEX, INITIAL_PET, INITIAL_ISLAND, INITIAL_RITUAL, INITIAL_STREAK,
  LEADERBOARD, ALLIANCES, FRIEND_COUPLES, GIFT_INBOX, NOTICE, INITIAL_MOMENTS,
} from "./demoData";

type Role = "queen" | "prince";

interface State {
  loggedIn: boolean;
  role: Role;
  onboardingStep: number; // 0 = not started, 1..N = current step, -1 = finished/skipped
  couple: Couple;
  tasks: Task[];
  submissions: Submission[];
  rewards: Reward[];
  redemptions: Redemption[];
  codex: MemoryCard[];
  pet: Pet;
  island: IslandItem[];
  ritual: Ritual;
  streak: Streak;
  leaderboard: CoupleSummary[];
  alliances: Alliance[];
  friends: Friendship[];
  gifts: Gift[];
  moments: Moment[];
  pikmins: PikminHelper[];
  lastVisitorGreetDate: string;
  notice: typeof NOTICE;

  login: (role: Role) => void;
  logout: () => void;
  setNickname: (role: Role, nickname: string) => void;
  setKingdomName: (name: string) => void;
  addCustomTask: (t: Omit<Task, "id" | "systemXp" | "custom">) => void;
  removeTask: (id: string) => void;
  addMoment: (m: Omit<Moment, "id" | "createdAt" | "likes" | "likedByMe" | "comments" | "coupleId" | "coupleName" | "isSelf">) => void;
  likeMoment: (id: string) => void;
  advanceOnboarding: () => void;
  skipOnboarding: () => void;
  resetOnboarding: () => void;
  greetVisitor: () => { success: boolean; reward?: string };
  submitTask: (taskId: string) => void;
  reviewSubmission: (id: string, approve: boolean, note?: string) => void;
  redeem: (rewardId: string) => void;
  useRedemption: (id: string) => void;
  feedPet: (attr: keyof Pet["attrs"]) => void;
  toggleRitual: (kind: "morning" | "night") => void;
  moveIslandItem: (id: string, x: number, y: number) => void;
  buyIslandItem: (catalogId: string, label: string, emoji: string, price: number) => void;
  removeIslandItem: (id: string) => void;
  sendGift: (toCoupleName?: string, message?: string) => void;
  sendCardGift: (cardId: string, toCoupleId: string, toCoupleName: string, message: string) => void;
  joinAlliance: (id: string) => void;
  attackBoss: (allianceId: string, damage: number) => void;
}

const uid = () => Math.random().toString(36).slice(2, 10);
const nowStr = () => new Date().toLocaleString("zh-TW");

function getIsoWeek(d: Date): string {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((+date - +yearStart) / 86400000 + 1) / 7);
  return `${date.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
}

export const useGame = create<State>()(
  persist(
    (set, get) => ({
      loggedIn: false,
      role: "queen",
      onboardingStep: 0,
      couple: INITIAL_COUPLE,
      tasks: INITIAL_TASKS,
      submissions: INITIAL_SUBMISSIONS,
      rewards: INITIAL_REWARDS,
      redemptions: INITIAL_REDEMPTIONS,
      codex: INITIAL_CODEX,
      pet: INITIAL_PET,
      island: INITIAL_ISLAND,
      ritual: INITIAL_RITUAL,
      streak: INITIAL_STREAK,
      leaderboard: LEADERBOARD,
      alliances: ALLIANCES,
      friends: FRIEND_COUPLES,
      gifts: GIFT_INBOX,
      moments: INITIAL_MOMENTS,
      pikmins: [],
      lastVisitorGreetDate: "",
      notice: NOTICE,

      login: (role) => set({ loggedIn: true, role }),
      logout: () => set({ loggedIn: false }),

      setNickname: (role, nickname) => {
        const clean = nickname.trim().slice(0, 20);
        if (!clean) return;
        const couple = get().couple;
        set({
          couple: {
            ...couple,
            [role]: { ...couple[role], nickname: clean },
          },
        });
      },

      setKingdomName: (name) => {
        const clean = name.trim().slice(0, 20);
        if (!clean) return;
        set({ couple: { ...get().couple, name: clean } });
      },

      addCustomTask: (t) => {
        const meta = CATEGORY_META[t.category];
        const cappedReward = Math.max(0, Math.min(meta.rewardCap, Math.floor(t.reward)));
        const newTask: Task = {
          id: `custom_${uid()}`,
          title: t.title.trim().slice(0, 40),
          category: t.category,
          reward: cappedReward,
          systemXp: meta.xp,           // 系統決定，無法自訂
          attribute: t.attribute,
          direction: t.direction,
          custom: true,
        };
        if (!newTask.title) return;
        set({ tasks: [...get().tasks, newTask] });
      },

      removeTask: (id) => {
        const t = get().tasks.find((x) => x.id === id);
        if (!t?.custom) return; // 系統預設任務不可刪除
        set({ tasks: get().tasks.filter((x) => x.id !== id) });
      },

      addMoment: (m) => {
        const couple = get().couple;
        const moment: Moment = {
          id: uid(),
          coupleId: couple.id,
          coupleName: couple.name,
          createdAt: nowStr(),
          likes: 0,
          likedByMe: false,
          comments: 0,
          isSelf: true,
          ...m,
        };
        set({ moments: [moment, ...get().moments] });
      },

      likeMoment: (id) => {
        set({
          moments: get().moments.map((m) =>
            m.id === id
              ? { ...m, likedByMe: !m.likedByMe, likes: m.likes + (m.likedByMe ? -1 : 1) }
              : m,
          ),
        });
      },

      advanceOnboarding: () => {
        const step = get().onboardingStep;
        if (step === 0) set({ onboardingStep: 1 });
        else if (step < 0) set({ onboardingStep: 1 });
        else set({ onboardingStep: step + 1 });
      },
      skipOnboarding: () => set({ onboardingStep: -1 }),
      resetOnboarding: () => set({ onboardingStep: 0 }),

      greetVisitor: () => {
        const today = new Date().toISOString().slice(0, 10);
        if (get().lastVisitorGreetDate === today) {
          return { success: false };
        }
        const v = getTodayVisitor();
        if (v.gift.type === "coins") {
          set({ couple: { ...get().couple, coins: get().couple.coins + v.gift.amount } });
        } else if (v.gift.type === "xp") {
          const nextLove = get().couple.loveIndex + v.gift.amount;
          const nextLevel = Math.max(get().couple.kingdomLevel, Math.floor(nextLove / 50) + 1);
          set({ couple: { ...get().couple, loveIndex: nextLove, kingdomLevel: nextLevel } });
        } else if (v.gift.type === "card") {
          const locked = get().codex.find((c) => c.festival && !c.obtainedAt && inFestivalWindow(c));
          if (locked) {
            set({
              codex: get().codex.map((c) =>
                c.id === locked.id ? { ...c, obtainedAt: new Date().toISOString().slice(0, 10) } : c,
              ),
            });
          }
        }
        set({ lastVisitorGreetDate: today });
        return { success: true, reward: v.gift.label };
      },

      submitTask: (taskId) => {
        const t = get().tasks.find((x) => x.id === taskId);
        if (!t) return;
        const sub: Submission = {
          id: uid(),
          taskId,
          taskTitle: t.title,
          reward: t.reward,
          submittedBy: get().role,
          status: "pending",
          createdAt: nowStr(),
        };
        set({ submissions: [sub, ...get().submissions] });
      },

      reviewSubmission: (id, approve, note) => {
        const subs = get().submissions.map((s) =>
          s.id === id ? { ...s, status: approve ? ("approved" as const) : ("rejected" as const), reviewedAt: nowStr(), note } : s,
        );
        set({ submissions: subs });
        if (approve) {
          const s = subs.find((x) => x.id === id)!;
          const task = get().tasks.find((t) => t.id === s.taskId);
          const attr = task?.attribute ?? "intimacy";
          const baseXp = task?.systemXp ?? 5;

          // 皮克敏 DNA：特別日雙倍 XP
          const xpMultiplier = isSpecialDay() ? SPECIAL_DAY_MULTIPLIER : 1;
          const systemXp = baseXp * xpMultiplier;

          // 王妃被動：溫柔光環 — 金幣 +10% (只在申報者是王妃時)
          const queenBonus = s.submittedBy === "queen" ? QUEEN_COIN_BONUS : 0;
          const finalCoins = Math.round(s.reward * (1 + queenBonus));

          const prevLove = get().couple.loveIndex;
          const prevLevel = get().couple.kingdomLevel;
          const nextLove = prevLove + systemXp;
          const nextLevel = Math.max(prevLevel, Math.floor(nextLove / 50) + 1);
          set({
            couple: {
              ...get().couple,
              coins: get().couple.coins + finalCoins,
              loveIndex: nextLove,
              kingdomLevel: nextLevel,
            },
            pet: {
              ...get().pet,
              attrs: { ...get().pet.attrs, [attr]: Math.min(100, get().pet.attrs[attr] + 2) },
              lastFedAt: new Date().toISOString(),
            },
          });

          // 升等自動發動態
          if (nextLevel > prevLevel) {
            get().addMoment({
              type: "level_up",
              title: `王國升至 Lv.${nextLevel}`,
              subtitle: `累積愛意指數 ${nextLove} ✨`,
              emoji: "👑",
            });
          }

          // 隨機掉落記憶卡（節日卡僅在節日窗口內才能掉）
          const uncollected = get().codex.filter(
            (c) => !c.obtainedAt && inFestivalWindow(c),
          );
          // 節日窗口內節日卡掉落率 +50%
          const festivalBoost = uncollected.some((c) => c.festival) ? 0.6 : 0.4;
          if (uncollected.length && Math.random() < festivalBoost) {
            // 節日窗口內，節日卡優先挑
            const festivalCards = uncollected.filter((c) => c.festival);
            const pool = festivalCards.length && Math.random() < 0.5 ? festivalCards : uncollected;
            const pick = pool[Math.floor(Math.random() * pool.length)];
            set({
              codex: get().codex.map((c) =>
                c.id === pick.id ? { ...c, obtainedAt: new Date().toISOString().slice(0, 10) } : c,
              ),
            });
            if (pick.rarity === "SSR" || pick.rarity === "SR") {
              get().addMoment({
                type: pick.rarity === "SSR" ? "ssr_card" : "sr_card",
                title: `抽到 ${pick.rarity} 記憶卡`,
                subtitle: `「${pick.name}」${pick.emoji} 入手！`,
                emoji: pick.emoji,
              });
            }
          }

          // 產生 Pikmin 助手（任務類別 → 對應顏色，每 5 個任務生成 1 個）
          const pik = PIKMIN_BY_CATEGORY[task?.category ?? "chore"];
          if (pik) {
            const existing = get().pikmins.find((p) => p.color === pik.color);
            if (existing) {
              set({
                pikmins: get().pikmins.map((p) =>
                  p.color === pik.color ? { ...p, count: p.count + 1 } : p,
                ),
              });
            } else {
              set({ pikmins: [...get().pikmins, { ...pik, count: 1 }] });
            }
          }
        }
      },

      redeem: (rewardId) => {
        const r = get().rewards.find((x) => x.id === rewardId);
        if (!r) return;
        if (get().couple.coins < r.cost) return;
        const redemption: Redemption = {
          id: uid(),
          rewardId: r.id,
          rewardTitle: r.title,
          cost: r.cost,
          redeemedBy: get().role,
          status: "unused",
          createdAt: new Date().toLocaleDateString("zh-TW"),
        };
        set({
          redemptions: [redemption, ...get().redemptions],
          couple: { ...get().couple, coins: get().couple.coins - r.cost },
        });
        // 貴重獎勵 (>= 500 金幣) 自動發動態
        if (r.cost >= 500) {
          get().addMoment({
            type: "custom",
            title: `兌換大獎：${r.title}`,
            subtitle: `花了 ${r.cost} 金幣，物超所值 ✨`,
            emoji: r.icon,
          });
        }
      },

      useRedemption: (id) =>
        set({
          redemptions: get().redemptions.map((r) =>
            r.id === id ? { ...r, status: "used" } : r,
          ),
        }),

      feedPet: (attr) => {
        const prev = get().pet;
        const nextAttrVal = Math.min(100, prev.attrs[attr] + 5);
        const nextAttrs = { ...prev.attrs, [attr]: nextAttrVal };
        const avg = Object.values(nextAttrs).reduce((a, b) => a + b, 0) / 5;
        let nextStage: Pet["stage"] = prev.stage;
        if (avg >= 95) nextStage = 4;
        else if (avg >= 85) nextStage = 3;
        else if (avg >= 65) nextStage = 2;
        else if (avg >= 40) nextStage = 1;
        set({
          pet: {
            ...prev,
            attrs: nextAttrs,
            stage: nextStage,
            lastFedAt: new Date().toISOString(),
          },
        });
        // 進化自動發動態
        if (nextStage > prev.stage) {
          const stageName = ["蛋", "幼體", "成型", "傳說", "神話"][nextStage];
          get().addMoment({
            type: "pet_evolve",
            title: `寵物進化為「${stageName}」`,
            subtitle: `${prev.name} 蛻變中 ✨`,
            emoji: ["🥚", "🐣", "🐥", "🦄", "🌟"][nextStage],
          });
        }
      },

      toggleRitual: (kind) => {
        const today = new Date().toISOString().slice(0, 10);
        const r = get().ritual.date === today ? get().ritual : { date: today, morning: false, night: false };
        const next = { ...r, [kind]: !r[kind] };
        set({ ritual: next });
        if (next.morning || next.night) {
          set({ couple: { ...get().couple, coins: get().couple.coins + 5 } });
        }
        // 早晚儀式都達成 + 今天第一次完成 → 連擊 +1 + 里程碑檢查
        if (next.morning && next.night) {
          const s = get().streak;
          // 騎士盾牌週重置
          const isoWeek = getIsoWeek(new Date());
          const shieldsReset = s.knightShieldsResetWeek !== isoWeek;
          const baseShields = shieldsReset ? 1 : (s.knightShields ?? 0);

          if (s.lastDate !== today) {
            const prev = s.current;
            const nextCurrent = prev + 1;
            set({
              streak: {
                ...s,
                current: nextCurrent,
                longest: Math.max(s.longest, nextCurrent),
                lastDate: today,
                knightShields: baseShields,
                knightShieldsResetWeek: isoWeek,
              },
            });
            if ([7, 14, 30, 60, 100, 200, 365].includes(nextCurrent)) {
              get().addMoment({
                type: "streak",
                title: `連擊達 ${nextCurrent} 天！`,
                subtitle: `不間斷的每日甜蜜 🔥`,
                emoji: "🔥",
              });
            }
          }
        }
      },

      moveIslandItem: (id, x, y) =>
        set({
          island: get().island.map((it) => (it.id === id ? { ...it, x, y } : it)),
        }),

      buyIslandItem: (catalogId, label, emoji, price) => {
        if (get().couple.coins < price) return;
        set({
          couple: { ...get().couple, coins: get().couple.coins - price },
          island: [
            ...get().island,
            { id: uid(), catalogId, label, emoji, x: 50, y: 50 },
          ],
        });
      },

      removeIslandItem: (id) =>
        set({ island: get().island.filter((it) => it.id !== id) }),

      sendGift: (toCoupleName, message) =>
        set({
          gifts: [
            {
              id: uid(),
              fromCoupleName: toCoupleName ?? get().couple.name,
              type: "card",
              content: "✨ 送出一張心意",
              message: message ?? "謝謝你陪我",
              receivedAt: new Date().toLocaleDateString("zh-TW"),
              read: false,
            },
            ...get().gifts,
          ],
        }),

      sendCardGift: (cardId, toCoupleId, toCoupleName, message) => {
        const card = get().codex.find((c) => c.id === cardId && c.obtainedAt);
        if (!card) return;
        // 送出卡片 = 從自己圖鑑移除 (送禮有代價)
        set({
          codex: get().codex.map((c) => (c.id === cardId ? { ...c, obtainedAt: null } : c)),
          gifts: [
            {
              id: uid(),
              fromCoupleName: get().couple.name,
              type: "card",
              content: `${card.emoji} ${card.name} (${card.rarity})`,
              message: `送給「${toCoupleName}」：${message || "祝你們幸福"}`,
              receivedAt: new Date().toLocaleDateString("zh-TW"),
              read: false,
            },
            ...get().gifts,
          ],
        });
        // 送 SR/SSR 卡自動發動態
        if (card.rarity === "SR" || card.rarity === "SSR") {
          get().addMoment({
            type: "custom",
            title: `送出 ${card.rarity} 卡給朋友`,
            subtitle: `「${card.name}」→ ${toCoupleName}`,
            emoji: card.emoji,
          });
        }
      },

      joinAlliance: (id) =>
        set({
          alliances: get().alliances.map((a) =>
            a.id === id && !a.members.includes("me")
              ? { ...a, members: [...a.members, "me"] }
              : a,
          ),
        }),

      attackBoss: (allianceId: string, damage: number) => {
        const alliance = get().alliances.find((a) => a.id === allianceId);
        if (!alliance || alliance.bossHp == null) return;
        if (!alliance.members.includes("me")) return;
        if (get().couple.loveIndex < 10) return; // 貧血者無法戰鬥
        const nextHp = Math.max(0, alliance.bossHp - damage);
        set({
          alliances: get().alliances.map((a) =>
            a.id === allianceId ? { ...a, bossHp: nextHp } : a,
          ),
          couple: { ...get().couple, loveIndex: get().couple.loveIndex - 10 },
        });
        if (nextHp === 0 && (alliance.bossHp ?? 0) > 0) {
          get().addMoment({
            type: "alliance_boss",
            title: `擊敗聯盟 BOSS！「${alliance.bossName}」`,
            subtitle: `${alliance.name} 合力擊倒巨敵 🐲`,
            emoji: "⚔️",
          });
        }
      },
    }),
    {
      name: "love-empire-v3",
      onRehydrateStorage: () => () => {
        // 清掉舊版本的 persist key，避免使用者看到過期資料
        if (typeof window === "undefined") return;
        try {
          const OLD_KEYS = ["love-empire-demo-v1", "star-tied-empire-demo-v2"];
          OLD_KEYS.forEach((k) => localStorage.removeItem(k));
        } catch { /* ignore */ }
      },
    },
  ),
);
