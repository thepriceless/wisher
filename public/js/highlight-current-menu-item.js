(function () {
  document.addEventListener('DOMContentLoaded', function (event) {
    const currentPage = document.location.pathname;
    const menuItems = document.getElementsByClassName('nav-bar__box');

    for (const currentElement of menuItems) {
      const href = currentElement.getAttribute('href');
      if (currentPage.endsWith(href?.slice(href.lastIndexOf('/') + 1))) {
        currentElement.classList.add('active');
        break;
      }
    }
  });
})();
