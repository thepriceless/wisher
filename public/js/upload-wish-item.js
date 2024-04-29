async function uploadItem(event) {
  event.preventDefault();

  const privacyType = new URLSearchParams();
  const privacy = document.getElementById('wishlist').value;
  privacyType.append('privacy', privacy);
  const wishlistResponse = await fetch('/wishlists/by-privacy-owner', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: privacyType,
  });
  if (wishlistResponse.ok) {
    const wishlistData = await wishlistResponse.json();
    const form = event.target;
    const formData = new FormData(form);
    formData.delete('wishlist');
    formData.append('wishlistId', wishlistData.id);

    let itemShopLinks = formData.getAll('itemshopLinks');
    if (itemShopLinks.length !== 0) {
      formData.delete('itemshopLinks');
      itemShopLinks.forEach((link, index) => {
        formData.append(`itemshopLinks[${index}]`, link);
      });
    }

    const response = await fetch('/items/new', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(formData),
    });
    if (response.ok) {
      window.location.href = `/wishlists/${wishlistData.id}`;
      alert('Item successfully added!');
    } else {
      console.log('wrong');
    }
  }
}

let linkCounter = 1;
function addLinkField() {
  if (linkCounter < 3) {
    linkCounter++;

    let newLinkInput = document.createElement('input');
    newLinkInput.type = 'url';
    newLinkInput.id = 'link' + linkCounter;
    newLinkInput.name = 'itemshopLinks';

    let newLinkLabel = document.createElement('label');
    newLinkLabel.htmlFor = 'link' + linkCounter;
    newLinkLabel.textContent = 'Online shop link:';

    let linksContainer = document.getElementById('linksContainer');
    linksContainer.appendChild(newLinkLabel);
    linksContainer.appendChild(newLinkInput);
  }
}

function removeLinkField() {
  let linksContainer = document.getElementById('linksContainer');
  if (linkCounter > 0) {
    let lastLinkInput = document.getElementById('link' + linkCounter);
    let lastLinkLabel = lastLinkInput.previousSibling;

    linksContainer.removeChild(lastLinkInput);
    linksContainer.removeChild(lastLinkLabel);
    linkCounter--;
  }
}
