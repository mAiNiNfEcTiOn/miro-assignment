import "./styles.css";

var targetContainer = document.getElementById('emails-input');
if (targetContainer) {
  EmailsInput(targetContainer);

  var buttons = targetContainer.parentNode.parentNode.querySelectorAll(
    "footer button"
  );

  buttons[0].addEventListener("click", () => targetContainer.addNewEmail());

  buttons[1].addEventListener("click", () => alert(
    targetContainer.getAllEmails().filter(item => item.isValid).length +
      " valid e-mails"
  ));
}
