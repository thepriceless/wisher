document.addEventListener('DOMContentLoaded', async function () {
  const existingButton = document.querySelector('.wishlist-selection__button');
  const ownerNickname = extractSecondParameter(
    existingButton.getAttribute('onclick'),
  );

  const friendshipStateResponse = await getFriendshipState(ownerNickname);
  if (friendshipStateResponse.ok) {
    const data = await friendshipStateResponse.json();
    if (data.friendshipState === 'FRIENDS') {
      const newButton = existingButton.cloneNode(true);

      newButton.textContent = 'Friendly Wishlist';
      newButton.onclick = function () {
        loadWishlist('FRIENDS', ownerNickname);
      };

      const parent = document.querySelector('.wishlist-selection');
      parent.appendChild(newButton);
    }
  }
});

async function loadWishlist(privacy, ownerNickname) {
  const wishlistResponse = await fetch(
    `/api/wishlists?privacy=${privacy}&owner=${ownerNickname}`,
  );
  if (wishlistResponse.ok) {
    const data = await wishlistResponse.json();
    window.location.href = `/wishlists/${data.id}`;
  }
}

async function processFriendRequest(receiverNickname) {
  const body = new URLSearchParams();
  body.append('receiverNickname', receiverNickname);
  const response = await fetch('/api/users/friends/request', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body,
  });
  if (response.ok) {
    const friendshipStateResponse = await getFriendshipState(receiverNickname);
    if (friendshipStateResponse.ok) {
      const data = await friendshipStateResponse.json();
      changeButtonText(data.friendshipState);
    }
  } else {
    alert('Failed to send friend request');
  }
}

async function getFriendshipState(receiverNickname) {
  const params = new URLSearchParams();
  params.append('friendee', receiverNickname);
  return await fetch(`/api/users/friends/state?${params.toString()}`);
}

function changeButtonText(friendshipState) {
  const button = document.getElementById('user-profile__friend-request-btn');
  switch (friendshipState) {
    case 'NOTHING':
      button.textContent = 'Send Friend Request';
      break;
    case 'SENT_BY_SENDER':
      button.textContent = 'Cancel Friend Request';
      break;
    case 'SENT_BY_RECEIVER':
      button.textContent = 'Accept Friend Request';
      break;
    case 'FRIENDS':
      button.textContent = 'Unfriend';
      break;
  }
}

function extractSecondParameter(onclickFunction) {
  const regex = /loadWishlist\('(.+?)', '(.+?)'\)/;
  const match = onclickFunction.match(regex);
  return match[2];
}
