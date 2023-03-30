const firstNameInputElement = document.getElementById("firstName");
const firstNameErrorMsg = document.getElementById("firstNameErrorMsg");
const lastNameInputElement = document.getElementById("lastName");
const lastNameErrorMsg = document.getElementById("lastNameErrorMsg");
const addressInputElement = document.getElementById("address");
const addressErrorMsg = document.getElementById("addressErrorMsg");
const cityInputElement = document.getElementById("city");
const cityErrorMsg = document.getElementById("cityErrorMsg");
const emailInputElement = document.getElementById("email");
const emailErrorMsg = document.getElementById("emailErrorMsg");

// regex to validate name and email inputs
const validName = new RegExp(/^([^0-9]*)$/g);
const validEmail = new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/g);

const productCache = [];
// This gets hold of the local storage cart items or creates a new array if blank
let cartPageItems = JSON.parse(localStorage.getItem("cartItems")) || [];
console.log(cartPageItems);

const cartItemDetails = document.getElementById("cart__items");

firstNameInputElement.addEventListener("change", ($event) =>
  validateFirstName($event.target)
);
lastNameInputElement.addEventListener("change", ($event) =>
  validateLastName($event.target)
);
addressInputElement.addEventListener("change", ($event) =>
  validateAddress($event.target)
);
cityInputElement.addEventListener("change", ($event) =>
  validateCity($event.target)
);
emailInputElement.addEventListener("change", ($event) =>
  validateEmail($event.target)
);
populateCart(cartPageItems);
//  function to use the local storage array and the fetched API data to populate the selected products details on cart page
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
// function that creates the DOM object for each new cart item
function insertCartItem(product, newCartItem, cartItem) {
  updateCache(product);
  console.log(productCache);
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
  updateTotalCartPrice(cartItem.quantity, product.price);
}
// creates a product cache to grab the product price from later
function updateCache(product) {
  if (!productCache.find((element) => element._id === product._id)) {
    productCache.push(product);
  }
}
// function to handle the total price and quantity update when cart item is deleted
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
  cartPageItems.splice(index, 1);
  itemToDelete.remove();
  localStorage.setItem("cartItems", JSON.stringify(cartPageItems));
  console.log(cartPageItems);

  const itemRemovedQuantity = -arrayItemToDelete.quantity;

  const price = findCartItemPrice(arrayItemToDelete);

  updateTotalCartQuantity(itemRemovedQuantity);
  updateTotalCartPrice(itemRemovedQuantity, price);
}

function findCartItemPrice(cartItem) {
  return productCache.find((product) => product._id === cartItem.id).price;
}
// function to handle the total price and quantity update when cart items quantity is changed
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

  const price = findCartItemPrice(foundCartItem);

  updateTotalCartQuantity(quantityDifference);
  updateTotalCartPrice(quantityDifference, price);
}
// this function holds the mathematic formula used when updating the cart quantity
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
// this function holds the mathematic formula used when updating the cart price
function updateTotalCartPrice(quantity, price) {
  const totalPriceHolder = document.getElementById("totalPrice");
  let totalPriceText = totalPriceHolder.innerText;
  if (totalPriceText === "") {
    totalPriceText = "0";
  }
  let totalPrice = parseInt(totalPriceText);

  totalPrice += quantity * price;
  totalPriceHolder.innerText = totalPrice;
}

// TODO add change event listeners to all input fields which will validate in real time
// NOTE set the error message to empty string if there are no errors in order to reset any previous error messages
const orderSubmit = document.getElementById("order");
// event listener for the order button
orderSubmit.addEventListener("click", placeOrder);
function placeOrder($event) {
  $event.preventDefault();
  // gets the values of the form input data
  const { firstName, lastName, address, city, email, hasAllValidFields } =
    validateContactForm();
  // FIXME Do not allow user to place order if fields are not valid
  if (hasAllValidFields) {
    let cart = JSON.parse(localStorage.getItem("cartItems")) || [];
    const productIds = cart.map((cartItem) => cartItem.id);

    const orderDetails = {
      contact: {
        firstName,
        lastName,
        address,
        city,
        email,
      },
      products: productIds,
    };

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderDetails),
    };
    console.log(options);
    fetch("http://localhost:3000/api/products/order", options)
      .then((data) => {
        if (!data.ok) {
          throw Error(data.status);
        }
        return data.json();
      })
      .then((result) => {
        localStorage.removeItem("cartItems");
        redirectToConfirmationPage(result);
      })
      .catch((e) => {
        console.log(e);
      });
  }
}

function redirectToConfirmationPage(result) {
  const orderUrl = `./confirmation.html?id=${result.orderId}`;

  location.assign(orderUrl);
}

function validateContactForm() {
  let hasAllValidFields = true;

  const { firstName, isFirstNameValid } = validateFirstName(
    firstNameInputElement
  );
  const { lastName, isLastNameValid } = validateLastName(lastNameInputElement);
  const { address, isAddressValid } = validateAddress(addressInputElement);
  const { city, isCityValid } = validateCity(cityInputElement);
  const { email, isEmailValid } = validateEmail(emailInputElement);

  if (
    !isFirstNameValid ||
    !isLastNameValid ||
    !isAddressValid ||
    !isCityValid ||
    !isEmailValid
  ) {
    hasAllValidFields = false;
  }

  return {
    firstName,
    lastName,
    address,
    city,
    email,
    hasAllValidFields,
  };
}
function validateEmail(inputElement) {
  let isEmailValid = true;
  const email = inputElement.value;
  emailErrorMsg.innerText = "";
  if (email == "") {
    emailErrorMsg.innerText = "Required field";
    isEmailValid = false;
  } else if (!email.match(validEmail)) {
    emailErrorMsg.innerText = "Invalid Email";
    isEmailValid = false;
  }
  return { email, isEmailValid };
}

function validateCity(inputElement) {
  let isCityValid = true;
  const city = inputElement.value;
  cityErrorMsg.innerText = "";
  if (city == "") {
    cityErrorMsg.innerText = "Required field";
    isCityValid = false;
  } else if (!city.match(validName)) {
    cityErrorMsg.innerText = "Invalid Name";
    isCityValid = false;
  }
  return { city, isCityValid };
}

function validateAddress(inputElement) {
  let isAddressValid = true;
  const address = inputElement.value;
  addressErrorMsg.innerText = "";
  if (address == "") {
    addressErrorMsg.innerText = "Required field";
    isAddressValid = false;
  }
  return { address, isAddressValid };
}

function validateLastName(inputElement) {
  let isLastNameValid = true;
  const lastName = inputElement.value;
  lastNameErrorMsg.innerText = "";
  if (lastName == "") {
    lastNameErrorMsg.innerText = "Required field";
    isLastNameValid = false;
  } else if (!lastName.match(validName)) {
    lastNameErrorMsg.innerText = "Invalid Name";
    isLastNameValid = false;
  }
  return { lastName, isLastNameValid };
}

function validateFirstName(inputElement) {
  let isFirstNameValid = true;
  const firstName = inputElement.value;
  firstNameErrorMsg.innerText = "";
  if (firstName == "") {
    firstNameErrorMsg.innerText = "Required field";
    isFirstNameValid = false;
  } else if (!firstName.match(validName)) {
    firstNameErrorMsg.innerText = "Invalid Name";
    isFirstNameValid = false;
  }

  return { firstName, isFirstNameValid };
}
