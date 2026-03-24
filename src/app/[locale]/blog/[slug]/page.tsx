'use client';

import { useState, useEffect, useMemo, use } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const postDict: Record<string, Record<string, string>> = {
  pt: {
    home: 'Home', blog: 'Blog', readTime: 'min de leitura', views: 'views',
    share: 'Compartilhar:', comments: '💬 Comentários',
    commentName: 'Seu nome *', commentEmail: 'Email (opcional)',
    commentText: 'Escreva seu comentário...', commentBtn: 'Enviar Comentário',
    commentSuccess: 'Comentário enviado! Será publicado após aprovação.',
    ctaTitle: 'Pronto para', ctaAccent: 'escalar', ctaQ: '?',
    ctaDesc: 'Fale com nossos consultores e descubra como podemos transformar seu negócio.',
    ctaBtn: 'Falar com especialista →',
    notFound: 'Post não encontrado', back: '← Voltar ao Blog', loading: 'Carregando...',
  },
  es: {
    home: 'Inicio', blog: 'Blog', readTime: 'min de lectura', views: 'vistas',
    share: 'Compartir:', comments: '💬 Comentarios',
    commentName: 'Tu nombre *', commentEmail: 'Email (opcional)',
    commentText: 'Escribe tu comentario...', commentBtn: 'Enviar Comentario',
    commentSuccess: '¡Comentario enviado! Será publicado tras aprobación.',
    ctaTitle: '¿Listo para', ctaAccent: 'escalar', ctaQ: '?',
    ctaDesc: 'Habla con nuestros consultores y descubre cómo podemos transformar tu negocio.',
    ctaBtn: 'Hablar con especialista →',
    notFound: 'Artículo no encontrado', back: '← Volver al Blog', loading: 'Cargando...',
  },
};

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_url: string;
  reading_time: number;
  views: number;
  published_at: string;
  author_name: string;
  author_avatar: string;
  tags: string[];
  meta_title: string;
  meta_description: string;
  blog_categories: { name: string; slug: string; color: string; text_color: string } | null;
}

