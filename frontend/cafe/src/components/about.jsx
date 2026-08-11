import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { HiCheckCircle } from 'react-icons/hi';

const About = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section
      id="about"
      data-testid="about-section"
      ref={ref}
      className="py-24 md:py-32 bg-[#FAFAFA]"
    >
    <div className="max-w-7xl mx-auto px-6 md:px-12">
    <div className="grid md:grid-cols-2 gap-16 items-center">
        <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
        transition={{ duration: 0.8 }}
        className="relative"
        >
        <div className="absolute -top-8 -left-8 w-32 h-32 bg-[#6DBE45] rounded-2xl -z-10" />
        <img
            data-testid="about-image"
            src="https://images.pexels.com/photos/34832554/pexels-photo-34832554.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
            alt="Cafe Heaven Interior"
            className="rounded-2xl shadow-2xl w-full h-[500px] object-cover"
        />
        </motion.div>
        <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.8, delay: 0.2 }}
        >
        <span
            data-testid="about-label"
            className="text-sm uppercase tracking-[0.2em] font-medium text-[#6DBE45] mb-4 block"
        >
            Our Story
        </span>
        <h2
            data-testid="about-title"
            className="text-3xl sm:text-4xl lg:text-5xl tracking-tight font-serif text-[#05223D] mb-6"
        >
            A Heavenly Experience Awaits
        </h2>
         <p
            data-testid="about-description"
            className="text-base font-sans leading-relaxed text-[#4A5568] mb-6"
        >
            Nestled in the heart of Bhubaneswar, Cafe Heaven is more than just a café—it's a
            sanctuary where premium coffee meets artisanal delights. Our journey began with a
            simple vision: to create a space where every cup tells a story and every bite brings
            joy.
        </p>
        <p className="text-base font-sans leading-relaxed text-[#4A5568] mb-8">
            We source the finest beans, craft with passion, and serve with love. Whether you're
            here for a quick espresso or a leisurely brunch, we promise an experience that touches
            your soul.
        </p>

        <div className="space-y-4">
            {[
            'Premium Quality Ingredients',
            'Artisan Coffee & Fresh Bakery',
            'Cozy & Aesthetic Ambiance',
            'Exceptional Customer Service',
            ].map((feature, index) => (
            <motion.div
                key={feature}
                data-testid={`about-feature-${index}`}
                initial={{ opacity: 0, x: 20 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                className="flex items-center gap-3"
            >
                <HiCheckCircle className="w-6 h-6 text-[#6DBE45] flex-shrink-0" />
                <span className="text-[#05223D] font-medium">{feature}</span>
            </motion.div>
            ))}
        </div>
        </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;