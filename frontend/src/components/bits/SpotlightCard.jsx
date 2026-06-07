import { useRef, useState } from 'react';

export default function SpotlightCard({ children, className = '', spotlightColor = 'rgba(212,175,55,0.12)' }) {
  const ref = useRef(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);

  const handleMouseMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      className={`relative overflow-hidden transition-transform duration-300 hover:-translate-y-1 ${className}`}
      style={{
        background: visible
          ? `radial-gradient(500px at ${pos.x}px ${pos.y}px, ${spotlightColor}, transparent 80%)`
          : '',
      }}
    >
      {children}
    </div>
  );
}
