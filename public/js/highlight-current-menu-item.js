window.addEventListener('load', () => {
  let currentPage = document.location.pathname;
  if (currentPage.endsWith('/')) {
    currentPage = currentPage.slice(0, -1);
  }

  const menuItems = document.getElementsByClassName('nav-bar__for-active');

  for (const currentElement of menuItems) {
    const id = currentElement.getAttribute('id');
    if (currentPage.endsWith(id?.slice(id.lastIndexOf('__') + 2))) {
      currentElement.classList.add('active');
      break;
    }
  }
});
