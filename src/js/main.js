/**Author: Aleksandra Kuzeleva
 * 2023
 */

"use strict";
//link to web service on localhost
//let urlA = "http://localhost/3WProject/projekt_webservice_vt23-alekuzel/restMenu.php";
//let urlB = "http://localhost/3WProject/projekt_webservice_vt23-alekuzel/restBooking.php";
//link to web service on public host
let  urlA = "https://studenter.miun.se/~alku2200/writeable/webbutveckling3/webservice/restMenu.php";
let  urlB = "https://studenter.miun.se/~alku2200/writeable/webbutveckling3/webservice/restBooking.php";

//variables for the form input
const mealNameInput = document.getElementById("mealName");
const categoryInput = document.getElementById("category");
const priceInput = document.getElementById("price");
const descriptionInput = document.getElementById("description");
const submitInput = document.getElementById("submit");
const submitLogout = document.getElementById('logout');

//event listeners for buttons logout and add meal
submitLogout.addEventListener("click", logoutUser);
submitInput.addEventListener("click", addMeal);

window.onload = init;

//get all courses when the page loads
function init(){
   getMenu();
   getBookings();
   showToken();
}

//get courses from the database. proceed if response status is 200 (OK)
function getMenu(){
     fetch(urlA)
     .then(response=> {
        if(response.status != 200){
            return }
       
        return response.json()
        
        //if respons is OK, call function displayMenu
        .then(data=> displayMenu(data))
     })
}

//when 
function logoutUser(){
    localStorage.removeItem("token");
    window.location.replace('https://studenter.miun.se/~alku2200/writeable/webbutveckling3/admin/pub/login.html');
  }

//add new meal to menu
function addMeal(event){
 
    //prevent default action (sending form) unless form is filled 
    event.preventDefault();
    //variable for values of the form fields and submit button
    let mealName = mealNameInput.value;
    let category = categoryInput.value;
    let price = priceInput.value;
    let description = descriptionInput.value;
    
    //gather all values from above to jsonStr
    let jsonStr = JSON.stringify({
        name: mealName,
        description : description,
        category : category,
        price : price
    });
  
    //fetch API restMenu
    fetch(urlA, {
        "method": "POST",
        headers: {
            "content-type": "application/json"
        },
        "body": jsonStr
    })
    .then(response =>response.json())

    //clear form after meal is added to the menu and display updated menu
    .then(data =>  clearForm())
    alert("New meal added!");
    getMenu() 
}

//get all bookings
function getBookings(){
    //fetch API restBookings
    fetch(urlB)
    .then(response=> {
       if(response.status != 200){
           return }
      
       return response.json()
       //if respons is OK call function displayBookings
       .then(data=> displayBookings(data))
    })
}

//display all bookings
function displayBookings(bookings){
    //variable for division "bookings" 
    const bkngs = document.getElementById("bookings");
    bkngs.innerHTML = "";
    //go through bookings and print each of them. contenteditable allows edit content without a form
    bookings.forEach(booking =>{
    bkngs.innerHTML += `<div class="bookingDiv">
    <p> <b id="clientsname${booking.id}">${booking.name}</b>
    <b id="clientslastname${booking.id}">${booking.lastname}</b></p>
    <p><b>Tel.:</b>  <span id="phone${booking.id}">${booking.phone}</span></p>
    <p><b>E-mail: </b> <span id="email${booking.id}">${booking.email}</span></p>
    <p><b>Date: </b><span id="date${booking.id}" contenteditable>${booking.date}</span></p>
    <p><b>Time: </b> <span id="time${booking.id}" contenteditable>${booking.time}</span></p>
    <p><b>Number of people: </b> <span id="numpeople${booking.id}" contenteditable>${booking.numberofpeople}</span></p>
    <p><button data-id="${booking.id}" class="upd">UPDATE</button>
    <button data-id="${booking.id}" class="del">DELETE</button></p>
    </div>`;
   });

   //variables for delete and update buttons created above
   let delBtn = document.getElementsByClassName("del");
   let updBtn = document.getElementsByClassName("upd");
   
   //add event listeners to update and delete buttons
   for(let i = 0; i < delBtn.length; i++) {
    delBtn[i].addEventListener("click", deleteBooking);
    updBtn[i].addEventListener("click", updateBooking);
   }
}

//delete booking
function deleteBooking(event){
   //delete booking with chosen id (after confirmation)
   let id = event.target.dataset.id;
   if (confirm("Delete the booking?") == true) {
   fetch(urlB + "?id=" + id, {
    "method" : "DELETE"
   })
   .then(response => response.json())
    .then (data =>{
          alert("Booking deleted!");
          getBookings()})
          .catch(err => console.log(err))
        } else {
            //if removal is cancelled, call function getBookings
            getBookings()
          }
}

//update booking
function updateBooking(event){
    let id = event.target.dataset.id;
    let clientsname = document.getElementById("clientsname" + id).innerHTML;
    let clientslastname = document.getElementById("clientslastname" + id).innerHTML;
    let phone = document.getElementById("phone" + id).innerHTML;
    let email = document.getElementById("email" + id).innerHTML;
    let date = document.getElementById("date" + id).innerHTML;
    let time = document.getElementById("time" + id).innerHTML;
    let numpeople = document.getElementById("numpeople" + id).innerHTML;

    let jsonStr = JSON.stringify({
        name : clientsname,
        lastname : clientslastname,
        phone : phone,
        email : email,
        date : date,
        time : time,
        numberofpeople : numpeople,
        id : id
    });
    
    //fetch API restBooking with bookings ID in case update is confirmed
    if (confirm("Are you sure you want to update the booking?") == true) {
    fetch(urlB + "?id=" + id, {
        method: "PUT",
        headers: {
            "content-type": "application/json"
        },
        body: jsonStr
    })
    .then(response =>{
   
        if(response.status != 200) { 
            alert("Impossible to choose time in the past!");
          throw Error("Impossible to choose time in the past!");
        } 
        return response.json()
    })
        .then (data =>{
          alert("Booking updated!");
          getBookings()})}
    else{
        alert("Updates cancelled!");
        getBookings()
    }
}

