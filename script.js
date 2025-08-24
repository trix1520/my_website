document.addEventListener('DOMContentLoaded', function() {
    // Элементы меню
    const menuBtn = document.getElementById("menuBtn");
    const closeMenuBtn = document.getElementById("closeMenuBtn");
    const sideMenu = document.getElementById("sideMenu");
    const menuOverlay = document.querySelector(".menu-overlay");
    const menuLinks = document.querySelectorAll(".menu-link");
    
    // Модальное окно
    const modal = document.getElementById("callbackModal");
    const closeModalBtn = document.querySelector(".close-modal");
    const callbackButtons = document.querySelectorAll(".callback-button, .service-button");
    const forms = document.querySelectorAll('form');
    
    // Back to top button
    const backToTopBtn = document.getElementById("backToTop");
    
    // Уведомления
    const successModal = document.createElement('div');
    successModal.className = 'success-modal';
    document.body.appendChild(successModal);
    
    // Функция для инициализации галереи
    function initGallery() {
        // Проверяем, загружена ли библиотека lightGallery
        if (typeof lightGallery !== 'undefined') {
            const gallery = document.getElementById('lightgallery');
            if (gallery) {
                lightGallery(gallery, {
                    selector: '.gallery-item',
                    download: false,
                    counter: false,
                    getCaptionFromTitleOrAlt: false
                });
                console.log('Галерея инициализирована');
            } else {
                console.log('Элемент галереи не найден');
            }
        } else {
            console.log('Библиотека lightGallery не загружена');
            // Альтернативное решение, если lightGallery не загрузилась
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
                modal.className = 'image-modal';
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
                // Используем data-src или href для получения URL изображения
                const imageUrl = this.getAttribute('data-src') || this.getAttribute('href');
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
                    if (modal.parentNode) {
                        modal.parentNode.removeChild(modal);
                    }
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
    
    // Модальное окно
    function toggleModal(service = '') {
        if (modal.classList.contains('show')) {
            modal.classList.remove('show');
            unlockScroll();
        } else {
            if (service) {
                const textarea = modal.querySelector('textarea');
                if (textarea) textarea.value = `Интересует услуга: ${service}`;
            }
            modal.classList.add('show');
            lockScroll();
        }
    }
    
    // Показать уведомление
    function showNotification(message, isError = false) {
        successModal.className = isError ? 'success-modal show error-modal-content' : 'success-modal show';
        successModal.innerHTML = `
            <div class="success-modal-content">
                <i class="fas ${isError ? 'fa-exclamation-circle' : 'fa-check-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        setTimeout(() => {
            successModal.className = 'success-modal';
        }, 3000);
    }
    
    // Валидация форм
    forms.forEach(form => {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.textContent;
            
            // Показываем индикатор загрузки
            submitBtn.disabled = true;
            submitBtn.innerHTML = `${originalBtnText} <span class="loading-spinner"></span>`;
            
            // Валидация телефона
            const phoneInput = this.querySelector('input[type="tel"]');
            if (phoneInput && !/^[\d\+\(\)\s-]{10,15}$/.test(phoneInput.value)) {
                phoneInput.classList.add('error');
                phoneInput.focus();
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;
                return false;
            }
            
            // Валидация email (если есть поле)
            const emailInput = this.querySelector('input[type="email"]');
            if (emailInput && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value)) {
                emailInput.classList.add('error');
                emailInput.focus();
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;
                return false;
            }
            
            try {
                // Здесь должна быть AJAX отправка
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                // Успешная отправка
                showNotification('Спасибо! Мы свяжемся с вами в ближайшее время.', false);
                this.reset();
                
                if (modal.classList.contains('show')) {
                    toggleModal();
                }
            } catch (error) {
                showNotification('Произошла ошибка. Пожалуйста, попробуйте позже.', true);
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;
            }
        });
    });
    
    // Обработчики меню
    menuBtn.addEventListener("click", toggleMenu);
    closeMenuBtn.addEventListener("click", toggleMenu);
    menuOverlay.addEventListener("click", toggleMenu);
    
    // Обработчики модального окна
    closeModalBtn.addEventListener('click', () => toggleModal());
    if (modal) {
        modal.addEventListener('click', (e) => e.target === modal && toggleModal());
    }
    
    // Обработка кнопок
    callbackButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            toggleModal(btn.getAttribute('data-service') || '');
        });
    });
    
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
            if (sideMenu.classList.contains("show")) toggleMenu();
            if (modal && modal.classList.contains('show')) toggleModal();
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
    
    // Инициализация масок для телефона
    if (typeof IMask !== 'undefined') {
        const phoneInputs = document.querySelectorAll('input[type="tel"]');
        phoneInputs.forEach(input => {
            IMask(input, {
                mask: '+{7} (000) 000-00-00',
                lazy: false
            });
        });
    }
    
    // Первоначальные вызовы
    highlightMenu();
    animateOnScroll();
    
    // Инициализация галереи с небольшой задержкой для гарантии загрузки библиотек
    setTimeout(initGallery, 100);
});
