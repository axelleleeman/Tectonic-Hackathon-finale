// Builds the three.js scene for the hero (loaded on demand by LoopScene.js).
// 3D loop in the hero: a tube that morphs from a straight line (linear) into a loop (circular),
// a ball rolling along it and a wavy particle field. Pauses when off-screen or in a hidden tab,
// respects prefers-reduced-motion and disposes everything on unmount.
import * as THREE from 'three'

const R = 2 // loop radius
const L = 5 // length of the straight line
const NX = 120
const NZ = 56

const smooth = (k) => k * k * (3 - 2 * k)

// The design was made with three.js r128, which treated hex colours as linear. Since r152 hex colours are
// converted from sRGB, so we mark them as linear explicitly to keep the original look.
const lin = (hex) => new THREE.Color().setHex(hex, THREE.LinearSRGBColorSpace)

// Palettes per page theme: studio environment, tube, ball and particle colours.
const PALETTES = {
  dark: {
    env: 0x0a2550, top: 0xcfe6ff, left: 0x1e90e6, right: 0x2c8f78, floor: 0x061b3d,
    tube: 0x0f62d6, ball: 0xf2f6fb, ambient: 0x6fa8ff, pointsA: 0x5ab8ff, pointsB: 0x45c98f, pointsOpacity: 0.45, exposure: 0.95,
  },
  light: {
    env: 0xdfeaf6, top: 0xffffff, left: 0x7fbdf0, right: 0x8fd6b6, floor: 0xb9cbe0,
    tube: 0x02317f, ball: 0x9fb1c6, ambient: 0xffffff, pointsA: 0x0a3f8a, pointsB: 0x05603a, pointsOpacity: 0.55, exposure: 0.9,
  },
}

