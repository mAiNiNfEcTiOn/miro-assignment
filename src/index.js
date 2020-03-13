import "./styles.css";

var targetContainer = document.getElementById('emails-input');
if (targetContainer) {
  /** Generates the component */
  EmailsInput(targetContainer);

  /**
   * Gets the buttons relatively to the targetContainer.
   * This way it allows us to have the same code used for multiple containers.
   **/
  var buttons = targetContainer.parentNode.parentNode.querySelectorAll(
    "footer button"
  );

  buttons[0].addEventListener("click", () => targetContainer.addNewEmail());

  buttons[1].addEventListener("click", () => alert(
    targetContainer.getAllEmails().filter(item => item.isValid).length +
      " valid e-mails"
  ));
}
