import { isLoggedIn } from '/js/storage/loggedIn.js';

document.addEventListener('DOMContentLoaded', () => {
  const signinBtn = document.getElementById('homepage-mobile-signin');
  if (signinBtn) {
    if (isLoggedIn && isLoggedIn()) {
      signinBtn.style.display = 'none';
    } else {
      signinBtn.style.display = '';
    }
  }
});
