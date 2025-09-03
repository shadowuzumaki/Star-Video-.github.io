// Star Video Player - God Level JavaScript
class StarVideoPlayer {
    constructor() {
        this.video = document.getElementById('moviePlayer');
        this.playPauseBtn = document.getElementById('playPauseBtn');
        this.bigPlayBtn = document.getElementById('bigPlayBtn');
        this.progressBar = document.getElementById('progressBar');
        this.progressFilled = document.getElementById('progressFilled');
        this.progressHandle = document.getElementById('progressHandle');
        this.currentTimeEl = document.getElementById('currentTime');
        this.durationEl = document.getElementById('duration');
        this.volumeBtn = document.getElementById('volumeBtn');
        this.volumeSlider = document.getElementById('volumeSlider');
        this.speedBtn = document.getElementById('speedBtn');
        this.fullscreenToggle = document.getElementById('fullscreenToggle');
        this.videoControls = document.getElementById('videoControls');
        this.playOverlay = document.getElementById('playOverlay');
        this.videoLoading = document.getElementById('videoLoading');
        this.settingsBtn = document.getElementById('settingsBtn');
        this.settingsModal = document.getElementById('settingsModal');
        this.closeModal = document.getElementById('closeModal');
        
        this.isPlaying = false;
        this.isDragging = false;
        this.controlsTimeout = null;
        this.currentSpeed = 1;
        this.isFullscreen = false;
        
        this.init();
        this.createParticles();
    }

