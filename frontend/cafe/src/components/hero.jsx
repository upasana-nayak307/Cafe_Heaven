import { motion } from 'framer-motion';
import { HiArrowRight } from 'react-icons/hi';
import { HiOutlineCalendar } from "react-icons/hi";

const Hero = ({ onBookTableClick }) => {
  const scrollToMenu = () => {
    const element = document.querySelector('#menu');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };
return(
    <section
      id="home"
      data-testid="hero-section"
      className="relative h-screen w-full overflow-hidden"
    >
    <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 
            "url('https://images.unsplash.com/photo-1759050483129-512154ddd640?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1OTN8MHwxfHNlYXJjaHw0fHxjb3p5JTIwbW9kZXJuJTIwY2FmZSUyMGV4dGVyaW9yJTIwYmx1ZSUyMGdyZWVuZXJ5fGVufDB8fHx8MTc3OTcwODY2NXww&ixlib=rb-4.1.0&q=85')",
        }}
      >
        <div className="absolute inset-0 bg-black/30" />
      </div>
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-6 md:px-12 w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-3xl"
          >
            <motion.h1
              data-testid="hero-title"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-4xl sm:text-5xl lg:text-6xl tracking-tight font-serif text-white font-bold mb-6 leading-tight"
            >
              Welcome to Cafe Heaven
            </motion.h1>

            <motion.p
              data-testid="hero-subtitle"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-xl sm:text-2xl text-white/90 mb-10 font-sans"
            >
              Feel the Vibe ☕
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <button
                data-testid="hero-explore-menu-btn"
                onClick={scrollToMenu}
                className=" text-white bg-[#0A4D8C] px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:bg-[#0A4D8C] hover:text-white hover:scale-105 shadow-2xl flex items-center justify-center gap-2 group"
              >
                Explore Menu
                <HiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={onBookTableClick}
                className="bg-[#6DBE45] text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:bg-[#58A134] hover:scale-105 shadow-2xl flex items-center gap-2"
              >
                Book a Table
                <HiOutlineCalendar className="w-5 h-5" />
              </button>
            </motion.div>
          </motion.div>
        </div>
      </div>

       <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center p-2">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1.5 h-1.5 bg-white rounded-full"
          />
        </div>
      </motion.div>
    </section>
);
};
export default Hero;