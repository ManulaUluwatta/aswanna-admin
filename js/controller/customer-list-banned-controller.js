function _createCustomerTableRow(customerData) {
    return `<tr>
                    <td>${customerData.uid}</td>
                    <td class="fw-bold">${customerData.firstName} ${customerData.lastName} </td>
                    <td>${customerData.address}</td>
                    <td>
                        <a href="tel:0771234567" class="fw-bold mb-0">${customerData.contact}</a>
                    </td>
                    <td>
                        <span class="badge bg-danger">Banned</span>
                    </td>
                </tr>`;
}

$(document).ready(function (){
    let usersCollection = db.collection('users');
    let query = usersCollection.where('role', '==', 'Buyer');

    query.get().then(querySnapshot => {

        const customerTableBody = $('#datatablesSimple tbody');
        customerTableBody.empty();

        querySnapshot.forEach(user => {
            // console.log(`user : `, user.data());
            customerTableBody.append(_createCustomerTableRow(user.data()))
        });
    });
});