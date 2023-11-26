
const BaseURL = "https://tarmeezacademy.com/api/v1";
let currentPage = 1;
let lastPage = 1;


/* infinite scroll */
// window.addEventListener("scroll", function(){
    
//     // const endOfPage = window.innerHeight + window.scrollY >= document.body.scrollHeight;
//     const endOfPage = window.innerHeight + window.pageYOffset >= document.body.offsetHeight;

//     if(endOfPage && currentPage <= lastPage){
//         currentPage = currentPage + 1
//         getPosts(false, currentPage)    
//     }
// })

/* // infinite scroll // */


function loginUser(){
     const loginUsername = document.getElementById("login-username").value;
     const loginPassword = document.getElementById("login-password").value;  

     const url = `${BaseURL}/login`;
     const bodyParams = {
        "username" : loginUsername,
        "password" : loginPassword
     }

     axios.post(url, bodyParams)
     .then(response => {
        const token = response.data.token;
        const user = response.data.user;

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        let loginModal = document.getElementById("loginModal");
        let loginModalInstance = bootstrap.Modal.getInstance(loginModal);
        loginModalInstance.hide();

        showAlert("logged in successfully")
        setupUI();
        getPosts();

     }).catch((error) => {
        console.log(error.response.data.message)
        const errorMessage = error.response.data.message;
        showAlert(errorMessage, "danger")
     })

}

// todo : logout from server
function logoutUser(){

    localStorage.removeItem("user");
    localStorage.removeItem("token");

    let logoutModal = document.getElementById("logoutModal");
    let logoutModalInstance = bootstrap.Modal.getInstance(logoutModal);
    logoutModalInstance.hide();

    showAlert("logged out successfully")
    setupUI();
    getPosts();

    // const url = `${BaseURL}/logout`;
    // const token = localStorage.getItem("token");
    // const headers = {
    //     "authorization" : `Bearer ${token}`,
    //     // "_method" : "delete"
    // }

    // axios.post(url, {
    //     headers : headers
    // })
    // .then(response => {
    //     localStorage.removeItem("user");
    //     localStorage.removeItem("token");

    //     let logoutModal = document.getElementById("logoutModal");
    //     let logoutModalInstance = bootstrap.Modal.getInstance(logoutModal);
    //     logoutModalInstance.hide();

    // }).catch(error => {
    //     const errorMessage = error.response.data.message;
    //     alert(errorMessage);
    // })

}

function registerUser(){
    
    const url = `${BaseURL}/register`;
    const registerName = document.getElementById("register-name").value;
    const registerUsername = document.getElementById("register-username").value;
    const registerEmail = document.getElementById("register-email").value;
    const registerPassword = document.getElementById("register-password").value;
    const registerProfileImage = document.getElementById("register-profileImage").files[0];

    let formData = new FormData();
    formData.append("name", registerName);
    formData.append("username", registerUsername);
    formData.append("email", registerEmail);
    formData.append("password", registerPassword);
    formData.append("image", registerProfileImage);

    axios.post(url, formData)
    .then((response) => {
        const token = response.data.token;
        const user = response.data.user;

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        let registerModal = document.getElementById("registerModal");
        let registerModalInstance = bootstrap.Modal.getInstance(registerModal);
        registerModalInstance.hide();

        showAlert("User has been registred successfully")
        setupUI();

    }).catch(error => {
        const errorMessage = error.response.data.message;
        showAlert(errorMessage, "danger")
    })
}

function setupUI(){

    const token = localStorage.getItem("token");
    let user = JSON.parse(localStorage.getItem("user"));
    // console.log(user)

    if(token == null){
        document.getElementById("btnLogout").style.setProperty("display", "none", "important")
        document.getElementById("btnLogReg").style.setProperty("display", "flex", "important")
        // document.getElementById("createBtn").style.setProperty("display", "none", "important")
    }else{
        document.getElementById("btnLogout").style.setProperty("display", "flex", "important")
        document.getElementById("btnLogReg").style.setProperty("display", "none", "important")
        // document.getElementById("createBtn").style.setProperty("display", "block", "important")        
        document.getElementById("profileUsername").innerHTML = user.username;;
        document.getElementById("imgProfile1").src = user.profile_image;
    }

}

