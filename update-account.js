const handleChangePassword = async function(event) {
    event.preventDefault();
    event.stopImmediatePropagation();

    $("#password-message").html('');

    let password = document.getElementById('password').value;
    let confirmPassword = document.getElementById('confirm-password').value;

    if (password == "") {
        $("#password-message").html('<span class="has-text-danger">Password cannot be empty.</span>');
        return;
    }

    if (password != confirmPassword) { 
        $("#password-message").html('<span class="has-text-danger">Passwords do not match.</span>');
        return;
    }
    let jwt = window.localStorage.getItem("jwt");
    let response = await axios({
        method: 'POST',
        url: "http://localhost:3000/account/update",
        headers: { "Authorization": "Bearer " + jwt },
        data: {
            pass: password
        }
    }).catch(function(error) {
        console.log('Error fetching user data:', error);
        return;
    });

    $("#password-message").html('<span>Successfully changed password!</span>');
}

const handleChangeSignature = async function(event) {
    event.preventDefault();
    event.stopImmediatePropagation();

    let signature = document.getElementById('signature').value;

    let jwt = window.localStorage.getItem("jwt");
    let response = await axios({
        method: 'POST',
        url: "http://localhost:3000/account/update",
        headers: { "Authorization": "Bearer " + jwt },
        data: {
            data: { signature: signature }
        }
    }).catch(function(error) {
        console.log('Error fetching user data:', error);
        return;
    });

    $("#signature-message").html('<span>Successfully changed signature!</span>');
}

const readySubmitHandlers = function() {
    $('#change-password').on('click', handleChangePassword);
    $('#change-signature').on('click', handleChangeSignature);
}

$(function() {
    readySubmitHandlers();
});