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
    newCartItem.setAttribute("class", "class__item");

    // fetch(`http://localhost:3000/api/products/${cartItem.id}`)
    //   .then(response => response.json())
    //   .then(data => cartItems(data));

    //   function cartItems(data) {
    //     const cartItemName = this.name
    //   }

    newCartItem.innerHTML = `
<div class="cart__item__img">
  <img src="" alt="Photo of a sofa">
</div>
<div class="cart__item__content">
  <div class="cart__item__content__description">
    <h2>product name</h2>
    <p>${cartItem.color}</p>
    <p>€42.00</p>
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
  }
}
