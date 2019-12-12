const accountRoot = new axios.create({ baseURL: "http://localhost:3000/account"});

export const handleSubmitLogin = async function(event) {
    event.preventDefault();
    event.stopImmediatePropagation();

    $("#message").html('');

    let password = document.getElementById('password').value;
    let login = document.getElementById('login').value;

    
    let response = await accountRoot.post('/login', {
        name: login,
        pass: password,
    }).catch(function(error) {
        console.log('Error fetching user data:', error);
        $("#message").html('<span class="has-text-danger">Failed to log in. Check the spelling of your email and password.</span>');
        return;
    });

    window.localStorage.setItem("jwt", response.data.jwt);
    window.location.replace("index.html");
}

export const readySubmitHandlers = function() {
    $('#submitLogin').on('click', handleSubmitLogin);
}

$(function() {
    readySubmitHandlers();
});