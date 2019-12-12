
const replaceLoginTab = async function() {
    if (window.localStorage.getItem("jwt") != null) {
        let jwt = window.localStorage.getItem("jwt");
        
        let response = await axios({
            method: 'GET',
            url: "http://localhost:3000/account/status",
            headers: { "Authorization": "Bearer " + jwt }
        }).catch(function(error) {
            console.log('Error fetching user data:', error);
            return;
        });
        
        let username = response.data.user.name;

        $("#account-tab").html("<a href='account.html'>" +username+ "</a>");
    }
}

$(function() {
    replaceLoginTab();
});