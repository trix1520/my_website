document.addEventListener('DOMContentLoaded', function() {
    // Элементы меню
    const menuBtn = document.getElementById("menuBtn");
    const closeMenuBtn = document.getElementById("closeMenuBtn");
    const sideMenu = document.getElementById("sideMenu");
    const menuOverlay = document.querySelector(".menu-overlay");
    const menuLinks = document.querySelectorAll(".menu-link");
    
    // Back to top button
    const backToTopBtn = document.getElementById("backToTop");
    
    // Функция для инициализации галереи
    function initGallery() {
        const gallery = document.getElementById('lightgallery');
        if (gallery && typeof lightGallery !== 'undefined') {
            lightGallery(gallery, {
                selector: '.gallery-item',
                download: false,
                counter: false
            });
        } else if (gallery) {
            initSimpleGallery();
        }
    }

    // Простая галерея как fallback
    function initSimpleGallery() {
        const galleryItems = document.querySelectorAll('.gallery-item');
        
        galleryItems.forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Создаем модальное окно для изображения
                const modal = document.createElement('div');
                modal.className = 'image-modal active';
                modal.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0,0,0,0.95);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 2000;
                    cursor: pointer;
                `;
                
                const img = document.createElement('img');
                const imageUrl = this.href;
                img.src = imageUrl;
                img.style.cssText = `
                    max-width: 90%;
                    max-height: 90%;
                    object-fit: contain;
                    border-radius: 8px;
                `;
                
                // Кнопка закрытия
                const closeBtn = document.createElement('button');
                closeBtn.innerHTML = '&times;';
                closeBtn.style.cssText = `
                    position: absolute;
                    top: 20px;
                    right: 20px;
                    color: white;
                    font-size: 2rem;
                    background: none;
                    border: none;
                    cursor: pointer;
                    z-index: 2001;
                `;
                
                modal.appendChild(img);
                modal.appendChild(closeBtn);
                document.body.appendChild(modal);
                
                // Закрытие по клику на overlay или кнопку
                function closeModal() {
                    document.body.removeChild(modal);
                }
                
                modal.addEventListener('click', function(e) {
                    if (e.target === modal || e.target === closeBtn) {
                        closeModal();
                    }
                });
                
                // Закрытие по ESC
                function closeOnEsc(e) {
                    if (e.key === 'Escape') {
                        closeModal();
                        document.removeEventListener('keydown', closeOnEsc);
                    }
                }
                
                document.addEventListener('keydown', closeOnEsc);
            });
        });
    }
    
    // Блокировка скролла
    function lockScroll() {
        document.body.style.overflow = "hidden";
        document.body.style.touchAction = "none";
    }
    
    // Разблокировка скролла
    function unlockScroll() {
        document.body.style.overflow = "";
        document.body.style.touchAction = "";
    }
    
    // Анимация меню
    function toggleMenu() {
        if (sideMenu.classList.contains("show")) {
            sideMenu.classList.remove("show");
            menuBtn.classList.remove("active");
            menuOverlay.style.opacity = "0";
            menuOverlay.style.visibility = "hidden";
            unlockScroll();
        } else {
            sideMenu.classList.add("show");
            menuBtn.classList.add("active");
            menuOverlay.style.opacity = "1";
            menuOverlay.style.visibility = "visible";
            lockScroll();
        }
    }
    
    // Обработчики меню
    menuBtn.addEventListener("click", toggleMenu);
    closeMenuBtn.addEventListener("click", toggleMenu);
    menuOverlay.addEventListener("click", toggleMenu);
    
    // Обработка ссылок меню
    function initMenuLinks() {
        menuLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (sideMenu.classList.contains("show")) {
                    toggleMenu();
                }
            });
        });
    }
    
    // Плавный скролл
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            if (this.getAttribute('href') === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // Закрываем меню если оно открыто
                if (sideMenu.classList.contains("show")) {
                    toggleMenu();
                }
            }
        });
    });
    
    // Подсветка активного раздела
    function highlightMenu() {
        const fromTop = window.scrollY + 100;
        document.querySelectorAll('section').forEach(section => {
            if (fromTop >= section.offsetTop && fromTop < section.offsetTop + section.offsetHeight) {
                const id = section.getAttribute('id');
                menuLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                });
            }
        });
    }
    
    // Анимации при скролле
    function animateOnScroll() {
        document.querySelectorAll('.service-card, .advantage-card, .gallery-item, .stat-item').forEach(el => {
            if (el.getBoundingClientRect().top < window.innerHeight / 1.2) {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }
        });
    }
    
    // Back to top button
    window.addEventListener('scroll', () => {
        highlightMenu();
        animateOnScroll();
        
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });
    
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Закрытие по ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === "Escape") {
            if (sideMenu.classList.contains("show")) {
                toggleMenu();
            }
            // Закрытие модальных окон изображений
            const imageModals = document.querySelectorAll('.image-modal.active');
            imageModals.forEach(modal => {
                document.body.removeChild(modal);
            });
        }
    });
    
    // Адаптация к ресайзу
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (window.innerWidth > 768) {
                sideMenu.classList.remove("show");
                menuBtn.classList.remove("active");
                menuOverlay.style.opacity = "0";
                menuOverlay.style.visibility = "hidden";
                unlockScroll();
            }
        }, 100);
    });
    
    // Инициализация анимаций
    document.querySelectorAll('.service-card, .advantage-card, .gallery-item, .stat-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    
    // Инициализация
    initMenuLinks();
    highlightMenu();
    animateOnScroll();
    
    // Инициализация галереи с небольшой задержкой для гарантии загрузки библиотек
    setTimeout(initGallery, 100);
});
