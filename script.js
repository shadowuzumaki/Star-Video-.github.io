// Star Video - Main JavaScript with God Level Effects
class StarVideo {
    constructor() {
        this.init();
        this.createParticles();
        this.initSwiper();
        this.addInteractiveEffects();
    }

    init() {
        // Loading animation
        window.addEventListener('load', () => {
            this.hideLoading();
        });

        // Smooth scrolling
        this.initSmoothScroll();
        
        // Search functionality
        this.initSearch();
        
        // Movie interactions
        this.initMovieInteractions();
        
        // Header scroll effect
        this.initHeaderScroll();
        
        // Keyboard shortcuts
        this.initKeyboardShortcuts();
    }

    hideLoading() {
        const loading = document.querySelector('.loading');
        if (loading) {
            loading.style.opacity = '0';
            setTimeout(() => {
                loading.style.display = 'none';
            }, 500);
        }
    }

    initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    initSearch() {
        const searchInput = document.getElementById('search-input');
        const searchIcon = document.querySelector('.search-box i');
        
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.performSearch(e.target.value);
            });

            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.performSearch(e.target.value);
                    this.createSearchEffect();
                }
            });
        }

        if (searchIcon) {
            searchIcon.addEventListener('click', () => {
                this.performSearch(searchInput.value);
                this.createSearchEffect();
            });
        }
    }

    performSearch(query) {
        if (query.trim() === '') return;
        
        console.log(`Searching for: ${query}`);
        
        // Simulate search results
        const movies = document.querySelectorAll('.movie-box');
        movies.forEach(movie => {
            const title = movie.querySelector('.movie-title');
            if (title && title.textContent.toLowerCase().includes(query.toLowerCase())) {
                movie.style.display = 'block';
                this.highlightMovie(movie);
            } else {
                movie.style.display = 'none';
            }
        });
    }

    highlightMovie(movie) {
        movie.style.animation = 'searchHighlight 1s ease-in-out';
        setTimeout(() => {
            movie.style.animation = '';
        }, 1000);
    }

    initMovieInteractions() {
        const movieBoxes = document.querySelectorAll('.movie-box');
        
        movieBoxes.forEach(box => {
            // Hover effects
            box.addEventListener('mouseenter', () => {
                this.createHoverEffect(box);
            });

            // Click effects
            box.addEventListener('click', (e) => {
                if (!e.target.closest('.play-btn')) {
                    this.createClickEffect(box);
                }
            });

            // Play button effects
            const playBtn = box.querySelector('.play-btn');
            if (playBtn) {
                playBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.playMovie(box);
                });
            }
        });
    }

    createHoverEffect(box) {
        const effect = document.createElement('div');
        effect.className = 'hover-effect';
        effect.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: radial-gradient(circle at center, rgba(255,46,99,0.2), transparent);
            pointer-events: none;
            animation: hoverPulse 0.6s ease-out;
            border-radius: 15px;
        `;
        
        box.style.position = 'relative';
        box.appendChild(effect);
        
        setTimeout(() => effect.remove(), 600);
    }

    createClickEffect(box) {
        const rect = box.getBoundingClientRect();
        const effect = document.createElement('div');
        
        effect.style.cssText = `
            position: fixed;
            top: ${rect.top + rect.height/2}px;
            left: ${rect.left + rect.width/2}px;
            width: 20px;
            height: 20px;
            background: #ff2e63;
            border-radius: 50%;
            transform: translate(-50%, -50%) scale(0);
            animation: clickRipple 0.6s ease-out;
            pointer-events: none;
            z-index: 1000;
        `;
        
        document.body.appendChild(effect);
        setTimeout(() => effect.remove(), 600);
    }

    playMovie(box) {
        const title = box.querySelector('.movie-title').textContent;
        
        // Create play effect
        this.createPlayEffect(box);
        
        // Simulate loading
        setTimeout(() => {
            window.open('play-page.html', '_blank', 'width=1200,height=800');
        }, 1000);
    }

    createPlayEffect(box) {
        const rect = box.getBoundingClientRect();
        
        // Create expanding circle
        const circle = document.createElement('div');
        circle.style.cssText = `
            position: fixed;
            top: ${rect.top + rect.height/2}px;
            left: ${rect.left + rect.width/2}px;
            width: 50px;
            height: 50px;
            background: radial-gradient(circle, #ff2e63, transparent);
            border-radius: 50%;
            transform: translate(-50%, -50%) scale(0);
            animation: playExpand 1s ease-out;
            pointer-events: none;
            z-index: 1000;
        `;
        
        document.body.appendChild(circle);
        
        // Create play icon
        const playIcon = document.createElement('div');
        playIcon.innerHTML = '▶';
        playIcon.style.cssText = `
            position: fixed;
            top: ${rect.top + rect.height/2}px;
            left: ${rect.left + rect.width/2}px;
            font-size: 48px;
            color: white;
            transform: translate(-50%, -50%) scale(0);
            animation: playIconPulse 1s ease-out;
            pointer-events: none;
            z-index: 1001;
        `;
        
        document.body.appendChild(playIcon);
        
        setTimeout(() => {
            circle.remove();
            playIcon.remove();
        }, 1000);
    }

    createSearchEffect() {
        const searchBox = document.querySelector('.search-box');
        const effect = document.createElement('div');
        
        effect.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,46,99,0.3), transparent);
            border-radius: 50px;
            animation: searchSweep 0.8s ease-out;
            pointer-events: none;
        `;
        
        searchBox.style.position = 'relative';
        searchBox.appendChild(effect);
        
        setTimeout(() => effect.remove(), 800);
    }

    initHeaderScroll() {
        const header = document.querySelector('header');
        let lastScrollY = window.scrollY;
        
        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            
            if (currentScrollY > 100) {
                header.style.background = 'rgba(6, 18, 30, 0.98)';
                header.style.backdropFilter = 'blur(20px)';
            } else {
                header.style.background = 'rgba(6, 18, 30, 0.95)';
                header.style.backdropFilter = 'blur(20px)';
            }
            
            // Hide/show header on scroll
            if (currentScrollY > lastScrollY && currentScrollY > 200) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }
            
            lastScrollY = currentScrollY;
        });
    }

    initKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + K for search
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                const searchInput = document.getElementById('search-input');
                if (searchInput) {
                    searchInput.focus();
                    this.createSearchEffect();
                }
            }
            
            // Escape to clear search
            if (e.key === 'Escape') {
                const searchInput = document.getElementById('search-input');
                if (searchInput && searchInput.value) {
                    searchInput.value = '';
                    this.performSearch('');
                }
            }
        });
    }

    initSwiper() {
        // Initialize Swiper for popular movies
        if (typeof Swiper !== 'undefined') {
            new Swiper('.popular-content', {
                slidesPerView: 1,
                spaceBetween: 20,
                loop: true,
                autoplay: {
                    delay: 3000,
                    disableOnInteraction: false,
                },
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },
                breakpoints: {
                    640: {
                        slidesPerView: 2,
                    },
                    768: {
                        slidesPerView: 3,
                    },
                    1024: {
                        slidesPerView: 4,
                    },
                },
                effect: 'slide',
                speed: 600,
            });
        }
    }

    addInteractiveEffects() {
        // Add glow effect to buttons
        const buttons = document.querySelectorAll('.watch-btn, .nav-link, .play-btn');
        
        buttons.forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                btn.style.boxShadow = '0 0 20px rgba(255, 46, 99, 0.5)';
            });
            
            btn.addEventListener('mouseleave', () => {
                btn.style.boxShadow = '';
            });
        });

        // Add typing effect to home title
        this.addTypingEffect();
        
        // Add floating animation to elements
        this.addFloatingAnimation();
    }

    addTypingEffect() {
        const homeTitle = document.querySelector('.home-title');
        if (homeTitle) {
            const text = homeTitle.textContent;
            homeTitle.textContent = '';
            
            let i = 0;
            const typeWriter = () => {
                if (i < text.length) {
                    homeTitle.textContent += text.charAt(i);
                    i++;
                    setTimeout(typeWriter, 100);
                }
            };
            
            setTimeout(typeWriter, 1000);
        }
    }

    addFloatingAnimation() {
        const floatingElements = document.querySelectorAll('.movie-box');
        
        floatingElements.forEach((element, index) => {
            element.style.animation = `float ${3 + (index % 3)}s ease-in-out infinite`;
            element.style.animationDelay = `${index * 0.2}s`;
        });
    }

    createParticles() {
        const particlesContainer = document.createElement('div');
        particlesContainer.className = 'particles';
        particlesContainer.id = 'particles';
        document.body.appendChild(particlesContainer);
        
        for (let i = 0; i < 100; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 6 + 's';
            particle.style.animationDuration = (Math.random() * 3 + 3) + 's';
            particlesContainer.appendChild(particle);
        }
    }
}

