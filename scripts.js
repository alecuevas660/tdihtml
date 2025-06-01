        const handleScroll = () => {
            const header = document.querySelector('.header');
            const navbar = document.querySelector('.navbar');
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (header && navbar) {
                if (scrollTop > 50) {
                    header.classList.add('scrolled');
                    navbar.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                    navbar.classList.remove('scrolled');
                }
            }
        };

        const setActiveNavLink = () => {
            const navLinks = document.querySelectorAll('.nav-link');
            const dropdownItems = document.querySelectorAll('.dropdown-item');
            let currentPath = window.location.pathname;
            // Normalizar para producción y local
            if (currentPath.endsWith('/')) currentPath += 'index.html';
            if (currentPath.startsWith('/')) currentPath = currentPath.substring(1);
            navLinks.forEach(link => {
                const href = link.getAttribute('href');
                if (
                    href && (
                        href === currentPath ||
                        (href === 'index.html' && (currentPath === 'index.html' || currentPath === ''))
                    )
                ) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });
            dropdownItems.forEach(item => {
                const href = item.getAttribute('href');
                if (href && currentPath === href) {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            });
        };

        const initializeDropdowns = () => {
            // Inicializar todos los dropdowns usando la API de Bootstrap
            const dropdownElementList = document.querySelectorAll('.dropdown-toggle');
            dropdownElementList.forEach(dropdownToggleEl => {
                // Destruir instancia existente si hay una
                const existingDropdown = bootstrap.Dropdown.getInstance(dropdownToggleEl);
                if (existingDropdown) {
                    existingDropdown.dispose();
                }
                
                // Crear nueva instancia
                new bootstrap.Dropdown(dropdownToggleEl, {
                    offset: [0, 8],
                    autoClose: true
                });
            });

            // Manejar el comportamiento hover en desktop
            if (window.innerWidth >= 992) {
                const dropdowns = document.querySelectorAll('.dropdown');
                dropdowns.forEach(dropdown => {
                    dropdown.addEventListener('mouseenter', () => {
                        const dropdownToggle = dropdown.querySelector('.dropdown-toggle');
                        if (dropdownToggle) {
                            const dropdownInstance = bootstrap.Dropdown.getInstance(dropdownToggle);
                            if (dropdownInstance) {
                                dropdownInstance.show();
                            }
                        }
                    });
                    
                    dropdown.addEventListener('mouseleave', () => {
                        const dropdownToggle = dropdown.querySelector('.dropdown-toggle');
                        if (dropdownToggle) {
                            const dropdownInstance = bootstrap.Dropdown.getInstance(dropdownToggle);
                            if (dropdownInstance) {
                                dropdownInstance.hide();
                            }
                        }
                    });
                });
            }
        };

        // Carrusel automático para la topbar en móvil/tablet
        function startTopbarCarousel() {
            const links = document.querySelectorAll('.topbar-contact-info .topbar-link');
            // Quitar todos los activos y dejar solo el primero activo
            links.forEach((l, i) => l.classList.toggle('active', i === 0));
            if (window.innerWidth > 991 || links.length <= 1) return;
            let current = 0;
            // Limpiar intervalos previos
            if (window.topbarCarouselInterval) clearInterval(window.topbarCarouselInterval);
            window.topbarCarouselInterval = setInterval(() => {
                links[current].classList.remove('active');
                current = (current + 1) % links.length;
                links[current].classList.add('active');
            }, 2500);
        }

        document.addEventListener('DOMContentLoaded', function() {
            // Inicializar dropdowns
            const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
            
            dropdownToggles.forEach(toggle => {
                // Agregar evento click
                toggle.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    const dropdown = this.closest('.dropdown');
                    const menu = dropdown.querySelector('.dropdown-menu');
                    
                    // Cerrar otros dropdowns
                    document.querySelectorAll('.dropdown-menu.show').forEach(openMenu => {
                        if (openMenu !== menu) {
                            openMenu.classList.remove('show');
                            openMenu.closest('.dropdown').classList.remove('show');
                        }
                    });
                    
                    // Toggle del dropdown actual
                    dropdown.classList.toggle('show');
                    menu.classList.toggle('show');
                });
            });
            
            // Cerrar dropdowns al hacer click fuera
            document.addEventListener('click', function(e) {
                if (!e.target.closest('.dropdown')) {
                    document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
                        menu.classList.remove('show');
                        menu.closest('.dropdown').classList.remove('show');
                    });
                }
            });
            
            // Comportamiento hover para desktop
            if (window.innerWidth >= 992) {
                const dropdowns = document.querySelectorAll('.dropdown');
                
                dropdowns.forEach(dropdown => {
                    dropdown.addEventListener('mouseenter', function() {
                        const menu = this.querySelector('.dropdown-menu');
                        this.classList.add('show');
                        menu.classList.add('show');
                    });
                    
                    dropdown.addEventListener('mouseleave', function() {
                        const menu = this.querySelector('.dropdown-menu');
                        this.classList.remove('show');
                        menu.classList.remove('show');
                    });
                });
            }
            
            // Resto del código existente...
            window.addEventListener('scroll', handleScroll);
            setActiveNavLink();
            startTopbarCarousel();
        });

        window.addEventListener('resize', () => {
            startTopbarCarousel();
        });

        document.addEventListener('DOMContentLoaded', function() {
            const bannerContents = document.querySelectorAll('.banner-content');
            const bannerNav = document.querySelector('.banner-nav');
            const leftArrow = document.querySelector('.banner-arrow.left');
            const rightArrow = document.querySelector('.banner-arrow.right');
            let currentSlide = 0;
            let intervalId;

            if (bannerNav) {
                bannerContents.forEach((_, index) => {
                    const button = document.createElement('button');
                    button.setAttribute('aria-label', `Ir al slide ${index + 1}`);
                    button.addEventListener('click', () => goToSlide(index));
                    bannerNav.appendChild(button);
                });
            }

            function updateBanner() {
                bannerContents.forEach((content, index) => {
                    content.classList.toggle('active', index === currentSlide);
                });
                document.querySelectorAll('.banner-nav button').forEach((button, index) => {
                    button.classList.toggle('active', index === currentSlide);
                });
            }

            function goToSlide(n) {
                currentSlide = n;
                updateBanner();
                resetInterval();
            }

            function nextSlide() {
                currentSlide = (currentSlide + 1) % bannerContents.length;
                updateBanner();
            }

            function prevSlide() {
                currentSlide = (currentSlide - 1 + bannerContents.length) % bannerContents.length;
                updateBanner();
            }

            function resetInterval() {
                if (intervalId) {
                    clearInterval(intervalId);
                }
                intervalId = window.setInterval(nextSlide, 5000);
            }

            if (leftArrow) {
                leftArrow.addEventListener('click', () => {
                    prevSlide();
                    resetInterval();
                });
            }

            if (rightArrow) {
                rightArrow.addEventListener('click', () => {
                    nextSlide();
                    resetInterval();
                });
            }

            resetInterval();
        });

        // Esperar a que el DOM y Bootstrap estén completamente cargados
        document.addEventListener('DOMContentLoaded', function() {
            // Inicializar dropdowns inmediatamente
            initializeDropdowns();
            
            // También inicializar cuando la ventana esté completamente cargada
            window.addEventListener('load', function() {
                initializeDropdowns();
            });
        });

        // Fade-in animation for Why Choose Us section
        document.addEventListener('DOMContentLoaded', function() {
            const observerOptions = {
                root: null,
                rootMargin: '0px',
                threshold: 0.1
            };

            const observer = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        const el = entry.target;
                        if (el.dataset.delay) {
                            el.style.transitionDelay = `${el.dataset.delay}ms`;
                        }
                        observer.unobserve(entry.target);
                    }
                });
            }, observerOptions);

            const fadeElements = document.querySelectorAll('.fade-in-up');
            fadeElements.forEach(el => observer.observe(el));
        });

        // Contact Form Handler
        function initializeContactForm(formId = 'contactForm') {
            const form = document.getElementById(formId);
            const buttonText = document.getElementById('button-text');
            const buttonLoader = document.getElementById('button-loader');
            const customNotification = document.getElementById('custom-notification');

            if (!form) return;

            // Función para mostrar notificaciones
            function showNotification(message, type) {
                if (!customNotification) return;
                
                customNotification.textContent = message;
                customNotification.className = `custom-notification ${type}`;
                customNotification.classList.remove('d-none');

                setTimeout(() => {
                    customNotification.classList.add('d-none');
                }, 5000);
            }

            // Validación del formulario
            form.addEventListener('submit', async function(e) {
                e.preventDefault();
                console.log('Form submission started');

                // Obtener los valores directamente de los campos
                const data = {
                    name: document.getElementById('nombre').value.trim(),
                    email: document.getElementById('email').value.trim(),
                    telefono: document.getElementById('telefono').value.trim(),
                    mensaje: document.getElementById('mensaje').value.trim()
                };

                // Validación mejorada de campos
                let isValid = true;
                const fields = {
                    nombre: { value: data.name, message: 'Por favor ingresa tu nombre completo' },
                    email: { value: data.email, message: 'Por favor ingresa un correo electrónico válido' },
                    telefono: { value: data.telefono, message: 'Por favor ingresa un número de teléfono válido' },
                    mensaje: { value: data.mensaje, message: 'Por favor ingresa tu mensaje' }
                };

                // Validar cada campo y mostrar mensajes de error
                Object.entries(fields).forEach(([fieldId, field]) => {
                    const input = document.getElementById(fieldId);
                    const errorDiv = input.nextElementSibling;
                    
                    if (!field.value) {
                        isValid = false;
                        input.classList.add('is-invalid');
                        if (errorDiv && errorDiv.classList.contains('form-error')) {
                            errorDiv.textContent = field.message;
                        }
                    } else {
                        input.classList.remove('is-invalid');
                        if (errorDiv && errorDiv.classList.contains('form-error')) {
                            errorDiv.textContent = '';
                        }
                    }
                });

                if (!isValid) {
                    console.log('Form validation failed - empty fields');
                    form.classList.add('was-validated');
                    showNotification('Por favor completa todos los campos requeridos.', 'error');
                    return;
                }

                // Mostrar loader y deshabilitar botón
                if (buttonText && buttonLoader) {
                    buttonText.classList.add('d-none');
                    buttonLoader.classList.remove('d-none');
                }

                // Log form data safely
                console.log('Sending contact form data:', {
                    name: data.name,
                    email: data.email,
                    telefono: data.telefono,
                    mensaje: data.mensaje ? `${data.mensaje.substring(0, 50)}...` : ''
                });

                try {
                    const apiUrl = '/api/contacto/contact';
                    
                    console.log('Making API request to', apiUrl);
                    const response = await fetch(apiUrl, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        },
                        mode: 'cors',
                        credentials: 'include',
                        body: JSON.stringify(data)
                    });

                    if (!response.ok) {
                        const responseText = await response.text();
                        console.error('Server response:', responseText);
                        try {
                            const errorData = JSON.parse(responseText);
                            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
                        } catch (e) {
                            throw new Error(`Server returned HTML instead of JSON. Status: ${response.status}`);
                        }
                    }

                    console.log('API Response status:', response.status);
                    const result = await response.json();
                    console.log('API Response body:', result);

                    if (response.ok) {
                        console.log('Contact form submitted successfully');
                        showNotification('Mensaje enviado correctamente.', 'success');
                        Swal.fire({
                            icon: 'success',
                            title: '¡Mensaje enviado!',
                            text: 'Nos pondremos en contacto contigo pronto.',
                            confirmButtonText: 'Aceptar'
                        });
                        form.reset();
                        form.classList.remove('was-validated');
                    } else {
                        console.error('Contact form submission failed:', result.error);
                        showNotification('Error: ' + (result.error || 'Error al enviar el mensaje'), 'error');
                    }
                } catch (err) {
                    console.error('Error during contact form submission:', err);
                    console.error('Error details:', {
                        name: err.name,
                        message: err.message,
                        stack: err.stack
                    });
                    showNotification('Ocurrió un error al enviar el mensaje.', 'error');
                } finally {
                    // Ocultar loader y reactivar botón
                    if (buttonText && buttonLoader) {
                        buttonText.classList.remove('d-none');
                        buttonLoader.classList.add('d-none');
                    }
                }
            });
        }

        // Initialize contact forms when DOM is loaded
        document.addEventListener('DOMContentLoaded', function() {
            // Initialize contact form
            initializeContactForm();
            
            // Rest of your existing DOMContentLoaded code...
            window.addEventListener('scroll', handleScroll);
            setActiveNavLink();
            startTopbarCarousel();
        });
