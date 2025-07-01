(() => {
  const VERTEX = `
    precision highp float;
    #define PI 3.1415926535897932384626433832795
    uniform mat4 modelViewMatrix;
    uniform mat4 projectionMatrix;
    uniform float time;
    uniform float size;

    attribute vec3 position;
    attribute vec3 direction;
    attribute float offset;
    varying vec3 vUv;

    void main() {
        float sawTime = mod(time * offset, PI);
        float sineTime = (sawTime * abs(sin(time * offset)));
        vec3 timeVec = vec3(sineTime, sawTime, sineTime);
        vUv = ((normalize(position) * 0.2) + (timeVec * direction)) * size;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(vUv, 1.0);
    }
  `;

  const FRAGMENT = `
    precision highp float;
    uniform float time;
    uniform float yMax;
    varying vec3 vUv;

    float random(vec2 ab) {
        float f = (cos(dot(ab ,vec2(21.9898,78.233))) * 43758.5453);
        return fract(f);
    }

    void main() {
        float alpha = (yMax - vUv.y) * 0.8;
        float red = 1.0;
        float green = 0.3 + (0.7 * mix(((yMax - vUv.y) * 0.5) + 0.5, 0.5 - abs(max(vUv.x, vUv.y)), 0.5));
        float blueMin = abs(max(max(vUv.x, vUv.z), (vUv.y / yMax)));
        float blue = (1.0 / (blueMin + 0.5)) - 1.0;
        gl_FragColor = vec4(red, green, blue, alpha);
    }
  `;

  const createSparks = (count) => {
    const positions = [];
    const directions = [];
    const offsets = [];

    for (let i = 0; i < count; i++) {
      const direction = [
        Math.random() - 0.5,
        Math.random() + 0.3,
        Math.random() - 0.5
      ];
      const offset = Math.random() * Math.PI;

      for (let j = 0; j < 3; j++) {
        positions.push(
          Math.random() - 0.5,
          Math.random() - 0.2,
          Math.random() - 0.5
        );
        directions.push(...direction);
        offsets.push(offset);
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('direction', new THREE.Float32BufferAttribute(directions, 3));
    geometry.setAttribute('offset', new THREE.Float32BufferAttribute(offsets, 1));

    return geometry;
  };

  AFRAME.registerComponent('fire', {
    schema: {
      particles: { type: 'number', default: 1 },
      size: { type: 'number', default: 0.5 }
    },

    init() {
      const { size } = this.data;

      this.material = new THREE.RawShaderMaterial({
        uniforms: {
          time: { value: 0.0 },
          size: { value: size },
          yMax: { value: 0.3 + Math.PI * size }
        },
        vertexShader: VERTEX,
        fragmentShader: FRAGMENT,
        side: THREE.DoubleSide,
        transparent: true
      });

      this.object3D = new THREE.Object3D();
      this.el.setObject3D('mesh', this.object3D);
    },

    update() {
      const { particles, size } = this.data;

      if (this.mesh) {
        this.object3D.remove(this.mesh);
      }

      this.material.uniforms.size.value = size;
      const geometry = createSparks(particles);
      this.mesh = new THREE.Mesh(geometry, this.material);
      this.object3D.add(this.mesh);
    },

    remove() {
      const current = this.el.getObject3D('mesh');
      if (current) {
        this.object3D.remove(current);
      }
    },

    tick(time) {
      this.material.uniforms.time.value = time * 0.0005;
    }
  });
})();

// --- 1. Constants ---
const API_KEY = 'rFZq53s9E9XdkGhWB5C7L7Ajc4DshtflGFSooslh';
const START_DATE = '2025-07-01';
const END_DATE = '2025-07-02';

// --- 2. InfoPanel class ---
class InfoPanel {
  constructor(elementId) {
    this.el = document.getElementById(elementId);
    this.content = this.el.querySelector('#info-content'); // ✅ This targets the inner <div>
  }
show({ name, diameter, speed, date }) {
  this.el.style.opacity = 0;
  this.el.style.display = 'block';

  // Smooth fade-in
  setTimeout(() => {
    this.el.style.transition = 'opacity 0.4s ease-in-out';
    this.el.style.opacity = 1;
  }, 50);

  this.el.innerHTML = `
    <button onclick="document.getElementById('info-panel').style.display='none'" style="
      float: right;
      background: transparent;
      border: none;
      color: #aaa;
      font-size: 16px;
      cursor: pointer;
      margin: -5px -5px 0 0;">✕</button>
    <div id="info-content">
      <strong>Asteroid:</strong> ${name} <br />
      <strong>Diameter:</strong> ${diameter} meters <br />
      <strong>Speed:</strong> ${speed} km/h <br />
      <strong>Close approach:</strong> ${date}
    </div>
  `;
}

  clear() {
    this.el.style.display = 'none';
    this.content.textContent = '';
  }
}



// --- 3. Asteroid class ---
class Asteroid {
  constructor(data, closeApproachDate, parentEntity, infoPanel) {
    this.data = data;
    this.date = closeApproachDate;
    this.parentEntity = parentEntity;
    this.infoPanel = infoPanel;
    this.mesh = null;
  }

  getAverageDiameter() {
    const min = this.data.estimated_diameter.meters.estimated_diameter_min;
    const max = this.data.estimated_diameter.meters.estimated_diameter_max;
    return ((min + max) / 2).toFixed(2);
  }

  getSpeed() {
    return this.data.close_approach_data[0]?.relative_velocity.kilometers_per_hour || 'N/A';
  }

  randomPosition(radius = 100) {
    return {
      x: (Math.random() - 0.5) * radius * 2,
      y: (Math.random() - 0.5) * radius * 2,
      z: (Math.random() - 0.5) * radius * 2,
    };
  }

  createMesh() {
    const pos = this.randomPosition();
    const sphere = document.createElement('a-sphere');
    sphere.setAttribute('position', `${pos.x} ${pos.y} ${pos.z}`);

    const diameter = this.getAverageDiameter();
    const radius = Math.min(Math.max(diameter / 20, 0.2), 2.5); // scaled up for visibility

    sphere.setAttribute('radius', radius);
    sphere.setAttribute('material', 'color: #ff6600; emissive: #ff3300; emissiveIntensity: 0.8');
    sphere.setAttribute('class', 'clickable');
    sphere.setAttribute('shadow', true);

    sphere.addEventListener('click', () => {
      this.infoPanel.show({
        name: this.data.name,
        diameter: diameter,
        speed: this.getSpeed(),
        date: this.date,
      });
      sphere.addEventListener('mouseenter', () => {
  sphere.setAttribute('color', '#ffaa00');
});
sphere.addEventListener('mouseleave', () => {
  sphere.setAttribute('color', '#ff6600');
});

    });

    this.mesh = sphere;
    this.parentEntity.appendChild(sphere);
  }
}

// --- 4. AsteroidApp class ---
class AsteroidApp {
  constructor(apiKey, startDate, endDate, asteroidsEntityId, infoPanelId) {
    this.apiKey = apiKey;
    this.startDate = startDate;
    this.endDate = endDate;
    this.asteroidsEntity = document.getElementById(asteroidsEntityId);
    this.infoPanel = new InfoPanel(infoPanelId);
  }

  async fetchAsteroids() {
    this.infoPanel.clear();
    try {
      const response = await fetch(
        `https://api.nasa.gov/neo/rest/v1/feed?start_date=${this.startDate}&end_date=${this.endDate}&api_key=${this.apiKey}`
      );
      const data = await response.json();

      Object.entries(data.near_earth_objects).forEach(([date, asteroids]) => {
        asteroids.forEach((asteroidData) => {
  const asteroid = new Asteroid(asteroidData, date, this.asteroidsEntity, this.infoPanel);
  asteroid.createMesh(); // ✅ Correct
});

      });
    } catch (error) {
      this.infoPanel.el.style.display = 'block';
      this.infoPanel.el.textContent = `Error fetching data: ${error.message}`;
    }
  }
}

// --- ✅ 5. Initialize app after page loads ---
document.addEventListener('DOMContentLoaded', () => {
  const app = new AsteroidApp(API_KEY, START_DATE, END_DATE, 'asteroids', 'info-panel');
  app.fetchAsteroids();
});


   window.addEventListener('click', () => {
    const music = document.getElementById('background-music');
    music.play().catch(e => console.log("Autoplay blocked:", e));
  }, { once: true });