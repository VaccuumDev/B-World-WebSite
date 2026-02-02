import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
/*import '../public/img/planet.jpg';
import '../public/img/atmos.png';*/
import reportWebVitals from './reportWebVitals';
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { animate, stagger } from 'animejs';

const root = ReactDOM.createRoot(document.getElementById('root'));


///////////////////////////////////////////////
///////////////////////////////////////////////
///////////////////////////////////////////////

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));

const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  1.5,
  0.4,
  0.8
);
bloomPass.strength = 0.3;
composer.addPass(bloomPass);

const outputPass = new OutputPass();
composer.addPass(outputPass);

const texture = new THREE.TextureLoader().load(`${process.env.PUBLIC_URL}/img/planet.jpg`);
const atmosphereTexture = new THREE.TextureLoader().load(`${process.env.PUBLIC_URL}/img/atmos.png`);
atmosphereTexture.premultiplyAlpha = true;

const planetGeometry = new THREE.OctahedronGeometry(30, 8);
const planetMaterial = new THREE.MeshPhongMaterial({
  map: texture,
  side: THREE.DoubleSide,
});
const planet = new THREE.Mesh(planetGeometry, planetMaterial);
planet.receiveShadow = true;

scene.add(planet);

const atmosphereGeometry = new THREE.OctahedronGeometry(31, 8);
const atmosphereMaterial = new THREE.MeshPhongMaterial({
  map: atmosphereTexture,
  side: THREE.DoubleSide,
  transparent: true,
  opacity: 0.9,
});
const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);

const atmosphereGlowMaterial = new THREE.MeshPhongMaterial({
  color: 0x00f5fd,
  transparent: true,
  opacity: 0.2
});
const atmosphereGlow = new THREE.Mesh(
  new THREE.OctahedronGeometry(32, 8),
  atmosphereGlowMaterial
);

scene.add(atmosphere);
scene.add(atmosphereGlow);

const ambientLightColor = 0xffffff;
const ambientLightIntensity = 3;
const ambientLight = new THREE.DirectionalLight(ambientLightColor, ambientLightIntensity);
scene.add(ambientLight);

camera.position.z = 70;

///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////


function renderFrame() {
  composer.render(scene, camera);
}

function startAnimation() {

  animate(planet.rotation, {
    y: { from: 0, to: 2 * Math.PI },
    duration: 120000,
    loop: true,
  });

  animate(atmosphere.rotation, {
    y: { from: 0, to: 2 * Math.PI },
    duration: 15000,
    loop: true,
    ease: 'linear',
  });

  animate('.panel', {
    delay: stagger([200, 500]),
    translateX: { from: stagger([-60, 60]) },
    // scale: stagger([1, 0.1]),
    opacity: [0, 1],
  });
  animate('.card', {
    delay: 800,
    scale: 1,
    duration: 1000,
    ease: "inOut(4)"
  });
  animate(ambientLight.position, {
    x: [-10, 10, -10],
    z: [10, -10, 10, -10],
    loop: true,
    duration: 125000,
    ease: 'none'
  });

}

function downloadTransition() {

  animate(
    '#main-page',
    {
      opacity: 0
    }
  );

  animate(camera.position, {
    x: -34,
    //y: [0],
    z: 30,
    duration: 3000,
    easing: 'inOutCubic',
  });

  animate(camera.rotation, {
    /*x: [0],
    y: [0],*/
    z: 0.5 * Math.PI,
    duration: 3000,
    easing: 'easeInOutSine',

    //onComplete: downloadPageActions
  });


  animate(
    '#download-page',
    {
      opacity: { form: 0, to: 1 }
    }
  );
}

function Resize()
{
  camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    composer.setSize(window.innerWidth, window.innerHeight);
    renderer.setSize(window.innerWidth, window.innerHeight);
}
renderer.setAnimationLoop(renderFrame);

window.addEventListener(
  'resize',
  Resize,
  false
);

////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////

root.render(
  <App />
);
reportWebVitals();


export { downloadTransition, startAnimation };
