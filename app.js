// Register Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('ServiceWorker registration successful');
            })
            .catch(err => {
                console.log('ServiceWorker registration failed: ', err);
            });
    });
}

// Install Button Functionality
let deferredPrompt;
const installBtn = document.getElementById('installBtn');
const progressContainer = document.getElementById('progressContainer');
const installProgress = document.getElementById('installProgress');
const cancelInstall = document.getElementById('cancelInstall');

// Hide install button by default if not supported
if (!window.matchMedia('(display-mode: standalone)').matches && 
    !window.navigator.standalone &&
    !('BeforeInstallPromptEvent' in window)) {
    installBtn.style.display = 'none';
}

window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault();
    // Stash the event so it can be triggered later
    deferredPrompt = e;
    // Show the install button
    installBtn.style.display = 'block';
    
    installBtn.addEventListener('click', async () => {
        // Hide the install button
        installBtn.style.display = 'none';
        // Show the progress container
        progressContainer.style.display = 'block';
        
        // Simulate progress (in a real app, this would be actual installation progress)
        let progress = 0;
        const progressInterval = setInterval(() => {
            progress += 10;
            installProgress.style.width = `${progress}%`;
            
            if (progress >= 100) {
                clearInterval(progressInterval);
                // Show the install prompt
                deferredPrompt.prompt();
                
                // Wait for the user to respond to the prompt
                deferredPrompt.userChoice.then((choiceResult) => {
                    if (choiceResult.outcome === 'accepted') {
                        console.log('User accepted the install prompt');
                        // Show success message
                        showSuccessToast();
                    } else {
                        console.log('User dismissed the install prompt');
                    }
                    // Reset the deferred prompt variable
                    deferredPrompt = null;
                    // Hide progress container
                    progressContainer.style.display = 'none';
                    // Reset progress
                    installProgress.style.width = '0%';
                });
            }
        }, 200);
    });
});

// Cancel installation
cancelInstall.addEventListener('click', () => {
    progressContainer.style.display = 'none';
    installProgress.style.width = '0%';
    installBtn.style.display = 'block';
});

// Check if the app is already installed
window.addEventListener('appinstalled', () => {
    console.log('PWA was installed');
    installBtn.style.display = 'none';
});

function showSuccessToast() {
    // Create toast element
    const toastEl = document.createElement('div');
    toastEl.className = 'position-fixed bottom-0 end-0 p-3';
    toastEl.style.zIndex = '1100';
    
    toastEl.innerHTML = `
        <div class="toast show" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="toast-header bg-success text-white">
                <strong class="me-auto">Installation Complete</strong>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div class="toast-body">
                The app has been successfully installed to your device!
            </div>
        </div>
    `;
    
    document.body.appendChild(toastEl);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        toastEl.remove();
    }, 5000);
}

// Check if running as standalone PWA
if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) {
    installBtn.style.display = 'none';
}