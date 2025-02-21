const buttonsContainer = document.querySelector(".moments__btns");
const slides = document.querySelectorAll(".slider__card");
const header = document.getElementById("main-header");
const images = document.querySelectorAll(".members__img");
const comments = document.querySelectorAll(".members__comment");

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

  // Helper: Format seconds to mm:ss
  function formatTime(seconds) {
    if (isNaN(seconds)) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? "0" + secs : secs}`;
  }
});

window.addEventListener("scroll", () => {
  window.scrollY > 50
    ? header.classList.add("with-shadow")
    : header.classList.remove("with-shadow");
});

const observerOptions = {
  root: null, // Use the viewport as the container
  threshold: 0.1, // Trigger when 10% of the image is visible
};

const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("fade-in");
      observer.unobserve(entry.target); // Stop observing once the animation is triggered
    }
  });
}, observerOptions);

images.forEach((img) => observer.observe(img));
comments.forEach((comment) => observer.observe(comment));