    init() {
        // Remove loading screen after 2 seconds
        setTimeout(() => {
            document.getElementById('loading').style.opacity = '0';
            setTimeout(() => {
                document.getElementById('loading').style.display = 'none';
            }, 500);
        }, 2000);

        // Event listeners
        this.video.addEventListener('loadedmetadata', () => this.updateDuration());
        this.video.addEventListener('timeupdate', () => this.updateProgress());
        this.video.addEventListener('play', () => this.onPlay());
        this.video.addEventListener('pause', () => this.onPause());
        this.video.addEventListener('waiting', () => this.showLoading());
        this.video.addEventListener('canplay', () => this.hideLoading());
        this.video.addEventListener('ended', () => this.onEnded());

        // Control event listeners
        this.playPauseBtn.addEventListener('click', () => this.togglePlay());
        this.bigPlayBtn.addEventListener('click', () => this.togglePlay());
        this.video.addEventListener('click', () => this.togglePlay());
        
        this.progressBar.addEventListener('click', (e) => this.seek(e));
        this.progressBar.addEventListener('mousedown', (e) => this.startDrag(e));
        document.addEventListener('mousemove', (e) => this.drag(e));
        document.addEventListener('mouseup', () => this.endDrag());

        this.volumeBtn.addEventListener('click', () => this.toggleMute());
        this.volumeSlider.addEventListener('input', (e) => this.setVolume(e.target.value));
        
        this.speedBtn.addEventListener('click', () => this.cycleSpeed());
        this.fullscreenToggle.addEventListener('click', () => this.toggleFullscreen());
        
        document.getElementById('rewindBtn').addEventListener('click', () => this.rewind());
        document.getElementById('forwardBtn').addEventListener('click', () => this.forward());

        // Settings modal
        this.settingsBtn.addEventListener('click', () => this.showSettings());
        this.closeModal.addEventListener('click', () => this.hideSettings());
        this.settingsModal.addEventListener('click', (e) => {
            if (e.target === this.settingsModal) this.hideSettings();
        });

        // Settings controls
        document.getElementById('qualitySelect').addEventListener('change', (e) => this.changeQuality(e.target.value));
        document.getElementById('speedSelect').addEventListener('change', (e) => this.changeSpeed(e.target.value));
        document.getElementById('subtitleSelect').addEventListener('change', (e) => this.changeSubtitles(e.target.value));

        // Keyboard controls
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));

        // Mouse movement for controls
        document.addEventListener('mousemove', () => this.showControls());
        
        // Touch events for mobile
        this.video.addEventListener('touchstart', () => this.togglePlay());
        
        // Auto-hide controls
        this.autoHideControls();
    }

    togglePlay() {
        if (this.video.paused) {
            this.video.play();
        } else {
            this.video.pause();
        }
    }

    onPlay() {
        this.isPlaying = true;
        this.playPauseBtn.innerHTML = '<i class="bx bx-pause"></i>';
        this.playOverlay.classList.add('hide');
        this.addPlayingEffects();
    }

    onPause() {
        this.isPlaying = false;
        this.playPauseBtn.innerHTML = '<i class="bx bx-play"></i>';
        this.removePlayingEffects();
    }

    onEnded() {
        this.isPlaying = false;
        this.playPauseBtn.innerHTML = '<i class="bx bx-play"></i>';
        this.playOverlay.classList.remove('hide');
        this.removePlayingEffects();
        this.showReplayEffect();
    }

    updateDuration() {
        const duration = this.formatTime(this.video.duration);
        this.durationEl.textContent = duration;
    }

    updateProgress() {
        if (!this.isDragging) {
            const progress = (this.video.currentTime / this.video.duration) * 100;
            this.progressFilled.style.width = `${progress}%`;
            this.progressHandle.style.left = `${progress}%`;
        }
        
        const currentTime = this.formatTime(this.video.currentTime);
        this.currentTimeEl.textContent = currentTime;
    }

    seek(e) {
        const rect = this.progressBar.getBoundingClientRect();
        const pos = (e.clientX - rect.left) / rect.width;
        this.video.currentTime = pos * this.video.duration;
        this.createSeekEffect(e.clientX - rect.left);
    }

    startDrag(e) {
        this.isDragging = true;
        this.seek(e);
    }

    drag(e) {
        if (this.isDragging) {
            this.seek(e);
        }
    }

    endDrag() {
        this.isDragging = false;
    }

    toggleMute() {
        if (this.video.muted) {
            this.video.muted = false;
            this.volumeBtn.innerHTML = '<i class="bx bx-volume-full"></i>';
            this.volumeSlider.value = this.video.volume * 100;
        } else {
            this.video.muted = true;
            this.volumeBtn.innerHTML = '<i class="bx bx-volume-mute"></i>';
        }
        this.createVolumeEffect();
    }

    setVolume(value) {
        this.video.volume = value / 100;
        this.video.muted = false;
        
        if (value == 0) {
            this.volumeBtn.innerHTML = '<i class="bx bx-volume-mute"></i>';
        } else if (value < 50) {
            this.volumeBtn.innerHTML = '<i class="bx bx-volume-low"></i>';
        } else {
            this.volumeBtn.innerHTML = '<i class="bx bx-volume-full"></i>';
        }
    }

    cycleSpeed() {
        const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];
        const currentIndex = speeds.indexOf(this.currentSpeed);
        const nextIndex = (currentIndex + 1) % speeds.length;
        this.currentSpeed = speeds[nextIndex];
        this.video.playbackRate = this.currentSpeed;
        this.speedBtn.textContent = `${this.currentSpeed}x`;
        this.createSpeedEffect();
    }

    changeSpeed(speed) {
        this.currentSpeed = parseFloat(speed);
        this.video.playbackRate = this.currentSpeed;
        this.speedBtn.textContent = `${this.currentSpeed}x`;
    }

    rewind() {
        this.video.currentTime = Math.max(0, this.video.currentTime - 10);
        this.createRewindEffect();
    }

    forward() {
        this.video.currentTime = Math.min(this.video.duration, this.video.currentTime + 10);
        this.createForwardEffect();
    }

    toggleFullscreen() {
        if (!this.isFullscreen) {
            if (document.documentElement.requestFullscreen) {
                document.documentElement.requestFullscreen();
            }
            this.fullscreenToggle.innerHTML = '<i class="bx bx-exit-fullscreen"></i>';
            this.isFullscreen = true;
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
            this.fullscreenToggle.innerHTML = '<i class="bx bx-fullscreen"></i>';
            this.isFullscreen = false;
        }
    }

    showSettings() {
        this.settingsModal.classList.add('show');
    }

    hideSettings() {
        this.settingsModal.classList.remove('show');
    }

    changeQuality(quality) {
        // Simulate quality change
        console.log(`Quality changed to: ${quality}`);
        this.createQualityEffect(quality);
    }

    changeSubtitles(subtitle) {
        // Simulate subtitle change
        console.log(`Subtitles changed to: ${subtitle}`);
    }

    showLoading() {
        this.videoLoading.classList.add('show');
    }

    hideLoading() {
        this.videoLoading.classList.remove('show');
    }

    showControls() {
        this.videoControls.classList.add('show');
        clearTimeout(this.controlsTimeout);
        this.autoHideControls();
    }

    autoHideControls() {
        this.controlsTimeout = setTimeout(() => {
            if (this.isPlaying) {
                this.videoControls.classList.remove('show');
            }
        }, 3000);
    }

    handleKeyboard(e) {
        switch(e.code) {
            case 'Space':
                e.preventDefault();
                this.togglePlay();
                break;
            case 'ArrowLeft':
                e.preventDefault();
                this.rewind();
                break;
            case 'ArrowRight':
                e.preventDefault();
                this.forward();
                break;
            case 'ArrowUp':
                e.preventDefault();
                this.setVolume(Math.min(100, this.video.volume * 100 + 10));
                this.volumeSlider.value = this.video.volume * 100;
                break;
            case 'ArrowDown':
                e.preventDefault();
                this.setVolume(Math.max(0, this.video.volume * 100 - 10));
                this.volumeSlider.value = this.video.volume * 100;
                break;
            case 'KeyF':
                e.preventDefault();
                this.toggleFullscreen();
                break;
            case 'KeyM':
                e.preventDefault();
                this.toggleMute();
                break;
        }
    }

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    // Visual Effects
    addPlayingEffects() {
        document.body.style.background = 'linear-gradient(135deg, #000000, #1a0a1a)';
        this.createPlayEffect();
    }

    removePlayingEffects() {
        document.body.style.background = '#000000';
    }

    createPlayEffect() {
        const effect = document.createElement('div');
        effect.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            width: 100px;
            height: 100px;
            background: radial-gradient(circle, rgba(255,46,99,0.8), transparent);
            border-radius: 50%;
            transform: translate(-50%, -50%) scale(0);
            animation: playPulse 0.6s ease-out;
            pointer-events: none;
            z-index: 1000;
        `;
        
        document.body.appendChild(effect);
        
        setTimeout(() => effect.remove(), 600);
    }

    createSeekEffect(x) {
        const effect = document.createElement('div');
        effect.style.cssText = `
            position: absolute;
            top: -20px;
            left: ${x}px;
            width: 4px;
            height: 40px;
            background: linear-gradient(to bottom, #ff2e63, transparent);
            transform: translateX(-50%);
            animation: seekPulse 0.3s ease-out;
            pointer-events: none;
        `;
        
        this.progressBar.appendChild(effect);
        setTimeout(() => effect.remove(), 300);
    }

    createVolumeEffect() {
        const effect = document.createElement('div');
        effect.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            width: 60px;
            height: 60px;
            background: rgba(255,46,99,0.2);
            border: 2px solid #ff2e63;
            border-radius: 50%;
            transform: translate(-50%, -50%) scale(0);
            animation: volumePulse 0.4s ease-out;
            pointer-events: none;
            z-index: 1000;
        `;
        
        document.body.appendChild(effect);
        setTimeout(() => effect.remove(), 400);
    }

    createSpeedEffect() {
        const effect = document.createElement('div');
        effect.innerHTML = `${this.currentSpeed}x`;
        effect.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            color: #ff2e63;
            font-size: 48px;
            font-weight: bold;
            transform: translate(-50%, -50%) scale(0);
            animation: speedPulse 0.5s ease-out;
            pointer-events: none;
            z-index: 1000;
        `;
        
        document.body.appendChild(effect);
        setTimeout(() => effect.remove(), 500);
    }

    createRewindEffect() {
        this.createSkipEffect('⏪', 'left');
    }

    createForwardEffect() {
        this.createSkipEffect('⏩', 'right');
    }

    createSkipEffect(icon, direction) {
        const effect = document.createElement('div');
        effect.innerHTML = icon;
        effect.style.cssText = `
            position: fixed;
            top: 50%;
            ${direction}: 30%;
            font-size: 48px;
            color: #ff2e63;
            transform: translateY(-50%) scale(0);
            animation: skipPulse 0.5s ease-out;
            pointer-events: none;
            z-index: 1000;
        `;
        
        document.body.appendChild(effect);
        setTimeout(() => effect.remove(), 500);
    }

    createQualityEffect(quality) {
        const effect = document.createElement('div');
        effect.innerHTML = quality;
        effect.style.cssText = `
            position: fixed;
            top: 20%;
            right: 20px;
            color: #ff2e63;
            font-size: 24px;
            font-weight: bold;
            background: rgba(0,0,0,0.8);
            padding: 10px 20px;
            border-radius: 20px;
            border: 2px solid #ff2e63;
            transform: translateX(100px);
            animation: slideInRight 0.5s ease-out;
            pointer-events: none;
            z-index: 1000;
        `;
        
        document.body.appendChild(effect);
        setTimeout(() => effect.remove(), 2000);
    }

    showReplayEffect() {
        const effect = document.createElement('div');
        effect.innerHTML = '🔄';
        effect.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            font-size: 64px;
            transform: translate(-50%, -50%) rotate(0deg);
            animation: replayRotate 1s ease-out;
            pointer-events: none;
            z-index: 1000;
        `;
        
        document.body.appendChild(effect);
        setTimeout(() => effect.remove(), 1000);
    }

    createParticles() {
        const particlesContainer = document.getElementById('particles');
        
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 8 + 's';
            particle.style.animationDuration = (Math.random() * 3 + 5) + 's';
            particlesContainer.appendChild(particle);
        }
    }
}

