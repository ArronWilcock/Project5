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




function populateProductPage(pageProduct) {
    let i = 0;
    const product = pageProduct[i];

    `const productImageHolder = document.getElementsByClassName("item__img");
    const productImage = document.createElement("img");
    productImage.setAttribute("src", ${product.imageUrl});
    productImage.setAttribute("alt", ${product.altTxt});

    productImageHolder.appendChild(productImage);

    const productTitle = document.getElementById("title");
    productTitle.textContent = ${product.name};

    const productPrice = document.getElementById("price");
    productPrice.textContent = ${product.price};

    const productDescription = document.getElementById("description");
    productDescription.textContent = ${product.description};`

};


