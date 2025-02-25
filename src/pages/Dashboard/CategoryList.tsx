import React, { useEffect, useState } from 'react';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  doc, 
  updateDoc, 
  increment,
  getDoc 
} from 'firebase/firestore';
import { db, auth } from '../../lib/firebase';

const trackCategoryView = async (categoryId: string) => {
  // Skip tracking for the "all" category since it's not a real document
  if (!categoryId || categoryId === 'all') {
    return;
  }
  
  try {
    const categoryRef = doc(db, 'categories', categoryId);
    // Check if document exists before updating
    const categoryDoc = await getDoc(categoryRef);
    
    if (categoryDoc.exists()) {
      await updateDoc(categoryRef, {
        views: increment(1),
        lastViewed: new Date()
      });
    } else {
      console.warn(`Category with ID ${categoryId} does not exist`);
    }
  } catch (error) {
    console.error('Error tracking category view:', error);
  }
}; 