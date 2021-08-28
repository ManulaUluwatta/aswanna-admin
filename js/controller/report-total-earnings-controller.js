// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#292b2c';

// Bar Chart Example
var ctx = document.getElementById("barChartEarnings");

function createNewChart(totalEarnings) {
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December",],
            datasets: [{
                label: "Revenue",
                backgroundColor: "rgba(2,117,216,1)",
                borderColor: "rgba(2,117,216,1)",
                data: [0, 0, 0, 0, 0, 0, 0, totalEarnings.toFixed(2), 0, 0, 0, 0,],
            }],
        },
        options: {
            scales: {
                xAxes: [{
                    time: {
                        unit: 'month'
                    },
                    gridLines: {
                        display: false
                    },
                    ticks: {
                        maxTicksLimit: 12
                    }
                }],
                yAxes: [{
                    ticks: {
                        min: 0,
                        // max: 15000,
                        maxTicksLimit: 5
                    },
                    gridLines: {
                        display: true
                    }
                }],
            },
            legend: {
                display: false
            }
        }
    });
}

$(document).ready(() => {

    let totalEarnings = 0;

    let orderList = {};
    let productsList = {};
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

                createNewChart(totalEarnings);
            });
        });
    });
});
