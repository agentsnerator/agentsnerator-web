"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AgentCard, { type Agent } from "@/components/dashboard/AgentCard";
import AddAgentModal from "@/components/dashboard/AddAgentModal";
import RunConfigModal, { type RunConfig } from "@/components/dashboard/RunConfigModal";
import RunOutputModal, { type RunOutput } from "@/components/dashboard/RunOutputModal";
import Toast, { type ToastData } from "@/components/Toast";
import { getProject, getProjectAgents, saveToLibrary } from "@/lib/queries";

const CEO_WEBHOOK = "https://n8n.passtop.store/webhook/ceo-agent";

type ProjectMeta = {
  name:        string;
  description: string;
  status:      string;
  tags:        string[];
  webhookUrl:  string | null;
};

const STATUS_CONFIG = {
  active:   { label: "Active",   dot: "bg-secondary shadow-[0_0_8px_#00eefc]", text: "text-secondary" },
  paused:   { label: "Paused",   dot: "bg-outline",                              text: "text-on-surface-variant" },
  building: { label: "Building", dot: "bg-primary shadow-[0_0_8px_#db90ff] animate-pulse", text: "text-primary" },
} as const;

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useUser();

  const [project, setProject]       = useState<ProjectMeta | null>(null);
  const [agents,  setAgents]        = useState<Agent[]>([]);
  const [loading, setLoading]       = useState(true);
  const [error,   setError]         = useState<string | null>(null);
  const [showAddAgent, setShowAddAgent] = useState(false);
  const [running,       setRunning]       = useState(false);
  const [toast,         setToast]         = useState<ToastData | null>(null);
  const [runOutput,     setRunOutput]     = useState<RunOutput | null>(null);
  const [showRunConfig, setShowRunConfig] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    const [projRes, agentsRes] = await Promise.all([
      getProject(id),
      getProjectAgents(id),
    ]);

    if (projRes.error)   setError(projRes.error);
    if (agentsRes.error) setError(agentsRes.error);

    setProject(projRes.data);
    setAgents(agentsRes.data);
    setLoading(false);
  }, [id]);

  useEffect(() => { load(); }, [load]);

  async function handleRun(config: RunConfig) {
    if (!project) return;
    setShowRunConfig(false);
    setRunning(true);
    setToast({ message: "جارٍ تشغيل المشروع...", type: "loading" });

    // timeout بعد 30 ثانية
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 30_000);

    try {
      const webhookUrl = project.webhookUrl?.trim() || CEO_WEBHOOK;
      const res = await fetch(webhookUrl, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        signal:  controller.signal,
        body:    JSON.stringify({
          task:        config.topic,
          keyword:     config.keyword,
          language:    config.language,
          projectName: project.name,
        }),
      });

      clearTimeout(timer);

      if (!res.ok) {
        // حاول اقرأ body للحصول على تفاصيل الخطأ من n8n
        let detail = "";
        try { detail = await res.text(); } catch { /* ignore */ }
        throw new Error(
          detail.trim() || `الخادم أرجع HTTP ${res.status}`
        );
      }

      // 204 No Content — نجح بدون رد
      if (res.status === 204) {
        setToast({ message: "تم تشغيل المشروع بنجاح ✅", type: "success" });
        return;
      }

      // قراءة الرد وتحليله
      const raw = await res.text();

      if (!raw.trim()) {
        setToast({ message: "تم تشغيل المشروع بنجاح ✅", type: "success" });
        return;
      }

      // استخراج title + content من الـ response
      let title   = "";
      let content = raw.trim();

      try {
        const data = JSON.parse(raw);

        // البحث عن title
        if (data?.title)         title = String(data.title);
        else if (data?.headline) title = String(data.headline);
        else if (data?.subject)  title = String(data.subject);

        // البحث عن content
        if (data?.content)      content = String(data.content);
        else if (data?.article) content = String(data.article);
        else if (data?.body)    content = String(data.body);
        else if (data?.output)  content = String(data.output);
        else if (data?.message) content = String(data.message);
        else if (data?.text)    content = String(data.text);
        else if (typeof data === "string") content = data;
      } catch {
        // مو JSON — استخدم النص كما هو
      }

      setToast({ message: "اكتمل التشغيل ✅ — شاهد النتيجة أدناه", type: "success" });
      setRunOutput({ title, content });

      // حفظ في المكتبة تلقائياً
      if (user) {
        await saveToLibrary({
          userId:      user.id,
          projectId:   id,
          title:       title || content.split("\n")[0].slice(0, 100),
          contentType: "text",
          content,
        });
      }
    } catch (err) {
      clearTimeout(timer);
      let msg = "خطأ غير معروف";
      if (err instanceof DOMException && err.name === "AbortError") {
        msg = "انتهت مهلة الاتصال (30 ثانية) — تحقق من n8n";
      } else if (err instanceof Error) {
        msg = err.message;
      }
      setToast({ message: `فشل تشغيل المشروع: ${msg}`, type: "error" });
    } finally {
      setRunning(false);
    }
  }

  // ─── Loading ───────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <>
        <Navbar />
        <main className="pt-32 pb-24 max-w-7xl mx-auto px-8">
          <div className="h-8 w-48 bg-surface-container-low rounded animate-pulse mb-10" />
          <div className="h-14 w-96 bg-surface-container-low rounded animate-pulse mb-6" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-12">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-surface-container-low rounded-xl h-64 animate-pulse" />
            ))}
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // ─── Not found ─────────────────────────────────────────────────────────────
  if (!project) {
    return (
      <>
        <Navbar />
        <main className="pt-40 pb-24 max-w-7xl mx-auto px-8 text-center">
          <span className="material-symbols-outlined text-6xl text-on-surface-variant mb-4 block">
            folder_off
          </span>
          <h1 className="font-headline text-3xl font-bold mb-2">Project not found</h1>
          <p className="text-on-surface-variant mb-6">
            {error ?? "This project doesn't exist or was removed."}
          </p>
          <Link href="/dashboard">
            <button className="bg-gradient-to-br from-primary to-primary-dim text-on-primary px-8 py-3 rounded-lg font-headline font-bold">
              Back to Dashboard
            </button>
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  const statusKey = (project.status as keyof typeof STATUS_CONFIG) in STATUS_CONFIG
    ? (project.status as keyof typeof STATUS_CONFIG)
    : "active";
  const status    = STATUS_CONFIG[statusKey];
  const ceoAgent  = agents.find((a) => a.isCEO);
  const subAgents = agents.filter((a) => !a.isCEO);

  // ─── Page ──────────────────────────────────────────────────────────────────
  return (
    <>
      <Navbar />

      <main className="pt-32 pb-24 max-w-7xl mx-auto px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm font-label text-on-surface-variant mb-10">
          <Link href="/dashboard" className="hover:text-primary transition-colors">
            Dashboard
          </Link>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <span className="text-on-surface">{project.name}</span>
        </nav>

        {/* Page header */}
        <header className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-12">
          <div className="space-y-3">
            <span className="text-[10px] font-label text-secondary uppercase tracking-widest">
              Project Fleet
            </span>
            <div className="flex items-center gap-4 flex-wrap">
              <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">
                {project.name}
              </h1>
              <span className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${status.dot}`} />
                <span className={`text-xs font-label uppercase tracking-widest ${status.text}`}>
                  {status.label}
                </span>
              </span>
            </div>
            {project.description && (
              <p className="text-on-surface-variant font-body max-w-2xl leading-relaxed">
                {project.description}
              </p>
            )}
            {project.tags.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {project.tags.map((t) => (
                  <span
                    key={t}
                    className="px-2 py-0.5 bg-surface-bright text-on-surface-variant rounded text-[10px] font-label uppercase tracking-wider"
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 flex-shrink-0">
            <button
              onClick={() => setShowAddAgent(true)}
              className="flex items-center gap-2 bg-surface-container-high text-on-surface px-5 py-3 rounded-lg font-headline font-bold text-sm hover:bg-surface-bright transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              Add Agent
            </button>
            <button
              onClick={() => setShowRunConfig(true)}
              disabled={running || project.status === "paused"}
              className="flex items-center gap-2 bg-gradient-to-br from-primary to-primary-dim text-on-primary px-6 py-3 rounded-lg font-headline font-bold text-sm active:scale-95 transition-all hover:shadow-[0_0_30px_rgba(219,144,255,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {running ? (
                <>
                  <span className="w-4 h-4 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin" />
                  Running...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    play_circle
                  </span>
                  Run Project
                </>
              )}
            </button>
          </div>
        </header>

        {/* Agent count strip */}
        <div className="flex items-center gap-6 mb-10 pb-10 border-b border-outline-variant/10 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
              smart_toy
            </span>
            <span className="font-headline font-bold text-2xl">{agents.length}</span>
            <span className="text-on-surface-variant font-label text-sm">Total Agents</span>
          </div>
          <div className="w-px h-6 bg-outline-variant/20" />
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary shadow-[0_0_6px_#00eefc]" />
            <span className="text-on-surface-variant font-label text-sm">
              {agents.filter((a) => a.status === "active").length} Active
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_6px_#db90ff] animate-pulse" />
            <span className="text-on-surface-variant font-label text-sm">
              {agents.filter((a) => a.status === "training").length} Training
            </span>
          </div>
        </div>

        {/* CEO Agent */}
        {ceoAgent ? (
          <section className="mb-10">
            <h2 className="font-headline text-lg font-bold text-on-surface-variant uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                star
              </span>
              CEO Agent
            </h2>
            <div className="max-w-sm">
              <AgentCard agent={ceoAgent} featured />
            </div>
          </section>
        ) : (
          <section className="mb-10">
            <h2 className="font-headline text-lg font-bold text-on-surface-variant uppercase tracking-widest mb-4">
              CEO Agent
            </h2>
            <button
              onClick={() => setShowAddAgent(true)}
              className="bg-surface-container-low rounded-xl border border-dashed border-primary/30 hover:border-primary/60 transition-all p-8 flex items-center gap-4 max-w-sm"
            >
              <div className="w-12 h-12 rounded-full bg-surface-container-highest flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-2xl">add</span>
              </div>
              <div className="text-left">
                <p className="font-headline font-bold">Assign CEO Agent</p>
                <p className="text-xs font-body text-on-surface-variant mt-0.5">
                  The orchestrator for this project.
                </p>
              </div>
            </button>
          </section>
        )}

        {/* Sub-agents */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-headline text-lg font-bold text-on-surface-variant uppercase tracking-widest flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">hub</span>
              Sub-Agents
              <span className="px-2 py-0.5 bg-surface-container text-on-surface-variant rounded text-xs font-label">
                {subAgents.length}
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {subAgents.map((agent) => (
              <AgentCard key={agent.id} agent={agent} />
            ))}

            {/* Add slot */}
            <button
              onClick={() => setShowAddAgent(true)}
              className="bg-surface-container-low rounded-xl border border-dashed border-primary/20 hover:border-primary/40 transition-all duration-300 flex flex-col items-center justify-center min-h-[260px] gap-3 group"
            >
              <div className="w-12 h-12 rounded-full bg-surface-container-highest flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-primary text-2xl">add</span>
              </div>
              <p className="text-sm font-headline font-bold">Add Sub-Agent</p>
              <p className="text-xs font-body text-on-surface-variant text-center px-4">
                Expand your team.
              </p>
            </button>
          </div>
        </section>
      </main>

      <Footer />

      {showAddAgent && (
        <AddAgentModal
          projectId={id}
          onClose={() => setShowAddAgent(false)}
          onCreated={load}
        />
      )}

      {showRunConfig && project && (
        <RunConfigModal
          projectName={project.name}
          onConfirm={handleRun}
          onClose={() => setShowRunConfig(false)}
        />
      )}

      {runOutput && (
        <RunOutputModal
          output={runOutput}
          projectName={project.name}
          onClose={() => setRunOutput(null)}
        />
      )}

      <Toast toast={toast} onClose={() => setToast(null)} />
    </>
  );
}
