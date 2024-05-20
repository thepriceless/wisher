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

      const linksContainer = document.querySelector('.links-container');
      const existingLinks = linksContainer.querySelectorAll(
        '.suggestion-zone__marketplace-single-link',
      );

      const helperText = document.querySelector('.helper-text');
      helperText.style.display =
        data.itemshopLinks.length > 0 ? 'block' : 'none';

      data.itemshopLinks.forEach((link, index) => {
        let aTag;
        if (index < existingLinks.length) {
          aTag = existingLinks[index];
        } else {
          aTag = document.createElement('a');
          aTag.className = 'suggestion-zone__marketplace-single-link';
          aTag.target = '_blank';
          linksContainer.appendChild(aTag);
        }
        aTag.href = link;
        aTag.textContent = `Link №${index + 1}`;
      });

      for (let i = data.itemshopLinks.length; i < existingLinks.length; i++) {
        existingLinks[i].remove();
      }
    });
}
