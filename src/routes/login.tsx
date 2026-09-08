import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Eye, Info, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — Drishti.AI Screening Portal" },
      {
        name: "description",
        content:
          "Sign in to Drishti.AI as a PHC kiosk operator or as an ophthalmologist to validate AI retinopathy grades.",
      },
      { property: "og:title", content: "Sign in — Drishti.AI Screening Portal" },
      {
        property: "og:description",
        content: "Role-based access for PHC kiosk operators and specialist ophthalmologists.",
      },
    ],
  }),
  component: LoginPage,
});

type Role = "kiosk" | "doctor";

function LoginPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState<Role>("kiosk");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [centerId, setCenterId] = useState("");
  const [pending, setPending] = useState(false);

  function submit(e: FormEvent) {
    e.preventDefault();
    if (role === "kiosk") {
      // Mock session; swap for Supabase auth later.
      navigate({ to: "/kiosk" });
    } else {
      setPending(true);
    }
  }

  const tab = (value: Role, label: string) => (
    <button
      key={value}
      type="button"
      onClick={() => {
        setRole(value);
        setPending(false);
      }}
      className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
        role === value ? "bg-white text-rose-700 shadow-sm" : "text-slate-500 hover:text-slate-700"
      }`}
    >
      {label}
    </button>
  );

  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-4 py-12">
      <div className="w-full max-w-md">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-slate-500 transition-colors hover:text-rose-600"
        >
          <ArrowLeft className="h-4 w-4" /> Back home
        </Link>

        <div className="mt-4 rounded-2xl border border-pink-100 bg-white p-8 shadow-sm">
          <div className="flex flex-col items-center text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-50">
              <Eye className="h-6 w-6 text-rose-600" />
            </span>
            <h1 className="mt-4 text-2xl font-semibold tracking-tight text-slate-900">
              Drishti.AI Portal
            </h1>
            <p className="mt-1 text-sm text-slate-500">Sign in or register to continue</p>
          </div>

          <div className="mt-6 flex gap-1 rounded-xl bg-pink-50 p-1">
            {tab("kiosk", "PHC Kiosk / Frontline")}
            {tab("doctor", "Ophthalmologist")}
          </div>

          <form onSubmit={submit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="email" className="text-sm font-medium text-slate-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@health.gov.in"
                className="mt-1 w-full rounded-xl border border-pink-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
              />
            </div>

            <div>
              <label htmlFor="password" className="text-sm font-medium text-slate-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-1 w-full rounded-xl border border-pink-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
              />
            </div>

            {role === "kiosk" && (
              <div>
                <label htmlFor="center" className="text-sm font-medium text-slate-700">
                  Center / Organization ID
                </label>
                <input
                  id="center"
                  required
                  value={centerId}
                  onChange={(e) => setCenterId(e.target.value)}
                  placeholder="PHC-ANAND-04"
                  className="mt-1 w-full rounded-xl border border-pink-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
                />
              </div>
            )}

            {pending && (
              <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
                <Info className="mt-0.5 h-4 w-4 shrink-0" />
                <p>Account registered. Pending admin verification.</p>
              </div>
            )}

            <button
              type="submit"
              className="w-full rounded-xl bg-rose-600 px-5 py-3 font-semibold text-white transition-colors hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:ring-offset-2"
            >
              {role === "kiosk" ? "Sign in & Start Screening" : "Sign in / Register"}
            </button>

            {role === "doctor" && (
              <button
                type="button"
                onClick={() => navigate({ to: "/doctor" })}
                className="w-full rounded-xl border border-pink-200 bg-pink-50 px-5 py-3 font-semibold text-slate-800 transition-colors hover:bg-pink-100"
              >
                Enter Doctor Portal (Demo Mode)
              </button>
            )}
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          Demo build — authentication is simulated.
        </p>
      </div>
    </main>
  );
}
