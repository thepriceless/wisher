async function processFriendRequest(receiverNickname, senderNickname) {
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
      changeButtonText(data.friendshipState);
    }
  } else {
    alert('Failed to send friend request');
  }
}
