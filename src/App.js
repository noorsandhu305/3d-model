import React, { Suspense, useRef, useState } from "react"
import { Canvas,extend, useFrame,useThree } from "react-three-fiber"
import { ContactShadows, Environment, OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { useGLTF } from "drei"
import { HexColorPicker } from "react-colorful"
import { proxy, useProxy } from "valtio"
 
extend({OrbitControls})
// Using a Valtio state model to bridge reactivity between
// the canvas and the dom, both can write to it and/or react to it.
const state = proxy({
  current: null,
  items: {
    laces: "#ffffff",
    mesh: "#ffffff",
    caps: "#ffffff",
    inner: "#ffffff",
    sole: "#ffffff",
    stripes: "#ffffff",
    band: "#ffffff",
    patch: "#ffffff",
  },
})

  const Controls = () =>{
    const controls = useRef()
    const {camera,gl} = useThree()

    useFrame(() => {
      controls.current.update()
    })
    return(
      <orbitControls ref={controls} args={[camera,gl.domElement]}></orbitControls>
    )
  }

  const Shoe = () => {
  
  const snap = useProxy(state)
  // Drei's useGLTF hook sets up draco automatically, that's how it differs from useLoader(GLTFLoader, url)
  // { nodes, materials } are extras that come from useLoader, these do not exist in threejs/GLTFLoader
  // nodes is a named collection of meshes, materials a named collection of materials
  const { nodes, materials } = useGLTF("shoe-draco.glb")
  

  // Animate model
  

  // Cursor showing current color
  const [hovered, set] = useState(null)
  

  // Using the GLTFJSX output here to wire in app-state and hook up events
  return (
    <group>
      <mesh geometry={nodes.shoe.geometry} material={materials.laces} material-color={snap.items.laces} />
      <mesh geometry={nodes.shoe_1.geometry} material={materials.mesh} material-color={snap.items.mesh} />
      <mesh geometry={nodes.shoe_2.geometry} material={materials.caps} material-color={snap.items.caps} />
      <mesh geometry={nodes.shoe_3.geometry} material={materials.inner} material-color={snap.items.inner} />
      <mesh geometry={nodes.shoe_4.geometry} material={materials.sole} material-color={snap.items.sole} />
      <mesh geometry={nodes.shoe_5.geometry} material={materials.stripes} material-color={snap.items.stripes} />
      <mesh geometry={nodes.shoe_6.geometry} material={materials.band} material-color={snap.items.band} />
      <mesh geometry={nodes.shoe_7.geometry} material={materials.patch} material-color={snap.items.patch} />
    </group>
    
  )
}

function Picker() {
  const snap = useProxy(state)
  return (
    <div style={{ display: snap.current ? "block" : "none" }}>
      <HexColorPicker className="picker" color={snap.items[snap.current]} onChange={(color) => (state.items[snap.current] = color)} />
      <h1>{snap.current}</h1>
    </div>
  )
}

export default function App() {
  return (
    <>
      <Canvas concurrent pixelRatio={[1, 1.5]} camera={{ position: [0, 0, 2.75] }}>
        <ambientLight intensity={0.3} />
        <spotLight intensity={0.3} angle={0.1} penumbra={1} position={[5, 25, 20]} />
        <Suspense fallback={null}>
          <Shoe />
          <Controls />
        </Suspense>
      </Canvas>
      
    </>
  )
}
