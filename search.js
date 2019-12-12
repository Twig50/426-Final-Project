async function searchFunction() {

    setTimeout(() => {
        let input, filter, allPosts, postArray, i;

        input = document.getElementById('my-input');
        filter = input.value.toUpperCase();
        allPosts = document.getElementById('posts');
        allTitles = document.getElementsByClassName('post-header');
        postArray = allPosts.getElementsByClassName('post');
    
    
    
        for (i = 0; i < postArray.length; i++){
            header = postArray[i].getElementsByClassName('post-header')[0];
            if (header.innerHTML.toUpperCase().indexOf(filter) > -1){
                postArray[i].style.display = "";
    
            }
            else {
                postArray[i].style.display = 'none';
            }
        }
    }, 1000);

}