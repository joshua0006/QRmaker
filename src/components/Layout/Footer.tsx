/**
 * Footer component for the QR Maker site
 */
import React from 'react';
import { QrCode } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <QrCode className="h-6 w-6 text-indigo-600" />
            <span className="text-lg font-semibold text-gray-900">QR Maker</span>
          </div>
          
          <nav className="flex items-center gap-6">
            <Link 
              to="/features" 
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Features
            </Link>
            <Link 
              to="/pricing" 
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Pricing
            </Link>
          </nav>
          
          <div className="text-center md:text-right">
            <p className="text-gray-600">
              Created by{' '}
              <a 
                href="https://www.jezweb.com.au" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-indigo-600 hover:text-indigo-700 transition-colors"
              >
                Jezweb
              </a>
            </p>
            <p className="text-sm text-gray-500 mt-1">
              © {new Date().getFullYear()} All rights reserved
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}