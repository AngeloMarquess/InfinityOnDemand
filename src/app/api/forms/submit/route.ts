import { NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      form_slug = 'e-commerce-moda',
      form_title = 'Diagnóstico E-commerce',
      name,
      company,
      phone,
      email,
      instagram,
      situacao,
      nicho,
      tipo_marca,
      canais_venda,
      faturamento,
      possui_socios,
      answers = {},
      utm_source,
      utm_medium,
      utm_campaign,
      utm_content,
    } = body;

    if (!name || !phone) {
      return NextResponse.json(
        { error: 'Nome e WhatsApp são obrigatórios' },
        { status: 400 }
      );
    }

    // Calcular Lead Score inteligente (0 a 100)
    let score = 50;

    // Faturamento
    if (faturamento?.includes('Acima de 100 mil')) score += 30;
    else if (faturamento?.includes('50 a 100 mil')) score += 25;
    else if (faturamento?.includes('25 a 50 mil')) score += 20;
    else if (faturamento?.includes('10 a 25 mil')) score += 15;
    else if (faturamento?.includes('5 a 10 mil')) score += 10;
    else if (faturamento?.includes('Até 5 mil')) score += 5;

    // Marca própria / Fornecedor autorizado
    if (tipo_marca?.toLowerCase().includes('marca própria') || tipo_marca?.toLowerCase().includes('autorizado')) {
      score += 15;
    }

    // Situação
    if (situacao?.toLowerCase().includes('reestruturar')) score += 10;

    // Sócios (proprietário direto)
    if (possui_socios?.toLowerCase().includes('proprietário')) score += 10;

    score = Math.min(score, 100);

    const supabase = getServerSupabase();

    // 1. Inserir na tabela de submissões
    const submissionPayload = {
      form_slug,
      form_title,
      name,
      company: company || name,
      phone,
      email: email || '',
      instagram: instagram || '',
      situacao: situacao || '',
      nicho: nicho || '',
      tipo_marca: tipo_marca || '',
      canais_venda: canais_venda || '',
      faturamento: faturamento || '',
      possui_socios: possui_socios || '',
      lead_score: score,
      answers,
      utm_source: utm_source || null,
      utm_medium: utm_medium || null,
      utm_campaign: utm_campaign || null,
      utm_content: utm_content || null,
      status: 'novo',
    };

    const { data: submission, error: subError } = await supabase
      .from('crm_form_submissions')
      .insert([submissionPayload])
      .select()
      .single();

    if (subError) {
      console.error('Erro ao salvar em crm_form_submissions:', subError);
      // Fallback sem travar
    }

    // 2. Sincronizar automaticamente com crm_contacts no CRM Infinity
    try {
      const contactPayload = {
        name,
        company: company || name,
        phone,
        email: email || null,
        origin: `Tráfego Pago (${form_title})`,
        contact_type: 'prospect',
        notes: `Diagnóstico recebido via Form:\n- Nicho: ${nicho}\n- Faturamento: ${faturamento}\n- Situação: ${situacao}\n- Marca: ${tipo_marca}\n- Canais: ${canais_venda}\n- Instagram: ${instagram}\n- Sócios: ${possui_socios}\n- Score: ${score}/100`,
        tags: [
          'trafego-pago',
          nicho ? `nicho:${nicho.split(' ')[0].toLowerCase()}` : 'ecommerce',
          score >= 80 ? 'alta-prioridade' : 'qualificado',
        ],
      };

      await supabase.from('crm_contacts').insert([contactPayload]);
    } catch (errContact) {
      console.warn('Aviso: contato não sincronizado com crm_contacts:', errContact);
    }

    // 3. Montar mensagem formatada para WhatsApp comercial
    const whatsappMessage = `Olá, me chamo *${name}* e acabei de preencher o formulário da *Infinity On Demand*.

Seguem minhas informações:
🏢 *Empresa:* ${company || name}
🛍️ *Nicho:* ${nicho || 'Geral'}
💰 *Faturamento da Loja:* ${faturamento || 'Não informado'}
🏪 *Canais Atuais:* ${canais_venda || 'Loja física'}
📸 *Instagram:* ${instagram || 'Não informado'}
📱 *WhatsApp:* ${phone}

Gostaria de agendar a reunião de diagnóstico para criar o e-commerce em 7 dias!`;

    const encodedMsg = encodeURIComponent(whatsappMessage);
    const whatsappUrl = `https://wa.me/5581981280719?text=${encodedMsg}`;

    return NextResponse.json({
      success: true,
      submission_id: submission?.id,
      lead_score: score,
      whatsapp_url: whatsappUrl,
    });
  } catch (error: any) {
    console.error('Erro no submit do formulário:', error);
    return NextResponse.json(
      { error: error.message || 'Erro interno no servidor' },
      { status: 500 }
    );
  }
}
