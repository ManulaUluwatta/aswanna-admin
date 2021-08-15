function _createSellerTableRow(sellerData) {
    return `<tr>
                    <td>${sellerData.uid}</td>
                    <td class="fw-bold">${sellerData.firstName} ${sellerData.lastName} </td>
                    <td>${sellerData.address}</td>
                    <td>
                        <a href="tel:0771234567" class="fw-bold mb-0">${sellerData.contact}</a>
                    </td>
                    <td>
                        <span class="badge bg-danger">Banned</span>
                    </td>
                </tr>`;
}

$(document).ready(function (){
    let usersCollection = db.collection('users');
    let query = usersCollection.where('role', '==', 'Seller');

    query.get().then(querySnapshot => {

        const sellerTableBody = $('#datatablesSimple tbody');
        sellerTableBody.empty();

        querySnapshot.forEach(user => {
            // console.log(`user : `, user.data());
            sellerTableBody.append(_createSellerTableRow(user.data()))
        });
    });
});