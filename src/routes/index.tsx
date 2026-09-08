import { createFileRoute, Link } from "@tanstack/react-router";
import { Eye, ScanEye, Brain, Timer, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Netra Rakshak — Explainable AI Retinal Screening" },
      {
        name: "description",
        content:
          "Explainable AI diabetic retinopathy screening for rural India: instant quality triage, Grad-CAM heatmaps, and 30-second specialist validation.",
      },
      { property: "og:title", content: "Drishti.AI — Explainable AI Retinal Screening" },
      {
        property: "og:description",
        content:
          "Instant quality triage, Grad-CAM lesion heatmaps, and rapid specialist sign-off for rural eye screening.",
      },
    ],
  }),
  component: LandingPage,
});

const FEATURES = [
  {
    icon: ScanEye,
    title: "Smart Quality Triage",
    body: "Instant focus and illumination check with automatic CLAHE enhancement.",
  },
  {
    icon: Brain,
    title: "Explainable Grad-CAM Heatmaps",
    body: "Zero black-box uncertainty; see exact lesion correlations.",
  },
  {
    icon: Timer,
    title: "Rapid Specialist Queue",
    body: "Risk-sorted triage enabling doctor sign-off in under 30 seconds.",
  },
];

function LandingPage() {
  return (
    <main className="min-h-screen bg-white">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-pink-50">
            <Eye className="h-5 w-5 text-rose-600" />
          </span>
          <span className="text-lg font-semibold tracking-tight text-slate-900">Netra Rakshak</span>
        </div>
        <Link
          to="/login"
          className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:text-rose-600"
        >
          Login
        </Link>
      </header>

      <section className="mx-auto w-full max-w-3xl px-6 pt-10 pb-16 text-center sm:pt-16">
        <p className="inline-flex rounded-full bg-pink-50 px-3 py-1 text-xs font-medium text-rose-700">
          Explainable screening for frontline care
        </p>
        <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          Explainable AI Retinal Screening for Rural India
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-base text-slate-500 sm:text-lg">
          Empowering frontline health workers with instant quality control, sub-pixel lesion
          detection, and 30-second specialist validation.
        </p>
        <Link
          to="/login"
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-rose-600 px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:ring-offset-2"
        >
          Access Portal / Login <ArrowRight className="h-5 w-5" />
        </Link>
      </section>

      <section className="mx-auto grid w-full max-w-6xl gap-5 px-6 pb-20 sm:grid-cols-3">
        {FEATURES.map((f) => (
          <article
            key={f.title}
            className="rounded-2xl border border-pink-100 bg-pink-50 p-6 text-left"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white">
              <f.icon className="h-5 w-5 text-rose-600" />
            </span>
            <h2 className="mt-4 text-lg font-semibold text-slate-900">{f.title}</h2>
            <p className="mt-2 text-sm text-slate-600">{f.body}</p>
          </article>
        ))}
      </section>

      <footer className="border-t border-pink-100 px-6 py-6 text-center text-xs text-slate-400">
        Demo build — screening results are simulated and not for clinical use.
      </footer>
    </main>
  );
}
