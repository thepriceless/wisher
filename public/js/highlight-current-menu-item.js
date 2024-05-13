window.onload = function () {
  const currentPage = document.location.pathname;
  const menuItems = document.getElementsByClassName('nav-bar__box');

  for (const currentElement of menuItems) {
    const id = currentElement.getAttribute('id');
    console.log('current element id: ', id);
    console.log('current page: ', currentPage);
    if (currentPage.endsWith(id?.slice(id.lastIndexOf('__') + 2))) {
      currentElement.classList.add('active');
      break;
    }
  }
};
