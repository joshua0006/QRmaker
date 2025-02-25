/**
 * Modal component for adding new categories
 */
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { db, auth } from '../../../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { HexColorPicker } from 'react-colorful';

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddCategoryModal({ isOpen, onClose, onSuccess }: AddCategoryModalProps) {
  const [name, setName] = useState('');
  const [color, setColor] = useState('#4F46E5');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Category name is required');
      return;
    }

    try {
      setSaving(true);
      setError('');

      await addDoc(collection(db, 'categories'), {
        name: name.trim(),
        color,
        userId: auth.currentUser?.uid,
        createdAt: new Date()
      });

      onSuccess();
      onClose();
      setName('');
      setColor('#4F46E5');
      setShowColorPicker(false);
    } catch (err) {
      console.error('Error creating category:', err);
      setError('Failed to create category');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Add New Category
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter category name"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category Color
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowColorPicker(!showColorPicker)}
                className="w-full flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:border-indigo-500 transition-colors"
              >
                <div className="w-6 h-6 rounded border border-gray-200" style={{ backgroundColor: color }} />
                <span className="text-gray-700">{color}</span>
              </button>
              {showColorPicker && (
                <div className="absolute z-10 mt-2 bg-white p-2 rounded-lg shadow-lg border border-gray-200">
                  <HexColorPicker 
                color={color} 
                onChange={setColor}
                className="w-full max-w-[200px]"
              />
                </div>
              )}
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              {saving ? 'Creating...' : 'Create Category'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}