import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { Clock } from 'three'
import matcap from './../static/textures/matcaps/4.png'
import vertexShader from './shaders/lines/vertex.glsl'
import fragmentShader from './shaders/lines/fragment.glsl'

//window sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

window.addEventListener('resize', () => {
  //update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  //update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  //update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

let mouse = new THREE.Vector2(0, 0)

window.addEventListener('mousemove', (event) => {
  mouse = {
    x: event.clientX / window.innerWidth - 0.5,
    y: -event.clientY / window.innerHeight + 0.5,
  }
})

const canvas = document.querySelector('canvas.webgl')
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.01, 5000)
camera.position.set(0, 0, 1)
scene.add(camera)
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true //плавность вращения камеры

const renderer = new THREE.WebGLRenderer({
  canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)) //ограничение кол-ва рендеров в завис-ти от плотности пикселей
renderer.setClearColor('#1f1f25', 1)
renderer.physicallyCorrectLights = true;
renderer.outputEncoding = THREE.sRGBEncoding;

const clock = new Clock()

const geometry = new THREE.PlaneBufferGeometry(3, 3, 128, 128)
const material = new THREE.ShaderMaterial({
  fragmentShader: fragmentShader,
  vertexShader: vertexShader,
  transparent: true,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
  side: THREE.DoubleSide,
  uniforms: {
    time: {value: 0},
    resolution: {value: new THREE.Vector4()},
    matcap: {value: new THREE.TextureLoader().load(matcap)},
    mouse: {value: new THREE.Vector2(0, 0)}
  },

})

const plane = new THREE.Mesh(geometry, material)
scene.add(plane)


const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  material.uniforms.time.value = elapsedTime
  material.uniforms.mouse.value = mouse

  //Update controls
  // controls.update() //если включён Damping для камеры необходимо её обновлять в каждом кадре

  renderer.render(scene, camera)
  window.requestAnimationFrame(tick)
}

tick()