export default function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [commentName, setCommentName] = useState('');
  const [commentEmail, setCommentEmail] = useState('');
  const [commentText, setCommentText] = useState('');
  const [commentSent, setCommentSent] = useState(false);
  const [comments, setComments] = useState<Array<{ id: string; author_name: string; content: string; created_at: string }>>([]);

  const locale = useMemo(() => {
    if (typeof window === 'undefined') return 'pt';
    const path = window.location.pathname;
    if (path.startsWith('/es')) return 'es';
    return 'pt';
  }, []);

  const t = postDict[locale] || postDict.pt;
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const dateLocale = locale === 'es' ? 'es-ES' : 'pt-BR';

  useEffect(() => {
    if (!slug) return;
    fetch(`${baseUrl}/api/blog/posts?slug=${slug}`)
      .then(r => r.json())
      .then(data => {
        if (data.error) { setPost(null); }
        else {
          // Fix corrupted content: if content is JSON string, extract only HTML
          if (data.content && typeof data.content === 'string') {
            const trimmed = data.content.trim();
            if (trimmed.startsWith('{') || trimmed.startsWith('"')) {
              try {
                const parsed = JSON.parse(trimmed.startsWith('"') ? trimmed : trimmed);
                if (typeof parsed === 'object' && parsed.content) {
                  data.content = parsed.content;
                  if (parsed.title && !data.title) data.title = parsed.title;
                  if (parsed.excerpt && !data.excerpt) data.excerpt = parsed.excerpt;
                }
              } catch {
                // Not valid JSON, keep as-is
              }
            }
          }
          setPost(data);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));

    fetch(`${baseUrl}/api/blog/comments?post_id=placeholder`).catch(() => {});
  }, [slug, baseUrl]);

  useEffect(() => {
    if (!post) return;
    fetch(`${baseUrl}/api/blog/comments?post_id=${post.id}`)
      .then(r => r.json())
      .then(data => setComments(data || []))
      .catch(() => {});
  }, [post, baseUrl]);

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!post || !commentName || !commentText) return;
    await fetch(`${baseUrl}/api/blog/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ post_id: post.id, author_name: commentName, author_email: commentEmail, content: commentText }),
    });
    setCommentSent(true);
    setCommentName('');
    setCommentEmail('');
    setCommentText('');
  };

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareText = post?.title || '';
  const formatDate = (d: string) => new Date(d).toLocaleDateString(dateLocale, { day: '2-digit', month: 'long', year: 'numeric' });

  if (loading) {
    return (
      <main style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
          <div className="animate-float" style={{ fontSize: '48px' }}>📝</div>
          <p>{t.loading}</p>
        </div>
      </main>
    );
  }

  if (!post) {
    return (
      <main style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>📭</div>
          <h1 style={{ fontSize: '32px', marginBottom: '16px' }}>{t.notFound}</h1>
          <a href="/blog" className="btn-primary" style={{ display: 'inline-block', padding: '14px 28px' }}>{t.back}</a>
        </div>
      </main>
    );
  }

  const inputCss: React.CSSProperties = { width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid var(--bg-tertiary)', backgroundColor: 'var(--bg-secondary)', color: '#fff', fontSize: '15px', outline: 'none', fontFamily: 'inherit' };

  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-primary)' }}>
      <Header dict={{}} locale={locale} />

      {/* Cover */}
      {post.cover_url && (
        <div style={{ width: '100%', maxHeight: '500px', overflow: 'hidden', position: 'relative' }}>
          <img src={post.cover_url} alt={post.title} style={{ width: '100%', height: '500px', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, var(--bg-primary) 0%, transparent 60%)' }}></div>
        </div>
      )}

      {/* Article */}
      <article style={{ maxWidth: '800px', width: '100%', margin: '0 auto', padding: `${post.cover_url ? '0' : '120px'} clamp(16px, 4vw, 48px) 60px`, position: 'relative', zIndex: 2 }}>
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '24px', marginTop: post.cover_url ? '-40px' : '0' }}>
          <a href="/" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>{t.home}</a>
          <span>›</span>
          <a href="/blog" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>{t.blog}</a>
          <span>›</span>
          <span style={{ color: 'var(--text-primary)' }}>{post.title}</span>
        </div>

        {/* Category */}
        {post.blog_categories && (
          <a href={`/blog?category=${post.blog_categories.slug}`} style={{ display: 'inline-block', padding: '6px 14px', backgroundColor: post.blog_categories.color, borderRadius: '6px', fontSize: '12px', fontWeight: 700, color: post.blog_categories.text_color, letterSpacing: '0.5px', textTransform: 'uppercase', textDecoration: 'none', marginBottom: '20px' }}>
            {post.blog_categories.name}
          </a>
        )}

        {/* Title */}
        <h1 style={{ fontSize: 'clamp(28px, 5vw, 44px)', fontWeight: 800, letterSpacing: '-1px', lineHeight: 1.2, marginBottom: '20px', color: 'var(--text-primary)' }}>
          {post.title}
        </h1>

        {/* Meta */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '40px', flexWrap: 'wrap', color: 'var(--text-secondary)', fontSize: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img src={post.author_avatar || '/infinity_logo.png'} alt={post.author_name} style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }} />
            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{post.author_name}</span>
          </div>
          <span>•</span>
          <span>{formatDate(post.published_at)}</span>
          <span>•</span>
          <span>{post.reading_time || 5} {t.readTime}</span>
          <span>•</span>
          <span>{post.views || 0} {t.views}</span>
        </div>

        {/* Content */}
        <div
          className="blog-post-content"
          dangerouslySetInnerHTML={{ __html: post.content }}
          style={{ fontSize: '17px', lineHeight: 1.85, color: '#d0d0d0' }}
        />

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '48px', paddingTop: '24px', borderTop: '1px solid var(--bg-tertiary)' }}>
            {post.tags.map((tag, i) => (
              <span key={i} style={{ padding: '6px 14px', borderRadius: '20px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--bg-tertiary)', fontSize: '13px', color: 'var(--text-secondary)' }}>
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Share */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '32px', alignItems: 'center' }}>
          <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-secondary)' }}>{t.share}</span>
          <a href={`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`} target="_blank" rel="noopener noreferrer" style={{ width: 40, height: 40, borderRadius: '10px', backgroundColor: '#25D366', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', textDecoration: 'none', fontSize: '18px' }}>💬</a>
          <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" style={{ width: 40, height: 40, borderRadius: '10px', backgroundColor: '#0077b5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', textDecoration: 'none', fontSize: '18px' }}>in</a>
          <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" style={{ width: 40, height: 40, borderRadius: '10px', backgroundColor: '#1DA1F2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', textDecoration: 'none', fontSize: '18px' }}>𝕏</a>
        </div>

        {/* Comments */}
        <div style={{ marginTop: '64px', paddingTop: '40px', borderTop: '1px solid var(--bg-tertiary)' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '32px' }}>
            {t.comments} {comments.length > 0 && <span style={{ fontSize: '16px', color: 'var(--text-secondary)' }}>({comments.length})</span>}
          </h2>

          {comments.map(c => (
            <div key={c.id} style={{ backgroundColor: 'var(--bg-secondary)', borderRadius: '12px', padding: '20px', marginBottom: '16px', border: '1px solid var(--bg-tertiary)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <strong style={{ color: 'var(--accent-primary)' }}>{c.author_name}</strong>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{formatDate(c.created_at)}</span>
              </div>
              <p style={{ margin: 0, color: '#ccc', lineHeight: 1.6 }}>{c.content}</p>
            </div>
          ))}

          {commentSent ? (
            <div style={{ textAlign: 'center', padding: '32px', backgroundColor: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--bg-tertiary)' }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>✅</div>
              <p style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>{t.commentSuccess}</p>
            </div>
          ) : (
            <form onSubmit={handleComment} style={{ display: 'flex', flexDirection: 'column', gap: '16px', backgroundColor: 'var(--bg-secondary)', borderRadius: '16px', padding: '24px', border: '1px solid var(--bg-tertiary)' }}>
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <input type="text" value={commentName} onChange={e => setCommentName(e.target.value)} placeholder={t.commentName} required style={{ ...inputCss, flex: '1 1 200px' }} />
                <input type="email" value={commentEmail} onChange={e => setCommentEmail(e.target.value)} placeholder={t.commentEmail} style={{ ...inputCss, flex: '1 1 200px' }} />
              </div>
              <textarea value={commentText} onChange={e => setCommentText(e.target.value)} placeholder={t.commentText} required rows={4} style={{ ...inputCss, resize: 'vertical' }} />
              <button type="submit" className="btn-primary" style={{ padding: '14px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontSize: '15px', fontWeight: 600, alignSelf: 'flex-start' }}>
                {t.commentBtn}
              </button>
            </form>
          )}
        </div>
      </article>

      {/* CTA */}
      <section style={{ padding: '60px clamp(16px, 4vw, 48px)', backgroundColor: 'var(--bg-secondary)', borderTop: '1px solid var(--bg-tertiary)', textAlign: 'center' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '16px' }}>{t.ctaTitle} <span className="text-gradient">{t.ctaAccent}</span>{t.ctaQ}</h2>
        <p className="text-secondary" style={{ marginBottom: '24px' }}>{t.ctaDesc}</p>
        <a href="/#contact" className="btn-primary" style={{ display: 'inline-block', padding: '16px 32px', fontSize: '16px' }}>{t.ctaBtn}</a>
      </section>

      <Footer dict={{}} locale={locale} />

      <style>{`
        .blog-post-content h2 { font-size: 28px; font-weight: 700; margin: 40px 0 16px; color: #fff; letter-spacing: -0.5px; }
        .blog-post-content h3 { font-size: 22px; font-weight: 600; margin: 32px 0 12px; color: #e0e0e0; }
        .blog-post-content p { margin: 0 0 20px; }
        .blog-post-content ul, .blog-post-content ol { padding-left: 24px; margin: 0 0 20px; }
        .blog-post-content li { margin: 6px 0; }
        .blog-post-content blockquote { border-left: 4px solid #00DF81; padding: 16px 20px; margin: 24px 0; background: rgba(0,223,129,0.05); border-radius: 0 8px 8px 0; color: #aaa; font-style: italic; }
        .blog-post-content pre { background: #111827; border-radius: 10px; padding: 20px; overflow-x: auto; margin: 24px 0; border: 1px solid #1a1f2e; }
        .blog-post-content code { background: #111827; padding: 2px 8px; border-radius: 4px; font-size: 15px; color: #00DF81; }
        .blog-post-content img { max-width: 100%; border-radius: 12px; margin: 24px 0; }
        .blog-post-content a { color: #00AAFF; text-decoration: underline; }
        .blog-post-content strong { color: #fff; }
      `}</style>
    </main>
  );
}
