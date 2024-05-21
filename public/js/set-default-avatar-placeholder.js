window.addEventListener('load', function () {
  const defaultImage = '/objects/default-avatar-2-shifted.png';
  const friendsAvatarImages = document.querySelectorAll('img.avatar');
  friendsAvatarImages.forEach((image) => {
    if (image.getAttribute('src') === '') {
      image.src = defaultImage;
    }
  });

  const avatarImage = document.querySelectorAll('img.nav__bar-avatar')[0];
  if (avatarImage.getAttribute('src') === '') {
    avatarImage.src = defaultImage;
    avatarImage.style.backgroundColor = 'rgba(242, 168, 90, 1)';
  }
});
