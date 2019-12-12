import * as admin from 'firebase-admin';


export const handleSubmitLogin = function(event) {
    event.preventDefault();
    event.stopImmediatePropagation();

    $message.html('');

    let password = document.getElementById('#password').value;
    let email = document.getElementById('#email').value;

    admin.auth().getUserByEmail(email)
    .then(function(userRecord) {
        // See the UserRecord reference doc for the contents of userRecord.
        console.log('Successfully fetched user data:', userRecord.toJSON());
    })
    .catch(function(error) {
        // console.log('Error fetching user data:', error);
        $message.html('<span class="has-text-danger">Failed to log in. Check the spelling of your email and password.</span>')
    });

}

export const readySubmitHandlers = function() {
    const $submitLogin = $('#submitLogin');
    $submitLogin.on('click', handleSubmitLogin);
}

$(function() {
    readySubmitHandlers();
});