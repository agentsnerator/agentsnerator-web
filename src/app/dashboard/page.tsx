"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DashboardStats from "@/components/dashboard/DashboardStats";
import ProjectCard, { type Project } from "@/components/dashboard/ProjectCard";
import NewProjectModal from "@/components/dashboard/NewProjectModal";
import LibraryTab from "@/components/dashboard/LibraryTab";
import { getProjects } from "@/lib/queries";
import { Plus, AlertCircle, LayoutGrid, Library, Wallet } from "lucide-react";

export default function DashboardPage() {
  const { user } = useUser();
  const [projects, setProjects]     = useState<Project[]>([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState<string | null>(null);
  const [showModal, setShowModal]   = useState(false);
  const [activeTab, setActiveTab]   = useState<"projects" | "library">("projects");

  async function load() {
    setLoading(true);
    const { data, error } = await getProjects();
    setProjects(data);
    setError(error);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  const TAB_ICONS = {
    projects: <LayoutGrid size={16} />,
    library:  <Library size={16} />,
  };

  return (
    <>
      <Navbar />

      <main className="pt-32 pb-24 max-w-7xl mx-auto px-8">
        {/* Page Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="font-label text-secondary tracking-widest text-xs uppercase mb-2 block">
              Central Command
            </span>
            <h1 className="font-headline text-5xl font-bold tracking-tight">
              User Dashboard
            </h1>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-gradient-to-br from-primary to-primary-dim text-on-primary px-6 py-3 rounded-lg font-headline font-bold text-sm tracking-tight active:scale-95 transition-transform hover:shadow-[0_0_30px_rgba(219,144,255,0.3)] self-start md:self-auto"
          >
            <Plus size={18} />
            New Project
          </button>
        </header>

        {/* Stats */}
        <DashboardStats totalProjects={projects.length} />

        {/* Tabs */}
        <div className="flex gap-1 mb-8 bg-surface-container-low p-1 rounded-xl w-fit">
          {[
            { key: "projects", label: "مشاريعي" },
            { key: "library",  label: "مكتبتي"  },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as "projects" | "library")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-headline font-bold text-sm transition-all ${
                activeTab === tab.key
                  ? "bg-surface-container-high text-on-surface shadow-sm"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              {TAB_ICONS[tab.key as "projects" | "library"]}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Library Tab */}
        {activeTab === "library" && (
          <LibraryTab userId={user?.id ?? ""} />
        )}

        {/* Projects Section */}
        {activeTab === "projects" && (
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <h2 className="font-headline text-2xl font-bold">My Projects</h2>
              {!loading && (
                <span className="px-2 py-0.5 bg-primary/20 text-primary rounded text-xs font-label font-bold">
                  {projects.length}
                </span>
              )}
            </div>
            {!loading && projects.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary shadow-[0_0_8px_#00eefc]" />
                <span className="text-[10px] font-label text-on-surface-variant uppercase tracking-widest">
                  {projects.filter((p) => p.status === "active").length} Active
                </span>
              </div>
            )}
          </div>

          {/* Loading skeleton */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-surface-container-low rounded-xl p-6 h-64 animate-pulse"
                />
              ))}
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="bg-error/10 border border-error/20 rounded-xl p-6 flex items-start gap-3">
              <AlertCircle className="text-error mt-0.5" size={20} />
              <div>
                <p className="font-headline font-bold text-error mb-1">
                  Failed to load projects
                </p>
                <p className="text-sm font-body text-on-surface-variant">{error}</p>
                <button
                  onClick={load}
                  className="mt-3 text-sm font-label font-bold text-primary hover:underline"
                >
                  Try again
                </button>
              </div>
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && projects.length === 0 && (
            <div className="text-center py-20">
              <div className="w-20 h-20 rounded-full bg-surface-container-high flex items-center justify-center mx-auto mb-6">
                <Library className="text-on-surface-variant" size={40} />
              </div>
              <h3 className="font-headline text-xl font-bold mb-2">
                No projects yet
              </h3>
              <p className="text-on-surface-variant font-body mb-6">
                Create your first project and build your agent team.
              </p>
              <button
                onClick={() => setShowModal(true)}
                className="bg-gradient-to-br from-primary to-primary-dim text-on-primary px-8 py-3 rounded-lg font-headline font-bold active:scale-95 transition-transform"
              >
                Create First Project
              </button>
            </div>
          )}

          {/* Projects Grid */}
          {!loading && !error && projects.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
              {/* New Project slot */}
              <button
                onClick={() => setShowModal(true)}
                className="bg-surface-container-low rounded-xl p-6 border border-dashed border-primary/20 hover:border-primary/40 transition-all duration-300 flex flex-col items-center justify-center min-h-[280px] gap-4 group"
              >
                <div className="w-14 h-14 rounded-full bg-surface-container-highest flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Plus className="text-primary" size={30} />
                </div>
                <div className="text-center">
                  <h3 className="font-headline font-bold text-lg mb-1">
                    New Project
                  </h3>
                  <p className="text-sm font-body text-on-surface-variant">
                    Create a new agent team.
                  </p>
                </div>
              </button>
            </div>
          )}
        </section>
        )}

        {/* Wallet strip */}
        <section className="mt-16 bg-surface-container-low rounded-xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-outline-variant/5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center">
              <Wallet className="text-secondary" size={24} />
            </div>
            <div>
              <span className="text-xs font-label text-on-surface-variant uppercase tracking-widest block mb-1">
                My Wallet
              </span>
              <div className="flex items-baseline gap-2">
                <span className="font-headline text-3xl font-bold">0</span>
                <span className="text-primary font-bold text-sm">Neutrons</span>
                <span className="text-on-surface-variant text-sm">≈ 0 USDT</span>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="bg-surface-container-highest px-6 py-2.5 rounded-lg font-headline font-bold text-sm hover:text-secondary transition-colors">
              Deposit
            </button>
            <button className="bg-surface-container-highest px-6 py-2.5 rounded-lg font-headline font-bold text-sm hover:text-secondary transition-colors">
              Withdraw
            </button>
            <button className="bg-gradient-to-br from-primary to-primary-dim text-on-primary px-6 py-2.5 rounded-lg font-headline font-bold text-sm active:scale-95 transition-transform">
              View Ledger
            </button>
          </div>
        </section>
      </main>

      <Footer />

      {showModal && (
        <NewProjectModal
          onClose={() => setShowModal(false)}
          onCreated={load}
        />
      )}
    </>
  );
}
