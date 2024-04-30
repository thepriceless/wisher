async function uploadItem(event) {
  event.preventDefault();
  const privacy = document.getElementById('wishlist').value;
  const wishlistResponse = await fetch(`/api/wishlists?privacy=${privacy}`);
  if (wishlistResponse.ok) {
    const wishlistData = await wishlistResponse.json();
    const body = composeDataFromForm(event.target, wishlistData);
    const response = await fetch('/api/wishitems/new', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body,
    });
    if (response.ok) {
      window.location.href = `/wishlists/${wishlistData.id}`;
      alert('Item successfully added!');
    } else {
      console.log('wrong');
    }
  }
}

async function saveExistingItemToWishlist(privacy, wishitemId) {
  const response = await fetch(`/api/wisher/${wishitemId}?privacy=${privacy}`, {
    method: 'POST',
  });
  if (response.ok) {
    alert('Item successfully added!');
  } else {
    console.log('wrong');
  }
}

function composeDataFromForm(form, wishlistData) {
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

  return new URLSearchParams(formData);
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
