import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Loader2,
  UploadCloud,
  Activity,
  Clock,
  History,
  X,
  Flame,
  User,
  Phone,
  IdCard,
  Lock,
} from "lucide-react";
import fundus from "@/assets/fundus.jpg";

export const Route = createFileRoute("/kiosk")({
  head: () => ({
    meta: [
      { title: "Kiosk Upload & Status Tracker — Drishti.AI" },
      {
        name: "description",
        content:
          "Upload fundus images at the PHC kiosk, get an instant AI retinopathy grade, and track specialist verification status for every scan.",
      },
      { property: "og:title", content: "Kiosk Upload & Status Tracker — Drishti.AI" },
      {
        property: "og:description",
        content: "Instant AI grading plus a live verification status tracker for kiosk operators.",
      },
    ],
  }),
  component: KioskPage,
});

type Stage = "idle" | "processing" | "result";

type Scan = {
  id: string;
  timestamp: string;
  grade: string;
  status: "pending" | "verified";
  image: string;
  finalGrade?: string;
  doctor?: string;
  notes?: string;
  patientName?: string;
  contact?: string;
  specialId?: string;
};

const NAME_RE = /^[a-zA-Z][a-zA-Z\s.'-]{1,99}$/;
// +91 followed by a valid 10-digit Indian mobile number.
const PHONE_RE = /^\+91[6-9]\d{9}$/;
const ID_RE = /^[a-zA-Z0-9-]{4,32}$/;

// Mock rows standing in for a Supabase `screenings` table.
const INITIAL_HISTORY: Scan[] = [
  {
    id: "P-1042",
    timestamp: "08 Sep 2026, 10:14",
    grade: "Grade 2: Moderate NPDR",
    status: "verified",
    image: fundus,
    finalGrade: "Grade 2: Moderate NPDR",
    doctor: "Dr. Sharma",
    notes: "Confirmed AI grade. Scattered microaneurysms in superior temporal quadrant. Review in 6 months.",
  },
  {
    id: "P-1043",
    timestamp: "08 Sep 2026, 10:41",
    grade: "Grade 3: Severe NPDR",
    status: "verified",
    image: fundus,
    finalGrade: "Grade 4: Proliferative DR",
    doctor: "Dr. Sharma",
    notes: "Overridden — neovascularisation at the disc visible. Urgent referral to district hospital.",
  },
  {
    id: "P-1044",
    timestamp: "08 Sep 2026, 11:05",
    grade: "Grade 1: Mild NPDR",
    status: "pending",
    image: fundus,
  },
];

function StatusBadge({ scan }: { scan: Scan }) {
  if (scan.status === "verified") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
        <CheckCircle2 className="h-3.5 w-3.5" />
        Verified by {scan.doctor}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-50 px-2.5 py-1 text-xs font-medium text-orange-700">
      <Clock className="h-3.5 w-3.5" />
      Pending Doctor Review
    </span>
  );
}

