'use client';

import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { ArrowRight, Copy, Check } from 'lucide-react';
import { getAgentTemplate } from '@/lib/agents-config';

const N8N_BASE = 'https://n8n.passtop.store';

interface Client {
  id: string; name: string; industry: string | null;
  language: string; tone: string; brand_description: string | null;
}

interface SocialPost {
  number: number; caption: string; hashtags: string[];
  image_suggestion: string; cta: string; image_url: string;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const el = document.createElement('textarea');
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={copy} className="p-1.5 rounded text-gray-500 hover:text-white hover:bg-gray-700 transition">
      {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
    </button>
  );
}

function SocialOutput({ data }: { data: any }) {
  let posts: SocialPost[] = [];
  try {
    const parsed = typeof data.output === 'string' ? JSON.parse(data.output) : data.output;
    posts = parsed.posts || [];
  } catch { return <pre className="text-white text-sm whitespace-pre-wrap">{JSON.stringify(data, null, 2)}</pre>; }

  const allText = posts.map((p, i) =>
    `[بوست ${i + 1}]\n${p.caption}\n${p.hashtags?.map((h: string) => '#' + h).join(' ') || ''}\n${p.cta}`
  ).join('\n\n---\n\n');

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span className="bg-pink-500/10 text-pink-400 border border-pink-500/20 px-2 py-0.5 rounded-full text-xs">
            {data.platform || 'Instagram'}
          </span>
          <span>{posts.length} منشورات</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <span>نسخ الكل</span>
          <CopyButton text={allText} />
        </div>
      </div>
      {posts.map((post) => {
        const hashtags = post.hashtags?.map((h: string) => '#' + h).join(' ') || '';
        const fullText = [post.caption, hashtags, post.cta].filter(Boolean).join('\n');
        return (
          <div key={post.number} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            {post.image_url && (
              <img
                src={post.image_url}
                alt={post.image_suggestion}
                className="w-full h-48 object-cover"
                onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            )}
            <div className="p-4 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <p className="text-white text-sm leading-relaxed flex-1">{post.caption}</p>
                <CopyButton text={fullText} />
              </div>
              {post.hashtags?.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {post.hashtags.map((tag: string) => (
                    <span key={tag} className="text-xs text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
              {post.cta && (
                <p className="text-xs text-gray-500 border-t border-gray-800 pt-2">📢 {post.cta}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ImageOutput({ data }: { data: any }) {
  const url = data.image_url || data.url || data.output;
  if (typeof url === 'string' && url.startsWith('http')) {
    return (
      <div className="space-y-3">
        <img src={url} alt="Generated" className="w-full rounded-xl" />
        <div className="flex gap-2">
          <a href={url} target="_blank" rel="noreferrer"
            className="flex-1 text-center text-sm bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg transition">
            فتح الصورة ↗
          </a>
          <CopyButton text={url} />
        </div>
      </div>
    );
  }
  return <pre className="text-white text-sm whitespace-pre-wrap">{JSON.stringify(data, null, 2)}</pre>;
}

function TextOutput({ data }: { data: any }) {
  const text = data.output || data.content || data.result || JSON.stringify(data, null, 2);
  return (
    <div className="relative">
      <div className="absolute top-2 left-2">
        <CopyButton text={typeof text === 'string' ? text : JSON.stringify(text)} />
      </div>
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 pt-8">
        <p className="text-white text-sm leading-relaxed whitespace-pre-wrap">
          {typeof text === 'string' ? text : JSON.stringify(text, null, 2)}
        </p>
      </div>
    </div>
  );
}

function AgentOutput({ type, data }: { type: string; data: any }) {
  if (type === 'social') return <SocialOutput data={data} />;
  if (type === 'image') return <ImageOutput data={data} />;
  return <TextOutput data={data} />;
}

export default function AgentRunPage() {
  const { user } = useUser();
  const router = useRouter();
  const { id, type } = useParams<{ id: string; type: string }>();
  const [client, setClient] = useState<Client | null>(null);
  const [prompt, setPrompt] = useState('');
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const template = getAgentTemplate(type as any);

  useEffect(() => {
    if (!user || !id) return;
    const load = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from('clients')
        .select('id, name, industry, language, tone, brand_description')
        .eq('id', id).single();
      setClient(data);
    };
    load();
  }, [user, id]);

  const handleRun = async () => {
    if (!prompt.trim() || !client || !template) return;
    setRunning(true);
    setResult(null);
    setError(null);
    try {
      const isNewRoute = type === 'social';
      const url = isNewRoute
        ? '/api/agents/social'
        : `${N8N_BASE}${template.webhook}`;

      const res = await fetch(url, {
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
      setResult(data);
    } catch {
      setError('خطأ في الاتصال بالوكيل');
    }
    setRunning(false);
  };

  if (!template) return <div className="text-center py-20 text-gray-500">وكيل غير موجود</div>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <button onClick={() => router.push(`/dashboard/clients/${id}`)}
        className="flex items-center gap-1 text-gray-500 hover:text-white text-sm mb-6 transition">
        <ArrowRight size={14} /> رجوع
      </button>

      <div className="flex items-center gap-3 mb-8">
        <span className="text-3xl">{template.icon}</span>
        <div>
          <h1 className="text-xl font-bold text-white">{template.name}</h1>
          {client && <p className="text-gray-500 text-sm">{client.name}</p>}
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <textarea
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          rows={4}
          placeholder="اكتب طلبك هنا..."
          className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 resize-none"
        />
        <button onClick={handleRun} disabled={!prompt.trim() || running}
          className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white py-3 rounded-lg font-medium transition">
          {running ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
              جاري التشغيل...
            </span>
          ) : `تشغيل ${template.name}`}
        </button>
      </div>

      {error && <p className="text-red-400 text-sm text-center mb-4">{error}</p>}

      {result && (
        <div>
          <p className="text-sm text-gray-500 mb-3">النتيجة:</p>
          <AgentOutput type={type} data={result} />
        </div>
      )}
    </div>
  );
}
