'use client';

import { useState, useEffect, useCallback } from 'react';

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  status: string;
  views: number;
  published_at: string;
  created_at: string;
  cover_url: string;
  blog_categories: { name: string; color: string; text_color: string } | null;
}

interface Comment {
  id: string;
  author_name: string;
  author_email: string;
  content: string;
  approved: boolean;
  created_at: string;
  blog_posts: { title: string; slug: string } | null;
}

interface Subscriber {
  id: string;
  email: string;
  name: string;
  subscribed: boolean;
  created_at: string;
}

type Tab = 'posts' | 'comments' | 'subscribers';

export default function AdminBlogPage() {
  const [tab, setTab] = useState<Tab>('posts');
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [totalSubs, setTotalSubs] = useState(0);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ admin: 'true', limit: '50' });
    if (statusFilter) params.set('status', statusFilter);
    const res = await fetch(`${baseUrl}/api/blog/posts?${params}`);
    const data = await res.json();
    setPosts(data.posts || []);
    setLoading(false);
  }, [baseUrl, statusFilter]);

  const fetchComments = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`${baseUrl}/api/blog/comments?admin=true`);
    const data = await res.json();
    setComments(data || []);
    setLoading(false);
  }, [baseUrl]);

  const fetchSubscribers = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`${baseUrl}/api/blog/subscribers`);
    const data = await res.json();
    setSubscribers(data.subscribers || []);
    setTotalSubs(data.total || 0);
    setLoading(false);
  }, [baseUrl]);

  useEffect(() => {
    if (tab === 'posts') fetchPosts();
    else if (tab === 'comments') fetchComments();
    else if (tab === 'subscribers') fetchSubscribers();
  }, [tab, fetchPosts, fetchComments, fetchSubscribers]);

  const deletePost = async (id: string) => {
    if (!confirm('Deletar este post?')) return;
    await fetch(`${baseUrl}/api/blog/posts?id=${id}`, { method: 'DELETE' });
    fetchPosts();
  };

  const toggleComment = async (id: string, approved: boolean) => {
    await fetch(`${baseUrl}/api/blog/comments`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, approved: !approved }),
    });
    fetchComments();
  };

  const deleteComment = async (id: string) => {
    if (!confirm('Deletar este comentário?')) return;
    await fetch(`${baseUrl}/api/blog/comments?id=${id}`, { method: 'DELETE' });
    fetchComments();
  };

  const deleteSub = async (id: string) => {
    if (!confirm('Remover este assinante?')) return;
    await fetch(`${baseUrl}/api/blog/subscribers?id=${id}`, { method: 'DELETE' });
    fetchSubscribers();
  };

  const statusColor = (s: string) => {
    if (s === 'published') return '#00DF81';
    if (s === 'draft') return '#888';
    return '#ffbc00';
  };

  const styles = {
    page: { minHeight: '100vh', backgroundColor: '#0B0F19', color: '#fff', fontFamily: "'Inter', sans-serif" } as React.CSSProperties,
    header: { padding: '24px 32px', borderBottom: '1px solid #1a1f2e', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' as const, gap: '16px' } as React.CSSProperties,
    tabs: { display: 'flex', gap: '8px' } as React.CSSProperties,
    tab: (active: boolean) => ({ padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: 600, backgroundColor: active ? '#00DF81' : '#1a1f2e', color: active ? '#000' : '#aaa', transition: 'all 0.2s' }) as React.CSSProperties,
    btn: { padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: 600, background: 'linear-gradient(135deg, #00DF81, #00AAFF)', color: '#000', textDecoration: 'none' } as React.CSSProperties,
    btnDanger: { padding: '6px 12px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 600, backgroundColor: '#ef4444', color: '#fff' } as React.CSSProperties,
    btnSmall: { padding: '6px 12px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 600, backgroundColor: '#1a1f2e', color: '#aaa' } as React.CSSProperties,
    table: { width: '100%', borderCollapse: 'collapse' as const } as React.CSSProperties,
    th: { padding: '12px 16px', textAlign: 'left' as const, fontSize: '12px', fontWeight: 600, color: '#888', textTransform: 'uppercase' as const, letterSpacing: '0.5px', borderBottom: '1px solid #1a1f2e' } as React.CSSProperties,
    td: { padding: '14px 16px', borderBottom: '1px solid #111827', fontSize: '14px', verticalAlign: 'middle' as const } as React.CSSProperties,
    badge: (color: string, bg: string) => ({ padding: '4px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: 700, backgroundColor: bg, color, display: 'inline-block' }) as React.CSSProperties,
    content: { padding: '32px' } as React.CSSProperties,
    filterRow: { display: 'flex', gap: '8px', marginBottom: '24px', alignItems: 'center', flexWrap: 'wrap' as const } as React.CSSProperties,
    select: { padding: '8px 12px', borderRadius: '8px', border: '1px solid #1a1f2e', backgroundColor: '#111827', color: '#fff', fontSize: '14px' } as React.CSSProperties,
    stat: { padding: '20px 24px', backgroundColor: '#111827', borderRadius: '12px', border: '1px solid #1a1f2e', flex: '1 1 150px' } as React.CSSProperties,
    statsRow: { display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' as const } as React.CSSProperties,
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, margin: 0 }}>📝 Blog Admin</h1>
          <p style={{ fontSize: '14px', color: '#888', margin: '4px 0 0' }}>Gerencie posts, comentários e assinantes</p>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={styles.tabs}>
            <button style={styles.tab(tab === 'posts')} onClick={() => setTab('posts')}>Posts</button>
            <button style={styles.tab(tab === 'comments')} onClick={() => setTab('comments')}>Comentários</button>
            <button style={styles.tab(tab === 'subscribers')} onClick={() => setTab('subscribers')}>Assinantes</button>
          </div>
          {tab === 'posts' && (
            <a href="/admin/blog/editor" style={styles.btn}>+ Novo Post</a>
          )}
        </div>
      </div>

      <div style={styles.content}>
        {/* Stats */}
        {tab === 'posts' && (
          <div style={styles.statsRow}>
            <div style={styles.stat}>
              <div style={{ fontSize: '28px', fontWeight: 700, color: '#00DF81' }}>{posts.length}</div>
              <div style={{ fontSize: '13px', color: '#888' }}>Total Posts</div>
            </div>
            <div style={styles.stat}>
              <div style={{ fontSize: '28px', fontWeight: 700, color: '#00AAFF' }}>{posts.filter(p => p.status === 'published').length}</div>
              <div style={{ fontSize: '13px', color: '#888' }}>Publicados</div>
            </div>
            <div style={styles.stat}>
              <div style={{ fontSize: '28px', fontWeight: 700, color: '#888' }}>{posts.filter(p => p.status === 'draft').length}</div>
              <div style={{ fontSize: '13px', color: '#888' }}>Rascunhos</div>
            </div>
            <div style={styles.stat}>
              <div style={{ fontSize: '28px', fontWeight: 700, color: '#ffbc00' }}>{posts.reduce((a, p) => a + (p.views || 0), 0)}</div>
              <div style={{ fontSize: '13px', color: '#888' }}>Total Views</div>
            </div>
          </div>
        )}

        {/* Posts Tab */}
        {tab === 'posts' && (
          <>
            <div style={styles.filterRow}>
              <select style={styles.select} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                <option value="">Todos os status</option>
                <option value="published">Publicados</option>
                <option value="draft">Rascunhos</option>
                <option value="scheduled">Agendados</option>
              </select>
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '60px', color: '#888' }}>Carregando...</div>
            ) : posts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📝</div>
                <h3 style={{ fontSize: '18px', color: '#888' }}>Nenhum post ainda</h3>
                <a href="/admin/blog/editor" style={{ ...styles.btn, display: 'inline-block', marginTop: '16px' }}>Criar primeiro post</a>
              </div>
            ) : (
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Post</th>
                    <th style={styles.th}>Categoria</th>
                    <th style={styles.th}>Status</th>
                    <th style={styles.th}>Views</th>
                    <th style={styles.th}>Data</th>
                    <th style={styles.th}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map(post => (
                    <tr key={post.id} style={{ transition: 'background 0.2s' }} onMouseOver={e => (e.currentTarget.style.backgroundColor = '#111827')} onMouseOut={e => (e.currentTarget.style.backgroundColor = 'transparent')}>
                      <td style={styles.td}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          {post.cover_url && (
                            <img src={post.cover_url} alt="" style={{ width: 48, height: 32, borderRadius: 6, objectFit: 'cover' }} />
                          )}
                          <div>
                            <div style={{ fontWeight: 600, marginBottom: 2 }}>{post.title}</div>
                            <div style={{ fontSize: '12px', color: '#888' }}>/blog/{post.slug}</div>
                          </div>
                        </div>
                      </td>
                      <td style={styles.td}>
                        {post.blog_categories && (
                          <span style={styles.badge(post.blog_categories.text_color, post.blog_categories.color)}>
                            {post.blog_categories.name}
                          </span>
                        )}
                      </td>
                      <td style={styles.td}>
                        <span style={{ color: statusColor(post.status), fontWeight: 600, fontSize: '13px' }}>
                          ● {post.status === 'published' ? 'Publicado' : post.status === 'draft' ? 'Rascunho' : 'Agendado'}
                        </span>
                      </td>
                      <td style={styles.td}>{post.views || 0}</td>
                      <td style={styles.td}>
                        <span style={{ fontSize: '13px', color: '#888' }}>
                          {new Date(post.published_at || post.created_at).toLocaleDateString('pt-BR')}
                        </span>
                      </td>
                      <td style={styles.td}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <a href={`/admin/blog/editor?id=${post.id}`} style={{ ...styles.btnSmall, color: '#00DF81' }}>Editar</a>
                          <a href={`/blog/${post.slug}`} target="_blank" style={{ ...styles.btnSmall, color: '#00AAFF' }}>Ver</a>
                          <button style={styles.btnDanger} onClick={() => deletePost(post.id)}>🗑</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        )}

        {/* Comments Tab */}
        {tab === 'comments' && (
          <>
            <div style={styles.statsRow}>
              <div style={styles.stat}>
                <div style={{ fontSize: '28px', fontWeight: 700, color: '#00DF81' }}>{comments.filter(c => c.approved).length}</div>
                <div style={{ fontSize: '13px', color: '#888' }}>Aprovados</div>
              </div>
              <div style={styles.stat}>
                <div style={{ fontSize: '28px', fontWeight: 700, color: '#ffbc00' }}>{comments.filter(c => !c.approved).length}</div>
                <div style={{ fontSize: '13px', color: '#888' }}>Pendentes</div>
              </div>
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '60px', color: '#888' }}>Carregando...</div>
            ) : comments.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px', color: '#888' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>💬</div>
                <h3>Nenhum comentário ainda</h3>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {comments.map(c => (
                  <div key={c.id} style={{ backgroundColor: '#111827', borderRadius: '12px', padding: '20px', border: `1px solid ${c.approved ? '#1a2e1a' : '#2e2a1a'}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', flexWrap: 'wrap' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                          <strong>{c.author_name}</strong>
                          <span style={{ fontSize: '12px', color: '#888' }}>{c.author_email}</span>
                          <span style={{ ...styles.badge(c.approved ? '#000' : '#000', c.approved ? '#00DF81' : '#ffbc00') }}>
                            {c.approved ? 'Aprovado' : 'Pendente'}
                          </span>
                        </div>
                        <p style={{ margin: '0 0 8px', color: '#ccc', lineHeight: 1.5 }}>{c.content}</p>
                        <div style={{ fontSize: '12px', color: '#888' }}>
                          {c.blog_posts && <span>Em: {c.blog_posts.title}</span>}
                          <span> • {new Date(c.created_at).toLocaleDateString('pt-BR')}</span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button style={{ ...styles.btnSmall, color: c.approved ? '#ffbc00' : '#00DF81' }} onClick={() => toggleComment(c.id, c.approved)}>
                          {c.approved ? 'Desaprovar' : '✓ Aprovar'}
                        </button>
                        <button style={styles.btnDanger} onClick={() => deleteComment(c.id)}>🗑</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Subscribers Tab */}
        {tab === 'subscribers' && (
          <>
            <div style={styles.statsRow}>
              <div style={styles.stat}>
                <div style={{ fontSize: '28px', fontWeight: 700, color: '#00DF81' }}>{totalSubs}</div>
                <div style={{ fontSize: '13px', color: '#888' }}>Total Assinantes</div>
              </div>
              <div style={styles.stat}>
                <div style={{ fontSize: '28px', fontWeight: 700, color: '#00AAFF' }}>{subscribers.filter(s => s.subscribed).length}</div>
                <div style={{ fontSize: '13px', color: '#888' }}>Ativos</div>
              </div>
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '60px', color: '#888' }}>Carregando...</div>
            ) : subscribers.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px', color: '#888' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📧</div>
                <h3>Nenhum assinante ainda</h3>
              </div>
            ) : (
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Email</th>
                    <th style={styles.th}>Nome</th>
                    <th style={styles.th}>Status</th>
                    <th style={styles.th}>Data</th>
                    <th style={styles.th}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {subscribers.map(sub => (
                    <tr key={sub.id}>
                      <td style={styles.td}>{sub.email}</td>
                      <td style={styles.td}>{sub.name || '—'}</td>
                      <td style={styles.td}>
                        <span style={{ color: sub.subscribed ? '#00DF81' : '#888', fontWeight: 600, fontSize: '13px' }}>
                          ● {sub.subscribed ? 'Ativo' : 'Cancelado'}
                        </span>
                      </td>
                      <td style={styles.td}>
                        <span style={{ fontSize: '13px', color: '#888' }}>
                          {new Date(sub.created_at).toLocaleDateString('pt-BR')}
                        </span>
                      </td>
                      <td style={styles.td}>
                        <button style={styles.btnDanger} onClick={() => deleteSub(sub.id)}>Remover</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        )}
      </div>
    </div>
  );
}
