"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  Couple, Task, Submission, Reward, Redemption, MemoryCard, Pet, IslandItem,
  Ritual, Streak, CoupleSummary, Alliance, Friendship, Gift, Moment, MomentType, PikminHelper,
  NotificationItem, QuestionAnswer, BucketRecord,
} from "./types";
import { BUCKET_REWARD } from "./types";
import { getBucketItemById } from "./bucketList";
import { getQuestionById, DEPTH_LABELS } from "./questions";
import { CATEGORY_META } from "./types";
import { QUEEN_COIN_BONUS, isSpecialDay, SPECIAL_DAY_MULTIPLIER } from "./passive";
import { inFestivalWindow, PIKMIN_BY_CATEGORY, getTodayVisitor } from "./festival";
import { ACHIEVEMENTS } from "./achievements";
import {
  isSupabaseEnabled,
  updateCoupleFields,
  updateUserMood,
  updateUserNickname,
  insertSubmission as sbInsertSubmission,
  reviewSubmissionRemote,
  upsertPet,
  addMemoryCardRemote,
  addIslandItemRemote,
  moveIslandItemRemote,
  removeIslandItemRemote,
  upsertRitual,
  updateStreak,
  insertRedemption,
  insertMomentRemote,
  insertQuestionAnswerRemote,
  rateQuestionAnswerRemote,
  getCurrentUser,
  upsertBucketRecordRemote,
  removeBucketRecordRemote,
  insertAnniversaryRemote,
  removeAnniversaryRemote,
  upsertCustomRitualRemote,
  insertPetInstance,
  updatePetInstance,
  deletePetInstance,
} from "./supabaseAdapter";
import {
  INITIAL_COUPLE, INITIAL_TASKS, INITIAL_SUBMISSIONS, INITIAL_REWARDS, INITIAL_REDEMPTIONS,
  INITIAL_CODEX, INITIAL_PET, INITIAL_ISLAND, INITIAL_RITUAL, INITIAL_STREAK,
  LEADERBOARD, ALLIANCES, FRIEND_COUPLES, GIFT_INBOX, NOTICE, INITIAL_MOMENTS,
  ISLAND_SHOP,
} from "./demoData";
import { checkEligibility as mintCheckEligibility, calcCoinCost as mintCalcCoinCost, executeMint } from "./pet/mint";
import { SPECIES as PET_SPECIES, attrBonusMultiplier } from "./pet/species";
import { RARITY as PET_RARITY, resolveRarity as resolvePetRarity } from "./pet/rarity";
import { applyBondDecay } from "./pet/mood";
import { generateDailyQuests, todayKey as questTodayKey, COMBO_REWARD, type DailyQuest } from "./dailyQuest";

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
  pet: Pet;               // 目前活躍寵物（= pets 中 activePetId 對應那隻）— 保留以相容既有 UI
  pets: Pet[];            // 多寵容器（C2），pets[0] 預設為舊單寵遷移後的首隻
  activePetId?: string;   // 目前活躍寵物 id（未設時 = pets[0].id）
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
  notifications: NotificationItem[];
  achievements: string[];
  pkWins: number;
  pkQuota: { date: string; used: number }; // 每日 3 場
  taskQuota: { date: string; used: number }; // 每日 10 次送審上限
  visitsSent: number;
  dailyLoginDay: number;
  lastLoginDate: string;
  anniversaries: Array<{ id: string; label: string; date: string; recurring: boolean; emoji: string }>;
  questionAnswers: QuestionAnswer[];
  bucketList: BucketRecord[]; // 已勾選的情侶人生清單項目
  notice: typeof NOTICE;

  login: (role: Role) => void;
  logout: () => void;
  setNickname: (role: Role, nickname: string) => void;
  setKingdomName: (name: string) => void;
  addCustomTask: (t: Omit<Task, "id" | "systemXp" | "custom">) => void;
  addPresetTask: (preset: Omit<Task, "id" | "custom">) => void;
  setRelationshipType: (type: "cohabit" | "nearby" | "longdistance" | "married") => void;
  pauseKingdom: (reason?: string) => void;
  unpauseKingdom: () => void;
  checkKingdomStatus: () => void;  // 檢查 90 天到期自動封存
  removeTask: (id: string) => void;
  addMoment: (m: Omit<Moment, "id" | "createdAt" | "likes" | "likedByMe" | "comments" | "coupleId" | "coupleName" | "isSelf">) => void;
  likeMoment: (id: string) => void;
  advanceOnboarding: () => void;
  skipOnboarding: () => void;
  resetOnboarding: () => void;
  greetVisitor: () => { success: boolean; reward?: string };
  setPetName: (name: string) => void;
  setPrivacy: (p: "public" | "friends" | "private") => void;
  checkKnightShield: () => void;
  resetAllData: () => void;
  addNotification: (n: Omit<NotificationItem, "id" | "createdAt" | "read">) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  checkAchievements: () => void;
  applyRemoteState: (remote: any) => void;
  recordPkWin: () => void;
  consumePkQuota: () => void;
  recordVisit: () => void;
  claimDailyBonus: () => { claimed: boolean; day?: number; reward?: string };
  addAnniversary: (label: string, date: string, recurring: boolean, emoji: string) => void;
  removeAnniversary: (id: string) => void;
  submitQuestionAnswer: (questionId: string, text: string) => void;
  rateQuestionAnswer: (answerId: string, rating: number, comment?: string) => void;
  submitTask: (taskId: string) => void;
  reviewSubmission: (id: string, approve: boolean, note?: string) => void;
  redeem: (rewardId: string) => void;
  useRedemption: (id: string, note?: string) => void;
  feedPet: (attr: keyof Pet["attrs"]) => void;
  petInteract: (kind: "pet" | "treat" | "talk", message?: string) => { ok: boolean; reason?: string };
  /** 切換目前活躍寵物 — 把 pets 中對應 id 的 pet 提到 state.pet */
  switchActivePet: (petId: string) => void;
  /** 新增空白寵物（蛋階段） — 用於 MIT 或主動新增（C5 之後才開 UI 入口） */
  addPet: (pet: Partial<Pet> & { name: string }) => string;
  /** 刪除寵物（pets.length > 1 才允許） */
  removePet: (petId: string) => void;
  /** MIT 繁殖 — 檢查資格、扣 coin、roll 子代、雙親 mintCount++ / lastMatedAt 更新 */
  mintPet: (parentAId: string, parentBId: string, childName?: string) => { ok: boolean; reason?: string; childId?: string };
  /** 檢查所有寵物的 bond 衰減（layout 每次 mount 跑一次） */
  checkPetDecay: () => void;
  /** 內部 helper：auto quest 完成偵測（不對外暴露但要進 interface 讓 action 能調用） */
  _autoCheckQuest: (triggerIds: string[]) => void;
  /** 每日任務 */
  dailyQuests: { date: string; quests: DailyQuest[]; completed: string[]; comboClaimed: boolean };
  /** 檢查/生成當日 3 個 quest（layout mount 呼叫，跨天自動 reset） */
  refreshDailyQuests: () => void;
  /** 領取單個 quest 獎勵 */
  claimDailyQuest: (questId: string) => { ok: boolean; reward?: { coins: number; loveXp: number; petXp: number } };
  /** 領取 3 全完成 combo 獎勵 */
  claimDailyCombo: () => { ok: boolean; reward?: typeof COMBO_REWARD; cardId?: string };
  /** 離線時長獎勵（開 app 偵測上次關閉） */
  lastOpenedAt?: string;
  claimOfflineReward: () => { ok: boolean; hours?: number; reward?: { coins: number; loveXp: number } };
  toggleRitual: (kind: "morning" | "night") => void;
  moveIslandItem: (id: string, x: number, y: number) => void;
  buyIslandItem: (catalogId: string, label: string, emoji: string, price: number) => void;
  removeIslandItem: (id: string) => void;
  sendGift: (toCoupleName?: string, message?: string) => void;
  sendCardGift: (cardId: string, toCoupleId: string, toCoupleName: string, message: string) => void;
  openGift: (giftId: string) => void;
  addFriend: (coupleId: string) => { ok: boolean; reason?: string };
  removeFriend: (coupleId: string) => void;
  joinAlliance: (id: string) => void;
  leaveAlliance: (id: string) => void;
  customRituals: {
    morning?: { label: string; desc: string; emoji: string };
    night?: { label: string; desc: string; emoji: string };
  };
  showAdultRewards: boolean; // 成人向獎勵顯示開關（預設關）
  myMood?: "default" | "busy" | "tired" | "missing" | "intimate" | "quiet";
  partnerMood?: "default" | "busy" | "tired" | "missing" | "intimate" | "quiet";
  moodUpdatedAt?: string;
  setCustomRitual: (kind: "morning" | "night", value: { label: string; desc: string; emoji: string } | null) => void;
  setShowAdultRewards: (v: boolean) => void;
  setMood: (mood: "default" | "busy" | "tired" | "missing" | "intimate" | "quiet") => void;
  toggleBucketItem: (id: string, note?: string, proof?: { kind: "text" | "location" | "photo"; value: string; caption?: string }) => { newlyDone: boolean; reward?: { love: number; coins: number } };
  attackBoss: (allianceId: string, damage: number) => void;
  contributeAllianceItem: (allianceId: string, catalogId: string, label: string, emoji: string, price: number) => void;
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

/** 把 couple 欄位變動 mirror 到 Supabase（fire-and-forget） */
function mirrorCouple(coupleId: string, fields: Partial<Couple>) {
  if (!isSupabaseEnabled() || !coupleId || coupleId === "me") return;
  updateCoupleFields(coupleId, fields).catch(() => null);
}

/** 把 pet 變動 mirror 到 Supabase
 *  - pets 表：活躍寵物單寵（向後相容）
 *  - pet_instances 表：多寵完整同步；首次 insert 後 remoteId 寫回 local Pet
 */
function mirrorPet(coupleId: string, pet: Pet) {
  if (!isSupabaseEnabled() || !coupleId || coupleId === "me") return;
  // 1. 活躍寵物同步到 pets 表（legacy 單寵）
  upsertPet(coupleId, pet).catch(() => null);
  // 2. 多寵 pet_instances 同步
  if (pet.remoteId) {
    updatePetInstance(pet.remoteId, coupleId, pet).catch(() => null);
  } else {
    // 首次 — insert 取回 uuid 存進 local Pet.remoteId（以 id 比對定位）
    insertPetInstance(coupleId, pet).then((uuid) => {
      if (!uuid) return;
      const cur = useGame.getState();
      const targetId = pet.id;
      const updatedPets = cur.pets.map((p) => p.id === targetId ? { ...p, remoteId: uuid } : p);
      const updatedActive = cur.pet.id === targetId ? { ...cur.pet, remoteId: uuid } : cur.pet;
      useGame.setState({ pets: updatedPets, pet: updatedActive });
    }).catch(() => null);
  }
}

