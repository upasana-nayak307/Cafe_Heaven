import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { HiStar } from 'react-icons/hi';

const testimonials = [
  {
    name: 'Priya Sharma',
    role: 'Regular Customer',
    text: 'Daily Cafe is my go-to spot for morning coffee! The ambiance is so cozy and the latte art is absolutely beautiful. It feels like a little escape from the busy city life.',
    rating: 5,
  },
  {
    name: 'Rahul Patel',
    role: 'Food Blogger',
    text: 'The pizza here is exceptional! Authentic flavors, fresh ingredients, and that perfect crispy crust. Plus, their desserts are to die for. Highly recommend the tiramisu!',
    rating: 5,
  },
  {
    name: 'Ananya Das',
    role: 'Coffee Enthusiast',
    text: 'Best cafe in Bhubaneswar, hands down. The staff is friendly, the coffee is perfectly brewed, and the bakery items are always fresh. My favorite weekend spot!',
    rating: 5,
  },
  {
    name: 'Vikram Singh',
    role: 'Local Resident',
    text: 'What a gem! The attention to detail in every dish is remarkable. The atmosphere is perfect for both work and relaxation. Daily Cafe truly lives up to its name.',
    rating: 5,
  },
];

const Testimonials = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [current, setCurrent] = useState(0);

  return (
    <section
      id="testimonials"
      data-testid="testimonials-section"
      ref={ref}
      className="py-24 md:py-32 bg-white"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span
            data-testid="testimonials-label"
            className="text-sm uppercase tracking-[0.2em] font-medium text-[#6DBE45] mb-4 block"
          >
            Testimonials
          </span>
          <h2
            data-testid="testimonials-title"
            className="text-3xl sm:text-4xl lg:text-5xl tracking-tight font-serif text-[#05223D] mb-4"
          >
            What Our Guests Say
          </h2>
          <p className="text-base font-sans leading-relaxed text-[#4A5568] max-w-2xl mx-auto">
            Real experiences from our beloved customers
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
            <div className="relative w-full max-w-5xl mx-auto">

                {/* LEFT ARROW */}
                <button
                    onClick={() =>
                    setCurrent((prev) =>
                        prev === 0 ? testimonials.length - 1 : prev - 1
                    )
                    }
                    className="absolute -left-6 md:-left-10 top-1/2 -translate-y-1/2 
                            w-10 h-10 flex items-center justify-center 
                            rounded-full border border-gray-300 
                            bg-white text-gray-700 
                            shadow-sm hover:bg-gray-100 transition z-10"
                >
                    <i className="fa-solid fa-arrow-left text-sm"></i>
                </button>

                {/* RIGHT ARROW */}
                <button
                    onClick={() =>
                    setCurrent((prev) =>
                        prev === testimonials.length - 1 ? 0 : prev + 1
                    )
                    }
                    className="absolute -right-6 md:-right-10 top-1/2 -translate-y-1/2 
                            w-10 h-10 flex items-center justify-center 
                            rounded-full border border-gray-300 
                            bg-white text-gray-700 
                            shadow-sm hover:bg-gray-100 transition z-10"
                >
                    <i className="fa-solid fa-arrow-right text-sm"></i>
                </button>

                {/* SLIDER */}
                <div className="overflow-hidden">
                    <div
                    className="flex transition-transform duration-500"
                    style={{ transform: `translateX(-${current * 100}%)` }}
                    >
                    {testimonials.map((testimonial, index) => (
                        <div key={index} className="w-full md:w-1/2 flex-shrink-0 p-3">
                        
                        <div className="bg-[#FAFAFA] rounded-2xl p-8 h-full border border-[#0A4D8C]/5 hover:shadow-xl transition-all duration-300">

                            <div className="flex gap-1 mb-4">
                            {[...Array(testimonial.rating)].map((_, i) => (
                                <HiStar key={i} className="w-5 h-5 text-[#6DBE45]" />
                            ))}
                            </div>

                            <p className="text-[#05223D] font-serif italic text-lg mb-6 leading-relaxed">
                            "{testimonial.text}"
                            </p>

                            <div>
                            <p className="font-semibold text-[#05223D]">{testimonial.name}</p>
                            <p className="text-sm text-[#4A5568]">{testimonial.role}</p>
                            </div>

                        </div>

                        </div>
                    ))}
                    </div>
                </div>

            </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;