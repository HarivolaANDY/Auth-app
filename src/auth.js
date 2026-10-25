import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
  onAuthStateChanged
} from "firebase/auth";
import { getFirestore, setDoc, doc } from "firebase/firestore";
import { app } from "./firebaseConfig";
import "./ui.js";
import { initTheme } from "./theme.js";

// Initialize Dark/Light theme
initTheme();

const auth = getAuth(app);
const db = getFirestore(app);

// Keep track of active message timers to prevent race conditions
const messageTimers = new Map();

function showMessage(message, divId, type = 'info') {
  const messageDiv = document.getElementById(divId);
  if (!messageDiv) {
    console.error(`Element with id ${divId} not found`);
    return;
  }

  // Clear pending timers for this div if another message is displayed
  if (messageTimers.has(divId)) {
    clearTimeout(messageTimers.get(divId));
    messageTimers.delete(divId);
  }

  const styles = {
    success: ['bg-emerald-50', 'text-emerald-800', 'border-emerald-200', 'dark:bg-emerald-950/50', 'dark:text-emerald-300', 'dark:border-emerald-800/60'],
    error: ['bg-rose-50', 'text-rose-800', 'border-rose-200', 'dark:bg-rose-950/50', 'dark:text-rose-300', 'dark:border-rose-800/60'],
    info: ['bg-blue-50', 'text-blue-800', 'border-blue-200', 'dark:bg-blue-950/50', 'dark:text-blue-300', 'dark:border-blue-800/60'],
  };

  const allStyleClasses = Object.values(styles).flat();
  messageDiv.classList.remove(...allStyleClasses, 'hidden', 'opacity-0', 'translate-y-1');

  const activeClasses = styles[type] || styles.info;
  messageDiv.classList.add('block', 'opacity-100', 'translate-y-0', ...activeClasses);
  messageDiv.textContent = message;

  const timerId = setTimeout(() => {
    messageDiv.classList.remove('opacity-100', 'translate-y-0');
    messageDiv.classList.add('opacity-0', 'translate-y-1');

    const hideTimer = setTimeout(() => {
      messageDiv.classList.add('hidden');
      messageDiv.classList.remove('block', ...activeClasses);
      messageTimers.delete(divId);
    }, 250);
    messageTimers.set(divId, hideTimer);
  }, 5000);

  messageTimers.set(divId, timerId);
}

function getFriendlyErrorMessage(error, defaultMsg = 'An unexpected error occurred.') {
  if (!error || !error.code) return defaultMsg;
  switch (error.code) {
    case 'auth/email-already-in-use':
      return 'This email address is already in use.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/operation-not-allowed':
      return 'Email/password sign-in is not enabled in Firebase Console.';
    case 'auth/weak-password':
      return 'Password is too weak. Please use at least 6 characters.';
    case 'auth/user-disabled':
      return 'This user account has been disabled.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Invalid email or password.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please try again later.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your internet connection.';
    case 'auth/missing-api-key':
    case 'auth/invalid-api-key':
      return 'Firebase API key is missing or invalid. Check your .env configuration.';
    default:
      return error.message || defaultMsg;
  }
}

function setButtonLoading(button, loading) {
  if (!button) return;
  if (loading) {
    button.dataset.originalText = button.textContent;
    button.disabled = true;
    button.textContent = 'Loading...';
    button.classList.add('opacity-65', 'cursor-not-allowed');
  } else {
    if (button.dataset.originalText) {
      button.textContent = button.dataset.originalText;
    }
    button.disabled = false;
    button.classList.remove('opacity-65', 'cursor-not-allowed');
  }
}

// Redirect to home if user is already authenticated
onAuthStateChanged(auth, (user) => {
  if (user && localStorage.getItem('loggedInUser')) {
    const path = window.location.pathname;
    if (path.endsWith('index.html') || path.endsWith('/') || path === '') {
      window.location.href = 'home.html';
    }
  }
});

// Sign Up Handler
const signUpForm = document.getElementById("signUpForm");
const signUpFormBtn = document.getElementById("submitSignUp");

