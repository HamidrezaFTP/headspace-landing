"use strict";

const buttonsContainer = document.querySelector(".moments__btns");
const slides = document.querySelectorAll(".slider__card");
const header = document.getElementById("main-header");
const elementsToAnimate = document.querySelectorAll(
  ".stats__img, .stat-number, .members__comment, .organizations__img, .members__img"
);
const faqContainer = document.querySelector(".faq__container");

buttonsContainer.addEventListener("click", function (e) {
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

document.querySelectorAll(".audio__element").forEach((audioElement, index) => {
  const playPauseBtn = document.querySelectorAll(".play-pause__btn")[index];
  const playPauseIcon = playPauseBtn.querySelector(".play-pause__icon");
  const progressBar = document.querySelectorAll(".progress__bar")[index];
  const currentTimeEl = document.querySelectorAll(".current__time")[index];
  const totalTimeEl = document.querySelectorAll(".total__time")[index];
  let isPlaying = false;

  // Helper: Format seconds to mm:ss
  const formatTime = function (seconds) {
    if (isNaN(seconds)) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? "0" + secs : secs}`;
  };

  // Load metadata to get total duration
  audioElement.addEventListener("loadedmetadata", () => {
    const duration = audioElement.duration; // in seconds
    totalTimeEl.textContent = formatTime(duration);
  });

  // Play/Pause Button
  playPauseBtn.addEventListener("click", () => {
    if (!isPlaying) {
      // Pause all other audio elements
      document.querySelectorAll(".audio__element").forEach((el, i) => {
        if (i !== index) {
          el.pause();
          el.currentTime = 0; // Reset the audio to the beginning
          const otherPlayPauseIcon =
            document.querySelectorAll(".play-pause__icon")[i];
          otherPlayPauseIcon.classList.remove("fa-pause");
          otherPlayPauseIcon.classList.add("fa-play");
          const otherPlayPauseBtn =
            document.querySelectorAll(".play-pause__btn")[i];
          otherPlayPauseBtn.setAttribute("aria-label", "Play");
        }
      });
      audioElement.play();
    } else {
      audioElement.pause();
    }
  });

  // Update icon and `isPlaying` state
  audioElement.addEventListener("play", () => {
    isPlaying = true;
    playPauseIcon.classList.remove("fa-play");
    playPauseIcon.classList.add("fa-pause");
    playPauseBtn.setAttribute("aria-label", "Pause");
  });
  audioElement.addEventListener("pause", () => {
    isPlaying = false;
    playPauseIcon.classList.remove("fa-pause");
    playPauseIcon.classList.add("fa-play");
    playPauseBtn.setAttribute("aria-label", "Play");
  });

  // Time Update & Progress Bar
  audioElement.addEventListener("timeupdate", () => {
    const currentTime = audioElement.currentTime;
    const duration = audioElement.duration;
    progressBar.value = (currentTime / duration) * 100;
    currentTimeEl.textContent = formatTime(currentTime);
  });

  // Scrubbing the Audio (User drags progress bar)
  progressBar.addEventListener("input", () => {
    const duration = audioElement.duration;
    // Calculate new time
    const newTime = (progressBar.value / 100) * duration;
    audioElement.currentTime = newTime;
  });
});

window.addEventListener("scroll", () => {
  window.scrollY > 50
    ? header.classList.add("with-shadow")
    : header.classList.remove("with-shadow");
});

const observerOptions = { root: null, threshold: 0.1 };

const animateCounter = function (el) {
  const targetValue = parseFloat(el.getAttribute("data-target")) || 0;
  const suffix = el.getAttribute("data-suffix") || "";
  const duration = 2000;
  const startTime = performance.now();
  const hasDecimal = targetValue % 1 !== 0;
  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const currentValue = targetValue * progress;
    el.textContent = hasDecimal
      ? currentValue.toFixed(1) + suffix
      : Math.floor(currentValue) + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
};

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

  // Toggle active class
  item.classList.toggle("active");

  // Optionally, toggle + / -
  const indicator = questionBtn.querySelector(".faq__toggle");
  indicator.textContent = item.classList.contains("active") ? "–" : "+";
});
