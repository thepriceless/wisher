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

  if (friendsZone.children.length > 0) {
    friendsZone.style.display = 'block';
  }
  requestsZone.style.display = 'none';
  overallInfoFriends.style.display = 'block';
  overallInfoRequests.style.display = 'none';

  showWrapper();
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
  if (requestsZone.children.length > 0) {
    requestsZone.style.display = 'block';
  }
  overallInfoFriends.style.display = 'none';
  overallInfoRequests.style.display = 'block';

  showWrapper();
}

function showWrapper() {
  const friendsZone = document.getElementById('friendsZone');
  const requestsZone = document.getElementById('requestsZone');

  const wrapper = document.getElementsByClassName('default-zone-wrapper')[0];
  if (
    friendsZone.style.display === 'none' &&
    requestsZone.style.display === 'none'
  ) {
    wrapper.style.display = 'none';
  } else {
    wrapper.style.display = 'block';
  }
}
