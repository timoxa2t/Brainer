import * as THREE from 'three';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrangeStandartMaterial, setMaterial } from '../utils/materials';


export enum BrainType {
  Orange,
  Violet,
  Blue,
}

export class Brain {
  mesh: THREE.Mesh;
  row: number = 1;
  type: BrainType;
  initialDistanse: number;

  constructor(scene: GLTF, type: BrainType, distanse: number, row: number) {
    this.mesh = scene.scene.clone() as unknown as THREE.Mesh;
    this.mesh.castShadow = true;
    this.mesh.position.y = 2;
    this.type = type;
    this.initialDistanse = distanse;

    switch (type) {
      case BrainType.Orange:
        setMaterial(this.mesh, OrangeStandartMaterial);
        break;
      case BrainType.Violet:
        setMaterial(this.mesh, new THREE.MeshStandardMaterial({ color: 0x7f00ff }));
        break;
      case BrainType.Blue:
        setMaterial(this.mesh, new THREE.MeshStandardMaterial({ color: 0x0096ff }));
        break;
      default:
        setMaterial(this.mesh, OrangeStandartMaterial);
    }

    this.addDistanse(distanse);
    this.setRow(row);
  }

  addDistanse(z: number) {
    this.mesh.position.z -= z;
  }

  setRow(row: number) {
    this.mesh.position.x += row * 3 - 6;
    this.row = row;
  }
}