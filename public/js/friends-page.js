async function redirectToProfile(nickname) {
  window.location.href = `/users/${nickname}`;
}

function showFriends() {
  const friendsButton = document.getElementById('showFriends');
  const requestsButton = document.getElementById('showRequests');
  requestsButton.classList.remove('active-friend-toggle');
  friendsButton.classList.add('active-friend-toggle');

  const friendsZone = document.getElementById('friendsZone');
  const requestsZone = document.getElementById('requestsZone');
  const overallInfoFriends = document.getElementById('info-about-friends');
  const overallInfoRequests = document.getElementById('info-about-requests');

  friendsZone.style.display = 'block';
  requestsZone.style.display = 'none';
  overallInfoFriends.style.display = 'block';
  overallInfoRequests.style.display = 'none';
}

function showRequests() {
  const friendsButton = document.getElementById('showFriends');
  const requestsButton = document.getElementById('showRequests');
  friendsButton.classList.remove('active-friend-toggle');
  requestsButton.classList.add('active-friend-toggle');

  const friendsZone = document.getElementById('friendsZone');
  const requestsZone = document.getElementById('requestsZone');
  const overallInfoFriends = document.getElementById('info-about-friends');
  const overallInfoRequests = document.getElementById('info-about-requests');

  friendsZone.style.display = 'none';
  requestsZone.style.display = 'block';
  overallInfoFriends.style.display = 'none';
  overallInfoRequests.style.display = 'block';
}
