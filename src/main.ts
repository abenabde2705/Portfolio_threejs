import './style.css'
import * as THREE from 'three'
import { initTechIcons } from './TechIcons'

// ==================== CUSTOM CURSOR ====================
const cursor = document.createElement('div')
cursor.classList.add('custom-cursor')
document.body.appendChild(cursor)

const cursorDot = document.createElement('div')
cursorDot.classList.add('cursor-dot')
document.body.appendChild(cursorDot)

let mouseX = 0
let mouseY = 0
let cursorX = 0
let cursorY = 0

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX
  mouseY = e.clientY
  cursorDot.style.left = e.clientX + 'px'
  cursorDot.style.top = e.clientY + 'px'
})

function animateCursor() {
  cursorX += (mouseX - cursorX) * 0.1
  cursorY += (mouseY - cursorY) * 0.1
  
  cursor.style.left = cursorX + 'px'
  cursor.style.top = cursorY + 'px'
  
  requestAnimationFrame(animateCursor)
}
animateCursor()

// Cursor interactions
document.querySelectorAll('a, button, .project-card').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.classList.add('cursor-hover')
    cursorDot.classList.add('cursor-hover')
  })
  el.addEventListener('mouseleave', () => {
    cursor.classList.remove('cursor-hover')
    cursorDot.classList.remove('cursor-hover')
  })
})

// ==================== THREE.JS HERO: SIGNAL NETWORK ====================
// Sparse node-and-trace network, evoking call-routing topology rather than
// a generic floating-particle blob.
const canvas = document.getElementById('threejs-canvas') as HTMLCanvasElement

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.z = 9

const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

const SIGNAL_COLOR = 0x5eead4
const ALERT_COLOR = 0xff8a4c

// Node field: a sparse cloud of "routing" points
const nodeCount = 90
const nodePositions = new Float32Array(nodeCount * 3)
const nodeVelocities: THREE.Vector3[] = []

for (let i = 0; i < nodeCount; i++) {
  const x = (Math.random() - 0.5) * 18
  const y = (Math.random() - 0.5) * 11
  const z = (Math.random() - 0.5) * 8
  nodePositions[i * 3] = x
  nodePositions[i * 3 + 1] = y
  nodePositions[i * 3 + 2] = z
  nodeVelocities.push(new THREE.Vector3(
    (Math.random() - 0.5) * 0.004,
    (Math.random() - 0.5) * 0.004,
    (Math.random() - 0.5) * 0.004
  ))
}

const nodesGeometry = new THREE.BufferGeometry()
nodesGeometry.setAttribute('position', new THREE.BufferAttribute(nodePositions, 3))

const nodesMaterial = new THREE.PointsMaterial({
  size: 0.05,
  color: SIGNAL_COLOR,
  transparent: true,
  opacity: 0.8,
  sizeAttenuation: true,
})

const nodes = new THREE.Points(nodesGeometry, nodesMaterial)
scene.add(nodes)

// Connection lines: drawn between nodes within a link distance, recomputed each frame
const LINK_DISTANCE = 3.2
const MAX_LINKS = nodeCount * 6
const linePositions = new Float32Array(MAX_LINKS * 2 * 3)
const lineGeometry = new THREE.BufferGeometry()
lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3))

const lineMaterial = new THREE.LineBasicMaterial({
  color: SIGNAL_COLOR,
  transparent: true,
  opacity: 0.12,
})

const lines = new THREE.LineSegments(lineGeometry, lineMaterial)
scene.add(lines)

function updateLinks() {
  const positions = nodesGeometry.attributes.position.array as Float32Array
  let linkIndex = 0

  for (let i = 0; i < nodeCount && linkIndex < MAX_LINKS; i++) {
    const ax = positions[i * 3]
    const ay = positions[i * 3 + 1]
    const az = positions[i * 3 + 2]

    for (let j = i + 1; j < nodeCount && linkIndex < MAX_LINKS; j++) {
      const bx = positions[j * 3]
      const by = positions[j * 3 + 1]
      const bz = positions[j * 3 + 2]

      const dist = Math.hypot(ax - bx, ay - by, az - bz)
      if (dist < LINK_DISTANCE) {
        const o = linkIndex * 6
        linePositions[o] = ax
        linePositions[o + 1] = ay
        linePositions[o + 2] = az
        linePositions[o + 3] = bx
        linePositions[o + 4] = by
        linePositions[o + 5] = bz
        linkIndex++
      }
    }
  }

  lineGeometry.setDrawRange(0, linkIndex * 2)
  lineGeometry.attributes.position.needsUpdate = true
}

