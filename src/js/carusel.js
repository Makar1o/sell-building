document.addEventListener('DOMContentLoaded', function () {
  const images = document.querySelectorAll('.carousel-image');
  const dotsContainer = document.querySelector('.carousel-dots');
  const prevBtn = document.querySelector('.carousel-arrow.prev');
  const nextBtn = document.querySelector('.carousel-arrow.next');
  let currentIndex = 0;
  let interval;

  // Create dots
  images.forEach((_, index) => {
    const dot = document.createElement('div');
    dot.classList.add('dot');
    if (index === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToSlide(index));
    dotsContainer.appendChild(dot);
  });
  const dots = document.querySelectorAll('.dot');

  function updateCarousel() {
    images.forEach((img, index) => {
      img.classList.toggle('active', index === currentIndex);
    });
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentIndex);
    });
  }

  function goToSlide(index) {
    currentIndex = index;
    updateCarousel();
    resetInterval();
  }

  function nextSlide() {
    currentIndex = (currentIndex + 1) % images.length;
    updateCarousel();
  }

  function prevSlide() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    updateCarousel();
  }

  function resetInterval() {
    clearInterval(interval);
    interval = setInterval(nextSlide, 4000); // 4 seconds delay
  }

  // Event listeners
  nextBtn.addEventListener('click', () => {
    nextSlide();
    resetInterval();
  });

  prevBtn.addEventListener('click', () => {
    prevSlide();
    resetInterval();
  });

  // Start autoplay
  updateCarousel();
  interval = setInterval(nextSlide, 4000);

  // Pause on hover
  const carousel = document.querySelector('.image-carousel');
  carousel.addEventListener('mouseenter', () => clearInterval(interval));
  carousel.addEventListener('mouseleave', resetInterval);
});
