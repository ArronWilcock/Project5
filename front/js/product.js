const queryString = window.location.search;

const urlParams = new URLSearchParams(queryString);

const productId = urlParams.get("id");

fetch(`http://localhost:3000/api/products/${productId}`)
  .then((data) => {
    return data.json();
  })
  .then((pageProduct) => {
    populateProductPage(pageProduct);
  });

function populateProductPage(product) {
  const productImageHolder = document.querySelector(".item__img");

  productImageHolder.innerHTML = `<img src="${product.imageUrl}" alt="${product.altTxt}">`;

  const productTitle = document.getElementById("title");
  productTitle.innerText = product.name;

  const productPrice = document.getElementById("price");
  productPrice.innerText = product.price;

  const productDescription = document.getElementById("description");
  productDescription.innerText = product.description;

  const productColor = document.getElementById("colors");
  for (let color of product.colors) {
    productColor.innerHTML += `<option value="${color}">${color}</option>`;
  }
}
// this is the new cart item array

let cartItems = [];

function cartItem(id, quantity, color) {
  this.id = id;
  this.quantity = quantity;
  this.color = color;
}

addToCart.addEventListener("click", addCartItem);

function addCartItem() {
  let id = productId;
  let quantity = itemQuantity();
  let color = selectedColor();
  let currentNewItem = new cartItem(id, quantity, color);

  //   function to change the quantity of a cart item if it has the same id & color
  function sameItem() {
    for (let i of cartItems) {
      if (i.id == currentNewItem.id && i.color == currentNewItem.color) {
        i.quantity = i.quantity + currentNewItem.quantity;
      }
    }
  }
  console.log(currentNewItem);
  console.log(cartItems);
  return cartItems.push(currentNewItem);
}

// this gets the input value of the item quantity
document.getElementById("quantity").addEventListener("change", itemQuantity);

function itemQuantity() {
  let quantity = document.getElementById("quantity");
  const selectedQuantity = quantity.value;
  return selectedQuantity;
}
//  this function gets the selected product color
document.getElementById("colors").addEventListener("change", selectedColor);

function selectedColor() {
  cartItemColor = document.getElementById("colors").value;
  return cartItemColor;
}
