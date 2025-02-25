/**
 * Authentication modal component with login, signup and password reset
 */
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { auth, db } from '../../lib/firebase';
import { doc, setDoc, collection, addDoc } from 'firebase/firestore';
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail
} from 'firebase/auth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AuthMode = 'signin' | 'signup' | 'reset';

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'signin') {
        await signInWithEmailAndPassword(auth, email, password);
        onClose();
      } else if (mode === 'signup') {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        
        // Create user document and default categories
        const userRef = doc(db, 'users', userCredential.user.uid);
        await setDoc(userRef, {
          email: userCredential.user.email,
          createdAt: new Date(),
          role: 'user'
        });

        // Create default categories
        const categoriesRef = collection(db, 'categories');
        const defaultCategories = [
          { name: 'Marketing', color: '#4F46E5', description: 'Marketing QR codes' },
          { name: 'Products', color: '#059669', description: 'Product QR codes' },
          { name: 'Social Media', color: '#DC2626', description: 'Social media QR codes' }
        ];

        // Create categories in parallel
        await Promise.all(defaultCategories.map(category => 
          addDoc(categoriesRef, {
            ...category,
            userId: userCredential.user.uid,
            createdAt: new Date()
          })
        ));
        
        onClose();
      } else if (mode === 'reset') {
        await sendPasswordResetEmail(auth, email);
        setResetSent(true);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
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

        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {mode === 'signin' ? 'Welcome Back' : 
             mode === 'signup' ? 'Create Account' : 
             'Reset Password'}
          </h2>
          <p className="text-gray-600 mt-1">
            {mode === 'signin' ? 'Sign in to manage your QR codes' :
             mode === 'signup' ? 'Get started with QR Maker' :
             'Enter your email to reset your password'}
          </p>
        </div>

        {mode === 'reset' && resetSent ? (
          <div className="text-center">
            <p className="text-green-600 mb-4">
              Password reset email sent! Check your inbox.
            </p>
            <button
              onClick={() => {
                setMode('signin');
                setResetSent(false);
              }}
              className="text-indigo-600 hover:text-indigo-700"
            >
              Return to sign in
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>

            {mode !== 'reset' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
            )}

            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Please wait...' : 
               mode === 'signin' ? 'Sign In' :
               mode === 'signup' ? 'Sign Up' :
               'Reset Password'}
            </button>

            <div className="text-center space-y-2">
              {mode === 'signin' && (
                <>
                  <button
                    type="button"
                    onClick={() => setMode('reset')}
                    className="text-sm text-indigo-600 hover:text-indigo-700"
                  >
                    Forgot password?
                  </button>
                  <p className="text-sm text-gray-600">
                    Don't have an account?{' '}
                    <button
                      type="button"
                      onClick={() => setMode('signup')}
                      className="text-indigo-600 hover:text-indigo-700"
                    >
                      Sign up
                    </button>
                  </p>
                </>
              )}
              {mode === 'signup' && (
                <p className="text-sm text-gray-600">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setMode('signin')}
                    className="text-indigo-600 hover:text-indigo-700"
                  >
                    Sign in
                  </button>
                </p>
              )}
              {mode === 'reset' && (
                <button
                  type="button"
                  onClick={() => setMode('signin')}
                  className="text-sm text-indigo-600 hover:text-indigo-700"
                >
                  Return to sign in
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
}