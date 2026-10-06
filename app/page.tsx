"use client";

import { useState } from "react";
import Header from "@/components/Header";
import ScientificCalculator from "@/components/ScientificCalculator";
import GraphingCalculator from "@/components/GraphingCalculator";
import ProgrammableCalculator from "@/components/ProgrammableCalculator";
import MemoryPanel from "@/components/MemoryPanel";

export default function Home() {
  const [activeTab, setActiveTab] = useState<
    "scientific" | "graphing" | "programmable"
  >("scientific");
  const [memory, setMemory] = useState<number>(0);
  const [history, setHistory] = useState<string[]>([]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 sm:px-6 space-y-6">
        {/* Navigation Tabs
        <div className="flex items-center justify-center sm:justify-start gap-2 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 w-fit">
          <button
            onClick={() => setActiveTab("scientific")}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "scientific"
                ? "bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
            }`}
          >
            Scientific Mode
          </button>
          <button
            onClick={() => setActiveTab("graphing")}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "graphing"
                ? "bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
            }`}
          >
            Graphing Engine
          </button>
          <button
            onClick={() => setActiveTab("programmable")}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "programmable"
                ? "bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
            }`}
          >
            Programmable Solvers
          </button>
        </div> */}

        {/* Dynamic View Mode */}
        {activeTab === "scientific" && (
          <ScientificCalculator
            memory={memory}
            setMemory={setMemory}
            history={history}
            setHistory={setHistory}
          />
        )}

        {activeTab === "graphing" && <GraphingCalculator />}

        {activeTab === "programmable" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ProgrammableCalculator />
            </div>
            <div>
              <MemoryPanel memory={memory} setMemory={setMemory} />
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-4 text-center text-xs text-slate-600">
        Biskra University • Department of Computer Science • Practical Work 1
        Solution
      </footer>
    </div>
  );
}
