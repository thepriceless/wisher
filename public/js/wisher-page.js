function wisherGetNextItem() {
  fetch('/api/wisher/random-item')
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      document.getElementById('wisher-item-title').textContent = data.title;
      document.getElementById('wisher-item-description').textContent =
        data.description;

      const wisherItemLink = data.imageLink;
      const imageElement = document.getElementById('wisher-item-image');
      imageElement.src = wisherItemLink;
    });
}
