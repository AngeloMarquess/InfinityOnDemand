import { NextResponse } from 'next/server';
import { saveSubmission, calculateLeadScore } from '@/lib/forms-storage';
import { getServerSupabase } from '@/lib/supabase';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      form_id,
      form_slug,
      form_title,
      answers,
      utm_source,
      utm_medium,
      utm_campaign,
    } = body;

    if (!form_slug || !answers) {
      return NextResponse.json(
        { error: 'form_slug e answers são obrigatórios' },
        { status: 400, headers: corsHeaders }
      );
    }

    // 1. Extrair campos de contato das respostas
    let name = '';
    let phone = '';
    let email = '';
    let company = '';
    let nicho = '';
    let faturamento = '';

    Object.entries(answers).forEach(([key, val]: [string, any]) => {
      const lowerKey = key.toLowerCase();
      const valStr = Array.isArray(val) ? val.join(', ') : String(val);

      if (lowerKey.includes('nome') && !name) {
        name = valStr;
      } else if ((lowerKey.includes('whats') || lowerKey.includes('telefone') || lowerKey.includes('celular') || lowerKey.includes('contato')) && !phone) {
        phone = valStr;
      } else if (lowerKey.includes('mail') && !email) {
        email = valStr;
      } else if ((lowerKey.includes('empresa') || lowerKey.includes('marca') || lowerKey.includes('negócio') || lowerKey.includes('negocio')) && !company) {
        company = valStr;
      } else if ((lowerKey.includes('nicho') || lowerKey.includes('segmento') || lowerKey.includes('área') || lowerKey.includes('area') || lowerKey.includes('categoria')) && !nicho) {
        nicho = valStr;
      } else if ((lowerKey.includes('faturam') || lowerKey.includes('faixa') || lowerKey.includes('receita') || lowerKey.includes('renda')) && !faturamento) {
        faturamento = valStr;
      }
    });

    if (!name) name = 'Lead Interessado';
    if (!company) company = name;

    // Calcular Lead Score
    const score = calculateLeadScore(answers);
    const finalTitle = form_title || form_slug;

    // Salvar no storage local persistente
    const savedLead = saveSubmission({
      form_slug,
      form_title: finalTitle,
      name,
      phone,
      email,
      company,
      nicho,
      faturamento,
      lead_score: score,
      answers,
      utm_source: utm_source || '',
      utm_medium: utm_medium || '',
      utm_campaign: utm_campaign || '',
      status: 'novo',
      created_at: new Date().toISOString(),
    });

    // Salvar no Supabase (tanto histórico de formulários quanto CRM crm_contacts na coluna "Novo Lead")
    try {
      const supabase = getServerSupabase();
      
      // 1. Tabela histórica de submissões
      try {
        await supabase.from('crm_form_submissions').insert([{
          id: savedLead.id,
          form_slug,
          form_title: finalTitle,
          name,
          phone,
          email,
          company,
          nicho,
          faturamento,
          lead_score: score,
          answers,
          status: 'novo',
          utm_source: utm_source || null,
          utm_medium: utm_medium || null,
          utm_campaign: utm_campaign || null,
        }]);
      } catch (subErr) {
        console.warn('Aviso ao inserir em crm_form_submissions:', subErr);
      }

      // 2. Buscar estágio "Novo Lead" no Pipeline de Vendas do CRM do dono oficial
      const crmOwnerId = process.env.CRM_OWNER_USER_ID || '682d777e-f875-40bf-b10f-d3f44b67da54';
      let targetStageId = '3ec26da6-b452-4f30-bdee-7955726027d2'; // Default Novo Lead do angelo.marques

      try {
        const { data: stages } = await supabase
          .from('crm_stages')
          .select('id, name')
          .eq('user_id', crmOwnerId)
          .order('order_index', { ascending: true });
        
        if (stages && stages.length > 0) {
          const novoStage = stages.find((s: any) => s.name?.toLowerCase().includes('novo'));
          targetStageId = novoStage ? novoStage.id : stages[0].id;
        }
      } catch (errStage) {
        console.error('Aviso ao buscar stages do CRM:', errStage);
      }

      // Montar resumo das respostas para anotações do lead
      let answersNote = '';
      Object.entries(answers).forEach(([k, v]: [string, any]) => {
        answersNote += `• ${k}: ${Array.isArray(v) ? v.join(', ') : String(v)}\n`;
      });

      const crmNotes = `Lead capturado via formulário "${finalTitle}" em ${new Date().toLocaleDateString('pt-BR')} ${new Date().toLocaleTimeString('pt-BR')} (Score: ${score}/100)\nFunil: ${form_slug}\nOrigem UTM: ${utm_source || 'Meta Ads'}${utm_medium ? ` / ${utm_medium}` : ''}${utm_campaign ? ` / ${utm_campaign}` : ''}\n\nRespostas do Formulário:\n${answersNote}`;

      // Tags solicitadas pelo usuário para identificar a origem e o form
      const tags = [
        finalTitle,
        'Formulário',
        utm_source || 'Meta Ads',
        'Tráfego Pago',
      ].filter(Boolean);

      // Inserir diretamente no CRM (tabela crm_contacts com origin: 'site' para cair na aba "Leads do Site")
      const { data: newContact, error: contactErr } = await supabase.from('crm_contacts').insert([{
        user_id: crmOwnerId,
        name,
        email: email || null,
        phone: phone || null,
        company: company || name,
        notes: crmNotes,
        estimated_value: 0,
        origin: 'site',
        contact_type: 'lead',
        stage_id: targetStageId,
        project_interest: finalTitle,
        tags,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }]).select().single();

      if (contactErr) {
        console.error('Erro ao inserir contato no CRM:', contactErr);
      } else {
        console.log('Contato inserido com sucesso no CRM:', newContact?.id, 'Stage:', targetStageId);
      }
    } catch (e) {
      console.error('Erro na integração do lead com Supabase/CRM:', e);
    }

    // Montar link do WhatsApp se configurado para envio
    let whatsappUrl = '';
    if (body.whatsapp_destination) {
      const cleanPhone = body.whatsapp_destination.replace(/\D/g, '');
      const text = encodeURIComponent(
        `Olá! Acabei de preencher o formulário "${finalTitle}".\nNome: ${name}\nWhatsApp: ${phone}\nScore: ${score}/100`
      );
      whatsappUrl = `https://wa.me/${cleanPhone}?text=${text}`;
    }

    return NextResponse.json({
      success: true,
      lead: savedLead,
      score,
      whatsappUrl,
    }, { headers: corsHeaders });
  } catch (err: any) {
    console.error('Erro em POST /api/forms/submit:', err);
    return NextResponse.json({ error: err.message }, { status: 500, headers: corsHeaders });
  }
}
