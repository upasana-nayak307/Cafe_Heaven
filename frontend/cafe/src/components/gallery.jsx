import { motion } from 'framer-motion';
import { useInView, AnimatePresence } from 'framer-motion';
import { useRef, useState } from 'react';
// import { Dialog, DialogContent } from '@/components/ui/dialog';
import { HiX } from 'react-icons/hi';
const galleryImages = [
  {
    url: 'https://images.unsplash.com/photo-1766163846502-bf26a2d40852?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDN8MHwxfHNlYXJjaHwxfHxwcmVtaXVtJTIwY2FmZSUyMGNvZmZlZSUyMGxhdHRlJTIwYXJ0JTIwcGFzdHJ5fGVufDB8fHx8MTc3OTcwODY2NXww&ixlib=rb-4.1.0&q=85',
    alt: 'Premium Latte Art',
  },
  {
    url: 'https://images.unsplash.com/photo-1763478279302-fb574409a302?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxNzV8MHwxfHNlYXJjaHwzfHxhcnRpc2FuJTIwcGl6emElMjBhbmQlMjBiYWtlcnklMjBmb29kfGVufDB8fHx8MTc3OTcwODY2NXww&ixlib=rb-4.1.0&q=85',
    alt: 'Rustic Artisan Pizza',
  },
  {
    url: 'https://images.unsplash.com/photo-1775201667588-dba5403ea1a1?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxNzV8MHwxfHNlYXJjaHwyfHxhcnRpc2FuJTIwcGl6emElMjBhbmQlMjBiYWtlcnklMjBmb29kfGVufDB8fHx8MTc3OTcwODY2NXww&ixlib=rb-4.1.0&q=85',
    alt: 'Fresh Baked Breads',
  },
  {
    url: 'https://images.pexels.com/photos/22686988/pexels-photo-22686988.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    alt: 'Cafe Exterior',
  },
  {
    url: 'https://images.unsplash.com/photo-1759050483129-512154ddd640?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1OTN8MHwxfHNlYXJjaHw0fHxjb3p5JTIwbW9kZXJuJTIwY2FmZSUyMGV4dGVyaW9yJTIwYmx1ZSUyMGdyZWVuZXJ5fGVufDB8fHx8MTc3OTcwODY2NXww&ixlib=rb-4.1.0&q=85',
    alt: 'Cozy Cafe Setting',
  },
  {
    url: 'https://images.pexels.com/photos/34832554/pexels-photo-34832554.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    alt: 'Interior Design',
  },
];

const Gallery = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <>
      <section
        id="gallery"
        data-testid="gallery-section"
        ref={ref}
        className="py-24 md:py-32 bg-[#FAFAFA]"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.8 }}
                className="text-center mb-16"
            >
                <span
                data-testid="gallery-label"
                className="text-sm uppercase tracking-[0.2em] font-medium text-[#6DBE45] mb-4 block"
                >
                Gallery
                </span>
                <h2
                data-testid="gallery-title"
                className="text-3xl sm:text-4xl lg:text-5xl tracking-tight font-serif text-[#05223D] mb-4"
                >
                    Moments of Heaven
                </h2>
                <p className="text-base font-sans leading-relaxed text-[#4A5568] max-w-2xl mx-auto">
                A visual journey through our cozy space and delicious offerings
                </p>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryImages.map((image, index) => (
              <motion.div
                key={index}
                data-testid={`gallery-image-${index}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative group cursor-pointer overflow-hidden rounded-2xl aspect-square"
                onClick={() => setSelectedImage(image)}
                >
                <img
                  src={image.url}
                  alt={image.alt}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#05223D]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <p className="text-white font-medium">{image.alt}</p>
                </div>
                </motion.div>
                ))}
          </div>
        </div>
      </section>
      <AnimatePresence>
  {selectedImage && (
    <motion.div
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={() => setSelectedImage(null)}
    >
      <motion.div
        className="relative max-w-5xl w-full"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* CLOSE BUTTON */}
        <button
          onClick={() => setSelectedImage(null)}
          className="absolute -top-12 right-0 text-white hover:text-[#6DBE45] transition-colors"
        >
          <HiX className="w-8 h-8" />
        </button>

        {/* IMAGE */}
        <img
          src={selectedImage.url}
          alt={selectedImage.alt}
          className="w-full h-auto rounded-2xl"
        />
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
    </>
  );
};

export default Gallery;