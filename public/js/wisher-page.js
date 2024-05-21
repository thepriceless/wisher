function wisherGetNextItem() {
  fetch('/api/wisher/random-item')
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      document.getElementById('wisher-item-title').textContent = data.title;
      document.getElementById('wisher-item-description').textContent =
        data.description;

      const redirectElement = document.querySelector(
        '.suggestion-zone__add-this-wishitem-redirect',
      );
      let hrefParts = redirectElement.href.split('=');
      redirectElement.href = hrefParts[0] + '=' + data.id;

      const wisherItemLink = data.imageLink;
      const imageElement = document.querySelectorAll('.wisher-item-image')[0];
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

      setDefaultWishitemImage();
    });
}

window.addEventListener('load', () => {
  const helperText = document.querySelector('.helper-text');
  const linksContainer = document.querySelector('.links-container');
  helperText.style.display = linksContainer.children.length > 0 ? 'block' : 'none';
  setDefaultWishitemImage();
});
