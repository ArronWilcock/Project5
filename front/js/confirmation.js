const queryString = window.location.search;

const urlParams = new URLSearchParams(queryString);

const orderId = urlParams.get("id");

const orderIdHolder = document.getElementById("orderId");
orderIdHolder.innerText = orderId;