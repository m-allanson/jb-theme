/**
 * @format
 */

import {
  isValid,
  toOutcode,
  OUTCODE_REGEX,
} from "https://cdn.jsdelivr.net/npm/postcode@5.0.0/esm/index.min.js";

class PostcodeCheck extends HTMLElement {
  constructor() {
    super();

    this.inputEl = this.querySelector("#jb-postcode-check");
    this.successEl = this.querySelector("#jb-postcode-check-success");
    this.failEl = this.querySelector("#jb-postcode-check-fail");
    this.postcodes = [
      "SE4",
      "SE5",
      "SE6",
      "SE13",
      "SE14",
      "SE15",
      "SE21",
      "SE22",
      "SE23",
      "SE24",
    ];
    this.hasStorage = this.checkStorage();

    const inputEl = this.inputEl;

    inputEl.addEventListener("input", this.handleChange.bind(this));

    // grab postcode if it's already in localstorage
    if (this.hasStorage) {
      inputEl.value = localStorage.getItem("jb-postcode");
    }
    if (inputEl.value !== "") {
      inputEl.dispatchEvent(new Event("input"));
    }

    this.classList.remove("hidden");
  }

  // onChange(event) {}

  getSectionsToRender() {
    return [
      {
        id: "main-postcode-check",
        section: document.getElementById("main-postcode-check").dataset.id,
        selector: ".js-contents",
      },
      {
        id: "cart-icon-bubble",
        section: "cart-icon-bubble",
        selector: ".shopify-section",
      },
      {
        id: "cart-live-region-text",
        section: "cart-live-region-text",
        selector: ".shopify-section",
      },
      {
        id: "main-cart-footer",
        section: document.getElementById("main-cart-footer").dataset.id,
        selector: ".js-contents",
      },
    ];
  }

  updateQuantity(line, quantity, name) {}

  updateLiveRegions(line, itemCount) {}

  checkStorage() {
    try {
      localStorage.setItem("jones", "jones");
      localStorage.removeItem("jones");
      return true;
    } catch (e) {
      return false;
    }
  }

  matchOutcode(outcode) {
    return this.postcodes.includes(outcode);
  }

  checkPostcode(input) {
    input = input.trim();

    console.log(input);

    // Match partial postcodes as early as possible
    if (OUTCODE_REGEX.test(input)) {
      if (this.matchOutcode(input)) {
        return { match: input };
      } else {
        return {
          match: false,
          message: `Sorry, we don't deliver to ${input} yet.`,
        };
      }
    }

    // Exit for all failure cases
    if (input.length < 6) {
      return { match: false, message: "Please type your full postcode" };
    }

    if (!isValid(input)) {
      return {
        match: false,
        message: `Couldn't find ${input.toUpperCase()}. Is your postcode correct?`,
      };
    }

    var outcode = toOutcode(input);
    if (!this.matchOutcode(outcode)) {
      return {
        match: false,
        message: `Sorry, we don't deliver to ${outcode} yet.`,
      };
    }

    return { match: outcode };
  }

  handleChange(event) {
    event.stopPropagation();
    let value = event.target.value.toUpperCase();
    event.target.value = value;
    var result = this.checkPostcode(value);

    const { failEl, successEl } = this;

    if (result.match) {
      successEl.classList.remove("hidden");
      failEl.classList.add("hidden");
      successEl.innerHTML = `Yes! We deliver to ${value}`;
      if (this.hasStorage) localStorage.setItem("jb-postcode", value);
    } else {
      successEl.classList.add("hidden");
      failEl.classList.remove("hidden");
      failEl.innerHTML = result.message;
      if (this.hasStorage) localStorage.removeItem("jb-postcode");
    }
  }
}

customElements.define("postcode-check", PostcodeCheck);
