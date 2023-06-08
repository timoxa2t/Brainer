import { Point } from "../types/Point";
import * as THREE from 'three';

let textureInit: THREE.Texture;
let canvasInit: HTMLCanvasElement;
let canvasContextInit: CanvasRenderingContext2D | null;

export function getRandomPosition(
  from: Point,
  to: Point
): Point {
  const x = getRandomNumberInRange(from.x, to.x);
  const y = getRandomNumberInRange(from.y, to.y);
  const z = getRandomNumberInRange(from.z, to.z);
  
  return {x, y, z};
}

function getRandomNumberInRange(
  from: number,
  to: number
): number {
  return from + Math.random() * (to - from);
}

function getTexture() {

  // if (textureInit) {
  //   return textureInit;
  // }

  textureInit = new THREE.Texture();
  textureInit.minFilter = THREE.LinearFilter;
  textureInit.generateMipmaps = false;
  textureInit.needsUpdate = true;

  textureInit.center = new THREE.Vector2(0.5, 0.5);
  textureInit.rotation = Math.PI;
  textureInit.flipY = false;

  return textureInit
}

function getCanvas() {

  if (canvasInit) {
    return canvasInit;
  }

  canvasInit = document.createElement( 'canvas' );
  canvasInit.height = 234;

  return canvasInit
}

function getCTX(canvas: HTMLCanvasElement) {

  // if (canvasContextInit) {
  //   return canvasContextInit;
  // }

  canvasContextInit = canvas.getContext( '2d' );
  const font = '124px grobold';

  if (canvasContextInit === null) {
    return null;
  }

  canvasContextInit.font = font;
  canvas.width = Math.ceil( 200 );
  canvasContextInit.textAlign = 'center';
  canvasContextInit.font = font;
  canvasContextInit.strokeStyle = '#222';
  canvasContextInit.lineWidth = 12;
  canvasContextInit.lineJoin = 'miter';
  canvasContextInit.miterLimit = 3;

  canvasContextInit.fillStyle = 'white';
  return canvasContextInit
}

export function getTextTexture( text: string ) {

  const canvas = getCanvas();
  const ctx = getCTX(canvas);

  if (ctx === null) {
    return
  }

  ctx.strokeText( text, 100, 220 );
  ctx.fillText( text, 100, 220 );

  const texture = getTexture();

  texture.image = ctx.getImageData( 0, 0, canvas.width, canvas.height)

  return { map: texture };
}

export function randomEnum<T>(anEnum: T): T[keyof T] {
  const enumValues = Object.keys(anEnum)
    .map(n => Number.parseInt(n))
    .filter(n => !Number.isNaN(n)) as unknown as T[keyof T][]
  const randomIndex = Math.floor(Math.random() * enumValues.length)
  const randomEnumValue = enumValues[randomIndex]
  return randomEnumValue;
}

export function checkColision(
  pointOne: Point,
  pointTwo: Point,
): boolean {

  const xDif = Math.abs(pointOne.x - pointTwo.x);
  const zDif = Math.abs(pointOne.z - pointTwo.z);

  const distance = Math.sqrt(xDif ** 2 + zDif ** 2);

  return distance < 1.5;
}