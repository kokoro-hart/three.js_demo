import './style.css';
import * as THREE from 'three';
import { WebGLRenderer } from 'three';
import * as dat from 'lil-gui';

// UIデバッグのインスタンス化
const gui = new dat.GUI();

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

//UIデバッグの実装
gui.addColor(material, 'color');
gui.add(material, 'metalness').min(0).max(1).step(0.001);
gui.add(material, 'roughness').min(0).max(1).step(0.001);

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
const meshes = [mesh1, mesh2, mesh3, mesh4];

// パーティクルの追加
// ジオメトリ
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 700;

const positionArray = new Float32Array(particlesCount * 3);

for (let i = 0; i < particlesCount * 3; i++) {
  positionArray[i] = (Math.random() - 0.5) * 10;
}

particlesGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positionArray, 3)
)

// マテリアル
const particlesMaterial = new THREE.PointsMaterial({
  size: 0.025,
  color: '#ffffff',
});

const particles = new THREE.Points(particlesGeometry, particlesMaterial)
scene.add(particles);


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

// ホイールを実装
let speed = 0;
let rotation = 0;
addEventListener('wheel', (event) => {
  speed += event.deltaY * 0.0002;
});

function rotate() {
  rotation += speed;
  speed *= 0.93;
  // ジオメトリの回転
  mesh1.position.x = 2 + 3.8 * Math.cos(rotation);
  mesh1.position.z = -3 + 3.8 * Math.sin(rotation);
  mesh2.position.x = 2 + 3.8 * Math.cos(rotation + Math.PI / 2);
  mesh2.position.z = -3 + 3.8 * Math.sin(rotation + Math.PI / 2);
  mesh3.position.x = 2 + 3.8 * Math.cos(rotation + Math.PI);
  mesh3.position.z = -3 + 3.8 * Math.sin(rotation + Math.PI);
  mesh4.position.x = 2 + 3.8 * Math.cos(rotation + 3 * (Math.PI / 2));
  mesh4.position.z = -3 + 3.8 * Math.sin(rotation + 3 * (Math.PI / 2));

  requestAnimationFrame(rotate);
}

rotate();

// カーソルの取得
const cursor = {};
cursor.x = 0;
cursor.y = 0;

addEventListener('mousemove', (event) => {
  cursor.x = event.clientX / sizes.width - 0.5;
  cursor.y = event.clientX / sizes.height - 0.5;
})

// animation
const clock = new THREE.Clock();

const animate = () => {
  renderer.render(scene, camera);
  let getDeltaTime = clock.getElapsedTime();

  // メッシュを回転させる
  for (const mesh of meshes) {
    mesh.rotation.x += 0.001 * getDeltaTime;
    mesh.rotation.y += 0.001 * getDeltaTime;
  }

  // カメラの制御
  camera.position.x += cursor.x * (getDeltaTime * 0.001);

  requestAnimationFrame(animate);
};

animate();