//display menu
function displayMenu(meals){
        //variables for divisions for different menu categories
        let pizza = document.getElementById("pizza");
        pizza.innerHTML = "";
        let pasta = document.getElementById("pasta");
        pasta.innerHTML = "";
        let drinks = document.getElementById("drinks");
        drinks.innerHTML = "";
        let desserts = document.getElementById("desserts");
        desserts.innerHTML = "";
       
        //go through meals in menu and print each meal in its own category
        meals.forEach(meal =>{
            
            if(meal.category == 'Pizza'){
                pizza.innerHTML += `<div class="mealDiv">
                <b> <p id="mealname${meal.id}" contenteditable>${meal.name}</p></b>
                <p><b>Category: </b><span id="category${meal.id}" contenteditable>${meal.category}</span></p>
                <p><b>Description: </b><span id="description${meal.id}" contenteditable>${meal.description}</span></p>
                <p><b>Price: </b><span id="price${meal.id}" contenteditable>${meal.price}</span> kr</p>
                <p><button data-id="${meal.id}" class="update">UPDATE</button>
                <button data-id="${meal.id}" class="delete">DELETE</button></p>
                </div>`;}

            if(meal.category == 'Pasta'){
                pasta.innerHTML += `<div class="mealDiv">
                <b> <p id="mealname${meal.id}" contenteditable>${meal.name}</p></b>
                <p><b>Category: </b><span id="category${meal.id}" contenteditable>${meal.category}</span></p>
                <p><b>Description: </b><span id="description${meal.id}" contenteditable>${meal.description}</span></p>
                <p><b>Price: </b><span id="price${meal.id}" contenteditable>${meal.price}</span> kr</p>
                <p><button data-id="${meal.id}" class="update">UPDATE</button>
                <button data-id="${meal.id}" class="delete">DELETE</button></p>
                </div>`;}
                
            if(meal.category == 'Drink'){
                
                drinks.innerHTML += `<div class="mealDiv">
                <b> <p id="mealname${meal.id}" contenteditable>${meal.name}</p></b>
                <p><b>Category: </b><span id="category${meal.id}" contenteditable>${meal.category}</span></p>
                <p><b>Description: </b><span id="description${meal.id}" contenteditable>${meal.description}</span></p>
                <p><b>Price: </b><span id="price${meal.id}" contenteditable>${meal.price}</span> kr</p>
                <p><button data-id="${meal.id}" class="update">UPDATE</button>
                <button data-id="${meal.id}" class="delete">DELETE</button></p>
                </div>`;}
            if(meal.category == 'Dessert'){
                
                desserts.innerHTML += `<div class="mealDiv">
                <b> <p id="mealname${meal.id}" contenteditable>${meal.name}</p></b>
                <p><b>Category: </b><span id="category${meal.id}" contenteditable>${meal.category}</span></p>
                <p><b>Description: </b><span id="description${meal.id}" contenteditable>${meal.description}</span></p>
                <p><b>Price: </b><span id="price${meal.id}" contenteditable>${meal.price}</span> kr</p>
                <p><button data-id="${meal.id}" class="update">UPDATE</button>
                <button data-id="${meal.id}" class="delete">DELETE</button></p>
                </div>`;}})

            //variables for delete and update buttons
           let delB = document.getElementsByClassName("delete");
           let updB = document.getElementsByClassName("update");
        
           //add event listeners for delete and update buttons
           for(let i = 0; i < delB.length; i++) {
            delB[i].addEventListener("click", deleteMeal);
            updB[i].addEventListener("click", updateMeal);
           }
        }
    
//detele meal if removal is confirmed
function deleteMeal(event){
    let id = event.target.dataset.id;
    if (confirm("Are you sure you want to delete the meal?") == true) {
    fetch(urlA + "?id=" + id, {
        //call and execute method DELETE in restMenu API
     "method": "DELETE"
    })
    .then(response => response.json())
    //show message with the alert method and call function getMenu
    .then (data =>{
        alert("Menu updated!");
        getMenu()})
    .catch(err => console.log(err))}
    else{
        getMenu()
    }
 }


 //update meal
 function updateMeal(event){
     let id = event.target.dataset.id;
     let mealname = document.getElementById("mealname" + id).innerHTML;
     let description = document.getElementById("description" + id).innerHTML;
     let category = document.getElementById("category" + id).innerHTML;
     let price = document.getElementById("price" + id).innerHTML;
 
     let jsonStr = JSON.stringify({
         name : mealname,
         description : description,
         price : price,
         category : category,
         id : id
     });
     
     //fetch API restMenu with the meals ID if user confirms action
     if (confirm("Are you sure you want to save changes?") == true) {
     fetch(urlA + "?id=" + id, {
         method: "PUT",
         headers: {
             "content-type": "application/json"
         },
         body: jsonStr
     })
     .then(response => response.json())
     .then(data => {
         alert("Menu updated!")
         getMenu();})
     .catch(err => console.log(err))}
     else{
        alert("Updates cancelled!")
        getMenu()
     }
     
 }

 //clear form and call function getMenu
function clearForm(){
   mealNameInput.value = "";
    categoryInput.value = "";
    priceInput.value = "";
    descriptionInput.value = "";
    getMenu();
}
