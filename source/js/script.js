const getScroll = () => {

  const trackScroll = () => {
    const scrolled = window.pageYOffset;
    const coords = document.documentElement.clientHeight;

    if (scrolled > coords) {
      goTopPage.classList.add('scroll-up-link-showed');
    }
    if (scrolled < coords) {
      goTopPage.classList.remove('scroll-up-link-showed');
    }
  }

  const backToTop = () => {
    if (window.pageYOffset > 0) {
      window.scrollBy(0, -80);
      setTimeout(backToTop, 0);
    }
  }

  const goTopPage = document.querySelector('.scroll-up-link');

  window.addEventListener('scroll', trackScroll);
  goTopPage.addEventListener('click', backToTop);
}

getScroll();



// window.onscroll = () => {
//   scrollFunction()
// };

// const scrollFunction = () => {
//     if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
//         document.getElementById('scroll-up-link-showed').style.display = 'block';
//     } else {
//         document.getElementById('scroll-up-link-showed').style.display = 'none';
//     }
// }

// const topFunction = () => {
//     document.body.scrollTop = 0; // for Safari
//     document.documentElement.scrollTop = 0; // for Chrome, Firefox, IE and Opera
// }
