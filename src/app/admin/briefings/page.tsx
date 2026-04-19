import React from 'react';
import { createClient } from '@supabase/supabase-js';
import BriefingsDashboardClient from './BriefingsDashboardClient';

// Enable revalidation or dynamic rendering so new submissions appear
export const revalidate = 0; 

// Initializing supabase server-side
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function BriefingsAdminPage() {
  
  const { data, error } = await supabase
    .from('infinity_briefing_submissions')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching briefings:", error);
    return <div className="text-white p-8">Erro ao carregar dados do Supabase. Verifique se a tabela foi criada.</div>;
  }

  const briefings = data || [];

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white">
      <BriefingsDashboardClient initialData={briefings} />
    </div>
  );
}
