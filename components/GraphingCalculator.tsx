"use client";

import { useEffect, useRef, useState } from "react";

export default function GraphingCalculator() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [funcInput1, setFuncInput1] = useState<string>("Math.sin(x)");
  const [funcInput2, setFuncInput2] = useState<string>("x^2 - 4");
  const [enableFunc2, setEnableFunc2] = useState<boolean>(false);

  const [xMin, setXMin] = useState<number>(-10);
  const [xMax, setXMax] = useState<number>(10);
  const [yMin, setYMin] = useState<number>(-10);
  const [yMax, setYMax] = useState<number>(10);

  const drawGraph = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear background
    ctx.fillStyle = "#020617";
    ctx.fillRect(0, 0, width, height);

    // Coordinate transformations
    const toScreenX = (x: number) => ((x - xMin) / (xMax - xMin)) * width;
    const toScreenY = (y: number) =>
      height - ((y - yMin) / (yMax - yMin)) * height;

    // Grid lines
    ctx.strokeStyle = "#1e293b";
    ctx.lineWidth = 1;

    for (let x = Math.ceil(xMin); x <= Math.floor(xMax); x++) {
      const sx = toScreenX(x);
      ctx.beginPath();
      ctx.moveTo(sx, 0);
      ctx.lineTo(sx, height);
      ctx.stroke();
    }

    for (let y = Math.ceil(yMin); y <= Math.floor(yMax); y++) {
      const sy = toScreenY(y);
      ctx.beginPath();
      ctx.moveTo(0, sy);
      ctx.lineTo(width, sy);
      ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = "#64748b";
    ctx.lineWidth = 2;

    const originX = toScreenX(0);
    const originY = toScreenY(0);

    // X Axis
    ctx.beginPath();
    ctx.moveTo(0, originY);
    ctx.lineTo(width, originY);
    ctx.stroke();

    // Y Axis
    ctx.beginPath();
    ctx.moveTo(originX, 0);
    ctx.lineTo(originX, height);
    ctx.stroke();

    // Function plotting engine
    const plotFunction = (fnExpr: string, color: string) => {
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.beginPath();

      let isDrawing = false;
      const step = (xMax - xMin) / width;

      for (let px = 0; px <= width; px++) {
        const x = xMin + px * step;
        try {
          // Replace common mathematical shorthands
          const sanitized = fnExpr
            .replace(/\^/g, "**")
            .replace(/sin/g, "Math.sin")
            .replace(/cos/g, "Math.cos")
            .replace(/tan/g, "Math.tan")
            .replace(/sqrt/g, "Math.sqrt")
            .replace(/abs/g, "Math.abs");

          const y = new Function("x", `return ${sanitized}`)(x);

          if (isNaN(y) || !isFinite(y)) {
            isDrawing = false;
            continue;
          }

          const py = toScreenY(y);

          if (!isDrawing) {
            ctx.moveTo(px, py);
            isDrawing = true;
          } else {
            ctx.lineTo(px, py);
          }
        } catch {
          // Ignore parse errors while typing
        }
      }
      ctx.stroke();
    };

    if (funcInput1) plotFunction(funcInput1, "#06b6d4"); // Cyan for f1(x)
    if (enableFunc2 && funcInput2) plotFunction(funcInput2, "#f59e0b"); // Amber for f2(x)
  };

  useEffect(() => {
    drawGraph();
  }, [funcInput1, funcInput2, enableFunc2, xMin, xMax, yMin, yMax]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Canvas Display */}
      <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-2xl flex flex-col items-center">
        <div className="w-full flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-slate-200">
            Interactive Function Plotter
          </h3>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1 text-cyan-400">
              <span className="w-3 h-3 rounded-full bg-cyan-500 inline-block"></span>{" "}
              f₁(x)
            </span>
            {enableFunc2 && (
              <span className="flex items-center gap-1 text-amber-400">
                <span className="w-3 h-3 rounded-full bg-amber-500 inline-block"></span>{" "}
                f₂(x)
              </span>
            )}
          </div>
        </div>

        <div className="w-full aspect-[4/3] bg-slate-950 rounded-xl overflow-hidden border border-slate-800 relative">
          <canvas
            ref={canvasRef}
            width={600}
            height={450}
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      {/* Control Panel */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-5">
        <h3 className="text-sm font-bold text-slate-200 pb-2 border-b border-slate-800">
          Equation Controls
        </h3>

        {/* Function 1 */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-cyan-400">
            Primary Function f₁(x):
          </label>
          <input
            type="text"
            value={funcInput1}
            onChange={(e) => setFuncInput1(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm font-mono text-slate-100 focus:outline-none focus:border-cyan-500 transition"
            placeholder="e.g. Math.sin(x) or x^2 - 3"
          />
        </div>

        {/* Function 2 Toggle */}
        <div className="space-y-2 pt-2 border-t border-slate-800/80">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-amber-400">
              Secondary Function f₂(x):
            </label>
            <input
              type="checkbox"
              checked={enableFunc2}
              onChange={(e) => setEnableFunc2(e.target.checked)}
              className="accent-amber-500 rounded cursor-pointer"
            />
          </div>
          {enableFunc2 && (
            <input
              type="text"
              value={funcInput2}
              onChange={(e) => setFuncInput2(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm font-mono text-slate-100 focus:outline-none focus:border-amber-500 transition"
              placeholder="e.g. 2*x + 1"
            />
          )}
        </div>

        {/* Viewport Range Settings */}
        <div className="pt-3 border-t border-slate-800 space-y-3">
          <h4 className="text-xs font-semibold text-slate-300">
            Viewport Axis Range
          </h4>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-slate-400 block mb-1">X Minimum</span>
              <input
                type="number"
                value={xMin}
                onChange={(e) => setXMin(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 font-mono text-slate-200"
              />
            </div>
            <div>
              <span className="text-slate-400 block mb-1">X Maximum</span>
              <input
                type="number"
                value={xMax}
                onChange={(e) => setXMax(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 font-mono text-slate-200"
              />
            </div>
            <div>
              <span className="text-slate-400 block mb-1">Y Minimum</span>
              <input
                type="number"
                value={yMin}
                onChange={(e) => setYMin(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 font-mono text-slate-200"
              />
            </div>
            <div>
              <span className="text-slate-400 block mb-1">Y Maximum</span>
              <input
                type="number"
                value={yMax}
                onChange={(e) => setYMax(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 font-mono text-slate-200"
              />
            </div>
          </div>
        </div>

        {/* Quick Reset Presets */}
        <div className="flex gap-2 pt-2">
          <button
            onClick={() => {
              setXMin(-10);
              setXMax(10);
              setYMin(-10);
              setYMax(10);
            }}
            className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 py-1.5 rounded text-xs transition"
          >
            Reset Scale (10x10)
          </button>
        </div>
      </div>
    </div>
  );
}
