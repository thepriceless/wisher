window.addEventListener('load', () => {
  const defaultImage = '../objects/default-present-image.png';
  const image = document.getElementById('wisher-item-image');
  if (image.getAttribute('src') === '') {
    image.src = defaultImage;
  }
});
