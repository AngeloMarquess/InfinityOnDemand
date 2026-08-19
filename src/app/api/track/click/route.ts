import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const leadId = searchParams.get('lid');
  const campaign = searchParams.get('c') || 'Sites';
  const destinationUrl = searchParams.get('u') || 'https://infinityondemand.com.br';

  if (leadId) {
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

      if (supabaseUrl && supabaseServiceKey) {
        const supabase = createClient(supabaseUrl, supabaseServiceKey);
        
        const { data: contact } = await supabase
          .from('crm_contacts')
          .select('id, name, notes, tags')
          .eq('id', leadId)
          .single();

        if (contact) {
          const now = new Date().toLocaleString('pt-BR');
          const clickNote = `\n\n🔥 [ENGAJAMENTO ALTO] Lead clicou no link da campanha [${campaign}] em ${now}!`;
          const currentTags = Array.isArray(contact.tags) ? contact.tags : [];
          const updatedTags = Array.from(new Set([...currentTags, 'clicou_link', 'lead_quente']));

          await supabase
            .from('crm_contacts')
            .update({
              notes: (contact.notes || '') + clickNote,
              tags: updatedTags,
              updated_at: new Date().toISOString(),
            })
            .eq('id', leadId);
        }
      }
    } catch (err) {
      console.error('Click tracking error:', err);
    }
  }

  // Redirect lead to destination URL
  return NextResponse.redirect(destinationUrl, { status: 302 });
}
