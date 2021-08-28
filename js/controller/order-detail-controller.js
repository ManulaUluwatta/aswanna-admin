"use strict";

// ui elements
const orderIDPreview = $('#orderIdPreview');
const deliveryOptionPreview = $('#deliveryOptionPreview');
const orderDatePreview = $('#orderDatePreview');
const statusPreview = $('#statusPreview');
const customerNamePreview = $('#customerNamePreview');
const customerAddressPreview = $('#customerAddressPreview');
const orderDetailTableBody = $('#datatablesSimple tbody');
const orderTotalPreview = $('#orderTotalPreview');

let productsList = {};
let orderTotal = 0;

function updateOrderPreview(orderData) {
    console.log(orderData);
    orderIDPreview.html(orderData.order_id);
    deliveryOptionPreview.html(orderData.delivery_option);
    orderDatePreview.html(orderData.order_date);
    customerNamePreview.html(`${orderData.user_details.firstName} ${orderData.user_details.lastName}`);
    customerAddressPreview.html(orderData.user_details.address);
    statusPreview.html(orderData.status);
}

function createTableRow(orderDetail) {

    let productName = productsList[orderDetail.product_id].title;
    let productPrice = productsList[orderDetail.product_id].original_price;
    let qty = orderDetail.order_qty;
    let total = parseFloat(qty) * parseFloat(productPrice);

    orderTotal += total;

    return `
    <tr>
        <td>${orderDetail.product_id}</td>
        <td class="fw-bold">${productName}</td>
        <td>
            ${qty}
        </td>
        <td>
            $ ${productPrice}
        </td>
        <td class="d-flex flex-row justify-content-between">
            <span>${qty} x $ ${productPrice}</span>
            <h4 class="text-secondary mb-0">$ ${total}</h4>
        </td>
    </tr>
    `;
}

function loadOrderDetail() {
    let searchParams = new URLSearchParams(window.location.search)
    if (searchParams.has("id")) {
        const orderId = searchParams.get("id");

        db.collection("products").get().then(productSS => {
            productSS.forEach(product => {
                productsList[product.id] = product.data();
            });
        }).then(() => {
            let query = db.collection("Order")
                .where("order_id", "==", "" + orderId);

            query.get().then(snapshot => {
                let orderData = undefined;
                snapshot.forEach(order => {
                    orderData = order.data();
                })
                return orderData;
            }).then((orderData) => {
                let userQuery = db.collection("users")
                    .where("uid", "==", orderData.user_id);

                userQuery.get().then(userSS => {
                    let userObj = undefined;
                    userSS.forEach(user => {
                        userObj = user.data();
                    });
                    orderData["user_details"] = userObj;
                    return orderData;
                }).then(orderData => {
                    updateOrderPreview(orderData);
                    return orderData;
                }).then((orderData) => {
                    let orderQuery = db.collection("order_details")
                        .where("order_id", "==", orderData.order_id)

                    orderQuery.get().then(orderSS => {
                        let orderDetailOBJ = [];
                        orderSS.forEach(orderDetail => {
                            orderDetailOBJ.push(orderDetail.data());
                        });
                        return orderDetailOBJ;
                    }).then(orderDetail => {
                        console.log(orderDetail);
                        orderDetailTableBody.empty();
                        orderTotal = 0;

                        $.each(orderDetail, (key, element) => {
                            console.log(element);
                            orderDetailTableBody.append(createTableRow(element));
                        });

                        orderTotalPreview.html(orderTotal.toFixed(2));
                    })
                });
            });
        });
    }
}

$(document).ready(() => {
    loadOrderDetail();
});