// A handful of brighter "active call" markers that pulse along the network
const markerCount = 4
const markerGeometry = new THREE.SphereGeometry(0.06, 12, 12)
const markers: THREE.Mesh[] = []

for (let i = 0; i < markerCount; i++) {
  const material = new THREE.MeshBasicMaterial({ color: ALERT_COLOR, transparent: true, opacity: 0.9 })
  const marker = new THREE.Mesh(markerGeometry, material)
  marker.position.set(
    (Math.random() - 0.5) * 18,
    (Math.random() - 0.5) * 11,
    (Math.random() - 0.5) * 8
  )
  markers.push(marker)
  scene.add(marker)
}

let mouseMoveX = 0
let mouseMoveY = 0

document.addEventListener('mousemove', (event) => {
  mouseMoveX = (event.clientX / window.innerWidth) * 2 - 1
  mouseMoveY = -(event.clientY / window.innerHeight) * 2 + 1
})

const clock = new THREE.Clock()

function animate() {
  requestAnimationFrame(animate)

  const elapsedTime = clock.getElapsedTime()
  const positions = nodesGeometry.attributes.position.array as Float32Array

  for (let i = 0; i < nodeCount; i++) {
    positions[i * 3] += nodeVelocities[i].x
    positions[i * 3 + 1] += nodeVelocities[i].y
    positions[i * 3 + 2] += nodeVelocities[i].z

    if (Math.abs(positions[i * 3]) > 9) nodeVelocities[i].x *= -1
    if (Math.abs(positions[i * 3 + 1]) > 5.5) nodeVelocities[i].y *= -1
    if (Math.abs(positions[i * 3 + 2]) > 4) nodeVelocities[i].z *= -1
  }
  nodesGeometry.attributes.position.needsUpdate = true
  updateLinks()

  markers.forEach((marker, index) => {
    const t = elapsedTime * 0.25 + index * 1.7
    marker.position.x = Math.sin(t) * 7
    marker.position.y = Math.cos(t * 0.8) * 4
    marker.position.z = Math.sin(t * 0.5) * 3
    const pulse = (Math.sin(elapsedTime * 2 + index) + 1) / 2
    marker.scale.setScalar(0.7 + pulse * 0.6)
  })

  nodes.rotation.y = elapsedTime * 0.015
  lines.rotation.y = elapsedTime * 0.015

  camera.position.x += (mouseMoveX * 0.6 - camera.position.x) * 0.02
  camera.position.y += (mouseMoveY * 0.6 - camera.position.y) * 0.02
  camera.lookAt(scene.position)

  renderer.render(scene, camera)
}

animate()

// Handle window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

