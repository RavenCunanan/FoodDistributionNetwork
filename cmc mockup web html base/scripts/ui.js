/**
 * Toggles dark mode on the website by changing the colors to lighter themed or darker themed colors.
 * THIS SHOULD ALSO CHANGE THE GOOGLE MAP TO DARK MODE, IF WE CAN DO THAT
 * @param {*} e The click event
 */
 function toggleDarkMode(e) {
    document.body.classList.toggle("dark-mode");
}

$(".map-side").css("height", $(".input-side").height())
$("iframe").css("height", $(".map-side").css("height"))
$("iframe").css("width", $(".map-side").css("width"))
$(".switch").on("mousedown" , toggleDarkMode)
