async function redirectToProfile(nickname) {
  window.location.href = `/users/${nickname}`;
}

window.onload = function () {
  const defaultImage = '../objects/default-avatar-2-shifted.png';
  const avatarImages = document.querySelectorAll('img.avatar');
  avatarImages.forEach((image) => {
    console.log(image.getAttribute('src'));
    if (image.getAttribute('src') === '') {
      image.src = defaultImage;
    }
  });
};