// CSS Animations
const style = document.createElement('style');
style.textContent = `
    @keyframes playPulse {
        0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
        100% { transform: translate(-50%, -50%) scale(2); opacity: 0; }
    }
    
    @keyframes seekPulse {
        0% { transform: translateX(-50%) scaleY(0); opacity: 1; }
        100% { transform: translateX(-50%) scaleY(1); opacity: 0; }
    }
    
    @keyframes volumePulse {
        0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
        100% { transform: translate(-50%, -50%) scale(1.5); opacity: 0; }
    }
    
    @keyframes speedPulse {
        0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
        50% { transform: translate(-50%, -50%) scale(1.2); opacity: 1; }
        100% { transform: translate(-50%, -50%) scale(1); opacity: 0; }
    }
    
    @keyframes skipPulse {
        0% { transform: translateY(-50%) scale(0); opacity: 1; }
        50% { transform: translateY(-50%) scale(1.2); opacity: 1; }
        100% { transform: translateY(-50%) scale(1); opacity: 0; }
    }
    
    @keyframes slideInRight {
        0% { transform: translateX(100px); opacity: 0; }
        100% { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes replayRotate {
        0% { transform: translate(-50%, -50%) rotate(0deg) scale(0); opacity: 1; }
        50% { transform: translate(-50%, -50%) rotate(180deg) scale(1.2); opacity: 1; }
        100% { transform: translate(-50%, -50%) rotate(360deg) scale(1); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Initialize player when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new StarVideoPlayer();
});

// Add some extra movie data
const movieData = {
    title: "Jumanji: Welcome to the Jungle",
    year: 2017,
    rating: "PG-13",
    duration: "119 min",
    genre: "Action, Adventure, Comedy",
    description: "Four teenagers are sucked into a magical video game, and the only way they can escape is to work together to finish the game.",
    poster: "Images/movie-1.jpg",
    videoSources: [
        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
    ]
};

// Update page with movie data
document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.movie-title').textContent = movieData.title;
    document.querySelector('.year').textContent = movieData.year;
    document.querySelector('.rating').textContent = movieData.rating;
    document.querySelector('.duration').textContent = movieData.duration;
    document.querySelector('.genre').textContent = movieData.genre;
    document.querySelector('.movie-description').textContent = movieData.description;
});