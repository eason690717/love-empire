"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  Couple, Task, Submission, Reward, Redemption, MemoryCard, Pet, IslandItem,
  Ritual, Streak, CoupleSummary, Alliance, Friendship, Gift,
} from "./types";
import {
  INITIAL_COUPLE, INITIAL_TASKS, INITIAL_SUBMISSIONS, INITIAL_REWARDS, INITIAL_REDEMPTIONS,
  INITIAL_CODEX, INITIAL_PET, INITIAL_ISLAND, INITIAL_RITUAL, INITIAL_STREAK,
  LEADERBOARD, ALLIANCES, FRIEND_COUPLES, GIFT_INBOX, NOTICE,
} from "./demoData";

type Role = "queen" | "prince";

interface State {
  loggedIn: boolean;
  role: Role;
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
  notice: typeof NOTICE;

  login: (role: Role) => void;
  logout: () => void;
  setNickname: (role: Role, nickname: string) => void;
  setKingdomName: (name: string) => void;
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
}

const uid = () => Math.random().toString(36).slice(2, 10);
const nowStr = () => new Date().toLocaleString("zh-TW");

export const useGame = create<State>()(
  persist(
    (set, get) => ({
      loggedIn: false,
      role: "queen",
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
          set({
            couple: { ...get().couple, coins: get().couple.coins + s.reward, loveIndex: get().couple.loveIndex + s.reward },
            pet: {
              ...get().pet,
              attrs: { ...get().pet.attrs, [attr]: Math.min(100, get().pet.attrs[attr] + 2) },
              lastFedAt: new Date().toISOString(),
            },
          });
          // 隨機掉落記憶卡 (未收集中挑一張)
          const uncollected = get().codex.filter((c) => !c.obtainedAt);
          if (uncollected.length && Math.random() < 0.4) {
            const pick = uncollected[Math.floor(Math.random() * uncollected.length)];
            set({
              codex: get().codex.map((c) =>
                c.id === pick.id ? { ...c, obtainedAt: new Date().toISOString().slice(0, 10) } : c,
              ),
            });
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
      },

      useRedemption: (id) =>
        set({
          redemptions: get().redemptions.map((r) =>
            r.id === id ? { ...r, status: "used" } : r,
          ),
        }),

      feedPet: (attr) =>
        set({
          pet: {
            ...get().pet,
            attrs: { ...get().pet.attrs, [attr]: Math.min(100, get().pet.attrs[attr] + 5) },
            lastFedAt: new Date().toISOString(),
          },
        }),

      toggleRitual: (kind) => {
        const today = new Date().toISOString().slice(0, 10);
        const r = get().ritual.date === today ? get().ritual : { date: today, morning: false, night: false };
        set({ ritual: { ...r, [kind]: !r[kind] } });
        const next = { ...r, [kind]: !r[kind] };
        if (next.morning || next.night) {
          set({ couple: { ...get().couple, coins: get().couple.coins + 5 } });
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
    }),
    { name: "star-tied-empire-demo-v2" },
  ),
);
