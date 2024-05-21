window.addEventListener('load', () => {
  setDefaultWishitemImage();
});

const defaultImage = '/objects/default-present-image.png';

function setDefaultWishitemImage() {
  const images = document.querySelectorAll('.wisher-item-image');
  images.forEach((img) => {
    if (img.getAttribute('src') === '') {
      img.src = defaultImage;
    }
  });
}
