import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader';
import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass';
import { init, gl, scene, camera, controls } from './init/init';

import vertexShader from './shaders/vertex.js';
import fragmentShader from './shaders/fragment.js';
import { GUI } from './init/lil-gui.module.min';
import './style.css';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';

init();

let gui = new GUI();

const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.5, 0.3, 1000, 100),
  new THREE.ShaderMaterial({
     vertexShader,
     fragmentShader,
    side: THREE.DoubleSide,
    wireframe: false,
    uniforms: {
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2() },
      uDisplace: { value: 2 },
      uSpread: { value: 1.2 },
      uNoise: { value: 16 },
    },
  })
);

scene.add(torus);

const torus2 = new THREE.Mesh(
  new THREE.TorusGeometry(2, 0.3, 1000, 100),
  new THREE.ShaderMaterial({
     vertexShader,
     fragmentShader,
    side: THREE.DoubleSide,
    wireframe: false,
    uniforms: {
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2() },
      uDisplace: { value: 2 },
      uSpread: { value: 1.2 },
      uNoise: { value: 16 },
    },
  })
);

scene.add(torus2);

let composer = new EffectComposer(gl);
composer.addPass(new RenderPass(scene, camera));

gui.add(torus.material.uniforms.uDisplace, 'value', 0, 2, 0.1).name('displacemnt');
gui.add(torus.material.uniforms.uSpread, 'value', 0, 2, 0.1).name('spread');
gui.add(torus.material.uniforms.uNoise, 'value', 10, 25, 0.1).name('noise');
gui.add(torus2.material.uniforms.uDisplace, 'value', 0, 2, 0.1).name('displacemnt');
gui.add(torus2.material.uniforms.uSpread, 'value', 0, 2, 0.1).name('spread');
gui.add(torus2.material.uniforms.uNoise, 'value', 10, 25, 0.1).name('noise');

const unrealBloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  1.5,
  0.0001,
  0.01
);
composer.addPass(unrealBloomPass);



const clock = new THREE.Clock();

let animate = () => {
  const elapsedTime = clock.getElapsedTime();
  torus.material.uniforms.uTime.value = elapsedTime;
  //torus.rotation.y = Math.sin(elapsedTime) / 4 + elapsedTime / 20 + 5;
  //torus.rotation.x = Math.sin(elapsedTime) / 4 + elapsedTime / 20 - 5;
  torus.rotation.x = elapsedTime *2 + elapsedTime / 20 - 5;

  torus2.material.uniforms.uTime.value = elapsedTime;
  torus2.rotation.y = elapsedTime *2 + elapsedTime / 20 - 5;
  //torus2.rotation.z = elapsedTime + elapsedTime / 20 + 5;
  composer.render();
  controls.update();
  requestAnimationFrame(animate);
};
animate();