/**
 * 把 state.pet 的變動同步寫回 state.pets 陣列對應的那隻（活躍寵物）
 * 所有 action 改 pet 後都應該呼叫這個 helper，保證 pets[] 和 pet 一致。
 * 用法：const next = { ...get().pet, xxx }; set({ pet: next, pets: syncActivePetInArray(get().pets, next) });
 */
function syncActivePetInArray(pets: Pet[], active: Pet): Pet[] {
  if (!active.id) return pets; // 還沒遷移的舊資料保底
  const idx = pets.findIndex((p) => p.id === active.id);
  if (idx < 0) return [...pets, active];
  const copy = pets.slice();
  copy[idx] = active;
  return copy;
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
      pets: [INITIAL_PET],
      activePetId: INITIAL_PET.id,
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
      notifications: [],
      achievements: [],
      pkWins: 0,
      pkQuota: { date: "", used: 0 },
      taskQuota: { date: "", used: 0 },
      visitsSent: 0,
      dailyLoginDay: 0,
      lastLoginDate: "",
      anniversaries: [],
      questionAnswers: [],
      bucketList: [],
      customRituals: {},
      showAdultRewards: false,
      notice: NOTICE,
      dailyQuests: { date: "", quests: [], completed: [], comboClaimed: false },

      login: (role) => set({ loggedIn: true, role }),
      logout: () => {
        set({ loggedIn: false });
        // 同步清掉 Supabase anonymous session，否則 landing/login 頁會自動 resume
        if (typeof window !== "undefined") {
          import("./auth").then(({ signOut, isSupabaseEnabled }) => {
            if (isSupabaseEnabled()) signOut();
          }).catch(() => null);
          // 清裝置綁定：允許重新綁定角色
          import("./deviceBinding").then(({ clearDeviceBinding }) => {
            clearDeviceBinding();
          }).catch(() => null);
        }
      },

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
        // Mirror 到 Supabase users 表（只改自己 role 的 row）
        if (isSupabaseEnabled() && couple.id !== "me" && role === get().role) {
          (async () => {
            const u = await getCurrentUser();
            if (u?.id) updateUserNickname(u.id, clean).catch(() => null);
          })();
        }
      },

      setKingdomName: (name) => {
        const clean = name.trim().slice(0, 20);
        if (!clean) return;
        const nextCouple = { ...get().couple, name: clean };
        set({ couple: nextCouple });
        mirrorCouple(nextCouple.id, { name: clean });
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

      addPresetTask: (preset) => {
        // 避免重複加入（用 title 去重）
        if (get().tasks.some((t) => t.title === preset.title)) return;
        const newTask: Task = {
          ...preset,
          id: `preset_${uid()}`,
          custom: true, // 標為自訂讓使用者可刪
        };
        set({ tasks: [...get().tasks, newTask] });
      },

      setRelationshipType: (type) => {
        const nextCouple = { ...get().couple, relationshipType: type };
        set({ couple: nextCouple });
        mirrorCouple(nextCouple.id, { relationshipType: type } as any);
      },

      pauseKingdom: (reason) => {
        const role = get().role;
        const nextCouple = {
          ...get().couple,
          pausedAt: new Date().toISOString(),
          pauseReason: reason?.trim() || undefined,
          pauseInitiator: role,
        };
        set({ couple: nextCouple });
        get().addNotification({
          type: "system",
          title: "王國已暫停",
          body: `90 天內任一方可解除，90 天後自動封存。原因：${reason ?? "未填"}`,
          emoji: "⏸️",
          priority: "high",
          fromRole: role,
        });
        mirrorCouple(nextCouple.id, {
          pausedAt: nextCouple.pausedAt,
          pauseReason: nextCouple.pauseReason,
          pauseInitiator: nextCouple.pauseInitiator,
        } as any);
      },

      unpauseKingdom: () => {
        const role = get().role;
        const nextCouple = {
          ...get().couple,
          pausedAt: undefined,
          pauseReason: undefined,
          pauseInitiator: undefined,
        };
        set({ couple: nextCouple });
        get().addNotification({
          type: "system",
          title: "🌱 王國恢復",
          body: `${role === "queen" ? get().couple.queen.nickname : get().couple.prince.nickname} 解除了暫停，歡迎回來`,
          emoji: "🌱",
          priority: "high",
          fromRole: role,
        });
        mirrorCouple(nextCouple.id, {
          pausedAt: null,
          pauseReason: null,
          pauseInitiator: null,
        } as any);
      },

      checkKingdomStatus: () => {
        const c = get().couple;
        if (!c.pausedAt || c.archivedAt) return;
        const daysSince = Math.floor((Date.now() - new Date(c.pausedAt).getTime()) / 86400000);
        if (daysSince >= 90) {
          const nextCouple = { ...c, archivedAt: new Date().toISOString() };
          set({ couple: nextCouple });
          mirrorCouple(nextCouple.id, { archivedAt: nextCouple.archivedAt } as any);
        }
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
        if (isSupabaseEnabled() && couple.id !== "me") {
          insertMomentRemote(couple.id, couple.name, m).catch(() => null);
        }
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

      setPetName: (name) => {
        const clean = name.trim().slice(0, 20);
        if (!clean) return;
        const nextPet = { ...get().pet, name: clean };
        set({ pet: nextPet, pets: syncActivePetInArray(get().pets, nextPet) });
        mirrorPet(get().couple.id, nextPet);
      },

      switchActivePet: (petId) => {
        const target = get().pets.find((p) => p.id === petId);
        if (!target) return;
        set({ pet: target, activePetId: petId });
      },

      addPet: (pet) => {
        const id = "p_" + Math.random().toString(36).slice(2, 10);
        const newPet: Pet = {
          id,
          stage: 0,
          attrs: { intimacy: 0, communication: 0, romance: 0, care: 0, surprise: 0 },
          lastFedAt: new Date().toISOString(),
          bondQueen: 0,
          bondPrince: 0,
          feedCountQueen: 0,
          feedCountPrince: 0,
          species: "nuzzle",
          rarity: "common",
          mintCount: 0,
          ...pet,
        };
        set({ pets: [...get().pets, newPet] });
        return id;
      },

      removePet: (petId) => {
        const pets = get().pets;
        if (pets.length <= 1) return; // 至少留一隻
        const target = pets.find((p) => p.id === petId);
        const next = pets.filter((p) => p.id !== petId);
        const nextActive = get().activePetId === petId ? next[0].id : get().activePetId;
        set({
          pets: next,
          activePetId: nextActive,
          pet: next.find((p) => p.id === nextActive) ?? next[0],
        });
        // 刪除 Supabase pet_instances row
        if (target?.remoteId && isSupabaseEnabled() && get().couple.id !== "me") {
          deletePetInstance(target.remoteId).catch(() => null);
        }
      },

      mintPet: (parentAId, parentBId, childName) => {
        const petsArr = get().pets;
        const a = petsArr.find((p) => p.id === parentAId);
        const b = petsArr.find((p) => p.id === parentBId);
        if (!a || !b) return { ok: false, reason: "找不到雙親" };

        const elig = mintCheckEligibility(a, b);
        if (!elig.ok) return { ok: false, reason: elig.reason };

        // pets.length 上限檢查
        if (petsArr.length >= 3) return { ok: false, reason: "每對情侶最多 3 隻寵物" };

        // coin 檢查
        const cost = mintCalcCoinCost(a, b);
        const curCouple = get().couple;
        if (curCouple.coins < cost) return { ok: false, reason: `金幣不足 — 需 ${cost}，目前 ${curCouple.coins}` };

        // roll 子代
        const result = executeMint(a, b);
        const childId = "p_" + Math.random().toString(36).slice(2, 10);
        const name = (childName ?? `${a.name.slice(0,2)}${b.name.slice(0,2)}寶寶`).slice(0, 20);
        const child: Pet = {
          id: childId,
          name,
          stage: 0,
          attrs: { intimacy: 0, communication: 0, romance: 0, care: 0, surprise: 0 },
          lastFedAt: new Date().toISOString(),
          bondQueen: 0,
          bondPrince: 0,
          feedCountQueen: 0,
          feedCountPrince: 0,
          species: result.species,
          rarity: result.rarity,
          gene: result.gene,
          mintCount: 0,
          parentAId,
          parentBId,
          generation: Math.max((a.generation ?? 0), (b.generation ?? 0)) + 1,
        };

        // 扣 coin + 雙親 mintCount++ + lastMatedAt
        const nowIso = new Date().toISOString();
        const updatedPets = petsArr.map((p) => {
          if (p.id === parentAId) return { ...p, mintCount: (p.mintCount ?? 0) + 1, lastMatedAt: nowIso };
          if (p.id === parentBId) return { ...p, mintCount: (p.mintCount ?? 0) + 1, lastMatedAt: nowIso };
          return p;
        });
        const nextCouple = { ...curCouple, coins: curCouple.coins - cost };
        const nextPets = [...updatedPets, child];
        // 活躍寵若是雙親之一也要同步
        const curActive = get().pet;
        const newActive = curActive.id === parentAId ? updatedPets.find((p) => p.id === parentAId)!
                        : curActive.id === parentBId ? updatedPets.find((p) => p.id === parentBId)!
                        : curActive;
        set({ pets: nextPets, couple: nextCouple, pet: newActive });
        mirrorCouple(nextCouple.id, { coins: nextCouple.coins });
        // 若活躍寵是雙親 → mirror 最新 mintCount
        if (newActive !== curActive) mirrorPet(nextCouple.id, newActive);

        // 發動態「共同血脈」
        const rrMeta = PET_RARITY[result.rarity];
        const spMeta = PET_SPECIES[result.species];
        get().addMoment({
          type: "custom",
          title: `🥚 新生命誕生：「${name}」`,
          subtitle: `${a.name} × ${b.name} → ${spMeta.nameZh} ${rrMeta.tag}`,
          emoji: rrMeta.emoji,
        });
        get().addNotification({
          type: "pet",
          title: `新寵物誕生！${name}`,
          body: `${spMeta.nameZh} · ${rrMeta.tag}（${rrMeta.label}）— 去 /pets 看看`,
          emoji: "🥚",
          link: "/pets",
          priority: "high",
        });

        return { ok: true, childId };
      },

      setPrivacy: (p) => {
        const nextCouple = { ...get().couple, privacy: p };
        set({ couple: nextCouple });
        mirrorCouple(nextCouple.id, { privacy: p });
      },

      /** 檢查是否有缺席日、是否需要消耗騎士盾 */
      /** 內部 helper：若今日 quest 中有 auto kind 匹配且未完成，自動標示完成領獎 */
      _autoCheckQuest: (triggerIds: string[]) => {
        const dq = get().dailyQuests;
        if (!dq.quests || dq.quests.length === 0) return;
        const toClaim = dq.quests.filter((q) => q.completion === "auto" && triggerIds.includes(q.id) && !dq.completed.includes(q.id));
        for (const q of toClaim) {
          get().claimDailyQuest(q.id);
        }
      },

      refreshDailyQuests: () => {
        const today = questTodayKey();
        const cur = get().dailyQuests;
        if (cur.date === today && cur.quests.length === 3) return; // 已有當日
        const couple = get().couple;
        const quests = generateDailyQuests(today, couple.id, couple.relationshipType ?? "any", couple.kingdomLevel);
        set({ dailyQuests: { date: today, quests, completed: [], comboClaimed: false } });
      },

      claimDailyQuest: (questId) => {
        const dq = get().dailyQuests;
        if (!dq.quests.find((q) => q.id === questId)) return { ok: false };
        if (dq.completed.includes(questId)) return { ok: false };
        const quest = dq.quests.find((q) => q.id === questId)!;
        // 發獎
        const nextCouple = {
          ...get().couple,
          coins: get().couple.coins + quest.reward.coins,
          loveIndex: get().couple.loveIndex + quest.reward.loveXp,
        };
        set({
          dailyQuests: { ...dq, completed: [...dq.completed, questId] },
          couple: nextCouple,
        });
        mirrorCouple(nextCouple.id, { coins: nextCouple.coins, loveIndex: nextCouple.loveIndex });
        // 寵物 XP（若可用 level 系統，先加 totalXp 當基礎）
        const curPet = get().pet;
        const nextPet = {
          ...curPet,
          totalXp: (curPet.totalXp ?? 0) + quest.reward.petXp,
          petXp: (curPet.petXp ?? 0) + quest.reward.petXp,
        };
        set({ pet: nextPet, pets: syncActivePetInArray(get().pets, nextPet) });
        mirrorPet(nextCouple.id, nextPet);
        return { ok: true, reward: quest.reward };
      },

      claimDailyCombo: () => {
        const dq = get().dailyQuests;
        if (dq.completed.length < 3 || dq.comboClaimed) return { ok: false };
        set({ dailyQuests: { ...dq, comboClaimed: true } });
        // 獎勵
        const nextCouple = {
          ...get().couple,
          coins: get().couple.coins + COMBO_REWARD.coins,
          loveIndex: get().couple.loveIndex + COMBO_REWARD.loveXp,
        };
        set({ couple: nextCouple });
        mirrorCouple(nextCouple.id, { coins: nextCouple.coins, loveIndex: nextCouple.loveIndex });
        // 記憶卡機率
        let cardId: string | undefined;
        if (Math.random() < COMBO_REWARD.memoryCardChance) {
          const pool = get().codex.filter((c) => !c.obtainedAt && (c.rarity === "N" || c.rarity === "R"));
          const lucky = pool[Math.floor(Math.random() * pool.length)];
          if (lucky) {
            cardId = lucky.id;
            set({
              codex: get().codex.map((c) => c.id === lucky.id ? { ...c, obtainedAt: new Date().toISOString().slice(0, 10) } : c),
            });
          }
        }
        return { ok: true, reward: COMBO_REWARD, cardId };
      },

      claimOfflineReward: () => {
        const last = get().lastOpenedAt;
        const now = new Date().toISOString();
        set({ lastOpenedAt: now });
        if (!last) return { ok: false };
        const hoursSince = (Date.now() - new Date(last).getTime()) / 3600000;
        if (hoursSince < 4) return { ok: false };
        // 階梯獎勵
        let coins = 0, loveXp = 0;
        if (hoursSince >= 24)      { coins = 200; loveXp = 30; }
        else if (hoursSince >= 12) { coins = 100; loveXp = 20; }
        else if (hoursSince >= 8)  { coins = 50;  loveXp = 10; }
        else if (hoursSince >= 4)  { coins = 20;  loveXp = 5;  }
        if (coins === 0) return { ok: false };
        const nextCouple = { ...get().couple, coins: get().couple.coins + coins, loveIndex: get().couple.loveIndex + loveXp };
        set({ couple: nextCouple });
        mirrorCouple(nextCouple.id, { coins: nextCouple.coins, loveIndex: nextCouple.loveIndex });
        return { ok: true, hours: Math.floor(hoursSince), reward: { coins, loveXp } };
      },

      checkPetDecay: () => {
        const petsArr = get().pets;
        if (!petsArr || petsArr.length === 0) return;
        let changed = false;
        const decayed = petsArr.map((p) => {
          const after = applyBondDecay(p);
          if (after.bondQueen !== p.bondQueen || after.bondPrince !== p.bondPrince) {
            changed = true;
            return after;
          }
          return p;
        });
        if (!changed) return;
        const activeId = get().activePetId;
        const activeNext = decayed.find((p) => p.id === activeId) ?? decayed[0];
        set({ pets: decayed, pet: activeNext });
        // 衰減後 mirror 活躍寵物（其他寵物下次互動自然會 mirror）
        const cid = get().couple.id;
        if (cid && cid !== "me") mirrorPet(cid, activeNext);
      },

      checkKnightShield: () => {
        const s = get().streak;
        if (!s.lastDate || s.current === 0) return;
        const last = new Date(s.lastDate);
        const now = new Date();
        const daysSinceLast = Math.floor((now.getTime() - last.getTime()) / 86400000);
        if (daysSinceLast <= 1) return; // 昨天或今天打過 → 安全

        // 有缺席日。盾牌啟動？
        const shields = s.knightShields ?? 0;
        if (shields > 0 && daysSinceLast === 2) {
          // 用一個盾牌保護，視為昨天有簽到
          const yesterday = new Date(now.getTime() - 86400000).toISOString().slice(0, 10);
          set({
            streak: {
              ...s,
              lastDate: yesterday,
              knightShields: shields - 1,
            },
          });
          get().addMoment({
            type: "custom",
            title: "🛡️ 騎士盾啟動",
            subtitle: "昨天沒簽到，但連擊仍保留",
            emoji: "🛡️",
          });
        } else if (daysSinceLast >= 2) {
          // 連擊中斷
          set({
            streak: { ...s, current: 0 },
          });
        }
      },

      addNotification: (n) => {
        const notif: NotificationItem = {
          id: uid(),
          createdAt: nowStr(),
          read: false,
          ...n,
        };
        set({ notifications: [notif, ...get().notifications].slice(0, 100) });
      },

      markNotificationRead: (id) => {
        set({
          notifications: get().notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
        });
      },

      markAllNotificationsRead: () => {
        set({ notifications: get().notifications.map((n) => ({ ...n, read: true })) });
      },

      /**
       * 將 Supabase pull 下來的狀態套用到 store
       * 呼叫時機：SupabaseSync 首次 mount + realtime 收到變化時
       */
      applyRemoteState: (remote: any) => {
        if (!remote?.couple) return;
        const selfRole = get().role;
        const cr = remote.couple;
        const myUser = remote.users?.find((u: any) => u.role === selfRole);
        const queenUser = remote.users?.find((u: any) => u.role === "queen");
        const princeUser = remote.users?.find((u: any) => u.role === "prince");

        // 偵測「伴侶剛送的新申報」→ 加 local notification
        const prevSubIds = new Set(get().submissions.map((s) => s.id));
        const incomingSubs = (remote.submissions ?? []);
        for (const s of incomingSubs) {
          if (prevSubIds.has(s.id)) continue; // 已存在
          const fromRole = remote.users?.find((u: any) => u.id === s.submitted_by)?.role;
          if (!fromRole || fromRole === selfRole) continue; // 只在對方送的才通知
          if (s.status !== "pending") continue;
          const isInteraction = /擁抱|親|吻|情話|早安|晚安|按摩|告白/.test(s.task_title);
          get().addNotification({
            type: isInteraction ? "interaction" : "submission",
            title: isInteraction
              ? `${fromRole === "queen" ? queenUser?.nickname ?? "阿紅" : princeUser?.nickname ?? "阿藍"} 送你：${s.task_title}`
              : "📜 伴侶送來新申報",
            body: `${s.task_title} · +${s.reward} 金`,
            emoji: isInteraction ? "💕" : "📜",
            link: "/tasks",
            priority: isInteraction ? "high" : "normal",
            fromRole,
          });
        }

        // 偵測「伴侶心情更新」→ 加 local notification + 更新 partnerMood
        const partnerUser = remote.users?.find((u: any) => u.role !== selfRole);
        if (partnerUser?.mood && partnerUser.mood !== "default") {
          const prevPartnerMood = get().partnerMood;
          set({ partnerMood: partnerUser.mood });
          // mood 改變時加通知（避免首次 load 誤觸發）
          if (prevPartnerMood !== undefined && prevPartnerMood !== partnerUser.mood) {
            const fromName = partnerUser.nickname || (partnerUser.role === "queen" ? "阿紅" : "阿藍");
            const moodLabel =
              partnerUser.mood === "missing" ? "想你 💭" :
              partnerUser.mood === "intimate" ? "想親密 🌹" :
              partnerUser.mood === "tired" ? "累癱 😮‍💨" :
              partnerUser.mood === "busy" ? "忙碌中 💼" :
              partnerUser.mood === "quiet" ? "想獨處 🕯️" : "";
            if (moodLabel) {
              get().addNotification({
                type: "interaction",
                title: `💭 ${fromName} 的心情`,
                body: moodLabel,
                emoji: partnerUser.mood === "missing" ? "💭" : partnerUser.mood === "intimate" ? "🌹" : partnerUser.mood === "tired" ? "😮‍💨" : "💭",
                priority: "high",
                fromRole: partnerUser.role,
              });
            }
          }
        }

        // 偵測「伴侶剛回的新問答」→ 加 local notification
        const prevQAIds = new Set(get().questionAnswers.map((a) => a.id));
        const incomingQA = (remote.questionAnswers ?? []);
        for (const qa of incomingQA) {
          if (prevQAIds.has(qa.id)) continue;
          const fromRole = qa.answered_by
            ? remote.users?.find((u: any) => u.id === qa.answered_by)?.role
            : null;
          if (!fromRole || fromRole === selfRole) continue;
          const fromName = fromRole === "queen" ? queenUser?.nickname ?? "阿紅" : princeUser?.nickname ?? "阿藍";
          get().addNotification({
            type: "interaction",
            title: `💭 ${fromName} 回答了一題問答`,
            body: "去看看並給評分",
            emoji: "💭",
            link: "/questions",
            priority: "high",
            fromRole,
          });
        }

        const curCouple = get().couple;
        set({
          couple: {
            id: cr.id ?? curCouple.id,
            name: cr.name ?? curCouple.name,
            inviteCode: cr.invite_code ?? curCouple.inviteCode,
            kingdomLevel: cr.kingdom_level ?? curCouple.kingdomLevel,
            coins: cr.coins ?? curCouple.coins,
            title: cr.title ?? curCouple.title,
            loveIndex: cr.love_index ?? curCouple.loveIndex,
            bio: cr.bio ?? curCouple.bio ?? "",
            privacy: cr.privacy ?? curCouple.privacy ?? "public",
            queen: { nickname: queenUser?.nickname ?? curCouple.queen.nickname ?? "阿紅" },
            prince: { nickname: princeUser?.nickname ?? curCouple.prince.nickname ?? "阿藍" },
            // 補齊原本遺漏的 couple 欄位
            relationshipType: cr.relationship_type ?? curCouple.relationshipType,
            pausedAt: cr.paused_at ?? curCouple.pausedAt,
            pauseReason: cr.pause_reason ?? curCouple.pauseReason,
            pauseInitiator: cr.pause_initiator ?? curCouple.pauseInitiator,
            archivedAt: cr.archived_at ?? curCouple.archivedAt,
          },
          submissions: (remote.submissions ?? []).map((s: any) => ({
            id: s.id,
            taskId: s.task_id,
            taskTitle: s.task_title,
            reward: s.reward,
            submittedBy: remote.users?.find((u: any) => u.id === s.submitted_by)?.role ?? "queen",
            status: s.status,
            createdAt: new Date(s.created_at).toLocaleString("zh-TW"),
            reviewedAt: s.reviewed_at ? new Date(s.reviewed_at).toLocaleString("zh-TW") : undefined,
            note: s.note,
          })),
          pet: (() => {
            if (!remote.pet) return get().pet;
            const local = get().pet;
            // Race condition guard：若 local 比 remote 新（剛點擊還沒 mirror 完），保留 local
            const localTs = new Date(local.lastFedAt).getTime();
            const remoteTs = new Date(remote.pet.last_fed_at).getTime();
            if (localTs > remoteTs + 1000) return local; // +1s 容忍
            // 重要：所有欄位用 `?? local.xxx` fallback，避免 remote 該欄位為 undefined/null 時把本機累加值洗成 0
            // （Supabase 若 migration 沒跑到某欄位，remote.pet.xxx 會是 undefined）
            return {
              ...local,
              name: remote.pet.name ?? local.name,
              stage: remote.pet.stage ?? local.stage,
              attrs: remote.pet.attrs ?? local.attrs,
              lastFedAt: remote.pet.last_fed_at ?? local.lastFedAt,
              bondQueen: remote.pet.bond_queen ?? local.bondQueen ?? 0,
              bondPrince: remote.pet.bond_prince ?? local.bondPrince ?? 0,
              feedCountQueen: remote.pet.feed_count_queen ?? local.feedCountQueen ?? 0,
              feedCountPrince: remote.pet.feed_count_prince ?? local.feedCountPrince ?? 0,
              lastFedBy: remote.pet.last_fed_by ?? local.lastFedBy,
              species: remote.pet.species ?? local.species,
              rarity: remote.pet.rarity ?? local.rarity,
              gene: {
                color: remote.pet.gene_color ?? local.gene?.color,
                pattern: remote.pet.gene_pattern ?? local.gene?.pattern,
                face: remote.pet.gene_face ?? local.gene?.face,
                accessory: remote.pet.gene_accessory ?? local.gene?.accessory,
              },
              mintCount: remote.pet.mint_count ?? local.mintCount ?? 0,
              isFounder: remote.pet.is_founder ?? local.isFounder ?? false,
            };
          })(),
          // 圖鑑：合併 catalog 定義 + 已擁有卡片
          codex: get().codex.map((c) => {
            const owned = (remote.codex ?? []).find((mc: any) => mc.card_id === c.id);
            return owned ? { ...c, obtainedAt: owned.obtained_at?.slice(0, 10) } : { ...c, obtainedAt: null };
          }),
          redemptions: (remote.redemptions ?? []).map((r: any) => ({
            id: r.id,
            rewardId: r.reward_id,
            rewardTitle: r.reward_title,
            cost: r.cost,
            redeemedBy: remote.users?.find((u: any) => u.id === r.redeemed_by)?.role ?? "queen",
            status: r.status,
            createdAt: new Date(r.created_at).toLocaleDateString("zh-TW"),
          })),
          // 跨裝置同步：pet_instances 多寵（若 remote 有 rows 則覆蓋 pets[]）
          pets: (() => {
            const rows = (remote as any).petInstances ?? [];
            if (!Array.isArray(rows) || rows.length === 0) return get().pets;
            return rows.map((r: any) => ({
              id: `p_${r.id.slice(0, 8)}`, // local id 用 uuid 前 8 字當 short id
              remoteId: r.id,
              name: r.name,
              stage: (r.stage ?? 0) as 0 | 1 | 2 | 3 | 4,
              attrs: r.attrs ?? { intimacy: 0, communication: 0, romance: 0, care: 0, surprise: 0 },
              lastFedAt: r.last_fed_at,
              bondQueen: r.bond_queen ?? 0,
              bondPrince: r.bond_prince ?? 0,
              feedCountQueen: r.feed_count_queen ?? 0,
              feedCountPrince: r.feed_count_prince ?? 0,
              lastFedBy: r.last_fed_by,
              species: r.species,
              rarity: r.gene_rarity,
              gene: {
                color: r.gene_color,
                pattern: r.gene_pattern,
                face: r.gene_face,
                accessory: r.gene_accessory,
              },
              mintCount: 0, // 沒單獨欄位，後續由 parent lookup 計算
              parentAId: r.parent_a_id ?? undefined,
              parentBId: r.parent_b_id ?? undefined,
              generation: r.generation ?? 0,
              lastMatedAt: r.last_mated_at ?? undefined,
            }));
          })(),
          // 跨裝置同步：自訂儀式
          customRituals: (() => {
            const rows = (remote as any).customRituals ?? [];
            if (!Array.isArray(rows) || rows.length === 0) return get().customRituals;
            const next: { morning?: { label: string; desc: string; emoji: string }; night?: { label: string; desc: string; emoji: string } } = {};
            for (const r of rows) {
              if (r.kind === "morning" || r.kind === "night") {
                next[r.kind as "morning" | "night"] = {
                  label: r.label,
                  desc: r.description ?? "",
                  emoji: r.emoji ?? "",
                };
              }
            }
            return next;
          })(),
          // 跨裝置同步：紀念日
          anniversaries: (() => {
            const rows = (remote as any).anniversaries ?? [];
            if (!Array.isArray(rows)) return get().anniversaries;
            return rows.map((r: any) => ({
              id: r.id,
              label: r.label,
              date: r.date,
              recurring: r.recurring ?? true,
              emoji: r.emoji ?? "💝",
            }));
          })(),
          // 跨裝置同步：人生清單完成項
          bucketList: (() => {
            const rows = (remote as any).bucketRecords ?? [];
            if (!Array.isArray(rows)) return get().bucketList;
            return rows.map((r: any) => ({
              id: r.id,
              doneAt: r.done_at,
              note: r.note ?? undefined,
              photoUrl: r.photo_url ?? undefined,
            }));
          })(),
          // 跨裝置同步：遠端 island_items → local island（從 ISLAND_SHOP 查 label/emoji）
          island: (() => {
            const remoteItems = remote.island ?? [];
            if (!Array.isArray(remoteItems) || remoteItems.length === 0) return get().island;
            return remoteItems.map((r: any) => {
              const shop = ISLAND_SHOP.find((s) => s.id === r.catalog_id);
              return {
                id: r.id,
                catalogId: r.catalog_id,
                label: shop?.label ?? r.catalog_id ?? "物件",
                emoji: shop?.emoji ?? "📦",
                x: r.x,
                y: r.y,
              };
            });
          })(),
          ritual: remote.rituals ? {
            date: remote.rituals.date,
            morning: remote.rituals.morning,
            night: remote.rituals.night,
          } : get().ritual,
          streak: remote.streak ? {
            current: remote.streak.current,
            longest: remote.streak.longest,
            lastDate: remote.streak.last_date ?? "",
            knightShields: (remote.streak as any).knight_shields ?? 1,
            knightShieldsResetWeek: (remote.streak as any).knight_shields_reset_week ?? "",
          } : get().streak,
          questionAnswers: (remote.questionAnswers ?? []).map((qa: any) => ({
            id: qa.id,
            questionId: qa.question_id,
            answeredBy: remote.users?.find((u: any) => u.id === qa.answered_by)?.role ?? "queen",
            text: qa.text,
            createdAt: new Date(qa.created_at).toLocaleString("zh-TW"),
            rating: qa.rating,
            ratingComment: qa.rating_comment,
            ratedAt: qa.rated_at,
          })),
          moments: (remote.moments ?? []).map((m: any) => ({
            id: m.id,
            coupleId: m.couple_id,
            coupleName: m.couple_name,
            type: m.type,
            title: m.title,
            subtitle: m.subtitle,
            emoji: m.emoji,
            createdAt: new Date(m.created_at).toLocaleString("zh-TW"),
            likes: m.likes ?? 0,
            likedByMe: false,
            comments: m.comments ?? 0,
            isSelf: m.couple_id === cr.id,
          })),
          gifts: (remote.gifts ?? []).map((g: any) => ({
            id: g.id,
            fromCoupleName: g.from_couple_id === cr.id ? get().couple.name : "系統",
            type: g.kind,
            content: g.content ?? "",
            message: g.message ?? "",
            receivedAt: new Date(g.created_at).toLocaleDateString("zh-TW"),
            read: !!g.read_at,
          })),
          // 排行榜：真實 Supabase couples，empty 時就空
          leaderboard: (remote.publicCouples ?? []).map((c: any) => ({
            id: c.id,
            name: c.name,
            kingdomLevel: c.kingdom_level ?? 1,
            loveIndex: c.love_index ?? 0,
            streak: 0,
            codexCompletion: 0,
            weeklyTasks: 0,
            title: c.title ?? "見習情人",
            emoji: c.id === cr.id ? "👑" : "💞",
            isSelf: c.id === cr.id,
          })),
          // 聯盟 / 好友：從真實資料還原；empty 代表新 couple 還沒加入任何
          alliances: (remote.alliances ?? []).map((a: any) => {
            const members = (remote.allianceMembers ?? [])
              .filter((m: any) => m.alliance_id === a.id)
              .map((m: any) => m.couple_id);
            return {
              id: a.id,
              name: a.name,
              description: a.description ?? "",
              members,
              weeklyProgress: a.weekly_progress ?? 0,
              weeklyTarget: a.weekly_target ?? 200,
              questTitle: a.quest_title ?? "本週挑戰",
              bossHp: a.boss_hp,
              bossMaxHp: a.boss_max_hp,
              bossName: a.boss_name,
              sharedIsland: [],
            };
          }),
          friends: (remote.friendships ?? []).map((f: any) => ({
            coupleId: f.couple_a_id === cr.id ? f.couple_b_id : f.couple_a_id,
            since: f.since ?? new Date().toISOString(),
          })),
        });
      },

      checkAchievements: () => {
        const s = get();
        const snap = {
          couple: { kingdomLevel: s.couple.kingdomLevel, coins: s.couple.coins, loveIndex: s.couple.loveIndex },
          streak: { current: s.streak.current, longest: s.streak.longest },
          pet: { stage: s.pet.stage, attrs: s.pet.attrs },
          submissionsApproved: s.submissions.filter((x) => x.status === "approved").length,
          cardsOwned: s.codex.filter((c) => c.obtainedAt).length,
          cardsSSR: s.codex.filter((c) => c.obtainedAt && c.rarity === "SSR").length,
          alliancesJoined: s.alliances.filter((a) => a.members.includes("me")).length,
          friendsCount: s.friends.length,
          visitsSent: s.visitsSent,
          pkWins: s.pkWins,
          momentsSelf: s.moments.filter((m) => m.isSelf).length,
          pikminsTotal: s.pikmins.reduce((a, p) => a + p.count, 0),
          questionsAnswered: s.questionAnswers.length,
          questionsFiveStar: s.questionAnswers.filter((q) => q.rating === 5).length,
        };
        const unlocked = [...s.achievements];
        const newly: typeof ACHIEVEMENTS = [];
        for (const ach of ACHIEVEMENTS) {
          if (unlocked.includes(ach.id)) continue;
          let passes = false;
          try { passes = ach.check(snap); } catch { passes = false; }
          if (passes) {
            unlocked.push(ach.id);
            newly.push(ach);
          }
        }
        if (newly.length) {
          set({ achievements: unlocked });
          newly.forEach((ach) => {
            get().addNotification({
              type: "system",
              title: `🏅 成就解鎖：${ach.title}`,
              body: ach.description,
              emoji: ach.emoji,
              link: "/achievements",
            });
          });
        }
      },

      recordPkWin: () => {
        const s = get();
        const reward = 30 + Math.floor(Math.random() * 40); // 30-70 金
        set({
          pkWins: s.pkWins + 1,
          couple: { ...s.couple, coins: s.couple.coins + reward, loveIndex: s.couple.loveIndex + 15 },
        });
      },

      consumePkQuota: () => {
        const today = new Date().toISOString().slice(0, 10);
        const q = get().pkQuota;
        const used = q.date === today ? q.used + 1 : 1;
        set({ pkQuota: { date: today, used } });
      },
      recordVisit: () => set({ visitsSent: get().visitsSent + 1 }),

      claimDailyBonus: () => {
        const today = new Date().toISOString().slice(0, 10);
        if (get().lastLoginDate === today) return { claimed: false };

        const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
        const continuous = get().lastLoginDate === yesterday;
        const nextDay = continuous ? (get().dailyLoginDay % 7) + 1 : 1;

        // 根據 DAILY_BONUSES[nextDay-1] 發獎
        const bonus = [
          { coins: 10 },
          { coins: 20 },
          { card: true },
          { coins: 30, xp: 10 },
          { coins: 50 },
          { petBoost: 5 },
          { coins: 100, xp: 30, card: true },
        ][nextDay - 1];

        let rewardLabel: string[] = [];
        if (bonus.coins) {
          set({ couple: { ...get().couple, coins: get().couple.coins + bonus.coins } });
          rewardLabel.push(`+${bonus.coins} 金幣`);
        }
        if (bonus.xp) {
          const nextLove = get().couple.loveIndex + bonus.xp;
          const nextLevel = Math.max(get().couple.kingdomLevel, Math.floor(nextLove / 50) + 1);
          set({ couple: { ...get().couple, loveIndex: nextLove, kingdomLevel: nextLevel } });
          rewardLabel.push(`+${bonus.xp} 愛意`);
        }
        if (bonus.card) {
          const uncollected = get().codex.filter((c) => !c.obtainedAt);
          if (uncollected.length) {
            const pick = uncollected[Math.floor(Math.random() * uncollected.length)];
            set({
              codex: get().codex.map((c) =>
                c.id === pick.id ? { ...c, obtainedAt: today } : c,
              ),
            });
            rewardLabel.push(`${pick.emoji} ${pick.rarity} 卡`);
          }
        }
        if (bonus.petBoost) {
          const attrs = get().pet.attrs;
          const boosted = Object.fromEntries(
            Object.entries(attrs).map(([k, v]) => [k, Math.min(100, v + bonus.petBoost!)]),
          ) as typeof attrs;
          const boostedPet = { ...get().pet, attrs: boosted };
          set({ pet: boostedPet, pets: syncActivePetInArray(get().pets, boostedPet) });
          rewardLabel.push(`寵物全屬性 +${bonus.petBoost}`);
        }

        set({ lastLoginDate: today, dailyLoginDay: nextDay });
        return { claimed: true, day: nextDay, reward: rewardLabel.join("、") };
      },

      addAnniversary: (label, date, recurring, emoji) => {
        const id = crypto?.randomUUID ? crypto.randomUUID() : uid();
        const anniv = { id, label, date, recurring, emoji };
        set({ anniversaries: [...get().anniversaries, anniv] });
        if (isSupabaseEnabled() && get().couple.id !== "me") {
          insertAnniversaryRemote(get().couple.id, anniv).catch(() => null);
        }
      },

      removeAnniversary: (id) => {
        set({ anniversaries: get().anniversaries.filter((a) => a.id !== id) });
        if (isSupabaseEnabled() && get().couple.id !== "me") {
          removeAnniversaryRemote(id).catch(() => null);
        }
      },

      submitQuestionAnswer: (questionId, text) => {
        const clean = text.trim();
        if (!clean) return;
        const q = getQuestionById(questionId);
        if (!q) return;
        const answer: QuestionAnswer = {
          id: uid(),
          questionId,
          answeredBy: get().role,
          text: clean.slice(0, 500),
          createdAt: nowStr(),
        };
        set({ questionAnswers: [answer, ...get().questionAnswers] });
        const xp = DEPTH_LABELS[q.depth].xp;
        const nextLove = get().couple.loveIndex + xp;
        const nextLevel = Math.max(get().couple.kingdomLevel, Math.floor(nextLove / 50) + 1);
        const nextCouple = { ...get().couple, loveIndex: nextLove, kingdomLevel: nextLevel };
        set({ couple: nextCouple });
        mirrorCouple(nextCouple.id, { loveIndex: nextLove, kingdomLevel: nextLevel });
        if (isSupabaseEnabled() && nextCouple.id !== "me") {
          (async () => {
            const u = await getCurrentUser();
            if (u?.id) insertQuestionAnswerRemote(nextCouple.id, u.id, questionId, clean).catch(() => null);
          })();
        }
        // Auto quest：答題 → dq_q1
        get()._autoCheckQuest(["dq_q1"]);
        const senderName = get().role === "queen" ? get().couple.queen.nickname : get().couple.prince.nickname;
        get().addNotification({
          type: "interaction",
          title: `💭 ${senderName} 回答了一題問答`,
          body: `「${q.text.slice(0, 40)}${q.text.length > 40 ? "…" : ""}」· 去看看並給評分`,
          emoji: "💭",
          link: "/questions",
          priority: "high",
          fromRole: get().role,
        });
        get().checkAchievements();
      },

      rateQuestionAnswer: (answerId, rating, comment) => {
        const clamped = Math.max(1, Math.min(5, Math.floor(rating)));
        set({
          questionAnswers: get().questionAnswers.map((a) =>
            a.id === answerId
              ? { ...a, rating: clamped, ratingComment: comment?.slice(0, 200), ratedAt: nowStr() }
              : a,
          ),
        });
        if (isSupabaseEnabled() && get().couple.id !== "me") {
          rateQuestionAnswerRemote(answerId, clamped, comment).catch(() => null);
        }
        // 高分 (>=4) 額外獎勵 XP + 有機會掉卡
        if (clamped >= 4) {
          const bonus = clamped === 5 ? 15 : 8;
          const nextLove = get().couple.loveIndex + bonus;
          const nextLevel = Math.max(get().couple.kingdomLevel, Math.floor(nextLove / 50) + 1);
          set({ couple: { ...get().couple, loveIndex: nextLove, kingdomLevel: nextLevel } });
          // 5 星 → 有機會掉記憶卡
          if (clamped === 5 && Math.random() < 0.3) {
            const uncollected = get().codex.filter((c) => !c.obtainedAt);
            if (uncollected.length) {
              const pick = uncollected[Math.floor(Math.random() * uncollected.length)];
              set({
                codex: get().codex.map((c) =>
                  c.id === pick.id ? { ...c, obtainedAt: new Date().toISOString().slice(0, 10) } : c,
                ),
              });
              get().addMoment({
                type: pick.rarity === "SSR" ? "ssr_card" : pick.rarity === "SR" ? "sr_card" : "custom",
                title: `深度問答 5 星 → ${pick.rarity} 卡掉落`,
                subtitle: `「${pick.name}」${pick.emoji}`,
                emoji: pick.emoji,
              });
            }
          }
        }
        // 通知答題者：你得到評分了
        const ans = get().questionAnswers.find((a) => a.id === answerId);
        if (ans) {
          const raterRole = get().role;
          const raterName = raterRole === "queen" ? get().couple.queen.nickname : get().couple.prince.nickname;
          get().addNotification({
            type: "interaction",
            title: `⭐ ${raterName} 給你的回答打了 ${clamped} 星`,
            body: comment ? `「${comment.slice(0, 40)}」` : (clamped >= 4 ? "獎勵 XP + 有機會掉卡" : "再接再厲"),
            emoji: clamped === 5 ? "🌟" : clamped >= 4 ? "⭐" : "💬",
            link: "/questions",
            priority: clamped >= 4 ? "high" : "normal",
            fromRole: raterRole,
          });
        }
        get().checkAchievements();
      },

      resetAllData: () => {
        // 清掉所有 persist 並重新 hydrate → 等同首次使用
        if (typeof window !== "undefined") {
          try {
            localStorage.removeItem("love-empire-v3");
            localStorage.removeItem("star-tied-empire-demo-v2");
            localStorage.removeItem("love-empire-demo-v1");
          } catch {}
          window.location.href = "/";
        }
      },

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
        // 每日任務送審上限 10 次
        const today = new Date().toISOString().slice(0, 10);
        const q = get().taskQuota;
        const usedToday = q.date === today ? q.used : 0;
        if (usedToday >= 10) {
          get().addNotification({
            type: "system",
            title: "⚠️ 今日任務送審上限",
            body: "每天最多送 10 個任務審核。明天再來吧～",
            emoji: "⏰",
            priority: "normal",
          });
          return;
        }
        set({ taskQuota: { date: today, used: usedToday + 1 } });
        const role = get().role;
        const sub: Submission = {
          id: uid(),
          taskId,
          taskTitle: t.title,
          reward: t.reward,
          submittedBy: role,
          status: "pending",
          createdAt: nowStr(),
        };
        set({ submissions: [sub, ...get().submissions] });

        // 互動類任務偵測 — 標 high priority + 儀式感文案
        const senderName = role === "queen" ? get().couple.queen.nickname : get().couple.prince.nickname;
        const isInteraction =
          t.category === "romance" ||
          /擁抱|親|吻|情話|早安|晚安|撒嬌|說愛|我愛你|想你|按摩|告白/.test(t.title);
        const interactionEmoji =
          /擁抱/.test(t.title) ? "🫂" :
          /親|吻/.test(t.title) ? "💋" :
          /早安/.test(t.title) ? "☀️" :
          /晚安/.test(t.title) ? "🌙" :
          /按摩/.test(t.title) ? "💆" :
          /情話|我愛你|告白/.test(t.title) ? "💕" :
          "📜";

        get().addNotification({
          type: isInteraction ? "interaction" : "submission",
          title: isInteraction ? `${interactionEmoji} ${senderName} 送你：${t.title}` : "📜 有新申報要審核",
          body: isInteraction ? `先收下再去准奏 · +${t.reward} 金` : `${t.title} · ${t.reward} 金幣`,
          emoji: isInteraction ? interactionEmoji : "📜",
          link: "/tasks",
          priority: isInteraction ? "high" : "normal",
          fromRole: role,
        });
        // Supabase mirror
        if (isSupabaseEnabled()) {
          (async () => {
            const user = await getCurrentUser();
            if (!user) return;
            const coupleId = get().couple.id;
            if (!coupleId || coupleId === "me") return;
            await sbInsertSubmission(coupleId, user.id, {
              taskId: t.id, taskTitle: t.title, reward: t.reward,
            });
          })();
        }
      },

      reviewSubmission: (id, approve, note) => {
        const sOrig = get().submissions.find((x) => x.id === id);
        const subs = get().submissions.map((s) =>
          s.id === id ? { ...s, status: approve ? ("approved" as const) : ("rejected" as const), reviewedAt: nowStr(), note } : s,
        );
        set({ submissions: subs });
        if (sOrig) {
          get().addNotification({
            type: "review",
            title: approve ? "✅ 申報被准奏" : "❌ 申報被駁回",
            body: `${sOrig.taskTitle}${note ? ` · ${note}` : ""}`,
            emoji: approve ? "✅" : "❌",
            link: "/history",
          });
        }
        // Supabase mirror
        if (isSupabaseEnabled()) {
          (async () => {
            const user = await getCurrentUser();
            if (!user) return;
            await reviewSubmissionRemote(id, approve, user.id, note);
          })();
        }
        if (approve) {
          // Auto quest：審核 2 個 → dq_approve2（累計 check，不一次觸發）
          const approvedToday = subs.filter((s) => s.status === "approved" && s.reviewedAt && s.reviewedAt.includes(new Date().toLocaleDateString("zh-TW").slice(0, 10))).length;
          if (approvedToday >= 2) get()._autoCheckQuest(["dq_approve2"]);
          // Auto quest: chore 類完成 → dq_chore
          const task0 = get().tasks.find((t) => t.id === subs.find((x) => x.id === id)?.taskId);
          if (task0?.category === "chore") get()._autoCheckQuest(["dq_chore"]);

          const s = subs.find((x) => x.id === id)!;
          const task = get().tasks.find((t) => t.id === s.taskId);
          const attr = task?.attribute ?? "intimacy";
          const baseXp = task?.systemXp ?? 5;

          // 特別日雙倍 XP
          const xpMultiplier = isSpecialDay() ? SPECIAL_DAY_MULTIPLIER : 1;

          // 合作任務 dual-submission bonus：若雙方今日都申報過同一合作任務 → 1.5x
          let coopBonus = 1;
          if (task?.direction === "together" && task?.coop) {
            const today = new Date().toISOString().slice(0, 10);
            const bothSubmitted = ["queen", "prince"].every((r) =>
              get().submissions.some((x) =>
                x.taskId === task.id &&
                x.status === "approved" &&
                x.submittedBy === r &&
                (x.reviewedAt ?? x.createdAt).includes(today.replace(/-/g, "/").slice(5)) // 粗略日期匹配
              )
            );
            if (bothSubmitted) coopBonus = 1.5;
          }

          const systemXp = Math.round(baseXp * xpMultiplier * coopBonus);

          // 王妃被動：溫柔光環 — 金幣 +10% (只在申報者是王妃時)
          const queenBonus = s.submittedBy === "queen" ? QUEEN_COIN_BONUS : 0;
          const finalCoins = Math.round(s.reward * (1 + queenBonus) * coopBonus);

          const prevLove = get().couple.loveIndex;
          const prevLevel = get().couple.kingdomLevel;
          const nextLove = prevLove + systemXp;
          const nextLevel = Math.max(prevLevel, Math.floor(nextLove / 50) + 1);
          const nextCouple = {
            ...get().couple,
            coins: get().couple.coins + finalCoins,
            loveIndex: nextLove,
            kingdomLevel: nextLevel,
          };
          const nextPet = {
            ...get().pet,
            attrs: { ...get().pet.attrs, [attr]: Math.min(100, get().pet.attrs[attr] + 2) },
            lastFedAt: new Date().toISOString(),
          };
          set({ couple: nextCouple, pet: nextPet, pets: syncActivePetInArray(get().pets, nextPet) });
          mirrorCouple(nextCouple.id, { coins: nextCouple.coins, loveIndex: nextCouple.loveIndex, kingdomLevel: nextCouple.kingdomLevel });
          mirrorPet(nextCouple.id, nextPet);

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
          const festivalBoost = uncollected.some((c) => c.festival) ? 0.6 : 0.4;
          if (uncollected.length && Math.random() < festivalBoost) {
            const festivalCards = uncollected.filter((c) => c.festival);
            const pool = festivalCards.length && Math.random() < 0.5 ? festivalCards : uncollected;
            const pick = pool[Math.floor(Math.random() * pool.length)];
            set({
              codex: get().codex.map((c) =>
                c.id === pick.id ? { ...c, obtainedAt: new Date().toISOString().slice(0, 10) } : c,
              ),
            });
            if (isSupabaseEnabled() && nextCouple.id !== "me") {
              addMemoryCardRemote(nextCouple.id, pick.id).catch(() => null);
            }
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
          // 檢查成就
          get().checkAchievements();
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
          icon: r.icon,
          category: r.category,
          adult: r.adult,
        };
        const nextCouple = { ...get().couple, coins: get().couple.coins - r.cost };
        set({
          redemptions: [redemption, ...get().redemptions],
          couple: nextCouple,
        });
        mirrorCouple(nextCouple.id, { coins: nextCouple.coins });
        if (isSupabaseEnabled() && nextCouple.id !== "me") {
          (async () => {
            const u = await getCurrentUser();
            if (u?.id) insertRedemption(nextCouple.id, u.id, r.id, r.title, r.cost).catch(() => null);
          })();
        }
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

      useRedemption: (id, note) => {
        const today = new Date().toLocaleDateString("zh-TW");
        set({
          redemptions: get().redemptions.map((r) =>
            r.id === id
              ? { ...r, status: "used" as const, usedAt: today, usedNote: note?.trim() || undefined }
              : r,
          ),
        });
      },

      feedPet: (attr) => {
        const prev = get().pet;
        const role = get().role;
        // 種系屬性偏向加成（如 Nuzzle intimacy +30%）+ 稀有度 attr cap（N 60 / R 75 / SR 85 / SSR 95 / UR 100）
        const bonus = attrBonusMultiplier(prev.species, attr);
        const attrDelta = Math.round(5 * bonus);
        const cap = PET_RARITY[resolvePetRarity(prev.rarity)].attrCap;
        const nextAttrVal = Math.min(cap, prev.attrs[attr] + attrDelta);
        const nextAttrs = { ...prev.attrs, [attr]: nextAttrVal };
        const avg = Object.values(nextAttrs).reduce((a, b) => a + b, 0) / 5;

        // 雙主人 bond：餵食 +5 屬性 +4 bond（自己）; 連續互動小加成
        const bondDelta = 4;
        const bondQueen = Math.min(100, (prev.bondQueen ?? 0) + (role === "queen" ? bondDelta : 0));
        const bondPrince = Math.min(100, (prev.bondPrince ?? 0) + (role === "prince" ? bondDelta : 0));
        const feedCountQueen = (prev.feedCountQueen ?? 0) + (role === "queen" ? 1 : 0);
        const feedCountPrince = (prev.feedCountPrince ?? 0) + (role === "prince" ? 1 : 0);
        const totalFeeds = feedCountQueen + feedCountPrince;

        // 進化規則（使用者：孵化盡量簡單，成長變化才是主軸）
        //   stage 1 (幼體) — 只要餵 2 次就破殼（任一人都算）
        //   stage 2 (成型) — avg ≥ 30 且 兩人 bond 都 ≥ 15 (逼迫雙向互動)
        //   stage 3 (傳說) — avg ≥ 60 且 兩人 bond 都 ≥ 50
        //   stage 4 (神話) — avg ≥ 85 且 兩人 bond 都 ≥ 80
        const bothBond = (min: number) => bondQueen >= min && bondPrince >= min;
        // 進化門檻：依稀有度動態調整（v0.9.0 修正 R 稀有度永遠進不了神話的 bug）
        // stage N 門檻 = rarity attrCap × [0, 0, 0.30, 0.65, 0.90]
        const stageCap = PET_RARITY[resolvePetRarity(prev.rarity)].attrCap;
        const threshold2 = Math.round(stageCap * 0.30);
        const threshold3 = Math.round(stageCap * 0.65);
        const threshold4 = Math.round(stageCap * 0.90);
        let nextStage: Pet["stage"] = prev.stage;
        if (avg >= threshold4 && bothBond(80)) nextStage = 4;
        else if (avg >= threshold3 && bothBond(50)) nextStage = 3;
        else if (avg >= threshold2 && bothBond(15)) nextStage = 2;
        else if (totalFeeds >= 2) nextStage = Math.max(nextStage, 1) as Pet["stage"];
        const nextPet: Pet = {
          ...prev,
          attrs: nextAttrs,
          stage: nextStage,
          lastFedAt: new Date().toISOString(),
          bondQueen,
          bondPrince,
          feedCountQueen,
          feedCountPrince,
          lastFedBy: role,
        };
        set({ pet: nextPet, pets: syncActivePetInArray(get().pets, nextPet) });
        mirrorPet(get().couple.id, nextPet);
        // Auto quest：餵食 1 次 → 標記 dq_feedPet
        get()._autoCheckQuest(["dq_feedPet"]);
        // 進化自動發動態
        if (nextStage > prev.stage) {
          const stageName = ["蛋", "幼體", "成型", "傳說", "神話"][nextStage];
          const stageEmoji = ["🥚", "🐣", "🐥", "🦄", "🌟"][nextStage];
          get().addMoment({
            type: "pet_evolve",
            title: `寵物進化為「${stageName}」`,
            subtitle: `${prev.name} 蛻變中 ✨`,
            emoji: stageEmoji,
          });
        }
        get().checkAchievements();
      },

      petInteract: (kind, message) => {
        const role = get().role;
        const prev = get().pet;
        let bondDelta = 0;
        let coinCost = 0;
        let attrBump: Partial<Pet["attrs"]> = {};
        let toastEmoji = "💝";
        let momentTitle = "";

        if (kind === "pet") {
          bondDelta = 2;
          toastEmoji = "🫳";
          momentTitle = `${role === "queen" ? get().couple.queen.nickname : get().couple.prince.nickname} 撫摸了 ${prev.name}`;
        } else if (kind === "treat") {
          coinCost = 20;
          if (get().couple.coins < coinCost) return { ok: false, reason: "金幣不足" };
          bondDelta = 5;
          // 隨機加 1 個屬性 +3
          const keys = Object.keys(prev.attrs) as Array<keyof Pet["attrs"]>;
          const randKey = keys[Math.floor(Math.random() * keys.length)];
          attrBump[randKey] = Math.min(100, prev.attrs[randKey] + 3) - prev.attrs[randKey];
          toastEmoji = "🍬";
          momentTitle = `餵 ${prev.name} 吃零食`;
        } else if (kind === "talk") {
          bondDelta = 3;
          attrBump.communication = Math.min(100, prev.attrs.communication + 3) - prev.attrs.communication;
          toastEmoji = "💬";
          momentTitle = `跟 ${prev.name} 聊天`;
        }

        const nextAttrs = { ...prev.attrs };
        for (const [k, delta] of Object.entries(attrBump)) {
          nextAttrs[k as keyof Pet["attrs"]] = (nextAttrs[k as keyof Pet["attrs"]] ?? 0) + (delta ?? 0);
        }

        const bondQueen = Math.min(100, (prev.bondQueen ?? 0) + (role === "queen" ? bondDelta : 0));
        const bondPrince = Math.min(100, (prev.bondPrince ?? 0) + (role === "prince" ? bondDelta : 0));
        // 餵零食 & 撫摸 & 聊天都算一次互動 — 累加到對應主人的 feedCount
        const feedCountQueen = (prev.feedCountQueen ?? 0) + (role === "queen" ? 1 : 0);
        const feedCountPrince = (prev.feedCountPrince ?? 0) + (role === "prince" ? 1 : 0);

        const nextPet: Pet = {
          ...prev,
          attrs: nextAttrs,
          lastFedAt: new Date().toISOString(),
          bondQueen,
          bondPrince,
          feedCountQueen,
          feedCountPrince,
          lastFedBy: role,
        };
        const nextCoupleCoins = get().couple.coins - coinCost;

        set({
          pet: nextPet,
          pets: syncActivePetInArray(get().pets, nextPet), // C2 多寵容器同步
          couple: { ...get().couple, coins: nextCoupleCoins },
        });
        mirrorPet(get().couple.id, nextPet);
        if (coinCost > 0) mirrorCouple(get().couple.id, { coins: nextCoupleCoins });

        // talk 額外存訊息到動態
        if (kind === "talk" && message?.trim()) {
          get().addMoment({
            type: "custom",
            title: momentTitle,
            subtitle: `「${message.trim().slice(0, 40)}」`,
            emoji: toastEmoji,
          });
        }

        return { ok: true };
      },

      toggleRitual: (kind) => {
        const today = new Date().toISOString().slice(0, 10);
        const r = get().ritual.date === today ? get().ritual : { date: today, morning: false, night: false };
        const next = { ...r, [kind]: !r[kind] };
        set({ ritual: next });
        if (isSupabaseEnabled() && get().couple.id !== "me") {
          upsertRitual(get().couple.id, next.morning, next.night).catch(() => null);
        }
        if (next.morning || next.night) {
          const nextCouple = { ...get().couple, coins: get().couple.coins + 5 };
          set({ couple: nextCouple });
          mirrorCouple(nextCouple.id, { coins: nextCouple.coins });
          // Auto quest：完成任一儀式 → dq_ritual
          get()._autoCheckQuest(["dq_ritual"]);
        }
        // 早晚儀式都達成 + 今天第一次完成 → 連擊 +1 + 里程碑檢查
        if (next.morning && next.night) {
          const s = get().streak;
          const isoWeek = getIsoWeek(new Date());
          const shieldsReset = s.knightShieldsResetWeek !== isoWeek;
          const baseShields = shieldsReset ? 1 : (s.knightShields ?? 0);

          if (s.lastDate !== today) {
            const prev = s.current;
            const nextCurrent = prev + 1;
            const nextStreak = {
              ...s,
              current: nextCurrent,
              longest: Math.max(s.longest, nextCurrent),
              lastDate: today,
              knightShields: baseShields,
              knightShieldsResetWeek: isoWeek,
            };
            set({ streak: nextStreak });
            if (isSupabaseEnabled() && get().couple.id !== "me") {
              updateStreak(get().couple.id, nextStreak.current, nextStreak.longest, {
                knightShields: nextStreak.knightShields,
                knightShieldsResetWeek: nextStreak.knightShieldsResetWeek,
                lastDate: nextStreak.lastDate,
              }).catch(() => null);
            }
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

      moveIslandItem: (id, x, y) => {
        set({ island: get().island.map((it) => (it.id === id ? { ...it, x, y } : it)) });
        if (isSupabaseEnabled() && get().couple.id !== "me") {
          moveIslandItemRemote(id, x, y).catch(() => null);
        }
      },

      buyIslandItem: (catalogId, label, emoji, price) => {
        if (get().couple.coins < price) return;
        const localId = uid();
        const nextCouple = { ...get().couple, coins: get().couple.coins - price };

        // 新家具依 room 預設放到對應區域（使用者可拖）
        // 舞台 100x100 百分比。上半 (<55) 為牆面，下半 (>55) 為地板。
        //   living (客廳)   → 地板中央偏左
        //   bedroom (臥室)  → 地板右下
        //   kitchen (廚房)  → 地板左下
        //   bathroom (浴室) → 地板右中
        //   garden (庭院)   → 上半左右（像窗外）
        //   deco (裝飾)     → 隨機散佈
        const ROOM_SPAWN: Record<string, { x: [number, number]; y: [number, number] }> = {
          living:   { x: [30, 55], y: [62, 80] },
          bedroom:  { x: [65, 90], y: [65, 85] },
          kitchen:  { x: [10, 35], y: [62, 80] },
          bathroom: { x: [65, 88], y: [58, 72] },
          garden:   { x: [15, 85], y: [20, 45] },
          deco:     { x: [20, 80], y: [40, 85] },
        };
        // 從 ISLAND_SHOP 找該 catalog 的 room
        const catalogItem = (get() as any).rewards ? undefined : undefined; // 不用 rewards
        // 動態 import 避免 cycle
        const pickSpawn = async () => {
          try {
            const { ISLAND_SHOP } = await import("./demoData");
            const shopItem = ISLAND_SHOP.find((s) => s.id === catalogId);
            const room = shopItem?.room ?? "deco";
            const range = ROOM_SPAWN[room] ?? ROOM_SPAWN.deco;
            const x = range.x[0] + Math.random() * (range.x[1] - range.x[0]);
            const y = range.y[0] + Math.random() * (range.y[1] - range.y[0]);
            return { x: Math.round(x), y: Math.round(y) };
          } catch {
            return { x: 50, y: 60 };
          }
        };

        // 先用 50,60 當 placeholder，之後非同步改 spawn 位置
        set({
          couple: nextCouple,
          island: [
            ...get().island,
            { id: localId, catalogId, label, emoji, x: 50, y: 60 },
          ],
        });
        mirrorCouple(nextCouple.id, { coins: nextCouple.coins });

        pickSpawn().then(({ x, y }) => {
          set({
            island: get().island.map((it) => (it.id === localId ? { ...it, x, y } : it)),
          });
          if (isSupabaseEnabled() && nextCouple.id !== "me") {
            addIslandItemRemote(nextCouple.id, catalogId, x, y).catch(() => null);
          }
        });
      },

      removeIslandItem: (id) => {
        set({ island: get().island.filter((it) => it.id !== id) });
        if (isSupabaseEnabled() && get().couple.id !== "me") {
          removeIslandItemRemote(id).catch(() => null);
        }
      },

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

      openGift: (giftId) => {
        set({
          gifts: get().gifts.map((g) => (g.id === giftId ? { ...g, read: true } : g)),
        });
      },

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

      addFriend: (coupleId) => {
        if (!coupleId) return { ok: false, reason: "缺少情侶 ID" };
        const target = get().leaderboard.find((c) => c.id === coupleId);
        if (!target) return { ok: false, reason: "找不到這對情侶" };
        if (target.isSelf) return { ok: false, reason: "不能加自己" };
        if (get().friends.some((f) => f.coupleId === coupleId)) {
          return { ok: false, reason: "已經是好友了" };
        }
        set({
          friends: [...get().friends, { coupleId, since: new Date().toISOString() }],
        });
        get().addNotification({
          type: "system",
          title: "新增好友情侶",
          body: `「${target.name}」已加入好友清單`,
          emoji: "👫",
          link: `/couples/${coupleId}`,
        });
        return { ok: true };
      },

      removeFriend: (coupleId) => {
        set({ friends: get().friends.filter((f) => f.coupleId !== coupleId) });
      },

      joinAlliance: (id) =>
        set({
          alliances: get().alliances.map((a) =>
            a.id === id && !a.members.includes("me")
              ? { ...a, members: [...a.members, "me"] }
              : a,
          ),
        }),

      leaveAlliance: (id) =>
        set({
          alliances: get().alliances.map((a) =>
            a.id === id ? { ...a, members: a.members.filter((m) => m !== "me") } : a,
          ),
        }),

      setCustomRitual: (kind, value) => {
        const next = { ...get().customRituals };
        if (value === null) delete next[kind];
        else next[kind] = value;
        set({ customRituals: next });
        if (isSupabaseEnabled() && get().couple.id !== "me") {
          upsertCustomRitualRemote(
            get().couple.id,
            kind,
            value === null ? null : { label: value.label, description: value.desc, emoji: value.emoji },
          ).catch(() => null);
        }
      },

      setShowAdultRewards: (v) => set({ showAdultRewards: v }),

      setMood: (mood) => {
        const role = get().role;
        set({ myMood: mood, moodUpdatedAt: new Date().toISOString() });
        // Mirror 到 Supabase users 表 → 對方下次 pull 會讀到
        if (isSupabaseEnabled() && get().couple.id !== "me") {
          (async () => {
            const u = await getCurrentUser();
            if (u?.id) updateUserMood(u.id, mood).catch(() => null);
          })();
        }
      },

      toggleBucketItem: (id, note, proof) => {
        const existing = get().bucketList.find((r) => r.id === id);
        if (existing) {
          // 已完成的不可取消（儀式感）— 但可更新 note / proof
          if (note !== undefined || proof !== undefined) {
            const updated = {
              ...existing,
              note: note !== undefined ? (note.trim() || undefined) : existing.note,
              proof: proof ? { ...proof, addedAt: new Date().toISOString() } : existing.proof,
            };
            set({
              bucketList: get().bucketList.map((r) => r.id === id ? updated : r),
            });
            if (isSupabaseEnabled() && get().couple.id !== "me") {
              upsertBucketRecordRemote(get().couple.id, {
                id: updated.id,
                doneAt: updated.doneAt,
                note: updated.note,
                photoUrl: updated.proof?.kind === "photo" ? updated.proof.value : undefined,
              }).catch(() => null);
            }
          }
          return { newlyDone: false };
        }
        const item = getBucketItemById(id);
        if (!item) return { newlyDone: false };
        const reward = BUCKET_REWARD[item.rarity];
        const record: BucketRecord = {
          id,
          doneAt: new Date().toISOString().slice(0, 10),
          note: note?.trim() || undefined,
          proof: proof ? { ...proof, addedAt: new Date().toISOString() } : undefined,
        };
        const c = get().couple;
        const nextCoupleBase = {
          ...c,
          coins: c.coins + reward.coins,
          loveIndex: c.loveIndex + reward.love,
        };
        set({
          bucketList: [...get().bucketList, record],
          couple: nextCoupleBase,
        });
        // mirror bucket + couple coins/love 到 Supabase
        if (isSupabaseEnabled() && c.id !== "me") {
          upsertBucketRecordRemote(c.id, {
            id: record.id,
            doneAt: record.doneAt,
            note: record.note,
            photoUrl: record.proof?.kind === "photo" ? record.proof.value : undefined,
          }).catch(() => null);
          mirrorCouple(c.id, { coins: nextCoupleBase.coins, loveIndex: nextCoupleBase.loveIndex });
        }
        // 發動態
        get().addMoment({
          type: "custom",
          title: `✨ 清單第 ${get().bucketList.length} 件完成`,
          subtitle: `${item.emoji} ${item.title}`,
          emoji: reward.emoji,
        });
        // SSR 項目額外通知
        if (item.rarity === "SSR") {
          get().addNotification({
            type: "system",
            title: "🌟 畢生紀念達成！",
            body: `${item.title} — 這份回憶你們永遠擁有`,
            emoji: "🌟",
          });
        }
        get().checkAchievements();
        // Auto quest：勾人生清單 → dq_bucket
        get()._autoCheckQuest(["dq_bucket"]);
        return { newlyDone: true, reward: { love: reward.love, coins: reward.coins } };
      },

      contributeAllianceItem: (allianceId, catalogId, label, emoji, price) => {
        const alliance = get().alliances.find((a) => a.id === allianceId);
        if (!alliance || !alliance.members.includes("me")) return;
        if (get().couple.coins < price) return;
        const newItem: IslandItem = {
          id: uid(),
          catalogId,
          label,
          emoji,
          x: 20 + Math.random() * 60,
          y: 20 + Math.random() * 60,
        };
        set({
          couple: { ...get().couple, coins: get().couple.coins - price },
          alliances: get().alliances.map((a) =>
            a.id === allianceId
              ? { ...a, sharedIsland: [...(a.sharedIsland ?? []), newItem] }
              : a,
          ),
        });
        get().addNotification({
          type: "system",
          title: "🏛️ 聯盟小窩有新裝飾",
          body: `「${alliance.name}」的共同空間多了 ${emoji} ${label}`,
          emoji: "🏛️",
          link: "/alliance",
        });
      },

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
      name: "love-empire-v6", // v5→v6 — 公測前強制清空所有舊 localStorage
      onRehydrateStorage: () => (state) => {
        if (typeof window === "undefined") return;
        try {
          const OLD_KEYS = ["love-empire-demo-v1", "star-tied-empire-demo-v2", "love-empire-v3", "love-empire-v4", "love-empire-v5"];
          // 只在「真的偵測到舊 v5 key 存在」時清一次（否則每次 hydrate 都清會把使用者的裝置綁定洗掉）
          const hasLegacy = OLD_KEYS.some((k) => {
            try { return localStorage.getItem(k) != null; } catch { return false; }
          });
          OLD_KEYS.forEach((k) => localStorage.removeItem(k));
          if (hasLegacy) {
            // 從舊版升上來時才需要強制重登（清裝置綁定 + Supabase anon session）
            localStorage.removeItem("loveempire.device.v1");
          }
        } catch { /* ignore */ }
        // 獎勵庫 < 16 → 補齊
        if (state && state.rewards && state.rewards.length < 16) {
          import("./demoData").then(({ INITIAL_REWARDS }) => {
            useGame.setState({ rewards: INITIAL_REWARDS });
          }).catch(() => null);
        }
        // 記憶圖鑑：新卡擴充時合併（保留已取得的 obtainedAt，補上新的未取得卡）
        if (state && state.codex) {
          import("./demoData").then(({ INITIAL_CODEX }) => {
            const current = useGame.getState().codex;
            const currentIds = new Set(current.map((c) => c.id));
            const missing = INITIAL_CODEX.filter((c) => !currentIds.has(c.id));
            if (missing.length > 0) {
              useGame.setState({ codex: [...current, ...missing] });
            }
          }).catch(() => null);
        }
        // Pet 沒 bond 欄位 → 初始化（估算：依現有 attrs 平均值推導，讓既有玩家不用從 0 開始）
        if (state && state.pet && state.pet.bondQueen === undefined) {
          const avg = Object.values(state.pet.attrs ?? {}).reduce((a: number, b: any) => a + (b ?? 0), 0) / 5;
          const baseBond = Math.floor(avg * 0.8); // 保守推估
          useGame.setState({
            pet: {
              ...state.pet,
              bondQueen: baseBond,
              bondPrince: baseBond,
              feedCountQueen: 0,
              feedCountPrince: 0,
            },
          });
        }
        // Founder 升級：沒 species 欄位 → 直接給 Lumen UR（初代玩家專屬）
        let founderUpgraded = false;
        if (state && state.pet && (!state.pet.species || state.pet.species === "basic") && !state.pet.isFounder) {
          const upgraded = {
            ...useGame.getState().pet,
            id: useGame.getState().pet.id ?? "p_primary",
            species: "lumen" as const,
            rarity: "mythic" as const,
            gene: {
              color: "rainbow" as const,
              pattern: "star" as const,
              face: "smile" as const,
              accessory: "wings" as const,
            },
            mintCount: 0,
            isFounder: true,
          };
          useGame.setState({ pet: upgraded });
          founderUpgraded = true;
        }
        // C2 多寵容器遷移：沒 pets[] 陣列 → 把現有 pet 包為 pets[0]
        if (state && state.pet && (!state.pets || state.pets.length === 0)) {
          const cur = useGame.getState().pet;
          const petWithId = cur.id ? cur : { ...cur, id: "p_primary" };
          useGame.setState({
            pet: petWithId,
            pets: [petWithId],
            activePetId: petWithId.id,
          });
        }
        // 升級後 mirror 到 Supabase（否則換裝置 pull 回來 species 還是 null）
        if (founderUpgraded) {
          setTimeout(() => {
            try {
              const s = useGame.getState();
              if (s.couple?.id && s.couple.id !== "me" && isSupabaseEnabled()) {
                upsertPet(s.couple.id, s.pet).catch(() => null);
              }
            } catch { /* ignore */ }
          }, 600); // 等 couple.id 也 hydrate 完
        }
      },
    },
  ),
);
