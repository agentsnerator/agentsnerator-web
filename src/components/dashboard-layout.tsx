'use client';

import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Plus, LayoutDashboard, ChevronDown, ChevronRight } from 'lucide-react';
import { UserButton } from '@clerk/nextjs';

interface Client {
  id: string;
  name: string;
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const [clients, setClients] = useState<Client[]>([]);
  const [expanded, setExpanded] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from('clients')
        .select('id, name')
        .order('created_at', { ascending: true });
      setClients(data || []);
    };
    fetch();
  }, [user]);

  const activeClientId = pathname.match(/\/dashboard\/clients\/([^/]+)/)?.[1];

  return (
    <div className="flex min-h-screen bg-black">
      {/* Sidebar */}
      <aside className="w-60 shrink-0 border-r border-gray-800 flex flex-col py-4 px-3">
        {/* Logo */}
        <div
          onClick={() => router.push('/dashboard')}
          className="flex items-center gap-2 px-2 mb-6 cursor-pointer"
        >
          <LayoutDashboard size={18} className="text-purple-400" />
          <span className="text-white font-semibold text-sm">AgentsNerator</span>
        </div>

        {/* Clients Section */}
        <div className="flex-1 overflow-y-auto">
          <button
            onClick={() => setExpanded(p => !p)}
            className="flex items-center justify-between w-full px-2 py-1 text-xs text-gray-500 hover:text-gray-300 mb-1 transition"
          >
            <span>العملاء ({clients.length}/15)</span>
            {expanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
          </button>

          {expanded && (
            <div className="space-y-0.5">
              {clients.map(client => (
                <button
                  key={client.id}
                  onClick={() => router.push(`/dashboard/clients/${client.id}`)}
                  className={`w-full text-right px-3 py-2 rounded-lg text-sm transition truncate ${
                    activeClientId === client.id
                      ? 'bg-purple-600/20 text-purple-300'
                      : 'text-gray-400 hover:bg-gray-900 hover:text-white'
                  }`}
                >
                  {client.name}
                </button>
              ))}

              <button
                onClick={() => router.push('/dashboard/clients/new')}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-purple-400 transition"
              >
                <Plus size={13} />
                إضافة عميل
              </button>
            </div>
          )}
        </div>

        {/* User */}
        <div className="border-t border-gray-800 pt-3 px-2 flex items-center gap-2">
          <UserButton />
          <span className="text-xs text-gray-500 truncate">{user?.firstName}</span>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
