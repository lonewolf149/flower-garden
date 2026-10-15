(() => {
  "use strict";
  const intro = document.getElementById("intro");
  const typedLine = document.getElementById("typed-line");
  const secondLine = document.getElementById("second-line");
  const enterButton = document.getElementById("enter-button");
  const skipButton = document.getElementById("skip-intro");
  const app = document.getElementById("garden-app");
  const flowerField = document.getElementById("flower-field");
  const garden = document.getElementById("garden");
  const toast = document.getElementById("toast");
  const palettes = [
    ["#ff168f", "#ffbfe0", "rgba(224,0,110,.75)"],
    ["#ff2060", "#fff7c4", "rgba(255,32,96,.75)"],
    ["#cc00cc", "#9b4dff", "rgba(204,0,204,.75)"],
    ["#ff4e50", "#f9d423", "rgba(255,78,80,.75)"],
    ["#7c3aed", "#f472b6", "rgba(124,58,237,.75)"],
    ["#dc2626", "#f59e0b", "rgba(220,38,38,.78)"],
    ["#0d9488", "#f0abfc", "rgba(13,148,136,.72)"],
    ["#2563eb", "#fec489", "rgba(37,99,235,.72)"],
    ["#d97706", "#be123c", "rgba(217,119,6,.75)"]
  ];
  let soundOn = false;
  let audioContext = null;
  let toastTimer;
  const firstMessage = "I know you love flowers... 🌸 💖";
  const secondMessage = "So I made a garden for you... 🌹 ✨";

  function typeText(element, text, delay, done) {
    let i = 0;
    element.textContent = "";
    const tick = () => {
      if (i < text.length) {
        element.textContent += text.charAt(i++);
        setTimeout(tick, delay);
      } else if (done) done();
    };
    tick();
  }

  function finishIntro() {
    intro.classList.add("leaving");
    intro.style.transition = "opacity .8s ease";
    intro.style.opacity = "0";
    window.setTimeout(() => {
      intro.hidden = true;
      app.hidden = false;
      createSky();
      createFireflies();
      createFlowers(20);
      requestAnimationFrame(() => app.classList.add("ready"));
    }, 650);
  }

  function startIntro() {
    typeText(typedLine, firstMessage, 58, () => {
      setTimeout(() => typeText(secondLine, secondMessage, 55, () => {
        enterButton.hidden = false;
        enterButton.animate([{ opacity: 0, transform: "translateY(8px)" }, { opacity: 1, transform: "translateY(0)" }], { duration: 650, fill: "both" });
      }), 450);
    });
  }
  startIntro();
  enterButton.addEventListener("click", finishIntro);
  skipButton.addEventListener("click", finishIntro);

  function createSky() {
    const stars = document.getElementById("stars");
    for (let i = 0; i < 90; i++) {
      const star = document.createElement("span");
      star.className = "star";
      star.style.left = Math.random() * 100 + "%";
      star.style.top = Math.random() * 65 + "%";
      star.style.setProperty("--duration", (2 + Math.random() * 4) + "s");
      star.style.animationDelay = (-Math.random() * 4) + "s";
      stars.appendChild(star);
    }
  }

  function createFireflies() {
    const field = document.getElementById("fireflies");
    for (let i = 0; i < 22; i++) {
      const fly = document.createElement("span");
      fly.className = "firefly";
      fly.style.left = Math.random() * 100 + "%";
      fly.style.top = (20 + Math.random() * 65) + "%";
      fly.style.setProperty("--duration", (5 + Math.random() * 9) + "s");
      fly.style.setProperty("--dx", (Math.random() * 100 - 50) + "px");
      fly.style.setProperty("--dy", (Math.random() * 100 - 70) + "px");
      fly.style.animationDelay = (-Math.random() * 8) + "s";
      field.appendChild(fly);
    }
  }

  function makeFlower(index, total) {
    const flower = document.createElement("button");
    flower.type = "button";
    flower.className = "flower";
    flower.setAttribute("aria-label", "Flower " + (index + 1) + ", click to change its colors");
    const left = total === 1 ? 50 : 6 + (index / Math.max(total - 1, 1)) * 88;
    const size = 48 + Math.random() * 48;
    flower.style.setProperty("--left", left + "%");
    flower.style.setProperty("--bottom", (4 + Math.random() * 24) + "%");
    flower.style.setProperty("--size", size + "px");
    flower.style.setProperty("--sway", (3 + Math.random() * 3) + "s");
    flower.style.zIndex = String(Math.round(size));
    flower.style.border = "0";
    flower.style.padding = "0";
    flower.style.background = "transparent";
    flower.style.appearance = "none";
    flower.style.outlineOffset = "5px";

    const stem = document.createElement("span");
    stem.className = "stem";
    const leaf1 = document.createElement("span"); leaf1.className = "leaf left";
    const leaf2 = document.createElement("span"); leaf2.className = "leaf right";
    const bloom = document.createElement("span"); bloom.className = "bloom";
    for (let p = 0; p < 8; p++) {
      const petal = document.createElement("span"); petal.className = "petal"; bloom.appendChild(petal);
    }
    const center = document.createElement("span"); center.className = "flower-center"; bloom.appendChild(center);
    flower.append(stem, leaf1, leaf2, bloom);
    flower.dataset.palette = String(Math.floor(Math.random() * palettes.length));
    applyPalette(flower);
    flower.addEventListener("click", (event) => {
      event.stopPropagation();
      flower.dataset.palette = String((Number(flower.dataset.palette) + 1) % palettes.length);
      applyPalette(flower);
      sparkles(flower);
      playChime();
      showToast("A new color for a little moment of joy ✨");
    });
    return flower;
  }

  function applyPalette(flower) {
    const palette = palettes[Number(flower.dataset.palette) || 0];
    flower.style.setProperty("--petal1", palette[0]);
    flower.style.setProperty("--petal2", palette[1]);
    flower.style.setProperty("--glow", palette[2]);
  }

  function createFlowers(count) {
    flowerField.innerHTML = "";
    for (let i = 0; i < count; i++) flowerField.appendChild(makeFlower(i, count));
  }

  function plantRose() {
    const count = flowerField.children.length;
    if (count >= 32) {
      showToast("Your garden is full of flowers already 🌸");
      return;
    }
    const flower = makeFlower(count, count + 1);
    flower.style.setProperty("--left", (8 + Math.random() * 84) + "%");
    flower.style.setProperty("--bottom", (5 + Math.random() * 28) + "%");
    flower.style.setProperty("--size", (50 + Math.random() * 40) + "px");
    flower.style.opacity = "0";
    flowerField.appendChild(flower);
    flower.animate([{ opacity: 0, transform: "translateX(-50%) scale(.2)" }, { opacity: 1, transform: "translateX(-50%) scale(1)" }], { duration: 700, easing: "cubic-bezier(.2,.8,.2,1)", fill: "forwards" });
    sparkles(flower);
    playChime();
    showToast("A new rose has joined your garden 🌹");
  }

  function sparkles(flower) {
    const rect = flower.getBoundingClientRect();
    for (let i = 0; i < 9; i++) {
      const spark = document.createElement("span");
      spark.textContent = Math.random() > .5 ? "✦" : "•";
      spark.style.position = "fixed";
      spark.style.left = (rect.left + rect.width / 2) + "px";
      spark.style.top = (rect.top + rect.height * .18) + "px";
      spark.style.color = i % 2 ? "#ffd178" : "#ff9cbd";
      spark.style.pointerEvents = "none";
      spark.style.zIndex = "50";
      spark.style.fontSize = (8 + Math.random() * 12) + "px";
      document.body.appendChild(spark);
      const dx = (Math.random() - .5) * 100, dy = -25 - Math.random() * 80;
      const animation = spark.animate([{ transform: "translate(0,0) scale(.5)", opacity: 1 }, { transform: `translate(${dx}px,${dy}px) scale(1.2)`, opacity: 0 }], { duration: 650 + Math.random() * 500, easing: "ease-out" });
      animation.onfinish = () => spark.remove();
    }
  }

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
  }

  function playChime() {
    if (!soundOn) return;
    try {
      audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
      if (audioContext.state === "suspended") audioContext.resume();
      const now = audioContext.currentTime;
      [523.25, 659.25, 783.99].forEach((frequency, index) => {
        const oscillator = audioContext.createOscillator();
        const gain = audioContext.createGain();
        oscillator.type = index === 1 ? "triangle" : "sine";
        oscillator.frequency.value = frequency;
        gain.gain.setValueAtTime(.0001, now + index * .08);
        gain.gain.exponentialRampToValueAtTime(.055, now + index * .08 + .025);
        gain.gain.exponentialRampToValueAtTime(.0001, now + index * .08 + .55);
        oscillator.connect(gain); gain.connect(audioContext.destination);
        oscillator.start(now + index * .08); oscillator.stop(now + index * .08 + .6);
      });
    } catch (_) { /* Audio is optional and browser-dependent. */ }
  }

  document.getElementById("plant-button").addEventListener("click", plantRose);
  document.getElementById("sound-button").addEventListener("click", (event) => {
    soundOn = !soundOn;
    event.currentTarget.textContent = soundOn ? "♫ Sound: On" : "♫ Sound: Off";
    event.currentTarget.setAttribute("aria-pressed", String(soundOn));
    if (soundOn) playChime();
    showToast(soundOn ? "A little melody is now on ♫" : "Garden sounds turned off");
  });

  const dialog = document.getElementById("message-dialog");
  document.getElementById("message-button").addEventListener("click", () => dialog.showModal());
  document.getElementById("close-dialog").addEventListener("click", () => dialog.close());
  document.getElementById("dialog-ok").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
  garden.addEventListener("click", (event) => {
    if (event.target.closest(".flower")) return;
    const spark = document.createElement("span");
    spark.textContent = "✦";
    spark.style.position = "fixed";
    spark.style.left = event.clientX + "px";
    spark.style.top = event.clientY + "px";
    spark.style.color = "#ffd178";
    spark.style.pointerEvents = "none";
    spark.style.zIndex = "40";
    document.body.appendChild(spark);
    spark.animate([{ transform: "translateY(0) scale(.6)", opacity: 1 }, { transform: "translateY(-45px) scale(1.5)", opacity: 0 }], { duration: 800 }).onfinish = () => spark.remove();
    playChime();
  });
})(); 
