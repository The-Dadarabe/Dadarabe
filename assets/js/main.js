/*
===================================================
======== REBOOT-IT.CLICK - Code JavaScript ========
===================================================

Ce script JavaScript gère diverses fonctionnalités interactives sur le site Web https://reboot-it.click. Il inclut des fonctions pour la sélection facile d'éléments du DOM, des écouteurs d'événements, des fonctions de défilement, la gestion de la barre de navigation, les sliders, les filtres de oeuvres, et bien plus encore.

Auteur: Tahiana .J
Date de création: 25 juillet 2023

Notez que ce script utilise des bibliothèques externes telles que Isotope, AOS, GLightbox et Swiper pour améliorer l'expérience utilisateur du site.

Pour toute question ou commentaire, veuillez contacter l'équipe technique de REBOOT-IT.CLICK à rebootit.click@gmail.com
*/

(function () {
  "use strict";

  /**
   * Fonction d'aide pour sélectionner facilement des éléments du DOM
   */
  const select = (el, all = false) => {
    el = el.trim();
    if (all) {
      return [...document.querySelectorAll(el)];
    } else {
      return document.querySelector(el);
    }
  };

  /**
   * Fonction d'écouteur d'événements simple
   */
  const on = (type, el, listener, all = false) => {
    let selectEl = select(el, all);
    if (selectEl) {
      if (all) {
        selectEl.forEach((e) => e.addEventListener(type, listener));
      } else {
        selectEl.addEventListener(type, listener);
      }
    }
  };

  /**
   * Fonction d'écouteur d'événement pour le défilement
   */
  const onscroll = (el, listener) => {
    el.addEventListener("scroll", listener);
  };

  /**
   * État actif des liens de la barre de navigation lors du défilement
   */
  let navbarlinks = select("#navbar .scrollto", true);
  const navbarlinksActive = () => {
    let position = window.scrollY + 200;
    navbarlinks.forEach((navbarlink) => {
      if (!navbarlink.hash) return;
      let section = select(navbarlink.hash);
      if (!section) return;
      if (
        position >= section.offsetTop &&
        position <= section.offsetTop + section.offsetHeight
      ) {
        navbarlink.classList.add("active");
      } else {
        navbarlink.classList.remove("active");
      }
    });
  };
  window.addEventListener("load", navbarlinksActive);
  onscroll(document, navbarlinksActive);

  /**
   * Défilement vers un élément avec un décalage d'en-tête
   */
  const scrollto = (el) => {
    let header = select("#header");
    let offset = header.offsetHeight;

    if (!header.classList.contains("header-scrolled")) {
      offset -= 20;
    }

    let elementPos = select(el).offsetTop;
    window.scrollTo({
      top: elementPos - offset,
      behavior: "smooth",
    });
  };

  /**
   * Bascule de la classe .header-scrolled pour #header lors du défilement de la page
   */
  let selectHeader = select("#header");
  if (selectHeader) {
    const headerScrolled = () => {
      if (window.scrollY > 100) {
        selectHeader.classList.add("header-scrolled");
      } else {
        selectHeader.classList.remove("header-scrolled");
      }
    };
    window.addEventListener("load", headerScrolled);
    onscroll(document, headerScrolled);
  }

  /**
   * Bouton "Retour en haut"
   */
  let backtotop = select(".back-to-top");
  if (backtotop) {
    const toggleBacktotop = () => {
      if (window.scrollY > 100) {
        backtotop.classList.add("active");
      } else {
        backtotop.classList.remove("active");
      }
    };
    window.addEventListener("load", toggleBacktotop);
    onscroll(document, toggleBacktotop);
  }

  /**
   * Basculer la navigation mobile
   */
  on("click", ".mobile-nav-toggle", function (e) {
    select("#navbar").classList.toggle("navbar-mobile");
    this.classList.toggle("bi-list");
    this.classList.toggle("bi-x");
  });

  /**
   * Activer les menus déroulants de la navigation mobile
   */
  on(
    "click",
    ".navbar .dropdown > a",
    function (e) {
      if (select("#navbar").classList.contains("navbar-mobile")) {
        e.preventDefault();
        this.nextElementSibling.classList.toggle("dropdown-active");
      }
    },
    true
  );

  /**
   * Défilement avec décalage sur les liens avec la classe .scrollto
   */
  on(
    "click",
    ".scrollto",
    function (e) {
      if (select(this.hash)) {
        e.preventDefault();

        let navbar = select("#navbar");
        if (navbar.classList.contains("navbar-mobile")) {
          navbar.classList.remove("navbar-mobile");
          let navbarToggle = select(".mobile-nav-toggle");
          navbarToggle.classList.toggle("bi-list");
          navbarToggle.classList.toggle("bi-x");
        }
        scrollto(this.hash);
      }
    },
    true
  );

  /**
   * Défilement avec décalage sur le chargement de la page avec des liens d'ancre dans l'URL
   */
  window.addEventListener("load", () => {
    if (window.location.hash) {
      if (select(window.location.hash)) {
        scrollto(window.location.hash);
      }
    }
  });

  /**
   * Isotope et filtre pour le oeuvres
   */
  window.addEventListener("load", () => {
    let oeuvresContainer = select(".oeuvres-container");
    if (oeuvresContainer) {
      let oeuvresIsotope = new Isotope(oeuvresContainer, {
        itemSelector: ".oeuvres-item",
      });

      let oeuvresFilters = select("#oeuvres-flters li", true);

      on(
        "click",
        "#oeuvres-flters li",
        function (e) {
          e.preventDefault();
          oeuvresFilters.forEach(function (el) {
            el.classList.remove("filter-active");
          });
          this.classList.add("filter-active");

          oeuvresIsotope.arrange({
            filter: this.getAttribute("data-filter"),
          });
          oeuvresIsotope.on("arrangeComplete", function () {
            AOS.refresh();
          });
        },
        true
      );
    }
  });

  /**
   * Initialiser la lightbox du oeuvres
   */
  const oeuvresLightbox = GLightbox({
    selector: ".oeuvres-lightbox",
  });

  /**
   * Slider des détails du oeuvres
   */
  new Swiper(".oeuvres-details-slider", {
    speed: 400,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    pagination: {
      el: ".swiper-pagination",
      type: "bullets",
      clickable: true,
    },
  });

  /**
   * Slider des clients
   */
  new Swiper(".clients-slider", {
    speed: 400,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    slidesPerView: "auto",
    pagination: {
      el: ".swiper-pagination",
      type: "bullets",
      clickable: true,
    },
    breakpoints: {
      320: {
        slidesPerView: 2,
        spaceBetween: 40,
      },
      480: {
        slidesPerView: 3,
        spaceBetween: 60,
      },
      640: {
        slidesPerView: 4,
        spaceBetween: 80,
      },
      992: {
        slidesPerView: 6,
        spaceBetween: 120,
      },
    },
  });

  /**
   * Animation au défilement
   */
  window.addEventListener("load", () => {
    AOS.init({
      duration: 1000,
      easing: "ease-in-out",
      once: true,
      mirror: false,
    });
  });

  /**
   * Initialiser Pure Counter
   */
  new PureCounter();
})();

