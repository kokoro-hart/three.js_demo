import './style.css';
import * as THREE from 'three';
import { WebGLRenderer } from 'three';

console.log(THREE);

//canvasの取得
const canvasElement = document.querySelector('.webgl');

// シーン
const scene = new THREE.Scene();

//サイズ設定
const sizes = {
  width: innerWidth,
  height: innerHeight,
};

// カメラ
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100);
camera.position.z = 6;
scene.add(camera);

// レンダラー
const renderer = new WebGLRenderer({
  canvas: canvasElement,
  alpha: true, // 透明にするか
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(devicePixelRatio);

// オブジェクトを作成

// マテリアルを作成
const material = new THREE.MeshPhysicalMaterial({
  color: '3c94d7',
  metalness: 0.86,
  roughness: 0.37,
  flatShading: false,
});

//ジオメトリ
const mesh1 = new THREE.Mesh(new THREE.TorusGeometry(1, 0.4, 16, 60), material);
const mesh2 = new THREE.Mesh(new THREE.OctahedronGeometry(), material);
const mesh3 = new THREE.Mesh(new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16), material);
const mesh4 = new THREE.Mesh(new THREE.IcosahedronGeometry(), material);

// 回転
mesh1.position.set(2, 0, 0);
mesh2.position.set(-1, 0, 0);
mesh3.position.set(2, 0, -6);
mesh4.position.set(5, 0, 3);

scene.add(mesh1, mesh2, mesh3, mesh4);

// ライトを追加
const directionalLight = new THREE.DirectionalLight('#ffffff', 4);
directionalLight.position.set(0.5, 1, 0);
scene.add(directionalLight);

// リサイズ処理
addEventListener('resize', () => {
  // サイズのアップデート
  sizes.width = innerWidth;
  sizes.height = innerHeight;

  // カメラのアップデート
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  //レンダラーのアップデート
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(devicePixelRatio);
});

// animation
const animate = () => {
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
};

animate();
