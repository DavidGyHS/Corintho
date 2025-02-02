document.addEventListener("DOMContentLoaded", () => {
    const carousel = document.querySelector('.carousel');
    const carouselImages = document.querySelector('.carousel-images');
    const images = document.querySelectorAll('.carousel-images img');
    const dots = document.querySelectorAll('.dot');
    let currentIndex = 0;
    let autoSlideInterval; // Variable para controlar el intervalo

    function calculateInitialOffset() {
        const carouselWidth = carousel.offsetWidth;
        const imageWidth = images[0].offsetWidth;
        return (carouselWidth - imageWidth) / 2;
    }

    function updateCarousel() {
        const imageWidth = images[0].offsetWidth + 20;
        const initialOffset = calculateInitialOffset();
        const offset = initialOffset - (currentIndex * imageWidth);
        
        carouselImages.style.transform = `translateX(${offset}px)`;
        
        images.forEach((img, index) => {
            img.classList.toggle('active', index === currentIndex);
        });
        
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }

    function startAutoSlide() {
        // Limpiamos cualquier intervalo existente antes de crear uno nuevo
        stopAutoSlide();
        autoSlideInterval = setInterval(autoSlide, 5000);
    }

    function stopAutoSlide() {
        if (autoSlideInterval) {
            clearInterval(autoSlideInterval);
        }
    }

    function autoSlide() {
        currentIndex = (currentIndex + 1) % images.length;
        updateCarousel();
    }

    function goToImage(index) {
        currentIndex = index;
        updateCarousel();
        // Reiniciamos el intervalo cuando se cambia manualmente
        startAutoSlide();
    }

    // Event listener para clicks en las imágenes
    images.forEach((img, index) => {
        img.addEventListener('click', () => {
            if (index !== currentIndex) {
                goToImage(index);
            }
        });
    });

    // Event listeners para los dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            goToImage(index);
        });
    });

    // Event listener para resize
    window.addEventListener('resize', updateCarousel);

    /*
    // Event listeners para mouseenter/mouseleave
    carousel.addEventListener('mouseenter', stopAutoSlide);
    carousel.addEventListener('mouseleave', startAutoSlide);
    */
    // Agregar estilos de cursor para las imágenes
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        .carousel-images img:not(.active) {
            cursor: pointer;
        }
    `;
    document.head.appendChild(styleSheet);

    // Touch events para móviles
    carousel.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        stopAutoSlide();
    }, { passive: true });

    carousel.addEventListener('touchmove', (e) => {
        touchEndX = e.touches[0].clientX;
    }, { passive: true });

    carousel.addEventListener('touchend', () => {
        const touchDiff = touchStartX - touchEndX;
        const minSwipeDistance = 50;

        if (Math.abs(touchDiff) > minSwipeDistance) {
            if (touchDiff > 0 && currentIndex < images.length - 1) {
                // Deslizar hacia la izquierda
                goToImage(currentIndex + 1);
            } else if (touchDiff < 0 && currentIndex > 0) {
                // Deslizar hacia la derecha
                goToImage(currentIndex - 1);
            }
        }
        startAutoSlide();
    });
    
    // Inicialización
    updateCarousel();
    startAutoSlide();
});

document.addEventListener("DOMContentLoaded", () => {
    const wordElement = document.querySelector('.word');
    const words = ['Diseñamos', 'Calculamos', 'Construimos'];
    let currentIndex = 0;

    function changeWord() {
        // Animación de desvanecimiento
        wordElement.style.opacity = 0;
        
        setTimeout(() => {
            // Cambiar la palabra
            wordElement.textContent = words[currentIndex];
            // Hacer aparecer la nueva palabra
            wordElement.style.opacity = 1;
            // Actualizar el índice
            currentIndex = (currentIndex + 1) % words.length;
        }, 500); // La mitad del tiempo de transición
    }

    // Establecer la palabra inicial
    wordElement.textContent = words[0];
    
    // Iniciar el cambio automático
    setInterval(changeWord, 2500);
});

document.addEventListener("DOMContentLoaded", () => {
    // Función para verificar si un elemento está parcialmente en el viewport
    function isElementPartiallyVisible(el, threshold = 0.2) {
        const rect = el.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        
        // Calcula qué tan visible está el elemento
        const visibleHeight = Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);
        const elementHeight = rect.bottom - rect.top;
        const visibilityRatio = visibleHeight / elementHeight;

        // Devuelve true si el elemento está al menos parcialmente visible
        return (
            rect.top < windowHeight &&
            rect.bottom > 0 &&
            visibilityRatio > threshold
        );
    }

    // Función para manejar la animación de entrada con Intersection Observer
    function setupScrollAnimations() {
        const serviceCategories = document.querySelectorAll('.service-category');
        
        const options = {
            root: null, // usar el viewport
            rootMargin: '0px', // sin margen adicional
            threshold: 0.2 // trigger cuando el 20% del elemento es visible
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // Opcional: dejar de observar el elemento una vez que se ha animado
                    observer.unobserve(entry.target);
                }
            });
        }, options);

        serviceCategories.forEach(category => {
            observer.observe(category);
            
            // Comprobar si el elemento ya está visible al cargar
            if (isElementPartiallyVisible(category)) {
                category.classList.add('visible');
                observer.unobserve(category);
            }
        });
    }

    // Configuración del efecto parallax en hover
    function setupParallaxEffect() {
        const serviceImages = document.querySelectorAll('.service-image');
        
        serviceImages.forEach(image => {
            image.addEventListener('mousemove', (e) => {
                const rect = image.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const xPercent = (x / rect.width - 0.5) * 20;
                const yPercent = (y / rect.height - 0.5) * 20;
                
                image.style.transform = `perspective(1000px) rotateX(${yPercent}deg) rotateY(${xPercent}deg) scale3d(1.05, 1.05, 1.05)`;
            });
            
            image.addEventListener('mouseleave', () => {
                image.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
            });
        });
    }

    // Inicializar todas las funcionalidades
    setupScrollAnimations();
    setupParallaxEffect();
});

document.addEventListener("DOMContentLoaded", () => {
    // Animación de entrada para las cards
    const observerOptions = {
        threshold: 0.2
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Aplicar animaciones a las cards y valores
    const cards = document.querySelectorAll('.about-card, .value-item');
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s ease';
        observer.observe(card);
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const whatsappButton = document.querySelector('.whatsapp-button');
    
    // Función para mostrar/ocultar el botón según el scroll
    let lastScrollPosition = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // Mostrar el botón solo después de hacer scroll hacia abajo
        if (currentScroll > 300) {
            whatsappButton.style.opacity = '1';
            whatsappButton.style.visibility = 'visible';
        } else {
            whatsappButton.style.opacity = '0';
            whatsappButton.style.visibility = 'hidden';
        }
        
        lastScrollPosition = currentScroll;
    });
    
    // Efecto hover suave
    whatsappButton.addEventListener('mouseover', () => {
        whatsappButton.style.animation = 'none'; // Detiene la animación de pulso en hover
    });
    
    whatsappButton.addEventListener('mouseout', () => {
        whatsappButton.style.animation = 'pulse 2s infinite'; // Restaura la animación
    });
});

document.addEventListener("DOMContentLoaded", () => {
    // Animación de entrada para los elementos del footer
    const footerElements = document.querySelectorAll('.footer-column, .footer-social, .footer-bottom');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    footerElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'all 0.6s ease';
        observer.observe(element);
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const header = document.querySelector('.header');
    const headerContent = document.querySelector('.header-content');
    
    // Efecto parallax al hacer scroll
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        if (scrolled < window.innerHeight) {
            header.style.transform = `translateY(${scrolled * 0.5}px)`;
            headerContent.style.transform = `translate(-50%, ${-50 + scrolled * 0.2}%)`;
            header.style.opacity = 1 - scrolled / (window.innerHeight / 1.2);
        }
    });

    // Detectar cuando el header está en el viewport
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        },
        { threshold: 0.1 }
    );

    observer.observe(header);

    // Scroll suave al hacer click en el indicador de scroll
    const scrollIndicator = document.querySelector('.scroll-indicator');
    scrollIndicator.addEventListener('click', () => {
        window.scrollTo({
            top: window.innerHeight,
            behavior: 'smooth'
        });
    });
});