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

    var listItem = document.createElement("li");
    listItem.style.border = "1px solid #ddd";
    listItem.style.padding = "12px";
    listItem.style.marginBottom = "10px";
    listItem.style.borderRadius = "6px";
    listItem.style.backgroundColor = "#fafafa";

    var dateTimeText =
      deadlineDate ;
    listItem.innerHTML =
      "<strong>" +
      subjectName +
      "</strong><br>" +
      deadlineDescription +
      "<br><em>" +
      dateTimeText +
      "</em>";

    document.getElementById("deadline-list").appendChild(listItem);

    const form = document.getElementById("deadline-form")
    form.setAttribute("action", "/userData");
    form.submit();
  });

  async function fetchtimeTable(){
    
  }