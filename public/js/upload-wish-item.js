function pushData(event) {
	event.preventDefault();
	let view = document.getElementById("wishlist-items");
	let newTd = document.createElement("li");
	const inputText = document.getElementById("item-name").value;
	const node = document.createTextNode(inputText);
	newTd.appendChild(node);
	view.appendChild(newTd);
}

function addWishItem(event) {
	event.preventDefault();
	const form = event.target;
    const itemName = form.elements['item-name'].value;
	const itemImage = form.elements['picture'].files[0];

	const template = document.getElementsByClassName('wish__item-template')[0];
	const clone = template.content.cloneNode(true);
	if (itemImage !== undefined) {
		clone.querySelector('.wish__back-photo').style.backgroundImage = `url(${URL.createObjectURL(itemImage)})`;
	}
	clone.querySelector('.wish__item-title').textContent = itemName;
	document.getElementsByClassName('wish__zone')[0].appendChild(clone);

	let wishItems = JSON.parse(localStorage.getItem('wishItems')) || [];
    wishItems.push({ itemName, itemImage: null });
    localStorage.setItem('wishItems', JSON.stringify(wishItems));
}

window.onload = function() {
    let wishItems = JSON.parse(localStorage.getItem('wishItems')) || [];
    for (let wishItem of wishItems) {
        const template = document.getElementsByClassName('wish__item-template')[0];
        const clone = template.content.cloneNode(true);
        if (wishItem.itemImage !== null) {
            clone.querySelector('.wish__back-photo').style.backgroundImage = `url(${wishItem.itemImage})`;
        }
        clone.querySelector('.wish__item-title').textContent = wishItem.itemName;
        document.getElementsByClassName('wish__zone')[0].appendChild(clone);
    }
}
