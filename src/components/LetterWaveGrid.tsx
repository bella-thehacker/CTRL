import { useRef, useEffect, useMemo, useCallback } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import gsap from 'gsap'

// ── Vertex Shader ──
const vertexShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uDistortion;

  attribute float glyphIndex;
  attribute float speed;
  attribute float aScale;

  varying vec2 vUv;
  varying float vGlyphIndex;
  varying float vAlpha;

  // Simple hash noise
  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  void main() {
    float dist = length(uMouse - instanceMatrix[3].xy);

    vec4 transformed = vec4(position, 1.0);

    float t = uTime * 0.0005 * speed;

    float elevation = 0.0;
    if (dist < 2.0 && uDistortion > 0.0) {
      float d = (2.0 - dist) / 2.0;
      elevation += sin(t + d * 10.0) * cos(t + d * 10.0) * uDistortion * d;
    }

    elevation += sin(instanceMatrix[3].x * 0.5 + t) * cos(instanceMatrix[3].y * 0.5 + t) * 0.5;

    if (uDistortion > 0.0) {
      elevation += noise(vec2(instanceMatrix[3].x + t, instanceMatrix[3].y + t)) * uDistortion;
    }

    transformed.y += elevation;

    float dissolveProgress = smoothstep(0.0, 1.0, max(0.0, (uDistortion - 0.1) / (1.0 - 0.1)));
    transformed.y *= 1.0 - dissolveProgress;

    // Apply boot animation scale
    transformed.xyz *= aScale;

    vec4 mvPosition = modelViewMatrix * instanceMatrix * transformed;
    gl_Position = projectionMatrix * mvPosition;

    vUv = uv;
    vGlyphIndex = glyphIndex;
    vAlpha = 1.0 - dissolveProgress * 0.5;
  }
`

// ── Fragment Shader ──
const fragmentShader = `
  precision highp float;

  varying vec2 vUv;
  varying float vGlyphIndex;
  varying float vAlpha;

  uniform sampler2D uAtlas;
  uniform vec3 uColor;
  uniform float uOpacity;

  void main() {
    float cols = 10.0;
    float col = mod(vGlyphIndex, cols);
    float row = floor(vGlyphIndex / cols);

    vec2 atlasUV = vUv;
    atlasUV.x = (col + atlasUV.x) / cols;
    atlasUV.y = 1.0 - ((row + 1.0 - atlasUV.y) / 10.0);

    vec4 texel = texture2D(uAtlas, atlasUV);
    float alpha = texel.a;

    if (alpha < 0.15) discard;

    gl_FragColor = vec4(uColor, alpha * uOpacity * vAlpha);
  }
