// Typing Animation Manager
class TypingAnimator {
    constructor() {
        this.typingDelay = 80;
    }

    // Main typing animation for name
    startNameTyping(text = "Hi, I'm KillaMeep.", onComplete) {
        let index = 0;
        const typeChar = () => {
            if (index < text.length) {
                document.getElementById("typing-effect").innerHTML = 
                    text.substring(0, index + 1) + '<span aria-hidden="true">|</span>';
                index++;
                setTimeout(typeChar, this.typingDelay);
            } else {
                document.getElementById("typing-effect").innerHTML = text;
                setTimeout(onComplete, 500);
            }
        };
        typeChar();
    }

    // Role cycling animation
    startRoleTyping() {
        const roles = [
            "Software Developer",
            "Process Automation Engineer", 
            "AI Solutions Designer" 
        ];

        let roleIndex = 0;
        let charIndex = 0;
        let currentRole = "";
        let isTyping = true;

        const animate = () => {
            if (isTyping) {
                if (charIndex < roles[roleIndex].length) {
                    currentRole += roles[roleIndex].charAt(charIndex);
                    charIndex++;
                } else {
                    setTimeout(() => {
                        isTyping = false;
                        animate();
                    }, 1000);
                    return;
                }
            } else {
                if (charIndex > 0) {
                    currentRole = currentRole.substring(0, charIndex - 1);
                    charIndex--;
                } else {
                    isTyping = true;
                    roleIndex = (roleIndex + 1) % roles.length;
                }
            }
            
            document.getElementById("role-effect").innerHTML = 
                "> " + currentRole + '<span aria-hidden="true">|</span>';
            setTimeout(animate, isTyping ? this.typingDelay : this.typingDelay / 2);
        };

        animate();
    }
}

// Initialize typing animation
window.addEventListener('load', () => {
    const animator = new TypingAnimator();
    animator.startNameTyping("Hi, I'm KillaMeep.", () => {
        animator.startRoleTyping();
    });
});
