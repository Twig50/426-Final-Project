const fillSignature = async function() {
    let jwt = window.localStorage.getItem("jwt");

    let response = await axios({
        method: 'GET',
        url: "http://localhost:3000/account/status",
        headers: { "Authorization": "Bearer " + jwt }
    }).catch(function(error) {
        console.log('Error fetching user data:', error);
        return;
    });
    
    let signature = response.data.user.data.signature;

    $("#signature").val(signature);
}

$(function() { fillSignature(); });