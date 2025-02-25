import React, { useEffect, useState, useRef } from 'react';
import { collection, query, where, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { auth, db } from '../../lib/firebase';
import { Folder, Plus, X, Check, Trash2 } from 'lucide-react';

interface SidebarProps {
  onCategorySelect: (categoryId: string | null) => void;
  selectedCategory: string | null;
  onCategoryUpdate?: () => void;
}

export default function Sidebar({ onCategorySelect, selectedCategory, onCategoryUpdate }: SidebarProps) {
  const [categories, setCategories] = useState<{id: string, name: string}[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDropdown, setShowAddDropdown] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [addingCategory, setAddingCategory] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [deletingCategory, setDeletingCategory] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  
  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowAddDropdown(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const fetchCategories = async () => {
    if (!auth.currentUser) return;
    
    try {
      setLoading(true);
      const q = query(
        collection(db, 'categories'),
        where('userId', '==', auth.currentUser.uid)
      );
      
      const snapshot = await getDocs(q);
      const categoriesData = snapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name
      }));
      
      console.log("Fetched categories:", categoriesData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCategoryClick = (categoryId: string | null) => {
    console.log("Selecting category:", categoryId);
    onCategorySelect(categoryId);
  };
  
  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      setError("Category name cannot be empty");
      return;
    }
    
    if (!auth.currentUser) {
      setError("You must be logged in to add categories");
      return;
    }
    
    // Check for duplicate names
    if (categories.some(cat => cat.name.toLowerCase() === newCategoryName.trim().toLowerCase())) {
      setError("Category with this name already exists");
      return;
    }
    
    try {
      setAddingCategory(true);
      setError(null);
      
      // Add the new category to Firestore
      await addDoc(collection(db, 'categories'), {
        name: newCategoryName.trim(),
        userId: auth.currentUser.uid,
        createdAt: new Date(),
        views: 0
      });
      
      // Refresh the categories list
      await fetchCategories();
      
      // Notify parent component of category update
      if (onCategoryUpdate) onCategoryUpdate();
      
      // Reset the form
      setNewCategoryName('');
      setShowAddDropdown(false);
    } catch (error) {
      console.error("Error adding category:", error);
      setError("Failed to add category. Please try again.");
    } finally {
      setAddingCategory(false);
    }
  };
  
  const handleDeleteCategory = async (categoryId: string) => {
    if (!auth.currentUser) return;
    
    try {
      setDeletingCategory(true);
      
      // Delete the category
      await deleteDoc(doc(db, 'categories', categoryId));
      
      // If the deleted category was selected, switch to "All QR Codes"
      if (selectedCategory === categories.find(c => c.id === categoryId)?.name) {
        onCategorySelect(null);
      }
      
      // Refresh the categories list
      await fetchCategories();
      
      // Notify parent component of category update
      if (onCategoryUpdate) onCategoryUpdate();
      
      // Hide the confirmation dialog
      setShowDeleteConfirm(null);
    } catch (error) {
      console.error("Error deleting category:", error);
      alert("Failed to delete category. Please try again.");
    } finally {
      setDeletingCategory(false);
    }
  };

  return (
    <div className="w-64 shrink-0">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-medium text-gray-500 uppercase tracking-wider text-xs">
            Categories
          </h3>
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowAddDropdown(!showAddDropdown)}
              className="p-1 rounded-md hover:bg-gray-100 transition-colors"
              title="Add Category"
            >
              <Plus className="w-4 h-4 text-gray-500" />
            </button>
            
            {showAddDropdown && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                <div className="p-3">
                  <h4 className="font-medium text-gray-700 mb-2">Add New Category</h4>
                  <div className="mb-3">
                    <input
                      type="text"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      placeholder="Category name"
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => {
                        setShowAddDropdown(false);
                        setNewCategoryName('');
                        setError(null);
                      }}
                      className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddCategory}
                      disabled={addingCategory}
                      className="px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center"
                    >
                      {addingCategory ? (
                        <>
                          <span className="mr-1">Adding</span>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        </>
                      ) : (
                        <>
                          <Check className="w-3 h-3 mr-1" />
                          Add
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="space-y-1">
          {/* All category option */}
          <button
            onClick={() => handleCategoryClick(null)}
            className={`flex items-center w-full px-3 py-2 rounded-lg transition-colors ${
              selectedCategory === null ? 'bg-indigo-100 text-indigo-800' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Folder className="w-5 h-5 mr-2 text-gray-500" />
            <span>All QR Codes</span>
          </button>
          
          {loading ? (
            <div className="p-3 text-gray-500 text-sm">Loading categories...</div>
          ) : categories.length === 0 ? (
            <div className="p-3 text-gray-500 text-sm italic">No categories created yet</div>
          ) : (
            <>
              {categories.map(category => (
                <div key={category.id} className="relative group">
                  <button
                    onClick={() => handleCategoryClick(category.name)}
                    className={`flex items-center w-full px-3 py-2 rounded-lg transition-colors ${
                      selectedCategory === category.name ? 'bg-indigo-100 text-indigo-800' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Folder className="w-5 h-5 mr-2 text-gray-500" />
                    <span className="flex-1 truncate text-left">{category.name}</span>
                  </button>
                  
                  {/* Delete button - appears on hover */}
                  <button 
                    onClick={() => setShowDeleteConfirm(category.id)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1 rounded-full hover:bg-red-100 text-red-500 transition-opacity"
                    title="Delete Category"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  
                  {/* Delete confirmation */}
                  {showDeleteConfirm === category.id && (
                    <div className="absolute right-0 top-0 mt-8 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20 p-3">
                      <p className="text-sm text-gray-600 mb-2">Delete this category?</p>
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setShowDeleteConfirm(null)}
                          className="px-2 py-1 text-xs text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(category.id)}
                          disabled={deletingCategory}
                          className="px-2 py-1 text-xs bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors flex items-center"
                        >
                          {deletingCategory ? (
                            <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            'Delete'
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
} 