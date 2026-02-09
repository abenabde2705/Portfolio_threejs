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
  'GitHub': 'github',
  'LinkedIn': 'linkedin'
}

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
    const iconName = iconMappings[techName]
    const container = link.querySelector('.social-icon-container')
    
    if (iconName && container) {
      (container as HTMLElement).style.width = '24px'
      ;(container as HTMLElement).style.height = '24px'
      ;(container as HTMLElement).style.display = 'inline-block'
      ;(container as HTMLElement).style.marginRight = '0.5rem'
      ;(container as HTMLElement).style.verticalAlign = 'middle'
      
      const root = createRoot(container as HTMLElement)
      root.render(<StackIcon name={iconName as any} />)
    }
  })
}
