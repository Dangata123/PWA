// Register Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('service-worker.js')
            .then(registration => {
                console.log('ServiceWorker registration successful');
            })
            .catch(err => {
                console.log('ServiceWorker registration failed: ', err);
            });
    });
}

// Handle install prompt
let deferredPrompt;
const installButton = document.getElementById('installButton');
const installedMessage = document.getElementById('installedMessage');
const onlineStatus = document.getElementById('onlineStatus');

// Hide install button if app is already installed
checkInstalledStatus();

window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault();
    // Stash the event so it can be triggered later
    deferredPrompt = e;
    
    // Check again if the app is already installed
    checkInstalledStatus();
});

installButton.addEventListener('click', async () => {
    if (deferredPrompt) {
        // Show the install prompt
        deferredPrompt.prompt();
        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`User response to the install prompt: ${outcome}`);
        // We no longer need the prompt
        deferredPrompt = null;
    }
});

// Check if the app is already installed
function checkInstalledStatus() {
    window.addEventListener('appinstalled', () => {
        console.log('PWA was installed');
        installButton.classList.add('d-none');
        installedMessage.classList.remove('d-none');
    });
    
    // For checking on page load
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true) {
        console.log('App is installed');
        installButton.classList.add('d-none');
        installedMessage.classList.remove('d-none');
    }
}

// Check online status
function updateOnlineStatus() {
    if (navigator.onLine) {
        onlineStatus.textContent = 'You are online!';
        onlineStatus.classList.remove('text-danger');
        onlineStatus.classList.add('text-success');
    } else {
        onlineStatus.textContent = 'You are offline - using cached content';
        onlineStatus.classList.remove('text-success');
        onlineStatus.classList.add('text-danger');
    }
}

window.addEventListener('online', updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);
updateOnlineStatus(); // Check on initial load