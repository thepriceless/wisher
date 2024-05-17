const socket = io(window.location.origin);

const friendRequestStateChanged = (changerNickname, changeeNickname) => {
  const payload = { changerNickname, changeeNickname };
  socket.emit('friend request', payload);
};

socket.on('friend request result', (changerNickname, changeeNickname) => {
  const userProfileLink = document.getElementById(
    'link-to-user-profile-navbar',
  );
  const href = userProfileLink.getAttribute('href');
  const pageNickname = href.split('/').pop();

  if (pageNickname === changeeNickname || pageNickname === changerNickname) {
    const message = `User ${changerNickname} has changed the state 
      of friend request with user ${changeeNickname}!`;

    toastr.success(message);
  }
});
