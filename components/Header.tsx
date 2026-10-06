"use client";

export default function Header() {
  return (
    <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-slate-950 text-xl shadow-lg shadow-cyan-500/20">
            ∑
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-slate-100">
              Biskra University{" "}
              <span className="text-cyan-400 font-normal">| CS Department</span>
            </h1>
            <p className="text-xs text-slate-400">
              3rd Year License (2023/2024) —{" "}
              <span className="text-cyan-300 font-medium">
                PW 1: Advanced Calculator
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-800/60 px-3 py-1.5 rounded-lg border border-slate-700/50">
          <span>
            Instructor: <strong className="text-slate-200">TELLI A.</strong>
          </span>
          <span className="text-slate-600">•</span>
          <span className="text-emerald-400 font-medium">● System Ready</span>
        </div>
      </div>
    </header>
  );
}
