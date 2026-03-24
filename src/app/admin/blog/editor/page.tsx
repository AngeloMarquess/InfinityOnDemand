'use client';

import { useState, useEffect, useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';

interface Category {
  id: string;
  name: string;
  slug: string;
  color: string;
}

export default function BlogEditorPage() {
  const [postId, setPostId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [tags, setTags] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [status, setStatus] = useState('draft');
  const [categories, setCategories] = useState<Category[]>([]);
  const [saving, setSaving] = useState(false);
  const [aiLoading, setAiLoading] = useState('');
  const [aiTopic, setAiTopic] = useState('');
  const [showAiPanel, setShowAiPanel] = useState(false);
  const [message, setMessage] = useState('');

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: 'Comece a escrever seu artigo...' }),
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Highlight,
    ],
    content: '',
    editorProps: {
      attributes: {
        class: 'blog-editor-content',
        style: 'min-height: 400px; outline: none; padding: 24px; color: #e0e0e0; font-size: 16px; line-height: 1.8;',
      },
    },
  });

  // Load categories
  useEffect(() => {
    fetch(`${baseUrl}/api/blog/categories`).then(r => r.json()).then(setCategories).catch(() => {});
  }, [baseUrl]);

  // Load existing post if editing
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    if (id) {
      setPostId(id);
      fetch(`${baseUrl}/api/blog/posts?admin=true&limit=100`)
        .then(r => r.json())
        .then(data => {
          const post = data.posts?.find((p: { id: string }) => p.id === id);
          if (post) {
            setTitle(post.title);
            setSlug(post.slug);
            setExcerpt(post.excerpt || '');
            setCoverUrl(post.cover_url || '');
            setCategoryId(post.category_id || '');
            setTags((post.tags || []).join(', '));
            setMetaTitle(post.meta_title || '');
            setMetaDescription(post.meta_description || '');
            setStatus(post.status);
            // Load full content
            fetch(`${baseUrl}/api/blog/posts?slug=${post.slug}`)
              .then(r => r.json())
              .then(full => {
                if (full.content && editor) {
                  editor.commands.setContent(full.content);
                }
              });
          }
        });
    }
  }, [baseUrl, editor]);

  const generateSlug = (text: string) => {
    return text.toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!postId) setSlug(generateSlug(val));
  };

  const savePost = useCallback(async (publishStatus?: string) => {
    if (!title) {
      setMessage('❌ Título é obrigatório');
      return;
    }

    setSaving(true);
    const body = {
      ...(postId ? { id: postId } : {}),
      title,
      slug: slug || generateSlug(title),
      excerpt,
      content: editor?.getHTML() || '',
      cover_url: coverUrl,
      category_id: categoryId || null,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      meta_title: metaTitle || title,
      meta_description: metaDescription || excerpt,
      status: publishStatus || status,
    };

    try {
      const res = await fetch(`${baseUrl}/api/blog/posts`, {
        method: postId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (res.ok) {
        if (!postId && data.id) {
          setPostId(data.id);
          window.history.replaceState({}, '', `?id=${data.id}`);
        }
        setMessage(publishStatus === 'published' ? '✅ Post publicado!' : '✅ Salvo!');
      } else {
        setMessage(`❌ ${data.error}`);
      }
    } catch {
      setMessage('❌ Erro ao salvar');
    }
    setSaving(false);
    setTimeout(() => setMessage(''), 3000);
  }, [title, slug, excerpt, editor, coverUrl, categoryId, tags, metaTitle, metaDescription, status, postId, baseUrl]);

  // AI functions
  const aiGenerateDraft = async () => {
    if (!aiTopic) return;
    setAiLoading('draft');
    try {
      const res = await fetch(`${baseUrl}/api/blog/ai`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'generate-draft', topic: aiTopic }),
      });
      const data = await res.json();
      if (data.title) setTitle(data.title);
      if (data.slug) setSlug(data.slug);
      if (data.excerpt) setExcerpt(data.excerpt);
      if (data.content) editor?.commands.setContent(data.content);
      if (data.meta_title) setMetaTitle(data.meta_title);
      if (data.meta_description) setMetaDescription(data.meta_description);
      if (data.tags) setTags(data.tags.join(', '));
      if (data.suggested_category) {
        const cat = categories.find(c => c.slug === data.suggested_category);
        if (cat) setCategoryId(cat.id);
      }
      setMessage('🤖 Rascunho gerado com IA!');
    } catch {
      setMessage('❌ Erro ao gerar com IA');
    }
    setAiLoading('');
    setTimeout(() => setMessage(''), 3000);
  };

  const aiGenerateImage = async () => {
    setAiLoading('image');
    try {
      const res = await fetch(`${baseUrl}/api/blog/ai`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'generate-image', title, topic: `Blog cover for: ${title}. Dark tech aesthetic with neon green and blue accents.` }),
      });
      const data = await res.json();
      if (data.image_url) {
        setCoverUrl(data.image_url);
        setMessage('🎨 Capa gerada com DALL-E!');
      }
    } catch {
      setMessage('❌ Erro ao gerar imagem');
    }
    setAiLoading('');
    setTimeout(() => setMessage(''), 3000);
  };

  const aiImproveSeo = async () => {
    setAiLoading('seo');
    try {
      const res = await fetch(`${baseUrl}/api/blog/ai`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'improve-seo', title, content: editor?.getHTML() }),
      });
      const data = await res.json();
      if (data.meta_title) setMetaTitle(data.meta_title);
      if (data.meta_description) setMetaDescription(data.meta_description);
      if (data.tags) setTags(data.tags.join(', '));
      if (data.slug) setSlug(data.slug);
      setMessage('🔍 SEO otimizado!');
    } catch {
      setMessage('❌ Erro ao otimizar SEO');
    }
    setAiLoading('');
    setTimeout(() => setMessage(''), 3000);
  };

  const aiGenerateExcerpt = async () => {
    setAiLoading('excerpt');
    try {
      const res = await fetch(`${baseUrl}/api/blog/ai`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'generate-excerpt', title, content: editor?.getHTML() }),
      });
      const data = await res.json();
      if (data.excerpt) setExcerpt(data.excerpt);
      setMessage('📝 Resumo gerado!');
    } catch {
      setMessage('❌ Erro ao gerar resumo');
    }
    setAiLoading('');
    setTimeout(() => setMessage(''), 3000);
  };

  const s = {
    page: { display: 'flex', minHeight: '100vh', backgroundColor: '#0B0F19', color: '#fff', fontFamily: "'Inter', sans-serif" } as React.CSSProperties,
    main: { flex: 1, display: 'flex', flexDirection: 'column' as const, overflow: 'hidden' } as React.CSSProperties,
    toolbar: { display: 'flex', gap: '4px', padding: '12px 24px', borderBottom: '1px solid #1a1f2e', backgroundColor: '#111827', flexWrap: 'wrap' as const, alignItems: 'center' } as React.CSSProperties,
    toolBtn: (active?: boolean) => ({ padding: '6px 10px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '14px', backgroundColor: active ? '#00DF81' : 'transparent', color: active ? '#000' : '#aaa', fontWeight: active ? 700 : 400, transition: 'all 0.2s' }) as React.CSSProperties,
    sidebar: { width: '340px', borderLeft: '1px solid #1a1f2e', backgroundColor: '#111827', overflow: 'auto', flexShrink: 0 } as React.CSSProperties,
    sideSection: { padding: '20px', borderBottom: '1px solid #1a1f2e' } as React.CSSProperties,
    label: { display: 'block', fontSize: '12px', fontWeight: 600, color: '#888', textTransform: 'uppercase' as const, letterSpacing: '0.5px', marginBottom: '6px' } as React.CSSProperties,
    input: { width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #1a1f2e', backgroundColor: '#0B0F19', color: '#fff', fontSize: '14px', outline: 'none' } as React.CSSProperties,
    textarea: { width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #1a1f2e', backgroundColor: '#0B0F19', color: '#fff', fontSize: '14px', outline: 'none', resize: 'vertical' as const, fontFamily: 'inherit' } as React.CSSProperties,
    select: { width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #1a1f2e', backgroundColor: '#0B0F19', color: '#fff', fontSize: '14px' } as React.CSSProperties,
    headerBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderBottom: '1px solid #1a1f2e', gap: '12px', flexWrap: 'wrap' as const } as React.CSSProperties,
    saveBtn: { padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: 600, backgroundColor: '#1a1f2e', color: '#ccc' } as React.CSSProperties,
    publishBtn: { padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: 600, background: 'linear-gradient(135deg, #00DF81, #00AAFF)', color: '#000' } as React.CSSProperties,
    aiBtn: (loading?: boolean) => ({ padding: '8px 14px', borderRadius: '8px', border: '1px solid #7C3AED', cursor: loading ? 'wait' : 'pointer', fontSize: '13px', fontWeight: 600, backgroundColor: loading ? '#2d1f4e' : 'transparent', color: '#a78bfa', width: '100%', opacity: loading ? 0.7 : 1, transition: 'all 0.2s' }) as React.CSSProperties,
    aiPanel: { position: 'fixed' as const, right: '360px', top: '80px', width: '360px', backgroundColor: '#1a1f2e', borderRadius: '16px', border: '1px solid #7C3AED', padding: '24px', zIndex: 100, boxShadow: '0 20px 50px rgba(0,0,0,0.5)' } as React.CSSProperties,
    msgToast: { position: 'fixed' as const, bottom: '24px', right: '24px', padding: '12px 24px', borderRadius: '10px', backgroundColor: '#111827', border: '1px solid #1a1f2e', fontSize: '14px', fontWeight: 600, zIndex: 999, boxShadow: '0 8px 30px rgba(0,0,0,0.3)' } as React.CSSProperties,
  };

  return (
    <div style={s.page}>
      <div style={s.main}>
        {/* Header */}
        <div style={s.headerBar}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <a href="/admin/blog" style={{ color: '#888', textDecoration: 'none', fontSize: '14px' }}>← Voltar</a>
            <h1 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>{postId ? 'Editar Post' : 'Novo Post'}</h1>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button style={s.saveBtn} onClick={() => savePost('draft')} disabled={saving}>
              {saving ? '⏳' : '💾'} Salvar Rascunho
            </button>
            <button style={s.publishBtn} onClick={() => savePost('published')} disabled={saving}>
              {saving ? '⏳' : '🚀'} Publicar
            </button>
          </div>
        </div>

        {/* Title */}
        <div style={{ padding: '24px 24px 0' }}>
          <input
            type="text"
            value={title}
            onChange={e => handleTitleChange(e.target.value)}
            placeholder="Título do Post"
            style={{ ...s.input, fontSize: '28px', fontWeight: 700, border: 'none', backgroundColor: 'transparent', padding: '0' }}
          />
          <div style={{ fontSize: '13px', color: '#888', marginTop: '8px' }}>/blog/{slug || 'slug-do-post'}</div>
        </div>

        {/* Toolbar */}
        {editor && (
          <div style={s.toolbar}>
            <button style={s.toolBtn(editor.isActive('bold'))} onClick={() => editor.chain().focus().toggleBold().run()}>
              <strong>B</strong>
            </button>
            <button style={s.toolBtn(editor.isActive('italic'))} onClick={() => editor.chain().focus().toggleItalic().run()}>
              <em>I</em>
            </button>
            <button style={s.toolBtn(editor.isActive('underline'))} onClick={() => editor.chain().focus().toggleUnderline().run()}>
              <u>U</u>
            </button>
            <button style={s.toolBtn(editor.isActive('strike'))} onClick={() => editor.chain().focus().toggleStrike().run()}>
              <s>S</s>
            </button>
            <span style={{ width: 1, height: 20, backgroundColor: '#1a1f2e', margin: '0 4px' }}></span>
            <button style={s.toolBtn(editor.isActive('heading', { level: 2 }))} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>H2</button>
            <button style={s.toolBtn(editor.isActive('heading', { level: 3 }))} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>H3</button>
            <span style={{ width: 1, height: 20, backgroundColor: '#1a1f2e', margin: '0 4px' }}></span>
            <button style={s.toolBtn(editor.isActive('bulletList'))} onClick={() => editor.chain().focus().toggleBulletList().run()}>• Lista</button>
            <button style={s.toolBtn(editor.isActive('orderedList'))} onClick={() => editor.chain().focus().toggleOrderedList().run()}>1. Lista</button>
            <button style={s.toolBtn(editor.isActive('blockquote'))} onClick={() => editor.chain().focus().toggleBlockquote().run()}>❝ Citação</button>
            <button style={s.toolBtn(editor.isActive('codeBlock'))} onClick={() => editor.chain().focus().toggleCodeBlock().run()}>{'</>'} Código</button>
            <span style={{ width: 1, height: 20, backgroundColor: '#1a1f2e', margin: '0 4px' }}></span>
            <button style={s.toolBtn()} onClick={() => {
              const url = prompt('URL da imagem:');
              if (url) editor.chain().focus().setImage({ src: url }).run();
            }}>🖼 Imagem</button>
            <button style={s.toolBtn()} onClick={() => {
              const url = prompt('URL do link:');
              if (url) editor.chain().focus().setLink({ href: url }).run();
            }}>🔗 Link</button>
            <span style={{ width: 1, height: 20, backgroundColor: '#1a1f2e', margin: '0 4px' }}></span>
            <button style={s.toolBtn(editor.isActive({ textAlign: 'left' }))} onClick={() => editor.chain().focus().setTextAlign('left').run()}>⬅</button>
            <button style={s.toolBtn(editor.isActive({ textAlign: 'center' }))} onClick={() => editor.chain().focus().setTextAlign('center').run()}>⬛</button>
            <button style={s.toolBtn(editor.isActive({ textAlign: 'right' }))} onClick={() => editor.chain().focus().setTextAlign('right').run()}>➡</button>
            <button style={s.toolBtn()} onClick={() => editor.chain().focus().undo().run()}>↩️</button>
            <button style={s.toolBtn()} onClick={() => editor.chain().focus().redo().run()}>↪️</button>
          </div>
        )}

        {/* Editor */}
        <div style={{ flex: 1, overflow: 'auto', backgroundColor: '#0a0e16' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <EditorContent editor={editor} />
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div style={s.sidebar}>
        {/* Cover Image */}
        <div style={s.sideSection}>
          <label style={s.label}>Capa</label>
          {coverUrl ? (
            <div style={{ position: 'relative', marginBottom: '8px' }}>
              <img src={coverUrl} alt="Capa" style={{ width: '100%', borderRadius: '8px', aspectRatio: '16/9', objectFit: 'cover' }} />
              <button onClick={() => setCoverUrl('')} style={{ position: 'absolute', top: 4, right: 4, background: 'rgba(0,0,0,0.7)', border: 'none', color: '#fff', borderRadius: '50%', width: 24, height: 24, cursor: 'pointer', fontSize: '12px' }}>✕</button>
            </div>
          ) : (
            <div style={{ width: '100%', aspectRatio: '16/9', borderRadius: '8px', border: '2px dashed #1a1f2e', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888', fontSize: '14px', marginBottom: '8px' }}>
              Sem capa
            </div>
          )}
          <input type="text" value={coverUrl} onChange={e => setCoverUrl(e.target.value)} placeholder="URL da imagem de capa" style={s.input} />
          <button style={{ ...s.aiBtn(aiLoading === 'image'), marginTop: '8px' }} onClick={aiGenerateImage} disabled={!!aiLoading}>
            {aiLoading === 'image' ? '⏳ Gerando...' : '🎨 Gerar Capa com IA'}
          </button>
        </div>

        {/* Category */}
        <div style={s.sideSection}>
          <label style={s.label}>Categoria</label>
          <select style={s.select} value={categoryId} onChange={e => setCategoryId(e.target.value)}>
            <option value="">Selecionar...</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        {/* Tags */}
        <div style={s.sideSection}>
          <label style={s.label}>Tags (separadas por vírgula)</label>
          <input type="text" value={tags} onChange={e => setTags(e.target.value)} placeholder="ia, tecnologia, e-commerce" style={s.input} />
        </div>

        {/* Excerpt */}
        <div style={s.sideSection}>
          <label style={s.label}>Resumo / Excerpt</label>
          <textarea value={excerpt} onChange={e => setExcerpt(e.target.value)} placeholder="Breve descrição do post..." rows={3} style={s.textarea} />
          <button style={{ ...s.aiBtn(aiLoading === 'excerpt'), marginTop: '8px' }} onClick={aiGenerateExcerpt} disabled={!!aiLoading}>
            {aiLoading === 'excerpt' ? '⏳' : '📝'} Gerar Resumo com IA
          </button>
        </div>

        {/* SEO */}
        <div style={s.sideSection}>
          <label style={s.label}>SEO</label>
          <input type="text" value={metaTitle} onChange={e => setMetaTitle(e.target.value)} placeholder="Meta Title (máx 60 chars)" style={{ ...s.input, marginBottom: '8px' }} />
          <textarea value={metaDescription} onChange={e => setMetaDescription(e.target.value)} placeholder="Meta Description (máx 160 chars)" rows={2} style={s.textarea} />
          <button style={{ ...s.aiBtn(aiLoading === 'seo'), marginTop: '8px' }} onClick={aiImproveSeo} disabled={!!aiLoading}>
            {aiLoading === 'seo' ? '⏳' : '🔍'} Otimizar SEO com IA
          </button>
        </div>

        {/* AI Draft Generator */}
        <div style={s.sideSection}>
          <label style={{ ...s.label, color: '#a78bfa' }}>🤖 Assistente de IA</label>
          <textarea
            value={aiTopic}
            onChange={e => setAiTopic(e.target.value)}
            placeholder="Descreva o tema do artigo..."
            rows={3}
            style={s.textarea}
          />
          <button
            style={{ ...s.aiBtn(aiLoading === 'draft'), marginTop: '8px', background: aiLoading === 'draft' ? '#2d1f4e' : 'linear-gradient(135deg, #7C3AED, #a78bfa)', color: '#fff', border: 'none' }}
            onClick={aiGenerateDraft}
            disabled={!!aiLoading}
          >
            {aiLoading === 'draft' ? '⏳ Gerando artigo...' : '🤖 Gerar Artigo Completo com IA'}
          </button>
        </div>
      </div>

      {/* AI Panel (floating) */}
      {showAiPanel && (
        <div style={s.aiPanel}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ margin: 0, fontSize: '16px' }}>🤖 Assistente IA</h3>
            <button onClick={() => setShowAiPanel(false)} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '18px' }}>✕</button>
          </div>
        </div>
      )}

      {/* Toast Message */}
      {message && <div style={s.msgToast}>{message}</div>}

      <style>{`
        .blog-editor-content h2 { font-size: 28px; font-weight: 700; margin: 32px 0 16px; color: #fff; }
        .blog-editor-content h3 { font-size: 22px; font-weight: 600; margin: 24px 0 12px; color: #e0e0e0; }
        .blog-editor-content p { margin: 0 0 16px; }
        .blog-editor-content ul, .blog-editor-content ol { padding-left: 24px; margin: 0 0 16px; }
        .blog-editor-content li { margin: 4px 0; }
        .blog-editor-content blockquote { border-left: 3px solid #00DF81; padding-left: 16px; margin: 16px 0; color: #aaa; font-style: italic; }
        .blog-editor-content pre { background: #111827; border-radius: 8px; padding: 16px; overflow-x: auto; margin: 16px 0; }
        .blog-editor-content code { background: #111827; padding: 2px 6px; border-radius: 4px; font-size: 14px; color: #00DF81; }
        .blog-editor-content img { max-width: 100%; border-radius: 8px; margin: 16px 0; }
        .blog-editor-content a { color: #00AAFF; text-decoration: underline; }
        .blog-editor-content mark { background: rgba(0,223,129,0.3); padding: 2px 4px; border-radius: 2px; }
        .ProseMirror p.is-editor-empty:first-child::before { content: attr(data-placeholder); color: #555; pointer-events: none; float: left; height: 0; }
      `}</style>
    </div>
  );
}
