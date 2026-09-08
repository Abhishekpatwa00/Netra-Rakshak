import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, CheckCircle2, XCircle, Users } from "lucide-react";
import fundus from "@/assets/fundus.jpg";

export const Route = createFileRoute("/doctor")({
  head: () => ({
    meta: [
      { title: "Specialist Validation Console — Drishti.AI" },
      {
        name: "description",
        content:
          "Review queued retinopathy cases, inspect Grad-CAM explainability overlays, and confirm or override AI grades.",
      },
      { property: "og:title", content: "Specialist Validation Console — Drishti.AI" },
      {
        property: "og:description",
        content: "Review AI-graded retinopathy cases with Grad-CAM explainability overlays.",
      },
    ],
  }),
  component: DoctorPage,
});

type Patient = {
  id: string;
  grade: number;
  gradeLabel: string;
  wait: string;
  age: number;
  center: string;
};

// Mock rows standing in for a Supabase `screenings` table.
const INITIAL_QUEUE: Patient[] = [
  { id: "P-1042", grade: 2, gradeLabel: "Moderate NPDR", wait: "14 mins", age: 54, center: "PHC Anand" },
  { id: "P-1043", grade: 3, gradeLabel: "Severe NPDR", wait: "9 mins", age: 61, center: "PHC Nadiad" },
  { id: "P-1044", grade: 1, gradeLabel: "Mild NPDR", wait: "6 mins", age: 47, center: "PHC Anand" },
  { id: "P-1045", grade: 4, gradeLabel: "Proliferative DR", wait: "3 mins", age: 66, center: "PHC Borsad" },
  { id: "P-1046", grade: 0, gradeLabel: "No DR", wait: "1 min", age: 38, center: "PHC Nadiad" },
];

const GRADES = [
  "Grade 0: No DR",
  "Grade 1: Mild NPDR",
  "Grade 2: Moderate NPDR",
  "Grade 3: Severe NPDR",
  "Grade 4: Proliferative DR",
];

