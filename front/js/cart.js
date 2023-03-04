let cartPageItems = JSON.parse(localStorage.getItem("cartItems")) || [];
console.log(cartPageItems);

const cartItemDetails = document.getElementById("cart__items");

populateCart(cartPageItems);

function populateCart(cartPageItems) {
  for (let i = 0; i < cartPageItems.length; i++) {
    const cartItem = cartPageItems[i];
    const newCartItem = document.createElement("article");
    newCartItem.setAttribute("data-id", cartItem.id);
    newCartItem.setAttribute("data-color", cartItem.color);
    newCartItem.setAttribute("class", "cart__item");

    fetch(`http://localhost:3000/api/products/${cartItem.id}`)
      .then((response) => response.json())
      .then((data) => insertCartItem(data, newCartItem, cartItem));
  }
}

function insertCartItem(product, newCartItem, cartItem) {
  newCartItem.innerHTML = `
    <div class="cart__item__img">
      <img src="${product.imageUrl}" alt="${product.altTxt}">
    </div>
    <div class="cart__item__content">
      <div class="cart__item__content__description">
        <h2>${product.name}</h2>
        <p>${cartItem.color}</p>
        <p>€${product.price}</p>
      </div>
      <div class="cart__item__content__settings">
        <div class="cart__item__content__settings__quantity">
          <p>Quantity : </p>
          <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${cartItem.quantity}">
        </div>
        <div class="cart__item__content__settings__delete">
          <p class="deleteItem">Delete</p>
        </div>
      </div>
    </div>
    `;
  cartItemDetails.appendChild(newCartItem);

  const itemQuantity = newCartItem.querySelector(".itemQuantity");
  itemQuantity.addEventListener("change", changeItemQuantity);

  const deleteItemButton = newCartItem.querySelector(".deleteItem");
  deleteItemButton.addEventListener("click", deleteItem);

  updateTotalCartQuantity(cartItem.quantity);
  updateTotalCartPrice(cartItem, product);
}

function deleteItem($event) {
  const deletedItem = $event.target;

  let cartPageItems = JSON.parse(localStorage.getItem("cartItems"));

  const itemToDelete = deletedItem.closest("article");
  const itemId = itemToDelete.dataset.id;
  const itemColor = itemToDelete.dataset.color;
  const arrayItemToDelete = cartPageItems.find(
    (item) => item.id == itemId && item.color == itemColor
  );
  const index = cartPageItems.indexOf(arrayItemToDelete);
  console.log(index);
  cartPageItems.splice(index, 1);
  itemToDelete.remove();
  localStorage.setItem("cartItems", JSON.stringify(cartPageItems));
  console.log(cartPageItems);

  const itemRemovedQuantity = -arrayItemToDelete.quantity;
  parseInt(itemRemovedQuantity);

  updateTotalCartQuantity(itemRemovedQuantity);
}

function changeItemQuantity($event) {
  const changedElement = $event.target;
  let changedQuantity = parseInt(changedElement.value);

  let cartPageItems = JSON.parse(localStorage.getItem("cartItems"));
  const changedItem = changedElement.closest("article");

  const itemId = changedItem.dataset.id;
  const itemColor = changedItem.dataset.color;

  const foundCartItem = cartPageItems.find(
    (item) => item.id === itemId && item.color === itemColor
  );
  const quantityDifference = changedQuantity - foundCartItem.quantity;

  foundCartItem.quantity = changedQuantity;

  localStorage.setItem("cartItems", JSON.stringify(cartPageItems));
  console.log(cartPageItems);

  updateTotalCartQuantity(quantityDifference);
}

function updateTotalCartQuantity(quantity) {
  const totalQuantityHolder = document.getElementById("totalQuantity");
  let totalQuantityText = totalQuantityHolder.innerText;
  if (totalQuantityText === "") {
    totalQuantityText = "0";
  }
  let totalQuantity = parseInt(totalQuantityText);

  totalQuantity += quantity;
  totalQuantityHolder.innerText = totalQuantity;
}

function updateTotalCartPrice(cartItem, product) {
  const totalPriceHolder = document.getElementById("totalPrice");
  let totalPriceText = totalPriceHolder.innerText;
  if (totalPriceText === "") {
    totalPriceText = "0";
  }
  let totalPrice = parseInt(totalPriceText);

  totalPrice += cartItem.quantity * product.price;
  totalPriceHolder.innerText = totalPrice;
}
