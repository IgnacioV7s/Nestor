document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('nav a');
    let currentSectionIndex = 0;

    function scrollToSection(index) {
        if (index >= 0 && index < sections.length) {
            sections[index].scrollIntoView({ behavior: 'smooth' });
            currentSectionIndex = index;
        }
    }

    window.addEventListener('wheel', (event) => {
        if (event.deltaY > 0) {
            // Scroll down
            if (currentSectionIndex < sections.length - 1) {
                scrollToSection(currentSectionIndex + 1);
            }
        } else {
            // Scroll up
            if (currentSectionIndex > 0) {
                scrollToSection(currentSectionIndex - 1);
            }
        }
    });

    navLinks.forEach((link, index) => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            scrollToSection(index);
        });
    });
});



document.addEventListener('DOMContentLoaded', function () {
    // Obtener los elementos de imagen y audio
    const imagenes = document.querySelectorAll('#Cancion1 > img, #Cancion2 > img');
    const audios = {
        'Cancion1': document.getElementById('audio1'),
        'Cancion2': document.getElementById('audio2')
    };

    // Función para reproducir el audio
    function playAudio(id) {
        Object.values(audios).forEach(audio => {
            audio.pause();
            audio.currentTime = 0;
        });
        audios[id].play();
    }

    // Añadir eventos de hover a las imágenes
    imagenes.forEach(img => {
        img.addEventListener('mouseover', () => {
            const parentId = img.parentElement.id;
            playAudio(parentId);
        });

        img.addEventListener('mouseout', () => {
            const parentId = img.parentElement.id;
            audios[parentId].pause();
        });
    });
});

document.addEventListener("DOMContentLoaded", function() {
    const menuToggle = document.getElementById("menu-toggle");
    const navMenu = document.getElementById("nav-menu");
    const checkbtn = document.querySelector(".checkbtn");

    checkbtn.addEventListener("click", function() {
        if (menuToggle.checked) {
            navMenu.style.left = "-200%";
        } else {
            navMenu.style.left = "0";
        }
    });

    navMenu.addEventListener("click", function() {
        navMenu.style.left = "-200%";
        menuToggle.checked = false;
    });
});

document.addEventListener("DOMContentLoaded", function() {
    const navLinks = document.querySelectorAll(".nav-link");

    navLinks.forEach(link => {
        link.addEventListener("click", function() {
            // Elimina la clase 'active' de todos los enlaces
            navLinks.forEach(link => link.classList.remove("active"));

            // Añade la clase 'active' al enlace clicado
            this.classList.add("active");
        });
    });
});