function DoctorPage() {
  const [queue, setQueue] = useState<Patient[]>(INITIAL_QUEUE);
  const [selectedId, setSelectedId] = useState<string | null>(INITIAL_QUEUE[0]!.id);
  const [heatmap, setHeatmap] = useState(false);
  const [finalGrade, setFinalGrade] = useState<number>(INITIAL_QUEUE[0]!.grade);

  const selected = queue.find((p) => p.id === selectedId) ?? null;

  function select(p: Patient) {
    setSelectedId(p.id);
    setFinalGrade(p.grade);
    setHeatmap(false);
  }

  function resolve() {
    if (!selected) return;
    const remaining = queue.filter((p) => p.id !== selected.id);
    setQueue(remaining);
    const next = remaining[0] ?? null;
    setSelectedId(next?.id ?? null);
    setFinalGrade(next?.grade ?? 0);
    setHeatmap(false);
  }

  return (
    <main className="min-h-screen bg-white">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-pink-100 px-5 py-4">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-slate-500 transition-colors hover:text-rose-600"
          >
            <ArrowLeft className="h-4 w-4" /> Sign out
          </Link>
          <span className="hidden h-4 w-px bg-pink-200 sm:block" />
          <h1 className="text-base font-semibold text-slate-900">Specialist Validation Console</h1>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-pink-50 px-3 py-1 text-sm text-rose-700">
          <Users className="h-4 w-4" /> {queue.length} pending
        </div>
      </header>

      <div className="grid gap-5 p-5 lg:grid-cols-[340px_1fr]">
        {/* Queue */}
        <aside className="rounded-2xl border border-pink-100 bg-white">
          <div className="border-b border-pink-100 px-4 py-3">
            <h2 className="text-sm font-semibold text-slate-900">Pending Queue</h2>
            <p className="text-xs text-slate-400">Awaiting specialist verification</p>
          </div>
          <ul className="max-h-[70vh] divide-y divide-pink-50 overflow-y-auto">
            {queue.map((p) => {
              const active = p.id === selectedId;
              return (
                <li key={p.id}>
                  <button
                    type="button"
                    onClick={() => select(p)}
                    className={`flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors ${
                      active ? "bg-pink-50 border-l-4 border-rose-600" : "hover:bg-pink-50/60 border-l-4 border-transparent"
                    }`}
                  >
                    <span>
                      <span className="block text-sm font-semibold text-slate-900">{p.id}</span>
                      <span className="block text-xs text-slate-500">
                        {p.age}y · {p.center}
                      </span>
                    </span>
                    <span className="text-right">
                      <span className="block rounded-full bg-rose-600 px-2 py-0.5 text-xs font-medium text-white">
                        Grade {p.grade}
                      </span>
                      <span className="mt-1 block text-xs text-slate-400">{p.wait}</span>
                    </span>
                  </button>
                </li>
              );
            })}
            {queue.length === 0 && (
              <li className="px-4 py-10 text-center text-sm text-slate-400">
                Queue cleared. All cases verified.
              </li>
            )}
          </ul>
        </aside>

        {/* XAI console */}
        <section className="rounded-2xl border border-pink-100 bg-white">
          {selected ? (
            <div className="flex h-full flex-col">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-pink-100 px-5 py-4">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">{selected.id}</h2>
                  <p className="text-sm text-slate-500">
                    AI prediction:{" "}
                    <span className="font-medium text-rose-700">
                      Grade {selected.grade}: {selected.gradeLabel}
                    </span>
                  </p>
                </div>
                <label className="flex cursor-pointer items-center gap-3 text-sm text-slate-700">
                  Overlay Grad-CAM Heatmap
                  <span className="relative inline-flex">
                    <input
                      type="checkbox"
                      checked={heatmap}
                      onChange={(e) => setHeatmap(e.target.checked)}
                      className="peer sr-only"
                    />
                    <span className="block h-6 w-11 rounded-full bg-pink-200 transition-colors peer-checked:bg-rose-600" />
                    <span className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform peer-checked:translate-x-5" />
                  </span>
                </label>
              </div>

              <div className="p-5">
                <div className="relative mx-auto aspect-square w-full max-w-xl overflow-hidden rounded-xl bg-black">
                  <img
                    src={fundus}
                    alt={`Fundus scan for patient ${selected.id}`}
                    width={1024}
                    height={1024}
                    className="h-full w-full object-contain"
                  />
                  {heatmap && (
                    <div
                      className="pointer-events-none absolute inset-0 mix-blend-screen opacity-70"
                      style={{
                        background:
                          "radial-gradient(circle at 38% 44%, rgba(255,0,0,0.85) 0%, rgba(255,180,0,0.55) 12%, rgba(0,200,255,0.28) 24%, transparent 38%), radial-gradient(circle at 63% 61%, rgba(255,40,0,0.7) 0%, rgba(255,220,0,0.45) 10%, rgba(0,160,255,0.22) 20%, transparent 32%), radial-gradient(circle at 52% 30%, rgba(255,120,0,0.5) 0%, rgba(0,180,255,0.2) 14%, transparent 26%)",
                      }}
                    />
                  )}
                  {heatmap && (
                    <span className="absolute bottom-3 left-3 rounded-md bg-black/70 px-2 py-1 text-xs text-white">
                      Grad-CAM activation — haemorrhages &amp; exudates
                    </span>
                  )}
                </div>
              </div>

              {/* Action bar */}
              <div className="mt-auto flex flex-col gap-3 border-t border-pink-100 bg-pink-50 px-5 py-4 sm:flex-row sm:items-center">
                <label className="flex items-center gap-2 text-sm text-slate-700">
                  Final Grade
                  <select
                    value={finalGrade}
                    onChange={(e) => setFinalGrade(Number(e.target.value))}
                    className="rounded-lg border border-pink-200 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-400"
                  >
                    {GRADES.map((label, i) => (
                      <option key={label} value={i}>
                        {label}
                      </option>
                    ))}
                  </select>
                </label>
                <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={resolve}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-2.5 font-semibold text-white transition-colors hover:bg-green-700"
                  >
                    <CheckCircle2 className="h-5 w-5" /> Confirm AI Diagnosis
                  </button>
                  <button
                    type="button"
                    onClick={resolve}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 px-5 py-2.5 font-semibold text-white transition-colors hover:bg-rose-700"
                  >
                    <XCircle className="h-5 w-5" /> Override Diagnosis
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex h-full min-h-[50vh] items-center justify-center px-6 text-center text-sm text-slate-400">
              No patient selected — the pending queue is empty.
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
