'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';

interface DigitalProduct {
  id: string;
  name: string;
  description: string;
  sales_page_url: string;
  price: number;
  currency: string;
  category?: string;
  payment_type: 'single' | 'subscription';
  delivery_type: 'members_area' | 'external' | 'files' | 'payments_only';
  members_area_name?: string;
  file_url?: string;
  image_url?: string;
  email_language?: string;
  status: 'active' | 'draft' | 'paused';
  total_sales: number;
  total_revenue: number;
  created_at?: string;
}

export default function KiwifyProductsPage() {
  // Navigation & View States
  const [sidebarTab, setSidebarTab] = useState<'dashboard' | 'products' | 'members' | 'sales' | 'financial' | 'settings'>('products');
  const [productSubTab, setProductSubTab] = useState<'mine' | 'coproduction' | 'affiliations'>('mine');
  const [viewMode, setViewMode] = useState<'list' | 'edit'>('list');

  // Products Data
  const [products, setProducts] = useState<DigitalProduct[]>([
    {
      id: 'prod_1',
      name: 'NeuroDesign',
      description: 'E-book e templates de neurodesign aplicados a criativos de alta conversão para tráfego pago e mídias sociais.',
      sales_page_url: 'https://infinityondemand.com.br',
      price: 24.90,
      currency: 'BRL',
      category: 'Design & IA',
      payment_type: 'single',
      delivery_type: 'members_area',
      members_area_name: 'NeuroDesign',
      image_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
      email_language: 'Português',
      status: 'active',
      total_sales: 14,
      total_revenue: 348.60,
    },
    {
      id: 'prod_2',
      name: 'E-book: IA para Criadores de Conteúdo',
      description: 'Guia passo a passo para automatizar a produção de conteúdo, carrosséis e roteiros com prompts profissionais.',
      sales_page_url: 'https://infinityondemand.com.br',
      price: 39.90,
      currency: 'BRL',
      category: 'Inteligência Artificial',
      payment_type: 'single',
      delivery_type: 'members_area',
      members_area_name: 'Área Infinity',
      image_url: 'https://images.unsplash.com/photo-1534972195531-a756b1126f24?w=600&auto=format&fit=crop&q=80',
      email_language: 'Português',
      status: 'active',
      total_sales: 28,
      total_revenue: 1117.20,
    },
  ]);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modal: Create Product (2 Steps)
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [createStep, setCreateStep] = useState<1 | 2>(1);
  const [newProd, setNewProd] = useState<Partial<DigitalProduct>>({
    payment_type: 'single',
    delivery_type: 'members_area',
    members_area_name: 'Criar nova área de membros',
    currency: 'BRL',
    price: 0,
    status: 'active',
    email_language: 'Português',
  });

  // Editing Product
  const [editingProduct, setEditingProduct] = useState<DigitalProduct | null>(null);
  const [editTab, setEditTab] = useState<'general' | 'members' | 'settings' | 'checkout' | 'coproduction' | 'affiliates' | 'links'>('general');
  const [actionMenuOpen, setActionMenuOpen] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Load from API on mount
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/digital-products');
        const data = await res.json();
        if (data.success && data.products && data.products.length > 0) {
          setProducts(data.products);
        }
      } catch (err) {
        console.log('Using local products:', err);
      }
    }
    load();
  }, []);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchQuery = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = statusFilter === 'all' || p.status === statusFilter;
      return matchQuery && matchStatus;
    });
  }, [products, searchQuery, statusFilter]);

  // Create Product Submit Handler
  async function handleFinishCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!newProd.name) return;

    const payload = {
      ...newProd,
      price: Number(newProd.price) || 0,
      currency: newProd.currency || 'BRL',
      status: 'active' as const,
      total_sales: 0,
      total_revenue: 0,
    };

    try {
      const res = await fetch('/api/digital-products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'save_product', payload }),
      });
      const data = await res.json();
      if (data.success && data.product) {
        setProducts((prev) => [data.product, ...prev]);
        setEditingProduct(data.product);
      } else {
        const fallback: DigitalProduct = { ...payload, id: `prod_${Date.now()}` } as DigitalProduct;
        setProducts((prev) => [fallback, ...prev]);
        setEditingProduct(fallback);
      }
    } catch {
      const fallback: DigitalProduct = { ...payload, id: `prod_${Date.now()}` } as DigitalProduct;
      setProducts((prev) => [fallback, ...prev]);
      setEditingProduct(fallback);
    }

    setCreateModalOpen(false);
    setCreateStep(1);
    setViewMode('edit');
  }

  // Save Edited Product
  async function handleSaveEdit(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (!editingProduct) return;

    try {
      await fetch('/api/digital-products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'save_product', payload: editingProduct }),
      });
    } catch {
      // local
    }

    setProducts((prev) => prev.map((p) => (p.id === editingProduct.id ? editingProduct : p)));
    alert('Produto salvo com sucesso!');
  }

  // Delete Product
  async function handleDeleteProduct(id: string) {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return;
    try {
      await fetch('/api/digital-products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete_product', payload: { id } }),
      });
    } catch {
      // local
    }
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setViewMode('list');
    setEditingProduct(null);
  }

  function handleCopyCheckout(id: string) {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://infinityondemand.com.br';
    const link = `${origin}/checkout/${id}`;
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f4f6f8', color: '#1a202c', fontFamily: "'Inter', system-ui, -apple-system, sans-serif", display: 'flex', flexDirection: 'column' }}>
      
      {/* ── TOP GREEN HEADER (Matching Kiwify Screenshot 1) ── */}
      <header style={{
        height: '52px',
        backgroundColor: '#00875A',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        color: '#fff',
        zIndex: 100,
      }}>
        {/* User / Organization Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
          <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>
            👤
          </div>
          <span style={{ fontWeight: 600, fontSize: 13.5 }}>Angelo Ferreira Marques</span>
          <span style={{ fontSize: 10, opacity: 0.8 }}>▼</span>
        </div>

        {/* Goal Indicator & Avatar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 12, fontWeight: 700, opacity: 0.9 }}>R$ 0K / R$ 10K</span>
            <div style={{ width: 90, height: 7, borderRadius: 999, background: 'rgba(255,255,255,0.3)', overflow: 'hidden' }}>
              <div style={{ width: '15%', height: '100%', background: '#fff', borderRadius: 999 }} />
            </div>
          </div>

          <div style={{
            width: 32, height: 32, borderRadius: '50%', background: '#fff', color: '#00875A',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 13,
          }}>
            A
          </div>
        </div>
      </header>

      {/* ── MAIN LAYOUT WITH SIDEBAR ── */}
      <div style={{ display: 'flex', flex: 1 }}>
        
        {/* ── LEFT DARK SIDEBAR (Matching Kiwify Screenshot 1) ── */}
        <aside style={{
          width: '210px',
          backgroundColor: '#1E293B',
          color: '#94A3B8',
          display: 'flex',
          flexDirection: 'column',
          padding: '16px 0',
          flexShrink: 0,
        }}>
          {[
            { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
            { id: 'products', label: 'Produtos', icon: '🏷️' },
            { id: 'members', label: 'Área de Membros', icon: '🎓' },
            { id: 'marketplace', label: 'Marketplace', icon: '🛒' },
            { id: 'affiliates', label: 'Meus Afiliados', icon: '👥' },
            { id: 'sales', label: 'Vendas', icon: '📈' },
            { id: 'subscriptions', label: 'Assinaturas', icon: '🔄' },
            { id: 'financial', label: 'Financeiro', icon: '💳' },
            { id: 'reports', label: 'Relatórios', icon: '📊' },
            { id: 'team', label: 'Colaboradores', icon: '👥' },
            { id: 'apps', label: 'Apps', icon: '📱' },
            { id: 'help', label: 'Ajuda', icon: '❓' },
          ].map((item) => {
            const isActive = sidebarTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setSidebarTab(item.id as any);
                  if (item.id === 'products') setViewMode('list');
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '10px 20px',
                  background: isActive ? '#0F172A' : 'transparent',
                  color: isActive ? '#fff' : '#94A3B8',
                  border: 'none',
                  borderLeft: isActive ? '3px solid #5850EC' : '3px solid transparent',
                  fontSize: '13.5px',
                  fontWeight: isActive ? 600 : 500,
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s',
                }}
              >
                <span style={{ fontSize: '15px' }}>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}

          <div style={{ marginTop: 'auto', padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <Link href="/relatorios_infinity" style={{ color: '#00DF81', fontSize: '12px', textDecoration: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span>←</span> Infinity Analytics
            </Link>
          </div>
        </aside>

        {/* ── CONTENT AREA ── */}
        <main style={{ flex: 1, padding: '32px 40px', overflowY: 'auto' }}>

          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* VIEW A: LISTA DE PRODUTOS (Matching Screenshot 1)               */}
          {/* ═══════════════════════════════════════════════════════════════ */}
          {viewMode === 'list' && (
            <div style={{ maxWidth: 1060, margin: '0 auto' }}>
              
              {/* Header with Title & Action */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h1 style={{ fontSize: 24, fontWeight: 700, color: '#111827', margin: 0 }}>Produtos</h1>
                <button
                  onClick={() => {
                    setNewProd({
                      payment_type: 'single',
                      delivery_type: 'members_area',
                      members_area_name: 'Criar nova área de membros',
                      currency: 'BRL',
                      price: 0,
                      status: 'active',
                      email_language: 'Português',
                    });
                    setCreateStep(1);
                    setCreateModalOpen(true);
                  }}
                  style={{
                    backgroundColor: '#5850EC',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '10px 18px',
                    fontSize: '13.5px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    boxShadow: '0 2px 4px rgba(88, 80, 236, 0.25)',
                    transition: 'background 0.2s',
                  }}
                >
                  Criar produto
                </button>
              </div>

              {/* White Card Container */}
              <div style={{
                backgroundColor: '#fff',
                borderRadius: '12px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                border: '1px solid #E2E8F0',
                overflow: 'hidden',
              }}>
                
                {/* Sub-tabs Pills */}
                <div style={{ display: 'flex', gap: 10, padding: '16px 20px', borderBottom: '1px solid #E2E8F0' }}>
                  {[
                    { id: 'mine', label: 'Meus produtos' },
                    { id: 'coproduction', label: 'Minhas co-produções' },
                    { id: 'affiliations', label: 'Minhas afiliações' },
                  ].map((tab) => {
                    const isActive = productSubTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setProductSubTab(tab.id as any)}
                        style={{
                          padding: '6px 14px',
                          borderRadius: '8px',
                          border: 'none',
                          fontSize: '13px',
                          fontWeight: isActive ? 600 : 500,
                          backgroundColor: isActive ? '#EEF2FF' : 'transparent',
                          color: isActive ? '#4F46E5' : '#64748B',
                          cursor: 'pointer',
                        }}
                      >
                        {tab.label}
                      </button>
                    );
                  })}
                </div>

                {/* Filter & Search Bar */}
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 20px', gap: 16 }}>
                  <div style={{ position: 'relative', width: 280 }}>
                    <input
                      type="text"
                      placeholder="Buscar..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '9px 12px 9px 34px',
                        borderRadius: '8px',
                        border: '1px solid #CBD5E1',
                        fontSize: '13.5px',
                        outline: 'none',
                      }}
                    />
                    <span style={{ position: 'absolute', left: 12, top: 9, color: '#94A3B8', fontSize: 13 }}>🔍</span>
                  </div>

                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    style={{
                      padding: '9px 14px',
                      borderRadius: '8px',
                      border: '1px solid #CBD5E1',
                      fontSize: '13px',
                      color: '#475569',
                      outline: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    <option value="all">Todos</option>
                    <option value="active">Ativo</option>
                    <option value="draft">Rascunho</option>
                    <option value="paused">Pausado</option>
                  </select>
                </div>

                {/* Products Table */}
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13.5px' }}>
                  <thead>
                    <tr style={{ borderTop: '1px solid #E2E8F0', borderBottom: '1px solid #E2E8F0', color: '#64748B', fontSize: '11px', letterSpacing: 0.8, textTransform: 'uppercase', backgroundColor: '#F8FAFC' }}>
                      <th style={{ padding: '12px 20px', fontWeight: 600 }}>NOME</th>
                      <th style={{ padding: '12px 20px', fontWeight: 600 }}>PREÇO</th>
                      <th style={{ padding: '12px 20px', fontWeight: 600 }}>STATUS</th>
                      <th style={{ padding: '12px 20px', textAlign: 'right' }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((prod) => (
                      <tr key={prod.id} style={{ borderBottom: '1px solid #F1F5F9', transition: 'background 0.15s' }}>
                        
                        {/* Name */}
                        <td style={{ padding: '16px 20px', fontWeight: 600, color: '#0F172A' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div style={{
                              width: 38, height: 38, borderRadius: 8,
                              backgroundImage: prod.image_url ? `url(${prod.image_url})` : 'none',
                              backgroundColor: '#E2E8F0',
                              backgroundSize: 'cover',
                              backgroundPosition: 'center',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontSize: 16,
                            }}>
                              {!prod.image_url && '📄'}
                            </div>
                            <div>
                              <div style={{ fontSize: '14px' }}>{prod.name}</div>
                              <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 400 }}>{prod.category || 'Infoproduto'}</div>
                            </div>
                          </div>
                        </td>

                        {/* Price */}
                        <td style={{ padding: '16px 20px', color: '#334155' }}>
                          R$ {prod.price.toFixed(2).replace('.', ',')}
                        </td>

                        {/* Status */}
                        <td style={{ padding: '16px 20px' }}>
                          <span style={{
                            padding: '4px 10px',
                            borderRadius: '999px',
                            fontSize: '11.5px',
                            fontWeight: 600,
                            backgroundColor: prod.status === 'active' ? '#DCFCE7' : '#F1F5F9',
                            color: prod.status === 'active' ? '#15803D' : '#64748B',
                          }}>
                            {prod.status === 'active' ? 'Ativo' : 'Rascunho'}
                          </span>
                        </td>

                        {/* Actions */}
                        <td style={{ padding: '16px 20px', textAlign: 'right', position: 'relative' }}>
                          <button
                            onClick={() => setActionMenuOpen(actionMenuOpen === prod.id ? null : prod.id)}
                            style={{
                              background: 'none',
                              border: '1px solid #CBD5E1',
                              borderRadius: '6px',
                              padding: '4px 10px',
                              cursor: 'pointer',
                              fontSize: '14px',
                              color: '#64748B',
                            }}
                          >
                            ⋮
                          </button>

                          {/* Action Dropdown Menu */}
                          {actionMenuOpen === prod.id && (
                            <div style={{
                              position: 'absolute',
                              right: 20,
                              top: 48,
                              backgroundColor: '#fff',
                              borderRadius: '8px',
                              boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                              border: '1px solid #E2E8F0',
                              padding: '6px 0',
                              width: '180px',
                              zIndex: 50,
                              textAlign: 'left',
                            }}>
                              <button
                                onClick={() => {
                                  setEditingProduct(prod);
                                  setViewMode('edit');
                                  setActionMenuOpen(null);
                                }}
                                style={{ width: '100%', padding: '8px 16px', background: 'none', border: 'none', textAlign: 'left', fontSize: '13px', cursor: 'pointer', color: '#334155' }}
                              >
                                ✏️ Editar produto
                              </button>

                              <button
                                onClick={() => {
                                  handleCopyCheckout(prod.id);
                                  setActionMenuOpen(null);
                                }}
                                style={{ width: '100%', padding: '8px 16px', background: 'none', border: 'none', textAlign: 'left', fontSize: '13px', cursor: 'pointer', color: '#334155' }}
                              >
                                🔗 Copiar link de checkout
                              </button>

                              <button
                                onClick={() => handleDeleteProduct(prod.id)}
                                style={{ width: '100%', padding: '8px 16px', background: 'none', border: 'none', textAlign: 'left', fontSize: '13px', cursor: 'pointer', color: '#EF4444' }}
                              >
                                🗑️ Excluir
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Pagination */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '16px 20px',
                  borderTop: '1px solid #E2E8F0',
                  color: '#64748B',
                  fontSize: '12.5px',
                }}>
                  <span>Exibindo 1 de 1 página</span>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button style={{ padding: '4px 10px', borderRadius: '6px', border: '1px solid #E2E8F0', background: '#fff', cursor: 'pointer', color: '#94A3B8' }}>‹</button>
                    <button style={{ padding: '4px 10px', borderRadius: '6px', border: '1px solid #5850EC', background: '#EEF2FF', color: '#4F46E5', fontWeight: 600 }}>1</button>
                    <button style={{ padding: '4px 10px', borderRadius: '6px', border: '1px solid #E2E8F0', background: '#fff', cursor: 'pointer', color: '#94A3B8' }}>›</button>
                  </div>
                </div>
              </div>

              {/* Helper Footer Link */}
              <div style={{ textAlign: 'center', marginTop: 24, fontSize: '13px', color: '#64748B' }}>
                <span style={{ color: '#5850EC', marginRight: 6 }}>ℹ️</span>
                Aprenda mais sobre os <a href="#ajuda" style={{ color: '#5850EC', textDecoration: 'none', fontWeight: 600 }}>produtos</a>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* VIEW B: EDITAR PRODUTO (Matching Screenshots 6 & 7)             */}
          {/* ═══════════════════════════════════════════════════════════════ */}
          {viewMode === 'edit' && editingProduct && (
            <div style={{ maxWidth: 1000, margin: '0 auto' }}>
              
              {/* Top Navigation Row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <button
                  onClick={() => setViewMode('list')}
                  style={{
                    background: 'none', border: 'none', fontSize: '20px', fontWeight: 700, color: '#1E293B',
                    display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer',
                  }}
                >
                  <span>←</span> Editar produto
                </button>

                <button
                  onClick={() => handleSaveEdit()}
                  style={{
                    backgroundColor: '#5850EC', color: '#fff', border: 'none', borderRadius: '8px',
                    padding: '10px 22px', fontSize: '13.5px', fontWeight: 600, cursor: 'pointer',
                  }}
                >
                  Salvar produto
                </button>
              </div>

              {/* Tabs Navigation Pills */}
              <div style={{
                display: 'flex', gap: 8, backgroundColor: '#fff', padding: '12px 16px', borderRadius: '12px',
                border: '1px solid #E2E8F0', marginBottom: 28, overflowX: 'auto',
              }}>
                {[
                  { id: 'general', label: 'Geral' },
                  { id: 'members', label: 'Área de membros' },
                  { id: 'settings', label: 'Configurações' },
                  { id: 'checkout', label: 'Checkout' },
                  { id: 'coproduction', label: 'Co-produção' },
                  { id: 'affiliates', label: 'Afiliados' },
                  { id: 'links', label: 'Links' },
                ].map((tab) => {
                  const isActive = editTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setEditTab(tab.id as any)}
                      style={{
                        padding: '6px 16px', borderRadius: '8px', border: 'none', fontSize: '13px',
                        fontWeight: isActive ? 600 : 500,
                        backgroundColor: isActive ? '#EEF2FF' : 'transparent',
                        color: isActive ? '#4F46E5' : '#64748B',
                        cursor: 'pointer',
                      }}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Tab 1: Geral */}
              {editTab === 'general' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
                  
                  {/* Section: Produto */}
                  <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 32 }}>
                    <div>
                      <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1E293B', margin: '0 0 6px' }}>Produto</h3>
                      <p style={{ fontSize: 13, color: '#64748B', lineHeight: 1.5 }}>
                        Você pode cadastrar o produto e já começar a vender. A imagem do produto será exibida na área de membros e no seu programa de afiliados.
                      </p>
                    </div>

                    {/* Form Fields Card */}
                    <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: 20 }}>
                      
                      <div>
                        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#334155', marginBottom: 6 }}>Nome do produto</label>
                        <input
                          type="text"
                          value={editingProduct.name}
                          onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                          style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14px', outline: 'none' }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#334155', marginBottom: 6 }}>Descrição</label>
                        <textarea
                          rows={4}
                          value={editingProduct.description}
                          onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                          style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14px', outline: 'none', resize: 'vertical' }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#334155', marginBottom: 6 }}>Categoria</label>
                        <select
                          value={editingProduct.category || 'Design & IA'}
                          onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                          style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14px', outline: 'none', background: '#fff' }}
                        >
                          <option value="Design & IA">Design & IA</option>
                          <option value="Marketing & Vendas">Marketing & Vendas</option>
                          <option value="Finanças & Gestão">Finanças & Gestão</option>
                          <option value="E-books & Guias">E-books & Guias</option>
                        </select>
                      </div>

                      {/* Image Upload Box */}
                      <div>
                        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#334155', marginBottom: 6 }}>Imagem do produto</label>
                        <div style={{
                          border: '2px dashed #CBD5E1', borderRadius: '10px', padding: '36px 20px', textAlign: 'center',
                          backgroundColor: '#F8FAFC', cursor: 'pointer',
                        }}>
                          <div style={{ fontSize: 28, marginBottom: 8 }}>⬇️</div>
                          <div style={{ fontSize: 13.5, color: '#475569' }}>
                            Arraste aqui ou <span style={{ color: '#4F46E5', fontWeight: 600 }}>selecione do computador</span>
                          </div>
                        </div>

                        {/* Recommendation Note */}
                        <div style={{ marginTop: 10, padding: '10px 14px', backgroundColor: '#FEF9C3', borderRadius: '8px', border: '1px solid #FDE047', fontSize: 12, color: '#854D0E', display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span>💡</span> Tamanho recomendado: 300x250 pixels
                        </div>
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#334155', marginBottom: 6 }}>Idioma dos emails ❓</label>
                        <select
                          value={editingProduct.email_language || 'Português'}
                          onChange={(e) => setEditingProduct({ ...editingProduct, email_language: e.target.value })}
                          style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14px', outline: 'none', background: '#fff' }}
                        >
                          <option value="Português">Português</option>
                          <option value="Espanhol">Espanhol</option>
                          <option value="Inglês">Inglês</option>
                        </select>
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#334155', marginBottom: 6 }}>Página de vendas</label>
                        <div style={{ position: 'relative' }}>
                          <span style={{ position: 'absolute', left: 12, top: 10, color: '#94A3B8' }}>🔗</span>
                          <input
                            type="text"
                            value={editingProduct.sales_page_url}
                            onChange={(e) => setEditingProduct({ ...editingProduct, sales_page_url: e.target.value })}
                            style={{ width: '100%', padding: '10px 14px 10px 36px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14px', outline: 'none' }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Section: Preços */}
                  <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 32 }}>
                    <div>
                      <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1E293B', margin: '0 0 6px' }}>Preços</h3>
                    </div>

                    <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: 18 }}>
                      <div>
                        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#334155', marginBottom: 6 }}>Preço</label>
                        <div style={{ display: 'flex', maxWidth: 280 }}>
                          <div style={{ display: 'flex', alignItems: 'center', padding: '0 12px', border: '1px solid #CBD5E1', borderRight: 'none', borderTopLeftRadius: 8, borderBottomLeftRadius: 8, background: '#F8FAFC', fontSize: 13, fontWeight: 600, color: '#64748B' }}>
                            R$
                          </div>
                          <input
                            type="number"
                            step="0.01"
                            value={editingProduct.price}
                            onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                            style={{ flex: 1, padding: '10px 14px', border: '1px solid #CBD5E1', fontSize: '14px', outline: 'none' }}
                          />
                          <select
                            value={editingProduct.currency}
                            onChange={(e) => setEditingProduct({ ...editingProduct, currency: e.target.value })}
                            style={{ padding: '0 12px', border: '1px solid #CBD5E1', borderLeft: 'none', borderTopRightRadius: 8, borderBottomRightRadius: 8, background: '#F8FAFC', fontSize: 13, fontWeight: 600, color: '#64748B', outline: 'none' }}
                          >
                            <option value="BRL">BRL</option>
                            <option value="USD">USD</option>
                            <option value="EUR">EUR</option>
                          </select>
                        </div>
                      </div>

                      <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 13.5, color: '#475569' }}>
                        <input type="checkbox" style={{ width: 16, height: 16, accentColor: '#5850EC' }} />
                        <span>Esse produto tem diferentes ofertas</span>
                      </label>
                    </div>
                  </div>

                  {/* Bottom Action Buttons */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 20, borderTop: '1px solid #E2E8F0' }}>
                    <button
                      type="button"
                      onClick={() => handleDeleteProduct(editingProduct.id)}
                      style={{
                        backgroundColor: '#DC2626', color: '#fff', border: 'none', borderRadius: '8px',
                        padding: '10px 20px', fontSize: '13.5px', fontWeight: 600, cursor: 'pointer',
                      }}
                    >
                      Excluir produto
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSaveEdit()}
                      style={{
                        backgroundColor: '#5850EC', color: '#fff', border: 'none', borderRadius: '8px',
                        padding: '10px 24px', fontSize: '13.5px', fontWeight: 600, cursor: 'pointer',
                      }}
                    >
                      Salvar produto
                    </button>
                  </div>
                </div>
              )}

              {/* Tab 2: Links */}
              {editTab === 'links' && (
                <div style={{ backgroundColor: '#fff', padding: '28px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                  <h3 style={{ fontSize: 17, fontWeight: 700, color: '#1E293B', marginBottom: 20 }}>Links do Produto</h3>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#334155', marginBottom: 6 }}>Link direto de Checkout</label>
                      <div style={{ display: 'flex', gap: 10 }}>
                        <input
                          type="text"
                          readOnly
                          value={`https://infinityondemand.com.br/checkout/${editingProduct.id}`}
                          style={{ flex: 1, padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', background: '#F8FAFC', fontSize: 13.5 }}
                        />
                        <button
                          onClick={() => handleCopyCheckout(editingProduct.id)}
                          style={{ padding: '10px 18px', borderRadius: '8px', backgroundColor: '#5850EC', color: '#fff', border: 'none', fontWeight: 600, cursor: 'pointer' }}
                        >
                          {copiedLink ? 'Copiado!' : 'Copiar link'}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#334155', marginBottom: 6 }}>Página de Vendas</label>
                      <input
                        type="text"
                        readOnly
                        value={editingProduct.sales_page_url}
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', background: '#F8FAFC', fontSize: 13.5 }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Other tabs placeholder */}
              {editTab !== 'general' && editTab !== 'links' && (
                <div style={{ backgroundColor: '#fff', padding: '36px', borderRadius: '12px', border: '1px solid #E2E8F0', textAlign: 'center' }}>
                  <div style={{ fontSize: 32, marginBottom: 10 }}>⚙️</div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1E293B', marginBottom: 6 }}>Configurações de {editTab}</h3>
                  <p style={{ fontSize: 13.5, color: '#64748B' }}>Módulo ativo e pronto para expansão de integrações e webhooks.</p>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* MODAL: CRIAR PRODUTO (Passo 1 & Passo 2 - Pixel Perfect)        */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      {createModalOpen && (
        <div style={{
          position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(4px)', zIndex: 1000,
          display: 'grid', placeItems: 'center', padding: 20,
        }}>
          <div style={{
            backgroundColor: '#fff', borderRadius: '16px', width: '100%', maxWidth: '440px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)', padding: '28px 32px',
          }}>
            
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#1E293B', margin: 0 }}>Criar produto</h2>
              <button
                onClick={() => setCreateModalOpen(false)}
                style={{ background: 'none', border: 'none', fontSize: '18px', color: '#94A3B8', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            {/* ── PASSO 1 (Matching Screenshots 2, 3, 4) ── */}
            {createStep === 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#334155', marginBottom: 6 }}>Tipo de pagamento</label>
                  <select
                    value={newProd.payment_type || 'single'}
                    onChange={(e) => setNewProd({ ...newProd, payment_type: e.target.value as any })}
                    style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13.5px', outline: 'none', background: '#fff' }}
                  >
                    <option value="single">✓ Pagamento único</option>
                    <option value="subscription">Assinatura recorrente</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#334155', marginBottom: 6 }}>Entrega do conteúdo</label>
                  <select
                    value={newProd.delivery_type || 'members_area'}
                    onChange={(e) => setNewProd({ ...newProd, delivery_type: e.target.value as any })}
                    style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13.5px', outline: 'none', background: '#fff' }}
                  >
                    <option value="members_area">✓ Área de membros da Kiwify</option>
                    <option value="external">Área de membros externa</option>
                    <option value="files">Evento presencial</option>
                    <option value="payments_only">Quero apenas receber pagamentos</option>
                  </select>
                </div>

                {newProd.delivery_type === 'members_area' && (
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#334155', marginBottom: 6 }}>Área de membros</label>
                    <select
                      value={newProd.members_area_name || 'Criar nova área de membros'}
                      onChange={(e) => setNewProd({ ...newProd, members_area_name: e.target.value })}
                      style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13.5px', outline: 'none', background: '#fff' }}
                    >
                      <option value="Criar nova área de membros">Criar nova área de membros</option>
                      <option value="NeuroDesign">NeuroDesign</option>
                    </select>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => setCreateStep(2)}
                  style={{
                    backgroundColor: '#5850EC', color: '#fff', border: 'none', borderRadius: '8px',
                    padding: '12px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', marginTop: 10,
                  }}
                >
                  Continuar →
                </button>
              </div>
            )}

            {/* ── PASSO 2 (Matching Screenshot 5) ── */}
            {createStep === 2 && (
              <form onSubmit={handleFinishCreate} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <button
                  type="button"
                  onClick={() => setCreateStep(1)}
                  style={{ background: 'none', border: 'none', color: '#4F46E5', fontSize: '13px', fontWeight: 600, textAlign: 'left', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
                >
                  ← Voltar
                </button>

                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#334155', marginBottom: 6 }}>Nome do produto</label>
                  <input
                    type="text"
                    required
                    placeholder=""
                    value={newProd.name || ''}
                    onChange={(e) => setNewProd({ ...newProd, name: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14px', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#334155', marginBottom: 6 }}>Descrição</label>
                  <textarea
                    rows={3}
                    placeholder="Explique o seu produto em pelo menos 100 caracteres"
                    value={newProd.description || ''}
                    onChange={(e) => setNewProd({ ...newProd, description: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13.5px', outline: 'none', resize: 'vertical' }}
                  />
                  <div style={{ textAlign: 'right', fontSize: 11, color: '#94A3B8', marginTop: 4 }}>
                    {(newProd.description || '').length}/500
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#334155', marginBottom: 2 }}>Página de vendas</label>
                  <p style={{ fontSize: 11.5, color: '#64748B', margin: '0 0 6px' }}>Se você não tem um site, coloque o seu perfil do Instagram</p>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: 12, top: 10, color: '#94A3B8' }}>🔗</span>
                    <input
                      type="text"
                      placeholder="https://example.com"
                      value={newProd.sales_page_url || ''}
                      onChange={(e) => setNewProd({ ...newProd, sales_page_url: e.target.value })}
                      style={{ width: '100%', padding: '10px 14px 10px 36px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13.5px', outline: 'none' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#334155', marginBottom: 6 }}>Preço</label>
                  <div style={{ display: 'flex' }}>
                    <div style={{ display: 'flex', alignItems: 'center', padding: '0 12px', border: '1px solid #CBD5E1', borderRight: 'none', borderTopLeftRadius: 8, borderBottomLeftRadius: 8, background: '#F8FAFC', fontSize: 13, fontWeight: 600, color: '#64748B' }}>
                      R$
                    </div>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={newProd.price || ''}
                      onChange={(e) => setNewProd({ ...newProd, price: Number(e.target.value) })}
                      placeholder="0,00"
                      style={{ flex: 1, padding: '10px 14px', border: '1px solid #CBD5E1', fontSize: '14px', outline: 'none' }}
                    />
                    <select
                      value={newProd.currency || 'BRL'}
                      onChange={(e) => setNewProd({ ...newProd, currency: e.target.value })}
                      style={{ padding: '0 12px', border: '1px solid #CBD5E1', borderLeft: 'none', borderTopRightRadius: 8, borderBottomRightRadius: 8, background: '#F8FAFC', fontSize: 13, fontWeight: 600, color: '#64748B', outline: 'none' }}
                    >
                      <option value="BRL">BRL</option>
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  style={{
                    backgroundColor: '#5850EC', color: '#fff', border: 'none', borderRadius: '8px',
                    padding: '12px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', marginTop: 10,
                  }}
                >
                  Criar produto
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
