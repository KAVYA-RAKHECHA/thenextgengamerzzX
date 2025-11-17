import { motion, AnimatePresence } from "framer-motion";
import { useCallback, useState } from "react";

function SmokeEffect({ color = "#ffffff", particlesPerEmit = 2 }) {
  const [particles, setParticles] = useState([]);

  const createParticle = useCallback((x, y, id) => ({
    id,
    x,
    y,
    angle: (Math.random() * Math.PI) / 3 - Math.PI / 6 - Math.PI / 2,
    speed: Math.random() * 1 + 1,
    size: Math.random() * 12 + 8,
    opacity: Math.random() * 0.3 + 0.1,
  }), []);

  const emitParticles = useCallback((x, y) => {
    const newParticles = Array.from({ length: particlesPerEmit }, (_, i) =>
      createParticle(x, y, Date.now() + i)
    );
    setParticles(prev => [...prev, ...newParticles]);

    setTimeout(() => {
      setParticles(prev =>
        prev.filter(p => !newParticles.find(np => np.id === p.id))
      );
    }, 1000);
  }, [createParticle, particlesPerEmit]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    emitParticles(x, y);
  };

  return (
    <div
      className="absolute inset-0 overflow-hidden z-0"
      onMouseMove={handleMouseMove}
    >
      <AnimatePresence>
        {particles.map(p => (
          <motion.div
            key={p.id}
            className="absolute rounded-full blur-md pointer-events-none"
            initial={{ x: p.x, y: p.y, scale: 1, opacity: p.opacity }}
            animate={{
              x: p.x + Math.cos(p.angle) * 200 * p.speed,
              y: p.y + Math.sin(p.angle) * 200 * p.speed,
              scale: 2,
              opacity: 0,
            }}
            exit={{ opacity: 0, scale: 3 }}
            transition={{ duration: 1, ease: "easeOut" }}
            style={{
              width: p.size,
              height: p.size,
              backgroundColor: color,
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

export default SmokeEffect;
