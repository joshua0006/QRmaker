/**
 * Header component for the QR Maker site
 */
import React, { useEffect, useState } from 'react';
import { QrCode, User, Plus } from 'lucide-react';
import { auth } from '../../lib/firebase';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';

interface HeaderProps {
  onAuthClick: () => void;
}

export default function Header({ onAuthClick }: HeaderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isDashboard = location.pathname === '/dashboard';

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
    });

    return () => unsubscribe();
  }, []);

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-[84rem] mx-auto px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <QrCode className="h-8 w-8 text-indigo-600" />
            <Link to="/" className="text-xl font-bold text-gray-900 hover:text-indigo-600 transition-colors">
              QR Maker
            </Link>
          </div>
          <nav className="flex items-center gap-8">
            {isAuthenticated ? (
              <>
                {isDashboard ? (
                  <Link
                    to="/"
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Create QR Code
                  </Link>
                ) : (
                  <Link
                    to="/dashboard"
                    className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
                  >
                    <User className="w-4 h-4" />
                    Dashboard
                  </Link>
                )}
              </>
            ) : (
              <>
                <Link to="/features" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Features
                </Link>
                <Link to="/pricing" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Pricing
                </Link>
                <button
                  onClick={onAuthClick}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Get Started
                </button>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}