// CSS Animations
const style = document.createElement('style');
style.textContent = `
    @keyframes hoverPulse {
        0% { opacity: 0; transform: scale(0.8); }
        50% { opacity: 1; transform: scale(1.05); }
        100% { opacity: 0; transform: scale(1.2); }
    }
    
    @keyframes clickRipple {
        0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
        100% { transform: translate(-50%, -50%) scale(4); opacity: 0; }
    }
    
    @keyframes playExpand {
        0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
        100% { transform: translate(-50%, -50%) scale(8); opacity: 0; }
    }
    
    @keyframes playIconPulse {
        0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
        50% { transform: translate(-50%, -50%) scale(1.2); opacity: 1; }
        100% { transform: translate(-50%, -50%) scale(1); opacity: 0; }
    }
    
    @keyframes searchSweep {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
    }
    
    @keyframes searchHighlight {
        0%, 100% { transform: scale(1); box-shadow: none; }
        50% { transform: scale(1.05); box-shadow: 0 0 30px rgba(255, 46, 99, 0.6); }
    }
    
    @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
    }
    
    @keyframes slideInLeft {
        from { opacity: 0; transform: translateX(-100px); }
        to { opacity: 1; transform: translateX(0); }
    }
    
    @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(30px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    .movie-box {
        animation: fadeInUp 0.6s ease-out;
    }
    
    .movie-box:nth-child(even) {
        animation-delay: 0.2s;
    }
    
    .movie-box:nth-child(odd) {
        animation-delay: 0.4s;
    }
`;
document.head.appendChild(style);

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new StarVideo();
});

