/**
 * All paste juttons.
 * @type {HTMLButtonElement[] | []}
 */
const pastebtn = document.querySelectorAll("button.paste");

/** @type HTMLInputElement | null */
const fileurlElem = document.getElementById("fileurl");

/** @type HTMLInputElement | null */
const termElem = document.getElementById("term");

/** @type HTMLInputElement | null */
const resultElem = document.getElementById("result");

function getResult() {
  /* Get other two inputs' data */
  const fileurl = fileurlElem.value.trim();
  const term = termElem.value.trim();
  const result = `${fileurl}#${term}`;
  resultElem.value = result;
  return result;
}

function resetInputs() {
  resultElem.value = "";
  termElem.value = "";
  termElem.focus();
}

/* Paste into respective text input */
pastebtn.forEach((btn) => {
  btn.addEventListener("click", async () => {
    /* Defined in HTML, each button has unique */
    const textinputID = btn.getAttribute("aria-controls");

    /** @type HTMLInputElement | null */
    const textinputElem = document.getElementById(textinputID);

    /* Get clipboard */
    const clipboard = await navigator.clipboard.readText();

    /* Paste into input */
    textinputElem.value = clipboard;
  });
});

document.querySelectorAll("button.copy").forEach((btn) => {
  btn.addEventListener("mouseup", () => {
    copyToClipboard();
  });
});

/* Make focusing input select all */

/** @type HTMLInputElement[] | []*/
const inputElems = document.querySelectorAll("input[type='text']");
inputElems.forEach((inputElem) => {
  inputElem.addEventListener("focusin", () => inputElem.select());
});

/* Save File URL to localstorage. Want to
   do this because it's not likely to change much */

/* Should be keyup so that we get the new value */
fileurlElem.addEventListener("keyup", () => {
  /* Don't want infinite calls */
  if (window.localStorage.getItem("fileurl") === fileurlElem.value) return;

  window.localStorage.setItem("fileurl", fileurlElem.value);
  console.log(fileurlElem.value);
});

/* Preserve fileurl across refresh */
fileurlElem.value = window.localStorage.getItem("fileurl");

/* Autofocus Glossary Term */
termElem.focus();

/* Focus output on glossary form submit */

/** @type HTMLFormElement | null */
const formElem = document.querySelector("form");

async function copyToClipboard() {
  const result = getResult();

  /* Give result to user */
  resultElem.focus();
  await navigator.clipboard.writeText(result);
}

/* Main logic here */
formElem.addEventListener("submit", async (e) => {
  e.preventDefault();
  await copyToClipboard();
});

/* Live showing output */
termElem.addEventListener("keyup", () => {
  getResult();
});

/* Alt-R for reset without refresh */
document.addEventListener("keydown", (e) => {
  if ((e.altKey || e.metaKey) && e.key === "r") {
    resetInputs();
  }
});

/* R on resultElem to reset */
resultElem.addEventListener("keyup", (e) => {
  if (e.key === "r") {
    resetInputs();
  }
});
