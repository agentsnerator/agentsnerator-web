import { supabase } from "./supabase";
import type { Project } from "@/components/dashboard/ProjectCard";
import type { Agent }   from "@/components/dashboard/AgentCard";

// ─── Map DB row → UI Project ───────────────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toProject(row: any, agentCount = 0): Project {
  return {
    id:               String(row.id),
    name:             row.name ?? "Unnamed Project",
    description:      row.description ?? "",
    ceoAgent:         row.ceo_agent_name ?? "—",
    ceoBarcode:       row.ceo_barcode    ?? "—",
    agentCount,
    status:           (row.status as Project["status"]) ?? "active",
    tags:             Array.isArray(row.tags) ? row.tags : [],
    tasksCompleted:   row.tasks_completed  ?? 0,
    neutronEarned:    row.neutron_earned   ?? 0,
  };
}

// ─── Map DB row → UI Agent ────────────────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toAgent(row: any): Agent {
  return {
    id:             String(row.id),
    name:           row.agent_name ?? "Unnamed Agent",
    barcode:        row.barcode    ?? "AGT-000-000",
    role:           row.role       ?? "Agent",
    score:          row.score      ?? 0,
    isCEO:          row.is_ceo     ?? false,
    avatarIcon:     row.avatar_icon ?? "smart_toy",
    tasksCompleted: row.tasks_completed ?? 0,
    status:         (row.status as Agent["status"]) ?? "idle",
  };
}

// ─── Fetch all projects (with agent count) ────────────────────────────────────
export async function getProjects(): Promise<{
  data: Project[];
  error: string | null;
}> {
  // 1. Fetch projects
  const { data: projects, error: pErr } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  if (pErr) return { data: [], error: pErr.message };
  if (!projects?.length) return { data: [], error: null };

  // 2. For each project, count agents + find CEO
  const enriched = await Promise.all(
    projects.map(async (p) => {
      const { data: agents } = await supabase
        .from("agents")
        .select("id, agent_name, barcode, is_ceo")
        .eq("project_id", p.id);

      const count  = agents?.length ?? 0;
      const ceo    = agents?.find((a) => a.is_ceo);

      return toProject(
        {
          ...p,
          ceo_agent_name: ceo?.agent_name ?? null,
          ceo_barcode:    ceo?.barcode    ?? null,
        },
        count,
      );
    }),
  );

  return { data: enriched, error: null };
}

// ─── Fetch single project ─────────────────────────────────────────────────────
export async function getProject(id: string): Promise<{
  data: { name: string; description: string; status: string; tags: string[] } | null;
  error: string | null;
}> {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return { data: null, error: error.message };
  return {
    data: {
      name:        data.name ?? "Unnamed Project",
      description: data.description ?? "",
      status:      data.status ?? "active",
      tags:        Array.isArray(data.tags) ? data.tags : [],
    },
    error: null,
  };
}

// ─── Fetch agents for a project ───────────────────────────────────────────────
export async function getProjectAgents(projectId: string): Promise<{
  data: Agent[];
  error: string | null;
}> {
  const { data, error } = await supabase
    .from("agents")
    .select("*")
    .eq("project_id", projectId)
    .order("is_ceo", { ascending: false }); // CEO first

  if (error) return { data: [], error: error.message };
  return { data: (data ?? []).map(toAgent), error: null };
}

// ─── Insert new project ───────────────────────────────────────────────────────
export async function createProject(name: string, description: string) {
  const { data, error } = await supabase
    .from("projects")
    .insert({ name, description, status: "building" })
    .select()
    .single();

  return { data, error: error?.message ?? null };
}

// ─── Insert new agent ─────────────────────────────────────────────────────────
export async function createAgent(
  projectId: string,
  agentName: string,
  role: string,
) {
  const barcode = `AGT-${Math.random().toString(36).slice(2, 6).toUpperCase()}-${Date.now().toString(36).toUpperCase().slice(-6)}`;

  const { data, error } = await supabase
    .from("agents")
    .insert({
      project_id: projectId,
      agent_name: agentName,
      role,
      barcode,
      score: 0,
      status: "training",
      is_ceo: false,
      avatar_icon: "smart_toy",
      tasks_completed: 0,
    })
    .select()
    .single();

  return { data, error: error?.message ?? null };
}
