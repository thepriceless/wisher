async function processFriendRequest(receiverNickname, senderNickname) {
  try {
    const loader = document.querySelector('.loader-zone');
    loader.style.display = 'flex';
  } catch (error) {}
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
    friendRequestStateChanged(senderNickname, receiverNickname);
    const friendshipStateResponse = await getFriendshipState(receiverNickname);
    if (friendshipStateResponse.ok) {
      const data = await friendshipStateResponse.json();
      try {
        loader.style.display = 'none';
      } catch (error) {}
      changeButtonText(data.friendshipState);
    }
  } else {
    loader.style.display = 'none';
    alert('Failed to send friend request');
  }
}
