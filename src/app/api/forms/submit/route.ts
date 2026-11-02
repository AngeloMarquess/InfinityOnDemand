import { NextResponse } from 'next/server';
import { saveLead, getFormBySlug } from '@/lib/forms-storage';
import { getServerSupabase } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      form_slug = 'e-commerce-moda',
      form_title,
      name = 'Cliente',
      company = '',
      phone = '',
      email = '',
      answers = {},
      utm_source,
      utm_medium,
      utm_campaign,
    } = body;

    // Buscar configurações do formulário
    const formDef = getFormBySlug(form_slug);
    const finalTitle = form_title || formDef?.title || `Formulário ${form_slug}`;
    const targetWhatsapp = formDef?.whatsappDestination || '5581981280719';
    const shouldSendWhatsapp = formDef ? formDef.sendToWhatsapp : true;

    // Extrair nicho e faturamento das respostas se não vierem explícitos
    let nicho = body.nicho || '';
    let faturamento = body.faturamento || '';

    Object.entries(answers).forEach(([k, v]: [string, any]) => {
      const lowerKey = k.toLowerCase();
      if (!nicho && (lowerKey.includes('nicho') || lowerKey.includes('segmento'))) {
        nicho = Array.isArray(v) ? v.join(', ') : String(v);
      }
      if (!faturamento && (lowerKey.includes('fatur') || lowerKey.includes('receita'))) {
        faturamento = Array.isArray(v) ? v.join(', ') : String(v);
      }
    });

    // Calcular Lead Score Inteligente (0 a 100)
    let score = 50;
    if (faturamento?.includes('100 mil') || faturamento?.includes('50 mil')) score += 30;
    else if (faturamento?.includes('25 mil') || faturamento?.includes('30 mil')) score += 20;
    else if (faturamento?.includes('10 mil') || faturamento?.includes('15 mil')) score += 10;

    if (phone && phone.replace(/\D/g, '').length >= 10) score += 10;
    if (email && email.includes('@')) score += 10;
    score = Math.min(score, 100);

    // Salvar persistentemente no forms-storage
    const savedLead = saveLead({
      id: `lead-${Date.now()}`,
      form_slug,
      form_title: finalTitle,
      client_id: formDef?.clientId,
      client_name: formDef?.clientName,
      name,
      phone,
      email,
      company: company || name,
      nicho: nicho || formDef?.niche || 'Geral',
      faturamento: faturamento || 'Não informado',
      lead_score: score,
      answers,
      status: 'novo',
      utm_source,
      utm_medium,
      utm_campaign,
      created_at: new Date().toISOString(),
    });

    // Salvar no Supabase se disponível
    try {
      const supabase = getServerSupabase();
      await supabase.from('crm_form_submissions').insert([{
        id: savedLead.id,
        form_slug,
        form_title: finalTitle,
        name,
        company: company || name,
        phone,
        email,
        nicho: nicho || formDef?.niche || 'Geral',
        faturamento: faturamento || 'Não informado',
        lead_score: score,
        answers,
        status: 'novo',
        utm_source: utm_source || null,
        utm_medium: utm_medium || null,
        utm_campaign: utm_campaign || null,
      }]);
    } catch (e) {
      // Ignora erro do Supabase
    }

    // Montar link do WhatsApp se configurado para envio
    let whatsappUrl = '';
    if (shouldSendWhatsapp) {
      let answersSummary = '';
      Object.entries(answers).forEach(([qTitle, qAns]: [string, any]) => {
        const valStr = Array.isArray(qAns) ? qAns.join(', ') : String(qAns);
        answersSummary += `\n• *${qTitle}:* ${valStr}`;
      });

      const whatsappMessage = `Olá! Me chamo *${name}* e acabei de responder ao formulário *${finalTitle}*.\n\n📋 *Resumo das minhas respostas:*${answersSummary}\n\n📱 *Contato:* ${phone}${email ? `\n✉️ *E-mail:* ${email}` : ''}`;
      whatsappUrl = `https://wa.me/${targetWhatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(whatsappMessage)}`;
    }

    return NextResponse.json({
      success: true,
      lead_id: savedLead.id,
      lead_score: score,
      whatsapp_url: whatsappUrl,
      should_send_whatsapp: shouldSendWhatsapp,
      thank_you_title: formDef?.thankYouTitle || 'Obrigado!',
      thank_you_message: formDef?.thankYouMessage || 'Recebemos suas respostas com sucesso.',
    });
  } catch (error: any) {
    console.error('Erro em POST /api/forms/submit:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
