/**
 * Layout component that wraps the entire application
 */
import React from 'react';
import Header from './Header';
import Footer from './Footer';
import AuthModal from '../Auth/AuthModal';
import { useAuthModal } from '../../hooks/useAuthModal';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { isOpen, openModal, closeModal } = useAuthModal();

  return (
    <div className="min-h-screen flex flex-col">
      <Header onAuthClick={openModal} />
      <main className="flex-grow bg-gradient-to-br from-blue-50 to-indigo-50">
        {children}
      </main>
      <Footer />
      <AuthModal isOpen={isOpen} onClose={closeModal} />
    </div>
  );
}