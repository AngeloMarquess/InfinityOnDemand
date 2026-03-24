'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  cover_url: string;
  reading_time: number;
  published_at: string;
  blog_categories: { name: string; slug: string; color: string; text_color: string } | null;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  color: string;
}

export default function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [subEmail, setSubEmail] = useState('');
  const [subSuccess, setSubSuccess] = useState(false);

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';

  useEffect(() => {
    fetch(`${baseUrl}/api/blog/categories`)
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setCategories(data); })
      .catch(() => {});
  }, [baseUrl]);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: '9' });
    if (activeCategory) params.set('category', activeCategory);
    if (search) params.set('search', search);

    fetch(`${baseUrl}/api/blog/posts?${params}`)
      .then(r => r.json())
      .then(data => {
        setPosts(Array.isArray(data.posts) ? data.posts : []);
        setTotalPages(data.totalPages || 1);
        setLoading(false);
      })
      .catch(() => { setPosts([]); setLoading(false); });
  }, [page, activeCategory, search, baseUrl]);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subEmail) return;
    await fetch(`${baseUrl}/api/blog/subscribers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: subEmail }),
    });
    setSubSuccess(true);
    setSubEmail('');
    setTimeout(() => setSubSuccess(false), 5000);
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-primary)' }}>
      <Header dict={{}} locale="pt" />

      {/* Hero */}
      <section style={{ padding: 'clamp(80px, 10vw, 120px) clamp(16px, 4vw, 48px) 60px', textAlign: 'center' }}>
        <div style={{ display: 'inline-block', padding: '6px 16px', backgroundColor: 'var(--bg-secondary)', color: 'var(--accent-primary)', borderRadius: '20px', fontSize: '13px', fontWeight: 600, marginBottom: '24px', border: '1px solid var(--bg-tertiary)', letterSpacing: '1px', textTransform: 'uppercase' }}>BLOG</div>
        <h1 style={{ fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 800, letterSpacing: '-1.5px', marginBottom: '16px' }}>
          Insights do <span className="text-gradient">Infinity Blog</span>
        </h1>
        <p className="text-secondary" style={{ fontSize: '18px', maxWidth: '600px', margin: '0 auto 40px' }}>
          Artigos, guias e novidades sobre tecnologia, e-commerce e inovação.
        </p>

        {/* Search + Filters */}
        <div style={{ maxWidth: '700px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
          <div style={{ position: 'relative', width: '100%', maxWidth: '500px' }}>
            <input
              type="text"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="🔍 Buscar artigos..."
              style={{ width: '100%', padding: '14px 20px', borderRadius: '12px', border: '1px solid var(--bg-tertiary)', backgroundColor: 'var(--bg-secondary)', color: '#fff', fontSize: '16px', outline: 'none' }}
            />
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button
              onClick={() => { setActiveCategory(''); setPage(1); }}
              style={{ padding: '8px 16px', borderRadius: '20px', border: `1px solid ${!activeCategory ? 'var(--accent-primary)' : 'var(--bg-tertiary)'}`, backgroundColor: !activeCategory ? 'var(--accent-light)' : 'transparent', color: !activeCategory ? 'var(--accent-primary)' : 'var(--text-secondary)', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}
            >
              Todos
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => { setActiveCategory(cat.slug); setPage(1); }}
                style={{ padding: '8px 16px', borderRadius: '20px', border: `1px solid ${activeCategory === cat.slug ? cat.color : 'var(--bg-tertiary)'}`, backgroundColor: activeCategory === cat.slug ? cat.color : 'transparent', color: activeCategory === cat.slug ? '#000' : 'var(--text-secondary)', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Posts Grid */}
      <section style={{ padding: '0 clamp(16px, 4vw, 48px) 80px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-secondary)' }}>
            <div className="animate-float" style={{ fontSize: '40px' }}>📝</div>
            <p>Carregando artigos...</p>
          </div>
        ) : posts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-secondary)' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📭</div>
            <h3>Nenhum artigo encontrado</h3>
            <p>Tente outra busca ou categoria.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(340px, 100%), 1fr))', gap: '32px' }}>
            {posts.map(post => (
              <a
                key={post.id}
                href={`/blog/${post.slug}`}
                style={{ textDecoration: 'none', color: 'inherit', borderRadius: '20px', overflow: 'hidden', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--bg-tertiary)', transition: 'transform 0.3s ease, box-shadow 0.3s ease', display: 'flex', flexDirection: 'column' }}
                onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 16px 48px rgba(0,223,129,0.1)'; }}
                onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <div style={{ height: '220px', overflow: 'hidden', position: 'relative' }}>
                  <img src={post.cover_url || '/blog_ai.png'} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} />
                  {post.blog_categories && (
                    <div style={{ position: 'absolute', top: '16px', left: '16px', padding: '6px 12px', backgroundColor: post.blog_categories.color, borderRadius: '6px', fontSize: '11px', fontWeight: 700, color: post.blog_categories.text_color, letterSpacing: '0.5px', textTransform: 'uppercase' }}>{post.blog_categories.name}</div>
                  )}
                </div>
                <div style={{ padding: '28px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div className="text-secondary" style={{ fontSize: '13px', marginBottom: '12px' }}>
                    {formatDate(post.published_at)} • {post.reading_time || 5} min de leitura
                  </div>
                  <h3 style={{ fontSize: '20px', fontWeight: 700, lineHeight: 1.4, marginBottom: '12px' }}>{post.title}</h3>
                  <p className="text-secondary" style={{ fontSize: '14px', lineHeight: 1.6, flex: 1 }}>{post.excerpt}</p>
                  <div style={{ marginTop: '20px', fontSize: '14px', fontWeight: 600, color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    Ler artigo <span>→</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '48px' }}>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                onClick={() => setPage(p)}
                style={{ width: 40, height: 40, borderRadius: '10px', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: 600, backgroundColor: p === page ? 'var(--accent-primary)' : 'var(--bg-secondary)', color: p === page ? '#000' : 'var(--text-secondary)' }}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Newsletter */}
      <section style={{ padding: '80px clamp(16px, 4vw, 48px)', backgroundColor: 'var(--bg-secondary)', borderTop: '1px solid var(--bg-tertiary)', textAlign: 'center' }}>
        <h2 style={{ fontSize: 'clamp(24px, 4vw, 32px)', fontWeight: 700, marginBottom: '12px' }}>
          Receba nossos <span className="text-gradient">Insights</span>
        </h2>
        <p className="text-secondary" style={{ maxWidth: '500px', margin: '0 auto 32px' }}>
          Assine nossa newsletter e receba os melhores artigos sobre tecnologia e inovação.
        </p>
        {subSuccess ? (
          <div style={{ color: 'var(--accent-primary)', fontSize: '18px', fontWeight: 600 }}>✅ Inscrito com sucesso!</div>
        ) : (
          <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: '12px', maxWidth: '460px', margin: '0 auto', flexWrap: 'wrap', justifyContent: 'center' }}>
            <input
              type="email"
              value={subEmail}
              onChange={e => setSubEmail(e.target.value)}
              placeholder="seu@email.com"
              required
              style={{ flex: '1 1 250px', padding: '14px 20px', borderRadius: '12px', border: '1px solid var(--bg-tertiary)', backgroundColor: 'var(--bg-primary)', color: '#fff', fontSize: '16px', outline: 'none' }}
            />
            <button type="submit" className="btn-primary" style={{ padding: '14px 28px', fontSize: '16px', borderRadius: '12px', border: 'none', cursor: 'pointer' }}>
              Assinar →
            </button>
          </form>
        )}
      </section>

      <Footer dict={{}} locale="pt" />
    </main>
  );
}
