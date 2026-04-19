import { useRef, useMemo, useCallback } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

// ---- Perlin noise helpers (inline, no external lib) ----
const PERLIN_PERM: number[] = []
const PERLIN_P: number[] = new Array(512)

function seedPerlin(seed: number) {
  const perm: number[] = []
  for (let i = 0; i < 256; i++) perm[i] = i
  let s = seed
  for (let i = 255; i > 0; i--) {
    s = (s * 16807 + 0) % 2147483647
    const j = s % (i + 1)
    ;[perm[i], perm[j]] = [perm[j], perm[i]]
  }
  PERLIN_PERM.length = 0
  PERLIN_PERM.push(...perm)
  for (let i = 0; i < 512; i++) PERLIN_P[i] = PERLIN_PERM[i & 255]
}
seedPerlin(42)

// ---- Vertex Shader ----
const vertexShader = `
uniform float time;
uniform float terrain_speed;
uniform float terrain_height;
uniform vec2 noise_difference;
uniform float wave_size;
uniform float wave_speed;
uniform float wave_height;
uniform float ripple_speed;
uniform float ripple_size;
uniform float ripple_range;
uniform float ripple_height;
uniform vec2 mouse;
uniform float ripple_offset;
uniform vec3 ripple_color;

varying vec3 v_color;
varying vec3 v_pos;

float perlin3d(vec3 p) {
  // Use a simpler approximation for shader
  return sin(p.x * 2.0) * sin(p.y * 2.0) * sin(p.z * 2.0) * 0.5
       + sin(p.x * 4.3 + p.y * 3.1) * 0.25
       + sin(p.y * 5.7 + p.z * 2.3) * 0.25;
}

void main() {
  vec3 pos = position;

  // 1. Infinite scrolling terrain UV
  vec2 terrain_uv = vec2(pos.x, pos.y - time * terrain_speed);

  // 2. Two layers of Perlin waves
  float wave1 = perlin3d(vec3(terrain_uv * wave_size, time * wave_speed)) * wave_height;
  float wave2 = perlin3d(vec3(terrain_uv * (wave_size * 0.5) + noise_difference, time * wave_speed)) * (wave_height * 0.5);

  // 3. Accumulate terrain height
  pos.z += wave1 + wave2;

  // 4. Mouse click ripple
  vec2 ripple_uv = vec2(pos.x - mouse.x, pos.y - mouse.y);
  float ripple_distance = length(ripple_uv);

  // 5. Ring mask with two smoothsteps
  float ripple_mask1 = smoothstep(ripple_distance - ripple_range, ripple_distance, time * ripple_speed - ripple_offset);
  float ripple_mask2 = 1.0 - smoothstep(ripple_distance, ripple_distance + ripple_range, time * ripple_speed - ripple_offset);

  // 6. Multiply to get ring shape
  float ripple = ripple_mask1 * ripple_mask2;

  // 7. Apply ripple to Z and color
  pos.z += ripple * ripple_height;
  v_color = ripple * ripple_color;

  // 8. Low-frequency breathing
  pos.z += perlin3d(vec3(terrain_uv * 0.05, time * 0.1)) * terrain_height;

  // 9. Perspective projection
  vec4 modelPosition = modelMatrix * vec4(pos, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  gl_Position = projectionMatrix * viewPosition;
  v_pos = pos;
}
`

// ---- Fragment Shader ----
const fragmentShader = `
varying vec3 v_color;
varying vec3 v_pos;

void main() {
  vec3 color = vec3(0.07, 0.07, 0.1);
  color += v_color;
  gl_FragColor = vec4(color, 1.0);
}
`

