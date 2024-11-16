window.onload = function () {
  var gform = document.getElementById("gform");
  gform.onsubmit = handleFormSubmit;
};

function handleFormSubmit(event) {
  // Hide error messages first
  for (let index = 0; index < 4; index++) {
    let errorMessage = document.getElementsByClassName("error-message");
    errorMessage[index].style.display = "none";
  }

  let query = document.getElementsByClassName("query");
  let isValid = true;

  // Loop through the form fields to validate them
  for (let index = 0; index < 4; index++) {
    if (query[index].value) {
      console.log("Valid Input");
    } else {
      console.log("Invalid form");
      let errorMessage = document.getElementsByClassName("error-message");
      errorMessage[index].style.display = "inline";
      isValid = false; // Set validation to false if any field is invalid
      event.preventDefault();
    }
  }

  // If the form is valid, reset the fields
  if (isValid) {
    // Loop through all the fields and clear their values
    for (let index = 0; index < query.length; index++) {
      query[index].value = ""; // Reset each field's value
    }
    console.log("Form submitted successfully and fields cleared.");
  }
}
