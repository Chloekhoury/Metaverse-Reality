
AFRAME.registerPrimitive('a-ocean', {
  defaultComponents: {
    ocean: {},
    rotation: { x: -90, y: 0, z: 0 }
  },
  mappings: {
    width: 'ocean.width',
    depth: 'ocean.depth',
    density: 'ocean.density',
    amplitude: 'ocean.amplitude',
    'amplitude-variance': 'ocean.amplitudeVariance',
    speed: 'ocean.speed',
    'speed-variance': 'ocean.speedVariance',
    color: 'ocean.color',
    opacity: 'ocean.opacity'
  }
});

AFRAME.registerComponent('ocean', {
  schema: {
    width: { default: 10, min: 0 },
    depth: { default: 10, min: 0 },
    density: { default: 10 },
    amplitude: { default: 0.1 },
    amplitudeVariance: { default: 0.3 },
    speed: { default: 1 },
    speedVariance: { default: 2 },
    color: { type: 'color', default: '#7AD2F7' },
    opacity: { default: 0.8 }
  },

  play() {
    const { el, data } = this;
    const { width, depth, density, amplitude, amplitudeVariance, speed, speedVariance, color, opacity } = data;

    const geometry = new THREE.PlaneGeometry(width, depth, density, density);
    geometry.mergeVertices();

    this.waves = geometry.vertices.map(v => ({
      z: v.z,
      ang: Math.random() * Math.PI * 2,
      amp: amplitude + Math.random() * amplitudeVariance,
      speed: (speed + Math.random() * speedVariance) / 1000
    }));

    if (!el.components.material) {
      this.material = new THREE.MeshPhongMaterial({
        color,
        transparent: opacity < 1,
        opacity,
        flatShading: true
      });
    } else {
      this.material = el.components.material.material;
    }

    this.mesh = new THREE.Mesh(geometry, this.material);
    el.setObject3D('mesh', this.mesh);
  },

  remove() {
    this.el.removeObject3D('mesh');
  },

  tick(time, deltaTime) {
    if (!deltaTime) return;

    const verts = this.mesh.geometry.vertices;

    verts.forEach((v, i) => {
      const wave = this.waves[i];
      v.z = wave.z + Math.sin(wave.ang) * wave.amp;
      wave.ang += wave.speed * deltaTime;
    });

    this.mesh.geometry.verticesNeedUpdate = true;
  }
});

const API_KEY = "o1ZGeyZD9RMRTNZH9aAQmg==XC14EsL1gV2s2Gqi";
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("whales-container");
  const infoPanel = document.getElementById("info-panel");
  const infoContent = document.getElementById("info-content");

  fetch("https://api.api-ninjas.com/v1/animals?name=fish", {
    headers: { "X-Api-Key": API_KEY }
  })
    .then(res => {
      if(!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return res.json();
    })
    .then(data => {
      // Use fewer boxes, say 5 max (or less if fewer fish)
      const fishCount = Math.min(data.length, 5);

      for (let i = 0; i < fishCount; i++) {
        const fish = data[i];
        const box = document.createElement("a-box");
        box.setAttribute("width", "1");
        box.setAttribute("height", "0.5");
        box.setAttribute("depth", "2");
        box.setAttribute("color", "#3399ff");
        box.setAttribute("opacity", "0.85");
        box.classList.add("clickable");

        // Wider spread: increase position range (x,y,z)
        const x = (Math.random() - 0.5) * 25;  // from -12.5 to 12.5
        const y = 0.5;       // from 1 to 3
        const z = -3 - Math.random() * 20;     // from -3 to -23
        box.setAttribute("position", `${x} ${y} ${z}`);

        box.dataset.fish = JSON.stringify({
          name: fish.name,
          taxonomy: fish.taxonomy,
          habitat: fish.characteristics.habitat,
          diet: fish.characteristics.diet
        });

        box.addEventListener("mouseenter", () => {
          document.body.style.cursor = "pointer";
          box.setAttribute("color", "#66aaff");
        });
        box.addEventListener("mouseleave", () => {
          document.body.style.cursor = "default";
          box.setAttribute("color", "#3399ff");
        });

        box.addEventListener("click", () => {
          const info = JSON.parse(box.dataset.fish);
          infoContent.innerHTML = `
            <strong>${info.name}</strong><br><br>
            <strong>Habitat:</strong> ${info.habitat || 'N/A'}<br>
            <strong>Diet:</strong> ${info.diet || 'N/A'}<br>
            <em>(Taxonomy: ${info.taxonomy?.genus}, ${info.taxonomy?.family})</em>
          `;
          infoPanel.style.display = "block";
        });

        container.appendChild(box);
      }
    })
    .catch(err => {
      console.error("API Ninja error:", err);
      infoContent.textContent = "Failed to load fish data.";
      infoPanel.style.display = "block";
    });
});

   window.addEventListener('click', () => {
    const music = document.getElementById('background-music');
    music.play().catch(e => console.log("Autoplay blocked:", e));
  }, { once: true });