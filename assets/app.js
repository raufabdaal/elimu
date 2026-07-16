/* Soma — shared state + helpers */
(function () {
  const KEY = 'soma-p4p7-v1';

  const defaults = {
    classLevel: null,
    name: 'Amina',
    continue: {
      subject: 'Mathematics',
      topic: 'Fractions',
      subtopic: 'What is a fraction?',
      module: 1,
      progress: 42
    },
    practiceStreak: 3,
    modulesDone: 4
  };

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return { ...defaults };
      return { ...defaults, ...JSON.parse(raw) };
    } catch {
      return { ...defaults };
    }
  }

  function save(patch) {
    const next = { ...load(), ...patch };
    localStorage.setItem(KEY, JSON.stringify(next));
    return next;
  }

  function classLabel(level) {
    return level ? 'Primary ' + level.replace('p', 'P') : 'Choose class';
  }

  window.Soma = { load, save, classLabel, KEY };
})();
