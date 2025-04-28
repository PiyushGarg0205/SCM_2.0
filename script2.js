document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault();
    // For now, just redirect to main2.html on submission
    window.location.href = 'main2.html';
});

// Optional: Add particles.js config if needed
particlesJS.load('particles-js', 'particles.json', function () {
    console.log('particles.js loaded - callback');
});
