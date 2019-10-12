var buttonColours = new Array("red", "blue", "green", "yellow");
var randomChosenColor = null;

var gamePattern = new Array();
var userClickedPattern = new Array();

var gameStart = false;
var level = 0;

function nextSequence() {
    $("h1").text("Level "+ level);
    var randNum = Math.floor(Math.random() * 4);
    randomChosenColor = buttonColours[randNum];
    gamePattern.push(randomChosenColor);
    $("#"+randomChosenColor).fadeOut(100).fadeIn(100);
    playSound(randomChosenColor);
    level++;
}

function playSound(name) {
    new Audio("sounds/"+name+".mp3").play();
}

function animatePress(currentColour){
    $("#"+currentColour).addClass("pressed");
    setTimeout(function() {
        $("#"+currentColour).removeClass("pressed");
    }, 100);
}

function checkAnswer(currentLevel){
    if (userClickedPattern[currentLevel] == gamePattern[currentLevel]){
        if (userClickedPattern.length == gamePattern.length){
            setTimeout(function() {
                nextSequence();
                userClickedPattern = [];
            }, 1000);
        }
    }
    else{
        gameOver();
    }
}

function gameOver(){
    new Audio("sounds/wrong.mp3").play();
    $("body").addClass("game-over");
    setTimeout(function() {
        $("body").removeClass("game-over");
    }, 200);
    $("h1").text("Game Over, Press Any Key to Restart");
    gameStart = false;
    gamePattern = [];
    userClickedPattern = [];
    level = 0;
}


$(document).keypress(function(){
    if (!gameStart){
        gameStart = true;
        nextSequence();
    }
    else{

    }
});

$("div.btn").click(function() {
    var userChosenColour = this.id;
    animatePress(userChosenColour);
    playSound(userChosenColour);
    userClickedPattern.push(userChosenColour);
    checkAnswer(userClickedPattern.length-1);
});