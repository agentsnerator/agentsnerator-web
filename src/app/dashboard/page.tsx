'use client';

import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Plus, Users, ChevronRight } from 'lucide-react';

interface Client {
  id: string;
  name: string;
  industry: string | null;
  created_at: string;
}

export default function DashboardPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded || !user) return;
    const fetchClients = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from('clients')
        .select('id, name, industry, created_at')
        .order('created_at', { ascending: false });
      setClients(data || []);
      setLoading(false);
    };
    fetchClients();
  }, [isLoaded, user]);

  if (!isLoaded || loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500" />
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">عملاؤك</h1>
          <p className="text-gray-400 text-sm mt-1">كل عميل له وكلاؤه المفعّلون</p>
        </div>
        <button
          onClick={() => router.push('/dashboard/clients/new')}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
        >
          <Plus size={16} />
          إضافة عميل
        </button>
      </div>

      {clients.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <Users size={48} className="mx-auto mb-4 opacity-30" />
          <p>لا يوجد عملاء بعد</p>
          <button
            onClick={() => router.push('/dashboard/clients/new')}
            className="mt-4 text-purple-400 hover:text-purple-300 text-sm"
          >
            أضف أول عميل →
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {clients.map(client => (
            <div
              key={client.id}
              onClick={() => router.push(`/dashboard/clients/${client.id}`)}
              className="flex items-center justify-between bg-gray-900 hover:bg-gray-800 border border-gray-800 rounded-xl px-5 py-4 cursor-pointer transition"
            >
              <div>
                <p className="text-white font-medium">{client.name}</p>
                {client.industry && (
                  <p className="text-gray-500 text-sm mt-0.5">{client.industry}</p>
                )}
              </div>
              <ChevronRight size={18} className="text-gray-600" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
