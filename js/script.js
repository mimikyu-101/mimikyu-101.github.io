document.addEventListener('DOMContentLoaded', () => {
    // Mobile Navigation Toggle
    const navbarBurger = document.querySelector('.navbar-burger');
    const navbarMenu = document.querySelector('.navbar-menu');
    const navbar = document.querySelector('.navbar');
    
    if (navbarBurger) {
        navbarBurger.addEventListener('click', () => {
            navbarBurger.classList.toggle('is-active');
            navbarMenu.classList.toggle('is-active');
        });
    }
    
    // Navbar scroll effect
    function checkScroll() {
        if (window.scrollY > 50) {
            navbar.classList.add('is-scrolled');
        } else {
            navbar.classList.remove('is-scrolled');
        }
    }
    
    // Check on page load
    checkScroll();
    
    // Check on scroll
    window.addEventListener('scroll', checkScroll);
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Close mobile menu if open
                if (navbarMenu.classList.contains('is-active')) {
                    navbarBurger.classList.remove('is-active');
                    navbarMenu.classList.remove('is-active');
                }
                
                // Scroll to target
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // // Fetch IP address from ipify API
    // fetch('https://api.ipify.org?format=json')
    //     .then(response => response.json())
    //     .then(data => {
    //         // Add IP address to terminal
    //         const ipLine = document.createElement('p');
    //         ipLine.innerHTML = `<div class="terminal-output">Welcome ${data.ip}</div>`;
    //         const terminalContent = document.querySelector('.terminal-content');
    //         terminalContent.insertBefore(ipLine, terminalContent.querySelector('.terminal-line:last-of-type'));
    //     })
    
    // Terminal typing effect with IP address
    const terminalContent = document.querySelector('.terminal-content');
    if (terminalContent) {
        // Get visitor's IP address
        fetch('https://api.ipify.org?format=json')
            .then(response => response.json())
            .then(data => {
                // Add IP address to terminal
                const welcomeOutput = document.getElementById('welcome-output');
                welcomeOutput.innerHTML = `Welcome, <span class="ip-address">${data.ip}</span> to my digital workspace !!`;
                
                // Continue with terminal animation
                const lines = Array.from(terminalContent.querySelectorAll('p'));
                
                // Hide all lines except the first one
                lines.forEach((line, index) => {
                    if (index > 0) {
                        line.style.display = 'none';
                    }
                });
                
                // Show lines one by one
                let currentLine = 0;
                const showNextLine = () => {
                    currentLine++;
                    if (currentLine < lines.length) {
                        lines[currentLine].style.display = 'block';
                        setTimeout(showNextLine, 1000);
                    }
                };
                
                // Start the animation after a delay
                setTimeout(showNextLine, 1000);
            })
            .catch(error => {
                console.error('Error fetching IP:', error);
                // Continue with animation even if IP fetch fails
                const lines = Array.from(terminalContent.querySelectorAll('p'));
                
                lines.forEach((line, index) => {
                    if (index > 0) {
                        line.style.display = 'none';
                    }
                });
                
                let currentLine = 0;
                const showNextLine = () => {
                    currentLine++;
                    if (currentLine < lines.length) {
                        lines[currentLine].style.display = 'block';
                        setTimeout(showNextLine, 1000);
                    }
                };
                
                setTimeout(showNextLine, 1000);
            });
    }
    
    // Add simple network visualization to the background
    createNetworkVisualization();
});

// Simple network visualization
function createNetworkVisualization() {
    const networkContainer = document.querySelector('.network-visualization');
    if (!networkContainer) return;
    
    // Create canvas for network visualization
    const canvas = document.createElement('canvas');
    canvas.style.position = 'absolute';
    canvas.style.top = '-60px';
    canvas.style.left = '-160px';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.opacity = '0.5';
    canvas.style.zIndex = '0';
    
    // Insert canvas before the terminal window
    const terminalWindow = networkContainer.querySelector('.terminal-window');
    if (terminalWindow) {
        terminalWindow.style.position = 'relative';
        terminalWindow.style.zIndex = '1';
        networkContainer.insertBefore(canvas, terminalWindow);
    } else {
        networkContainer.appendChild(canvas);
    }
    
    // Set canvas size
    canvas.width = networkContainer.offsetWidth;
    canvas.height = networkContainer.offsetHeight;
    
    const ctx = canvas.getContext('2d');
    
    // Create nodes
    const nodes = [];
    const nodeCount = 50;
    
    for (let i = 0; i < nodeCount; i++) {
        nodes.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 3 + 1,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5
        });
    }
    
    // Animation function
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Update and draw nodes
        for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];
            
            // Update position
            node.x += node.vx;
            node.y += node.vy;
            
            // Bounce off edges
            if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
            if (node.y < 0 || node.y > canvas.height) node.vy *= -1;
            
            // Draw node
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
            ctx.fillStyle = '#00ff00';
            ctx.fill();
            
            // Draw connections
            for (let j = i + 1; j < nodes.length; j++) {
                const otherNode = nodes[j];
                const dx = otherNode.x - node.x;
                const dy = otherNode.y - node.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    ctx.beginPath();
                    ctx.moveTo(node.x, node.y);
                    ctx.lineTo(otherNode.x, otherNode.y);
                    ctx.strokeStyle = `rgba(0, 255, 0, ${1 - distance / 100})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
        
        requestAnimationFrame(animate);
    }
    
    // Start animation
    animate();
    
    // Resize handler
    window.addEventListener('resize', () => {
        canvas.width = networkContainer.offsetWidth;
        canvas.height = networkContainer.offsetHeight;
    });
}

// Add a simple "hacking" effect to classified headers
document.addEventListener('DOMContentLoaded', () => {
    const classifiedHeaders = document.querySelectorAll('.classified-header h3, .classified-header h4');
    
    classifiedHeaders.forEach(header => {
        const originalText = header.textContent;
        
        header.addEventListener('mouseover', () => {
            let iterations = 0;
            const interval = setInterval(() => {
                header.textContent = originalText
                    .split('')
                    .map((letter, index) => {
                        if (index < iterations) {
                            return originalText[index];
                        }
                        return String.fromCharCode(65 + Math.floor(Math.random() * 26));
                    })
                    .join('');
                
                iterations += 1 / 3;
                if (iterations >= originalText.length) {
                    clearInterval(interval);
                    header.textContent = originalText;
                }
            }, 30);
        });
    });
});

