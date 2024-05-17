const socket = io(window.location.origin);

var friendRequestStateChanged = (changerNickname, changeeNickname) => {
  payload = { changerNickname, changeeNickname };
  socket.emit('friend request', payload);
};

socket.on('friend request result', (changerNickname, changeeNickname) => {
  var userProfileLink = document.getElementById('link-to-user-profile-navbar');
  var href = userProfileLink.getAttribute('href');
  var pageNickname = href.split('/').pop();

  if (pageNickname === changeeNickname || pageNickname === changerNickname) {
    const message = `User ${changerNickname} has changed the state 
      of friend request with user ${changeeNickname}!`;

    toastr.success(message);
  }
});
