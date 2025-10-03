const canvas = document.querySelector('canvas');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if(entry.isIntersecting) {
            const index = entry.target.dataset.section;
            if (index === "5") {
                canvas.style.opacity = "0";
                canvas.style.pointerEvents = "none";
            } else {
                canvas.style.opacity = "1";
                canvas.style.pointerEvents = "auto";
            }
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.scroll-section').forEach(section => observer.observe(section));