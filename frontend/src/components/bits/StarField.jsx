import { useMemo } from 'react';

function generateStars(count, sizeRange, opacityRange, durationRange) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * (sizeRange[1] - sizeRange[0]) + sizeRange[0],
    opacity: Math.random() * (opacityRange[1] - opacityRange[0]) + opacityRange[0],
    delay: Math.random() * 6,
    duration: Math.random() * (durationRange[1] - durationRange[0]) + durationRange[0],
  }));
}

export default function StarField({ count = 80 }) {
  const layers = useMemo(() => ({
    // Far layer — tiny, slow, very faint
    far: generateStars(Math.floor(count * 0.5), [0.4, 0.8], [0.1, 0.3], [4, 7]),
    // Mid layer — medium
    mid: generateStars(Math.floor(count * 0.35), [0.8, 1.4], [0.2, 0.5], [2.5, 5]),
    // Near layer — larger, brighter, faster twinkle
    near: generateStars(Math.floor(count * 0.15), [1.4, 2.2], [0.4, 0.8], [1.5, 3]),
  }), [count]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Far stars */}
      {layers.far.map((star) => (
        <div
          key={`far-${star.id}`}
          className="absolute rounded-full bg-white"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
            opacity: star.opacity,
            animation: `twinkle ${star.duration}s ease-in-out ${star.delay}s infinite`,
          }}
        />
      ))}

      {/* Mid stars — slight blue tint for depth */}
      {layers.mid.map((star) => (
        <div
          key={`mid-${star.id}`}
          className="absolute rounded-full"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
            background: Math.random() > 0.7 ? 'rgba(200, 210, 255, 1)' : 'white',
            opacity: star.opacity,
            animation: `twinkle ${star.duration}s ease-in-out ${star.delay}s infinite`,
          }}
        />
      ))}

      {/* Near stars — occasional gold tint */}
      {layers.near.map((star) => (
        <div
          key={`near-${star.id}`}
          className="absolute rounded-full"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
            background: Math.random() > 0.6 ? 'rgba(212, 175, 55, 0.9)' : 'white',
            opacity: star.opacity,
            boxShadow: `0 0 ${star.size * 2}px rgba(255,255,255,0.4)`,
            animation: `twinkle ${star.duration}s ease-in-out ${star.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}
