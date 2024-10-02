window.onload=function(){
  var gform= document.getElementById("gform");
  gform.onsubmit=handleFormSubmit;
}

function handleFormSubmit(event){
for (let index = 0; index < 4; index++) {
    let errorMessage=document.getElementsByClassName("error-message");
errorMessage[index].style.display="none"; 
}
    let query=document.getElementById("query");
    if (query.value) {
        console.log("valid form");
    }
    else{
console.log("invalid form");
query.classList.add("error");
let errorMessage=document.getElementsByClassName("error-message");
errorMessage[0].style.display="inline";
event.preventDefault();
}
let query1=document.getElementById("query1");
if (query1.value) {
    console.log("valid form");
}
else{
console.log("invalid form");
query.classList.add("error");
let errorMessage=document.getElementsByClassName("error-message");
errorMessage[1].style.display="inline";
event.preventDefault(); 
}
let query2=document.getElementById("query2");
if (query2.value) {
    console.log("valid form");
}
else{
console.log("invalid form");
query.classList.add("error");
let errorMessage=document.getElementsByClassName("error-message");
errorMessage[2].style.display="inline";
event.preventDefault();
}
let query3=document.getElementById("query3");
if (query3.value) {
    console.log("valid form");
}
else{
console.log("invalid form");
query.classList.add("error");
let errorMessage=document.getElementsByClassName("error-message");
errorMessage[3].style.display="inline";
event.preventDefault();
}

}