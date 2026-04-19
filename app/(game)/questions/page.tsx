"use client";

import { useMemo, useState } from "react";
import { useGame } from "@/lib/store";
import {
  QUESTIONS, CATEGORY_LABELS, DEPTH_LABELS, KIND_LABELS, randomQuestion, featuredCount,
  type Question, type QuestionCategory, type QuestionDepth, getQuestionById,
} from "@/lib/questions";
import { PageBanner } from "@/components/PageBanner";

export default function QuestionsPage() {
  const role = useGame((s) => s.role);
  const couple = useGame((s) => s.couple);
  const answers = useGame((s) => s.questionAnswers);
  const submitAnswer = useGame((s) => s.submitQuestionAnswer);
  const rateAnswer = useGame((s) => s.rateQuestionAnswer);

  const [tab, setTab] = useState<"today" | "mine" | "partner" | "all">("today");
  const [category, setCategory] = useState<QuestionCategory | "all">("all");
  const [depth, setDepth] = useState<QuestionDepth | "all">("all");
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [picked, setPicked] = useState<Question | null>(null);
  const [answerDraft, setAnswerDraft] = useState("");

  const answeredIds = new Set(answers.map((a) => a.questionId));

  const answersByMe = answers.filter((a) => a.answeredBy === role);
  const answersByPartner = answers.filter((a) => a.answeredBy !== role);
  const pendingMyRating = answersByPartner.filter((a) => !a.rating);

  const pickRandom = () => {
    const q = randomQuestion({
      category: category === "all" ? undefined : category,
      depth: depth === "all" ? undefined : depth,
      excludeIds: Array.from(answeredIds),
      featuredOnly: featuredOnly || undefined,
    });
    setPicked(q ?? null);
    setAnswerDraft("");
  };

  const handleSubmit = () => {
    if (!picked || !answerDraft.trim()) return;
    submitAnswer(picked.id, answerDraft);
    setPicked(null);
    setAnswerDraft("");
  };

  const fiveStar = answers.filter((a) => a.rating === 5).length;
  const avgRating = (() => {
    const rated = answers.filter((a) => a.rating);
    if (!rated.length) return "-";
    const sum = rated.reduce((s, a) => s + (a.rating ?? 0), 0);
    return (sum / rated.length).toFixed(1);
  })();

  return (
    <div className="space-y-4">
      <PageBanner
        title="深度問答"
        subtitle={`${QUESTIONS.length} 題 × ${Object.keys(CATEGORY_LABELS).length} 主題 · 精選 ${featuredCount()} 題 · 10 題遊戲互動`}
        emoji="💬"
        gradient="sky"
        stats={[
          { label: "已答", value: `${answers.length}/${QUESTIONS.length}` },
          { label: "5 星", value: fiveStar },
          { label: "均分", value: String(avgRating) },
        ]}
      />
      <div className="card p-2 flex gap-1 overflow-x-auto">
        <TabBtn active={tab === "today"} onClick={() => setTab("today")}>抽題</TabBtn>
        <TabBtn active={tab === "mine"} onClick={() => setTab("mine")}>
          我的回答 ({answersByMe.length})
        </TabBtn>
        <TabBtn active={tab === "partner"} onClick={() => setTab("partner")}>
          對方回答 {pendingMyRating.length > 0 && <span className="ml-1 text-[10px] bg-empire-berry text-white px-1.5 rounded-full">{pendingMyRating.length}</span>}
        </TabBtn>
        <TabBtn active={tab === "all"} onClick={() => setTab("all")}>全部題庫</TabBtn>
      </div>

      {tab === "today" && (
        <div className="space-y-3">
          <div className="card p-4">
            <div className="text-xs text-empire-mute mb-2">篩選 (可選)</div>
            <div className="flex gap-1 overflow-x-auto pb-1">
              <FilterPill active={category === "all"} onClick={() => setCategory("all")}>全部類別</FilterPill>
              {(Object.keys(CATEGORY_LABELS) as QuestionCategory[]).map((c) => (
                <FilterPill key={c} active={category === c} onClick={() => setCategory(c)}>
                  {CATEGORY_LABELS[c].emoji} {CATEGORY_LABELS[c].label}
                </FilterPill>
              ))}
            </div>
            <div className="mt-2 flex gap-1">
              {(["all", "light", "medium", "deep"] as const).map((d) => (
                <FilterPill key={d} active={depth === d} onClick={() => setDepth(d)}>
                  {d === "all" ? "所有深度" : `${DEPTH_LABELS[d].label} +${DEPTH_LABELS[d].xp}`}
                </FilterPill>
              ))}
            </div>
            <div className="mt-2 flex gap-1">
              <FilterPill active={!featuredOnly} onClick={() => setFeaturedOnly(false)}>全部池</FilterPill>
              <FilterPill active={featuredOnly} onClick={() => setFeaturedOnly(true)}>⭐ 大師精選 ({featuredCount()})</FilterPill>
            </div>
            <button onClick={pickRandom} className="mt-4 btn-primary w-full py-3 font-semibold">
              🎲 隨機抽一題
            </button>
          </div>

          {picked && (
            <div className="card p-5 bg-gradient-to-br from-white to-empire-cloud">
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="tag px-2 py-0.5"
                  style={{ background: CATEGORY_LABELS[picked.category].color + "33", borderColor: CATEGORY_LABELS[picked.category].color }}
                >
                  {CATEGORY_LABELS[picked.category].emoji} {CATEGORY_LABELS[picked.category].label}
                </span>
                <span className="tag rarity-r">
                  {DEPTH_LABELS[picked.depth].label} +{DEPTH_LABELS[picked.depth].xp} XP
                </span>
                {picked.featured && (
                  <span className="tag bg-empire-cream text-empire-gold border-empire-gold/40">⭐ 精選</span>
                )}
                {picked.kind && (
                  <span className="tag rarity-sr">
                    {KIND_LABELS[picked.kind].emoji} {KIND_LABELS[picked.kind].label}
                  </span>
                )}
              </div>
              <p className="font-display text-xl font-bold text-empire-ink leading-relaxed">
                {picked.text}
              </p>
              <textarea
                value={answerDraft}
                onChange={(e) => setAnswerDraft(e.target.value.slice(0, 500))}
                placeholder="寫下你的答案，對方會看到並給你評分…"
                rows={5}
                className="mt-3 w-full border-2 border-empire-cloud rounded-xl px-3 py-2 resize-none focus:outline-none focus:border-empire-sky text-sm"
              />
              <div className="text-right text-[10px] text-empire-mute mt-1">{answerDraft.length} / 500</div>
              <div className="mt-2 flex gap-2">
                <button onClick={() => setPicked(null)} className="btn-ghost flex-1 py-2 text-sm">換一題</button>
                <button onClick={handleSubmit} disabled={!answerDraft.trim()} className="btn-primary flex-1 py-2 font-semibold">
                  送出回答 ✨
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {tab === "mine" && (
        <div className="space-y-3">
          {answersByMe.length === 0 && (
            <p className="card p-8 text-center text-empire-mute">還沒回答過，到「抽題」試試</p>
          )}
          {answersByMe.map((a) => {
            const q = getQuestionById(a.questionId);
            return <AnswerCard key={a.id} answer={a} question={q} ownedByMe />;
          })}
        </div>
      )}

      {tab === "partner" && (
        <div className="space-y-3">
          {answersByPartner.length === 0 && (
            <p className="card p-8 text-center text-empire-mute">對方還沒回答 (demo 模式下請先用對方身份登入答題)</p>
          )}
          {answersByPartner.map((a) => {
            const q = getQuestionById(a.questionId);
            return (
              <AnswerCard
                key={a.id}
                answer={a}
                question={q}
                onRate={(rating, comment) => rateAnswer(a.id, rating, comment)}
              />
            );
          })}
        </div>
      )}

      {tab === "all" && (
        <AllQuestions answeredIds={answeredIds} />
      )}
    </div>
  );
}

function AnswerCard({
  answer, question, ownedByMe, onRate,
}: {
  answer: ReturnType<typeof useGame.getState>["questionAnswers"][number];
  question: Question | undefined;
  ownedByMe?: boolean;
  onRate?: (rating: number, comment?: string) => void;
}) {
  const couple = useGame((s) => s.couple);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const author = answer.answeredBy === "queen" ? couple.queen.nickname : couple.prince.nickname;

  if (!question) return null;
  const cat = CATEGORY_LABELS[question.category];

  return (
    <div className="card p-5">
      <div className="flex items-center gap-2 mb-1 flex-wrap">
        <span className="tag px-2 py-0.5" style={{ background: cat.color + "33", borderColor: cat.color }}>
          {cat.emoji} {cat.label}
        </span>
        <span className="tag rarity-n">{DEPTH_LABELS[question.depth].label}</span>
        {ownedByMe && <span className="tag bg-empire-cream text-empire-gold border-empire-gold/40">我的</span>}
      </div>
      <p className="font-bold text-empire-ink">{question.text}</p>
      <div className="mt-3 p-3 rounded-xl bg-empire-mist">
        <div className="text-xs text-empire-mute mb-1">{author} 的回答：</div>
        <p className="text-sm whitespace-pre-line">{answer.text}</p>
      </div>

      {answer.rating ? (
        <div className="mt-3 p-3 rounded-xl bg-empire-cream/60 border border-empire-gold/30">
          <div className="flex items-center gap-1 text-lg">
            {"⭐".repeat(answer.rating)}<span className="text-empire-mute text-xs ml-2">{answer.rating}/5</span>
          </div>
          {answer.ratingComment && <p className="text-sm mt-1 italic">"{answer.ratingComment}"</p>}
        </div>
      ) : onRate ? (
        <div className="mt-3 p-3 rounded-xl bg-empire-mist">
          <div className="text-xs text-empire-mute mb-2">給這個回答打分（4-5 星獲額外 XP，5 星可能掉卡）</div>
          <div className="flex gap-2 mb-2">
            {[1, 2, 3, 4, 5].map((n) => (
              <button key={n} onClick={() => setRating(n)}
                className={`text-2xl transition ${n <= rating ? "grayscale-0" : "grayscale opacity-50"}`}>
                ⭐
              </button>
            ))}
          </div>
          <input value={comment} onChange={(e) => setComment(e.target.value.slice(0, 200))}
            placeholder="附上回饋 (選填)"
            className="w-full border-2 border-empire-cloud rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-empire-sky" />
          <button onClick={() => { if (rating) onRate(rating, comment); }}
            disabled={!rating}
            className="mt-2 btn-primary w-full py-2 text-sm font-semibold">
            送出評分
          </button>
        </div>
      ) : (
        <p className="mt-3 text-xs text-empire-mute">等對方評分…</p>
      )}
      <div className="text-[10px] text-empire-mute mt-2 text-right">{answer.createdAt}</div>
    </div>
  );
}

function AllQuestions({ answeredIds }: { answeredIds: Set<string> }) {
  const [cat, setCat] = useState<QuestionCategory | "all">("all");
  const filtered = cat === "all" ? QUESTIONS : QUESTIONS.filter((q) => q.category === cat);

  return (
    <div className="space-y-3">
      <div className="card p-2 flex gap-1 overflow-x-auto">
        <FilterPill active={cat === "all"} onClick={() => setCat("all")}>全部 ({QUESTIONS.length})</FilterPill>
        {(Object.keys(CATEGORY_LABELS) as QuestionCategory[]).map((c) => (
          <FilterPill key={c} active={cat === c} onClick={() => setCat(c)}>
            {CATEGORY_LABELS[c].emoji} {CATEGORY_LABELS[c].label} ({QUESTIONS.filter((q) => q.category === c).length})
          </FilterPill>
        ))}
      </div>
      <div className="space-y-2">
        {filtered.map((q) => {
          const answered = answeredIds.has(q.id);
          const c = CATEGORY_LABELS[q.category];
          return (
            <div key={q.id} className={`p-3 rounded-xl bg-white border border-empire-cloud ${answered ? "opacity-70" : ""}`}>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="tag px-2 py-0.5 text-[10px]" style={{ background: c.color + "33" }}>{c.emoji} {c.label}</span>
                <span className="tag rarity-n text-[10px]">{DEPTH_LABELS[q.depth].label}</span>
                {answered && <span className="text-[10px] text-empire-gold font-bold">✓ 已答</span>}
              </div>
              <div className="text-sm">{q.text}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TabBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick}
      className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${
        active ? "bg-empire-sky text-white" : "text-empire-ink hover:bg-empire-cloud"
      }`}>
      {children}
    </button>
  );
}

function FilterPill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick}
      className={`shrink-0 px-2.5 py-1 rounded-full text-xs ${
        active ? "bg-empire-sky text-white" : "bg-white text-empire-mute border border-empire-cloud"
      }`}>
      {children}
    </button>
  );
}

function MiniStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl p-2 bg-empire-mist">
      <div className="text-xs text-empire-mute">{label}</div>
      <div className="font-bold text-empire-ink">{value}</div>
    </div>
  );
}
