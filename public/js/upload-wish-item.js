async function uploadItem(event) {
  event.preventDefault();
  const form = document.getElementById('upload-item-form');
  const wishitemId = document.querySelector('.body__main').dataset.id;
  const body = composeDataFromForm(form);

  for (let pair of body.entries()) {
    console.log(pair[0] + ', ' + pair[1]);
  }

  if (!body.has('importance')) {
    alert("It's required to specify the importance");
    return;
  }

  let response;
  if (wishitemId) {
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

  if (response.ok) {
    const newWishitem = await response.json();
    window.location.href = `/wishlists/${newWishitem.wishlistId}`;
    alert('Item successfully added!');
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
      console.log(data);

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
    newLinkInput.classList.add('form-input', 'wishitem-shop-link');

    let newLinkLabel = document.createElement('label');
    newLinkLabel.htmlFor = 'link' + linkCounter;

    let removeIcon = document.createElement('img');
    removeIcon.src =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAACXBIWXMAAAsTAAALEwEAmpwYAAAA9klEQVR4nO2VW6oCMQxA63ZM3IovvPihWzJxhQqKXqWJG1AYiY8PtWprnXsR50A/BpqctkmnzlVUfA06bvwIoSjhwjO2Y+NkhB1l/BVGL1TvJUmLwtUsUBkLG8KwVYb+08Uy9I9zz3Hok8SGMqzPCWLk19LDIFi5VIShe53onjwktW/LkSw2rEY3CQl2mzEOL3ohNIdw4HKQB/LSpBFHGVWKLEI7L22nsfJSpUaopqGG+xOplinX/2gufXBlYu7526XuxNvlnhqt3F+m5UjfLcE895EQxlm6mHGZ+yxajhePGmdCMEk5skMcwdRiPdebyeKKio9lD7r/+d24Yoq/AAAAAElFTkSuQmCC';
    removeIcon.addEventListener('click', removeLinkField);

    let inputContainer = document.createElement('div');
    inputContainer.classList.add('input-container');
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
