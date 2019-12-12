

const loadPosts = async function() {
    //get posts
    let posts = [
        {
            title: "test",
            body: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
            commentCount: 24,
        }
    ];
    
    $("#posts").empty();
    renderPosts(posts);
}

const renderPosts = function (posts) {
    for (let i = 0; i < posts.length; i++) {
        $("#posts").append(renderPost(posts[i]));
    }
}

const renderPost = function (post) {
    let postDiv = document.createElement("div");
    postDiv.setAttribute("class", "post");

    let postHeader = document.createElement("div");
    postHeader.setAttribute("class", "post-header");
    postHeader.innerText = post.title;

    let postCenter = document.createElement("div");
    postCenter.setAttribute("class", "post-center");
    postCenter.innerText = post.body;

    let postFooter = document.createElement("div");
    postFooter.setAttribute("class", "post-footer");
    postFooter.innerText = post.commentCount + " comments";

    postDiv.appendChild(postHeader);
    postDiv.appendChild(postCenter);
    postDiv.appendChild(postFooter);

    return postDiv;
}

$(function() { loadPosts(); });