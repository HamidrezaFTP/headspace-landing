"use strict";

// DOM Elements
const buttonsContainer = document.querySelector(".moments__btns");
const slides = document.querySelectorAll(".slider__card");
const header = document.getElementById("main-header");
const elementsToAnimate = document.querySelectorAll(
  ".stats__img, .stat-number, .members__comment, .organizations__img, .members__img"
);
const faqContainer = document.querySelector(".faq__container");
const audioElements = document.querySelectorAll(".audio__element");
const playPauseBtns = document.querySelectorAll(".play-pause__btn");
const playPauseIcons = document.querySelectorAll(".play-pause__icon");
const progressBars = document.querySelectorAll(".progress__bar");
const currentTimeEls = document.querySelectorAll(".current__time");
const totalTimeEls = document.querySelectorAll(".total__time");

// Helper Functions
const formatTime = (seconds) => {
  if (isNaN(seconds)) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs < 10 ? "0" + secs : secs}`;
};

const animateCounter = (el) => {
  const targetValue = parseFloat(el.getAttribute("data-target")) || 0;
  const suffix = el.getAttribute("data-suffix") || "";
  const duration = 2000;
  const startTime = performance.now();
  const hasDecimal = targetValue % 1 !== 0;

  const update = (currentTime) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const currentValue = targetValue * progress;
    el.textContent = hasDecimal
      ? currentValue.toFixed(1) + suffix
      : Math.floor(currentValue) + suffix;
    if (progress < 1) requestAnimationFrame(update);
  };

  requestAnimationFrame(update);
};

// Event Listeners
buttonsContainer.addEventListener("click", (e) => {
  const button = e.target.closest(".moments__btn");
  if (!button) return;

  // Remove active class from all buttons and slides
  document
    .querySelectorAll(".moments__btn.active")
    .forEach((btn) => btn.classList.remove("active"));
  slides.forEach((slide) => slide.classList.remove("active"));

  // Add active class to the clicked button
  button.classList.add("active");

  // Get the slide index from the data attribute
  const slideIndex = button.dataset.slide;

  // Add active class to the corresponding slide
  slides[slideIndex].classList.add("active");
});

audioElements.forEach((audioElement, index) => {
  let isPlaying = false;

  audioElement.addEventListener("loadedmetadata", () => {
    const duration = audioElement.duration;
    totalTimeEls[index].textContent = formatTime(duration);
  });

  audioElement.addEventListener("play", () => {
    isPlaying = true;
    playPauseIcons[index].classList.remove("fa-play");
    playPauseIcons[index].classList.add("fa-pause");
    playPauseBtns[index].setAttribute("aria-label", "Pause");
  });

  audioElement.addEventListener("pause", () => {
    isPlaying = false;
    playPauseIcons[index].classList.remove("fa-pause");
    playPauseIcons[index].classList.add("fa-play");
    playPauseBtns[index].setAttribute("aria-label", "Play");
  });

  audioElement.addEventListener("timeupdate", () => {
    const currentTime = audioElement.currentTime;
    const duration = audioElement.duration;
    progressBars[index].value = (currentTime / duration) * 100;
    currentTimeEls[index].textContent = formatTime(currentTime);
  });
});

document.addEventListener("click", (e) => {
  const playPauseBtn = e.target.closest(".play-pause__btn");
  if (playPauseBtn) {
    const index = Array.from(playPauseBtns).indexOf(playPauseBtn);
    const audioElement = audioElements[index];
    if (!audioElement) return;

    if (audioElement.paused) {
      audioElements.forEach((el, i) => {
        if (i !== index) {
          el.pause();
          el.currentTime = 0;
          playPauseIcons[i].classList.remove("fa-pause");
          playPauseIcons[i].classList.add("fa-play");
          playPauseBtns[i].setAttribute("aria-label", "Play");
        }
      });
      audioElement.play();
    } else {
      audioElement.pause();
    }
  }
});

document.addEventListener("input", (e) => {
  const progressBar = e.target.closest(".progress__bar");
  if (progressBar) {
    const index = Array.from(progressBars).indexOf(progressBar);
    const audioElement = audioElements[index];
    if (!audioElement) return;

    const duration = audioElement.duration;
    const newTime = (progressBar.value / 100) * duration;
    audioElement.currentTime = newTime;
  }
});

window.addEventListener("scroll", () => {
  window.scrollY > 50
    ? header.classList.add("with-shadow")
    : header.classList.remove("with-shadow");
});

const observerOptions = { root: null, threshold: 0.1 };

const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("fade-in");
      if (entry.target.hasAttribute("data-target"))
        animateCounter(entry.target);
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

elementsToAnimate.forEach((el) => observer.observe(el));

faqContainer.addEventListener("click", (e) => {
  const questionBtn = e.target.closest(".faq__question");
  if (!questionBtn) return;

  const item = questionBtn.closest(".faq__item");
  if (!item) return;

  item.classList.toggle("active");

  const indicator = questionBtn.querySelector(".faq__toggle");
  indicator.textContent = item.classList.contains("active") ? "–" : "+";
});
