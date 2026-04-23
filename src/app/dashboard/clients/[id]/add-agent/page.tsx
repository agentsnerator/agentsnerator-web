'use client';

import { useUser } from '@clerk/nextjs';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { AGENT_TEMPLATES } from '@/lib/agents-config';

export default function AddAgentPage() {
  const { user } = useUser();
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [activeTypes, setActiveTypes] = useState<string[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!user || !id) return;
    const fetch = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from('client_agents')
        .select('agent_type')
        .eq('client_id', id);
      setActiveTypes((data || []).map((r: any) => r.agent_type));
    };
    fetch();
  }, [user, id]);

  const available = AGENT_TEMPLATES.filter(a => !activeTypes.includes(a.type));

  const toggle = (type: string) => {
    setSelected(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const handleSave = async () => {
    if (!selected.length || saving) return;
    setSaving(true);
    const supabase = createClient();
    await supabase.from('client_agents').insert(
      selected.map(type => ({ client_id: id, agent_type: type }))
    );
    setDone(true);
    setTimeout(() => router.push(`/dashboard/clients/${id}`), 1500);
  };

  if (done) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <CheckCircle size={56} className="mx-auto text-green-500 mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">تم تفعيل الوكلاء ✅</h2>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1 text-gray-500 hover:text-white text-sm mb-6 transition"
      >
        <ArrowRight size={14} /> رجوع
      </button>

      <h1 className="text-2xl font-bold text-white mb-2">إضافة وكيل</h1>
      <p className="text-gray-500 text-sm mb-8">اختر الوكلاء التي تريد تفعيلها لهذا العميل</p>

      {available.length === 0 ? (
        <p className="text-gray-600 text-center py-12">جميع الوكلاء مفعّلون بالفعل ✅</p>
      ) : (
        <div className="grid gap-3">
          {available.map(a => (
            <button
              key={a.type}
              onClick={() => toggle(a.type)}
              className={`flex items-center gap-3 px-5 py-4 rounded-xl border text-sm transition ${
                selected.includes(a.type)
                  ? 'border-purple-500 bg-purple-500/10 text-white'
                  : 'border-gray-700 bg-gray-900 text-gray-400 hover:border-gray-600'
              }`}
            >
              <span className="text-2xl">{a.icon}</span>
              <span className="font-medium">{a.name}</span>
            </button>
          ))}
        </div>
      )}

      {available.length > 0 && (
        <button
          onClick={handleSave}
          disabled={!selected.length || saving}
          className="mt-6 w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white py-3 rounded-lg font-medium transition"
        >
          {saving ? 'جاري الحفظ...' : `تفعيل ${selected.length > 0 ? `(${selected.length})` : ''}`}
        </button>
      )}
    </div>
  );
}
