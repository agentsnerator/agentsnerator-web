'use client';

import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { ArrowRight } from 'lucide-react';
import { getAgentTemplate } from '@/lib/agents-config';

const N8N_BASE = 'https://n8n.passtop.store';

interface Client {
  id: string;
  name: string;
  industry: string | null;
  language: string;
  tone: string;
  brand_description: string | null;
}

export default function AgentRunPage() {
  const { user } = useUser();
  const router = useRouter();
  const { id, type } = useParams<{ id: string; type: string }>();
  const [client, setClient] = useState<Client | null>(null);
  const [prompt, setPrompt] = useState('');
  const [running, setRunning] = useState(false);
  const [output, setOutput] = useState<string | null>(null);

  const template = getAgentTemplate(type as any);

  useEffect(() => {
    if (!user || !id) return;
    const fetch = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from('clients')
        .select('id, name, industry, language, tone, brand_description')
        .eq('id', id)
        .single();
      setClient(data);
    };
    fetch();
  }, [user, id]);

  const handleRun = async () => {
    if (!prompt.trim() || !client || !template) return;
    setRunning(true);
    setOutput(null);
    try {
      const res = await fetch(`${N8N_BASE}${template.webhook}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          client_name: client.name,
          industry: client.industry,
          language: client.language,
          tone: client.tone,
          brand_description: client.brand_description,
        }),
      });
      const data = await res.json();
      setOutput(typeof data === 'string' ? data : JSON.stringify(data, null, 2));
    } catch (e) {
      setOutput('خطأ في الاتصال بالوكيل');
    }
    setRunning(false);
  };

  if (!template) return <div className="text-center py-20 text-gray-500">وكيل غير موجود</div>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <button onClick={() => router.push(`/dashboard/clients/${id}`)} className="flex items-center gap-1 text-gray-500 hover:text-white text-sm mb-6 transition">
        <ArrowRight size={14} /> رجوع
      </button>

      <div className="flex items-center gap-3 mb-8">
        <span className="text-3xl">{template.icon}</span>
        <div>
          <h1 className="text-xl font-bold text-white">{template.name}</h1>
          {client && <p className="text-gray-500 text-sm">{client.name}</p>}
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">الطلب</label>
          <textarea
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            rows={4}
            placeholder="اكتب طلبك هنا..."
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 resize-none"
          />
        </div>

        <button
          onClick={handleRun}
          disabled={!prompt.trim() || running}
          className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white py-3 rounded-lg font-medium transition"
        >
          {running ? 'جاري التشغيل...' : `تشغيل ${template.name}`}
        </button>
      </div>

      {output && (
        <div className="mt-6 bg-gray-900 border border-gray-800 rounded-xl p-5">
          <p className="text-sm text-gray-400 mb-3">النتيجة:</p>
          <pre className="text-white text-sm whitespace-pre-wrap font-sans">{output}</pre>
        </div>
      )}
    </div>
  );
}