// ==================== MAGNETIC BUTTONS ====================
document.querySelectorAll('.btn').forEach(button => {
  button.addEventListener('mousemove', (e) => {
    const rect = (button as HTMLElement).getBoundingClientRect()
    const x = (e as MouseEvent).clientX - rect.left - rect.width / 2
    const y = (e as MouseEvent).clientY - rect.top - rect.height / 2
    
    ;(button as HTMLElement).style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`
  })
  
  button.addEventListener('mouseleave', () => {
    ;(button as HTMLElement).style.transform = ''
  })
})

// ==================== SCROLL REVEAL ANIMATIONS ====================
const animateOnScroll = () => {
  const elements = document.querySelectorAll('[data-animate]')
  
  elements.forEach((element, index) => {
    const rect = element.getBoundingClientRect()
    const isVisible = rect.top < window.innerHeight * 0.8
    
    if (isVisible && !element.classList.contains('animated')) {
      setTimeout(() => {
        element.classList.add('animated')
      }, index * 50)
    }
  })
}

window.addEventListener('scroll', animateOnScroll)
animateOnScroll()

// ==================== COUNTER ANIMATION ====================
const animateCounter = (element: HTMLElement) => {
  const target = parseInt(element.getAttribute('data-target') || '0')
  const duration = 2500
  const step = target / (duration / 16)
  let current = 0

  const updateCounter = () => {
    current += step
    if (current < target) {
      element.textContent = Math.floor(current).toString()
      requestAnimationFrame(updateCounter)
    } else {
      element.textContent = target.toString() + '+'
    }
  }

  updateCounter()
}

const statObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const element = entry.target as HTMLElement
      animateCounter(element)
      statObserver.unobserve(element)
    }
  })
}, { threshold: 0.5 })

document.querySelectorAll('.stat-number').forEach((stat) => {
  statObserver.observe(stat)
})

// ==================== SMOOTH SCROLL ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (this: HTMLElement, e) {
    e.preventDefault()
    const target = document.querySelector(this.getAttribute('href')!)
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  })
})

// ==================== NAVBAR EFFECTS ====================
const navbar = document.querySelector('.navbar') as HTMLElement
let lastScroll = 0

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset

  navbar.classList.toggle('scrolled', currentScroll > 100)

  // Hide/show navbar on scroll
  if (currentScroll > lastScroll && currentScroll > 500) {
    navbar.style.transform = 'translateY(-100%)'
  } else {
    navbar.style.transform = 'translateY(0)'
  }
  
  lastScroll = currentScroll
})

// ==================== CONTACT FORM ====================
const contactForm = document.getElementById('contactForm') as HTMLFormElement
const formStatus = document.querySelector('.form-status') as HTMLElement
const submitBtn = document.querySelector('.btn-submit') as HTMLButtonElement

contactForm.addEventListener('submit', async (e) => {
  e.preventDefault()

  submitBtn.classList.add('loading')
  formStatus.style.display = 'none'
  formStatus.classList.remove('success', 'error')

  try {
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    formStatus.textContent = "Message envoyé avec succès ! Je vous répondrai bientôt."
    formStatus.classList.add('success')
    formStatus.style.display = 'block'
    contactForm.reset()

    setTimeout(() => {
      formStatus.style.display = 'none'
    }, 5000)

  } catch (error) {
    formStatus.textContent = 'Échec de l\'envoi du message. Veuillez réessayer.'
    formStatus.classList.add('error')
    formStatus.style.display = 'block'
  } finally {
    submitBtn.classList.remove('loading')
  }
})

// ==================== ENHANCED PROJECT CARDS ====================
const projectCards = document.querySelectorAll('.project-card')

projectCards.forEach((card) => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect()
    const x = (e as MouseEvent).clientX - rect.left
    const y = (e as MouseEvent).clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const rotateX = ((y - centerY) / centerY) * 8
    const rotateY = ((x - centerX) / centerX) * 8

    ;(card as HTMLElement).style.transform = `perspective(1000px) rotateX(${-rotateX}deg) rotateY(${rotateY}deg) translateY(-10px) scale(1.02)`
  })

  card.addEventListener('mouseleave', () => {
    ;(card as HTMLElement).style.transform = ''
  })
})

// ==================== TEXT GLITCH EFFECT ====================
const nameElement = document.querySelector('.name') as HTMLElement
if (nameElement) {
  const part1 = 'Amrou'
  const part2 = 'Ben Abdessalem'
  const fullText = part1 + part2

  nameElement.addEventListener('mouseenter', () => {
    let iterations = 0
    const interval = setInterval(() => {
      const chars = fullText.split('').map((_char, index) => {
        if (index < iterations) return fullText[index]
        return String.fromCharCode(65 + Math.floor(Math.random() * 26))
      })

      const s1 = chars.slice(0, part1.length).join('')
      const s2 = chars.slice(part1.length).join('')
      nameElement.innerHTML = `${s1}<br>${s2}`

      iterations += 1 / 3

      if (iterations >= fullText.length) {
        clearInterval(interval)
        nameElement.innerHTML = `${part1}<br>${part2}`
      }
    }, 30)
  })
}

// ==================== INITIALIZE TECH STACK ICONS ====================
// Wait for animations to complete before injecting icons
setTimeout(() => {
  initTechIcons()
}, 100)

console.log('🚀 Portfolio chargé avec des effets améliorés !')
