import { initializeApp } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-analytics.js";
import { getDatabase,push,get,ref,set,onValue,child } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyBW6wD-WfWOfDfr2sJ2Ep03fOGLY39GLn8",
    authDomain: "discussionx-cccfb.firebaseapp.com",
    databaseURL: "https://discussionx-cccfb-default-rtdb.firebaseio.com",
    projectId: "discussionx-cccfb",
    storageBucket: "discussionx-cccfb.appspot.com",
    messagingSenderId: "780601616334",
    appId: "1:780601616334:web:b4e81ee39c94178766ad9f",
    measurementId: "G-SLB45KBVLL"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const db = getDatabase();

var userName = document.querySelector("#userTxt");
var password = document.querySelector("#passTxt");
var logContainer = document.querySelector("#logContainer");
var mainContainer = document.querySelector("#main");
var logoTxt = document.querySelector("#topic");
const body = document.body;
var nav = logoTxt = document.querySelector(".navbar");

// Get all elements with class "auto-close"
const autoCloseElements = document.querySelectorAll(".auto-close");

document.querySelector("#joinBtn").onclick = function() {writeUserData(userName.value,password.value)};
document.querySelector("#logBtn").onclick = function() {login(userName.value,password.value)};
document.querySelector("#signOut").onclick = function() {logout()};
document.querySelector("#createBtn").onclick = function() {meetingRoom()};


/*

theme data


*/

document.querySelector("#btnTheme").onclick = function() {themeMode()};


function meetingRoom() {
    
}


var isDark = false

function themeMode() {

    if (isDark) {
        isDark = false
        logoTxt.classList.remove("dark")
        body.classList.remove("dark")
        // nav.classList.remove("dark")
        logContainer.classList.remove("dark")
    }else{
        isDark = true
        logoTxt.classList.add("dark")
        body.classList.add("dark")
        // nav.classList.add("dark")
        logContainer.classList.add("dark")
    }


    
}





window.onload = function () {
    var isLogin = localStorage.getItem('isLogin');

    if (isLogin=='yes') {
        //hide log container
        logContainer.style.display = "none";
        mainContainer.style.display = "block";
        document.querySelector("#signOut").style.display = "block";
        getUserData(localStorage.getItem("userId"))
        setTimeout(function () {
            autoCloseElements.forEach(function (element) {
              fadeAndSlide(element);
            });
          }, 1000);
        
    }else{
        logContainer.style.display = "block";
        mainContainer.style.display = "none";
        document.querySelector("#signOut").style.display = "none";
        document.querySelector(".auto-close").style.display = "none";
        
    }

}

function getUserData(userId) {
    const starCountRef = ref(db, 'users/');
    get(child(starCountRef, userId+'/')).then((snapshot) => {
        if (snapshot.exists()) {
            document.querySelector("#homeusername").innerHTML = snapshot.val().username


        }
    })
    
}
document.querySelector("#createBtn").onclick = function() {

    window.location.href = 'Room.html'
    
};


// Define a function to handle the fading and sliding animation
function fadeAndSlide(element) {
  const fadeDuration = 500;
  const slideDuration = 500;
  
  // Step 1: Fade out the element
  let opacity = 1;
  const fadeInterval = setInterval(function () {
    if (opacity > 0) {
      opacity -= 0.1;
      element.style.opacity = opacity;
    } else {
      clearInterval(fadeInterval);
      // Step 2: Slide up the element
      let height = element.offsetHeight;
      const slideInterval = setInterval(function () {
        if (height > 0) {
          height -= 10;
          element.style.height = height + "px";
        } else {
          clearInterval(slideInterval);
          // Step 3: Remove the element from the DOM
          element.parentNode.removeChild(element);
        }
      }, slideDuration / 10);
    }
  }, fadeDuration / 10);
}

function getRooms() {

    console.log("clicked")
    
}


function logout() {
    Swal.fire({
        title: 'Are you sure?',
        text: "You are about to signout!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'SignOut'
      }).then((result) => {
        if (result.isConfirmed) {

            localStorage.setItem('isLogin', 'no');
            localStorage.setItem('userId', '');
            location.reload();
          
        }
      })

}

function login(username, password) {
    if (username=="") {
        alert("fill all details")
        return
    }

    if (password=="" || password.length<3) {
        alert("fill all details")
        return
    }

    var validUser = false
    var uId = ""
    const db = getDatabase();
    const starCountRef = ref(db, 'users/');

    get(child(starCountRef, '/')).then((snapshot) => {
        if (snapshot.exists()) {

        snapshot.forEach(element => {

            var user = element.val().username
            var pass = element.val().password

            if (user===username && pass===password) {
                uId = element.val().userId
                validUser = true

    
            }
        });


        if (validUser) {
            //set token to local
           //hide log container
           logContainer.style.display = "none";
           mainContainer.style.display = "block";
           document.querySelector("#signOut").style.display = "block";
           localStorage.setItem('isLogin', 'yes');
           localStorage.setItem('userId', uId);
           location.reload()
       }else{
           alert("sorry! this account doesn't exist")
       }

        }
    })




   
}

function writeUserData(username, password) {
        
    if (username=="") {
        alert("fill all details")
        return
    }

    if (password=="" || password.length<3) {
        alert("fill all details")
        return
    }


        const db = getDatabase(app);

        var isAvail = false
        var arr = []
        var i = 0
        //check for the existing user
        onValue(ref(db, 'users/'), (snapshot) => {
            const data = snapshot.val();
            snapshot.forEach(element => {

                var uName = element.val().username;
                arr[i++] = uName
                
            });


            for (let j = 0; j < arr.length; j++) {
                if (arr[j]==username) {
                    isAvail = true
                    break;
                }
                
            }

            if (isAvail==false) {
                const postListRef = ref(db, 'users');
                const newPostRef = push(postListRef);
                set(newPostRef, {
                    userId: newPostRef.key,
                    username: username,
                    password: password,
                });
    
                console.log("registered")
                alert("registered now login")
                return;
            } else {
                alert("username already exist! try another username")
            }
            
        });



}

