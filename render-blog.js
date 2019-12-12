const publicRoot = new axios.create({ baseURL: "http://localhost:3000/public"});


const loadPosts = async function() {
    let urlParams = new URLSearchParams(window.location.search);

    $("#posts").empty();

    if (urlParams.has('post')) { 
        loadSinglePost(parseInt(urlParams.get('post')));
        return;
    }

    //get posts
    let result = await publicRoot.get('/blog');

    let posts = result.data.result.posts;

    renderPosts(posts);
}

const renderPosts = function (posts) {
    for (let i = 0; i < posts.length; i++) {
        posts[i].id = i;
        $("#posts").append(renderPost(posts[i]));
    }
}

const renderPost = function (post) {
    let postDiv = document.createElement("div");
    postDiv.setAttribute("class", "post");
    postDiv.setAttribute("id", post.id);

    let postHeader = document.createElement("div");
    postHeader.setAttribute("class", "post-header");
    postHeader.innerText = post.title;

    let postCenter = document.createElement("div");
    postCenter.setAttribute("class", "post-center");
    postCenter.innerText = post.body;

    let postFooter = document.createElement("div");
    postFooter.setAttribute("class", "post-footer");
    postFooter.innerHTML = "<a href='?post="+post.id+"'>view comments</a>";

    postDiv.appendChild(postHeader);
    postDiv.appendChild(postCenter);
    postDiv.appendChild(postFooter);

    return postDiv;
}

const loadSinglePost = async function(id) {
    let result1 = await publicRoot.get('/blog');
    let posts = result1.data.result.posts;
    $("#posts").append(renderPost(posts[id]));

    if (window.localStorage.getItem("jwt") == null) {
        let commentsDiv = document.createElement("div");
        commentsDiv.setAttribute("class", "comments");

        let hiddenComments = document.createElement("div");
        hiddenComments.setAttribute("class", "comment-title");
        hiddenComments.innerHTML= "<a href=login.html>Log in</a> to view comments.";

        commentsDiv.appendChild(hiddenComments);
        
        $(".post-footer").replaceWith(commentsDiv);
        return;
    }


    let jwt = window.localStorage.getItem("jwt");

    const privateRoot = new axios.create({ baseURL: "http://localhost:3000/private", headers: {"Authorization": "Bearer " + jwt}});

    let result2 = await privateRoot.get('/blogComments', {}
    ).catch(function(error) {
        console.log('Error fetching user data:', error);
        return;
    });

    let comments = result2.data.result.comments.filter(comment => comment.parentID == id);
    
    $(".post-footer").replaceWith(renderCommentsSection(comments));
    $("#post-comment").on("click", postComment);
}

const renderCommentsSection = function (comments) {
    let commentsDiv = document.createElement("div");
    commentsDiv.setAttribute("class", "comments");

    if (window.localStorage.getItem("jwt") == null) {
        let hiddenComments = document.createElement("div");
        hiddenComments.setAttribute("class", "comment-title");
        hiddenComments.innerHTML= "<a href=login.html>Log in</a> to view comments.";

        commentsDiv.appendChild(hiddenComments);
        return commentsDiv;
    }

    commentsDiv.appendChild(renderCommentBox());

    let commentTitle = document.createElement("div");
    commentTitle.setAttribute("class", "comment-title");
    commentTitle.innerText = comments.length + " comments";

    commentsDiv.appendChild(commentTitle);

    for (let i = 0; i < comments.length; i++) {
        commentsDiv.appendChild(renderComment(comments[i]));
    }

    return commentsDiv;
}

const renderComment = function (comment) {
    let commentDiv = document.createElement("div");
    commentDiv.setAttribute("class", "comment");

    let commentHeader = document.createElement("div");
    commentHeader.setAttribute("class", "comment-header");
    commentHeader.innerText = comment.author;

    let commentCenter = document.createElement("div");
    commentCenter.setAttribute("class", "comment-center");
    commentCenter.innerText = comment.body;

    let commentFooter = document.createElement("div");
    commentFooter.setAttribute("class", "comment-footer");
    commentFooter.innerText = comment.signature;

    commentDiv.appendChild(commentHeader);
    commentDiv.appendChild(commentCenter);
    commentDiv.appendChild(document.createElement("hr"));
    commentDiv.appendChild(commentFooter);

    return commentDiv;
}

const renderCommentBox = function() {
    let commentBoxDiv = document.createElement("div");
    commentBoxDiv.setAttribute("class", "content");

    let commentForm = document.createElement("form");
    commentForm.setAttribute("id", "comment-form");

    let textbox = document.createElement("input");
    textbox.setAttribute("id", "comment-box");
    textbox.setAttribute("class", "textarea");
    textbox.setAttribute("type", "textarea");
    textbox.setAttribute("name", "comment-box");
    textbox.setAttribute("placeholder", "Write a comment!");

    let field = document.createElement("div");
    field.setAttribute("class", "field");

    let control = document.createElement("div");
    control.setAttribute("class", "control");

    let button = document.createElement("button");
    button.setAttribute("id", "post-comment");
    button.setAttribute("type", "submit");
    button.innerText = "Post Comment";

    let message = document.createElement("p");
    message.setAttribute("id", "message");

    
    control.appendChild(button);
    field.appendChild(control);
    commentForm.appendChild(textbox);
    commentForm.appendChild(field);
    commentForm.appendChild(message);
    commentBoxDiv.appendChild(commentForm);

    return commentBoxDiv;
}




const postComment = async function(event) {
    event.preventDefault();
    event.stopImmediatePropagation();

    $("#message").html('');

    let body = document.getElementById("comment-box").value;

    if (body == "") {
        $("#message").html('<span class="has-text-danger">Comment cannot be empty.</span>');
        return;
    }

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
    let signature = response.data.user.data.signature;
    let urlParams = new URLSearchParams(window.location.search);
    let id = parseInt(urlParams.get("post"));

    const privateRoot = new axios.create({ baseURL: "http://localhost:3000/private", headers: {"Authorization": "Bearer " + jwt}});

    await privateRoot.post('/blogComments/comments', {
        data: {
            parentID: id,
            author: username,
            body: body,
            signature: signature
        },
        type: "merge"
    });

    window.location.reload();
}


$(function() { loadPosts(); });