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
};

function loadDescription1(fileName) {

    $.get(fileName, function(data) {
        $('#description1').html(data).show();
    });
    if (!$("#cOne").find('.hide-btn').length){
        $("#cOne").append("<button class='hide-btn'>Hide</button>");
    }
    $("#cOne").find('.hide-btn').click(function() {
        $("#description1").hide();
    });
}

function loadDescription2(fileName) {
    $.get(fileName, function(data) {
        $('#description2').html(data).show();
    });

    if (!$("#cTwo").find('.hide-btn').length){
    $("#cTwo").append("<button class='hide-btn'>Hide</button>");
    }

    $("#cTwo").find('.hide-btn').click(function() {
        $("#description2").hide();
    });
}

function loadDescription3(fileName) {
    $.get(fileName, function(data) {
        $('#description3').html(data).show();
    });
    if (!$("#cThree").find('.hide-btn').length){
        $("#cThree").append("<button class='hide-btn'>Hide</button>");
    }
    $("#cThree").find('.hide-btn').click(function() {
        $("#description3").hide();
    });
}
