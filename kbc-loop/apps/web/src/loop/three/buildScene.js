// Builds the three.js scene for the start-screen hero (loaded on demand by LoopScene.js).
// A two-act story on a navy stage, on repeat (timing is driven by home/Hero.jsx through state.target):
//   linear   (target 0): the tube unbends into a line (Make · Use · Dispose); one product runs along it,
//                         falls off the end into the depth and bursts in red: material lost.
//   circular (target 1): the line bends and closes into the loop (Use · Repair · Upgrade · Reuse);
//                         six products orbit it for good, each pulsing as it passes Repair.
// Pauses when off-screen or in a hidden tab (LoopScene.js), respects prefers-reduced-motion
// (static end state) and disposes everything on unmount.
import * as THREE from 'three'

const R = 2 // loop radius
const L = 6.4 // length of the straight line
const NX = 120
const NZ = 56
const MORPH = 1.5 // seconds
const PRODUCTS = 6
const LINE_STATIONS = [['Make', 0.06], ['Use', 0.5], ['Dispose', 0.94]]
const LOOP_STATIONS = [['Use', 0.0], ['Repair', 0.25], ['Upgrade', 0.5], ['Reuse', 0.75]]
const REPAIR_U = 0.25

const clamp01 = (x) => Math.min(1, Math.max(0, x))
const easeInOut = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2)

// Colours are given as linear values (the look was designed that way)
const lin = (hex) => new THREE.Color().setHex(hex, THREE.LinearSRGBColorSpace)
const P = {
  env: 0x0a2550, top: 0xcfe6ff, left: 0x1e90e6, right: 0x2c8f78, floor: 0x061b3d, fog: 0x081f44,
  tube: 0x0b6fd8, ball: 0xf2f6fb, ambient: 0x6fa8ff, rim: 0x5ab8ff, points: 0x5ab8ff, exposure: 0.95,
}

/** Soft radial glow texture for the loss burst sparks. */
function glowTexture() {
  const c = document.createElement('canvas')
  c.width = c.height = 64
  const g = c.getContext('2d')
  const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32)
  grd.addColorStop(0, 'rgba(255,255,255,1)')
  grd.addColorStop(0.35, 'rgba(255,255,255,.35)')
  grd.addColorStop(1, 'rgba(255,255,255,0)')
  g.fillStyle = grd
  g.fillRect(0, 0, 64, 64)
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  return t
}

/** Small text label as a sprite (decorative; the canvas is aria-hidden and the hero has an sr-only sentence). */
function labelSprite(text, track, big) {
  const c = document.createElement('canvas')
  c.width = 256
  c.height = 64
  const g = c.getContext('2d')
  g.font = '600 27px "IBM Plex Sans", system-ui, sans-serif'
  if ('letterSpacing' in g) g.letterSpacing = '1px'
  g.fillStyle = '#C9D6E8'
  g.textAlign = 'center'
  g.textBaseline = 'middle'
  g.fillText(text, 128, 32)
  const tex = track(new THREE.CanvasTexture(c))
  tex.colorSpace = THREE.SRGBColorSpace
  const mat = track(new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false, depthWrite: false, opacity: 0 }))
  const s = new THREE.Sprite(mat)
  s.scale.set(big ? 1.6 : 1.3, big ? 0.4 : 0.325, 1)
  s.renderOrder = 10
  return s
}

