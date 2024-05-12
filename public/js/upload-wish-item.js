async function uploadItem(event) {
  event.preventDefault();
  const privacy = document.getElementById('wishlist').value;
  const body = composeDataFromForm(event.target);
  body.append('holderWishlistPrivacy', privacy);
  const response = await fetch('/api/wishitems/new', {
    method: 'POST',
    body: body,
  });
  if (response.ok) {
    const newWishitem = await response.json();
    console.log(newWishitem);
    window.location.href = `/wishlists/${newWishitem.wishlistId}`;
    alert('Item successfully added!');
  } else {
    const r = await response.json();
    console.log(r);
    console.log('wrong');
  }
}

async function saveExistingItemToWishlist(privacy, wishitemId) {
  const response = await fetch(
    `/api/wishitems/${wishitemId}?privacy=${privacy}`,
    {
      method: 'POST',
    },
  );
  if (response.ok) {
    alert('Item successfully added!');
  } else {
    console.log('wrong');
  }
}

function composeDataFromForm(form) {
  const formData = new FormData(form);

  formData.delete('wishlist');

  let itemShopLinks = formData.getAll('itemshopLinks');
  if (itemShopLinks.length !== 0) {
    formData.delete('itemshopLinks');
    itemShopLinks.forEach((link, index) => {
      formData.append(`itemshopLinks[${index}]`, link);
    });
  }

  return formData;
}

let linkCounter = 0;
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

    friendRequestStateChanged('Added field for online shop link.');
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
