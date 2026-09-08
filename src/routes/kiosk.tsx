import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { ArrowLeft, CheckCircle2, Loader2, UploadCloud, Activity, Clock } from "lucide-react";

export const Route = createFileRoute("/kiosk")({
  head: () => ({
    meta: [
      { title: "PHC Kiosk Intake — Drishti.AI" },
      {
        name: "description",
        content:
          "Upload a fundus image at the PHC kiosk and get an instant AI diabetic retinopathy grade plus specialist queue status.",
      },
      { property: "og:title", content: "PHC Kiosk Intake — Drishti.AI" },
      {
        property: "og:description",
        content: "Upload a fundus image and get an instant AI diabetic retinopathy grade.",
      },
    ],
  }),
  component: KioskPage,
});

type Stage = "idle" | "processing" | "result";

function KioskPage() {
  const [stage, setStage] = useState<Stage>("idle");
  const [fileName, setFileName] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(file: File | undefined | null) {
    if (!file) return;
    setFileName(file.name);
    setPreview(URL.createObjectURL(file));
    setStage("processing");
    // Mock Supabase upload + AI inference round-trip.
    setTimeout(() => setStage("result"), 2000);
  }

  function reset() {
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setFileName(null);
    setStage("idle");
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <main className="min-h-screen bg-white px-4 py-10">
      <div className="mx-auto w-full max-w-2xl">
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
            Upload a fundus photograph to begin AI screening.
          </p>
        </header>

        <section className="mt-8">
          {stage === "idle" && (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragging(false);
                handleFile(e.dataTransfer.files?.[0]);
              }}
              onClick={() => inputRef.current?.click()}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
              }}
              className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-16 text-center transition-colors ${
                dragging ? "border-rose-500 bg-pink-100" : "border-pink-200 bg-pink-50"
              }`}
            >
              <UploadCloud className="h-12 w-12 text-rose-600" />
              <p className="mt-4 text-lg font-medium text-slate-900">
                Drag &amp; drop the fundus image here
              </p>
              <p className="mt-1 text-sm text-slate-500">or click to browse (.jpg / .png)</p>
              <input
                ref={inputRef}
                type="file"
                accept="image/jpeg,image/png"
                className="hidden"
                onChange={(e) => handleFile(e.target.files?.[0])}
              />
            </div>
          )}

          {stage === "processing" && (
            <div className="flex flex-col items-center justify-center rounded-2xl bg-pink-50 px-6 py-20 text-center">
              <Loader2 className="h-10 w-10 animate-spin text-rose-600" />
              <p className="mt-5 text-base font-medium text-slate-900">
                Uploading to Database &amp; Running AI Analysis...
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
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Quality Check
                    </p>
                    <p className="font-medium text-green-600">Pass (Image saved to DB)</p>
                  </div>
                </div>

                <div className="rounded-xl bg-pink-50 p-5">
                  <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-400">
                    <Activity className="h-4 w-4 text-rose-600" /> AI Diagnosis
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
                      Added to Specialist Queue. ETA for doctor verification: 14 minutes.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={reset}
                  className="w-full rounded-xl bg-rose-600 px-5 py-3 font-semibold text-white transition-colors hover:bg-rose-700"
                >
                  Scan Next Patient
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
