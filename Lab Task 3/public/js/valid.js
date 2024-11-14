window.onload=function(){
var gform=document.getElementById("gform");
gform.onsubmit=handleFormSubmit;
}

function handleFormSubmit (event){
    for (let index = 0; index < 4; index++) {
        let errorMessage=document.getElementsByClassName("error-message");
    errorMessage[index].style.display="none"; 
    }

    let query=document.getElementsByClassName("query");

    for (let index = 0; index < 4; index++) {
        if (query[index].value) {
            console.log("Valid Input");
        }
        else{
            console.log("invalid form");
            let errorMessage=document.getElementsByClassName("error-message");
            errorMessage[index].style.display="inline";
            event.preventDefault();
        }
        
    }
}