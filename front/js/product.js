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
