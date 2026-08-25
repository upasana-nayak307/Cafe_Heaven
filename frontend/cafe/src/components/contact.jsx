import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { HiLocationMarker, HiPhone, HiMail } from 'react-icons/hi';
import axios from 'axios';
import { toast } from 'sonner';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Contact = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(`${API}/contact`, formData);
      toast.success('Message sent successfully! We\'ll get back to you soon.');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="contact"
      data-testid="contact-section"
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
            data-testid="contact-label"
            className="text-sm uppercase tracking-[0.2em] font-medium text-[#6DBE45] mb-4 block"
          >
            Get in Touch
          </span>
          <h2
            data-testid="contact-title"
            className="text-3xl sm:text-4xl lg:text-5xl tracking-tight font-serif text-[#05223D] mb-4"
          >
            Visit Us Today
          </h2>
          <p className="text-base font-sans leading-relaxed text-[#4A5568] max-w-2xl mx-auto">
            We'd love to hear from you. Drop by or send us a message!
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8 }}
          >
            <div className="bg-white rounded-2xl p-8 shadow-lg mb-8">
              <h3 className="text-2xl font-serif font-semibold text-[#05223D] mb-6">
                Contact Information
              </h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <HiLocationMarker className="w-6 h-6 text-[#0A4D8C] flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-[#05223D] mb-1">Address</p>
                    <p className="text-[#4A5568]">Saheed Nagar, Bhubaneswar, Odisha 751007</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <HiPhone className="w-6 h-6 text-[#0A4D8C] flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-[#05223D] mb-1">Phone</p>
                    <p className="text-[#4A5568]">+91 987654xxxx</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <HiMail className="w-6 h-6 text-[#0A4D8C] flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-[#05223D] mb-1">Email</p>
                    <p className="text-[#4A5568]">hello@dailycafe.com</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden shadow-lg h-64">
              <iframe
                data-testid="contact-map"
                src='https://maps.app.goo.gl/kjUmwEVpETnLGwW58'
                // src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3742.6267890558947!2d85.83699231490103!3d20.296058986402436!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a1909d2d5170aa5%3A0xfc580e2b68b33fa8!2sSaheed%20Nagar%2C%20Bhubaneswar%2C%20Odisha!5e0!3m2!1sen!2sin!4v1234567890123!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Daily Cafe Location"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.8 }}
          >
            <form
              data-testid="contact-form"
              onSubmit={handleSubmit}
              className="bg-white rounded-2xl p-8 shadow-lg"
            >
              <h3 className="text-2xl font-serif font-semibold text-[#05223D] mb-6">
                Send Us a Message
              </h3>
              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-[#05223D] mb-2"
                  >
                    Name
                  </label>
                  <input
                    data-testid="contact-form-name"
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] focus:border-[#0A4D8C] focus:ring-2 focus:ring-[#0A4D8C]/20 outline-none transition-all"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-[#05223D] mb-2"
                  >
                    Email
                  </label>
                  <input
                    data-testid="contact-form-email"
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] focus:border-[#0A4D8C] focus:ring-2 focus:ring-[#0A4D8C]/20 outline-none transition-all"
                    placeholder="your.email@example.com"
                  />
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-[#05223D] mb-2"
                  >
                    Message
                  </label>
                  <textarea
                    data-testid="contact-form-message"
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    rows={6}
                    className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] focus:border-[#0A4D8C] focus:ring-2 focus:ring-[#0A4D8C]/20 outline-none transition-all resize-none"
                    placeholder="Tell us what you think..."
                  />
                </div>
                <button
                  data-testid="contact-form-submit"
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#0A4D8C] text-white px-6 py-4 rounded-full font-semibold hover:bg-[#073663] transition-all duration-300 hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;