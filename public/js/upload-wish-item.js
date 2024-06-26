async function uploadItem(event) {
  event.preventDefault();
  const form = document.getElementById('upload-item-form');
  const wishitemId = document.querySelector('.body__main').dataset.id;
  const body = composeDataFromForm(form);

  if (!body.has('importance')) {
    alert("It's required to specify the importance");
    return;
  }

  const loader = document.querySelector('.loader-zone');
  loader.style.display = 'flex';

  let response;
  if (wishitemId && wishitemId !== 'null') {
    body.append('existingWishitemId', wishitemId);
    response = await fetch(`/api/wishitems/new?existingimage=true`, {
      method: 'POST',
      body: body,
    });
  } else {
    response = await fetch('/api/wishitems/new', {
      method: 'POST',
      body: body,
    });
  }

  const responseData = await response.json();
  if (response.ok) {
    alert('Item successfully added!');
    window.location.href = `/wishlists/${responseData.wishlistId}`;
    loader.style.display = 'none';
  } else if (response.status === 400) {
    loader.style.display = 'none';
    if (responseData.message === 'Max file size reached') {
      alert('Max file size (4 MB) reached. Upload another photo');
    } else if (responseData.message === 'Incorrect file extension') {
      alert('Incorrect file extension. You can use only .jpg, .jpeg and .png');
    }
  } else if (response.status === 409) {
    loader.style.display = 'none';
    if (responseData.message === 'Wishitem limit exceeded') {
      alert(
        "You have reached the maximum number of items in your wishlist. You can't add more",
      );
    }
  }
}

function composeDataFromForm(form) {
  const formData = new FormData(form);
  let itemShopLinks = formData
    .getAll('itemshopLinks')
    .filter((link) => link.trim() !== '');
  if (itemShopLinks.length !== 0) {
    formData.delete('itemshopLinks');
    itemShopLinks.forEach((link, index) => {
      formData.append(`itemshopLinks[${index}]`, link);
    });
  }

  return formData;
}

let linkCounter = 0;

window.addEventListener('load', async () => {
  const wishitemId = document.querySelector('.body__main').dataset.id;
  if (wishitemId) {
    const response = await fetch(`/api/wishitems/${wishitemId}`);
    if (response.ok) {
      const data = await response.json();

      if (data !== null) {
        for (let i = 0; i < data.wishitem.itemshopLinks.length; i++) {
          addLinkField();
          document.getElementById('link' + (i + 1)).value =
            data.wishitem.itemshopLinks[i];
        }
      }
    }
  }
});

function addLinkField() {
  if (linkCounter < 3) {
    linkCounter++;

    let newLinkInput = document.createElement('input');
    newLinkInput.type = 'url';
    newLinkInput.id = 'link' + linkCounter;
    newLinkInput.name = 'itemshopLinks';
    newLinkInput.maxLength = 400;
    newLinkInput.classList.add('form-input', 'wishitem-shop-link');

    let newLinkLabel = document.createElement('label');
    newLinkLabel.htmlFor = 'link' + linkCounter;

    let removeIcon = document.createElement('img');
    removeIcon.src =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAACXBIWXMAAAsTAAALEwEAmpwYAAAA9klEQVR4nO2VW6oCMQxA63ZM3IovvPihWzJxhQqKXqWJG1AYiY8PtWprnXsR50A/BpqctkmnzlVUfA06bvwIoSjhwjO2Y+NkhB1l/BVGL1TvJUmLwtUsUBkLG8KwVYb+08Uy9I9zz3Hok8SGMqzPCWLk19LDIFi5VIShe53onjwktW/LkSw2rEY3CQl2mzEOL3ohNIdw4HKQB/LSpBFHGVWKLEI7L22nsfJSpUaopqGG+xOplinX/2gufXBlYu7526XuxNvlnhqt3F+m5UjfLcE895EQxlm6mHGZ+yxajhePGmdCMEk5skMcwdRiPdebyeKKio9lD7r/+d24Yoq/AAAAAElFTkSuQmCC';
    removeIcon.addEventListener('click', removeLinkField);

    let inputContainer = document.createElement('div');
    inputContainer.classList.add('single-link-wrapper');
    inputContainer.appendChild(newLinkInput);
    inputContainer.appendChild(removeIcon);

    let linksContainer = document.getElementById('linksContainer');
    linksContainer.appendChild(newLinkLabel);
    linksContainer.appendChild(inputContainer);
  }
}

function removeLinkField(event) {
  let inputContainer = event.target.parentNode;
  inputContainer.parentNode.removeChild(inputContainer);
  linkCounter--;
}
