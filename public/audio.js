const status = document.querySelector("#audio-status");
const buttons = [...document.querySelectorAll("[data-audio]")];
const player = new Audio();
player.preload = "none";
let active;
function reset() {
  for (const button of buttons) button.setAttribute("aria-pressed", "false");
}
player.addEventListener("ended", () => {
  reset();
  status.textContent = "";
});
for (const button of buttons) {
  button.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      button.click();
    }
  });
  button.addEventListener("click", async () => {
    if (active === button && !player.paused) {
      player.pause();
      reset();
      status.textContent = "Paused.";
      return;
    }
    player.pause();
    reset();
    active = button;
    player.src = `/audio/${button.dataset.audio}.mp3`;
    status.textContent = "Loading pronunciation…";
    button.setAttribute("aria-pressed", "true");
    try {
      await player.play();
      status.textContent = "Playing French pronunciation.";
    } catch {
      if (active !== button) return;
      reset();
      status.textContent = "Pronunciation is not available yet.";
    }
  });
}
