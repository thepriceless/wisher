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
    window.location.reload();
  }
}