/* ---------------------Pour le carousel-----------------*/

const ctaTextCarousel = document.querySelector(".cta-text-carousel");
const ctaTexts = ctaTextCarousel.querySelectorAll(".cta-text");
let currentIndex = 0;

function showNextText() {
  ctaTexts[currentIndex].classList.remove("active");
  currentIndex = (currentIndex + 1) % ctaTexts.length;
  ctaTexts[currentIndex].classList.add("active");
}

setInterval(showNextText, 9000);

// Code JavaScript pour gérer le défilement manuel et automatique
let slideIndex = 0;
const slides = document.getElementsByClassName("cta-text");

function showSlide(index) {
  for (let i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  slides[index].style.display = "block";
}

function nextSlide() {
  slideIndex++;
  if (slideIndex >= slides.length) {
    slideIndex = 0;
  }
  showSlide(slideIndex);
}

function prevSlide() {
  slideIndex--;
  if (slideIndex < 0) {
    slideIndex = slides.length - 1;
  }
  showSlide(slideIndex);
}

// Afficher le premier slide
showSlide(slideIndex);

// Défilement automatique toutes les 10 secondes (10000 millisecondes)
setInterval(() => {
  slideIndex++;
  if (slideIndex >= slides.length) {
    slideIndex = 0;
  }
  showSlide(slideIndex);
}, 10000); // Change de slide toutes les 5 secondes (ajustez le délai selon vos préférences)

/* ---------------------Fin Pour le carousel-----------------*/

// Code JavaScript pour gérer le défilement automatique des témoignages
document.addEventListener("DOMContentLoaded", function () {
  const carrouselTemoignages = new Swiper(".swiper-container", {
    slidesPerView: 2, // Affiche 2 diapositives à la fois
    spaceBetween: 20, // Ajustez l'espace entre les diapositives
    loop: true, // Faites boucler les diapositives
    autoplay: {
      delay: 4000, // Lecture automatique toutes les 2 secondes
    },
    pagination: {
      el: ".swiper-pagination", // Affiche la pagination
      clickable: true,
    },
  });
});

/*-----------------------------Formulaire d'avis -------------------------*/

// Attacher un événement au clic du bouton "Afficher le formulaire d'avis"
document
  .getElementById("show-review-form")
  .addEventListener("click", function () {
    // Récupérer l'élément du formulaire d'avis
    var reviewFormContainer = document.getElementById("review-form-container");
    // Afficher le formulaire
    reviewFormContainer.style.display = "block";
  });

// Initialisation du numéro d'avis
var avisCount = 1;

// Attacher un événement de soumission du formulaire d'avis
document
  .getElementById("review-form")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Empêcher le comportement par défaut du formulaire

    // Récupérer les valeurs des champs du formulaire
    var firstName = document.querySelector('input[name="firstName"]').value;
    var lastName = document.querySelector('input[name="lastName"]').value;
    var occupation = document.querySelector('input[name="occupation"]').value;
    var rating = document.getElementById("rating").value;
    var comment = document.querySelector('textarea[name="comment"]').value;
    var date = new Date().toLocaleDateString("fr-FR");

    // Sélectionner l'élément qui contiendra les avis
    var swiperWrapper = document.querySelector(".swiper-wrapper");

    // Créer un nouvel élément pour l'avis
    var newSlide = document.createElement("div");
    newSlide.className = "swiper-slide";
    newSlide.innerHTML = `
    <!-- Avis ${avisCount} -->
    <div class="testimonial-wrap">
      <div class="testimonial-item">
        <img src="assets/img/temoignages/testimonials-${avisCount}.jpg" class="testimonial-img" alt="">
        <h3>${firstName} ${lastName}</h3>
        <h4>${occupation}</h4>
        <div class="stars">
          ${generateStars(
            rating
          )} <!-- Générer les étoiles en fonction de la note -->
        </div>
        <p>
          <i class="bi bi-quote quote-icon-left"></i>
          ${comment}
          <i class="bi bi-quote quote-icon-right"></i>
        </p>
        <h4>${date}</h4>
      </div>
    </div>
  `;

    // Insérer le nouvel avis au début de la liste
    swiperWrapper.insertBefore(newSlide, swiperWrapper.firstChild);

    // Incrémenter le numéro d'avis
    avisCount++;

    // Réinitialiser le formulaire
    document.getElementById("review-form").reset();
    document.getElementById("review-form-container").style.display = "none"; // Masquer le formulaire
  });