`

// ── Grid Component ──
function LetterGrid({ isMobile }: { isMobile: boolean }) {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const { camera, raycaster, pointer } = useThree()
  const mouseWorld = useRef(new THREE.Vector2(999, 999))
  const scrollPos = useRef(0)
  const scrollTarget = useRef(0)
  const scrollFrameCount = useRef(0)
  const clockRef = useRef(new THREE.Clock())

  const COLS = 35
  const ROWS = 35
  const TOTAL = COLS * ROWS
  const CELL_SIZE = 1.1

  // Glyph atlas texture
  const atlasTexture = useMemo(() => {
    const loader = new THREE.TextureLoader()
    const tex = loader.load('/glyph-atlas.png')
    tex.minFilter = THREE.LinearFilter
    tex.magFilter = THREE.LinearFilter
    tex.generateMipmaps = false
    return tex
  }, [])

  // Floor plane for raycasting
  const floorPlane = useMemo(() => {
    const geo = new THREE.PlaneGeometry(500, 500)
    const mat = new THREE.MeshBasicMaterial({ visible: false })
    const mesh = new THREE.Mesh(geo, mat)
    mesh.rotation.x = -Math.PI / 2
    return mesh
  }, [])

  // Instance data
  const { glyphIndices, speeds, scales, dummy } = useMemo(() => {
    const glyphIndices = new Float32Array(TOTAL)
    const speeds = new Float32Array(TOTAL)
    const scales = new Float32Array(TOTAL)

    for (let i = 0; i < TOTAL; i++) {
      glyphIndices[i] = i % 95
      speeds[i] = 0.7 + Math.random() * 0.6
      scales[i] = 0
    }

    return { glyphIndices, speeds, scales, dummy: new THREE.Object3D() }
  }, [TOTAL])

  // Initialize instance matrices
  useEffect(() => {
    if (!meshRef.current) return
    const mesh = meshRef.current
    const offsetX = (COLS * CELL_SIZE) / 2
    const offsetZ = (ROWS * CELL_SIZE) / 2

    for (let i = 0; i < TOTAL; i++) {
      const col = i % COLS
      const row = Math.floor(i / COLS)
      dummy.position.set(
        col * CELL_SIZE - offsetX,
        0,
        row * CELL_SIZE - offsetZ
      )
      dummy.scale.set(0.008, 0.008, 0.008)
      dummy.updateMatrix()
      mesh.setMatrixAt(i, dummy.matrix)
    }
    mesh.instanceMatrix.needsUpdate = true
  }, [COLS, ROWS, TOTAL, CELL_SIZE, dummy])

  // Boot animation
  useEffect(() => {
    if (!meshRef.current) return
    const mesh = meshRef.current
    const scaleAttr = mesh.geometry.getAttribute('aScale') as THREE.InstancedBufferAttribute

    const tl = gsap.timeline({ delay: 0.5 })

    const proxyObj: Record<number, { val: number }> = {}
    for (let i = 0; i < TOTAL; i++) {
      proxyObj[i] = { val: 0 }
      const col = i % COLS
      const delay = 0.2 + (col / COLS) * 0.6

      tl.to(
        proxyObj[i],
        {
          val: 1,
          duration: 0.5,
          ease: 'power3.out',
          onUpdate: () => {
            scaleAttr.setX(i, proxyObj[i].val)
            scaleAttr.needsUpdate = true
          },
        },
        delay
      )
    }

    return () => { tl.kill() }
  }, [COLS, TOTAL])

  // Camera entry animation
  useEffect(() => {
    const cam = camera as THREE.OrthographicCamera

    const tl = gsap.timeline()
    tl.to(cam.position, { x: 0, y: 5, z: 5, duration: 2.5, ease: 'power2.inOut' }, 0)
    tl.to(cam, {
      zoom: 0.65,
      duration: 2.5,
      ease: 'power2.inOut',
      onUpdate: () => cam.updateProjectionMatrix(),
    }, 0)
    tl.to(cam.position, { x: 5, y: 5, z: 5, duration: 2.5, ease: 'power2.inOut' }, 2.0)
    tl.to(cam, {
      zoom: 0.07,
      duration: 2.5,
      ease: 'power2.inOut',
      onUpdate: () => cam.updateProjectionMatrix(),
    }, 2.0)

    return () => { tl.kill() }
  }, [camera])

  // Mouse move handler
  const onPointerMove = useCallback(() => {
    if (isMobile) return
    raycaster.setFromCamera(pointer, camera)
    const intersects = raycaster.intersectObject(floorPlane)
    if (intersects.length > 0) {
      mouseWorld.current.set(intersects[0].point.x, intersects[0].point.z)
    }
  }, [camera, raycaster, floorPlane, pointer, isMobile])

  // Scroll handler
  useEffect(() => {
    const handleScroll = () => {
      scrollTarget.current = window.scrollY
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Render loop
  useFrame(() => {
    if (!meshRef.current) return
    const mesh = meshRef.current
    const mat = mesh.material as THREE.ShaderMaterial

    scrollPos.current += (scrollTarget.current - scrollPos.current) * 0.08

    if (!isMobile) {
      scrollFrameCount.current++
      if (scrollFrameCount.current % 2 === 0) {
        mat.uniforms.uTime.value = clockRef.current.getElapsedTime() * 1000
      }

      const distortionTarget = scrollPos.current / window.innerHeight
      const targetDistortion = Math.min(distortionTarget * 3, 5)
      mat.uniforms.uDistortion.value += (targetDistortion - mat.uniforms.uDistortion.value) * 0.1

      mat.uniforms.uMouse.value.x += (mouseWorld.current.x - mat.uniforms.uMouse.value.x) * 0.08
      mat.uniforms.uMouse.value.y += (mouseWorld.current.y - mat.uniforms.uMouse.value.y) * 0.08
    }
  })

  // Material
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(999, 999) },
        uDistortion: { value: 0 },
        uAtlas: { value: atlasTexture },
        uColor: { value: new THREE.Color('#e8dcc4') },
        uOpacity: { value: 0.9 },
      },
      transparent: true,
      depthTest: false,
      side: THREE.DoubleSide,
    })
  }, [atlasTexture])

  // Geometry
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(1, 1, 1, 1)
    geo.setAttribute('glyphIndex', new THREE.InstancedBufferAttribute(glyphIndices, 1))
    geo.setAttribute('speed', new THREE.InstancedBufferAttribute(speeds, 1))
    geo.setAttribute('aScale', new THREE.InstancedBufferAttribute(scales, 1))
    return geo
  }, [glyphIndices, speeds, scales])

  return (
    <>
      <primitive object={floorPlane} />
      <instancedMesh
        ref={meshRef}
        args={[geometry, material, TOTAL]}
        onPointerMove={onPointerMove}
        onPointerLeave={() => {
          mouseWorld.current.set(999, 999)
        }}
      />
    </>
  )
}

// ── Canvas Wrapper ──
export default function LetterWaveGrid() {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1,
      }}
    >
      <Canvas
        orthographic
        camera={{
          position: [5, 5, 5],
          zoom: 0.07,
          near: 0.1,
          far: 1000,
        }}
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        style={{
          background: 'transparent',
        }}
      >
        <LetterGrid isMobile={isMobile} />
      </Canvas>
    </div>
  )
}
