import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <footer data-testid="footer-section" className="bg-[#05223D] text-white py-16">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          <div>
            <h3 className="text-2xl font-serif font-bold mb-4">Cafe Heaven</h3>
            <p className="text-white/80 leading-relaxed">
              Where every cup tells a story and every bite brings joy. Experience premium coffee
              and artisanal delights in the heart of Bhubaneswar.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Opening Hours</h4>
            <div className="space-y-2 text-white/80">
              <div className="flex justify-between">
                <span>Monday - Friday</span>
                <span className="font-medium text-[#6DBE45]">8:00 AM - 10:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Saturday - Sunday</span>
                <span className="font-medium text-[#6DBE45]">9:00 AM - 11:00 PM</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
            <div className="flex gap-4">
              <a
                data-testid="footer-social-facebook"
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#6DBE45] transition-all duration-300 hover:scale-110"
              >
                <FaFacebook className="w-6 h-6" />
              </a>
              <a
                data-testid="footer-social-instagram"
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#6DBE45] transition-all duration-300 hover:scale-110"
              >
                <FaInstagram className="w-6 h-6" />
              </a>
              <a
                data-testid="footer-social-twitter"
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#6DBE45] transition-all duration-300 hover:scale-110"
              >
                <FaTwitter className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 pt-8 text-center text-white/60">
          <p>&copy; {new Date().getFullYear()} Cafe Heaven. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;