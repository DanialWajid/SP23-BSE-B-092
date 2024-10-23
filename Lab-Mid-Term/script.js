window.onload=show;

function show() {
    $("#proj1").click(function() {
        loadDescription1('project1.txt').hide(); 
        
    });
    $("#proj2").click(function() {
        loadDescription2('project2.txt').hide(); 
        
    });
    $("#proj3").click(function() {
        loadDescription3('project3.txt').hide(); 
        
    });

    hide1.click($("cOne"));
}

function loadDescription1(fileName) {
    $.get(fileName, function(data) {
        $('#description1').html(data).show();
    });
    var hide1=$("#cOne").append("<button>Hide</button>");

}
function loadDescription2(fileName) {
    $.get(fileName, function(data) {
        $('#description2').html(data).show();
    });
}
function loadDescription3(fileName) {
    $.get(fileName, function(data) {
        $('#description3').html(data).show();
    });
}