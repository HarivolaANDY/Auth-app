import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { app } from "./firebaseConfig";
import { initTheme } from "./theme.js";

// Initialize Dark/Light theme
initTheme();

const auth = getAuth(app);

onAuthStateChanged(auth, (user) => {
  if (!user) {
    localStorage.removeItem('loggedInUser');
    window.location.href = "index.html";
  } else {
    const userInfo = document.getElementById('user-info');
    if (userInfo) {
      const displayName = user.displayName || 'Authenticated User';
      const email = user.email || 'No email provided';
      const initial = (user.displayName ? user.displayName.charAt(0) : email.charAt(0)).toUpperCase() || 'U';

      userInfo.innerHTML = `
        <div class="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white font-bold text-2xl flex items-center justify-center mb-4 shadow-lg shadow-indigo-500/25">
          ${initial}
        </div>
        <h1 class="text-xl font-bold text-slate-900 dark:text-white tracking-tight">${escapeHtml(displayName)}</h1>
        <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">${escapeHtml(email)}</p>
      `;
    }
  }
});

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
  logoutBtn.addEventListener('click', async () => {
    try {
      logoutBtn.disabled = true;
      logoutBtn.innerHTML = `
        <svg class="animate-spin w-4 h-4 text-rose-600" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span>Signing out...</span>
      `;
      await signOut(auth);
    } catch (error) {
      console.error('Logout Error:', error);
    } finally {
      localStorage.removeItem('loggedInUser');
      window.location.href = "index.html";
    }
  });
}
