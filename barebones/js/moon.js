(function () {
  'use strict';

  var container = document.getElementById('container');

  var normVertShader = document.getElementById('norm-vert-shader');
  var normFragShader = document.getElementById('norm-frag-shader');

  var scene;
  var renderer;
  var camera;
  var moon;

  const phase_offset = 735000; //seconds to match current moon phase.
  const phase_period = 2551392;

  var light = {
    distance: 1000000,
    position: new THREE.Vector3(0, 0, 0),
    orbit: function (center, time) {
      const phase = ((time * 0.001 + phase_offset) % phase_period) / phase_period;
      const period = 2 * Math.PI * phase;
      this.position.x = (center.x + this.distance) * Math.sin(-period);
      this.position.z = (center.z + this.distance) * Math.cos(period);
    }
  };

  function createMoon(textureMap, normalMap) {
    var radius = 100;
    var xSegments = 60;
    var ySegments = 60;
    var geo = new THREE.SphereGeometry(radius, xSegments, ySegments);

    var mat = new THREE.ShaderMaterial({
      uniforms: {
        lightPosition: {
          type: 'v3',
          value: light.position
        },
        textureMap: {
          type: 't',
          value: textureMap
        },
        normalMap: {
          type: 't',
          value: normalMap
        },
        uvScale: {
          type: 'v2',
          value: new THREE.Vector2(1.0, 1.0)
        }
      },
      vertexShader: normVertShader.innerText,
      fragmentShader: normFragShader.innerText
    });

    var mesh = new THREE.Mesh(geo, mat);
    mesh.geometry.computeTangents();
    mesh.position.set(0, 0, 0);
    mesh.rotation.set(0, 0.7625 * (2 * Math.PI), 0);
    scene.add(mesh);
    return mesh;
  }

  function init() {
    renderer = new THREE.WebGLRenderer({
      antialias: true,
      preserveDrawingBuffer: true
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    var fov = 14.75;
    var aspect = window.innerWidth / window.innerHeight;
    var near = 1;
    var far = 65536;
    
    camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, 0, 800);

    scene = new THREE.Scene();
    scene.add(camera);
  }

  function animate() {
    requestAnimationFrame(animate);
    light.orbit(moon.position, new Date().getTime());
    renderer.render(scene, camera);
  }

  function onWindowResize() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  }

  function loadAssets(options) {
    var paths = options.paths;
    var onComplete = options.onComplete;
    var total = 0;
    var completed = 0;
    var textures = { };
    var key;

    for (key in paths)
      if (paths.hasOwnProperty(key)) total++;

    for (key in paths) {
      if (paths.hasOwnProperty(key)) {
        var path = paths[key];
        if (typeof path === 'string'){
          let loader = new THREE.TextureLoader();
          loader.setCrossOrigin('');
          loader.load(
            path,
            getOnLoad(path, key),
            undefined
          );
        }
      }
    }

    function getOnLoad(path, name) {
      return function (tex) {
        textures[name] = tex;
        completed++;
        if (typeof onProgress === 'function') {
          onProgress({
            path: path,
            name: name,
            total: total,
            completed: completed
          });
        }
        if (completed === total && typeof onComplete === 'function') {
          onComplete({
            textures: textures
          });
        }
      };
    }
  }

  /** When the window loads, we immediately begin loading assets. While the
      assets loading Three.JS is initialized. When all assets finish loading
      they can be used to create objects in the scene and animation begins */

  /** to address the error: [2791:2791:1125/135241.544617:ERROR:gles2_cmd_decoder.cc(9553)] [.WebGL-0x1400e63f00]RENDER WARNING: texture bound to texture unit 1 is not renderable. It might be non-power-of-2 or have incompatible texture filtering (maybe)?
      https://webglfundamentals.org/webgl/lessons/webgl-3d-textures.html
  */

  function onWindowLoaded() {
      loadAssets({
          paths: {
              moon: './media/moon_8k_color_brim16.jpg',
              moonNormal: './media/moon_8k_normal.jpg',
          },
          onComplete: function (evt) {
              var textures = evt.textures;
              moon = createMoon(textures.moon, textures.moonNormal);
              animate();
          }
      });

      init();
  }

  /** Window load event kicks off execution */
  window.addEventListener('load', onWindowLoaded, false);
  window.addEventListener('resize', onWindowResize, false);
})();
