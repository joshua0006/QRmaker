/**
 * Dashboard sidebar component
 */
import React, { useEffect, useState } from 'react';
import { LogOut } from 'lucide-react';
import { auth, db } from '../../../lib/firebase';
import { useNavigate } from 'react-router-dom';
import CategoryList from './CategoryList';
import { collection, query, where, getDocs } from 'firebase/firestore';

interface SidebarProps {
  selectedCategory: string | null;
  onCategorySelect: (categoryId: string | null) => void;
}

export default function Sidebar({ selectedCategory, onCategorySelect }: SidebarProps) {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch categories from Firestore
  useEffect(() => {
    const fetchCategories = async () => {
      if (!auth.currentUser) return;
      
      try {
        setLoading(true);
        setError(null);
        const q = query(
          collection(db, 'categories'),
          where('userId', '==', auth.currentUser.uid)
        );
        
        const snapshot = await getDocs(q);
        const categoryNames = snapshot.docs.map(doc => doc.data().name);
        
        // Add 'All' as the first option
        setCategories(['all', ...categoryNames]);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setError('Failed to load categories.');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Handle category selection
  const handleCategorySelect = (category: string) => {
    // No Firestore operations here, just pass the category
    onCategorySelect(category === 'all' ? null : category);
  };

  return (
    <div className="w-64 bg-white rounded-lg shadow-lg p-4 h-[calc(100vh-8rem)] sticky top-24">
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Categories</h2>
        </div>
        
        {loading ? (
          <div className="py-4 text-center text-gray-500">Loading categories...</div>
        ) : error ? (
          <div className="py-4 text-center text-red-500">{error}</div>
        ) : (
          <CategoryList
            categories={categories}
            selectedCategory={selectedCategory || 'all'}
            onCategorySelect={handleCategorySelect}
          />
        )}

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