/**
 * Dashboard sidebar component
 */
import React from 'react';
import { LogOut } from 'lucide-react';
import { auth } from '../../../lib/firebase';
import { useNavigate } from 'react-router-dom';
import CategoryList from './CategoryList';

interface SidebarProps {
  selectedCategory: string | null;
  onCategorySelect: (categoryId: string | null) => void;
}

export default function Sidebar({ selectedCategory, onCategorySelect }: SidebarProps) {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="w-64 bg-white rounded-lg shadow-lg p-4 h-[calc(100vh-8rem)] sticky top-24">
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Categories</h2>
        </div>
        
        <CategoryList
          selectedCategory={selectedCategory}
          onCategorySelect={onCategorySelect}
        />

        <div className="mt-auto pt-4 border-t">
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 w-full px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
}