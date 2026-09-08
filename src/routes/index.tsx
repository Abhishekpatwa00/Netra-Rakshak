import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Eye, Stethoscope, MonitorSmartphone } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Drishti.AI — Diabetic Retinopathy Screening Login" },
      {
        name: "description",
        content:
          "Sign in to Drishti.AI to run AI-assisted diabetic retinopathy screening at PHC kiosks or validate cases as an ophthalmologist.",
      },
      { property: "og:title", content: "Drishti.AI — Diabetic Retinopathy Screening" },
      {
        property: "og:description",
        content: "AI-assisted diabetic retinopathy screening for PHC kiosks and ophthalmologists.",
      },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();

  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-pink-100 bg-white p-8 shadow-sm">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-pink-50">
            <Eye className="h-7 w-7 text-rose-600" />
          </div>
          <h1 className="mt-4 text-2xl font-semibold tracking-tight text-slate-900">Drishti.AI</h1>
          <p className="mt-1 text-sm text-slate-500">
            Diabetic Retinopathy screening &amp; specialist validation
          </p>
        </div>

        <div className="mt-8 space-y-3">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Select your role
          </p>

          <button
            type="button"
            onClick={() => navigate({ to: "/kiosk" })}
            className="flex w-full items-center gap-4 rounded-xl bg-rose-600 px-5 py-4 text-left text-white transition-colors hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:ring-offset-2"
          >
            <MonitorSmartphone className="h-6 w-6 shrink-0" />
            <span>
              <span className="block text-base font-semibold">Enter as PHC Kiosk</span>
              <span className="block text-sm text-rose-100">Capture and upload fundus images</span>
            </span>
          </button>

          <button
            type="button"
            onClick={() => navigate({ to: "/doctor" })}
            className="flex w-full items-center gap-4 rounded-xl border border-pink-200 bg-pink-50 px-5 py-4 text-left text-slate-900 transition-colors hover:bg-pink-100 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:ring-offset-2"
          >
            <Stethoscope className="h-6 w-6 shrink-0 text-rose-600" />
            <span>
              <span className="block text-base font-semibold">Enter as Ophthalmologist</span>
              <span className="block text-sm text-slate-500">Validate AI grades with XAI</span>
            </span>
          </button>
        </div>

        <p className="mt-8 text-center text-xs text-slate-400">
          Demo build — screening results are simulated and not for clinical use.
        </p>
      </div>
    </main>
  );
}
