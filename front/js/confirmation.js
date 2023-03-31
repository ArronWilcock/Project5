// Sequence to get hold of the order ID from the URL and print on the page
const queryString = window.location.search;

const urlParams = new URLSearchParams(queryString);

const orderId = urlParams.get("id");

const orderIdHolder = document.getElementById("orderId");
orderIdHolder.innerText = orderId;
