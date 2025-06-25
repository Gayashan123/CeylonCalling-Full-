import { Link } from "react-scroll";

function Footer() {
  return (
    <footer className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-gray-300 py-12">
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
          {/* About */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-4 tracking-wide">About Us</h2>
            <p className="text-gray-400 leading-relaxed max-w-sm mx-auto md:mx-0">
              Discover the best food experiences in your city — curated with care for every palate. Seamless, elegant, and effortless.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-4 tracking-wide">Quick Links</h2>
            <ul className="space-y-3 text-gray-400">
              {[
                { label: "Home", to: "header" },
                { label: "About", to: "about" },
                { label: "Contact", to: "contact" },
                { label: "FAQ", to: "faq" },
              ].map(({ label, to }) => (
                <li key={to}>
                  <Link
                    to={to}
                    smooth={true}
                    duration={500}
                    spy={true}
                    activeClass="text-white font-semibold"
                    className="cursor-pointer hover:text-white transition-colors duration-300"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-4 tracking-wide">Contact Us</h2>
            <ul className="space-y-4 text-gray-400 max-w-xs mx-auto md:mx-0">
              <li className="flex items-center justify-center md:justify-start space-x-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-teal-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 10l9-7 9 7v7a2 2 0 01-2 2H5a2 2 0 01-2-2v-7z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 21V9h6v12" />
                </svg>
                <span>+94 75 206 9762</span>
              </li>
              <li className="flex items-center justify-center md:justify-start space-x-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-teal-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 12h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4a2 2 0 012-2h2m4-7v4m0 0L8 12m4 0l4-3" />
                </svg>
                <span>reservations@restaurant.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 my-10"></div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between text-sm text-gray-500">
          <p>© 2025 CodeGeeks. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            {[
              { href: "#", icon: "bxl-facebook" },
              { href: "#", icon: "bxl-twitter" },
              { href: "#", icon: "bxl-instagram" },
              { href: "#", icon: "bxl-linkedin" },
            ].map(({ href, icon }) => (
              <a
                key={icon}
                href={href}
                className="text-gray-400 hover:text-teal-400 transition-transform transform hover:scale-110"
                aria-label={icon.replace("bxl-", "")}
              >
                <i className={`bx text-2xl ${icon}`}></i>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
