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
    postFooter.innerHTML = "<a href='?post="+post.id+"'>"+post.commentCount + " comments</a>";

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

$(function() { loadPosts(); });