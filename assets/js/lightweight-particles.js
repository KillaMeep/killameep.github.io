class LightweightParticles {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;

        // Default options optimized for performance
        this.options = {
            particleCount: this.getOptimalParticleCount(),
            particleSize: options.particleSize || 2,
            particleSpeed: options.particleSpeed || 0.5,
            particleColor: options.particleColor || '#ffffff',
            connectionDistance: options.connectionDistance || 100,
            connectionOpacity: options.connectionOpacity || 0.3,
            enableConnections: options.enableConnections !== false,
            ...options
        };

        this.particles = [];
        this.animationId = null;
        this.canvas = null;
        this.ctx = null;

        this.init();
    }

    getOptimalParticleCount() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        const area = width * height;
        
        // Very conservative particle count for performance
        if (area < 500000) return 20; // Mobile
        if (area < 1000000) return 30; // Small desktop
        if (area < 2000000) return 50; // Large desktop
        return 60; // Very large screens
    }

    init() {
        this.createCanvas();
        this.createParticles();
        this.animate();
        this.handleResize();
    }

    createCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '1'; // Behind content
        
        this.container.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        
        this.resize();
    }

    createParticles() {
        this.particles = [];
        for (let i = 0; i < this.options.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * this.options.particleSpeed,
                vy: (Math.random() - 0.5) * this.options.particleSpeed
            });
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Update and draw particles
        this.ctx.fillStyle = this.options.particleColor;
        this.particles.forEach(particle => {
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;

            // Bounce off edges
            if (particle.x <= 0 || particle.x >= this.canvas.width) particle.vx *= -1;
            if (particle.y <= 0 || particle.y >= this.canvas.height) particle.vy *= -1;

            // Keep particles in bounds
            particle.x = Math.max(0, Math.min(this.canvas.width, particle.x));
            particle.y = Math.max(0, Math.min(this.canvas.height, particle.y));

            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, this.options.particleSize, 0, Math.PI * 2);
            this.ctx.fill();
        });

        // Draw connections (only if enabled and performance allows)
        if (this.options.enableConnections && this.particles.length < 40) {
            this.drawConnections();
        }

        // Use requestAnimationFrame for smooth animation
        this.animationId = requestAnimationFrame(() => this.animate());
    }

    drawConnections() {
        this.ctx.strokeStyle = this.options.particleColor;
        this.ctx.globalAlpha = this.options.connectionOpacity;
        
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.options.connectionDistance) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }
            }
        }
        
        this.ctx.globalAlpha = 1;
    }

    resize() {
        const rect = this.container.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
    }

    handleResize() {
        window.addEventListener('resize', () => {
            this.resize();
            // Recreate particles with new optimal count
            this.options.particleCount = this.getOptimalParticleCount();
            this.createParticles();
        });
    }

    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
    }
}

// Auto-initialize if particles-js container exists
document.addEventListener('DOMContentLoaded', () => {
    const particlesContainer = document.getElementById('particles-js');
    if (particlesContainer) {
        // Create lightweight particles with custom settings based on page
        const isHomePage = document.title.includes('KillaMeep') && !document.title.includes('|');
        
        const options = {
            particleCount: isHomePage ? 25 : 15, // Fewer particles on home page
            particleSize: 1.5,
            particleSpeed: 0.3,
            particleColor: 'rgba(255, 255, 255, 0.6)',
            connectionDistance: 80,
            connectionOpacity: 0.2,
            enableConnections: !isHomePage // No connections on home page for better navbar interaction
        };
        
        new LightweightParticles('particles-js', options);
    }
});
