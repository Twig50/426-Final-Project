const accountRoot = new axios.create({ baseURL: "http://localhost:3000/account"});

export const handleSubmitRegister = async function(event) {
    event.preventDefault();
    event.stopImmediatePropagation();

    $("#message").html('');

    let password = document.getElementById('password').value;
    let confirmPassword = document.getElementById('confirm-password').value;
    let login = document.getElementById('login').value;

    if (password != confirmPassword) { 
        $("#message").html('<span class="has-text-danger">Passwords do not match.</span>');
        return;
    }
    
    await accountRoot.post('/create', {
        name: login,
        pass: password,
        data: {
            signature: "",
        }
    }).then(function() {
        // See the UserRecord reference doc for the contents of userRecord.
        $("#message").html('<span>Successfully registered!</span>');
    })
    .catch(function(error) {
        console.log('Error fetching user data:', error);
        $("#message").html('<span class="has-text-danger">Failed to register.</span>');
    });
}

export const readySubmitHandlers = function() {
    $('#submitRegister').on('click', handleSubmitRegister);
}

$(function() {
    readySubmitHandlers();
});