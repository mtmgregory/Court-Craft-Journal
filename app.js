// Main Application Script
import { initAuth, getCurrentUser } from './auth.js';
import { migrateFromLocalStorage } from './firestore-service.js';
import { initializeDarkMode } from './ui-helpers.js';
import { startAutoSave, loadDraft } from './form-handlers.js';
import { toggleMatchFields } from './form-handlers.js';

// Import all other modules to ensure they're loaded
import './history.js';
import './insights.js';
import './export.js';

// Initialize app on load
window.onload = function() {
    // Initialize Firebase Authentication
    initAuth();
    
    // Set today's date
    const dateField = document.getElementById('entryDate');
    if (dateField) {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        dateField.value = `${year}-${month}-${day}`;
    }
    
    // Initialize dark mode
    initializeDarkMode();
    
    // Load draft from Firestore
    loadDraft();
    
    // Start auto-save
    startAutoSave();
    
    // Initialize match fields visibility
    toggleMatchFields();
    
    // Attempt migration from localStorage if needed
    setTimeout(() => {
        if (getCurrentUser()) {
            migrateFromLocalStorage().catch(console.error);
        }
    }, 2000);
};