// ---- Terrain Mesh Component ----
function TerrainMesh() {
  const meshRef = useRef<THREE.Mesh>(null)
  const materialRef = useRef<THREE.ShaderMaterial>(null)
  const { camera, gl } = useThree()
  const mouseWorld = useRef(new THREE.Vector2(60, 60))
  const clockRef = useRef(new THREE.Clock())
  const ripples = useRef<Array<{ offset: number; x: number; y: number }>>([])

  const uniforms = useMemo(
    () => ({
      time: { value: 0.0 },
      terrain_speed: { value: 0.15 },
      terrain_height: { value: 3.5 },
      noise_difference: { value: new THREE.Vector2(200.0, 200.0) },
      wave_size: { value: 0.8 },
      wave_speed: { value: 0.08 },
      wave_height: { value: 2.5 },
      ripple_speed: { value: 6.5 },
      ripple_size: { value: 5.0 },
      ripple_range: { value: 1.5 },
      ripple_height: { value: 5.0 },
      mouse: { value: new THREE.Vector2(60, 60) },
      ripple_offset: { value: 0.0 },
      ripple_color: { value: new THREE.Vector3(0.28, 0.85, 0.98) },
    }),
    []
  )

  const handleClick = useCallback(
    (e: MouseEvent) => {
      const rect = gl.domElement.getBoundingClientRect()
      const ndcX = ((e.clientX - rect.left) / rect.width) * 2 - 1
      const ndcY = -((e.clientY - rect.top) / rect.height) * 2 + 1

      const raycaster = new THREE.Raycaster()
      raycaster.setFromCamera(new THREE.Vector2(ndcX, ndcY), camera)

      if (meshRef.current) {
        const intersects = raycaster.intersectObject(meshRef.current)
        if (intersects.length > 0) {
          const pt = intersects[0].point
          const t = clockRef.current.getElapsedTime()
          ripples.current.push({ offset: t, x: pt.x, y: pt.y })
          // Keep max 5 ripples
          if (ripples.current.length > 5) {
            ripples.current.shift()
          }
        }
      }
    },
    [camera, gl]
  )

  // Track mouse for hover light effect
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      const rect = gl.domElement.getBoundingClientRect()
      const ndcX = ((e.clientX - rect.left) / rect.width) * 2 - 1
      const ndcY = -((e.clientY - rect.top) / rect.height) * 2 + 1

      const raycaster = new THREE.Raycaster()
      raycaster.setFromCamera(new THREE.Vector2(ndcX, ndcY), camera)

      if (meshRef.current) {
        const intersects = raycaster.intersectObject(meshRef.current)
        if (intersects.length > 0) {
          const pt = intersects[0].point
          mouseWorld.current.set(pt.x, pt.y)
        }
      }
    },
    [camera, gl]
  )

  useFrame(() => {
    if (!materialRef.current) return
    const t = clockRef.current.getElapsedTime()
    materialRef.current.uniforms.time.value = t
    materialRef.current.uniforms.mouse.value.set(mouseWorld.current.x, mouseWorld.current.y)

    // Process ripples - use the latest one
    if (ripples.current.length > 0) {
      const latest = ripples.current[ripples.current.length - 1]
      materialRef.current.uniforms.ripple_offset.value = latest.offset
      materialRef.current.uniforms.mouse.value.set(latest.x, latest.y)
    }
  })

  useMemo(() => {
    gl.domElement.addEventListener('click', handleClick)
    gl.domElement.addEventListener('mousemove', handleMouseMove)
    return () => {
      gl.domElement.removeEventListener('click', handleClick)
      gl.domElement.removeEventListener('mousemove', handleMouseMove)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gl, handleClick, handleMouseMove])

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 4, 0, 0]} position={[0, 0, 0]}>
      <planeGeometry args={[120, 120, 64, 64]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        wireframe={true}
        transparent={true}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

// ---- Lights ----
function SceneLights() {
  const light1Ref = useRef<THREE.PointLight>(null)
  const light2Ref = useRef<THREE.PointLight>(null)
  const { gl } = useThree()

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (light1Ref.current) {
      light1Ref.current.position.x = Math.sin(t * 0.3) * 30
      light1Ref.current.position.y = Math.cos(t * 0.3) * 30
    }
    if (light2Ref.current) {
      light2Ref.current.position.x = Math.cos(t * 0.2) * 25
      light2Ref.current.position.z = Math.sin(t * 0.2) * 25
    }
  })

  useMemo(() => {
    const handleMouse = (e: MouseEvent) => {
      const rect = gl.domElement.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 60
      const y = -((e.clientY - rect.top) / rect.height - 0.5) * 60
      if (light1Ref.current) {
        light1Ref.current.position.x = x
        light1Ref.current.position.y = y
      }
    }
    gl.domElement.addEventListener('mousemove', handleMouse)
    return () => gl.domElement.removeEventListener('mousemove', handleMouse)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gl])

  return (
    <>
      <ambientLight intensity={0.15} />
      <pointLight ref={light1Ref} position={[20, 20, 20]} intensity={80} color="#48DBFB" distance={100} />
      <pointLight ref={light2Ref} position={[-20, -10, 20]} intensity={40} color="#E0E5E9" distance={80} />
    </>
  )
}

// ---- Main Canvas Export ----
export default function PixelTerrain() {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1,
        pointerEvents: 'all',
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 30], fov: 60 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        style={{ background: 'transparent' }}
      >
        <SceneLights />
        <TerrainMesh />
      </Canvas>
    </div>
  )
}
