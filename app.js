// Register Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
        try {
            const registration = await navigator.serviceWorker.register('service-worker.js');
            console.log('ServiceWorker registration successful');
            
            // Check if the app is already installed
            checkInstalledStatus();
        } catch (err) {
            console.log('ServiceWorker registration failed: ', err);
            updateInstallStatus('Service worker registration failed', 'text-danger');
        }
    });
}

// DOM Elements
const installButton = document.getElementById('installButton');
const buttonText = document.getElementById('buttonText');
const buttonSpinner = document.getElementById('buttonSpinner');
const installProgress = document.getElementById('installProgress');
const installProgressBar = document.getElementById('installProgressBar');
const installStatus = document.getElementById('installStatus');
const onlineStatus = document.getElementById('onlineStatus');

// Installation Variables
let deferredPrompt;

// Handle install prompt
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    
    // Check if already installed (might have changed since page load)
    checkInstalledStatus();
});

// Install Button Click Handler
installButton.addEventListener('click', async () => {
    if (!deferredPrompt) {
        updateInstallStatus('Installation not available', 'text-warning');
        return;
    }

    try {
        // Show loading state
        buttonText.textContent = 'Installing...';
        buttonSpinner.classList.remove('d-none');
        installButton.disabled = true;
        installProgress.classList.remove('d-none');
        
        // Simulate progress (since actual installation progress isn't available)
        simulateInstallationProgress();
        
        // Trigger installation prompt
        deferredPrompt.prompt();
        
        // Wait for user decision
        const { outcome } = await deferredPrompt.userChoice;
        
        // Handle user decision
        if (outcome === 'accepted') {
            updateInstallStatus('Installation started...', 'text-info');
            
            // Wait a moment to show the progress (since actual installation is instant)
            setTimeout(() => {
                installProgressBar.style.width = '100%';
                updateInstallStatus('Installation complete!', 'text-success');
                
                // Update button to show "Open App" if installed
                checkInstalledStatus();
            }, 1500);
        } else {
            resetInstallButton();
            updateInstallStatus('Installation canceled', 'text-warning');
        }
        
        // Clear the deferred prompt
        deferredPrompt = null;
    } catch (error) {
        console.error('Installation failed:', error);
        resetInstallButton();
        updateInstallStatus('Installation failed', 'text-danger');
    }
});

// Check if the app is already installed
function checkInstalledStatus() {
    // For checking on page load
    if (isAppInstalled()) {
        handleAppInstalled();
    }
    
    // Listen for installation event
    window.addEventListener('appinstalled', () => {
        handleAppInstalled();
    });
}

function isAppInstalled() {
    return window.matchMedia('(display-mode: standalone)').matches || 
           window.navigator.standalone === true;
}

function handleAppInstalled() {
    console.log('App is installed');
    buttonText.textContent = 'Open App';
    buttonSpinner.classList.add('d-none');
    installButton.disabled = false;
    installProgress.classList.add('d-none');
    
    // Change button behavior to open the app
    installButton.onclick = () => {
        window.location.href = window.location.origin;
    };
    
    updateInstallStatus('App is installed and ready to use!', 'text-success');
}

function simulateInstallationProgress() {
    let progress = 0;
    const interval = setInterval(() => {
        progress += 10;
        installProgressBar.style.width = `${progress}%`;
        
        if (progress >= 90) {
            clearInterval(interval);
        }
    }, 300);
}

function resetInstallButton() {
    buttonText.textContent = 'Install App';
    buttonSpinner.classList.add('d-none');
    installButton.disabled = false;
    installProgress.classList.add('d-none');
    installProgressBar.style.width = '0%';
}

function updateInstallStatus(message, textClass) {
    installStatus.textContent = message;
    installStatus.className = textClass;
}

// Check online status
function updateOnlineStatus() {
    if (navigator.onLine) {
        onlineStatus.textContent = 'You are online!';
        onlineStatus.className = 'card-text text-success';
    } else {
        onlineStatus.textContent = 'You are offline - using cached content';
        onlineStatus.className = 'card-text text-danger';
    }
}

// Event listeners for online/offline status
window.addEventListener('online', updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);
updateOnlineStatus(); // Initial check

// Initial check for installed status
checkInstalledStatus();