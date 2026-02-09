import './style2.css'
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

// ==================== THREE.JS BACKGROUND ====================
const canvas = document.getElementById('threejs-canvas') as HTMLCanvasElement

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.z = 5

const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// Create particle system with more dynamic colors
const particlesGeometry = new THREE.BufferGeometry()
const particlesCount = 5000
const positions = new Float32Array(particlesCount * 3)
const colors = new Float32Array(particlesCount * 3)

for (let i = 0; i < particlesCount * 3; i += 3) {
  positions[i] = (Math.random() - 0.5) * 60
  positions[i + 1] = (Math.random() - 0.5) * 60
  positions[i + 2] = (Math.random() - 0.5) * 60

  const color = new THREE.Color()
  color.setHSL(Math.random() * 0.4 + 0.55, 0.9, 0.6)
  colors[i] = color.r
  colors[i + 1] = color.g
  colors[i + 2] = color.b
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

const particlesMaterial = new THREE.PointsMaterial({
  size: 0.06,
  vertexColors: true,
  transparent: true,
  opacity: 0.9,
  blending: THREE.AdditiveBlending,
})

const particles = new THREE.Points(particlesGeometry, particlesMaterial)
scene.add(particles)

// Add geometric wave
const waveGeometry = new THREE.PlaneGeometry(20, 20, 50, 50)
const waveMaterial = new THREE.MeshStandardMaterial({
  color: 0x6366f1,
  wireframe: true,
  transparent: true,
  opacity: 0.15,
})
const wave = new THREE.Mesh(waveGeometry, waveMaterial)
wave.rotation.x = -Math.PI / 2
wave.position.y = -2
scene.add(wave)

// Create floating geometric shapes
const shapes: THREE.Mesh[] = []
const geometries = [
  new THREE.IcosahedronGeometry(0.5, 0),
  new THREE.OctahedronGeometry(0.5, 0),
  new THREE.TetrahedronGeometry(0.5, 0),
]

for (let i = 0; i < 20; i++) {
  const geometry = geometries[i % geometries.length]
  const material = new THREE.MeshStandardMaterial({
    color: new THREE.Color().setHSL(Math.random(), 0.7, 0.5),
    wireframe: true,
    transparent: true,
    opacity: 0.4,
  })
  const shape = new THREE.Mesh(geometry, material)
  
  shape.position.set(
    (Math.random() - 0.5) * 25,
    (Math.random() - 0.5) * 25,
    (Math.random() - 0.5) * 25
  )
  shape.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI)
  
  shapes.push(shape)
  scene.add(shape)
}

// Enhanced lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
scene.add(ambientLight)

const pointLight1 = new THREE.PointLight(0x6366f1, 1.5)
pointLight1.position.set(5, 5, 5)
scene.add(pointLight1)

const pointLight2 = new THREE.PointLight(0xec4899, 1)
pointLight2.position.set(-5, -5, -5)
scene.add(pointLight2)

// Mouse movement effect
let mouseMoveX = 0
let mouseMoveY = 0

document.addEventListener('mousemove', (event) => {
  mouseMoveX = (event.clientX / window.innerWidth) * 2 - 1
  mouseMoveY = -(event.clientY / window.innerHeight) * 2 + 1
})

// Animation loop
const clock = new THREE.Clock()

function animate() {
  requestAnimationFrame(animate)

  const elapsedTime = clock.getElapsedTime()

  // Rotate particles
  particles.rotation.y = elapsedTime * 0.03
  particles.rotation.x = elapsedTime * 0.02

  // Animate wave
  const wavePositions = waveGeometry.attributes.position.array as Float32Array
  for (let i = 0; i < wavePositions.length; i += 3) {
    const x = wavePositions[i]
    const y = wavePositions[i + 1]
    wavePositions[i + 2] = Math.sin(x * 0.5 + elapsedTime) * 0.3 + Math.cos(y * 0.5 + elapsedTime) * 0.3
  }
  waveGeometry.attributes.position.needsUpdate = true

  // Animate shapes
  shapes.forEach((shape, index) => {
    shape.rotation.x += 0.003 * (index % 2 === 0 ? 1 : -1)
    shape.rotation.y += 0.005
    shape.position.y += Math.sin(elapsedTime + index) * 0.002
  })

  // Camera follows mouse with easing
  camera.position.x += (mouseMoveX * 0.8 - camera.position.x) * 0.03
  camera.position.y += (mouseMoveY * 0.8 - camera.position.y) * 0.03
  camera.lookAt(scene.position)

  // Animate lights
  pointLight1.position.x = Math.sin(elapsedTime * 0.5) * 7
  pointLight1.position.z = Math.cos(elapsedTime * 0.5) * 7
  
  pointLight2.position.x = Math.cos(elapsedTime * 0.3) * 5
  pointLight2.position.z = Math.sin(elapsedTime * 0.3) * 5

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
  
  if (currentScroll > 100) {
    navbar.style.background = 'rgba(10, 10, 15, 0.95)'
    navbar.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.3)'
  } else {
    navbar.style.background = 'rgba(10, 10, 15, 0.8)'
    navbar.style.boxShadow = 'none'
  }
  
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
  const originalText = nameElement.textContent || ''
  
  nameElement.addEventListener('mouseenter', () => {
    let iterations = 0
    const interval = setInterval(() => {
      nameElement.textContent = originalText
        .split('')
        .map((_char, index) => {
          if (index < iterations) {
            return originalText[index]
          }
          return String.fromCharCode(65 + Math.floor(Math.random() * 26))
        })
        .join('')
      
      if (iterations >= originalText.length) {
        clearInterval(interval)
      }
      
      iterations += 1/3
    }, 30)
  })
}

// ==================== INITIALIZE TECH STACK ICONS ====================
// Wait for animations to complete before injecting icons
setTimeout(() => {
  initTechIcons()
}, 100)

console.log('🚀 Portfolio chargé avec des effets améliorés !')
