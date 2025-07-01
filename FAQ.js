 class FAQManager {
      constructor() {
        this.faqItems = document.querySelectorAll('.faq-item');
        this.init();
      }
      init() {
        this.faqItems.forEach(item => {
          const question = item.querySelector('.faq-question');
          question.addEventListener('click', () => this.toggleItem(item));
          question.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              this.toggleItem(item);
            }
          });
        });
      }
      toggleItem(clickedItem) {
        const isActive = clickedItem.classList.contains('active');
        this.faqItems.forEach(item => {
          item.classList.remove('active');
          const question = item.querySelector('.faq-question');
          question.setAttribute('aria-expanded', 'false');
          item.querySelector('.faq-answer').hidden = true;
        });
        if (!isActive) {
          clickedItem.classList.add('active');
          const question = clickedItem.querySelector('.faq-question');
          question.setAttribute('aria-expanded', 'true');
          const answer = clickedItem.querySelector('.faq-answer');
          answer.hidden = false;
          setTimeout(() => {
            clickedItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }, 200);
        }
      }
    }
    document.addEventListener('DOMContentLoaded', () => new FAQManager());

    document.addEventListener('mousemove', e => {
      let cursor = document.querySelector('.cursor');
      if (!cursor) {
        cursor = document.createElement('div');
        cursor.className = 'cursor';
        document.body.appendChild(cursor);
      }
      cursor.style.left = (e.clientX - 10) + 'px';
      cursor.style.top = (e.clientY - 10) + 'px';
    });

       window.addEventListener('click', () => {
    const music = document.getElementById('background-music');
    music.play().catch(e => console.log("Autoplay blocked:", e));
  }, { once: true });