window.addEventListener('load', function () {
  const defaultImage = '../objects/default-avatar-2-shifted.png';
  const friendsAvatarImages = document.querySelectorAll('img.avatar');
  friendsAvatarImages.forEach((image) => {
    if (image.getAttribute('src') === '') {
      image.src = defaultImage;
    }
  });

  const avatarImages = document.querySelectorAll('img.nav__bar-avatar');
  avatarImages.forEach((image) => {
    if (image.getAttribute('src') === '') {
      image.src = defaultImage;
      image.style.backgroundColor = 'rgba(242, 168, 90, 1)';
    }
  });
});