function KioskPage() {
  const [tab, setTab] = useState<"upload" | "history">("upload");
  const [stage, setStage] = useState<Stage>("idle");
  const [fileName, setFileName] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [history, setHistory] = useState<Scan[]>(INITIAL_HISTORY);
  const [selected, setSelected] = useState<Scan | null>(null);
  const [heatmap, setHeatmap] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const [patientName, setPatientName] = useState("");
  const [contact, setContact] = useState("");
  const [specialId, setSpecialId] = useState("");

  const nameOk = NAME_RE.test(patientName.trim());
  const phoneOk = PHONE_RE.test(contact.trim().replace(/[\s-]/g, ""));
  const idOk = ID_RE.test(specialId.trim());
  const formValid = nameOk && phoneOk && idOk;

  function handleFile(file: File | undefined | null) {
    if (!file || !formValid) return;
    const url = URL.createObjectURL(file);
    setFileName(file.name);
    setPreview(url);
    setStage("processing");
    // Mock upload + AI inference round-trip.
    setTimeout(() => {
      setStage("result");
      setHistory((prev) => [
        {
          id: `P-${1045 + prev.length - INITIAL_HISTORY.length + 1}`,
          timestamp: new Date().toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }),
          grade: "Grade 2: Moderate NPDR",
          status: "pending",
          image: url,
          patientName: patientName.trim(),
          contact: contact.trim(),
          specialId: specialId.trim(),
        },
        ...prev,
      ]);
    }, 2000);
  }

  function reset() {
    setPreview(null);
    setFileName(null);
    setStage("idle");
    setPatientName("");
    setContact("");
    setSpecialId("");
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <main className="min-h-screen bg-white px-4 py-10">
      <div className="mx-auto w-full max-w-3xl">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-slate-500 transition-colors hover:text-rose-600"
        >
          <ArrowLeft className="h-4 w-4" /> Exit kiosk
        </Link>

        <header className="mt-6 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Patient Intake Station
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Upload fundus photographs and track specialist verification.
          </p>
        </header>

        <div className="mx-auto mt-6 flex max-w-md gap-1 rounded-xl bg-pink-50 p-1">
          <button
            type="button"
            onClick={() => setTab("upload")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              tab === "upload" ? "bg-white text-rose-700 shadow-sm" : "text-slate-500"
            }`}
          >
            <UploadCloud className="h-4 w-4" /> New Scan
          </button>
          <button
            type="button"
            onClick={() => setTab("history")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              tab === "history" ? "bg-white text-rose-700 shadow-sm" : "text-slate-500"
            }`}
          >
            <History className="h-4 w-4" /> History ({history.length})
          </button>
        </div>

        {tab === "upload" && (
          <section className="mt-8">
            {stage === "idle" && (
              <div className="space-y-5">
                <div className="rounded-2xl border border-pink-100 bg-pink-50 p-6">
                  <h2 className="text-sm font-semibold text-slate-900">Patient Details</h2>
                  <p className="mt-0.5 text-xs text-slate-500">
                    Required before the upload zone unlocks.
                  </p>
                  <div className="mt-4 space-y-4">
                    <label className="block">
                      <span className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-slate-600">
                        <User className="h-3.5 w-3.5 text-rose-600" /> Patient Full Name
                      </span>
                      <input
                        type="text"
                        value={patientName}
                        onChange={(e) => setPatientName(e.target.value)}
                        placeholder="e.g. Ramesh Kumar"
                        maxLength={100}
                        className="w-full rounded-xl border border-pink-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
                      />
                    </label>
                    <label className="block">
                      <span className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-slate-600">
                        <Phone className="h-3.5 w-3.5 text-rose-600" /> Contact Number
                      </span>
                      <input
                        type="tel"
                        value={contact}
                        onChange={(e) => setContact(e.target.value)}
                        placeholder="+91 98765 43210"
                        maxLength={16}
                        className="w-full rounded-xl border border-pink-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
                      />
                      {contact.trim() !== "" && !phoneOk && (
                        <p className="mt-1 text-xs text-rose-600">
                          Enter a valid number: +91 followed by 10 digits.
                        </p>
                      )}
                    </label>
                    <label className="block">
                      <span className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-slate-600">
                        <IdCard className="h-3.5 w-3.5 text-rose-600" /> Special ID / ABHA ID / Local ID
                      </span>
                      <input
                        type="text"
                        value={specialId}
                        onChange={(e) => setSpecialId(e.target.value)}
                        placeholder="e.g. 12-3456-7890-1234"
                        maxLength={32}
                        className="w-full rounded-xl border border-pink-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
                      />
                    </label>
                  </div>
                </div>

                {!formValid && (
                  <p className="flex items-center justify-center gap-2 text-sm text-slate-500">
                    <Lock className="h-4 w-4 text-rose-500" />
                    Fill in all patient details above to unlock image upload.
                  </p>
                )}

                <div
                  aria-disabled={!formValid}
                  onDragOver={(e) => {
                    if (!formValid) return;
                    e.preventDefault();
                    setDragging(true);
                  }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragging(false);
                    if (formValid) handleFile(e.dataTransfer.files?.[0]);
                  }}
                  onClick={() => formValid && inputRef.current?.click()}
                  role="button"
                  tabIndex={formValid ? 0 : -1}
                  onKeyDown={(e) => {
                    if (formValid && (e.key === "Enter" || e.key === " "))
                      inputRef.current?.click();
                  }}
                  className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-16 text-center transition-colors ${
                    !formValid
                      ? "cursor-not-allowed border-slate-200 bg-slate-50 opacity-60"
                      : dragging
                        ? "cursor-pointer border-rose-500 bg-pink-100"
                        : "cursor-pointer border-pink-200 bg-pink-50"
                  }`}
                >
                  {formValid ? (
                    <UploadCloud className="h-12 w-12 text-rose-600" />
                  ) : (
                    <Lock className="h-12 w-12 text-slate-400" />
                  )}
                  <p className="mt-4 text-lg font-medium text-slate-900">
                    Drag &amp; drop the fundus image here
                  </p>
                  <p className="mt-1 text-sm text-slate-500">or click to browse (.jpg / .png)</p>
                  <input
                    ref={inputRef}
                    type="file"
                    accept="image/jpeg,image/png"
                    disabled={!formValid}
                    className="hidden"
                    onChange={(e) => handleFile(e.target.files?.[0])}
                  />
                </div>
              </div>
            )}

            {stage === "processing" && (
              <div className="flex flex-col items-center justify-center rounded-2xl bg-pink-50 px-6 py-20 text-center">
                <Loader2 className="h-10 w-10 animate-spin text-rose-600" />
                <p className="mt-5 text-base font-medium text-slate-900">
                  Uploading to database &amp; running MATLAB/AI pipeline...
                </p>
                {fileName && <p className="mt-1 text-sm text-slate-500">{fileName}</p>}
              </div>
            )}

            {stage === "result" && (
              <div className="overflow-hidden rounded-2xl border border-pink-100 bg-white shadow-sm">
                {preview && (
                  <img
                    src={preview}
                    alt="Uploaded fundus scan"
                    className="h-56 w-full bg-black object-contain"
                  />
                )}
                <div className="space-y-5 p-6">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                        Quality Check
                      </p>
                      <p className="font-medium text-emerald-600">Pass (Image saved to database)</p>
                    </div>
                  </div>

                  <div className="rounded-xl bg-pink-50 p-5">
                    <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-400">
                      <Activity className="h-4 w-4 text-rose-600" /> AI Preliminary Grade
                    </div>
                    <p className="mt-2 text-2xl font-bold text-rose-700">Grade 2: Moderate NPDR</p>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="mt-0.5 h-5 w-5 shrink-0 text-slate-400" />
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                        Next Steps
                      </p>
                      <p className="text-slate-700">
                        Added to specialist queue. ETA for doctor verification: 14 minutes.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 sm:flex-row">
                    <button
                      type="button"
                      onClick={reset}
                      className="w-full rounded-xl bg-rose-600 px-5 py-3 font-semibold text-white transition-colors hover:bg-rose-700"
                    >
                      Scan Next Patient
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        reset();
                        setTab("history");
                      }}
                      className="w-full rounded-xl border border-pink-200 bg-pink-50 px-5 py-3 font-semibold text-slate-800 transition-colors hover:bg-pink-100"
                    >
                      View History
                    </button>
                  </div>
                </div>
              </div>
            )}
          </section>
        )}

        {tab === "history" && (
          <section className="mt-8 overflow-hidden rounded-2xl border border-pink-100">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] text-left text-sm">
                <thead className="bg-pink-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-4 py-3 font-medium">Patient ID</th>
                    <th className="px-4 py-3 font-medium">Timestamp</th>
                    <th className="px-4 py-3 font-medium">AI Grade</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-pink-100">
                  {history.map((scan) => (
                    <tr
                      key={scan.id + scan.timestamp}
                      onClick={() => {
                        setSelected(scan);
                        setHeatmap(false);
                      }}
                      className="cursor-pointer bg-white transition-colors hover:bg-pink-50"
                    >
                      <td className="px-4 py-3">
                        <p className="font-medium text-slate-900">{scan.id}</p>
                        {scan.patientName && (
                          <p className="text-xs text-slate-500">{scan.patientName}</p>
                        )}
                      </td>
                      <td className="px-4 py-3 text-slate-500">{scan.timestamp}</td>
                      <td className="px-4 py-3 text-slate-700">{scan.grade}</td>
                      <td className="px-4 py-3">
                        <StatusBadge scan={scan} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 p-0 sm:items-center sm:p-4"
          onClick={() => setSelected(null)}
>
          <div
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-white p-6 shadow-xl sm:rounded-2xl"
          >
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  {selected.patientName ?? selected.id}
                </h2>
                <p className="text-sm text-slate-500">
                  {selected.id} · {selected.timestamp}
                </p>
                {selected.contact && (
                  <p className="mt-0.5 text-xs text-slate-500">
                    {selected.contact}
                    {selected.specialId ? ` · ID: ${selected.specialId}` : ""}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                aria-label="Close"
                className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-pink-50 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="relative mt-4 overflow-hidden rounded-xl bg-black">
              <img
                src={selected.image}
                alt={`Fundus scan for ${selected.id}`}
                className="h-64 w-full object-contain"
              />
              {heatmap && selected.status === "verified" && (
                <div
                  className="pointer-events-none absolute inset-0 mix-blend-screen"
                  style={{
                    background:
                      "radial-gradient(circle at 38% 45%, rgba(255,0,0,0.55), transparent 22%), radial-gradient(circle at 60% 58%, rgba(255,180,0,0.45), transparent 20%), radial-gradient(circle at 50% 50%, rgba(0,80,255,0.25), transparent 60%)",
                  }}
                />
              )}
            </div>

            {selected.status === "verified" && (
              <button
                type="button"
                onClick={() => setHeatmap((v) => !v)}
                className="mt-3 inline-flex items-center gap-2 rounded-xl border border-pink-200 bg-pink-50 px-4 py-2 text-sm font-medium text-slate-800 transition-colors hover:bg-pink-100"
              >
                <Flame className="h-4 w-4 text-rose-600" />
                {heatmap ? "Hide Grad-CAM heatmap" : "Show Grad-CAM heatmap"}
              </button>
            )}

            <div className="mt-5 space-y-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  AI Preliminary Grade
                </p>
                <p className="text-slate-800">{selected.grade}</p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Verification
                </p>
                <div className="mt-1">
                  <StatusBadge scan={selected} />
                </div>
              </div>

              {selected.status === "verified" ? (
                <div className="rounded-xl bg-emerald-50 p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-emerald-700">
                    Final Grade
                  </p>
                  <p className="font-semibold text-emerald-800">{selected.finalGrade}</p>
                  <p className="mt-2 text-sm text-emerald-900/80">{selected.notes}</p>
                </div>
              ) : (
                <div className="rounded-xl bg-orange-50 p-4 text-sm text-orange-800">
                  Awaiting specialist sign-off. Grad-CAM overlay unlocks after verification.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
