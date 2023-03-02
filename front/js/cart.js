let cartPageItems = JSON.parse(localStorage.cartItems);

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

  function changeItemQuantity($event) {
    const changedElement = $event.target;
    let changedQuantity = changedElement.value;

    //TODO access cart from local storage
    let cartPageItems = JSON.parse(localStorage.cartItems);
    //TODO change the selected cart item quantity

    //note use changedElement variable for the closest method (find the article tag for the element that was changed)
    const changedItem = changedElement.closest("article");
    //note we need the id and color from the article tag
    const itemId = changedItem.getAttribute("data-id");
    const itemColor = changedItem.getAttribute("data-color");
    // note use the ID & color to find the element in the cart array from local storage(use array.find())
    const newItemQuantity = cartPageItems.find(
      (item) => item.id == itemId && item.color == itemColor
    );
    newItemQuantity.quantity = changedQuantity;
    //TODO put cart back to local storage
    localStorage.setItem("cartItems", JSON.stringify(cartPageItems));
    console.log(cartPageItems);
  }

  const deleteItemButton = newCartItem.querySelector(".deleteItem");
  deleteItemButton.addEventListener("click", deleteItem);

  function deleteItem($event) {
    const deletedItem = $event.target;

    let cartPageItems = JSON.parse(localStorage.cartItems);

    const itemToDelete = deletedItem.closest("article");
    const itemId = itemToDelete.getAttribute("data-id");
    const itemColor = itemToDelete.getAttribute("data-color");
    const arrayItemToDelete = cartPageItems.find(
      (item) => item.id == itemId && item.color == itemColor
    );
    const index = cartPageItems.indexOf(arrayItemToDelete);
    console.log(index);
    cartPageItems.splice(index, 1);
    itemToDelete.remove();
    localStorage.setItem("cartItems", JSON.stringify(cartPageItems));
    console.log(cartPageItems);
  }

  updateTotalCartQuantity(cartItem);
  updateTotalCartPrice(cartItem, product);
}

function updateTotalCartQuantity(cartItem) {
  const totalQuantityHolder = document.getElementById("totalQuantity");
  let totalQuantityText = totalQuantityHolder.innerText;
  if (totalQuantityText === "") {
    totalQuantityText = "0";
  }
  let totalQuantity = parseInt(totalQuantityText);

  totalQuantity += cartItem.quantity;
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
