import * as THREE from 'three';
import { Point } from '../types/Point';

export class Star extends THREE.Mesh {
  constructor(
    position: Point,
  ) {
    super(
      new THREE.SphereGeometry(0.04),
      new THREE.MeshBasicMaterial( { color: 0xffffff } ),
    )
    
    const { x, y, z } = position;

    this.position.set(x, y, z);
  }
}