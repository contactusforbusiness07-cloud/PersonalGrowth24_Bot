// --- 1. FIREBASE SETUP (Imports & Config) ---
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCg7hL0aFYWj7hRtP9cp9nqXYQQPzhHMMc",
    authDomain: "fingamepro.firebaseapp.com",
    projectId: "fingamepro",
    storageBucket: "fingamepro.firebasestorage.app",
    messagingSenderId: "479959446564",
    appId: "1:479959446564:web:1d0d9890d4f5501c4594b1"
};

// Initialize Firebase & Database
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Make DB Global (Taaki dusri files isse use kar sakein)
window.db = db;
console.log("Firebase Connected Successfully!");

// --- 2. GLOBAL NAVIGATION SYSTEM ---
// Note: Window ke sath attach kar rahe hain taaki HTML buttons isse dhoond sakein

window.navigateTo = function(sectionId) {
    console.log("Going to:", sectionId);

    // A. Hide All Main Sections
    document.querySelectorAll('.page-section').forEach(sec => {
        sec.classList.add('hidden');
        sec.classList.remove('active');
    });

    // B. Hide Profile Pages & Container
    document.querySelectorAll('.internal-page').forEach(p => p.classList.add('hidden'));
    const profileContainer = document.getElementById('profile-section-container');
    if(profileContainer) profileContainer.classList.add('hidden');

    // C. Force Close Menu
    toggleProfileMenu(false);

    // D. Show Target Section
    const target = document.getElementById(sectionId);
    if (target) {
        target.classList.remove('hidden');
        target.classList.add('active');
    }

    // E. Update Bottom Nav Icons
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        const attr = item.getAttribute('onclick');
        if(attr && attr.includes(sectionId)) item.classList.add('active');
    });
}

// --- 3. MENU TOGGLE CONTROL ---
window.toggleProfileMenu = function(forceState) {
    const menu = document.getElementById('side-menu');
    const overlay = document.getElementById('menu-overlay');
    if (!menu || !overlay) return;

    // Force Close
    if (forceState === false) {
        menu.classList.remove('open');
        overlay.classList.add('hidden');
        return;
    }
    // Force Open
    if (forceState === true) {
        menu.classList.add('open');
        overlay.classList.remove('hidden');
        return;
    }
    // Toggle
    if (menu.classList.contains('open')) {
        menu.classList.remove('open');
        overlay.classList.add('hidden');
    } else {
        menu.classList.add('open');
        overlay.classList.remove('hidden');
    }
}

// --- 4. APP INIT ---
document.addEventListener('DOMContentLoaded', () => {
    // Default Page
    window.navigateTo('home');
    
    // Telegram Setup
    if (window.Telegram && window.Telegram.WebApp) {
        window.Telegram.WebApp.ready();
        window.Telegram.WebApp.expand();
    }
});

