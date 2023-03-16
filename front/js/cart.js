const productCache = [];
// This gets hold of the local storage cart items or creates a new array if blank
let cartPageItems = JSON.parse(localStorage.getItem("cartItems")) || [];
console.log(cartPageItems);

const cartItemDetails = document.getElementById("cart__items");

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

const orderSubmit = document.getElementById("order");
// event listener for the order button
orderSubmit.addEventListener("click", ($event) => {
  $event.preventDefault();
  // gets the values of the form input data
  const firstNameInput = document.getElementById("firstName").value;
  const firstNameErrorMsg = document.getElementById("firstNameErrorMsg");
  const lastNameInput = document.getElementById("lastName").value;
  const lastNameErrorMsg = document.getElementById("lastNameErrorMsg");
  const addressInput = document.getElementById("address").value;
  const addressErrorMsg = document.getElementById("addressErrorMsg");
  const cityInput = document.getElementById("city").value;
  const cityErrorMsg = document.getElementById("cityErrorMsg");
  const emailInput = document.getElementById("email").value;
  const emailErrorMsg = document.getElementById("emailErrorMsg");
  // regex to validate name and email inputs
  const validName = new RegExp(/^([^0-9]*)$/g);
  const validEmail = new RegExp(
    /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/g
  );
  // DOM responses for invalid inputs
  if (firstNameInput == "") {
    firstNameErrorMsg.innerText = "Required field";
  } else if (!firstNameInput.match(validName)) {
    firstNameErrorMsg.innerText = "Invalid Name";
  }
  if (lastNameInput == "") {
    lastNameErrorMsg.innerText = "Required field";
  } else if (!lastNameInput.match(validName)) {
    lastNameErrorMsg.innerText = "Invalid Name";
  }
  if (addressInput == "") {
    addressErrorMsg.innerText = "Required field";
  }
  if (cityInput == "") {
    cityErrorMsg.innerText = "Required field";
  } else if (!cityInput.match(validName)) {
    cityErrorMsg.innerText = "Invalid Name";
  }
  if (emailInput == "") {
    emailErrorMsg.innerText = "Required field";
  } else if (!emailInput.match(validEmail)) {
    emailErrorMsg.innerText = "Invalid Email";
  }

  // const options = {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify(orderDetails),
  // };
  // fetch("http://localhost:3000/api/products", options)
  //   .then((data) => {
  //     if (!data.ok) {
  //       throw Error(data.status);
  //     }
  //     return data.json();
  //   })
  //   .then((orderDetails) => {
  //     console.log(orderDetails);
  //   })
  //   .catch((e) => {
  //     console.log(e);
  //   });
  const orderDetails = {
    firstName: firstNameInput,
    lastName: lastNameInput,
    address: addressInput,
    city: cityInput,
    email: emailInput,
    products: cartPageItems,
  };
  submitFormData(orderDetails);
});

function makeRequest(data) {
  return new promise((resolve, reject) => {
    let request = new XMLHttpRequest();
    request.open("POST", "http://localhost:3000/api/products/order");
    request.onreadystatechange = () => {
      if (request.readyState === 4) {
        if (request.status === 201) {
          resolve(JSON.parse(request.response));
        } else {
          reject(JSON.parse(request.response));
        }
      }
    };

    request.setRequestHeader("content-type", "application/json");
    request.send(JSON.stringify(data));
  });
}
async function submitFormData(orderDetails) {
  try {
    const requestPromise = makeRequest(orderDetails);
    const response = await requestPromise;

    responseFirstName.textContent = response.firstName;
    responseLastName.textContent = response.lastName;
    responseAddress.textContent = response.address;
    responseCity.textContent = response.city;
    responseEmail.textContent = response.email;
    responseItemId.textContent = response.products.id;
    responseItemColor.textContent = response.products.color;
    responseItemQuantity.textContent = response.products.quantity;
  } catch (errorResponse) {
    // responseMessage.textContent = errorResponse.error;
  }
}
