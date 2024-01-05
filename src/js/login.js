/**Author: Aleksandra Kuzeleva
 * 2023
 */

"use strict";

  //const url = "http://localhost/3WProject/projekt_webservice_vt23-alekuzel/restlogin.php";
  const url = "https://studenter.miun.se/~alku2200/writeable/webbutveckling3/webservice/restlogin.php";
  const emailInput = document.getElementById('email');
  //here and further I commented away variables for input in sign up form
  //const emailS = document.getElementById('emailS');
  //const pswS = document.getElementById('passwordS');
  const passwordInput = document.getElementById('password');
  //const signup = document.getElementById('signup');
  const hiddenInput = document.getElementById('hidden');
  //const hiddenS = document.getElementById('hiddenS');
  const message =  document.getElementById('message');
  const submitButton = document.getElementById('submit');
  
  submitButton.addEventListener("click", loginUser);
  //to be used when neccessary 
//signup.addEventListener("click", signUp);


//log in user
function loginUser(event){

  event.preventDefault();

  let email = emailInput.value;
  let password = passwordInput.value;
  let hidden = hiddenInput.value;

  //gather values from above to jsonStr
  const jsonStr = JSON.stringify({
    email : email,
    password : password,
    hidden : hidden
  });

    //fetch API restlogin
    fetch(url, {
      method : "POST",
      body : jsonStr, 
      headers: {
        "Content-Type" : "application/json",
        "token" : localStorage.getItem("token")
      }
    })
  .then(response =>{
    //showerror message if HTTP response is not OK
    if(response.status != 200) { 
      message.innerHTML = '<p>Wrong  password or email</p>';
      throw Error("Wrong  password or email");
    } 
    return response.json();
    })
    .then (data =>{
      localStorage.setItem('token', data.token);
      //if respons is OK, open admin page
     window.location.replace('https://studenter.miun.se/~alku2200/writeable/webbutveckling3/admin/pub/index.html');
    })
    .catch(error=> {
      console.log(error);
    });
  } 

//commented away the signup function, but didnt remove in case I will need it at some point

/*function signUp(event){
 
  //prevent default action (sending form) unless form is filled 
  event.preventDefault();
  //variable for values of the form fields and submit button
  let emailV = emailS.value;
  let passwordV = pswS.value;
  let hiddenV = hiddenS.value;

  let jsonStr = JSON.stringify({
    email : emailV,
    password : passwordV,
    hidden : hiddenV
  });

  //add data to database using the POST method
  fetch(url, {
      "method": "POST",
      headers: {
          "content-type": "application/json"
      },
      "body": jsonStr
  })
  .then(response =>response.json())
  //clear form
 
  
 
}*/
