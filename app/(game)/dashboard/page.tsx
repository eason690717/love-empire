"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useGame } from "@/lib/store";
import { titleByLevel, PET_STAGE_LABEL, ATTR_LABEL } from "@/lib/utils";
import { PASSIVE_SKILLS, isSpecialDay, SPECIAL_DAY_LABEL, SPECIAL_DAY_MULTIPLIER } from "@/lib/passive";
import { AttributeRadar } from "@/components/AttributeRadar";
import { PetAvatar } from "@/components/art/PetAvatar";
import { DailyBonusModal } from "@/components/DailyBonusModal";
import { InviteCodeCard } from "@/components/InviteCodeCard";
import { MOOD_LABELS, type MoodState, type PetGeneRarity, type PetSpecies } from "@/lib/types";
import { SPECIES, resolveSpecies } from "@/lib/pet/species";
import { RARITY, resolveRarity } from "@/lib/pet/rarity";

/** Gacha 手遊風 — side rails + center scene + big CTA + stats */
export default function DashboardPage() {
  const couple = useGame((s) => s.couple);
  const role = useGame((s) => s.role);
  const streak = useGame((s) => s.streak);
  const pet = useGame((s) => s.pet);
  const codex = useGame((s) => s.codex);
  const submissions = useGame((s) => s.submissions);
  const redemptions = useGame((s) => s.redemptions);
  const moments = useGame((s) => s.moments);
  const leaderboard = useGame((s) => s.leaderboard);
  const ritual = useGame((s) => s.ritual);
  const questionAnswers = useGame((s) => s.questionAnswers);
  const notifications = useGame((s) => s.notifications);
  const gifts = useGame((s) => s.gifts);
  const anniversaries = useGame((s) => s.anniversaries);
  const bucketList = useGame((s) => s.bucketList);
  const rewards = useGame((s) => s.rewards);
  const showAdultRewards = useGame((s) => s.showAdultRewards);
  const myMood = useGame((s) => s.myMood) ?? "default";
  const partnerMood = useGame((s) => s.partnerMood) ?? "default";
  const setMood = useGame((s) => s.setMood);
  const [moodRain, setMoodRain] = useState<MoodState | null>(null);

  const handleSetMood = (m: MoodState) => {
    setMood(m);
    if (m !== "default") {
      setMoodRain(m);
      setTimeout(() => setMoodRain(null), 2400);
    }
  };
  const checkKnightShield = useGame((s) => s.checkKnightShield);
  const visibleRewardCount = rewards.filter((r) => showAdultRewards || !r.adult).length;
  const affordableCount = rewards.filter((r) => (showAdultRewards || !r.adult) && couple.coins >= r.cost).length;

  useEffect(() => { checkKnightShield(); }, [checkKnightShield]);

  const pending = submissions.filter((s) => s.status === "pending" && s.submittedBy !== role).length;
  const collected = codex.filter((c) => c.obtainedAt).length;
  const rank = leaderboard.findIndex((c) => c.isSelf) + 1;
  const skill = PASSIVE_SKILLS[role];
  const special = isSpecialDay();

  // 統計
  const parseDate = (s?: string) => (s ? new Date(s.replace(/\//g, "-").split(" ")[0]) : null);
  const now = new Date();
  const thisMonth = now.getMonth();
  const thisYear = now.getFullYear();
  const oneWeekAgo = new Date(Date.now() - 7 * 86400000);
  const approvedThisWeek = submissions.filter((s) => {
    const d = parseDate(s.reviewedAt ?? s.createdAt);
    return s.status === "approved" && d && d >= oneWeekAgo;
  }).length;
  const approvedThisMonth = submissions.filter((s) => {
    const d = parseDate(s.reviewedAt ?? s.createdAt);
    return s.status === "approved" && d && d.getMonth() === thisMonth && d.getFullYear() === thisYear;
  }).length;
  const momentsThisMonth = moments.filter((m) => {
    if (!m.isSelf) return false;
    const d = parseDate(m.createdAt);
    return d && d.getMonth() === thisMonth && d.getFullYear() === thisYear;
  }).length;
  const unusedRedemptions = redemptions.filter((r) => r.status === "unused").length;

  const avgAttr = Object.values(pet.attrs).reduce((a, b) => a + b, 0) / 5;

  // 「今日 3 分鐘」快速卡 — persona 研究整合：每日瑣碎時間也能推進關係
  const todayStr = new Date().toISOString().slice(0, 10);
  const ritualDone = ritual.date === todayStr && (ritual.morning || ritual.night);
  const todayAnswered = questionAnswers.some((a) =>
    (a.createdAt ?? "").slice(0, 10) === todayStr && a.answeredBy === role
  );
  const unreadCount = notifications.filter((n) => !n.read).length + gifts.filter((g) => !g.read).length;
  const quickDoneCount = [ritualDone, todayAnswered, unreadCount === 0].filter(Boolean).length;

  // 最近紀念日倒數（未來 90 天內）
  const upcomingAnniversary = (() => {
    if (!anniversaries.length) return null;
    const now = new Date();
    const today0 = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const withDays = anniversaries.map((a) => {
      const [y, m, d] = a.date.split("-").map(Number);
      let next = new Date(y, (m ?? 1) - 1, d ?? 1);
      if (a.recurring) {
        next = new Date(today0.getFullYear(), (m ?? 1) - 1, d ?? 1);
        if (next < today0) next = new Date(today0.getFullYear() + 1, (m ?? 1) - 1, d ?? 1);
      }
      const days = Math.round((next.getTime() - today0.getTime()) / 86400000);
      return { ...a, daysUntil: days, nextDate: next };
    }).filter((x) => x.daysUntil >= 0 && x.daysUntil <= 90);
    withDays.sort((a, b) => a.daysUntil - b.daysUntil);
    return withDays[0] ?? null;
  })();

  return (
    <>
      <DailyBonusModal />

      {/* 未配對時：顯眼完整邀請卡（伴侶未加入 = 對方暱稱仍為預設） */}
      {(() => {
        const partnerName = role === "queen" ? couple.prince.nickname : couple.queen.nickname;
        const partnerIsDefault = partnerName === "阿藍" || partnerName === "阿紅" || !partnerName;
        const unpaired = !!couple.inviteCode && partnerIsDefault;
        if (!unpaired) return null;
        return (
          <div className="mb-3 relative">
            <div className="absolute -top-2 left-4 z-10 px-2.5 py-0.5 rounded-full bg-empire-berry text-white text-[10px] font-black shadow animate-pulse">
              ⚠ 伴侶尚未加入
            </div>
            <InviteCodeCard />
          </div>
        );
      })()}

      {/* 特別日橫幅 */}
      {special && (
        <div className="mb-3 rounded-2xl p-3 bg-gradient-to-r from-rose-400 to-amber-400 border-2 border-white text-white text-center shadow-lg animate-pop">
          <div className="font-black text-base">{SPECIAL_DAY_LABEL}</div>
          <div className="text-xs opacity-90">今日愛意指數 ×{SPECIAL_DAY_MULTIPLIER}，抓緊時間累積</div>
        </div>
      )}

      {/* 心情狀態 — 雙向顯示，影響通知與推薦 */}
      <div className="mb-3 card p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="text-xs text-empire-mute">💭 今日心情</div>
          {partnerMood !== "default" && (
            <div className="text-[11px]">
              對方：<span className="font-bold">{MOOD_LABELS[partnerMood].emoji} {MOOD_LABELS[partnerMood].label}</span>
            </div>
          )}
        </div>
        <div className="flex gap-1 overflow-x-auto">
          {(["default", "busy", "tired", "missing", "intimate", "quiet"] as MoodState[]).map((m) => {
            const info = MOOD_LABELS[m];
            const selected = myMood === m;
            return (
              <button
                key={m}
                onClick={() => handleSetMood(m)}
                className={`shrink-0 px-2.5 py-1.5 rounded-xl text-[11px] font-semibold border-2 transition ${
                  selected
                    ? "text-white shadow-md"
                    : "bg-white text-empire-mute border-empire-cloud hover:border-empire-sky/40"
                }`}
                style={selected ? { background: info.color, borderColor: info.color } : {}}
                title={info.desc}
              >
                {info.emoji} {info.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 今日 3 分鐘快速卡 — 零碎時間也能推進關係 */}
      <div className="mb-3 card p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xl">⏱️</span>
            <h3 className="font-black text-sm text-empire-ink">今日 3 分鐘</h3>
          </div>
          <div className="text-[11px] text-empire-mute font-bold">
            {quickDoneCount}/3 {quickDoneCount === 3 && "✓"}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <QuickAction
            href="/rituals"
            emoji="🌅"
            label={ritualDone ? "今日已打卡" : "晨/晚打卡"}
            done={ritualDone}
            sub={ritualDone ? "做得好" : "30 秒"}
          />
          <QuickAction
            href="/questions"
            emoji="💭"
            label={todayAnswered ? "今日已答" : "抽一題問答"}
            done={todayAnswered}
            sub={todayAnswered ? "晚點看回覆" : "90 秒"}
          />
          <QuickAction
            href="/inbox"
            emoji="💌"
            label={unreadCount === 0 ? "都看完了" : `${unreadCount} 則未讀`}
            done={unreadCount === 0}
            sub={unreadCount === 0 ? "😎" : "30 秒"}
          />
        </div>
      </div>

      {/* 兌換 CTA — 驅動「再做一個任務」的核心動機 */}
      <Link
        href="/exchange"
        className="mb-3 block p-3 rounded-2xl bg-gradient-to-r from-amber-300 via-orange-300 to-rose-300 text-empire-ink shadow-lg hover:shadow-xl active:scale-95 transition"
      >
        <div className="flex items-center gap-3">
          <div className="text-3xl">💰</div>
          <div className="flex-1 min-w-0">
            <div className="font-black text-sm">獎勵兌換中心 · {visibleRewardCount} 種真實獎勵</div>
            <div className="text-[11px] text-empire-ink/80">
              💰 <b>{couple.coins.toLocaleString()}</b> 金 · 現在就可換 <b>{affordableCount}</b> 種
            </div>
          </div>
          <div className="text-2xl">→</div>
        </div>
      </Link>

      {/* 人生清單進度 */}
      <Link href="/bucket-list" className="mb-3 block card p-3 hover:shadow-lift transition">
        <div className="flex items-center gap-3">
          <div className="text-2xl">💞</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline justify-between">
              <div className="font-black text-sm text-empire-ink">情侶人生清單</div>
              <div className="text-[11px] text-empire-mute">
                <b className="text-empire-berry">{bucketList.length}</b> / 100
              </div>
            </div>
            <div className="h-2 mt-1 bg-empire-cloud rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-empire-berry via-empire-sunshine to-empire-sky transition-all"
                style={{ width: `${bucketList.length}%` }}
              />
            </div>
            <div className="text-[10px] text-empire-mute mt-1">
              {bucketList.length === 0 ? "100 件一起做的事 · 第一件從這裡開始" :
               bucketList.length < 10 ? `才剛起步，還有 ${100 - bucketList.length} 件等著` :
               bucketList.length < 50 ? `走在路上，${100 - bucketList.length} 件待勾選` :
               bucketList.length < 100 ? `過半了，${100 - bucketList.length} 件就完成` :
               "100 件全收齊 🌟 白頭偕老"}
            </div>
          </div>
        </div>
      </Link>

      {/* 紀念日倒數 */}
      {upcomingAnniversary && (
        <Link href="/timeline" className="mb-3 block card p-3 bg-gradient-to-r from-empire-cream/80 to-empire-pink/20 hover:shadow-lift transition">
          <div className="flex items-center gap-3">
            <div className="text-3xl">{upcomingAnniversary.emoji}</div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] text-empire-mute">下一個紀念日</div>
              <div className="font-black text-sm text-empire-ink truncate">{upcomingAnniversary.label}</div>
            </div>
            <div className="text-right shrink-0">
              <div className="font-display font-black text-2xl text-empire-berry leading-none">
                {upcomingAnniversary.daysUntil === 0 ? "今天！" : `${upcomingAnniversary.daysUntil}`}
              </div>
              <div className="text-[10px] text-empire-mute">{upcomingAnniversary.daysUntil === 0 ? "💝" : "天後"}</div>
            </div>
          </div>
        </Link>
      )}

      {/* 中央舞台：左右懸浮按鈕 + 寵物 scene
          minHeight 提升到 420 以容納 4 顆 side-rail 按鈕 + label (avoid 底部被 overflow-hidden 切掉) */}
      <div
        className="relative rounded-3xl overflow-hidden mb-4"
        style={{
          minHeight: 420,
          background: "linear-gradient(180deg, #bfe3f9 0%, #d8eefd 40%, #e7f4d5 60%, #8ed172 100%)",
        }}
      >
        {/* 背景元素 */}
        <div className="absolute top-4 right-6 text-4xl animate-sparkle">☀️</div>
        <div className="absolute top-6 left-10 text-3xl opacity-80 animate-float-slow">☁️</div>
        <div className="absolute top-16 left-40 text-2xl opacity-70 animate-float-slow" style={{ animationDelay: "1s" }}>☁️</div>
        <div className="absolute bottom-20 left-0 right-0 text-center text-5xl opacity-30 tracking-[-0.1em]">⛰️⛰️⛰️</div>

        {/* 中央：寵物 + 平台 */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pb-10 flex flex-col items-center">
          <div className="absolute inset-0 -m-4 rounded-full animate-sparkle"
               style={{ background: "radial-gradient(circle, rgba(255,212,71,0.4) 0%, transparent 60%)" }} />
          <PetAvatar stage={pet.stage} size={150} species={pet.species ?? "nuzzle"} rarity={pet.rarity ?? "common"} />
          <div className="mt-2 flex flex-col items-center gap-1">
            <div className="px-3 py-1 rounded-full bg-white/85 border-2 border-white text-xs font-black text-empire-ink">
              {pet.name} · {PET_STAGE_LABEL[pet.stage]}
            </div>
            {pet.rarity && pet.species && (
              <DashboardPetBadge rarity={pet.rarity} species={pet.species} />
            )}
          </div>
        </div>

        {/* 草地花朵 */}
        <div className="absolute bottom-2 left-4 text-xl">🌸</div>
        <div className="absolute bottom-3 right-6 text-xl">🌼</div>
        <div className="absolute bottom-2 left-1/3 text-lg">🌷</div>

        {/* 左側懸浮按鈕 */}
        <div className="absolute left-1 top-2 flex flex-col z-10">
          <SideRailBtn href="/tasks"       emoji="📜" label="任務" badge={pending > 0 ? pending : undefined} />
          <SideRailBtn href="/exchange"    emoji="💰" label="國庫" />
          <SideRailBtn href="/codex"       emoji="🎴" label="圖鑑" />
          <SideRailBtn href="/rituals"     emoji="🌅" label="儀式" />
        </div>

        {/* 右側懸浮按鈕 */}
        <div className="absolute right-1 top-2 flex flex-col z-10">
          <SideRailBtn href="/questions"    emoji="💬" label="問答" />
          <SideRailBtn href="/achievements" emoji="🏅" label="獎盃" />
          <SideRailBtn href="/leaderboard"  emoji="🏆" label="排行" />
          <SideRailBtn href="/friends"      emoji="👫" label="好友" />
        </div>
      </div>

      {/* 被動技能 + 大 CTA */}
      <div className="mb-3 flex items-stretch gap-2">
        <div className="flex-1 flex items-center gap-2 p-2.5 rounded-2xl bg-gradient-to-br from-empire-cloud to-white border-2 border-white shadow-sm">
          <div className="text-2xl">{skill.emoji}</div>
          <div className="min-w-0">
            <div className="text-[10px] text-empire-mute">{role === "queen" ? "王妃" : "王子"}被動</div>
            <div className="font-black text-sm truncate">{skill.name}</div>
          </div>
        </div>
        <Link href="/tasks" className="mega-cta shrink-0">
          <div>{pending > 0 ? "前往審核" : "開始任務"}</div>
          <div className="sub">{pending > 0 ? `⚡ ${pending} 筆待准奏` : "⚡ 累積愛意"}</div>
        </Link>
      </div>

      {/* 本週挑戰 / 連擊 / 里程碑 */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <MiniCard href="/rituals"   icon="🔥" label="連擊"      value={`${streak.current} 天`}     sub={`歷史 ${streak.longest}`} />
        <MiniCard href="/plaza"     icon="🌸" label="本月動態"  value={`${momentsThisMonth}`}      sub="本月紀念" />
        <MiniCard href="/leaderboard" icon="🏆" label="全球排行"  value={`第 ${rank} 名`}            sub={`Lv.${couple.kingdomLevel}`} />
        <MiniCard href="/vault"     icon="🎁" label="未用券"    value={`${unusedRedemptions}`}     sub="寶庫" />
      </div>

      {/* 五屬性雷達 */}
      <div className="card p-4 mb-3">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-black text-empire-ink">💞 五屬性雷達</h3>
          <span className="text-xs text-empire-mute">平均 {avgAttr.toFixed(0)} / 100</span>
        </div>
        <AttributeRadar attrs={pet.attrs} size={260} />
      </div>

      {/* 週 / 月 / 年 統計 */}
      <div className="card p-4 mb-3">
        <h3 className="font-black text-empire-ink mb-2">📊 統計</h3>
        <div className="grid grid-cols-3 gap-2">
          <TinyStat label="本週" value={approvedThisWeek} />
          <TinyStat label="本月" value={approvedThisMonth} />
          <TinyStat label="圖鑑" value={`${collected}/${codex.length}`} />
        </div>
      </div>

      {/* 心情更新浮誇特效 */}
      {moodRain && <MoodRainOverlay mood={moodRain} />}
    </>
  );
}

function MoodRainOverlay({ mood }: { mood: MoodState }) {
  const rainEmoji: Record<MoodState, string> = {
    default: "",
    missing: "💭",
    intimate: "💕",
    tired: "💤",
    busy: "⏰",
    quiet: "🕯️",
  };
  const emoji = rainEmoji[mood];
  if (!emoji) return null;

  // 生成 24 個從上飄落的 emoji
  const drops = Array.from({ length: 24 }).map((_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 0.8,
    duration: 1.6 + Math.random() * 0.8,
    size: 18 + Math.floor(Math.random() * 24),
  }));

  const centerLabel: Record<MoodState, string> = {
    default: "",
    missing: "💭 你想念對方了…",
    intimate: "🌹 今晚想靠近",
    tired: "😮‍💨 抱抱你…",
    busy: "💼 辛苦了",
    quiet: "🕯️ 安靜一下",
  };

  return (
    <div className="fixed inset-0 z-[60] pointer-events-none overflow-hidden">
      {drops.map((d) => (
        <span
          key={d.id}
          className="absolute top-0"
          style={{
            left: `${d.left}%`,
            fontSize: d.size,
            animation: `mood-fall ${d.duration}s ease-in ${d.delay}s forwards`,
            opacity: 0,
          }}
        >
          {emoji}
        </span>
      ))}
      <div
        className="absolute left-1/2 top-1/3 -translate-x-1/2 text-center px-6 py-3 rounded-2xl bg-white/90 backdrop-blur border-2 border-empire-berry/40 shadow-xl"
        style={{ animation: "mood-pop 2s ease-out forwards" }}
      >
        <div className="font-display font-black text-lg text-empire-ink">{centerLabel[mood]}</div>
        <div className="text-[10px] text-empire-mute mt-1">對方會在下次打開 app 時收到 💞</div>
      </div>
    </div>
  );
}

function QuickAction({ href, emoji, label, done, sub }: { href: string; emoji: string; label: string; done: boolean; sub: string }) {
  return (
    <Link
      href={href}
      className={`p-2.5 rounded-xl text-center transition ${
        done
          ? "bg-emerald-50 border-2 border-emerald-300"
          : "bg-empire-cream border-2 border-empire-gold/40 hover:border-empire-gold animate-pulse-slow"
      }`}
    >
      <div className="text-2xl mb-0.5 relative inline-block">
        {emoji}
        {done && (
          <span className="absolute -bottom-1 -right-2 text-emerald-600 text-sm font-black">✓</span>
        )}
      </div>
      <div className={`text-[11px] font-bold ${done ? "text-emerald-700" : "text-empire-ink"} leading-tight`}>
        {label}
      </div>
      <div className="text-[9px] text-empire-mute mt-0.5">{sub}</div>
    </Link>
  );
}

function SideRailBtn({ href, emoji, label, badge }: { href: string; emoji: string; label: string; badge?: number }) {
  return (
    <Link href={href} className="side-rail-btn">
      <div className="emoji-frame">
        {emoji}
        {badge != null && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-empire-crimson text-white text-[10px] font-black flex items-center justify-center border-2 border-white">
            {badge > 9 ? "9+" : badge}
          </span>
        )}
      </div>
      <div className="label">{label}</div>
    </Link>
  );
}

function MiniCard({ href, icon, label, value, sub }: { href: string; icon: string; label: string; value: string; sub: string }) {
  return (
    <Link href={href} className="flex items-center gap-3 p-3 rounded-2xl bg-white border-2 border-white shadow-card hover:shadow-lift hover:-translate-y-0.5 transition">
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-empire-cream to-empire-leaf flex items-center justify-center text-xl shadow-sm">
        {icon}
      </div>
      <div className="min-w-0">
        <div className="text-[10px] text-empire-mute">{label}</div>
        <div className="font-black text-empire-ink text-sm">{value}</div>
        <div className="text-[10px] text-empire-mute">{sub}</div>
      </div>
    </Link>
  );
}

function TinyStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl p-2 bg-empire-mist text-center">
      <div className="text-[10px] text-empire-mute">{label}</div>
      <div className="font-black text-empire-ink">{value}</div>
    </div>
  );
}

function DashboardPetBadge({ rarity, species }: { rarity: PetGeneRarity; species: PetSpecies }) {
  const rr = RARITY[resolveRarity(rarity)];
  const sp = SPECIES[resolveSpecies(species)];
  const isMythic = rarity === "mythic";
  return (
    <div
      className="px-2 py-0.5 rounded-full text-[10px] font-black text-white shadow-sm"
      style={{
        background: isMythic
          ? "linear-gradient(90deg,#ff8eae,#ffb947,#8ed172,#5aa4ff,#d280ff)"
          : rr.primaryColor,
        border: "1.5px solid rgba(255,255,255,0.85)",
      }}
    >
      {rr.emoji} {rr.tag} · {sp.nameZh}
    </div>
  );
}
