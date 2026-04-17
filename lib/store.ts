"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  Couple, Task, Submission, Reward, Redemption, MemoryCard, Pet, IslandItem,
  Ritual, Streak, CoupleSummary, Alliance, Friendship, Gift, Moment, MomentType,
} from "./types";
import { CATEGORY_META } from "./types";
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
  submitTask: (taskId: string) => void;
  reviewSubmission: (id: string, approve: boolean, note?: string) => void;
  redeem: (rewardId: string) => void;
  useRedemption: (id: string) => void;
  feedPet: (attr: keyof Pet["attrs"]) => void;
  toggleRitual: (kind: "morning" | "night") => void;
  moveIslandItem: (id: string, x: number, y: number) => void;
  buyIslandItem: (catalogId: string, label: string, emoji: string, price: number) => void;
  removeIslandItem: (id: string) => void;
  sendGift: () => void;
  joinAlliance: (id: string) => void;
  attackBoss: (allianceId: string, damage: number) => void;
}

const uid = () => Math.random().toString(36).slice(2, 10);
const nowStr = () => new Date().toLocaleString("zh-TW");

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
          const systemXp = task?.systemXp ?? 5; // 公平指標：系統 XP
          const prevLove = get().couple.loveIndex;
          const prevLevel = get().couple.kingdomLevel;
          const nextLove = prevLove + systemXp;         // 愛意指數用 systemXp (公平)
          const nextLevel = Math.max(prevLevel, Math.floor(nextLove / 50) + 1);
          set({
            couple: {
              ...get().couple,
              coins: get().couple.coins + s.reward,      // 金幣用 reward (自訂)
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

          // 隨機掉落記憶卡
          const uncollected = get().codex.filter((c) => !c.obtainedAt);
          if (uncollected.length && Math.random() < 0.4) {
            const pick = uncollected[Math.floor(Math.random() * uncollected.length)];
            set({
              codex: get().codex.map((c) =>
                c.id === pick.id ? { ...c, obtainedAt: new Date().toISOString().slice(0, 10) } : c,
              ),
            });
            // SR / SSR 掉落自動發動態
            if (pick.rarity === "SSR" || pick.rarity === "SR") {
              get().addMoment({
                type: pick.rarity === "SSR" ? "ssr_card" : "sr_card",
                title: `抽到 ${pick.rarity} 記憶卡`,
                subtitle: `「${pick.name}」${pick.emoji} 入手！`,
                emoji: pick.emoji,
              });
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
          if (s.lastDate !== today) {
            const prev = s.current;
            const nextCurrent = prev + 1;
            set({
              streak: {
                current: nextCurrent,
                longest: Math.max(s.longest, nextCurrent),
                lastDate: today,
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

      sendGift: () =>
        set({
          gifts: [
            {
              id: uid(),
              fromCoupleName: get().couple.name,
              type: "card",
              content: "✨ 送出一張記憶卡",
              message: "謝謝你陪我",
              receivedAt: new Date().toLocaleDateString("zh-TW"),
              read: false,
            },
            ...get().gifts,
          ],
        }),

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
