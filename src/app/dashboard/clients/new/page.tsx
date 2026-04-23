'use client';

import { useUser } from '@clerk/nextjs';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { ArrowRight, CheckCircle } from 'lucide-react';

const AGENT_TYPES = [
  { type: 'social',  label: 'Social Media',   icon: '📱' },
  { type: 'seo',     label: 'SEO Agent',       icon: '🔍' },
  { type: 'content', label: 'Content Writer',  icon: '📝' },
  { type: 'report',  label: 'Monthly Report',  icon: '📊' },
  { type: 'image',   label: 'Image Generator', icon: '🎨' },
  { type: 'market',  label: 'Market Research', icon: '🏆' },
  { type: 'gamedev', label: 'Game Dev',        icon: '🎮' },
];

export default function NewClientPage() {
  const { user } = useUser();
  const router = useRouter();
  const [name, setName] = useState('');
  const [industry, setIndustry] = useState('');
  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const toggleAgent = (type: string) => {
    setSelectedAgents(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const handleSave = async () => {
    if (!name.trim() || !user || saving) return;
    setSaving(true);

    const supabase = createClient();

    const { data: client, error } = await supabase
      .from('clients')
      .insert({
        agency_clerk_id: user.id,
        name: name.trim(),
        industry: industry.trim() || null,
      })
      .select('id')
      .single();

    if (error || !client) {
      setSaving(false);
      return;
    }

    if (selectedAgents.length > 0) {
      await supabase.from('client_agents').insert(
        selectedAgents.map(type => ({ client_id: client.id, agent_type: type }))
      );
    }

    setSuccess(true);
    setTimeout(() => {
      router.push(`/dashboard/clients/${client.id}`);
    }, 1500);
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      {/* Toast */}
      {success && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-green-600 text-white px-5 py-3 rounded-xl shadow-lg animate-fade-in">
          <CheckCircle size={18} />
          تم إضافة العميل بنجاح ✅
        </div>
      )}

      <button
        onClick={() => router.back()}
        className="flex items-center gap-1 text-gray-500 hover:text-white text-sm mb-6 transition"
      >
        <ArrowRight size={14} /> رجوع
      </button>

      <h1 className="text-2xl font-bold text-white mb-8">إضافة عميل جديد</h1>

      <div className="space-y-5">
        <div>
          <label className="block text-sm text-gray-400 mb-1">اسم العميل *</label>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="مثال: مطعم العافية"
            disabled={saving}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 disabled:opacity-50"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">المجال / الصناعة</label>
          <input
            value={industry}
            onChange={e => setIndustry(e.target.value)}
            placeholder="مثال: مطاعم، عقارات، تجزئة..."
            disabled={saving}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 disabled:opacity-50"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">الوكلاء المفعّلون</label>
          <p className="text-xs text-gray-600 mb-3">اختياري — يمكنك تفعيل وكلاء إضافيين لاحقاً من صفحة العميل</p>
          <div className="grid grid-cols-2 gap-2">
            {AGENT_TYPES.map(a => (
              <button
                key={a.type}
                onClick={() => toggleAgent(a.type)}
                disabled={saving}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm transition ${
                  selectedAgents.includes(a.type)
                    ? 'border-purple-500 bg-purple-500/10 text-white'
                    : 'border-gray-700 bg-gray-900 text-gray-400 hover:border-gray-600'
                }`}
              >
                <span>{a.icon}</span>
                <span>{a.label}</span>
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={!name.trim() || saving}
          className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white py-3 rounded-lg font-medium transition"
        >
          {saving ? 'جاري الحفظ...' : 'إنشاء العميل'}
        </button>

        <p className="text-center text-xs text-gray-600">
          يمكنك تعبئة تفاصيل العميل وتفعيل الوكلاء بعد الإنشاء
        </p>
      </div>
    </div>
  );
}
