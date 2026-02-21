import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const NAV_LINKS = ["How It Works", "Digital Twin", "For Doctors", "Security"];

const LOOP_STEPS = [
  {
    num: "01",
    emoji: "ðŸ“¡",
    label: "Monitor",
    title: "Continuous Health Monitoring",
    desc: "Every symptom, behavior, and health signal you submit is tracked in real time â€” building a growing model of your health state.",
    color: "from-blue-500 to-blue-600",
    light: "bg-blue-50",
    text: "text-blue-600",
  },
  {
    num: "02",
    emoji: "ðŸ”¬",
    label: "Analyze",
    title: "Deep Pattern Analysis",
    desc: "Our AI cross-references your inputs against thousands of clinical patterns to surface connections invisible to traditional checkups.",
    color: "from-cyan-500 to-cyan-600",
    light: "bg-cyan-50",
    text: "text-cyan-600",
  },
  {
    num: "03",
    emoji: "ðŸŽ¯",
    label: "Predict",
    title: "Predictive Risk Scoring",
    desc: "Before symptoms escalate, our system generates risk forecasts â€” giving you time to act before complications arise.",
    color: "from-violet-500 to-violet-600",
    light: "bg-violet-50",
    text: "text-violet-600",
  },
  {
    num: "04",
    emoji: "ðŸ›¡ï¸",
    label: "Prevent",
    title: "Guided Preventive Action",
    desc: "Receive personalized prevention plans, recommendations, and connect with specialists before any condition becomes serious.",
    color: "from-emerald-500 to-emerald-600",
    light: "bg-emerald-50",
    text: "text-emerald-600",
  },
];

const TWIN_ADAPTS = [
  { icon: "ðŸ©º", label: "Symptom patterns" },
  { icon: "ðŸƒ", label: "Behavioral trends" },
  { icon: "ðŸ’Š", label: "Medication adherence" },
  { icon: "âš ï¸", label: "Risk indicators" },
];

const SECURITY = [
  { icon: "ðŸ”’", title: "Secure Medical Records", desc: "End-to-end encrypted storage with zero-knowledge architecture ensures only you control your data." },
  { icon: "ðŸ¥", title: "HIPAA-Ready Architecture", desc: "Built on principles aligned with healthcare data protection standards for enterprise trust." },
  { icon: "ðŸ”", title: "Encrypted Data Transfer", desc: "256-bit AES encryption in transit and at rest. Your health data is never exposed or shared." },
];

const PATIENTS = [
  { name: "Priya S.", age: 45, score: 87, cat: "Cardiovascular", risk: "High", barColor: "bg-red-500", badge: "bg-red-100 text-red-700" },
  { name: "Rahul M.", age: 38, score: 64, cat: "Metabolic", risk: "Medium", barColor: "bg-amber-400", badge: "bg-amber-100 text-amber-700" },
  { name: "Anjali K.", age: 29, score: 41, cat: "Pregnancy", risk: "Monitor", barColor: "bg-blue-500", badge: "bg-blue-100 text-blue-700" },
  { name: "Vikram T.", age: 52, score: 22, cat: "General", risk: "Low", barColor: "bg-green-500", badge: "bg-green-100 text-green-700" },
];

function useInView(threshold = 0.12) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

