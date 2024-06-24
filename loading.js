document.addEventListener("DOMContentLoaded", function () {
  var loadingContainer = document.getElementById("loading-container");
  var gameContainer = document.getElementById("game-container");
  var header = document.querySelector("header");
  var footer = document.querySelector("footer");

  // hide game content initially
  gameContainer.style.display = "none";
  header.style.display = "none";
  footer.style.display = "none";

  // load Lottie animation
  lottie.loadAnimation({
    container: loadingContainer,
    renderer: "svg",
    loop: true,
    autoplay: true,
    path: "../animations/loading.json",
  });

  // simulate loading time, then show game content
  setTimeout(function () {
    loadingContainer.style.display = "none";
    gameContainer.style.display = "block";
    header.style.display = "block";
    footer.style.display = "block";
  }, 5000);
});
