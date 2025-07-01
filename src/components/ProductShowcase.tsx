import React, { Suspense, useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Stage, PresentationControls, Environment, softShadows } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { products, Product } from '../../data/products';

// Apply soft shadows globally
softShadows();

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  const modelRef = useRef<any>();

  // Parallax effect on mouse move
  useFrame(({ mouse, viewport }) => {
    if (modelRef.current) {
      const x = (mouse.x * viewport.width) / 100;
      const y = (mouse.y * viewport.height) / 100;
      modelRef.current.rotation.y = x;
      modelRef.current.rotation.x = -y;
    }
  });

  return <primitive ref={modelRef} object={scene} scale={1.2} />; 
}

export function ProductShowcase() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentProduct = products[currentIndex];

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % products.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + products.length) % products.length);
  };

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <AnimatePresence>
        <motion.div
          key={currentProduct.id}
          initial={{ backgroundColor: '#000' }}
          animate={{ backgroundColor: currentProduct.theme.backgroundColor || '#333' }}
          transition={{ duration: 1 }}
          style={{ position: 'absolute', width: '100%', height: '100%' }}
        />
      </AnimatePresence>

      {/* Product Info Overlay */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentProduct.id + '-info'}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{ position: 'absolute', top: '5%', left: '5%', zIndex: 1, color: '#fff', maxWidth: '400px' }}
        >
          <h1 className="text-4xl font-bold mb-2">{currentProduct.name}</h1>
          <p className="text-lg mb-4">{currentProduct.description}</p>
          <h2 className="text-3xl font-semibold">${currentProduct.price.toFixed(2)}</h2>
        </motion.div>
      </AnimatePresence>

      {/* 3D Canvas */}
      <Canvas dpr={[1, 2]} shadows camera={{ position: [0, 0, 5], fov: 45 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} shadow-mapSize={2048} castShadow />
          <Environment preset="city" />

          <AnimatePresence mode="wait">
            <motion.div key={currentProduct.id + '-model'}>
              <Model url={currentProduct.threeDModel.url} />
            </motion.div>
          </AnimatePresence>
        </Suspense>
        <OrbitControls enableZoom={false} enablePan={false} minPolarAngle={Math.PI / 2} maxPolarAngle={Math.PI / 2} />
      </Canvas>

      {/* Navigation Controls */}
      <div style={{ position: 'absolute', bottom: '5%', right: '5%', zIndex: 1 }}>
        <button onClick={handlePrev} className="bg-white/20 text-white font-bold py-2 px-4 rounded-full backdrop-blur-sm mr-4 hover:bg-white/30 transition-colors">Prev</button>
        <button onClick={handleNext} className="bg-white/20 text-white font-bold py-2 px-4 rounded-full backdrop-blur-sm hover:bg-white/30 transition-colors">Next</button>
      </div>
    </div>
  );
}
