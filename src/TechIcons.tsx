import { createRoot } from 'react-dom/client'
import StackIcon from 'tech-stack-icons'

const iconMappings: Record<string, string> = {
  'React': 'react',
  'Vue.js': 'vuejs',
  'TypeScript': 'typescript',
  'Three.js': 'threejs',
  'Next.js': 'nextjs2',
  'Tailwind CSS': 'tailwindcss',
  'Dotnet': 'csharp',
  'Node.js': 'nodejs',
  'Express': 'expressjs',
  'Python': 'python',
  'REST APIs': 'api',
  'MongoDB': 'mongodb',
  'PostgreSQL': 'postgresql',
  'MySQL': 'mysql',
  'SQL Server': 'microsoft',
  'Git': 'git',
  'Docker': 'docker',
  'Figma': 'figma',
  'CI/CD': 'github',
  'GitHub': 'github'
}

// LinkedIn icon as Flaticons SVG
const LinkedInIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style={{width: '100%', height: '100%'}}>
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
  </svg>
)

export const initTechIcons = () => {
  // Handle skill tags
  const skillTags = document.querySelectorAll('.skill-tag')
  
  skillTags.forEach((tag) => {
    const text = tag.textContent?.trim() || ''
    const iconName = iconMappings[text]
    
    if (iconName) {
      const iconContainer = document.createElement('span')
      iconContainer.style.width = '24px'
      iconContainer.style.height = '24px'
      iconContainer.style.display = 'inline-block'
      iconContainer.style.marginRight = '0.5rem'
      iconContainer.style.verticalAlign = 'middle'
      
      tag.innerHTML = ''
      tag.appendChild(iconContainer)
      
      const textSpan = document.createElement('span')
      textSpan.textContent = text
      textSpan.style.verticalAlign = 'middle'
      tag.appendChild(textSpan)
      
      const root = createRoot(iconContainer)
      root.render(<StackIcon name={iconName as any} />)
    }
  })

  // Handle social links
  const socialLinks = document.querySelectorAll('.social-icon-link')
  
  socialLinks.forEach((link) => {
    const techName = link.getAttribute('data-tech') || ''
    const container = link.querySelector('.social-icon-container')
    
    if (container) {
      (container as HTMLElement).style.width = '24px'
      ;(container as HTMLElement).style.height = '24px'
      ;(container as HTMLElement).style.display = 'inline-block'
      ;(container as HTMLElement).style.marginRight = '0.5rem'
      ;(container as HTMLElement).style.verticalAlign = 'middle'
      
      const root = createRoot(container as HTMLElement)
      
      // Use Flaticons LinkedIn icon for LinkedIn
      if (techName === 'LinkedIn') {
        root.render(<LinkedInIcon />)
      } else {
        const iconName = iconMappings[techName]
        if (iconName) {
          root.render(<StackIcon name={iconName as any} />)
        }
      }
    }
  })
}
