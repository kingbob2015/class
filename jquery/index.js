$(document).ready(function() {
   // $("h1").css("color", "red");
    $("h1").addClass("big-title margin-50")
//     console.log($("h1").css("color"));
//     console.log($("h1").hasClass("margin-50"));
//     $("h1").text("Bye");
//     $("button").html("<em>Hey</em>")
//     $("img").attr("src", "../drum_kit/images/tom1.png");
    $("button").click(function() {
        //$("h1").css("color", "purple");
        //$("h1").hide();
        //$("h1").toggle();
        //$("h1").fadeToggle();
        //$("h1").slideToggle();
        //$("h1").animate({opacity: 0.5}); //allows us to animate towards some new css but can only do css rules with numeric rules
        $("h1").slideUp().slideDown().animate({opacity: 0.5});
    });

    // $(document).keypress(function(){
    //     $("h1").text(event.key);
    // });
    // https://developer.mozilla.org/en-US/docs/Web/Events
    // $("h1").on("mouseover", function() {
    //     $("h1").css("color", "red");
    // });

    //can create html elements whenever we want
    // $("h1").before("<button>NEW</button>");
    // $("h1").after("<button>NEW</button>");
    // Also have prepend() and append(). Prepend adds the element inside the tag you selected before the inner html
    // Append adds the element inside the tag you selected after the innerhtml

    //$("h1").remove();
});
