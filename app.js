let deferredPrompt;
const installBtn = document.getElementById('installBtn');

// Hide button initially (will show when eligible)
installBtn.style.display = 'none';

// Listen for the 'beforeinstallprompt' event
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  installBtn.style.display = 'block'; // show button
});

// When user clicks install button
installBtn.addEventListener('click', async () => {
  installBtn.style.display = 'none';
  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;

  if (outcome === 'accepted') {
    console.log('User accepted installation');
  } else {
    console.log('User dismissed installation');
    installBtn.style.display = 'block'; // show again if dismissed
  }
  deferredPrompt = null;
});

// Hide button once installed
window.addEventListener('appinstalled', () => {
  console.log('App installed successfully');
  installBtn.style.display = 'none';
});
