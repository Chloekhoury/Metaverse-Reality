class HeroExperience {
  constructor() {
    this.heroVideo = document.querySelector(".hero-video");
    this.thumbBoxes = document.querySelectorAll(".thumb-box");
    this.thumbnails = document.querySelectorAll(".thumb");
    this.heroSection = document.querySelector('.hero-section');
    this.maxScroll = window.innerHeight * 2;
    this.maxAngle = 50;

    this.setupVideo();
    this.setupThumbnails();
    this.setupMouseEffect();
    this.setupScrollEffect();
  }

  setupVideo() {
    this.heroVideo.loop = true;

    // Show the first thumbnail
    this.thumbBoxes[0].classList.add("show");

    // Reset to first video after hero-6
    this.heroVideo.addEventListener("ended", () => {
      const currentSrc = this.heroVideo.querySelector("source")?.src;
      if (currentSrc?.includes("hero-6")) {
        this.setVideo("videos/hero-1.mp4");
        this.thumbBoxes.forEach(t => t.classList.remove("show"));
        this.thumbBoxes[0].classList.add("show");
      }
    });
  }

  setupThumbnails() {
    this.thumbnails.forEach((thumb, i) => {
      thumb.parentElement.addEventListener("click", () => {
        const videoSrc = thumb.getAttribute("data-src");
        this.setVideo(videoSrc);

        if (i + 1 < this.thumbBoxes.length) {
          this.thumbBoxes[i + 1].classList.add("show");
        }

        this.thumbBoxes[i].classList.remove("show");
      });
    });
  }

  setVideo(src) {
    const newSource = document.createElement("source");
    newSource.src = src;
    newSource.type = "video/mp4";

    this.heroVideo.innerHTML = "";
    this.heroVideo.appendChild(newSource);
    this.heroVideo.load();
    this.heroVideo.play();
  }

  setupMouseEffect() {
    document.addEventListener("mousemove", (e) => {
      this.thumbBoxes.forEach((box) => {
        const rect = box.getBoundingClientRect();
        const boxX = rect.left + rect.width / 2;
        const boxY = rect.top + rect.height / 2;

        const dx = e.clientX - boxX;
        const dy = e.clientY - boxY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        let scale = 1.2 - Math.min(distance / 800, 0.5);
        const rotateX = (-dy / 20).toFixed(1);
        const rotateY = (dx / 20).toFixed(1);

        box.style.scale = scale;
        box.style.transform = `scale(${scale}) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      });
    });
  }

  setupScrollEffect() {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;

      if (scrollY === 0) {
        this.heroSection.style.width = '100vw';
        this.heroSection.style.height = '100vh';
        this.heroSection.style.margin = '0 auto';
        this.heroSection.style.transform = 'rotateX(0deg) translateY(0)';
      } else {
        const angle = Math.min((scrollY / this.maxScroll) * this.maxAngle, this.maxAngle);
        const rad = angle * Math.PI / 180;
        const height = this.heroSection.offsetHeight;
        const translateY = height * (1 - Math.cos(rad));

        const width = 100 - (scrollY / this.maxScroll) * 20;
        const heightPerc = 100 - (scrollY / this.maxScroll) * 30;

        this.heroSection.style.width = `${width}vw`;
        this.heroSection.style.height = `${heightPerc}vh`;
        this.heroSection.style.margin = 'auto';
        this.heroSection.style.transform = `rotateX(${angle}deg) translateY(-${translateY}px)`;
      }
    });
  }
}

// Initialize it
new HeroExperience();




//2nd page
class TextRevealCurve {
  constructor() {
    this.observer = new IntersectionObserver(this.handleIntersect.bind(this), {
      threshold: 0.3
    });
    this.observeElements();
  }

  handleIntersect(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      } else {
        entry.target.classList.remove('active');
      }
    });
  }

  observeElements() {
    document.querySelectorAll('.reveal-curve').forEach(el => {
      this.observer.observe(el);
    });
  }
}


//image
class ImageScrollExpand {
  constructor() {
    this.imageBox = document.querySelector(".image-box");
    this.wrapper = document.querySelector(".image-wrapper");

    if (this.imageBox && this.wrapper) {
      window.addEventListener("scroll", this.handleScroll.bind(this));
    }
  }

  handleScroll() {
    const rect = this.wrapper.getBoundingClientRect();
    const totalScroll = window.innerHeight * 0.75;
    const scrolled = Math.min(Math.max(-rect.top, 0), totalScroll);
    const progress = scrolled / totalScroll;

    const startSize = 300;
    const finalWidth = window.innerWidth;
    const finalHeight = window.innerHeight;

    const width = startSize + (finalWidth - startSize) * progress;
    const height = startSize + (finalHeight - startSize) * progress;

    this.imageBox.style.width = `${width}px`;
    this.imageBox.style.height = `${height}px`;
    this.imageBox.style.borderRadius = `${20 * (1 - progress)}px`;
  }
}




//navbar
class NavHoverIndicator {
  constructor() {
    this.navItems = document.querySelectorAll(".nav-item");
    this.hoverBg = document.querySelector(".hover-bg");

    this.navItems.forEach(item => {
      item.addEventListener("mouseenter", () => this.moveHoverBg(item));
      item.addEventListener("mouseleave", () => this.hideHoverBg());
    });
  }

  moveHoverBg(element) {
    const rect = element.getBoundingClientRect();
    const parentRect = element.parentElement.getBoundingClientRect();
    this.hoverBg.style.width = `${rect.width}px`;
    this.hoverBg.style.left = `${rect.left - parentRect.left}px`;
    this.hoverBg.style.opacity = 1;
  }

  hideHoverBg() {
    this.hoverBg.style.opacity = 0;
    this.hoverBg.style.width = `0`;
  }
}

new TextRevealCurve();
new ImageScrollExpand();
new NavHoverIndicator();



// Newsletter form handling
        document.getElementById('main-newsletter-form').addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            alert('Thank you for subscribing! We\'ll keep you updated on the latest VR adventures.');
            this.reset();
        });

        document.getElementById('footer-newsletter-form').addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            alert('Successfully subscribed to our newsletter!');
            this.reset();
        });

          window.addEventListener('click', () => {
    const music = document.getElementById('background-music');
    music.play().catch(e => console.log("Autoplay blocked:", e));
  }, { once: true });