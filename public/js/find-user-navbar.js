function findUsersByNickname() {
  const userInput = document.getElementById('search').value;
  window.location.href = `/users/search/?nickname=${userInput}`;
}
