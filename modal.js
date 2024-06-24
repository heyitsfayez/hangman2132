// Function to show the modal
function showModal() {
  var modal = document.getElementById("modal");
  modal.style.display = "block";
  // Add a backdrop to prevent clicks outside the modal
  var backdrop = document.createElement("div");
  backdrop.className = "modal-backdrop";
  document.body.appendChild(backdrop);
}

// Function to hide the modal
function hideModal() {
  var modal = document.getElementById("modal");
  modal.style.display = "none";
  var backdrop = document.querySelector(".modal-backdrop");
  if (backdrop) {
    backdrop.remove();
  }
}

// Event listener for closing the modal
document
  .getElementById("modal-play-again-button")
  .addEventListener("click", function () {
    hideModal();
    location.reload(); // Reload the page to start the game again
  });
