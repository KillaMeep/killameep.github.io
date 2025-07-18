// API Utilities for fetching external content
class APIUtils {
    // Fetch random cat image
    static async fetchCatImage() {
        try {
            const response = await fetch('https://api.thecatapi.com/v1/images/search');
            const data = await response.json();
            return data[0]?.url;
        } catch (error) {
            console.error('Error fetching cat image:', error);
            return null;
        }
    }

    // Fetch random dog image
    static async fetchDogImage() {
        try {
            const response = await fetch('https://dog.ceo/api/breeds/image/random');
            const data = await response.json();
            return data?.message;
        } catch (error) {
            console.error('Error fetching dog image:', error);
            return null;
        }
    }

    // Fetch random fact
    static async fetchRandomFact() {
        try {
            const response = await fetch('https://uselessfacts.jsph.pl/random.json?language=en');
            const data = await response.json();
            return data?.text;
        } catch (error) {
            console.error('Error fetching fact:', error);
            return 'Could not fetch a fact at this time.';
        }
    }
}

// Global functions for backward compatibility
window.fetchCatImage = async () => {
    const imageUrl = await APIUtils.fetchCatImage();
    if (imageUrl) {
        const imgElement = document.getElementById('catImage');
        if (imgElement) {
            imgElement.src = imageUrl;
        }
    }
};

window.fetchDogImage = async () => {
    const imageUrl = await APIUtils.fetchDogImage();
    if (imageUrl) {
        const imgElement = document.getElementById('dogImage');
        if (imgElement) {
            imgElement.src = imageUrl;
        }
    }
};

window.fetchRandomFact = async () => {
    const fact = await APIUtils.fetchRandomFact();
    const factElement = document.getElementById('fact');
    if (factElement) {
        factElement.innerText = fact;
    }
};

// Export for module usage
window.APIUtils = APIUtils;