// The hero is navy in both page themes, so the theme argument (kept for the LoopScene API) is not used.
export function buildScene(canvas, reduce, theme, { compact = false } = {}) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = P.exposure

  const disposables = []
  const track = (x) => { disposables.push(x); return x }

  const scene = new THREE.Scene()
  scene.fog = new THREE.FogExp2(lin(P.fog), 0.045)
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

  // Soft key light from the front-top, cool rim light from behind
  scene.add(new THREE.AmbientLight(lin(P.ambient), 0.25 * Math.PI))
  const key = new THREE.DirectionalLight(lin(0xffffff), 1.0 * Math.PI)
  key.position.set(3, 5, 6)
  const rim = new THREE.DirectionalLight(lin(P.rim), 1.6 * Math.PI)
  rim.position.set(-4, 3, -6)
  scene.add(key, rim)

  const state = { k: 0, target: 1, mx: 0, my: 0 }
  // The curve itself morphs point by point: the line bends and closes into the circle.
  class Morph extends THREE.Curve {
    getPoint(t, out = new THREE.Vector3()) {
      const e = state.k
      const a = Math.PI + t * Math.PI * 2
      const cx = Math.cos(a) * R
      const cy = Math.sin(a) * R
      const lx = -L / 2 + t * L
      // Points far from the middle travel later, so the ends visibly curl up and meet
      const d = Math.abs(t - 0.5) * 2
      const ek = clamp01((e - 0.25 * d) / (1 - 0.25 * d) + 0.25 * d * e)
      return out.set(lx + (cx - lx) * ek, cy * ek, Math.sin(t * Math.PI * 2) * 0.3 * ek)
    }
  }
  const curve = new Morph()

  const group = new THREE.Group()
  scene.add(group)
  const tubeMat = track(new THREE.MeshPhysicalMaterial({ color: lin(P.tube), metalness: 0.2, roughness: 0.22, clearcoat: 1, clearcoatRoughness: 0.06, envMapIntensity: 0.8 }))
  const tube = new THREE.Mesh(new THREE.TubeGeometry(curve, 200, 0.3, 32, false), tubeMat)
  const capGeo = track(new THREE.SphereGeometry(0.3, 32, 16))
  const capA = new THREE.Mesh(capGeo, tubeMat)
  const capB = new THREE.Mesh(capGeo, tubeMat)
  group.add(tube, capA, capB)

  const glowTex = track(glowTexture())
  /** A product ball: the original polished-metal ball that rolls over the band. */
  const ballGeo = track(new THREE.SphereGeometry(1, 48, 24))
  function makeBall(radius) {
    const mat = track(new THREE.MeshStandardMaterial({ color: lin(P.ball), metalness: 1, roughness: 0.14, envMapIntensity: 1.2, emissive: lin(0x4aabee), emissiveIntensity: 0, transparent: true }))
    const mesh = new THREE.Mesh(ballGeo, mat)
    mesh.scale.setScalar(radius)
    group.add(mesh)
    return { mesh, mat, radius }
  }
  const hero = makeBall(0.46)
  const products = Array.from({ length: PRODUCTS }, () => makeBall(0.34))

  // Stations: tiny labels on the line and ticks with labels on the loop
  const lineLabels = LINE_STATIONS.map(([text, u]) => { const s = labelSprite(text, track, compact); group.add(s); return { s, u } })
  const tickGeo = track(new THREE.BoxGeometry(0.05, 0.36, 0.05))
  const tickMat = track(new THREE.MeshBasicMaterial({ color: lin(0xbde6ff), transparent: true, opacity: 0 }))
  const loopLabels = LOOP_STATIONS.map(([text, u]) => {
    const s = labelSprite(text, track, compact)
    const tick = new THREE.Mesh(tickGeo, tickMat)
    const a = Math.PI + u * Math.PI * 2
    tick.position.set(Math.cos(a) * (R + 0.42), Math.sin(a) * (R + 0.42), 0)
    tick.rotation.z = a - Math.PI / 2
    s.position.set(Math.cos(a) * (R + (Math.abs(Math.cos(a)) > 0.5 ? 1.05 : 0.8)), Math.sin(a) * (R + 0.9), 0)
    group.add(s, tick)
    return { s }
  })

  // Loss burst: red-tinted sparks at the drop
  const NB = 48
  const bpos = new Float32Array(NB * 3)
  const bvel = Array.from({ length: NB }, () => new THREE.Vector3((Math.random() - 0.3) * 2.2, Math.random() * 2.4 - 0.4, (Math.random() - 0.5) * 1.6))
  const bgeo = track(new THREE.BufferGeometry())
  bgeo.setAttribute('position', new THREE.BufferAttribute(bpos, 3))
  const bmat = track(new THREE.PointsMaterial({ size: 0.22, map: glowTex, color: lin(0xff3b2f), transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending }))
  const burst = new THREE.Points(bgeo, bmat)
  group.add(burst)

  // Wavy particle floor, fading into the fog
  const pos = new Float32Array(NX * NZ * 3)
  const base = []
  for (let i = 0; i < NX; i++) for (let j = 0; j < NZ; j++) base.push((i / (NX - 1) - 0.5) * 22, -9 + (j / (NZ - 1)) * 11)
  const pgeo = track(new THREE.BufferGeometry())
  pgeo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
  const pmat = track(new THREE.PointsMaterial({ size: 0.04, color: lin(P.points), transparent: true, opacity: 0.45, depthWrite: false }))
  const pts = new THREE.Points(pgeo, pmat)
  pts.position.y = -2.8
  pts.visible = !compact
  scene.add(pts)

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

  let narrow = false
  let baseScale = 0.92
  function layout() {
    const w = canvas.clientWidth
    const h = canvas.clientHeight
    if (!w || !h) return
    renderer.setSize(w, h, false)
    cam.aspect = w / h
    cam.updateProjectionMatrix()
    narrow = compact || w < 760
    baseScale = compact ? 0.62 : narrow ? 0.55 : 0.7
    pts.position.x = narrow ? 0 : 2
  }

  let lastK = -1
  let lastTarget = null
  let phaseStart = 0
  let kFrom = 0
  const t0 = performance.now()
  const tmp = new THREE.Vector3()
  const end = new THREE.Vector3()

  const tan = new THREE.Vector3()
  const off = new THREE.Vector3()
  /** Place a ball on top of the band at curve position u (offset along the normal), rolling as it goes. */
  function placeBall(b, u, scale, opacity) {
    curve.getPoint(u, tmp)
    curve.getTangent(u, tan)
    b.mesh.position.copy(tmp).add(off.set(-tan.y, tan.x, 0).multiplyScalar(0.26 + b.radius * 0.7))
    b.mesh.rotation.set(0, 0, -u * 14)
    b.mesh.scale.setScalar(b.radius * scale)
    b.mat.opacity = opacity
  }

  function render(now) {
    const t = (now - t0) / 1000
    if (state.target !== lastTarget) { kFrom = lastTarget === null ? 1 - state.target : state.k; lastTarget = state.target; phaseStart = now }
    const el = reduce ? 99 : (now - phaseStart) / 1000
    const m = easeInOut(clamp01(el / MORPH))
    state.k = kFrom + (state.target - kFrom) * m
    if (Math.abs(state.k - lastK) > 0.0005) {
      tube.geometry.dispose()
      tube.geometry = new THREE.TubeGeometry(curve, 200, 0.3, 32, false)
      lastK = state.k
    }
    const e = state.k
    curve.getPoint(0, tmp); capA.position.copy(tmp)
    curve.getPoint(1, end); capB.position.copy(end)

    // Layout: the line sits more to the centre, the loop to the right of the copy (centred on phones)
    group.position.set(narrow ? 0 : 2.15 + 0.45 * e, compact ? 0.2 : narrow ? 0.3 : 0, 0)
    group.scale.setScalar(baseScale)

    // Act 1: one product along the line, then off the edge
    const linear = state.target === 0
    const lu = linear ? easeInOut(clamp01((el - MORPH) / 3)) : 0
    const fall = linear ? clamp01((el - MORPH - 3) / 1.1) : 0
    hero.mesh.visible = linear
    if (linear) {
      const appear = clamp01((el - MORPH + 0.4) / 0.4)
      if (fall === 0) placeBall(hero, lu, appear, appear)
      else {
        // Accelerating fall with a little spin, into the depth, fading out
        const f = fall
        placeBall(hero, 1, 1, 1)
        hero.mesh.position.add(off.set(f * 0.9, -f * f * 3.2, -f * f * 4))
        hero.mesh.rotation.set(f * 3, f * 5, -14)
        hero.mesh.scale.setScalar(hero.radius * (1 - 0.4 * f))
        hero.mat.opacity = 1 - f * f
      }
    }
    // Loss burst right at the edge
    const b = linear ? (el - MORPH - 3.05) / 1.2 : -1
    if (b > 0 && b < 1) {
      for (let i = 0; i < NB; i++) {
        bpos[i * 3] = end.x + bvel[i].x * b
        bpos[i * 3 + 1] = end.y + bvel[i].y * b - 2.2 * b * b
        bpos[i * 3 + 2] = end.z + bvel[i].z * b
      }
      bgeo.attributes.position.needsUpdate = true
      bmat.opacity = 0.9 * (1 - b)
      burst.visible = true
    } else burst.visible = false

    // Act 2: six products orbit the loop for good, each pulsing as it passes Repair
    const show = linear ? clamp01(1 - el / 0.6) : clamp01((el - 0.6) / 0.9)
    products.forEach((p, i) => {
      const u = ((reduce ? 0 : t * 0.045) + i / PRODUCTS) % 1
      const d = Math.min(Math.abs(u - REPAIR_U), 1 - Math.abs(u - REPAIR_U))
      const pulse = d < 0.05 ? Math.cos((d / 0.05) * Math.PI / 2) : 0
      const vis = show
      p.mesh.visible = vis > 0.01
      if (!p.mesh.visible) return
      placeBall(p, u, vis * (1 + 0.15 * pulse), vis)
      p.mat.emissiveIntensity = 0.6 * pulse
    })

    // Station labels: on the line in act 1, on the loop in act 2
    lineLabels.forEach(({ s, u }) => {
      curve.getPoint(u, tmp)
      s.position.set(tmp.x, tmp.y - 0.62, tmp.z)
      s.material.opacity = 0.9 * clamp01(1 - e * 3) * (linear ? clamp01((el - MORPH + 0.3) / 0.6) : 1)
    })
    const lo = 0.9 * clamp01((e - 0.85) / 0.15)
    loopLabels.forEach(({ s }) => { s.material.opacity = lo })
    tickMat.opacity = lo * 0.7

    // Camera: slow dolly plus a slight tilt that follows the mouse
    if (!reduce) {
      cam.position.z = 11 - Math.sin(t * 0.18) * 0.5
      cam.position.y = 1.2 + Math.sin(t * 0.11) * 0.15
      cam.lookAt(0, 0, 0)
    }
    group.rotation.x = -0.32 + (1 - e) * 0.2 + state.my * 0.12
    group.rotation.y = state.mx * 0.25
    if (pts.visible) wave(reduce ? 0 : t)
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
