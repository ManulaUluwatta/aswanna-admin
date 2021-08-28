// ui elements
const orderTableBody = $('#datatablesSimple tbody');

let orderRow = [];
let ordersList = {};
let productList = {};
let userDataList = {};


function createTableRow(order) {
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
        <span class="badge bg-primary">${order.status}</span>
      </td>
      <td>
        <a href="order-view.html?id=${order.order_id}" class="btn btn-sm btn-dark">
          View
        </a>
      </td>
    </tr>`;
}

$(document).ready(function () {
    orderTableBody.empty();

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
                        // console.log(key);
                        orderTableBody.append(createTableRow(value));
                    });
                });
            });
        });
    });
});
