
  // انیمیشن‌های اسلاید اول
  import { gsap } from 'gsap';
 export const animateSlide1 = () => {
    gsap.from('.swiper-slide-active .yellow', { y: '-1000', duration: 2 });
    gsap.from('.swiper-slide-active .image', { x: '-1000', duration: 2 });
    gsap.from('.swiper-slide-active .small', { y: '-100', opacity: 0, delay: 2.1 });
    gsap.to('.swiper-slide-active .image', {
      y: '0',
      x: '-20',
      opacity: 1,
      delay: 2.1,
    });
    gsap.from('.swiper-slide-active .arrow', { y: '100', opacity: 0, delay: 2.1 });
    gsap.to('.swiper-slide-active .arrow', {
      fill: '#ff0000',
      color: '#ff0000',
      duration: 1,
      yoyo: true,
      repeat: -1,
      delay: 2.1,
    });
    gsap.from('.swiper-slide-active .bot', { y: '100', opacity: 0, delay: 2.1 });
    gsap.from('.swiper-slide-active .big span.after', { y: '150', opacity: 0, delay: 2.1, stagger: 0.2 });
    gsap.to('.swiper-slide-active .big span.after', { y: '0', x: '20', opacity: 1, delay: 2.1, stagger: 0.2 });
    gsap.from('.swiper-slide-active .big span.before', { y: '150', opacity: 0, delay: 2.1, stagger: 0.2 });
    gsap.to('.swiper-slide-active .big span.before', { y: '0', x: '-30', opacity: 1, delay: 2.1, stagger: 0.2 });
  };

  // انیمیشن‌های اسلاید دوم
  export const animateSlide2 = () => {
    gsap.from('.swiper-slide-active .y', { y: '-1000', duration: 2 });
    gsap.from('.swiper-slide-active .y2', { y: '-1100', duration: 3 });
    gsap.to('.swiper-slide-active .y2', { y: '230', duration: 4 });
    gsap.from('.swiper-slide-active .y3', { y: '-800', duration: 4.8 });
    gsap.to('.swiper-slide-active .y3', { y: '530', duration: 6.0 });

    gsap.from('.swiper-slide-active .content .title_number', { y: '100', opacity: 0, delay: 1, stagger: 0.2, ease: 'circ' });
    gsap.from('.swiper-slide-active .content .title', { y: '100', opacity: 0, delay: 2, ease: 'circ' });
    gsap.to('.swiper-slide-active .content .title', { y: '140', x: '-90', opacity: 1, delay: 2, ease: 'circ' });
    gsap.from('.swiper-slide-active .content .image', { y: '100', opacity: 0, delay: 2, ease: 'elastic.out' });

    gsap.from('.swiper-slide-active .content2 .title', { y: '100', opacity: 0, delay: 2.5, stagger: 0.2, ease: 'circ' });
    gsap.to('.swiper-slide-active .content2 .title', { y: '0', opacity: 1, delay: 3.6, stagger: 0.2, ease: 'circ' });
    gsap.from('.swiper-slide-active .content2 .image', { x: '100', opacity: 0, delay: 3, ease: 'circ' });
    gsap.to('.swiper-slide-active .content2 .image', { x: '0', opacity: 1, delay: 3.2, ease: 'circ' });
    gsap.from('.swiper-slide-active .content2 .title_number', { y: '100', opacity: 0, delay: 2.5, stagger: 0.2, ease: 'circ' });

    gsap.from('.swiper-slide-active .content3 .title', { y: '100', opacity: 0, delay: 3.5, stagger: 0.2, ease: 'circ' });
    gsap.to('.swiper-slide-active .content3 .title', { y: '0', opacity: 1, delay: 4.6, stagger: 0.2, ease: 'circ' });
    gsap.from('.swiper-slide-active .content3 .image', { x: '100', opacity: 0, delay: 4, ease: 'circ' });
    gsap.to('.swiper-slide-active .content3 .image', { x: '0', opacity: 1, delay: 4.2, ease: 'circ' });
    gsap.from('.swiper-slide-active .content3 .title_number', { y: '100', opacity: 0, delay: 3.5, stagger: 0.2, ease: 'circ' });
  };

  // انیمیشن‌های اسلاید سوم
  export const animateSlide3 = () => {
    gsap.from('.swiper-slide-active .content3 .title .sub', { y: '100', opacity: 0, delay: 2, stagger: 0.5, ease: 'circ' });
    gsap.from('.swiper-slide-active .content3 .title .one', { opacity: 0, delay: 2.2, stagger: 0.5, ease: 'circ' });
    gsap.from('.swiper-slide-active .content3 .title .one_one', { opacity: 0, delay: 2.4, stagger: 0.5, ease: 'circ' });
    gsap.from('.swiper-slide-active .content3 .title .two', { opacity: 0, delay: 2.6, stagger: 0.5, ease: 'circ' });
    gsap.from('.swiper-slide-active .content3 .title .two_two', { opacity: 0, delay: 3, stagger: 0.5, ease: 'circ' });
    gsap.from('.swiper-slide-active .content3 .title .three', { opacity: 0, delay: 3.4, stagger: 0.5, ease: 'circ' });
  };
