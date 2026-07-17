(function () {
  document.addEventListener('click', (event) => {
    const button = event.target.closest('[data-speak]');
    if (!button) return;
    if (!('speechSynthesis' in window)) {
      alert('Audio is not supported in this browser.');
      return;
    }
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(button.dataset.speak || '');
    utterance.lang = button.dataset.lang || 'en-IN';
    utterance.rate = 0.86;
    speechSynthesis.speak(utterance);
  });
}());

