'use client';

import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { ArrowRight, Plus } from 'lucide-react';
import { AGENT_TEMPLATES } from '@/lib/agents-config';

interface Client {
  id: string;
  name: string;
  industry: string | null;
}

interface ClientAgent {
  id: string;
  agent_type: string;
  is_active: boolean;
}

export default function ClientPage() {
  const { user } = useUser();
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [client, setClient] = useState<Client | null>(null);
  const [agents, setAgents] = useState<ClientAgent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !id) return;
    const fetch = async () => {
      const supabase = createClient();
      const { data: c } = await supabase
        .from('clients')
        .select('id, name, industry')
        .eq('id', id)
        .single();
      const { data: a } = await supabase
        .from('client_agents')
        .select('id, agent_type, is_active')
        .eq('client_id', id);
      setClient(c);
      setAgents(a || []);
      setLoading(false);
    };
    fetch();
  }, [user, id]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500" />
    </div>
  );

  if (!client) return (
    <div className="text-center py-20 text-gray-500">العميل غير موجود</div>
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <button onClick={() => router.push('/dashboard')} className="flex items-center gap-1 text-gray-500 hover:text-white text-sm mb-6 transition">
        <ArrowRight size={14} /> رجوع للعملاء
      </button>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">{client.name}</h1>
        {client.industry && <p className="text-gray-500 text-sm mt-1">{client.industry}</p>}
      </div>

      <div className="grid gap-3">
        {agents.map(agent => {
          const template = AGENT_TEMPLATES.find(t => t.type === agent.agent_type);
          if (!template) return null;
          return (
            <div
              key={agent.id}
              onClick={() => router.push(`/dashboard/clients/${id}/agent/${agent.agent_type}`)}
              className="flex items-center justify-between bg-gray-900 hover:bg-gray-800 border border-gray-800 rounded-xl px-5 py-4 cursor-pointer transition"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{template.icon}</span>
                <div>
                  <p className="text-white font-medium">{template.name}</p>
                  <p className="text-xs text-green-500 mt-0.5">● مفعّل</p>
                </div>
              </div>
              <button className="text-sm text-purple-400 hover:text-purple-300 font-medium">
                تشغيل →
              </button>
            </div>
          );
        })}

        {agents.length === 0 && (
          <div className="text-center py-12 text-gray-600">
            <p>لا يوجد وكلاء مفعّلون</p>
          </div>
        )}
      </div>

      <button
        onClick={() => router.push(`/dashboard/clients/${id}/add-agent`)}
        className="mt-6 flex items-center gap-2 text-gray-500 hover:text-white text-sm transition"
      >
        <Plus size={14} /> إضافة وكيل
      </button>
    </div>
  );
}
