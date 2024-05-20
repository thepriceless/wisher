function redirectToWishitem(wishitemId) {
  window.location.href = `/wishitems/${wishitemId}`;
}

async function deleteWishitem(wishitemId, wishlistId) {
  const response = await fetch(
    `/api/wishitems/?wishitem=${wishitemId}&wishlist=${wishlistId}`,
    {
      method: 'DELETE',
    },
  );
  if (response.ok) {
    data = await response.json();
    window.location.reload();
  } else {
  }
}

window.addEventListener('load', () => {
  setDefaultWishitemImage();
});


function setDefaultWishitemImage() {
  const defaultImage = '../objects/default-present-image.png';
  const images = document.querySelectorAll(
    '.wishitem-container img.wishitem-card__image',
  );
  images.forEach((img) => {
    if (img.getAttribute('src') === '') {
      img.src = defaultImage;
    }
  });
}