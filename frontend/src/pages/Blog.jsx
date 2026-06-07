import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import StarField from '../components/bits/StarField.jsx';
import { useLang } from '../context/LanguageContext.jsx';

const API = import.meta.env.VITE_API_URL || '/api';

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

const metalStyle = {
  background: 'linear-gradient(180deg, #E6C76A 0%, #D4AF37 40%, #C9A227 70%, #E6C76A 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
};

function fmtDate(d) {
  return new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

function CategoryBadge({ category }) {
  return (
    <span className="inline-block text-[10px] tracking-[0.18em] uppercase font-sans px-3 py-1 rounded-full"
      style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.25)', color: '#D4AF37' }}>
      {category}
    </span>
  );
}

function PostCard({ post, featured = false }) {
  return (
    <motion.article variants={fadeUp}>
      <Link to={`/blog/${post.slug}`} className="group block">
        {/* Image */}
        <div className={`relative overflow-hidden rounded-2xl mb-4 bg-[#E8DCC8]/40 ${featured ? 'aspect-[16/9]' : 'aspect-[4/3]'}`}>
          {post.imageUrl ? (
            <img
              src={post.imageUrl}
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center"
              style={{ background: 'radial-gradient(circle at 40% 40%, rgba(96,64,160,0.3) 0%, rgba(212,175,55,0.05) 60%, transparent 100%)' }}>
              <span className="text-5xl opacity-30">âœ¦</span>
            </div>
          )}
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-[#F5F1ED]/0 group-hover:bg-[#F5F1ED]/20 transition-colors duration-300 rounded-2xl" />
        </div>

        {/* Meta */}
        <div className="flex items-center gap-3 mb-3">
          <CategoryBadge category={post.category || 'Astrology'} />
          <span className="text-[#5B3E2A]/65 text-xs font-sans">
            {fmtDate(post.publishedAt || post.createdAt)}
          </span>
        </div>

        {/* Title */}
        <h2 className={`font-serif text-[#3D2817] group-hover:text-[#E6C76A] transition-colors duration-200 leading-snug mb-2 ${
          featured ? 'text-2xl md:text-3xl' : 'text-lg'
        }`}>
          {post.title}
        </h2>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-[#3D2817]/80 font-sans text-sm leading-relaxed line-clamp-3">
            {post.excerpt}
          </p>
        )}

        {/* Author */}
        <p className="mt-3 text-[#5B3E2A]/65 text-xs font-sans">
          {post.author || 'Abundance Code'}
        </p>
      </Link>
    </motion.article>
  );
}

export default function Blog() {
  const { t } = useLang();
  const [posts, setPosts]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage]     = useState(1);
  const [pages, setPages]   = useState(1);
  const [total, setTotal]   = useState(0);

  useEffect(() => {
    setLoading(true);
    fetch(`${API}/blog?page=${page}&limit=13`)
      .then(r => r.json())
      .then(data => {
        setPosts(data.posts || []);
        setPages(data.pages || 1);
        setTotal(data.total || 0);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page]);

  const featured  = posts[0];
  const secondary = posts.slice(1, 3);
  const rest      = posts.slice(3);

  return (
    <main className="relative min-h-screen bg-[#F5F1ED] pt-28 pb-24">
      <StarField count={40} />

      <div className="relative z-10 max-w-6xl mx-auto px-6">

        {/* Header */}
        <motion.div
          initial="hidden" animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
          className="text-center mb-16"
        >
          <motion.p variants={fadeUp} className="text-[#D4AF37]/50 text-xs tracking-[0.25em] uppercase font-sans mb-3">
            {t('blog.label')}
          </motion.p>
          <motion.h1 variants={fadeUp} className="font-serif text-4xl md:text-5xl mb-4">
            {t('blog.h1')}
          </motion.h1>
          <motion.p variants={fadeUp} className="text-[#3D2817]/75 font-sans text-lg max-w-xl mx-auto">
            {t('blog.subtitle')}
          </motion.p>
          <motion.div variants={fadeUp} className="flex items-center gap-4 justify-center mt-6 opacity-30">
            <div className="flex-1 max-w-[120px] h-px bg-gradient-to-r from-transparent to-[#D4AF37]" />
            <span className="text-[#D4AF37] text-sm">âœ¦</span>
            <div className="flex-1 max-w-[120px] h-px bg-gradient-to-l from-transparent to-[#D4AF37]" />
          </motion.div>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-24">
            <div className="w-8 h-8 border-2 border-[#D4AF37]/30 border-t-[#D4AF37] rounded-full animate-spin" />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-24 text-[#5B3E2A]/65 font-sans">
            {t('blog.noPosts')}
          </div>
        ) : (
          <>
            {/* Featured + 2 secondary */}
            {featured && (
              <motion.div
                initial="hidden" whileInView="visible" viewport={{ once: true }}
                variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
                className="grid md:grid-cols-3 gap-6 mb-10"
              >
                <div className="md:col-span-2">
                  <PostCard post={featured} featured />
                </div>
                <div className="flex flex-col gap-6">
                  {secondary.map(p => <PostCard key={p._id} post={p} />)}
                </div>
              </motion.div>
            )}

            {/* Divider */}
            {rest.length > 0 && (
              <div className="flex items-center gap-4 my-10 opacity-20">
                <div className="flex-1 h-px bg-[#D4AF37]" />
                <span className="text-[#D4AF37] text-xs tracking-widest">âœ¦ âœ¦ âœ¦</span>
                <div className="flex-1 h-px bg-[#D4AF37]" />
              </div>
            )}

            {/* Rest grid */}
            {rest.length > 0 && (
              <motion.div
                initial="hidden" whileInView="visible" viewport={{ once: true }}
                variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
                className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {rest.map(p => <PostCard key={p._id} post={p} />)}
              </motion.div>
            )}

            {/* Pagination */}
            {pages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-14">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage(p => p - 1)}
                  className="px-5 py-2.5 rounded-xl border border-[#E8DCC8] text-[#3D2817]/80 text-sm font-sans hover:border-[#D4AF37]/40 hover:text-[#3D2817] disabled:opacity-30 transition-colors"
                >
                  {t('blog.prev')}
                </button>
                <span className="text-[#5B3E2A]/65 text-sm font-sans">{page} / {pages}</span>
                <button
                  disabled={page >= pages}
                  onClick={() => setPage(p => p + 1)}
                  className="px-5 py-2.5 rounded-xl border border-[#E8DCC8] text-[#3D2817]/80 text-sm font-sans hover:border-[#D4AF37]/40 hover:text-[#3D2817] disabled:opacity-30 transition-colors"
                >
                  {t('blog.next')}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
