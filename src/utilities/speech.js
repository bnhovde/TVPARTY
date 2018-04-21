const synth = window.speechSynthesis || false;

const play = function play(message) {
  if ('speechSynthesis' in window) {
    const msg = new SpeechSynthesisUtterance(message);
    synth.speak(msg);
  }
};

const stop = function stop() {
  if ('speechSynthesis' in window) {
    synth.cancel();
  }
};

export { play, stop };

// const msg = new SpeechSynthesisUtterance("Oh shit! It's goggen.");
// const msg = new SpeechSynthesisUtterance("Goggen takes 340 of Nilses points.");
