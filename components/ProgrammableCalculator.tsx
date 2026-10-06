"use client";

import { useState } from "react";

export default function ProgrammableCalculator() {
  const [activeTab, setActiveTab] = useState<
    "custom" | "quadratic" | "physics"
  >("custom");

  // Custom script executor state
  const [code, setCode] = useState<string>(
    "// Write a function using variables x and y\nconst result = Math.pow(x, 2) + Math.sqrt(y);\nreturn result;",
  );
  const [varX, setVarX] = useState<number>(4);
  const [varY, setVarY] = useState<number>(16);
  const [scriptOutput, setScriptOutput] = useState<string>("");

  // Quadratic Solver state
  const [quadA, setQuadA] = useState<number>(1);
  const [quadB, setQuadB] = useState<number>(-5);
  const [quadC, setQuadC] = useState<number>(6);
  const [quadResult, setQuadResult] = useState<string>("");

  // Physics Formula Solver (Kinematics)
  const [velV0, setVelV0] = useState<number>(0);
  const [accelA, setAccelA] = useState<number>(9.8);
  const [timeT, setTimeT] = useState<number>(5);
  const [physResult, setPhysResult] = useState<string>("");

  const runCustomScript = () => {
    try {
      const runner = new Function("x", "y", code);
      const res = runner(varX, varY);
      setScriptOutput(
        res !== undefined ? res.toString() : "Execution completed (No return)",
      );
    } catch (err: any) {
      setScriptOutput(`Execution Error: ${err.message}`);
    }
  };

  const solveQuadratic = () => {
    const a = quadA,
      b = quadB,
      c = quadC;
    if (a === 0) {
      setQuadResult("Not a quadratic equation (a = 0)");
      return;
    }
    const delta = b * b - 4 * a * c;
    if (delta > 0) {
      const x1 = (-b + Math.sqrt(delta)) / (2 * a);
      const x2 = (-b - Math.sqrt(delta)) / (2 * a);
      setQuadResult(
        `Two Real Roots: x₁ = ${x1.toFixed(4)}, x₂ = ${x2.toFixed(4)} (Δ = ${delta})`,
      );
    } else if (delta === 0) {
      const x = -b / (2 * a);
      setQuadResult(`One Double Root: x = ${x.toFixed(4)} (Δ = 0)`);
    } else {
      const real = (-b / (2 * a)).toFixed(4);
      const imag = (Math.sqrt(-delta) / (2 * a)).toFixed(4);
      setQuadResult(
        `Complex Roots: x₁ = ${real} + ${imag}i, x₂ = ${real} - ${imag}i`,
      );
    }
  };

  const solvePhysics = () => {
    // Distance d = v0*t + 0.5*a*t^2
    const distance = velV0 * timeT + 0.5 * accelA * Math.pow(timeT, 2);
    const finalVelocity = velV0 + accelA * timeT;
    setPhysResult(
      `Displacement (d): ${distance.toFixed(2)} m | Final Velocity (v): ${finalVelocity.toFixed(2)} m/s`,
    );
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-6">
      <div className="flex border-b border-slate-800 pb-3 gap-3">
        <button
          onClick={() => setActiveTab("custom")}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
            activeTab === "custom"
              ? "bg-cyan-950 text-cyan-400 border border-cyan-800"
              : "text-slate-400 hover:bg-slate-800"
          }`}
        >
          Custom Formula Script
        </button>
        <button
          onClick={() => setActiveTab("quadratic")}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
            activeTab === "quadratic"
              ? "bg-cyan-950 text-cyan-400 border border-cyan-800"
              : "text-slate-400 hover:bg-slate-800"
          }`}
        >
          Quadratic Solver
        </button>
        <button
          onClick={() => setActiveTab("physics")}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
            activeTab === "physics"
              ? "bg-cyan-950 text-cyan-400 border border-cyan-800"
              : "text-slate-400 hover:bg-slate-800"
          }`}
        >
          Physics Kinematics
        </button>
      </div>

      {/* Tab 1: Custom JS Script Executor */}
      {activeTab === "custom" && (
        <div className="space-y-4">
          <p className="text-xs text-slate-400">
            Define custom multi-step program logic using variables{" "}
            <code className="text-cyan-400">x</code> and{" "}
            <code className="text-cyan-400">y</code>:
          </p>
          <textarea
            rows={5}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
          />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-400 block mb-1">
                Input Variable x
              </label>
              <input
                type="number"
                value={varX}
                onChange={(e) => setVarX(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs font-mono text-slate-100"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">
                Input Variable y
              </label>
              <input
                type="number"
                value={varY}
                onChange={(e) => setVarY(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs font-mono text-slate-100"
              />
            </div>
          </div>
          <button
            onClick={runCustomScript}
            className="w-full bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold py-2 rounded-xl text-xs transition"
          >
            Execute Script
          </button>

          {scriptOutput && (
            <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl text-xs font-mono text-cyan-400">
              Output: {scriptOutput}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Quadratic Solver */}
      {activeTab === "quadratic" && (
        <div className="space-y-4">
          <p className="text-xs text-slate-400">
            Solves second-degree polynomial equation:{" "}
            <span className="text-cyan-400 font-mono">ax² + bx + c = 0</span>
          </p>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-slate-400 block mb-1">
                Coefficient a
              </label>
              <input
                type="number"
                value={quadA}
                onChange={(e) => setQuadA(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs font-mono text-slate-100"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">
                Coefficient b
              </label>
              <input
                type="number"
                value={quadB}
                onChange={(e) => setQuadB(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs font-mono text-slate-100"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">
                Coefficient c
              </label>
              <input
                type="number"
                value={quadC}
                onChange={(e) => setQuadC(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs font-mono text-slate-100"
              />
            </div>
          </div>
          <button
            onClick={solveQuadratic}
            className="w-full bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold py-2 rounded-xl text-xs transition"
          >
            Calculate Roots
          </button>
          {quadResult && (
            <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl text-xs font-mono text-cyan-400">
              {quadResult}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Physics Solver */}
      {activeTab === "physics" && (
        <div className="space-y-4">
          <p className="text-xs text-slate-400">
            Calculate Displacement & Final Velocity:{" "}
            <span className="text-cyan-400 font-mono">d = v₀t + ½at²</span>
          </p>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-slate-400 block mb-1">
                Initial Velocity (v₀ m/s)
              </label>
              <input
                type="number"
                value={velV0}
                onChange={(e) => setVelV0(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs font-mono text-slate-100"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">
                Acceleration (a m/s²)
              </label>
              <input
                type="number"
                value={accelA}
                onChange={(e) => setAccelA(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs font-mono text-slate-100"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">
                Time Elapsed (t sec)
              </label>
              <input
                type="number"
                value={timeT}
                onChange={(e) => setTimeT(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs font-mono text-slate-100"
              />
            </div>
          </div>
          <button
            onClick={solvePhysics}
            className="w-full bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold py-2 rounded-xl text-xs transition"
          >
            Compute Motion
          </button>
          {physResult && (
            <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl text-xs font-mono text-cyan-400">
              {physResult}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
