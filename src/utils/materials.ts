import * as THREE from 'three';

export const OrangeStandartMaterial
  = new THREE.MeshStandardMaterial({ color: 0xffa500 });

export function setMaterial(mesh: THREE.Mesh, material: THREE.Material) {
  mesh.traverse((node) => {
    if (node instanceof THREE.Mesh) {
      node.material = material;
    }
  })
}