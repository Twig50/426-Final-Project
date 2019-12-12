

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

    await fillSavedPosts();
}

const fillSavedPosts = async function() {
    let jwt = window.localStorage.getItem("jwt");

    const publicRoot = new axios.create({ baseURL: "http://localhost:3000/public"});
    const userRoot = new axios.create({ baseURL: "http://localhost:3000/user", headers: {"Authorization": "Bearer " + jwt}});

    let result = await publicRoot.get('/blog');
    let posts = result.data.result.posts;

    let result2 = await userRoot.get("/savedPosts");
    ids = result2.data.result.ids;

    if (ids == null || ids.length <= 0) {
        $("#saved-posts").html("No saved posts.");
    }
    else {
        for (let i = 0; i < ids.length; i++) {
            let row = "<tr><td><a href='blog.html?post="+ids[i]+"'>" + posts[ids[i]].title + "</a></td></tr>";

            $("#saved-posts").append(row);
        }

        let button = "<div class='field'><div class='control'><button id='unsave-all' type='submit' class='btn btn-primary'>Unsave All Posts</button></div></div>"
        $("#saved-posts-div").append(button);
        $("#unsave-all").on("click", unsaveAllPosts);
    }

}

const unsaveAllPosts = async function(event) {
    event.preventDefault();
    event.stopImmediatePropagation();

    let jwt = window.localStorage.getItem("jwt");
    const userRoot = new axios.create({ baseURL: "http://localhost:3000/user", headers: {"Authorization": "Bearer " + jwt}});

    await userRoot.delete("/savedPosts/ids/");

    window.location.reload();
}

$(function() { fillSignature();});