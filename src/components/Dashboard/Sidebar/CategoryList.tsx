/**
 * Category list component for the sidebar
 */
import React, { useState, useEffect, useRef } from 'react';
import { Edit2, Trash2, Plus } from 'lucide-react';
import { auth, db } from '../../../lib/firebase';
import { collection, query, where, getDocs, deleteDoc, doc, addDoc, updateDoc } from 'firebase/firestore';
import { HexColorPicker } from 'react-colorful';

interface CategoryListProps {
  selectedCategory: string | null;
  onCategorySelect: (categoryId: string | null) => void;
}

export default function CategoryList({ selectedCategory, onCategorySelect }: CategoryListProps) {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryColor, setNewCategoryColor] = useState('#4F46E5');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const colorPickerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadCategories();

    // Add reload event listener
    const element = listRef.current;
    if (element) {
      element.addEventListener('reload', loadCategories);
      return () => element.removeEventListener('reload', loadCategories);
    }
  }, []);

  useEffect(() => {
    if (isAdding && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isAdding]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (colorPickerRef.current && !colorPickerRef.current.contains(event.target as Node)) {
        setShowColorPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const trackCategoryView = async () => {
      if (!selectedCategory) return;

      try {
        await updateDoc(doc(db, 'categories', selectedCategory), {
          views: (categories.find(c => c.id === selectedCategory)?.views || 0) + 1
        });
      } catch (err) {
        console.error('Error tracking category view:', err);
      }
    };

    trackCategoryView();
  }, [selectedCategory, categories]);

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;

    if (!auth.currentUser) {
      console.error('User not authenticated');
      return;
    }

    try {
      await addDoc(collection(db, 'categories'), {
        name: newCategoryName.trim(),
        color: newCategoryColor,
        userId: auth.currentUser?.uid,
        createdAt: new Date()
      });
      await loadCategories();

      setNewCategoryName('');
      setNewCategoryColor('#4F46E5');
      setIsAdding(false);
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  const loadCategories = async () => {
    if (!auth.currentUser) return;

    setLoading(true);
    
    try {
      const q = query(
        collection(db, 'categories'),
        where('userId', '==', auth.currentUser.uid)
      );
      const snapshot = await getDocs(q);
      const loadedCategories = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })).sort((a, b) => a.name.localeCompare(b.name));
      setCategories(loadedCategories);
    } catch (error) {
      console.error('Error loading categories:', error);
      // Optionally show error to user
      // setError('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (categoryId: string) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;

    try {
      await deleteDoc(doc(db, 'categories', categoryId));
      if (selectedCategory === categoryId) {
        onCategorySelect(null);
      }
      loadCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  // Function to handle category selection without Firestore operations
  const handleCategorySelect = (category: string) => {
    // Just call the parent handler with the category
    onCategorySelect(category);
  };

  if (loading) {
    return (
      <div className="space-y-2 animate-pulse">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-10 bg-gray-100 rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-1 category-list" ref={listRef}>
      <button
        onClick={() => onCategorySelect(null)}
        className={`w-full flex items-center justify-between p-2 rounded-lg transition-colors ${
          selectedCategory === null
            ? 'bg-indigo-50 text-indigo-700'
            : 'hover:bg-gray-50 text-gray-700'
        }`}
      >
        <span className="font-medium">All QR Codes</span>
      </button>
      
      {isAdding ? (
        <div className="p-2 bg-gray-50 rounded-lg space-y-2">
          <input
            ref={inputRef}
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="Category name"
            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <button
                onClick={() => setShowColorPicker(!showColorPicker)}
                className="w-full flex items-center gap-2 px-2 py-1.5 text-sm border border-gray-300 rounded hover:border-indigo-500 transition-colors"
              >
                <div className="w-4 h-4 rounded" style={{ backgroundColor: newCategoryColor }} />
                <span className="text-gray-700 text-sm">{newCategoryColor}</span>
              </button>
              {showColorPicker && (
                <div className="absolute z-10 mt-1" ref={colorPickerRef}>
                  <div className="p-2 bg-white rounded-lg shadow-lg border border-gray-200">
                    <HexColorPicker color={newCategoryColor} onChange={setNewCategoryColor} />
                  </div>
                </div>
              )}
            </div>
            <button
              onClick={handleAddCategory}
              className="px-3 py-1.5 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              Add
            </button>
            <button
              onClick={() => {
                setIsAdding(false);
                setNewCategoryName('');
              }}
              className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsAdding(true)}
          className="w-full flex items-center gap-2 p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
        >
          <Plus size={16} />
          <span className="text-sm">Add Category</span>
        </button>
      )}
      
      {categories.map((category) => (
        <div
          key={category.id}
          className={`group flex items-center justify-between p-2 rounded-lg transition-colors ${
            selectedCategory === category.id
              ? 'bg-indigo-50 text-indigo-700'
              : 'hover:bg-gray-50 text-gray-700'
          }`}
        >
          <button
            onClick={() => handleCategorySelect(category.id)}
            className={`w-full text-left p-2 rounded ${
              selectedCategory === category.id
                ? 'bg-indigo-100 text-indigo-600'
                : 'hover:bg-gray-100'
            }`}
          >
            {category.name}
          </button>
          
          {category.id !== 'all' && (
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  // Handle edit
                }}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <Edit2 size={14} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(category.id);
                }}
                className="p-1 text-gray-400 hover:text-red-600"
              >
                <Trash2 size={14} />
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}