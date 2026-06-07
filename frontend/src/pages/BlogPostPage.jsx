import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import StarField from '../components/bits/StarField.jsx';
import { useLang } from '../context/LanguageContext.jsx';

const API = import.meta.env.VITE_API_URL || '/api';

const metalStyle = {
  background: 'linear-gradient(180deg, #E6C76A 0%, #D4AF37 40%, #C9A227 70%, #E6C76A 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
};

function fmtDate(d) {
  return new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

export default function BlogPostPage() {
  const { slug } = useParams();
  const { t } = useLang();
  const [post, setPost]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`${API}/blog/${slug}`)
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(data => setPost(data))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return (
    <main className="min-h-screen bg-[#F5F1ED] pt-28 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[#D4AF37]/30 border-t-[#D4AF37] rounded-full animate-spin" />
    </main>
  );

  if (notFound || !post) return (
    <main className="min-h-screen bg-[#F5F1ED] pt-28 flex flex-col items-center justify-center gap-4">
      <p className="font-serif text-2xl text-[#3D2817]">{t('blog.notFound')}</p>
      <Link to="/blog" className="text-[#D4AF37] text-sm font-sans hover:underline">{t('blog.back')}</Link>
    </main>
  );

  return (
    <main className="relative min-h-screen bg-[#F5F1ED] pt-28 pb-24">
      <StarField count={30} />
      <div className="relative z-10 max-w-3xl mx-auto px-6">

        {/* Back */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-10">
          <Link to="/blog" className="text-[#5B3E2A]/70 text-sm font-sans hover:text-[#D4AF37] transition-colors">
            {t('blog.back')}
          </Link>
        </motion.div>

        {/* Category + date */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          className="flex items-center gap-3 mb-5">
          <span className="inline-block text-[10px] tracking-[0.18em] uppercase font-sans px-3 py-1 rounded-full"
            style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.25)', color: '#D4AF37' }}>
            {post.category || 'Astrology'}
          </span>
          <span className="text-[#5B3E2A]/65 text-xs font-sans">{fmtDate(post.publishedAt || post.createdAt)}</span>
        </motion.div>

        {/* Title */}
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="font-serif text-3xl md:text-4xl lg:text-5xl leading-tight mb-6">
          {post.title}
        </motion.h1>

        {/* Author */}
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
          className="text-[#5B3E2A]/70 text-sm font-sans mb-8">
          {t('blog.by')} {post.author || 'Abundance Code'}
        </motion.p>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-10 opacity-25">
          <div className="flex-1 h-px bg-[#D4AF37]" />
          <span className="text-[#D4AF37] text-xs">âœ¦</span>
          <div className="flex-1 h-px bg-[#D4AF37]" />
        </div>

        {/* Hero image */}
        {post.imageUrl && (
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
            className="rounded-2xl overflow-hidden mb-10 aspect-[16/9]">
            <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover" />
          </motion.div>
        )}

        {/* Excerpt */}
        {post.excerpt && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}
            className="font-serif text-xl text-[#3D2817]/90 leading-relaxed mb-8 italic border-l-2 border-[#D4AF37]/30 pl-5">
            {post.excerpt}
          </motion.p>
        )}

        {/* Content */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          className="prose-blog"
          style={{ color: 'rgba(61,40,23,0.85)', fontFamily: 'Montserrat, sans-serif', lineHeight: '1.9', fontSize: '1rem' }}
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Footer */}
        <div className="mt-16 pt-10 border-t border-[#E8DCC8] text-center">
          <p className="text-[#D4AF37]/40 text-xs tracking-widest uppercase font-sans mb-6">{t('blog.continue')}</p>
          <Link to="/blog" className="btn-ghost text-sm px-8 py-3">{t('blog.backBtn')}</Link>
        </div>
      </div>
    </main>
  );
}
