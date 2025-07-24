import React, { useState } from 'react';
import { Github, Linkedin, Twitter, Mail, Phone } from 'lucide-react';

const Footer = () => {
  const [email, setEmail] = useState('');

  const navigationLinks = [
    { name: 'Home', href: '#' },
    { name: 'About', href: '#' },
    { name: 'Interview Questions', href: '#' },
    { name: 'Articles', href: '#' },
    { name: 'Contact', href: '#' }
  ];

  const resourceLinks = [
    { name: 'Terms of Service', href: '#' },
    { name: 'Privacy Policy', href: '#' },
    { name: 'FAQs', href: '#' }
  ];

  const socialLinks = [
    { name: 'GitHub', icon: Github, href: '#' },
    { name: 'LinkedIn', icon: Linkedin, href: '#' },
    { name: 'Twitter', icon: Twitter, href: '#' }
  ];

  const handleNewsletterSubmit = () => {
    // Handle newsletter subscription
    console.log('Newsletter subscription:', email);
    setEmail('');
  };

  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="max-w-7xl mx-auto px-4">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-6">
          
          {/* Logo / App Name Section */}
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-bold text-blue-400 mb-3">StudentSphere</h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your ultimate platform for interview preparation and career development.
            </p>
            
            {/* Newsletter Subscription */}
            <div className="mt-4">
              <h4 className="text-sm font-semibold text-white mb-2">Stay Updated</h4>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="px-3 py-2 bg-gray-800 text-white text-sm rounded border border-gray-700 focus:border-blue-400 focus:outline-none flex-1"
                />
                <button
                  onClick={handleNewsletterSubmit}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors duration-200"
                >
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold mb-3">Navigation</h3>
            <ul className="space-y-2">
              {navigationLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors duration-200 text-sm hover:underline"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Section */}
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold mb-3">Resources</h3>
            <ul className="space-y-2">
              {resourceLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors duration-200 text-sm hover:underline"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Us Section */}
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold mb-3">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-center md:justify-start space-x-2">
                <Mail size={16} className="text-blue-400" />
                <a
                  href="mailto:support@studentsphere.com"
                  className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                >
                  support@studentsphere.com
                </a>
              </div>
              <div className="flex items-center justify-center md:justify-start space-x-2">
                <Phone size={16} className="text-blue-400" />
                <a
                  href="tel:+919876543210"
                  className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                >
                  +91-9876543210
                </a>
              </div>
            </div>

            {/* Social Media Icons */}
            <div className="mt-4">
              <h4 className="text-sm font-semibold text-white mb-2">Follow Us</h4>
              <div className="flex justify-center md:justify-start space-x-4">
                {socialLinks.map((social) => {
                  const IconComponent = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      className="text-gray-400 hover:text-white transition-colors duration-200 transform hover:scale-110"
                      aria-label={social.name}
                    >
                      <IconComponent size={20} />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom divider and copyright */}
        <div className="border-t border-gray-700 pt-4">
          <div className="text-center">
            <p className="text-gray-400 text-sm">
              © 2025 StudentSphere. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;