// Your web app's Firebase configuration (ENTER YOUR FIREBASE DETAILS HERE)
var firebaseConfig = {
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: ""
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var db = firebase.firestore();
var form = document.querySelector('#send-message');
var singout = document.querySelector('.sign-out');
var headerName = document.querySelector('#headerName');
var headerImage = document.querySelector('#headerImage');
var chatSection = document.querySelector('.chat-section');
var headerName = document.querySelector('.chat-header .name');
var headerImage = document.querySelector('.chat-header img');
var imageUrl;
var myUserId;
var userName;

// auth state check 
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        // console.log(user);
        imageUrl = user.photoURL;
        myUserId = user.uid;
        userName = user.displayName;

        // set the header dynamic details 
        headerImage.src = imageUrl;
        headerName.innerText = userName;

        // get chats live 
        db.collection("chats").orderBy('id', 'asc').onSnapshot((chats) => {
            if(chatSection) chatSection.innerHTML = '';
            chats.forEach((chat) => {
                addNewMessage(chat.data());
            });
        });
        headerImage.src = user.photoURL;
        headerName.innerText = user.displayName;
        // set form events 
        form.addEventListener("submit", function(e){
            e.preventDefault();
            if(form.seraph_message.value.length > 2){
                sendMessage(form.seraph_message.value);
                form.seraph_message.value = '';
            }
        })
        singout.addEventListener('click', (e) => {
            let r = confirm('Sure to close?');
            if(r){
                firebase.auth().signOut();
            }
        })

    } else {
        window.location = 'login.html';
    }
});

function sendMessage(message){
    let date = new Date();
    db.collection("chats").add({
        date: formatAMPM(),
        id: date.getTime(),
        imgurl: imageUrl,
        msg: message,
        name: userName,
        userid: myUserId
    })
    .then((docRef) => {
        // console.log("Document written with ID: ", docRef);
    })
    .catch((error) => {
        console.error("Error adding document: ", error);
    });
}

// create message node  
function addNewMessage(obj){

    let item = document.createElement('div');
    let image = document.createElement('img');
    let messageWrapper = document.createElement('div');
    let name = document.createElement('h5');
    let msg = document.createElement('p');
    let date = document.createElement('small');

    // adding classes 
    item.classList.add('item');
    if(obj.userid === myUserId) item.classList.add('other-user');
    image.classList.add('avatar');
    messageWrapper.classList.add('message');
    name.classList.add('name');

    // adding values 
    if(obj.imgurl === '') image.src = imageUrl;
    else image.src = obj.imgurl;
    name.innerText = obj.name;
    msg.innerText = obj.msg;
    date.innerText = obj.date;

    // appending 
    item.append(image);
    messageWrapper.append(name);
    messageWrapper.append(msg);
    messageWrapper.append(date);
    item.append(messageWrapper);

    chatSection.append(item);
    chatSection.scrollTop = chatSection.scrollHeight;

}

// get date time 
function formatAMPM() {
    let date = new Date();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    let dateTxt = `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}  ${strTime}`
    return dateTxt;
}