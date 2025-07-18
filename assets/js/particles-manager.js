// Function to load JSON config and initialize particles
function loadParticlesConfig() {
    fetch('assets/config/particles-config.json')  // Fetch the configuration file
        .then(response => response.json())
        .then(config => {
            // Dynamically adjust particle number based on screen width
            const screenWidth = window.innerWidth;

            // Example logic: Adjust particle count based on screen size
            const particleCount = Math.max(200, Math.min(Math.floor(screenWidth / 5), 700)); // Adjust as needed
            config.particles.number.value = particleCount;  // Update the number of particles
            // Initialize particles.js with the modified config
            particlesJS('particles-js', config);
        })
        .catch(error => console.error('Error loading particles config:', error));
}

// Call the function to load config and initialize particles
loadParticlesConfig();

// Update particles on window resize
window.addEventListener('resize', loadParticlesConfig);
