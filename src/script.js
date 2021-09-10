import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import fragment from './shaders/shapingFunctions01/fragment.glsl'
import vertex from './shaders/shapingFunctions01/vertex.glsl'
const canvas = document.querySelector('.webgl')

class NewScene{
    constructor(){
        this._Init()
    }
    
    _Init(){
        this.scene = new THREE.Scene()
        this.InitShaderPlane()
        this.InitCamera()
        this.InitLights()
        this.InitRenderer()
        this.InitControls()
        this.InitMouseMove()
        this.InitTime()
        this.Update()
        window.addEventListener('resize', () => {
            this.Resize()
        })     
    }

    

    InitShaderPlane(){
        this.geometry = new THREE.PlaneBufferGeometry(2, 2)
        this.material = new THREE.ShaderMaterial({
            side: THREE.DoubleSide,
            fragmentShader: fragment,
            vertexShader: vertex,
            uniforms: {
                u_resolution: { value: new THREE.Vector2()},
                u_time: { value: 1.0 },
                u_mouse: { value: new THREE.Vector2()}
            }
        })
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.scene.add(this.mesh)
    }
    
    InitRenderer(){
        this.renderer = new THREE.WebGLRenderer({
            canvas,
            antialias: true,
        })
        this.renderer.shadowMap.enabled = true
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        this.renderer.render(this.scene, this.camera)
    }

    InitCamera(){
        this.camera = new THREE.Camera()
        this.camera.position.z = 1
        this.scene.add(this.camera)
    }

    InitLights(){
        this.ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
        this.scene.add(this.ambientLight)
    }

    InitControls(){
        this.controls = new OrbitControls(this.camera, canvas)
        this.controls.enableDamping = true
        this.controls.update()
    }

    InitMouseMove(){
        document.onmousemove = (e) =>{
              this.material.uniforms.u_mouse.value.x = e.pageX
              this.material.uniforms.u_mouse.value.y = e.pageY
        }
    }

    Resize(){
        this.camera.aspect = window.innerWidth / window.innerHeight
        //this.camera.updateProjectionMatrix()
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        this.material.uniforms.u_resolution.value.x = canvas.width;
        this.material.uniforms.u_resolution.value.y = canvas.height;
    }

    InitTime(){
        this.clock = new THREE.Clock()
    }

    Update(){
        requestAnimationFrame(() => {     
            this.renderer.render(this.scene, this.camera)
            this.controls.update()
            this.Update()
            this.material.uniforms.u_time.value += this.clock.getDelta()
        })  
    }
    
}

let _APP = null

window.addEventListener('DOMContentLoaded', () => {
    _APP = new NewScene()
    
})