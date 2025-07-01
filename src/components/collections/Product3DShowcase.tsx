import React, { useRef } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Product } from '../data/products'; // Adjust import as needed

interface Props {
  product: Product;
  index: number;
}

export default function ProductCard3D({ product, index }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Parallax tilt transforms
  const rotateX = useTransform(y, [-100, 100], [12, -12]);
  const rotateY = useTransform(x, [-100, 100], [-12, 12]);
  const scale = useTransform(y, [-100, 100], [1.02, 1.06]);

  function handleMouseMove(e: React.MouseEvent) {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      ref={cardRef}
      className="relative rounded-3xl overflow-hidden shadow-xl group"
      style={{
        width: 350,
        height: 480,
        perspective: 1200,
        background: `linear-gradient(135deg, ${product.theme.backgroundColor} 70%, #fff0 100%)`,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ opacity: 1, y: 0 }}
      initial={{ opacity: 0, y: 50 }}
      transition={{ delay: index * 0.08, duration: 0.6 }}
    >
      {/* Dynamic Parallax Image */}
      <motion.img
        src={product.image}
        alt={product.name}
        className="absolute inset-0 w-full h-full object-cover object-center scale-110 group-hover:scale-125 transition-transform duration-500"
        style={{
          zIndex: 1,
          rotateX,
          rotateY,
          scale,
        }}
        draggable={false}
      />

      {/* Gradient Overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent z-10" />

      {/* Info */}
      <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
        <h3 className="text-white text-2xl font-bold drop-shadow">{product.name}</h3>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-white text-xl font-semibold">${product.price}</span>
          {product.originalPrice && (
            <span className="text-gray-300 line-through">${product.originalPrice}</span>
          )}
        </div>
        <div className="flex gap-2 mt-3">
          {product.colors.map((c) => (
            <span
              key={c.value}
              className="w-5 h-5 rounded-full border-2 border-white"
              style={{ background: c.value }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}