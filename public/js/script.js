const form = document.getElementById("deadline-form");


document
  .getElementById("deadline-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    console.log("Form submitted");
    var subjectName = document.getElementById("subject-name").value.trim();
    var deadlineDescription = document
      .getElementById("deadline-description")
      .value.trim();
    var deadlineDate = document.getElementById("deadline-date").value;

    if (!subjectName || !deadlineDescription || !deadlineDate) {
      return;
    }
    // popup(
    //   "Generating your study plan in background. You will be notified once it's ready.  Feel free to explore the dashboard in the meantime!",
    // );
    alert(
      "Generating your study plan in background. You will be notified once it's ready.  Feel free to explore the dashboard in the meantime!",
    );
    form.setAttribute("action", "/userData");
    form.submit();
  });

function popup(text) {
  var popup = document.getElementById("popup");
  popup.textContent = text;
  popup.style.display = "block";
}
