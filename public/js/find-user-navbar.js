function findUsersByNickname() {
  const userInput = document.getElementById('search-users').value;
  window.location.href = `/users/search/?nickname=${userInput}`;
}
