fetch("http://localhost:3000/api/products")
  .then((data) => {
    return data.json();
  })
  .then((products) => {
    insertProductCards(products);
  });

const productCardHolder = document.getElementById("items");

// This function collects data from the array of product in the api and inserts the into new cards on the homepage using dynamic HTML

function insertProductCards(products) {
  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    const newProductCard = document.createElement("a");
    newProductCard.setAttribute("id", product._id);

    const productUrl = `./product.html?id=${product._id}`;
    newProductCard.setAttribute("href", productUrl);

    newProductCard.innerHTML = `
<article>
<img src="${product.imageUrl}" alt="${product.altTxt}">
<h3 class="productName">${product.name}</h3>
<p class="productDescription">${product.description}</p>
</article>
`;
    productCardHolder.appendChild(newProductCard);
  }
}
