import React from 'react';
import { Github, Twitter, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6 mt-8 rounded-xl">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm mb-4 md:mb-0">
            © 2024 Secreto Nando. All rights reserved.
          </p>
          <div className="flex space-x-4">
            <a href="https://github.com/kasumabalidps" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400">
              <Github size={16} />
            </a>
            <a href="https://x.com/iputankas2000" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400">
              <Twitter size={16} />
            </a>
            <a href="https://www.instagram.com/iputankas" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400">
              <Instagram size={16} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;