function getCurrentUser(){

    let user = null;
    let StorageUser = JSON.parse(localStorage.getItem("user"));
    if(StorageUser != null){
        user = StorageUser;
    }
    return user;

}


function showAlert(CustomMessage, type="success"){

    const alertPlaceholder = document.getElementById('liveAlert')
    const appendAlert = (message, type) => {
    const wrapper = document.createElement('div')
    wrapper.innerHTML = [
        `<div class="alert alert-${type} alert-dismissible" role="alert">`,
        `   <div>${message}</div>`,
        '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
        '</div>'
    ].join('')

    alertPlaceholder.append(wrapper)
    }

     appendAlert(CustomMessage, type)
}

function createPost(){

    const postTitle = document.getElementById("post-title").value;
    const postBody = document.getElementById("post-body").value;
    const postImage = document.getElementById("post-image").files[0];
    const postId = document.getElementById("hiddenPostModalId").value;
    let isCreate = postId == null || postId == ""
    let token = localStorage.getItem("token");

    

    let formData = new FormData();
    formData.append("title", postTitle);
    formData.append("body", postBody);
    formData.append("image", postImage);

    let headers = {
        "authorization" : `Bearer ${token}`
    }
    let url = ``

    if(isCreate){
         url = `${BaseURL}/posts`;
         showAlert("New post has been created successfully")      
    }else{
        formData.append("_method", "put")
         url = `${BaseURL}/posts/${postId}`
         showAlert("New post has been updated successfully")
    }
    axios.post(url, formData, {headers : headers})
    .then(response => {
        console.log(response.data.data)       
        const postModal = document.getElementById("postModal");
        const postmodalInstance = bootstrap.Modal.getInstance(postModal);
        postmodalInstance.hide()

        getPosts();
        setupUI();

    }).catch(error => {
        let message = error.response.data.message;
        showAlert(message, "danger")
    })
    // .finally(()=> {
    //     document.getElementById("postModalLabel").innerHTML = "Create A New Post";
    //     document.getElementById("btnCreate").innerHTML = "Create";
    //     document.getElementById("post-title").value = '';
    //     document.getElementById("post-body").value = '';
    //     document.getElementById("hiddenPostModalId").value = '';
    //     document.getElementById("post-image").files[0] = '';

    // })
    
}

function updatePostDetails(postObject){
    let post = JSON.parse(decodeURIComponent(postObject));

        document.getElementById("postModalLabel").innerHTML = "Update of the post";
        document.getElementById("btnCreate").innerHTML = "Update";
        document.getElementById("post-title").value = post.title;
        document.getElementById("post-body").value = post.body;
        document.getElementById("hiddenPostModalId").value = post.id;
        // document.getElementById("post-image").files[0] = post.image;
        let postModal = new bootstrap.Modal(document.getElementById("postModal"), {})
        postModal.toggle();
}

function CreateBtnClicked(){

        document.getElementById("postModalLabel").innerHTML = "Create A New Post";
        document.getElementById("btnCreate").innerHTML = "Create";
        document.getElementById("post-title").value = '';
        document.getElementById("post-body").value = '';
        document.getElementById("hiddenPostModalId").value = '';
        document.getElementById("post-image").files[0] = '';
        let postModal = new bootstrap.Modal(document.getElementById("postModal"), {})
        postModal.toggle();

}


function deletePostObject(postObject){
    let post= JSON.parse(decodeURIComponent(postObject));
    document.getElementById("deleteInput").value = post.id;
}

