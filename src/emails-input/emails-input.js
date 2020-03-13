import "./emails-input.css";

((window, document) => {
  const chars = [];
  for (let charCode = 48; charCode <= 57; charCode += 1) {
    chars.push(String.fromCharCode(charCode));
  }

  for (let charCode = 65; charCode <= 90; charCode += 1) {
    chars.push(String.fromCharCode(charCode));
  }

  for (let charCode = 97; charCode <= 122; charCode += 1) {
    chars.push(String.fromCharCode(charCode));
  }

  function generateRandomEmail(size = 8) {
    let email = "";
    for (let charCounter = 0; charCounter < size; charCounter += 1) {
      email += chars[Math.floor(Math.random() * chars.length)];
    }

    email += "@miro.com";

    return email;
  }

  function handleInputValue(config) {
    const value = config.value;
    const store = config.store;

    if (value) {
      value.split(",").forEach(item => {
        if (!item) {
          return;
        }

        item = item.trim();

        const alreadyExists = store.some(record => record.value === item);

        if (alreadyExists) {
          return;
        }

        const emailField = document.createElement("input");
        emailField.type = "email";
        emailField.value = item;

        const isValid = emailField.checkValidity();

        store.push({ value: item, isValid: isValid });
        config.node.insertAdjacentElement(
          "beforebegin",
          Pill({ value: item, isValid: isValid, store: store })
        );
      });
    }
  }

  /**
   * 
   * @param {*} config 
   */
  function Pill(config) {
    const containerDiv = document.createElement("div");
    const span = document.createElement("span");
    const button = document.createElement("button");

    button.className = "emails-input__root__pill__button";
    containerDiv.className = "emails-input__root__pill";

    span.textContent = config.value;
    button.type = "button";
    button.innerHTML =
      '<svg focusable="false" tabindex="-1" width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">' +
      '<path fill-rule="evenodd" clip-rule="evenodd" d="M8 0.8L7.2 0L4 3.2L0.8 0L0 0.8L3.2 4L0 7.2L0.8 8L4 4.8L7.2 8L8 7.2L4.8 4L8 0.8Z" fill="#050038"/>' +
      "</svg>";

    button.addEventListener("click", e => {
      const pill = button.parentNode;
      for (let idx = 0; idx < config.store.length; idx += 1) {
        if (config.store[idx].value === config.value) {
          config.store.splice(idx, 1);
          break;
        }
      }

      pill.parentNode.querySelector('input').focus();
      pill.parentNode.removeChild(pill);
    });

    containerDiv.insertAdjacentElement("afterbegin", span);
    containerDiv.insertAdjacentElement("beforeend", button);

    if (!config.isValid) {
      containerDiv.classList.add("emails-input__root__pill--invalid");
    }

    containerDiv.addEventListener('click', (e) => e.stopPropagation());

    return containerDiv;
  }

  function Input(store) {
    const input = document.createElement("input");
    input.className = "emails-input__root__input";
    input.placeholder = "add more people...";

    input.addEventListener("blur", e => {
      const node = e.currentTarget;
      handleInputValue({ node: node, store: store, value: node.value });
      e.currentTarget.value = "";
    });

    input.addEventListener("keyup", e => {
      const node = e.currentTarget;

      /** Handles pressing ',' or 'Enter' */
      if ([188, 13].indexOf(e.keyCode) !== -1) {
        handleInputValue({ node: node, store: store, value: node.value });
        node.value = "";
      }

      /**
       * Handles pressing backspace to delete items.
       * It assumes the user is deleting the last item added
       * since the input is in the end of the list.
       **/
      if (e.keyCode === 8 && node.value === "") {
        const pills = input.parentNode.querySelectorAll("div");

        if (pills.length) {
          node.parentNode.removeChild(pills[pills.length - 1]);
          store.pop();
        }
      }
    });

    input.addEventListener("paste", e => {
      const node = e.currentTarget;

      /** IE 11 relies on window.clipboardData to get the pasted text */
      const value = (e.clipboardData || window.clipboardData).getData("text");
      handleInputValue({ node: node, store: store, value: value });
      node.value = "";

      /**
       * Prevents the browser from pasting the content
       * since this event happens "before" the content
       * is set in the "value" attribute
       **/
      e.preventDefault();
    });

    input.addEventListener('click', (e) => e.stopPropagation());

    return input;
  }

  function EmailsInput(container) {
    const subscriptions = [];
    const emailsStore = [];
    const rootDiv = document.createElement("div");

    rootDiv.className = "emails-input__root";

    /**
     * Intercepts push, pop and splice to trigger notifications to any subscriptions.
     * Notice that the subscription always receives a property `data` with an array
     * of values.
     **/
    emailsStore.push = item => {
      subscriptions.forEach(cb => {
        cb({ event: "ADDITION", data: [{ ...item }] });
      });

      return Array.prototype.push.call(emailsStore, item);
    };

    emailsStore.pop = () => {
      const itemBeingRemoved = Array.prototype.pop.call(emailsStore);
      subscriptions.forEach(cb => {
        cb({ event: "REMOVAL", data: [{ ...itemBeingRemoved }] });
      });

      return itemBeingRemoved;
    };

    emailsStore.splice = (...args) => {
      const itemsBeingRemoved = Array.prototype.splice.call(
        emailsStore,
        ...args
      );

      subscriptions.forEach(cb => {
        cb({
          event: "REMOVAL",
          data: itemsBeingRemoved.map(item => ({ ...item }))
        });
      });

      return itemsBeingRemoved;
    };

    const input = Input(emailsStore);

    rootDiv.addEventListener('click', () => input.focus());
    rootDiv.insertAdjacentElement("beforeend", input);
    container.insertAdjacentElement("beforeend", rootDiv);

    /**
     * Extends the root component with our API ...
     * If our component had to be removed from the DOM,
     * a method to cleanup these methods shuold be created.
     **/
    container.getAllEmails = function getAllEmails() {
      return emailsStore.concat([]);
    };

    container.addNewEmail = function addNewEmail() {
      handleInputValue({
        node: input,
        store: emailsStore,
        value: generateRandomEmail()
      });
    };

    /**
     * This method implements the observable pattern in which
     * returns the function to `unsubscribe` when we're done
     * listening the changes to the store.
     **/
    container.subscribe = function subscribe(cb) {
      if (typeof cb === "function") {
        subscriptions.push(cb);
      }

      return function unsubscribe() {
        const idx = subscriptions.indexOf(cb);
        if (idx !== -1) {
          subscriptions.splice(idx, 1);
        }
      };
    };

    container.replaceAllEmails = function replaceAllEmails() {
      /** Removes all pills */
      Array.prototype.slice
        .call(rootDiv.querySelectorAll("div.emails-input__root__pill"), 0)
        .forEach(function(node) {
          node.parentNode.removeChild(node);
        });

      /**
       * Removes the items from the store,
       * using splice to trigger a notification on subscriptions
       **/
      const numberExistingEmails = emailsStore.length;
      emailsStore.splice(0, emailsStore.length);

      /**
       * Re-uses the addNewEmail() API to trigger notifications on subscriptions
       */
      for (let counter = 0; counter < numberExistingEmails; counter += 1) {
        container.addNewEmail();
      }
    };
  }

  /** Exposes the method to generate EmailsInput instances */
  window.EmailsInput = EmailsInput;
})(window, document);