function FadeUp({ children, className = "", delay = 0 }) {
  const [ref, inView] = useInView();
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

function RiskBar({ pct, colorClass }) {
  const [ref, inView] = useInView(0.1);
  return (
    <div ref={ref} className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-1000 ease-out ${colorClass}`}
        style={{ width: inView ? `${pct}%` : "0%" }}
      />
    </div>
  );
}

export default function HomePage() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [floatY, setFloatY] = useState(0);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    let frame;
    let start = null;
    const animate = (ts) => {
      if (!start) start = ts;
      const t = (ts - start) / 1000;
      setFloatY(Math.sin(t * 1.2) * 10);
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setPulse((p) => !p), 900);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans">

      {/* â”€â”€ NAV â”€â”€ */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/90 backdrop-blur-md border-b border-blue-50 shadow-sm" : "bg-transparent"}`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white text-sm font-bold shadow-md">âœ¦</div>
            <span className="font-bold text-slate-800 text-lg tracking-tight">PreventAI</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((l) => (
              <a key={l} href="#" className="text-slate-600 text-sm font-medium hover:text-blue-600 transition-colors relative group">
                {l}
                <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full rounded-full" />
              </a>
            ))}
          </nav>
          <div className="hidden md:flex items-center gap-3">
            <button className="text-sm font-medium text-slate-700 px-4 py-2 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 transition-all" onClick={() => navigate("/auth?mode=login")}>Log In</button>
            <button className="text-sm font-semibold text-white px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 hover:-translate-y-0.5 transition-all shadow-md" onClick={() => navigate("/auth?mode=register&type=user")}>Get Started</button>
          </div>
          <button className="md:hidden text-slate-700" onClick={() => setMobileOpen(!mobileOpen)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>
        {mobileOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-blue-50 px-6 py-4 flex flex-col gap-4">
            {NAV_LINKS.map((l) => <a key={l} href="#" className="text-slate-700 font-medium">{l}</a>)}
            <div className="flex gap-3 pt-2">
              <button className="flex-1 text-sm border border-slate-200 rounded-lg py-2 text-slate-700" onClick={() => navigate("/auth?mode=login")}>Log In</button>
              <button className="flex-1 text-sm bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl py-2 font-semibold" onClick={() => navigate("/auth?mode=register&type=user")}>Get Started</button>
            </div>
          </div>
        )}
      </header>

      {/* â”€â”€ HERO â”€â”€ */}
      <section className="relative pt-28 pb-20 overflow-hidden bg-gradient-to-br from-white via-blue-50/40 to-cyan-50/30">
        <div className="absolute top-16 right-0 w-96 h-96 rounded-full bg-blue-100/50 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-cyan-100/60 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            {/* System status badges */}
            <div className="flex flex-wrap gap-3 mb-7">
              <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-4 py-1.5 text-sm text-green-700 font-medium">
                <span className={`w-2 h-2 rounded-full bg-green-500 inline-block transition-all duration-500 ${pulse ? "scale-125 opacity-100" : "scale-90 opacity-60"}`} />
                System Status: Active
              </div>
              <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-full px-4 py-1.5 text-sm text-blue-700 font-medium">
                <span className="text-base leading-none">ðŸ§ </span>
                AI Monitoring: Enabled
              </div>
            </div>

            <h1 className="text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight mb-6">
              Preventive{" "}
              <span className="italic bg-gradient-to-r from-blue-700 via-blue-500 to-cyan-500 bg-clip-text text-transparent">
                Health Intelligence
              </span>{" "}
              System
            </h1>

            <p className="text-slate-600 text-lg leading-relaxed mb-2 max-w-lg">
              Your health is more than symptoms.
            </p>
            <p className="text-slate-500 text-base leading-relaxed mb-8 max-w-lg">
              It is patterns, behaviors, and evolving risk signals. This system continuously analyzes your inputs to detect potential risks <span className="text-blue-600 font-semibold">before they become serious conditions.</span>
            </p>

            <div className="flex flex-wrap gap-4 mb-10">
              <button
                className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold px-7 py-3.5 rounded-xl flex items-center gap-2 text-sm hover:from-blue-700 hover:to-cyan-600 hover:-translate-y-0.5 transition-all shadow-lg shadow-blue-200"
                onClick={() => navigate("/auth?mode=register&type=user")}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                Start Health Analysis
              </button>
              <button
                className="bg-white border-2 border-blue-200 text-blue-700 font-semibold px-7 py-3.5 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all flex items-center gap-2 text-sm"
                onClick={() => navigate("/auth?mode=login")}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                View Digital Twin
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500">
              {["No credit card required", "HIPAA-ready", "Free to start"].map((t) => (
                <span key={t} className="flex items-center gap-1.5"><span className="text-green-500 font-bold">âœ“</span> {t}</span>
              ))}
            </div>
          </div>

          {/* Floating Dashboard Card */}
          <div className="hidden lg:block" style={{ transform: `translateY(${floatY}px)`, transition: "transform 0.05s linear" }}>
            <div className="relative">
              <div className="bg-white rounded-3xl shadow-2xl p-6 border border-blue-50">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">Digital Twin â€” Health State</p>
                    <p className="text-slate-800 font-semibold">Sarah Mitchell, 34</p>
                  </div>
                  <span className="bg-green-50 text-green-700 text-xs font-semibold px-3 py-1 rounded-full border border-green-100">Low Risk</span>
                </div>
                <div className="mb-5 rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 p-3 flex items-center justify-center h-12">
                  <svg viewBox="0 0 300 40" className="w-full h-8 opacity-60" preserveAspectRatio="none">
                    <polyline points="0,20 40,20 55,5 70,35 85,8 100,32 115,20 300,20" fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className="space-y-3 mb-5">
                  {[
                    { label: "Cardiovascular Risk", pct: 18, color: "bg-emerald-500" },
                    { label: "Metabolic Score", pct: 32, color: "bg-amber-400" },
                    { label: "Immunity Index", pct: 74, color: "bg-blue-500" },
                  ].map((r) => (
                    <div key={r.label}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-600">{r.label}</span>
                        <span className="font-semibold text-slate-700">{r.pct}%</span>
                      </div>
                      <RiskBar pct={r.pct} colorClass={r.color} />
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between bg-blue-50 rounded-xl px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">ðŸ¤–</span>
                    <div>
                      <p className="text-xs font-semibold text-slate-700">AI Prediction</p>
                      <p className="text-xs text-slate-500">Risk stable â€” next check in 7 days</p>
                    </div>
                  </div>
                  <button className="text-blue-600 text-xs font-semibold hover:underline">View â†’</button>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 bg-white shadow-lg rounded-2xl px-4 py-3 border border-blue-50 z-10">
                <div className="flex items-center gap-2">
                  <span className="text-lg">âš¡</span>
                  <div>
                    <p className="text-xs font-bold text-slate-800">Risk Detected Early</p>
                    <p className="text-xs text-slate-400">3 months ahead</p>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-4 -left-6 bg-white shadow-lg rounded-2xl px-4 py-3 border border-blue-50 z-10">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">ðŸ§¬</div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">Twin updated</p>
                    <p className="text-xs text-slate-400">Just now Â· 4 new signals</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="h-px max-w-5xl mx-auto bg-gradient-to-r from-transparent via-blue-200 to-transparent" />

      {/* â”€â”€ SECTION 2 â€” THE IDEA â”€â”€ */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <FadeUp>
              <span className="text-blue-600 text-sm font-semibold uppercase tracking-widest">The Idea</span>
              <h2 className="text-4xl font-extrabold text-slate-900 mt-3 mb-6 leading-tight">
                Healthcare Should{" "}
                <span className="italic bg-gradient-to-r from-blue-700 to-cyan-500 bg-clip-text text-transparent">
                  Predict,
                </span>{" "}
                Not React.
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed mb-6">
                Most illnesses do not appear suddenly. They develop silently through subtle changes â€” shifts in patterns, behaviors, and biomarkers that go unnoticed until it is too late.
              </p>
              <p className="text-slate-500 text-base leading-relaxed mb-8">
                Our platform transforms daily health interactions into early risk insights â€” enabling action <strong className="text-blue-600">before complications arise.</strong>
              </p>
              <button
                onClick={() => navigate("/auth?mode=register&type=user")}
                className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 border-2 border-blue-200 px-6 py-3 rounded-xl hover:bg-blue-50 hover:border-blue-400 transition-all"
              >
                Learn How It Works
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </button>
            </FadeUp>

            <FadeUp delay={150}>
              <div className="grid grid-cols-2 gap-4">
                {[
                  {
                    label: "Traditional Healthcare",
                    icon: "ðŸ¥",
                    items: ["Waits for symptoms", "Treats after illness", "Episodic visits", "Reactive decisions"],
                    bg: "bg-red-50 border-red-100",
                    badge: "bg-red-100 text-red-600",
                    badgeText: "Reactive",
                    itemColor: "text-red-400",
                  },
                  {
                    label: "Preventive Intelligence",
                    icon: "ðŸ§ ",
                    items: ["Monitors continuously", "Acts before illness", "Always-on analysis", "Proactive decisions"],
                    bg: "bg-blue-50 border-blue-100",
                    badge: "bg-blue-100 text-blue-600",
                    badgeText: "Predictive",
                    itemColor: "text-blue-400",
                  },
                ].map((col) => (
                  <div key={col.label} className={`rounded-2xl border p-5 ${col.bg}`}>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-2xl">{col.icon}</span>
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${col.badge}`}>{col.badgeText}</span>
                    </div>
                    <p className="text-slate-800 font-semibold text-sm mb-3">{col.label}</p>
                    <ul className="space-y-2">
                      {col.items.map((item) => (
                        <li key={item} className={`flex items-center gap-2 text-xs text-slate-600`}>
                          <span className={`${col.itemColor} font-bold`}>â†’</span> {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      <div className="h-px max-w-5xl mx-auto bg-gradient-to-r from-transparent via-blue-200 to-transparent" />

      {/* â”€â”€ SECTION 3 â€” PREVENTIVE LOOP â”€â”€ */}
      <section className="py-24 bg-slate-50/60">
        <div className="max-w-7xl mx-auto px-6">
          <FadeUp className="text-center mb-16">
            <span className="text-blue-600 text-sm font-semibold uppercase tracking-widest">How It Works</span>
            <h2 className="text-4xl font-extrabold text-slate-900 mt-2">A Continuous Health Protection Cycle</h2>
            <p className="text-slate-500 mt-3 max-w-xl mx-auto">
              Every interaction strengthens your evolving health model â€” ensuring smarter decisions and safer outcomes.
            </p>
          </FadeUp>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {LOOP_STEPS.map((s, i) => (
              <FadeUp key={s.num} delay={i * 100}>
                <div className="relative group bg-white rounded-2xl p-6 border border-slate-100 shadow-sm h-full hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-50 transition-all duration-300">
                  {i < LOOP_STEPS.length - 1 && (
                    <div className="hidden lg:block absolute top-8 -right-3 w-6 h-0.5 bg-gradient-to-r from-blue-400 to-cyan-400 z-10" />
                  )}
                  <div className={`w-12 h-12 rounded-xl ${s.light} flex items-center justify-center mb-4 text-2xl group-hover:scale-110 transition-transform duration-300`}>
                    {s.emoji}
                  </div>
                  <span className="text-4xl font-black text-blue-50 group-hover:text-blue-100 transition-colors absolute top-4 right-6 select-none">{s.num}</span>
                  <div className={`text-xs font-bold uppercase tracking-widest ${s.text} mb-1`}>{s.label}</div>
                  <h3 className="font-semibold text-slate-800 mb-2 text-base">{s.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{s.desc}</p>
                </div>
              </FadeUp>
            ))}
          </div>

          <FadeUp delay={400}>
            <div className="mt-10 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl p-6 text-center text-white shadow-xl shadow-blue-200">
              <p className="font-semibold text-lg">Monitor â†’ Analyze â†’ Predict â†’ Prevent</p>
              <p className="text-blue-100 text-sm mt-2">The cycle runs continuously â€” every day, across every signal you provide.</p>
            </div>
          </FadeUp>
        </div>
      </section>

      <div className="h-px max-w-5xl mx-auto bg-gradient-to-r from-transparent via-blue-200 to-transparent" />

      {/* â”€â”€ SECTION 4 â€” DIGITAL TWIN â”€â”€ */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <FadeUp delay={100}>
              {/* Twin Visual */}
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 shadow-2xl border border-slate-700">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-1">Health Digital Twin</p>
                    <p className="text-white font-bold text-lg">Active Model v3.2</p>
                  </div>
                  <div className="flex items-center gap-1.5 bg-green-500/20 border border-green-500/40 rounded-full px-3 py-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
                    <span className="text-green-400 text-xs font-semibold">Live</span>
                  </div>
                </div>
                <div className="space-y-3 mb-6">
                  {[
                    { label: "Symptom Pattern Score", val: 76, color: "bg-blue-500" },
                    { label: "Behavioral Consistency", val: 88, color: "bg-cyan-400" },
                    { label: "Medication Adherence", val: 92, color: "bg-emerald-500" },
                    { label: "Risk Trajectory", val: 34, color: "bg-amber-400" },
                  ].map((r) => (
                    <div key={r.label}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-400">{r.label}</span>
                        <span className="text-white font-semibold">{r.val}%</span>
                      </div>
                      <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${r.color}`} style={{ width: `${r.val}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {TWIN_ADAPTS.map((a) => (
                    <div key={a.label} className="flex items-center gap-2 bg-slate-700/50 rounded-xl px-3 py-2.5">
                      <span className="text-base">{a.icon}</span>
                      <span className="text-slate-300 text-xs font-medium">{a.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </FadeUp>

            <FadeUp>
              <span className="text-blue-600 text-sm font-semibold uppercase tracking-widest">Digital Twin</span>
              <h2 className="text-4xl font-extrabold text-slate-900 mt-3 mb-4 leading-tight">
                Meet Your{" "}
                <span className="italic bg-gradient-to-r from-blue-700 to-cyan-500 bg-clip-text text-transparent">
                  Health Digital Twin
                </span>
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed mb-6">
                A dynamic virtual representation of your current health state â€” built from your real inputs and refined over time.
              </p>
              <p className="text-slate-500 text-base leading-relaxed mb-8">
                Instead of reacting to illness, your digital twin <strong className="text-blue-600">helps anticipate it</strong> â€” providing a continuously updated health model that gets smarter with every interaction.
              </p>
              <div className="space-y-3 mb-8">
                {["Adapts to new symptom data in real time", "Tracks behavioral and lifestyle patterns", "Flags risk signals before they escalate", "Personalizes care recommendations uniquely to you"].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    </div>
                    <p className="text-slate-600 text-sm">{item}</p>
                  </div>
                ))}
              </div>
              <button
                onClick={() => navigate("/auth?mode=register&type=user")}
                className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold px-7 py-3.5 rounded-xl flex items-center gap-2 text-sm hover:from-blue-700 hover:to-cyan-600 hover:-translate-y-0.5 transition-all shadow-lg shadow-blue-200"
              >
                Build Your Digital Twin
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </button>
            </FadeUp>
          </div>
        </div>
      </section>

      <div className="h-px max-w-5xl mx-auto bg-gradient-to-r from-transparent via-blue-200 to-transparent" />

      {/* â”€â”€ FOR DOCTORS â€” Management Portal â”€â”€ */}
      <section className="py-24 bg-slate-50/60">
        <div className="max-w-7xl mx-auto px-6">
          <FadeUp className="text-center mb-14">
            <span className="text-blue-600 text-sm font-semibold uppercase tracking-widest">For Clinicians</span>
            <h2 className="text-4xl font-extrabold text-slate-900 mt-2">Doctor Management Portal</h2>
            <p className="text-slate-500 mt-3 max-w-xl mx-auto">
              A dedicated workspace for clinicians â€” manage patients, review AI insights, handle appointments, and act on alerts all in one place.
            </p>
          </FadeUp>

          <FadeUp>
            <div className="bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-700">
              <div className="flex items-center gap-2 px-5 py-3.5 bg-slate-800 border-b border-slate-700">
                <span className="w-3 h-3 rounded-full bg-red-400" />
                <span className="w-3 h-3 rounded-full bg-yellow-400" />
                <span className="w-3 h-3 rounded-full bg-green-400" />
                <div className="ml-4 flex-1 bg-slate-700 rounded-md px-3 py-1 text-xs text-slate-400 max-w-xs">preventai.health/doctor/dashboard</div>
              </div>
              <div className="flex min-h-96">
                <div className="w-52 bg-slate-800 border-r border-slate-700 flex-shrink-0 p-4 flex flex-col gap-1">
                  <div className="flex items-center gap-2 mb-6 px-2 pt-2">
                    <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white text-xs font-bold">âœ¦</div>
                    <span className="text-white font-semibold text-sm">PreventAI</span>
                  </div>
                  {[
                    { icon: "â–¦", label: "Dashboard", active: true, badge: null },
                    { icon: "ðŸ‘¥", label: "Patient Insights", active: false, badge: null },
                    { icon: "ðŸ“‹", label: "AI Reports", active: false, badge: null },
                    { icon: "ðŸ“…", label: "Appointments", active: false, badge: null },
                    { icon: "ðŸ””", label: "Alerts", active: false, badge: "3" },
                    { icon: "âš™ï¸", label: "Settings", active: false, badge: null },
                  ].map((item) => (
                    <div key={item.label} className={`flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer text-xs font-medium transition-all ${item.active ? "bg-blue-600 text-white" : "text-slate-400 hover:bg-slate-700 hover:text-white"}`}>
                      <div className="flex items-center gap-2"><span className="text-sm">{item.icon}</span>{item.label}</div>
                      {item.badge && <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{item.badge}</span>}
                    </div>
                  ))}
                  <div className="mt-auto pt-4 border-t border-slate-700">
                    <div className="flex items-center gap-2 px-2 py-2">
                      <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">DR</div>
                      <div className="min-w-0">
                        <p className="text-white text-xs font-semibold truncate">Dr. Aryan Mehta</p>
                        <p className="text-slate-500 text-[10px]">Cardiologist</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex-1 bg-slate-50 p-5 overflow-auto">
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
                    {[
                      { label: "Total Patients", val: "142", badge: "+4 today", badgeCls: "bg-blue-100 text-blue-600", valCls: "text-blue-600" },
                      { label: "High Risk", val: "18", badge: "â†‘ 2 new", badgeCls: "bg-red-100 text-red-600", valCls: "text-red-600" },
                      { label: "Reports Pending", val: "7", badge: "AI ready", badgeCls: "bg-amber-100 text-amber-600", valCls: "text-amber-600" },
                      { label: "Today's Appts", val: "9", badge: "2 virtual", badgeCls: "bg-emerald-100 text-emerald-600", valCls: "text-emerald-600" },
                    ].map((s) => (
                      <div key={s.label} className="bg-white rounded-xl p-3.5 border border-slate-100 shadow-sm">
                        <p className="text-slate-400 text-[10px] font-semibold uppercase tracking-wide mb-1">{s.label}</p>
                        <p className={`text-2xl font-extrabold ${s.valCls}`}>{s.val}</p>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${s.badgeCls}`}>{s.badge}</span>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2 bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
                      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                        <p className="text-slate-800 text-sm font-semibold">Patient Risk Insights</p>
                        <span className="text-blue-600 text-xs font-semibold cursor-pointer hover:underline">View all â†’</span>
                      </div>
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-100">
                            {["Patient", "Risk Score", "Category", "Status"].map((h) => (
                              <th key={h} className="text-left px-4 py-2 text-slate-500 font-medium">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {PATIENTS.map((p) => (
                            <tr key={p.name} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                              <td className="px-4 py-2.5">
                                <div className="flex items-center gap-2">
                                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-[10px] font-bold flex-shrink-0">{p.name[0]}</div>
                                  <span className="text-slate-700 font-medium">{p.name}, {p.age}</span>
                                </div>
                              </td>
                              <td className="px-4 py-2.5">
                                <div className="flex items-center gap-2">
                                  <div className="w-14 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                    <div className={`h-full rounded-full ${p.barColor}`} style={{ width: `${p.score}%` }} />
                                  </div>
                                  <span className="text-slate-600 font-semibold">{p.score}</span>
                                </div>
                              </td>
                              <td className="px-4 py-2.5 text-slate-600">{p.cat}</td>
                              <td className="px-4 py-2.5"><span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${p.badge}`}>{p.risk}</span></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
                      <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-1.5">
                        <p className="text-slate-800 text-sm font-semibold">ðŸ”” Alerts</p>
                        <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">3</span>
                      </div>
                      <div className="p-3 flex flex-col gap-2">
                        {[
                          { msg: "Priya S. â€” BP crossed critical threshold", time: "2m ago", cls: "border-l-red-500 bg-red-50" },
                          { msg: "Anjali K. â€” Missed prenatal check-in", time: "1h ago", cls: "border-l-amber-400 bg-amber-50" },
                          { msg: "Rahul M. â€” New AI report ready", time: "3h ago", cls: "border-l-blue-400 bg-blue-50" },
                        ].map((a, i) => (
                          <div key={i} className={`border-l-4 rounded-r-lg px-3 py-2 ${a.cls}`}>
                            <p className="text-slate-700 text-[11px] font-medium leading-snug">{a.msg}</p>
                            <p className="text-slate-400 text-[10px] mt-0.5">{a.time}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      <div className="h-px max-w-5xl mx-auto bg-gradient-to-r from-transparent via-blue-200 to-transparent" />

      {/* â”€â”€ SECTION 5 â€” SECURITY â”€â”€ */}
      <section className="py-24 bg-gradient-to-b from-white to-blue-50/30">
        <div className="max-w-7xl mx-auto px-6">
          <FadeUp className="text-center mb-14">
            <span className="text-blue-600 text-sm font-semibold uppercase tracking-widest">Trust & Security</span>
            <h2 className="text-4xl font-extrabold text-slate-900 mt-2">Your Data, Protected</h2>
            <p className="text-slate-500 mt-3 max-w-xl mx-auto">Healthcare data demands the highest standards. We built security in from the ground up.</p>
          </FadeUp>
          <div className="grid md:grid-cols-3 gap-6">
            {SECURITY.map((s, i) => (
              <FadeUp key={s.title} delay={i * 100}>
                <div className="bg-white rounded-2xl p-7 border border-blue-50 shadow-sm text-center h-full hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
                  <div className="text-4xl mb-4">{s.icon}</div>
                  <h3 className="font-semibold text-slate-800 mb-2">{s.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{s.desc}</p>
                </div>
              </FadeUp>
            ))}
          </div>
          <FadeUp className="mt-10">
            <div className="bg-blue-600 rounded-2xl p-6 flex flex-wrap items-center gap-4">
              {["SOC 2 Type II Compliant", "TLS 1.3 Encryption", "Zero-Knowledge Storage", "Audit Logging", "Role-Based Access"].map((t) => (
                <span key={t} className="flex items-center gap-1.5 text-white/90 text-sm">
                  <svg className="w-4 h-4 text-cyan-300 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {t}
                </span>
              ))}
            </div>
          </FadeUp>
        </div>
      </section>

      {/* â”€â”€ IMPACT STATEMENT â”€â”€ */}
      <section className="py-20 bg-slate-900 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-80 h-80 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <FadeUp>
            <span className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-6 block">Impact</span>
            <h2 className="text-4xl lg:text-5xl font-extrabold text-white mb-6 leading-tight">
              Prevention Is a{" "}
              <span className="italic bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                System,
              </span>{" "}
              Not an Emergency.
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed mb-10 max-w-2xl mx-auto">
              By combining AI-driven analysis with continuous health modeling, we shift healthcare from crisis management to proactive protection.
            </p>
            <div className="flex flex-wrap justify-center gap-8 mb-10">
              {[
                { phrase: "Stay informed.", icon: "ðŸ“Š" },
                { phrase: "Stay ahead.", icon: "âš¡" },
                { phrase: "Stay protected.", icon: "ðŸ›¡ï¸" },
              ].map((item) => (
                <div key={item.phrase} className="flex items-center gap-3">
                  <span className="text-2xl">{item.icon}</span>
                  <span className="text-white font-bold text-xl">{item.phrase}</span>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              {[
                { num: "94%", label: "Early Detection Rate" },
                { num: "50K+", label: "Active Patients" },
                { num: "1,200+", label: "Partner Doctors" },
                { num: "3x", label: "Faster Diagnoses" },
              ].map((s) => (
                <div key={s.label} className="bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-center">
                  <p className="text-2xl font-extrabold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">{s.num}</p>
                  <p className="text-slate-500 text-xs mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </FadeUp>
        </div>
      </section>

      {/* â”€â”€ FINAL CTA â”€â”€ */}
      <section className="py-28 relative overflow-hidden bg-gradient-to-br from-white via-blue-50/40 to-cyan-50/30">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-blue-100/40 blur-3xl pointer-events-none" />
        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <FadeUp>
            <div className="inline-block text-5xl mb-6">ðŸ§¬</div>
            <h2 className="text-5xl font-extrabold text-slate-900 mb-5 leading-tight">
              Take control{" "}
              <span className="italic bg-gradient-to-r from-blue-700 via-blue-500 to-cyan-500 bg-clip-text text-transparent">
                before illness
              </span>{" "}
              takes control.
            </h2>
            <p className="text-slate-600 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
              Begin your preventive assessment today. Your digital twin is ready to be built â€” and the earlier you start, the more it knows.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold px-10 py-4 rounded-xl text-base hover:from-blue-700 hover:to-cyan-600 hover:-translate-y-0.5 transition-all shadow-lg shadow-blue-200 flex items-center gap-2"
                onClick={() => navigate("/auth?mode=register&type=user")}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                Begin Preventive Assessment
              </button>
              <button
                className="bg-white border-2 border-blue-200 text-blue-700 font-semibold px-9 py-4 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all text-base"
                onClick={() => navigate("/auth?mode=login")}
              >
                Log In
              </button>
            </div>
            <p className="text-slate-400 text-xs mt-6">No credit card required Â· Cancel anytime Â· HIPAA-ready</p>
          </FadeUp>
        </div>
      </section>

      {/* â”€â”€ FOOTER â”€â”€ */}
      <footer className="bg-slate-900 text-slate-400 py-14">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-10 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white text-xs font-bold">âœ¦</div>
                <span className="text-white font-semibold">PreventAI</span>
              </div>
              <p className="text-sm leading-relaxed text-slate-500">AI-powered preventive healthcare for patients and clinicians. Detect risks before they become illness.</p>
            </div>
            {[
              { title: "Platform", links: ["For Patients", "For Doctors", "Digital Twin", "API Access"] },
              { title: "Company", links: ["About", "Blog", "Careers", "Contact"] },
              { title: "Legal", links: ["Privacy Policy", "Terms of Service", "Security", "HIPAA Statement"] },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="text-white font-semibold text-sm mb-4">{col.title}</h4>
                <ul className="space-y-2.5">
                  {col.links.map((l) => (
                    <li key={l}><a href="#" className="text-slate-500 text-sm hover:text-blue-400 transition-colors">{l}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-slate-800 pt-8 flex flex-wrap items-center justify-between gap-4">
            <p className="text-sm text-slate-600">Â© 2026 PreventAI Health Technologies. All rights reserved.</p>
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
              All systems operational
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