function deletePost(){
    
    let postId = document.getElementById("deleteInput").value;
    let token = localStorage.getItem("token");
    let url = `${BaseURL}/posts/${postId}`;
    let headers = {
        "authorization" : `Bearer ${token}`
    }

    let formData = new FormData();
    formData.append("_method", "delete")

    axios.post(url,formData, {
        headers : headers
    })
    .then(response => {
        console.log(response.data.data)
        showAlert("Post has been deletes successfully")

        let deleteModal = document.getElementById("deleteModal");
        let deleteModalInstance = bootstrap.Modal.getInstance(deleteModal);
        deleteModalInstance.hide();

        getPosts();

    }).catch(error => {
        const errorMessage = error.response.data.message;
        showAlert(errorMessage, "danger")
    })

}

function getPostId(postId){
    window.location = `postDetails.html?postId=${postId}`
    
}
let urlParams = new URLSearchParams(window.location.search);
let id = urlParams.get("postId");
console.log(id)


function getPost(){

    const url = `${BaseURL}/posts/${id}`

    axios.get(url)
    .then(response => {
        const post = response.data.data;    
        console.log(post)    
        let user = getCurrentUser();        
        
        let postTitle ='';
        if(post.title != null){
            postTitle = post.title;
        }
        let buttons = ``;
        let isMyPost = user != null && post.author.id == user.id;
        if(isMyPost){
            buttons = 
            `
                <button id="btnUpdate" class="btn btn-secondary rounded-3"  onclick="updatePostDetails('${encodeURIComponent(JSON.stringify(post))}')">Update</button>
                <button id="btnDelete" class="btn btn-danger rounded-3" data-bs-toggle="modal" data-bs-target="#deleteModal" onclick="deletePostObject('${encodeURIComponent(JSON.stringify(post))}')" >Delete</button>
            `
        }

        let postContent = 
        `
            <div class="card rounded-2 shadow mt-3 mb-5">
                <div class="card-header d-flex justify-content-between">
                    <span>
                        <img id="imgProfile2" src="${post.author.profile_image}" alt="profil" class="rounded-circle">
                        <b>${post.author.username}</b>
                    </span>
                    <span id="btnUpDel">
                        ${buttons}
                    </span>    
                </div>
                <div class="card-body">
                    <img src="${post.image}" alt="postImg" class="w-100 h-100">
                    <h6 class="card-text mt-1">${post.created_at}</h6>
                    <h5>${post.title}</h5>
                    <p>${post.body}</p>
                    <hr>
                    <div>
                        <i class="bi bi-pen"></i>
                        <span> (${post.comments_count}) comments</span>
                        <span id="postTags-${post.id}">     
                        </span> 
                    </div>
                </div>
                <div  class="comments rounded-sm  mt-2 p-1">
                    <div id="comments">
                    
                    </div>
                    <div class="lign-items-center d-flex">
                        <input id="commentInput" type="text" class="form-control">
                        <button type="button" value="" class="bg-primary rounded p-1" onclick="submitComment()">Send</button>
                    </div>  
                </div>
            </div>
        `
        document.getElementById("profilepost").innerHTML = postContent;
        let commentsContent = ``;
        for(c of post.comments){
            commentsContent = 
            `
            <div class="align-items-center">
                <img id="imgProfile2" src="${c.author.profile_image}" alt="userProfile" class="rounded-circle">
                <b>${c.author.username}</b>
                <p class="p-1">${c.body}</p>
            </div>
            `
            document.getElementById("comments").innerHTML += commentsContent;
        }
    }) .catch(error => {
            const errorMessage = error.response.data.message;
            showAlert(errorMessage, "danger")
        })
}

function submitComment(){
     const commentInput = document.getElementById("commentInput").value;
     let token = localStorage.getItem("token");
     let bodyParams = {
        "body" : commentInput
     }
     let url = `${BaseURL}/posts/${id}/comments`;
     let headers = {
        "authorization" : `Bearer ${token}`
     }
     axios.post(url, bodyParams, {
        "headers" : headers
     })
     .then(response => {
        const comment = response.data.data;
        // console.log(comment)
        getPost()
     })

}



setupUI();
getPost();



