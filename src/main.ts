
import * as THREE from 'three';
import './style.css';
import { Star } from './models/Star';
import { checkColision, getRandomPosition, randomEnum } from './utils/helpers';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Player } from './models/Player';
import { Brain, BrainType } from './models/Brain';

let isPlaying = false;
let touchstartX = 0
let touchendX = 0

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

camera.position.x = 6;
camera.position.y = 6;
camera.position.z = 6;

camera.rotation.y = .3;
camera.rotation.x -= .3;

const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// const controls = new OrbitControls( camera, renderer.domElement );
// controls.update()

const light = new THREE.PointLight(0xffffff, 1);
light.castShadow = true;
light.position.z = 5;
light.position.x = 2;
light.position.y = 20;
scene.add(light);

addTitle();
const pointerMixer = addPointer();

const loader = new GLTFLoader();

let player: Player;
let brains: Brain[] = [];

loader.load( '../src/threejs_tz/Stickman.glb', ( gltf ) =>
{
  player = new Player(gltf);

  scene.add(player.mesh)
});

loader.load( '../src/threejs_tz/TrackFloor.glb', function ( gltf )
{
  const floor = gltf.scene;
  floor.position.z += 20;
  floor.receiveShadow = true;

  floor.scale.set(1, 1, 100);
  scene.add(floor)
} );

loader.load( '../src/threejs_tz/Brain.glb', function ( gltf )
{
  for (let i = 0; i < 50; i++) {
    let distanse = 50 + Math.round(Math.random() * 50) * 3;
    let row = Math.ceil(Math.random() * 3);

    while (brains.find(brain => brain 
      && brain.initialDistanse === distanse 
      && brain.row === row
    )) {
      distanse = 50 + Math.round(Math.random() * 50) * 3;
      row = Math.ceil(Math.random() * 3);
    }

    brains.push(new Brain(
      gltf,
      randomEnum(BrainType),
      distanse,
      row,
    ));
  }

  brains.forEach(brain => {
    scene.add(brain.mesh)
  });
});  

const stars = Array(100).fill(null).map(() => new Star(getRandomPosition(
  { x: -20, y: 3, z: -200},
  { x: 20, y: 20, z: 0},
)))

stars.forEach(star => {
  scene.add(star);
})

const clock = new THREE.Clock();

function animate() {
	requestAnimationFrame( animate );
  const delta = clock.getDelta();
  if (isPlaying) {
    play(delta);
  } else {
    pointerMixer.update(delta);
  }
  
	renderer.render( scene, camera );
}


animate();

function play(delta: number) {

  stars.map(star => {
    if (star.position.z < camera.position.z) {
      return;
    }

    star.position.z -= 200;
  })

  if (brains) {
    brains.map(brain => {
      if (player) {
        const collide = checkColision(
          player.mesh.position,
          brain.mesh.position,
        );

        if (collide) {
          player.eat(brain);
          brain.mesh.position.z -= 150;
        }
      }

      if (brain.mesh.position.z > camera.position.z) {
        brain.mesh.position.z -= 150;
      }
    })
  }

  if (player) {
    if (player.score < 0) {
      player.die();
    } else {
      player.run();
    }
    

    if (player.animation !== undefined) {
      player.animation.update(delta);
    }

    adjustCameraTo(player.mesh);
    adjustLightTo(player.mesh);
  }
}

function adjustCameraTo(object: THREE.Group) {
  camera.position.z = object.position.z + 10;

  camera.position.x = object.position.x;
  camera.position.y = object.position.y + 6;
  camera.rotation.y = 0;

  // if (camera.position.x > object.position.x + 0.1) {
  //   camera.position.x -= 0.2;
  // } else if (camera.position.x > object.position.x - 0.1) {
  //   camera.position.x += 0.2;
  // }

  // if (camera.rotation.y > 0.01) {
  //   camera.rotation.y -= 0.01;
  // } else if (camera.rotation.y < -0.01) {
  //   camera.rotation.y += 0.01;
  // } 
}

function adjustLightTo(object: THREE.Group) {
  light.position.z = object.position.z + 5;
  light.position.x = object.position.x + 2;
  light.position.y = object.position.y + 20;
}

function addTitle() {
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load('../src/threejs_tz/Tutorial_SWIPE TO START.png');

  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 1),
    new THREE.MeshBasicMaterial({ map: texture, transparent: true })
  );
  
  mesh.position.set(3, 5, -5);
  
  mesh.rotation.x = camera.rotation.x;
  mesh.rotation.y = camera.rotation.y;
  
  scene.add(mesh);
}

function addPointer() {
  const times = [0, 1, 3, 4];
  const start = [4, 3, -2]
  const values = [
    ...start,
    7, 2.7, -3,
    1, 3.3, -1,
    ...start,
  ];

  const keyframes: THREE.KeyframeTrack[] = [
    new THREE.VectorKeyframeTrack(".position", times, values)
  ];

  const duration = 4;
  const clip = new THREE.AnimationClip('swing', duration, keyframes);


  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load('../src/threejs_tz/Tutorial_Hand.png');

  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1),
    new THREE.MeshBasicMaterial({ map: texture, transparent: true })
  );
  
  mesh.position.set(3, 3, -2);
  
  mesh.rotation.x = camera.rotation.x;
  mesh.rotation.y = camera.rotation.y;

  const mixer = new THREE.AnimationMixer(mesh);
  const action = mixer.clipAction(clip);
  action.play();
  
  scene.add(mesh);

  return mixer;
}
    
function checkDirection() {
  if (!isPlaying) {
    isPlaying = true;
    return
  }

  if (touchendX < touchstartX) {
    console.log('swiped left!')
    player.goLeft()
  }
  else if (touchendX > touchstartX) {
    console.log('swiped right!')
    player.goRight()
  }
}

document.addEventListener("click", function(e) {
  touchstartX = e.screenX
});

document.addEventListener("mouseup", function(e) {
  touchendX = e.screenX
  checkDirection()
});

document.addEventListener('touchstart', e => {
  touchstartX = e.changedTouches[0].screenX
})

document.addEventListener('touchend', e => {
  touchendX = e.changedTouches[0].screenX
  checkDirection()
})

document.addEventListener("keydown", function(e) {
  switch (e.code) {
    case 'KeyA': 
      player.goLeft()
      break;
    case 'KeyD': 
      player.goRight()
      break;
  }
});

