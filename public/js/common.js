function handleKeyPress(event) {
  if (event.key === 'Enter') {
    findUsersByNickname();
  }
}

function findUsersByNickname() {
  const userInput = document.getElementById('search-users').value;
  window.location.href = `/users/search/?name=${userInput}`;
}

function logoutFunction() {
  document.cookie =
    'AccessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  window.location.href = '/auth/login';
}

function redirectLoginPage() {
  window.location.href = '/auth/login';
}
