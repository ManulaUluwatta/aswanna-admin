// ui elements
const sellerIdEle = $('#seller-id');
const fullNameEle = $('#seller-full-name');
const addressEle = $('#seller-address');
const sellerStatusEle = $('#seller-status');

const sellerProductsListEle = $('#seller-product-list');

function getProductTagElement(tags) {
    let tagsList = ``;
    tags.forEach(tag => {
        let newTag = `<label class="text-success rounded-pill px-3 py-2 m-1" 
                        style="font-size: 12px;background: rgba(8,142,0,0.12)">${tag}</label>`;
        tagsList += newTag;
    });
    return tagsList;
}

function _createProductCard(product) {
    return `<div class="col-md-6 col-lg-4 col-sm-12 mb-2">
        <div class="card">
            <img alt="..." class="card-img-top" src="${product.image}"
                 style="height: 200px;object-fit: cover;object-position: center;">
            <p class="px-3 py-2 bg-warning text-dark"
               style="position: absolute;border-radius:100px;font-size:12px;margin: auto;top: 10px;right: 10px;left: auto;bottom: auto;width: fit-content;height: fit-content;">
                Exp: <span class="fw-bold" id="exp-date">${product.expire_date}</span>
            </p>
    
            <div class="card-body">
                <h5 class="card-title">${product.title}</h5>
                <p class="card-text"
                    style="display: block;display: -webkit-box;height: 2.6em;-webkit-line-clamp: 2;-webkit-box-orient: vertical;overflow: hidden;text-overflow: ellipsis;">${product.description}</p>
                <p class="card-text">
                    <label class="w-100">Price (Net.) :
                        <span style="font-size: 24px;">${product.original_price}</span>
                    </label>
                    <label class="w-100">Available QTY :
                        <span style="font-size: 24px;">${product.min_quantitiy}</span>
                    </label>
                    <label class="w-100">Type : <span>${product.product_type} - ${product.sub_category}</span></label>
                    <label class="w-100">Rating ⭐ : ${product.rating}</label>
                </p>
    
                <p class="mb-0">Tags</p>
                <div class="d-flex flex-wrap mb-1">
                    ${getProductTagElement(product.search_tag)}
                </div>
                <div class="d-flex flex-wrap">
                    <a class="btn btn-sm btn-primary m-1" href="#">Customize</a>
                    <a class="btn btn-sm text-danger m-1" href="#">Remove</a>
                </div>
            </div>
        </div>
    </div>`;
}

$(document).ready(function () {
    let searchParams = new URLSearchParams(window.location.search);
    if (!searchParams.has('id')) {
        window.history.back();
    }

    let user = db.collection('users');
    console.log(user);
    let userQuery = user.where('uid', '==', getUrlId('id'));
    console.log(userQuery);

    userQuery.get().then(querySnapshot => {
        querySnapshot.forEach(user => {
            console.log();
            let userObj = user.data();
            sellerIdEle.html(userObj.uid);
            fullNameEle.html(`${userObj.firstName} ${userObj.lastName}`);
            addressEle.html(userObj.address);
            sellerStatusEle.html('active');
        });
    });


    let products = db.collection('products');
    let productQuery = products.where('owner', '==', getUrlId('id'));
    console.log(productQuery);

    sellerProductsListEle.empty();
    productQuery.get().then(querySnapshot => {
        querySnapshot.forEach(product => {
            let productObj = product.data();
            console.log(productObj);

            sellerProductsListEle.append(_createProductCard(productObj))

        });
    });

});