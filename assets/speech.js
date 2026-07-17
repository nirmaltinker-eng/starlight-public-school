(function () {
  let availableVoices = [];
  const refreshVoices = () => { availableVoices = speechSynthesis.getVoices(); };
  if ('speechSynthesis' in window) {
    refreshVoices();
    speechSynthesis.addEventListener?.('voiceschanged', refreshVoices);
  }
  const bestVoice = (lang) => {
    const code = lang.toLowerCase();
    const sameLanguage = availableVoices.filter((voice) => voice.lang.toLowerCase().startsWith(code.split('-')[0]));
    const preferredNames = code.startsWith('hi')
      ? ['swara', 'madhur', 'google हिन्दी', 'google hindi', 'lekha', 'heera']
      : ['neerja', 'prabhat', 'ravi', 'heera', 'google uk english', 'google us english'];
    return preferredNames.map((name) => sameLanguage.find((voice) => voice.name.toLowerCase().includes(name))).find(Boolean)
      || sameLanguage.find((voice) => voice.lang.toLowerCase() === code)
      || sameLanguage[0];
  };
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
    const voice = bestVoice(utterance.lang);
    if (voice) utterance.voice = voice;
    utterance.rate = utterance.lang.startsWith('hi') ? 0.68 : 0.78;
    utterance.pitch = 1;
    utterance.volume = 1;
    speechSynthesis.speak(utterance);
  });
}());
