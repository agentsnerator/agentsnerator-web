'use client';

import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { ArrowRight, Save } from 'lucide-react';

const LANGUAGES = [
  { value: 'ar', label: 'العربية' },
  { value: 'en', label: 'الإنجليزية' },
  { value: 'ar-en', label: 'عربي + إنجليزي' },
];

const TONES = [
  { value: 'professional', label: 'احترافي' },
  { value: 'friendly', label: 'ودود' },
  { value: 'humorous', label: 'فكاهي' },
  { value: 'formal', label: 'رسمي' },
  { value: 'inspirational', label: 'تحفيزي' },
];

interface ClientData {
  name: string;
  industry: string;
  language: string;
  tone: string;
  brand_description: string;
  website_url: string;
  competitors: string;
}

export default function EditClientPage() {
  const { user } = useUser();
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [form, setForm] = useState<ClientData>({
    name: '',
    industry: '',
    language: 'ar',
    tone: 'professional',
    brand_description: '',
    website_url: '',
    competitors: '',
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!user || !id) return;
    const fetch = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from('clients')
        .select('name, industry, language, tone, brand_description, website_url, competitors')
        .eq('id', id)
        .single();
      if (data) setForm(data);
    };
    fetch();
  }, [user, id]);

  const handleChange = (field: keyof ClientData, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!user || saving) return;
    setSaving(true);
    const supabase = createClient();
    await supabase.from('clients').update(form).eq('id', id);
    setSaved(true);
    setSaving(false);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <button
        onClick={() => router.push(`/dashboard/clients/${id}`)}
        className="flex items-center gap-1 text-gray-500 hover:text-white text-sm mb-6 transition"
      >
        <ArrowRight size={14} /> رجوع
      </button>

      <h1 className="text-2xl font-bold text-white mb-8">تفاصيل العميل</h1>

      <div className="space-y-5">
        {/* Name */}
        <div>
          <label className="block text-sm text-gray-400 mb-1">اسم العميل *</label>
          <input
            value={form.name}
            onChange={e => handleChange('name', e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-500"
          />
        </div>

        {/* Industry */}
        <div>
          <label className="block text-sm text-gray-400 mb-1">المجال / الصناعة</label>
          <input
            value={form.industry || ''}
            onChange={e => handleChange('industry', e.target.value)}
            placeholder="مثال: مطاعم، عقارات، صحة..."
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500"
          />
        </div>

        {/* Language */}
        <div>
          <label className="block text-sm text-gray-400 mb-1">لغة المحتوى</label>
          <div className="flex gap-2">
            {LANGUAGES.map(l => (
              <button
                key={l.value}
                onClick={() => handleChange('language', l.value)}
                className={`flex-1 py-2 rounded-lg border text-sm transition ${
                  form.language === l.value
                    ? 'border-purple-500 bg-purple-500/10 text-white'
                    : 'border-gray-700 bg-gray-900 text-gray-400 hover:border-gray-600'
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tone */}
        <div>
          <label className="block text-sm text-gray-400 mb-1">أسلوب المحتوى</label>
          <div className="grid grid-cols-3 gap-2">
            {TONES.map(t => (
              <button
                key={t.value}
                onClick={() => handleChange('tone', t.value)}
                className={`py-2 rounded-lg border text-sm transition ${
                  form.tone === t.value
                    ? 'border-purple-500 bg-purple-500/10 text-white'
                    : 'border-gray-700 bg-gray-900 text-gray-400 hover:border-gray-600'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Brand Description */}
        <div>
          <label className="block text-sm text-gray-400 mb-1">وصف العلامة التجارية</label>
          <textarea
            value={form.brand_description || ''}
            onChange={e => handleChange('brand_description', e.target.value)}
            rows={3}
            placeholder="اكتب وصفاً مختصراً للعميل وما يقدمه..."
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 resize-none"
          />
        </div>

        {/* Website */}
        <div>
          <label className="block text-sm text-gray-400 mb-1">الموقع الإلكتروني</label>
          <input
            value={form.website_url || ''}
            onChange={e => handleChange('website_url', e.target.value)}
            placeholder="https://example.com"
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500"
          />
        </div>

        {/* Competitors */}
        <div>
          <label className="block text-sm text-gray-400 mb-1">المنافسون</label>
          <input
            value={form.competitors || ''}
            onChange={e => handleChange('competitors', e.target.value)}
            placeholder="مثال: شركة أ، شركة ب..."
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500"
          />
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition ${
            saved
              ? 'bg-green-600 text-white'
              : 'bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-40'
          }`}
        >
          <Save size={16} />
          {saved ? 'تم الحفظ ✅' : saving ? 'جاري الحفظ...' : 'حفظ التفاصيل'}
        </button>
      </div>
    </div>
  );
}
