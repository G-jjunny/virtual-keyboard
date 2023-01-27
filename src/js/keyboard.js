export class keyboard {
  #switchEl;
  #fontSelectEl;
  #containerEl;
  #keyboardEl;
  #inputGroupEl;
  #inputEl;
  #keyPress = false;
  #MouseDown = false;

  constructor() {
    this.#assignElement();
    this.#addEvent();
  }

  #assignElement() {
    this.#containerEl = document.getElementById("container");
    this.#switchEl = this.#containerEl.querySelector("#switch");
    this.#fontSelectEl = this.#containerEl.querySelector("#font");
    this.#keyboardEl = this.#containerEl.querySelector("#keyboard");
    this.#inputGroupEl = this.#containerEl.querySelector("#input-group");
    this.#inputEl = this.#inputGroupEl.querySelector("#input");
  }
  #addEvent() {
    this.#switchEl.addEventListener("change", this.#onChangeTheme);
    this.#fontSelectEl.addEventListener("change", this.#onChangeFont);
    document.addEventListener("keydown", this.#onKeyDown.bind(this)); //키보드 눌렀을 때 active생성 및 한글입력불가 toggle
    document.addEventListener("keyup", this.#onKeyUp.bind(this)); // 키보느 눌렀다 뗐을 때 active제거
    this.#inputEl.addEventListener("input", this.#onInput); // 한글 입력시 input에 반영 안 됨
    this.#keyboardEl.addEventListener(
      "mousedown",
      this.#onMouseDown.bind(this)
    );
    document.addEventListener("mouseup", this.#onMouseUp.bind(this));
  }

  #onMouseUp(event) {
    if (this.#keyPress) return;
    this.#MouseDown = false;
    const keyEl = event.target.closest("div.key");
    const isActive = !!keyEl?.classList.contains("active");
    const val = keyEl?.dataset.val;
    if (isActive && !!val && val !== "Space" && val !== "Backspace") {
      this.#inputEl.value += val;
    }
    if (isActive && val === "Space") {
      this.#inputEl.value += " ";
    }
    if (isActive && val === "Backspace") {
      this.#inputEl.value = this.#inputEl.value.slice(0, -1);
    }
    this.#keyboardEl.querySelector(".active")?.classList.remove("active");
  }
  #onMouseDown(event) {
    if (this.#keyPress) return;
    this.#MouseDown = true;
    event.target.closest("div.key")?.classList.add("active");
  }

  // input에 한글 입력시 빈 문자 반환
  #onInput(event) {
    event.target.value = event.target.value.replace(/[ㄱ-ㅎㅏ-ㅣ가-힣]/, "");
  }

  //키보드 눌렀을 때 active생성 및 한글입력불가 toggle
  #onKeyDown(event) {
    if (this.#MouseDown) return;
    this.#keyPress = true;
    this.#inputGroupEl.classList.toggle(
      "error",
      /[ㄱ-ㅎㅏ-ㅣ가-힣]/.test(event.key)
    );

    this.#keyboardEl
      .querySelector(`[data-code=${event.code}]`)
      ?.classList.add("active");
  }

  // 키보드 눌렀다 뗐을 때 active제거
  #onKeyUp(event) {
    if (this.#MouseDown) return;
    this.#keyPress = false;
    this.#keyboardEl
      .querySelector(`[data-code=${event.code}]`)
      ?.classList.remove("active");
  }

  // 다크모드 테마
  #onChangeTheme(event) {
    document.documentElement.setAttribute(
      "theme",
      event.target.checked ? "dark-mode" : ""
    );
    // console.log(event.target.checked);
  }

  // font 변경
  #onChangeFont(event) {
    document.body.style.fontFamily = event.target.value;
    // console.log(event.target.value);
  }
}
