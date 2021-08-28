// ui elements
const ordersCountPreview = $('#ordersCountPreview');
const buyersCountPreview = $('#buyersCountPreview');
const sellersCountPreview = $('#sellersCountPreview');
const earningsCountPreview = $('#earningsCountPreview');

const orderTableBody = $('#datatablesSimple tbody');

let orderRow = [];
let ordersList = {};
let productList = {};
let userDataList = {};


function createTableRow(order) {
    console.log(order);
    let uid = order.user_id;
    let userObj = userDataList["" + uid];
    let userName = `Mr. ${userObj.firstName} ${userObj.lastName}`

    // count total
    let total = 0;
    $.each(order.item_list, (key, value) => {
        let qty = parseFloat(value.order_qty);
        let productId = value.product_id;
        let productPrice = parseFloat(productList["" + productId].original_price);
        total += (qty * productPrice);
    });

    return `<tr>
      <td>${order.order_id}</td>
      <td class="fw-bold">${userName}</td>
      <td>
        ${order.order_date}
      </td>
      <td>
        <h4 class="fw-bold mb-0">$ ${total}</h4>
      </td>
      <td>
        <span class="badge bg-secondary">${order.status}</span>
      </td>
      <td>
        <a href="order-view.html?id=${order.order_id}" class="btn btn-sm btn-dark">
          View
        </a>
      </td>
    </tr>`;
}

function loadOrderTableData() {
    let OrderRef = db.collection('Order');
    let ODRef = db.collection('order_details');
    let ProductsRef = db.collection('products');
    let UsersRef = db.collection('users');

    OrderRef.get().then(snapshot => {
        snapshot.forEach(order => {
            let orderId = order.data().order_id;
            ordersList["" + orderId] = order.data();
            ordersList["" + orderId].item_list = {};
        })
    }).then(() => {
        ODRef.get().then(ODSnapShot => {
            ODSnapShot.forEach(ODSnapShot => {
                let ODOrderID = ODSnapShot.data().order_id;
                ordersList["" + ODOrderID].item_list[ODSnapShot.data().product_id] = (ODSnapShot.data());
            });
        }).then(() => {
            ProductsRef.get().then(productSnapShot => {
                productSnapShot.forEach(productDetail => {
                    productList["" + productDetail.id] = productDetail.data();
                });
            }).then(() => {
                UsersRef.get().then(userSnapShot => {
                    userSnapShot.forEach(user => {
                        userDataList["" + user.data().uid] = user.data();
                    });
                }).then(() => {
                    $.each(ordersList, (key, value) => {
                        if (value.status === "pending") {
                            orderTableBody.append(createTableRow(value));
                        }
                    });
                });
            });
        });
    });
}

function updateTotalEarningsCount() {
    let orderList = {};
    let productsList = {};
    let totalEarnings = 0;
    db.collection("Order")
        .where("status", "==", "complete")
        .get().then(snapshot => {
        totalEarnings = 0;
        snapshot.forEach(order => {
            orderList[order.id] = order.data();
            orderList[order.id].order_details = [];
        });
    }).then(() => {
        db.collection("order_details")
            .get().then(snapshot => {
            snapshot.forEach(item => {
                if (orderList.hasOwnProperty(item.data().order_id)) {
                    orderList[item.data().order_id].order_details.push(item.data());
                }
            });
        }).then(() => {
            db.collection("products").get().then(snapshot => {
                snapshot.forEach(item => {
                    productsList[item.id] = item.data();
                });
            }).then(() => {
                $.each(orderList, (key, element) => {
                    $.each(element.order_details, (key, element) => {
                        let productPrice = parseFloat(productsList[element.product_id].original_price);
                        let qty = parseFloat(element.order_qty);
                        console.log(qty, productPrice);
                        totalEarnings += (qty * productPrice);
                    });
                });

                // console.log(orderList);
                // console.log(productsList);
                console.log(totalEarnings);
                earningsCountPreview.html(`$ ${numFormatter(totalEarnings.toFixed(2))}`);
            });
        });
    });
}

function updateTopCardsData() {

    db.collection("Order").get().then(snapshot => {
        let itemCount = 0;
        snapshot.forEach(order => {
            itemCount++;
        });
        return itemCount;
    }).then(count => {
        ordersCountPreview.html(count);
    });

    db.collection("users")
        .where("role", "==", "Buyer")
        .get().then(snapshot => {
        let itemCount = 0;
        snapshot.forEach(order => {
            itemCount++;
        });
        return itemCount;
    }).then(count => {
        buyersCountPreview.html(count);
    });

    db.collection("users")
        .where("role", "==", "Seller")
        .get().then(snapshot => {
        let itemCount = 0;
        snapshot.forEach(order => {
            itemCount++;
        });
        return itemCount;
    }).then(count => {
        sellersCountPreview.html(count);
    });

    updateTotalEarningsCount();
}

$(document).ready(function () {
    orderTableBody.empty();

    updateTopCardsData();

    loadOrderTableData();
});