// Add loading screen
document.addEventListener('DOMContentLoaded', () => {
    if (!document.querySelector('.loading')) {
        const loading = document.createElement('div');
        loading.className = 'loading';
        loading.innerHTML = `
            <div class="loading-spinner"></div>
        `;
        document.body.appendChild(loading);
    }
});

// Add some utility functions
window.StarVideoUtils = {
    // Navigate to movie player
    playMovie: (movieId, movieTitle) => {
        const playerUrl = `play-page.html?movie=${movieId}&title=${encodeURIComponent(movieTitle)}`;
        window.open(playerUrl, '_blank', 'width=1200,height=800,scrollbars=yes,resizable=yes');
    },
    
    // Add to favorites
    addToFavorites: (movieId) => {
        let favorites = JSON.parse(localStorage.getItem('starVideoFavorites') || '[]');
        if (!favorites.includes(movieId)) {
            favorites.push(movieId);
            localStorage.setItem('starVideoFavorites', JSON.stringify(favorites));
            
            // Show notification
            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: linear-gradient(45deg, #ff2e63, #ff6b9d);
                color: white;
                padding: 15px 25px;
                border-radius: 10px;
                z-index: 10000;
                animation: slideInRight 0.5s ease-out;
            `;
            notification.textContent = 'Added to favorites!';
            document.body.appendChild(notification);
            
            setTimeout(() => notification.remove(), 3000);
        }
    },
    
    // Share movie
    shareMovie: (movieTitle, movieUrl) => {
        if (navigator.share) {
            navigator.share({
                title: `Watch ${movieTitle} on Star Video`,
                text: `Check out this amazing movie: ${movieTitle}`,
                url: movieUrl
            });
        } else {
            // Fallback to clipboard
            navigator.clipboard.writeText(movieUrl).then(() => {
                alert('Movie link copied to clipboard!');
            });
        }
    }
};

// Update all play buttons to use the new system
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const playButtons = document.querySelectorAll('.play-btn');
        playButtons.forEach((btn, index) => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const movieBox = btn.closest('.movie-box');
                const movieTitle = movieBox.querySelector('.movie-title').textContent;
                StarVideoUtils.playMovie(index + 1, movieTitle);
            });
        });
    }, 1000);
});