// Fonction pour générer les étoiles en fonction de la note
function generateStars(count) {
  var stars = "";
  for (var i = 0; i < count; i++) {
    stars += '<i class="bi bi-star-fill"></i>'; // Étoile pleine pour les notes sélectionnées
  }
  for (var i = count; i < 5; i++) {
    stars += '<i class="bi bi-star"></i>'; // Étoile vide pour les notes restantes
  }
  return stars;
}

// Attacher un événement de clic aux étiquettes des étoiles
document.querySelectorAll(".stars label").forEach((label, index) => {
  label.addEventListener("click", () => {
    // Mettre à jour la valeur de note cachée
    document.getElementById("rating").value = index + 1;
    // Mettre à jour l'apparence des étoiles en fonction de la note sélectionnée
    document.querySelectorAll(".stars label i").forEach((star, starIndex) => {
      if (starIndex <= index) {
        star.classList.add("bi-star-fill"); // Ajouter la classe pour l'étoile pleine
      } else {
        star.classList.remove("bi-star-fill"); // Retirer la classe pour l'étoile pleine
      }
    });
  });
});

// Attacher un événement au clic du bouton "Fermer le formulaire"
document
  .getElementById("close-review-form")
  .addEventListener("click", function () {
    // Récupérer l'élément du formulaire d'avis
    var reviewFormContainer = document.getElementById("review-form-container");
    // Masquer le formulaire
    reviewFormContainer.style.display = "none";
  });

// ...

/*-----------------------------Image d'accueil -------------------------*/
var images = [
  "assets/img/intro-img1.jpg",
  "assets/img/intro-img2.jpg",
  "assets/img/intro-img3.jpg",
  "assets/img/intro-img4.jpg",
];
var currentImage = 0;
var imageElement = document.getElementById("slideshow");

function changeImage() {
  var opacity = 0;
  var increment = 0.05; // Valeur d'incrémentation pour le fondu

  var fadeOutInterval = setInterval(function () {
    if (opacity <= 0) {
      clearInterval(fadeOutInterval);

      // Charger la nouvelle image et commencer le fondu entrant
      currentImage = (currentImage + 1) % images.length;
      imageElement.src = images[currentImage];

      var fadeInInterval = setInterval(function () {
        if (opacity >= 1) {
          clearInterval(fadeInInterval);
        } else {
          opacity += increment;
          imageElement.style.opacity = opacity;
        }
      }, 50); // Attendre 50 millisecondes entre chaque incrémentation
    } else {
      opacity -= increment;
      imageElement.style.opacity = opacity;
    }
  }, 50); // Attendre 50 millisecondes entre chaque incrémentation
}

setInterval(changeImage, 4000); // Changer d'image toutes les 4 secondes
