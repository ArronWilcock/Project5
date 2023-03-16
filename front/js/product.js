// the following variables find and define the products 'id' from the url
const queryString = window.location.search;

const urlParams = new URLSearchParams(queryString);

const productId = urlParams.get("id");

// this fetch request retrieves the product data of the defined product
fetch(`http://localhost:3000/api/products/${productId}`)
  .then((data) => {
    return data.json();
  })
  .then((pageProduct) => {
    populateProductPage(pageProduct);
  });

// this function gets the product pages information holders and inserts the fetched data DOM
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

function cartItem(id, quantity, color) {
  this.id = id;
  this.quantity = quantity;
  this.color = color;
}

addToCart.addEventListener("click", addCartItem);

// function that either gets hold of the cartItems array in local storage or initializes a new one if first item
function addCartItem() {
  const cart = JSON.parse(localStorage.getItem("cartItems")) || [];

  const id = productId;
  const quantity = getItemQuantity();
  const color = getSelectedColor();
  const currentNewItem = new cartItem(id, quantity, color);

  //   function to change the quantity of a cart item if it has the same id & color or add a cart item if no match found
  function addIfFound() {
    let isFound = false;
    for (let cartItem of cart) {
      if (
        cartItem.id == currentNewItem.id &&
        cartItem.color == currentNewItem.color
      ) {
        cartItem.quantity = cartItem.quantity + currentNewItem.quantity;
        isFound = true;
      }
    }
    return isFound;
  }
  console.log(currentNewItem);
  console.log(cart);
  if (!addIfFound()) {
    cart.push(currentNewItem);
  }
  localStorage.setItem("cartItems", JSON.stringify(cart));
}

// this gets the input value of the item quantity
document.getElementById("quantity").addEventListener("change", getItemQuantity);

function getItemQuantity() {
  const quantity = document.getElementById("quantity");
  const selectedQuantity = parseInt(quantity.value);
  return selectedQuantity;
}
//  this function gets the selected product color
document.getElementById("colors").addEventListener("change", getSelectedColor);

function getSelectedColor() {
  cartItemColor = document.getElementById("colors").value;
  return cartItemColor;
}
