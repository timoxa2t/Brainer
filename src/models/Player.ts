import * as THREE from 'three';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrangeStandartMaterial, setMaterial } from '../utils/materials';
import { getTextTexture } from '../utils/helpers';
import { Brain, BrainType } from './Brain';


export class Player {
  mesh: THREE.Mesh;
  scoreBoard: THREE.Mesh;
  private animations;
  animation: THREE.AnimationMixer;
  score = 0;
  row: number = 1;
  xDestination: number = 0;
  speed = 0.2;
  

  constructor(scene: GLTF) {
    this.mesh = scene.scene as unknown as THREE.Mesh;
    setMaterial(this.mesh, OrangeStandartMaterial);
    this.mesh.castShadow = true;
    this.mesh.rotation.y = Math.PI;

    this.scoreBoard = scene.scene.children[0].children[0] as unknown as THREE.Mesh;

    this.animations = scene.animations;
    this.animation = new THREE.AnimationMixer(this.mesh);

    this.updateScore(0);
    this.setRow(2);
  }

  run() {
    this.mesh.position.z -= this.speed
    if (this.mesh.position.x > this.xDestination) {
      this.mesh.position.x -= 0.3
    } else if (this.mesh.position.x < this.xDestination) {
      this.mesh.position.x += 0.3
    }

    if (Math.abs(this.mesh.position.x - this.xDestination) <= 0.3) {
      this.mesh.position.x = this.xDestination;
    }
    
    this.animation.clipAction(this.animations[4]).play();
  }

  die() {
    this.animation.clipAction(this.animations[4]).stop();
    const animation = this.animation.clipAction(this.animations[2]);
    animation.setLoop(THREE.LoopOnce, 1);
    animation.clampWhenFinished = true;
    animation.play();
  }

  eat(brain: Brain) {
    if (brain.type === BrainType.Orange) {
      this.updateScore(this.score + 1)
    } else {
      this.updateScore(this.score - 1)
    }
  }

  updateScore(newScore: number) {
    this.score = newScore;

    this.speed = 0.2 + Math.floor(this.score / 10) / 100

    const texture = getTextTexture(this.score.toString());

    setMaterial(this.scoreBoard, new THREE.MeshStandardMaterial({
      ...texture,
      transparent: true,
    }));
  }

  goLeft() {
    if (this.row > 1) {
      this.setRow(this.row - 1)
    }
  }

  goRight() {
    if (this.row < 3) {
      this.setRow(this.row + 1)
    }
  }

  setRow(row: number) {
    this.row = row;
    this.xDestination = row * 3 - 6;
  }
}
