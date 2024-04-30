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
