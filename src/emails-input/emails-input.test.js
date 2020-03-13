import { fireEvent, waitFor, createEvent } from "@testing-library/dom";

import "@testing-library/jest-dom/extend-expect";

import "./emails-input";

describe("emails-input", () => {
  let div;

  beforeEach(() => {
    div = document.createElement("div");
    div.id = "test";
    document.body.appendChild(div);
  });

  afterEach(() => {
    // Cleanup
    div.parentNode.removeChild(div);
  });

  it("matches the expected initial rendering", async () => {
    window.EmailsInput(div);

    await waitFor(() =>
      expect(document.querySelector(".emails-input__root__input")).toBeVisible()
    );
    expect(document.body).toMatchSnapshot();
  });

  it("adds a pill/block when inserts something and presses enter, comma or blurs out of the input. Marks it as valid or invalid based on being or not a valid e-mail", async () => {
    window.EmailsInput(div);

    const input = await waitFor(() =>
      document.querySelector(".emails-input__root__input")
    );

    input.value = "test";
    fireEvent.keyUp(input, { key: "Enter", keyCode: 13 });

    /** Enter */
    await waitFor(() =>
      expect(document.querySelector(".emails-input__root__pill")).toBeVisible()
    );
    const firstPill = document.querySelector(".emails-input__root__pill");
    expect(firstPill).toHaveTextContent("test");
    expect(firstPill).toHaveClass("emails-input__root__pill--invalid");

    /** Comma */
    input.value = "valid-email@miro.com";
    fireEvent.keyUp(input, { key: ",", keyCode: 188 });
    await waitFor(() =>
      expect(
        document.querySelectorAll(".emails-input__root__pill").length
      ).toBe(2)
    );

    const secondPill = document.querySelector(
      ".emails-input__root__pill:nth-child(2)"
    );
    expect(secondPill).toHaveTextContent("valid-email@miro.com");
    expect(secondPill).not.toHaveClass("emails-input__root__pill--invalid");

    /** Blur */
    input.value = "another-valid-email@miro.com";
    fireEvent.blur(input);
    await waitFor(() =>
      expect(
        document.querySelectorAll(".emails-input__root__pill").length
      ).toBe(3)
    );

    const thirdPill = document.querySelector(
      ".emails-input__root__pill:nth-child(3)"
    );
    expect(thirdPill).toHaveTextContent("another-valid-email@miro.com");
    expect(thirdPill).not.toHaveClass("emails-input__root__pill--invalid");

    expect(document.body).toMatchSnapshot();
  });

  it("ignores empty entries", async () => {
    window.EmailsInput(div);

    const input = await waitFor(() =>
      document.querySelector(".emails-input__root__input")
    );
    input.value = "";
    fireEvent.keyUp(input, { key: "Enter", keyCode: 13 });
    await waitFor(() =>
      expect(
        document.querySelectorAll(".emails-input__root__pill").length
      ).toBe(0)
    );

    input.value = ",,,,,,";
    fireEvent.keyUp(input, { key: "Enter", keyCode: 13 });
    await waitFor(() =>
      expect(
        document.querySelectorAll(".emails-input__root__pill").length
      ).toBe(0)
    );
  });

  it("ignores attempt to insert the same value twice", async () => {
    window.EmailsInput(div);

    const input = await waitFor(() =>
      document.querySelector(".emails-input__root__input")
    );
    input.value = "test";
    fireEvent.keyUp(input, { key: "Enter", keyCode: 13 });
    await waitFor(() =>
      expect(
        document.querySelectorAll(".emails-input__root__pill").length
      ).toBe(1)
    );

    input.value = "test";
    fireEvent.keyUp(input, { key: "Enter", keyCode: 13 });
    await waitFor(() =>
      expect(
        document.querySelectorAll(".emails-input__root__pill").length
      ).toBe(1)
    );
  });

  it("removes a pill/block ONLY when the input element is empty and the user presses backspace", async () => {
    window.EmailsInput(div);

    const input = await waitFor(() =>
      document.querySelector(".emails-input__root__input")
    );

    input.value = "test";
    fireEvent.keyUp(input, { key: "Enter", keyCode: 13 });
    await waitFor(() =>
      expect(document.querySelector(".emails-input__root__pill")).toBeVisible()
    );

    input.value = "some value";
    fireEvent.keyUp(input, { key: "Backspace", keyCode: 8 });
    await waitFor(() =>
      expect(document.querySelector(".emails-input__root__pill")).toBeVisible()
    );

    input.value = "";
    fireEvent.keyUp(input, { key: "Backspace", keyCode: 8 });
    await waitFor(() =>
      expect(document.querySelector(".emails-input__root__pill")).toBe(null)
    );
  });

  it("removes a pill/block when clicking the remove button in it", async () => {
    window.EmailsInput(div);

    const input = await waitFor(() =>
      document.querySelector(".emails-input__root__input")
    );

    input.value = "test";
    fireEvent.keyUp(input, { key: "Enter", keyCode: 13 });
    await waitFor(() =>
      expect(document.querySelector(".emails-input__root__pill")).toBeVisible()
    );
    const pill = document.querySelector(".emails-input__root__pill");
    const removeButton = pill.querySelector(
      ".emails-input__root__pill__button"
    );

    fireEvent.click(removeButton);
    await waitFor(() =>
      expect(document.querySelector(".emails-input__root__pill")).toBe(null)
    );
  });

  it("adds random e-mails when calling the addNewEmail method added to the target container", async () => {
    window.EmailsInput(div);

    await waitFor(() =>
      expect(
        document.querySelectorAll(".emails-input__root__pill").length
      ).toBe(0)
    );

    div.addNewEmail();
    div.addNewEmail();

    await waitFor(() =>
      expect(
        document.querySelectorAll(".emails-input__root__pill").length
      ).toBe(2)
    );
  });

  it("retrieves the list of ALL e-mails added - invalid and valid - when calling the getAllEmails method added to the target container", async () => {
    window.EmailsInput(div);

    const input = await waitFor(() =>
      document.querySelector(".emails-input__root__input")
    );
    input.value = "test";
    fireEvent.keyUp(input, { key: "Enter", keyCode: 13 });

    input.value = "valid@email.dom";
    fireEvent.keyUp(input, { key: "Enter", keyCode: 13 });
    await waitFor(() =>
      expect(
        document.querySelectorAll(".emails-input__root__pill").length
      ).toBe(2)
    );

    expect(div.getAllEmails()).toMatchObject([
      {
        isValid: false,
        value: "test"
      },
      {
        isValid: true,
        value: "valid@email.dom"
      }
    ]);
  });

  it("replaces the existing list of e-mails with new ones when calling the replaceAllEmails method added to the target container", async () => {
    window.EmailsInput(div);

    const input = await waitFor(() =>
      document.querySelector(".emails-input__root__input")
    );

    div.addNewEmail();
    div.addNewEmail();
    div.addNewEmail();
    div.addNewEmail();

    await waitFor(() =>
      expect(
        document.querySelectorAll(".emails-input__root__pill").length
      ).toBe(4)
    );
    const initialPillsTexts = Array.from(document.querySelectorAll(".emails-input__root__pill")).map((node) => node.textContent);

    div.replaceAllEmails();
    await waitFor(() =>
      expect(
        document.querySelectorAll(".emails-input__root__pill").length
      ).toBe(4)
    );
    const finalPillsTexts = Array.from(document.querySelectorAll(".emails-input__root__pill")).map((node) => node.textContent);

    expect(initialPillsTexts).not.toMatchObject(finalPillsTexts);
  });

  it("receives additions and removals from the list of e-mails when subscribed and stops receiving after unsubscribing", async () => {
    const myFn = jest.fn();
    window.EmailsInput(div);

    const input = await waitFor(() =>
      document.querySelector(".emails-input__root__input")
    );
    input.value = "test";
    fireEvent.keyUp(input, { key: "Enter", keyCode: 13 });
    await waitFor(() =>
      expect(
        document.querySelectorAll(".emails-input__root__pill").length
      ).toBe(1)
    );

    expect(myFn).toHaveBeenCalledTimes(0);

    // Subscribes
    const unsubscribeFn = div.subscribe(entries => myFn(entries));

    // Adds 1 valid e-mail
    input.value = "valid@email.dom";
    fireEvent.keyUp(input, { key: "Enter", keyCode: 13 });
    await waitFor(() =>
      expect(
        document.querySelectorAll(".emails-input__root__pill").length
      ).toBe(2)
    );

    expect(myFn).toHaveBeenCalledTimes(1);
    expect(myFn).toHaveBeenCalledWith({
      event: "ADDITION",
      data: [{ isValid: true, value: "valid@email.dom" }]
    });
    myFn.mockClear();

    // Adds another valid e-mail
    input.value = "my@email.dom";
    fireEvent.keyUp(input, { key: ",", keyCode: 188 });
    await waitFor(() =>
      expect(
        document.querySelectorAll(".emails-input__root__pill").length
      ).toBe(3)
    );

    expect(myFn).toHaveBeenCalledTimes(1);
    expect(myFn).toHaveBeenCalledWith({
      event: "ADDITION",
      data: [{ isValid: true, value: "my@email.dom" }]
    });
    myFn.mockClear();

    // Removes one e-mail via backspace
    fireEvent.keyUp(input, { key: "Backspace", keyCode: 8 });
    await waitFor(() =>
      expect(
        document.querySelectorAll(".emails-input__root__pill").length
      ).toBe(2)
    );

    expect(myFn).toHaveBeenCalledTimes(1);
    expect(myFn).toHaveBeenCalledWith({
      event: "REMOVAL",
      data: [{ isValid: true, value: "my@email.dom" }]
    });
    myFn.mockClear();

    // Removes another e-mail via clicking in the button
    const pillRemoveButton = document.querySelector(".emails-input__root__pill:nth-child(2) button");
    fireEvent.click(pillRemoveButton);
    await waitFor(() =>
      expect(
        document.querySelectorAll(".emails-input__root__pill").length
      ).toBe(1)
    );

    expect(myFn).toHaveBeenCalledTimes(1);
    expect(myFn).toHaveBeenCalledWith({
      event: "REMOVAL",
      data: [{ isValid: true, value: "valid@email.dom" }]
    });
    myFn.mockClear();

    // Unsubscribes
    unsubscribeFn();

    input.value = "another-valid@email.miro.com";
    fireEvent.keyUp(input, { key: "Enter", keyCode: 13 });
    await waitFor(() =>
      expect(
        document.querySelectorAll(".emails-input__root__pill").length
      ).toBe(2)
    );

    expect(myFn).toHaveBeenCalledTimes(0);
  });

  it("parse values pasted into proper pills", async () => {
    window.EmailsInput(div);

    const input = await waitFor(() =>
      document.querySelector(".emails-input__root__input")
    );

    const pastedData = "multiple,items, in the same, entry, being pasted";

    /**
     * This needed due to a limitation in JSDom's (non-?)implementation of the ClipboardEvent
     * @see {@link https://stackoverflow.com/a/58452222}
     **/
    const pasteEventData = {
      clipboardData: {
        types: ["text/plain", "text/html"],
        getData: type => pastedData,
      }
    };
    const pasteEvent = createEvent.paste(input, pasteEventData);
    pasteEvent.clipboardData = pasteEventData.clipboardData;
    fireEvent(input, pasteEvent);

    await waitFor(() =>
      expect(
        document.querySelectorAll(".emails-input__root__pill").length
      ).toBe(5)
    );
    
    const pillsTexts = Array.from(document.querySelectorAll(".emails-input__root__pill")).map((node) => node.textContent);
    expect(pillsTexts).toMatchObject(['multiple', 'items', 'in the same', 'entry', 'being pasted'])
  });
});
