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
} from "./supabaseAdapter";
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
  notifications: NotificationItem[];
  achievements: string[];
  pkWins: number;
  pkQuota: { date: string; used: number }; // 每日 3 場
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
  setCustomRitual: (kind: "morning" | "night", value: { label: string; desc: string; emoji: string } | null) => void;
  setShowAdultRewards: (v: boolean) => void;
  toggleBucketItem: (id: string, note?: string) => { newlyDone: boolean; reward?: { love: number; coins: number } };
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

/** 把 pet 變動 mirror 到 Supabase */
function mirrorPet(coupleId: string, pet: Pet) {
  if (!isSupabaseEnabled() || !coupleId || coupleId === "me") return;
  upsertPet(coupleId, pet).catch(() => null);
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
      notifications: [],
      achievements: [],
      pkWins: 0,
      pkQuota: { date: "", used: 0 },
      visitsSent: 0,
      dailyLoginDay: 0,
      lastLoginDate: "",
      anniversaries: [],
      questionAnswers: [],
      bucketList: [],
      customRituals: {},
      showAdultRewards: false,
      notice: NOTICE,

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
        set({ pet: nextPet });
        mirrorPet(get().couple.id, nextPet);
      },

      setPrivacy: (p) => {
        const nextCouple = { ...get().couple, privacy: p };
        set({ couple: nextCouple });
        mirrorCouple(nextCouple.id, { privacy: p });
      },

      /** 檢查是否有缺席日、是否需要消耗騎士盾 */
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

        set({
          couple: {
            id: cr.id,
            name: cr.name,
            inviteCode: cr.invite_code,
            kingdomLevel: cr.kingdom_level,
            coins: cr.coins,
            title: cr.title,
            loveIndex: cr.love_index,
            bio: cr.bio ?? "",
            privacy: cr.privacy ?? "public",
            queen: { nickname: queenUser?.nickname ?? "阿紅" },
            prince: { nickname: princeUser?.nickname ?? "阿藍" },
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
          pet: remote.pet ? {
            name: remote.pet.name,
            stage: remote.pet.stage,
            attrs: remote.pet.attrs,
            lastFedAt: remote.pet.last_fed_at,
          } : get().pet,
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
          set({ pet: { ...get().pet, attrs: boosted } });
          rewardLabel.push(`寵物全屬性 +${bonus.petBoost}`);
        }

        set({ lastLoginDate: today, dailyLoginDay: nextDay });
        return { claimed: true, day: nextDay, reward: rewardLabel.join("、") };
      },

      addAnniversary: (label, date, recurring, emoji) => {
        const id = uid();
        set({ anniversaries: [...get().anniversaries, { id, label, date, recurring, emoji }] });
      },

      removeAnniversary: (id) => {
        set({ anniversaries: get().anniversaries.filter((a) => a.id !== id) });
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
        get().addNotification({
          type: "system",
          title: "💬 對方有新的回答",
          body: `${q.text}`,
          emoji: "💬",
          link: "/questions",
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
          set({ couple: nextCouple, pet: nextPet });
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
        const nextAttrVal = Math.min(100, prev.attrs[attr] + 5);
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
        let nextStage: Pet["stage"] = prev.stage;
        if (avg >= 85 && bothBond(80)) nextStage = 4;
        else if (avg >= 60 && bothBond(50)) nextStage = 3;
        else if (avg >= 30 && bothBond(15)) nextStage = 2;
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
        set({ pet: nextPet });
        mirrorPet(get().couple.id, nextPet);
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

        const nextPet: Pet = {
          ...prev,
          attrs: nextAttrs,
          lastFedAt: new Date().toISOString(),
          bondQueen,
          bondPrince,
          lastFedBy: role,
        };
        const nextCoupleCoins = get().couple.coins - coinCost;

        set({
          pet: nextPet,
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
              updateStreak(get().couple.id, nextStreak.current, nextStreak.longest).catch(() => null);
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
        set({
          couple: nextCouple,
          island: [
            ...get().island,
            { id: localId, catalogId, label, emoji, x: 50, y: 50 },
          ],
        });
        mirrorCouple(nextCouple.id, { coins: nextCouple.coins });
        if (isSupabaseEnabled() && nextCouple.id !== "me") {
          addIslandItemRemote(nextCouple.id, catalogId, 50, 50).catch(() => null);
        }
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
      },

      setShowAdultRewards: (v) => set({ showAdultRewards: v }),

      toggleBucketItem: (id, note) => {
        const existing = get().bucketList.find((r) => r.id === id);
        if (existing) {
          // 已完成的不可取消（儀式感）— 但可更新 note
          if (note !== undefined) {
            set({
              bucketList: get().bucketList.map((r) =>
                r.id === id ? { ...r, note: note.trim() || undefined } : r,
              ),
            });
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
      name: "love-empire-v5", // v4→v5 — Pet 加 bond 雙主人系統
      onRehydrateStorage: () => (state) => {
        if (typeof window === "undefined") return;
        try {
          const OLD_KEYS = ["love-empire-demo-v1", "star-tied-empire-demo-v2", "love-empire-v3", "love-empire-v4"];
          OLD_KEYS.forEach((k) => localStorage.removeItem(k));
        } catch { /* ignore */ }
        // 獎勵庫 < 16 → 補齊
        if (state && state.rewards && state.rewards.length < 16) {
          import("./demoData").then(({ INITIAL_REWARDS }) => {
            useGame.setState({ rewards: INITIAL_REWARDS });
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
      },
    },
  ),
);
