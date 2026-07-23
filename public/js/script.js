const form          = document.getElementById("deadline-form");
const loadingPopup  = document.getElementById("loading-popup");

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const subjectName          = document.getElementById("subject-name").value.trim();
  const deadlineDescription  = document.getElementById("deadline-description").value.trim();
  const deadlineDate         = document.getElementById("deadline-date").value;

  if (!subjectName || !deadlineDescription || !deadlineDate) return;

  // Show toast and loading overlay, then submit
  showToast("Building your study plan in the background — check the dashboard in a moment!");

  if (loadingPopup) loadingPopup.classList.add("active");

  // Small delay so the user actually sees the feedback before navigation
  setTimeout(() => {
    form.setAttribute("action", "/userData");
    form.submit();
  }, 700);
});

function showToast(text) {
  const toast     = document.getElementById("toast");
  const toastText = document.getElementById("toast-text");
  if (!toast || !toastText) return;

  toastText.textContent = text;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 4000);
}
