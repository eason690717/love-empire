import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="max-w-md w-full card p-8 text-center relative overflow-hidden">
        {/* 左右葉飾 */}
        <div className="absolute -left-4 -top-4 text-5xl opacity-60 select-none">🍃</div>
        <div className="absolute -right-3 top-6 text-3xl opacity-70 select-none animate-float-slow">🌼</div>
        <div className="absolute -right-6 -bottom-4 text-4xl opacity-60 select-none">🌿</div>

        <div className="w-32 h-32 mx-auto rounded-full flex items-center justify-center text-7xl"
             style={{
               background: "radial-gradient(circle at 30% 30%, #ffffff, #ffe8f0 60%, #ffc1d6 100%)",
               boxShadow: "0 0 0 6px #ffffff, 0 0 0 8px #ffc1d6, 0 18px 40px rgba(255,127,161,0.25)",
             }}>
          <span className="animate-bob">🥚</span>
        </div>

        <h1 className="mt-6 font-display text-4xl font-black text-empire-ink text-shadow-soft tracking-wider">
          愛的帝國
        </h1>
        <p className="text-xs tracking-[0.4em] text-empire-berry/80 font-bold mt-1">LOVE EMPIRE</p>
        <p className="mt-5 text-sm text-empire-mute leading-relaxed">
          阿紅牽起阿藍，月老紅線纏上天上雙星<br />
          只屬於你們兩個人的量化戀愛
        </p>

        <div className="mt-8 space-y-3">
          <Link href="/login" className="btn-primary block py-3.5 text-base">
            ✨ 進入城堡
          </Link>
          <Link href="/register" className="btn-pink block py-3.5 text-base">
            👑 建立新王國
          </Link>
          <Link href="/pair" className="btn-ghost block py-3 text-sm">
            💌 我有配對碼
          </Link>
        </div>

        <div className="mt-8 pt-6 border-t border-empire-cloud/60 text-xs text-empire-mute flex items-center justify-center gap-2">
          <span className="sprout-dot" /> v0.1 demo · 全部以示範資料運行
        </div>
      </div>
    </main>
  );
}
