function wisherGetNextItem() {
  if (currentIndex === shownIds.length - 1) {
    updatePageWithRandomWishitem();
  } else {
    updatePageWithWishitemById(shownIds[++currentIndex]);
  }
}

function wisherGetPrevItem() {
  if (currentIndex > 0) {
    updatePageWithWishitemById(shownIds[--currentIndex]);
  }
}

async function updatePageWithRandomWishitem() {
  const response = await fetch('/api/wisher/random-item');

  if (response.ok) {
    const responseData = await response.json();
    shownIds.push(responseData.wishitem.id);
    currentIndex++;
    changeViewWithNewData(responseData.wishitem);
  }
}

async function updatePageWithWishitemById(id) {
  const response = await fetch(`/api/wishitems/${id}`);

  if (response.ok) {
    const responseData = await response.json();
    changeViewWithNewData(responseData.wishitem);
  }
}

let shownIds = [];
let currentIndex = 0;

window.addEventListener('load', () => {
  const helperText = document.querySelector('.helper-text');
  const linksContainer = document.querySelector('.links-container');
  helperText.style.display =
    linksContainer.children.length > 0 ? 'block' : 'none';
  setDefaultWishitemImage();

  const redirectElement = document.querySelector(
    '.suggestion-zone__add-this-wishitem-redirect',
  );
  let hrefParts = redirectElement.href.split('=');
  shownIds.push(hrefParts[1]);
});

function changeViewWithNewData(data) {
  console.log(data);
  document.getElementById('wisher-item-title').textContent = data.title;
  document.getElementById('wisher-item-description').textContent =
    data.description;

  const redirectElement = document.querySelector(
    '.suggestion-zone__add-this-wishitem-redirect',
  );
  let hrefParts = redirectElement.href.split('=');
  redirectElement.href = hrefParts[0] + '=' + data.id;

  const wisherItemLink = data.imageLinkAsKey;
  const imageElement = document.querySelectorAll('.wisher-item-image')[0];
  if (wisherItemLink) {
    imageElement.src = `/api/images/${wisherItemLink}?imagekind=WISHITEM_IMAGE`;
  } else {
    imageElement.src = '';
  }

  const linksContainer = document.querySelector('.links-container');
  const existingLinks = linksContainer.querySelectorAll(
    '.suggestion-zone__marketplace-single-link',
  );

  const helperText = document.querySelector('.helper-text');
  helperText.style.display = data.itemshopLinks.length > 0 ? 'block' : 'none';

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

  if (shownIds.length > 500) {
    location.reload();
  }
}
