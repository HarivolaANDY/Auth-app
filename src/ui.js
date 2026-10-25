const signUpButton = document.getElementById('signUpButton');
const signInButton = document.getElementById('signInButton');
const signInForm = document.getElementById('signIn');
const signUpForm = document.getElementById('signup');

function showForm(target) {
  // Clear any existing messages when toggling
  const messages = document.querySelectorAll('#signInMessage, #signUpMessage');
  messages.forEach((msg) => {
    msg.classList.add('hidden', 'opacity-0');
    msg.classList.remove('block', 'opacity-100');
    msg.textContent = '';
  });

  if (target === 'signup') {
    if (signInForm) {
      signInForm.classList.add('hidden', 'opacity-0', 'pointer-events-none', 'absolute', 'left-0', 'top-0', 'translate-y-2');
      signInForm.classList.remove('block', 'opacity-100');
      signInForm.setAttribute('aria-hidden', 'true');
    }
    if (signUpForm) {
      signUpForm.classList.remove('hidden', 'opacity-0', 'pointer-events-none', 'absolute', 'left-0', 'top-0', 'translate-y-2');
      signUpForm.classList.add('block', 'opacity-100');
      signUpForm.setAttribute('aria-hidden', 'false');
    }
  } else {
    if (signUpForm) {
      signUpForm.classList.add('hidden', 'opacity-0', 'pointer-events-none', 'absolute', 'left-0', 'top-0', 'translate-y-2');
      signUpForm.classList.remove('block', 'opacity-100');
      signUpForm.setAttribute('aria-hidden', 'true');
    }
    if (signInForm) {
      signInForm.classList.remove('hidden', 'opacity-0', 'pointer-events-none', 'absolute', 'left-0', 'top-0', 'translate-y-2');
      signInForm.classList.add('block', 'opacity-100');
      signInForm.setAttribute('aria-hidden', 'false');
    }
  }
}

if (signUpButton) {
  signUpButton.addEventListener('click', () => {
    showForm('signup');
  });
}

if (signInButton) {
  signInButton.addEventListener('click', () => {
    showForm('signin');
  });
}

// Password visibility toggle with SVG icon update
document.querySelectorAll('.toggle-password').forEach((btn) => {
  btn.addEventListener('click', () => {
    const targetId = btn.getAttribute('data-target');
    const input = document.getElementById(targetId);
    if (!input) return;

    const isPassword = input.type === 'password';
    input.type = isPassword ? 'text' : 'password';

    btn.setAttribute('aria-pressed', String(isPassword));
    btn.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');

    const eyeOpen = btn.querySelector('.icon-eye-open');
    const eyeClosed = btn.querySelector('.icon-eye-closed');
    if (eyeOpen && eyeClosed) {
      if (isPassword) {
        eyeOpen.classList.add('hidden');
        eyeClosed.classList.remove('hidden');
      } else {
        eyeOpen.classList.remove('hidden');
        eyeClosed.classList.add('hidden');
      }
    }
  });
});

export { showForm };
