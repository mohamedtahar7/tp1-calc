"use client";

interface MemoryPanelProps {
  memory: number;
  setMemory: (val: number) => void;
}

export default function MemoryPanel({ memory, setMemory }: MemoryPanelProps) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl flex flex-col justify-between">
      <div>
        <h3 className="text-sm font-bold text-slate-200 pb-2 border-b border-slate-800 mb-4">
          Memory Registers & Constants
        </h3>

        <div className="space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800">
            <span className="text-slate-400">Primary Memory (M)</span>
            <span className="text-cyan-400 font-bold">{memory}</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
              <span className="text-slate-500 text-[10px] block">
                EULER'S NUMBER (e)
              </span>
              <span className="text-slate-300 font-bold">2.71828182</span>
            </div>
            <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
              <span className="text-slate-500 text-[10px] block">
                ARCHIMEDES (π)
              </span>
              <span className="text-slate-300 font-bold">3.14159265</span>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={() => setMemory(0)}
        className="mt-6 w-full bg-rose-950/50 hover:bg-rose-900/60 border border-rose-800 text-rose-300 py-2 rounded-xl text-xs transition"
      >
        Clear All Memory Registers
      </button>
    </div>
  );
}
