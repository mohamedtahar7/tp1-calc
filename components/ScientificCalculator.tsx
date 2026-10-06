"use client";

import { useState, useEffect, useCallback } from "react";

interface ScientificProps {
  memory: number;
  setMemory: React.Dispatch<React.SetStateAction<number>>;
  history: string[];
  setHistory: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function ScientificCalculator({
  memory,
  setMemory,
  history,
  setHistory,
}: ScientificProps) {
  const [input, setInput] = useState<string>("");
  const [result, setResult] = useState<string>("0");
  const [lastAns, setLastAns] = useState<string>("0");
  const [angleUnit, setAngleUnit] = useState<"DEG" | "RAD">("DEG");
  const [isScientificNotation, setIsScientificNotation] =
    useState<boolean>(false);
  const [isSecondFunction, setIsSecondFunction] = useState<boolean>(false);
  const [activeKey, setActiveKey] = useState<string | null>(null);

  const appendSymbol = useCallback((sym: string) => {
    setInput((prev) => prev + sym);
  }, []);

  const clearAll = useCallback(() => {
    setInput("");
    setResult("0");
  }, []);

  const deleteLast = useCallback(() => {
    setInput((prev) => prev.slice(0, -1));
  }, []);

  const calculateResult = useCallback(() => {
    if (!input.trim()) return;
    try {
      // Replace human-readable symbols with JavaScript Math equivalents
      let expr = input
        .replace(/×/g, "*")
        .replace(/÷/g, "/")
        .replace(/π/g, "Math.PI")
        .replace(/e/g, "Math.E")
        .replace(/√\(/g, "Math.sqrt(")
        .replace(/∛\(/g, "Math.cbrt(")
        .replace(/ln\(/g, "Math.log(")
        .replace(/log\(/g, "Math.log10(")
        .replace(/\^/g, "**")
        .replace(/Ans/g, lastAns || "0");

      // Trigonometric functions evaluation (supporting DEG / RAD modes)
      const trigRegex = /(sin|cos|tan|asin|acos|atan)\(([^)]+)\)/g;
      expr = expr.replace(trigRegex, (_, func, inner) => {
        let val = `(${inner})`;
        if (angleUnit === "DEG" && !["asin", "acos", "atan"].includes(func)) {
          val = `((${inner}) * Math.PI / 180)`;
        }
        let computed = `Math.${func}${val}`;
        if (angleUnit === "DEG" && ["asin", "acos", "atan"].includes(func)) {
          computed = `(Math.${func}${val} * 180 / Math.PI)`;
        }
        return computed;
      });

      // Factorial parsing (e.g., 5!)
      expr = expr.replace(/(\d+)!/g, (_, n) => {
        const num = parseInt(n);
        if (num < 0) return "NaN";
        let fact = 1;
        for (let i = 2; i <= num; i++) fact *= i;
        return fact.toString();
      });

      const evaluated = new Function(`return (${expr})`)();

      if (evaluated === undefined || isNaN(evaluated)) {
        setResult("Error");
        return;
      }

      let formattedResult = evaluated.toString();

      if (isScientificNotation && !isNaN(evaluated)) {
        formattedResult = Number(evaluated).toExponential(6);
      } else if (
        typeof evaluated === "number" &&
        !Number.isInteger(evaluated)
      ) {
        formattedResult = parseFloat(evaluated.toFixed(8)).toString();
      }

      setResult(formattedResult);
      setLastAns(formattedResult);
      setHistory((prev) => [
        `${input} = ${formattedResult}`,
        ...prev.slice(0, 19),
      ]);
    } catch (err) {
      setResult("Syntax Error");
    }
  }, [input, angleUnit, isScientificNotation, lastAns, setHistory]);

  // Memory Operations
  const handleMemory = (op: "MC" | "MR" | "M+" | "M-" | "MS") => {
    const currentVal = parseFloat(result) || 0;
    switch (op) {
      case "MC":
        setMemory(0);
        break;
      case "MR":
        appendSymbol(memory.toString());
        break;
      case "M+":
        setMemory((prev) => prev + currentVal);
        break;
      case "M-":
        setMemory((prev) => prev - currentVal);
        break;
      case "MS":
        setMemory(currentVal);
        break;
    }
  };

  // Keyboard Shortcuts Support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["INPUT", "TEXTAREA"].includes((e.target as HTMLElement).tagName))
        return;

      if (e.key >= "0" && e.key <= "9") appendSymbol(e.key);
      else if (e.key === ".") appendSymbol(".");
      else if (e.key === "+") appendSymbol("+");
      else if (e.key === "-") appendSymbol("-");
      else if (e.key === "*") appendSymbol("×");
      else if (e.key === "/") appendSymbol("÷");
      else if (e.key === "(") appendSymbol("(");
      else if (e.key === ")") appendSymbol(")");
      else if (e.key === "^") appendSymbol("^");
      else if (e.key === "Enter" || e.key === "=") {
        e.preventDefault();
        calculateResult();
      } else if (e.key === "Backspace") deleteLast();
      else if (e.key === "Escape") clearAll();

      setActiveKey(e.key);
      setTimeout(() => setActiveKey(null), 150);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [appendSymbol, calculateResult, deleteLast, clearAll]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
      {/* Primary Calculator Container */}
      <div className="lg:col-span-3 bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl backdrop-blur-xl relative overflow-hidden">
        {/* Subtle decorative glow accent */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            {/* DEG / RAD Toggle Pill */}
            <button
              onClick={() => setAngleUnit(angleUnit === "DEG" ? "RAD" : "DEG")}
              className="px-3 py-1.5 rounded-xl text-xs font-black bg-cyan-950/80 text-cyan-400 border border-cyan-800/60 hover:bg-cyan-900 transition shadow-sm active:scale-95"
            >
              {angleUnit}
            </button>

            {/* Scientific Notation Toggle */}
            <button
              onClick={() => setIsScientificNotation(!isScientificNotation)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition active:scale-95 ${
                isScientificNotation
                  ? "bg-emerald-950 text-emerald-400 border-emerald-700/60 shadow-sm shadow-emerald-950"
                  : "bg-slate-800/60 text-slate-400 border-slate-700/50 hover:bg-slate-700"
              }`}
            >
              {isScientificNotation ? "SCI (On)" : "NORM"}
            </button>

            {/* 2nd Function Toggle */}
            <button
              onClick={() => setIsSecondFunction(!isSecondFunction)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition active:scale-95 ${
                isSecondFunction
                  ? "bg-amber-950 text-amber-400 border-amber-700/60 shadow-sm shadow-amber-950"
                  : "bg-slate-800/60 text-slate-400 border-slate-700/50 hover:bg-slate-700"
              }`}
            >
              2nd
            </button>
          </div>

          {/* Memory Indicator Badge */}
          <div className="flex items-center gap-2 text-xs font-mono bg-slate-950/60 px-3 py-1.5 rounded-xl border border-slate-800/80">
            <span className="text-slate-500">MEM:</span>
            <span
              className={`font-bold ${memory !== 0 ? "text-cyan-400" : "text-slate-600"}`}
            >
              {memory}
            </span>
          </div>
        </div>

        {/* Display Screen */}
        <div className="bg-slate-950 border border-slate-800/90 rounded-2xl p-5 mb-6 shadow-inner text-right min-h-[125px] flex flex-col justify-between relative group">
          {/* Active Formula Expression Line */}
          <div className="text-slate-400 text-sm font-mono tracking-wide overflow-x-auto whitespace-nowrap scrollbar-none min-h-[24px]">
            {input ? (
              <span className="text-slate-300">{input}</span>
            ) : (
              <span className="text-slate-600 italic text-xs">
                Ready for input...
              </span>
            )}
          </div>

          {/* Formatted Output Line */}
          <div className="text-3xl sm:text-5xl font-extrabold text-cyan-400 font-mono tracking-tight overflow-x-auto whitespace-nowrap pt-2 drop-shadow-[0_0_12px_rgba(6,182,212,0.15)]">
            {result}
          </div>
        </div>

        {/* Keypad Wrapper */}
        <div className="space-y-4">
          {/* SECTION 1: Memory & Scientific Functions (6 Columns) */}
          <div className="grid grid-cols-6 gap-2">
            {/* Memory Controls */}
            <button onClick={() => handleMemory("MC")} className="btn-mem">
              MC
            </button>
            <button onClick={() => handleMemory("MR")} className="btn-mem">
              MR
            </button>
            <button onClick={() => handleMemory("M+")} className="btn-mem">
              M+
            </button>
            <button onClick={() => handleMemory("M-")} className="btn-mem">
              M-
            </button>
            <button onClick={() => handleMemory("MS")} className="btn-mem">
              MS
            </button>
            <button
              onClick={() => appendSymbol("Ans")}
              className="btn-mem text-cyan-400 font-bold"
            >
              Ans
            </button>

            {/* Trig Row */}
            <button
              onClick={() => appendSymbol(isSecondFunction ? "asin(" : "sin(")}
              className="btn-sci"
            >
              {isSecondFunction ? "sin⁻¹" : "sin"}
            </button>
            <button
              onClick={() => appendSymbol(isSecondFunction ? "acos(" : "cos(")}
              className="btn-sci"
            >
              {isSecondFunction ? "cos⁻¹" : "cos"}
            </button>
            <button
              onClick={() => appendSymbol(isSecondFunction ? "atan(" : "tan(")}
              className="btn-sci"
            >
              {isSecondFunction ? "tan⁻¹" : "tan"}
            </button>
            <button onClick={() => appendSymbol("π")} className="btn-sci">
              π
            </button>
            <button onClick={() => appendSymbol("e")} className="btn-sci">
              e
            </button>
            <button
              onClick={() => appendSymbol("(")}
              className="btn-sci text-cyan-400"
            >
              (
            </button>

            {/* Powers & Roots */}
            <button onClick={() => appendSymbol("^2")} className="btn-sci">
              x²
            </button>
            <button onClick={() => appendSymbol("^")} className="btn-sci">
              xⁿ
            </button>
            <button
              onClick={() => appendSymbol(isSecondFunction ? "∛(" : "√(")}
              className="btn-sci"
            >
              {isSecondFunction ? "∛" : "√"}
            </button>
            <button onClick={() => appendSymbol("log(")} className="btn-sci">
              log
            </button>
            <button onClick={() => appendSymbol("ln(")} className="btn-sci">
              ln
            </button>
            <button
              onClick={() => appendSymbol(")")}
              className="btn-sci text-cyan-400"
            >
              )
            </button>

            {/* Advanced Functions */}
            <button onClick={() => appendSymbol("10^(")} className="btn-sci">
              10ˣ
            </button>
            <button onClick={() => appendSymbol("!")} className="btn-sci">
              n!
            </button>
            <button onClick={() => appendSymbol("%")} className="btn-sci">
              %
            </button>
            <button onClick={() => appendSymbol("e+")} className="btn-sci">
              EE
            </button>
            <button
              onClick={() => setIsScientificNotation(!isScientificNotation)}
              className="btn-sci text-xs"
            >
              EXP
            </button>
            <button onClick={() => appendSymbol("^3")} className="btn-sci">
              x³
            </button>
          </div>

          {/* Divider Line */}
          <div className="border-t border-slate-800/80 my-2" />

          {/* SECTION 2: Numeric Pad & Primary Operators (5 Columns) */}
          <div className="grid grid-cols-5 gap-2.5">
            {/* Row 1 */}
            <button onClick={() => appendSymbol("7")} className="btn-num">
              7
            </button>
            <button onClick={() => appendSymbol("8")} className="btn-num">
              8
            </button>
            <button onClick={() => appendSymbol("9")} className="btn-num">
              9
            </button>
            <button onClick={deleteLast} className="btn-warning">
              DEL
            </button>
            <button onClick={clearAll} className="btn-danger">
              AC
            </button>

            {/* Row 2 */}
            <button onClick={() => appendSymbol("4")} className="btn-num">
              4
            </button>
            <button onClick={() => appendSymbol("5")} className="btn-num">
              5
            </button>
            <button onClick={() => appendSymbol("6")} className="btn-num">
              6
            </button>
            <button onClick={() => appendSymbol("×")} className="btn-op">
              ×
            </button>
            <button onClick={() => appendSymbol("÷")} className="btn-op">
              ÷
            </button>

            {/* Row 3 */}
            <button onClick={() => appendSymbol("1")} className="btn-num">
              1
            </button>
            <button onClick={() => appendSymbol("2")} className="btn-num">
              2
            </button>
            <button onClick={() => appendSymbol("3")} className="btn-num">
              3
            </button>
            <button onClick={() => appendSymbol("+")} className="btn-op">
              +
            </button>
            <button onClick={() => appendSymbol("-")} className="btn-op">
              -
            </button>

            {/* Row 4 */}
            <button
              onClick={() => appendSymbol("0")}
              className="btn-num col-span-2"
            >
              0
            </button>
            <button
              onClick={() => appendSymbol(".")}
              className="btn-num font-bold"
            >
              .
            </button>
            <button onClick={calculateResult} className="btn-equals col-span-2">
              =
            </button>
          </div>
        </div>
      </div>

      {/* History Drawer Sidebar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-2xl backdrop-blur-xl flex flex-col justify-between min-h-[500px]">
        <div>
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <span>🕒</span> Calculation Log
            </h3>
            {history.length > 0 && (
              <button
                onClick={() => setHistory([])}
                className="text-xs text-rose-400 hover:text-rose-300 font-medium transition"
              >
                Clear All
              </button>
            )}
          </div>

          <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
            {history.length === 0 ? (
              <div className="text-center py-16 space-y-2">
                <span className="text-2xl block opacity-40">📊</span>
                <p className="text-xs text-slate-500 italic">
                  No calculations recorded yet.
                </p>
              </div>
            ) : (
              history.map((item, index) => {
                const parts = item.split("=");
                return (
                  <div
                    key={index}
                    onClick={() => {
                      if (parts[1]) setResult(parts[1].trim());
                    }}
                    className="bg-slate-950/80 border border-slate-800/80 p-3 rounded-xl text-xs font-mono cursor-pointer hover:border-cyan-500/50 hover:bg-slate-950 transition group"
                  >
                    <span className="text-slate-400 block group-hover:text-slate-300 truncate">
                      {parts[0]}
                    </span>
                    <span className="text-cyan-400 font-bold block mt-1 text-right text-sm">
                      = {parts[1]}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-500 text-center">
          💡 Click any past calculation result to bring it directly onto your
          screen.
        </div>
      </div>
    </div>
  );
}