async function handleSignUp(event) {
  if (event) event.preventDefault();

  const emailInput = document.getElementById("rEmail");
  const passwordInput = document.getElementById("rPassword");
  const firstNameInput = document.getElementById("fName");
  const lastNameInput = document.getElementById("lName");

  const email = emailInput ? emailInput.value.trim().toLowerCase() : '';
  const password = passwordInput ? passwordInput.value : '';
  const firstName = firstNameInput ? firstNameInput.value.trim() : '';
  const lastName = lastNameInput ? lastNameInput.value.trim() : '';

  if (!firstName || !lastName || !email || !password) {
    showMessage('Please fill in all fields.', 'signUpMessage', 'error');
    return;
  }

  if (password.length < 6) {
    showMessage('Password should be at least 6 characters.', 'signUpMessage', 'error');
    return;
  }

  setButtonLoading(signUpFormBtn, true);

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update Auth profile with display name
    try {
      await updateProfile(user, {
        displayName: `${firstName} ${lastName}`.trim()
      });
    } catch (profileErr) {
      console.warn("Could not update auth profile display name:", profileErr);
    }

    // Save profile to Firestore
    try {
      const docRef = doc(db, "users", user.uid);
      await setDoc(docRef, {
        email,
        fName: firstName,
        lName: lastName,
        createdAt: new Date().toISOString()
      });
    } catch (fsErr) {
      console.warn("Could not write profile to Firestore:", fsErr);
    }

    localStorage.setItem('loggedInUser', user.uid);
    showMessage('Account created successfully! Redirecting...', 'signUpMessage', 'success');

    setTimeout(() => {
      window.location.href = "home.html";
    }, 1200);
  } catch (error) {
    showMessage(getFriendlyErrorMessage(error, 'Sign up failed.'), 'signUpMessage', 'error');
  } finally {
    setButtonLoading(signUpFormBtn, false);
  }
}

if (signUpForm) {
  signUpForm.addEventListener("submit", handleSignUp);
} else if (signUpFormBtn) {
  signUpFormBtn.addEventListener("click", handleSignUp);
}

// Sign In Handler
const signInForm = document.getElementById("signInForm");
const signInBtn = document.getElementById("submitSignIn");

async function handleSignIn(event) {
  if (event) event.preventDefault();

  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");

  const email = emailInput ? emailInput.value.trim().toLowerCase() : '';
  const password = passwordInput ? passwordInput.value : '';

  if (!email || !password) {
    showMessage('Please enter email and password.', 'signInMessage', 'error');
    return;
  }

  setButtonLoading(signInBtn, true);

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    localStorage.setItem('loggedInUser', user.uid);
    window.location.href = "home.html";
  } catch (error) {
    showMessage(getFriendlyErrorMessage(error, 'Sign in failed.'), 'signInMessage', 'error');
  } finally {
    setButtonLoading(signInBtn, false);
  }
}

if (signInForm) {
  signInForm.addEventListener("submit", handleSignIn);
} else if (signInBtn) {
  signInBtn.addEventListener("click", handleSignIn);
}

// Password Recovery Handler
const recoverPasswordLink = document.getElementById("recoverPasswordLink");
if (recoverPasswordLink) {
  recoverPasswordLink.addEventListener("click", async (event) => {
    event.preventDefault();
    const emailInput = document.getElementById("email");
    const email = emailInput ? emailInput.value.trim().toLowerCase() : '';

    if (!email) {
      showMessage('Please enter your email above to recover your password.', 'signInMessage', 'info');
      emailInput?.focus();
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      showMessage('Password reset email sent! Check your inbox.', 'signInMessage', 'success');
    } catch (error) {
      showMessage(getFriendlyErrorMessage(error, 'Failed to send reset email.'), 'signInMessage', 'error');
    }
  });
}

// Social Buttons Placeholder Handler
document.querySelectorAll('button[data-provider], .social-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    const provider = btn.getAttribute('data-provider') || 'social';
    const isSignUp = Boolean(btn.closest('#signup'));
    const targetMessageId = isSignUp ? 'signUpMessage' : 'signInMessage';
    const providerName = provider.charAt(0).toUpperCase() + provider.slice(1);
    showMessage(`${providerName} authentication is not configured yet.`, targetMessageId, 'info');
  });
});