export function buildScene(canvas, reduce, theme = 'dark') {
  const P = PALETTES[theme] ?? PALETTES.dark
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75))
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = P.exposure

  const disposables = []
  const track = (x) => { disposables.push(x); return x }

  const scene = new THREE.Scene()
  const cam = new THREE.PerspectiveCamera(34, 1, 0.1, 100)
  cam.position.set(0, 1.2, 11)
  cam.lookAt(0, 0, 0)

  // Simple studio environment for reflections (blue left, green right, light on top)
  const env = new THREE.Scene()
  env.background = lin(P.env)
  const plane = (color, w, h, pos, ry = 0, rx = 0) => {
    const m = new THREE.Mesh(track(new THREE.PlaneGeometry(w, h)), track(new THREE.MeshBasicMaterial({ color: lin(color), side: THREE.DoubleSide })))
    m.position.set(...pos)
    m.rotation.set(rx, ry, 0)
    env.add(m)
  }
  plane(P.top, 14, 5, [0, 6, 0], 0, Math.PI / 2)
  plane(P.left, 8, 10, [-7, 0, 0], Math.PI / 2)
  plane(P.right, 8, 10, [7, 0, 0], -Math.PI / 2)
  plane(P.floor, 16, 16, [0, -6, 0], 0, Math.PI / 2)
  const pmrem = new THREE.PMREMGenerator(renderer)
  const envRT = pmrem.fromScene(env, 0.02)
  pmrem.dispose()
  scene.environment = envRT.texture

  // Physical light units (since r155): intensity × π compared to the legacy values
  scene.add(new THREE.AmbientLight(lin(P.ambient), 0.3 * Math.PI))
  const key = new THREE.DirectionalLight(lin(0xffffff), 1.2 * Math.PI)
  key.position.set(3, 5, 6)
  scene.add(key)

  const state = { k: 0, target: 1, mx: 0 }
  class Morph extends THREE.Curve {
    getPoint(t, out = new THREE.Vector3()) {
      const a = Math.PI + t * Math.PI * 2
      const e = smooth(state.k)
      const cx = Math.cos(a) * R
      const cy = Math.sin(a) * R
      const lx = -L / 2 + t * L
      return out.set(lx + (cx - lx) * e, cy * e, Math.sin(t * Math.PI * 2) * 0.3 * e)
    }
  }
  const curve = new Morph()

  const group = new THREE.Group()
  scene.add(group)
  const mat = track(new THREE.MeshPhysicalMaterial({ color: lin(P.tube), metalness: 0.2, roughness: 0.24, clearcoat: 1, clearcoatRoughness: 0.06, envMapIntensity: 0.8 }))
  const tube = new THREE.Mesh(new THREE.TubeGeometry(curve, 200, 0.3, 32, false), mat)
  const capGeo = track(new THREE.SphereGeometry(0.3, 32, 16))
  const capA = new THREE.Mesh(capGeo, mat)
  const capB = new THREE.Mesh(capGeo, mat)
  const ball = new THREE.Mesh(
    track(new THREE.SphereGeometry(0.46, 48, 24)),
    track(new THREE.MeshStandardMaterial({ color: lin(P.ball), metalness: 1, roughness: 0.14, envMapIntensity: 1.2 })),
  )
  group.add(tube, capA, capB, ball)

  // Wavy particle field
  const pos = new Float32Array(NX * NZ * 3)
  const base = []
  for (let i = 0; i < NX; i++) for (let j = 0; j < NZ; j++) base.push((i / (NX - 1) - 0.5) * 22, -9 + (j / (NZ - 1)) * 11)
  const pgeo = track(new THREE.BufferGeometry())
  pgeo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
  const pmat = track(new THREE.PointsMaterial({ size: 0.04, color: lin(P.pointsA), transparent: true, opacity: P.pointsOpacity, depthWrite: false }))
  const pts = new THREE.Points(pgeo, pmat)
  pts.position.y = -2.8
  scene.add(pts)
  const cBlue = lin(P.pointsA)
  const cGreen = lin(P.pointsB)

  function wave(t) {
    for (let n = 0, i = 0; n < base.length; n += 2, i += 3) {
      const x = base[n]
      const z = base[n + 1]
      pos[i] = x
      pos[i + 2] = z
      pos[i + 1] = Math.sin(x * 0.4 + t * 0.6) * 0.3 + Math.cos(z * 0.55 + t * 0.5) * 0.25
    }
    pgeo.attributes.position.needsUpdate = true
  }

  function layout() {
    const w = canvas.clientWidth
    const h = canvas.clientHeight
    if (!w || !h) return
    renderer.setSize(w, h, false)
    cam.aspect = w / h
    cam.updateProjectionMatrix()
    const narrow = w < 760
    group.position.set(narrow ? 0 : 3.2, narrow ? 0.3 : 0, 0)
    group.scale.setScalar(narrow ? 0.6 : 0.92)
    pts.position.x = narrow ? 0 : 2
  }

  let lastK = -1
  const t0 = performance.now()
  const tmp = new THREE.Vector3()
  const tan = new THREE.Vector3()
  const off = new THREE.Vector3()

  function render(now) {
    const t = (now - t0) / 1000
    state.k += (state.target - state.k) * (reduce ? 1 : 0.05)
    if (Math.abs(state.k - lastK) > 0.001) {
      tube.geometry.dispose()
      tube.geometry = new THREE.TubeGeometry(curve, 200, 0.3, 32, false)
      lastK = state.k
    }
    curve.getPoint(0, tmp); capA.position.copy(tmp)
    curve.getPoint(1, tmp); capB.position.copy(tmp)
    const u = reduce ? 0.3 : (t * (0.09 + 0.05 * (1 - state.k))) % 1
    curve.getPoint(u, tmp)
    curve.getTangent(u, tan)
    ball.position.copy(tmp).add(off.set(-tan.y, tan.x, 0).multiplyScalar(0.58))
    // Linear: at the end of the line the ball drops off "onto the landfill"
    if (state.k < 0.5 && u > 0.85) {
      const f = (u - 0.85) / 0.15
      ball.position.y -= f * f * 2.4
      ball.scale.setScalar(Math.max(0.05, 1 - f))
    } else ball.scale.setScalar(1)
    group.rotation.x = -0.38 + (1 - state.k) * 0.25
    group.rotation.y = state.mx * 0.2
    pmat.color.copy(cBlue).lerp(cGreen, smooth(state.k))
    wave(reduce ? 0 : t)
    renderer.render(scene, cam)
  }

  function dispose() {
    tube.geometry.dispose()
    disposables.forEach((d) => d.dispose())
    envRT.dispose()
    renderer.dispose()
  }

  return { state, layout, render, dispose }
}
