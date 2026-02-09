import { Code, Database, Layers, BarChart, Cloud, Palette, Smartphone, Brain, Briefcase } from 'lucide-react'
import RoleCard from './RoleCard'

const roles = [
  { id: 1, title: 'Frontend Developer', icon: Code, color: 'from-peach to-coral', skills: ['React', 'TypeScript', 'CSS'], experience: 'Mid-Level', questions: 45 },
  { id: 2, title: 'Backend Developer', icon: Database, color: 'from-lavender to-purple', skills: ['Node.js', 'SQL', 'APIs'], experience: 'Senior', questions: 52 },
  { id: 3, title: 'Full Stack Developer', icon: Layers, color: 'from-blue to-lavender', skills: ['MERN', 'DevOps', 'AWS'], experience: 'Mid-Level', questions: 68 },
  { id: 4, title: 'Data Analyst', icon: BarChart, color: 'from-mint to-blue', skills: ['Python', 'SQL', 'Tableau'], experience: 'Entry', questions: 38 },
  { id: 5, title: 'DevOps Engineer', icon: Cloud, color: 'from-yellow to-peach', skills: ['Docker', 'K8s', 'CI/CD'], experience: 'Senior', questions: 41 },
  { id: 6, title: 'UI/UX Designer', icon: Palette, color: 'from-pink to-coral', skills: ['Figma', 'Design Systems'], experience: 'Mid-Level', questions: 33 },
  { id: 7, title: 'Mobile App Developer', icon: Smartphone, color: 'from-purple to-pink', skills: ['React Native', 'Swift'], experience: 'Mid-Level', questions: 47 },
  { id: 8, title: 'AI/ML Engineer', icon: Brain, color: 'from-coral to-lavender', skills: ['Python', 'TensorFlow', 'ML'], experience: 'Senior', questions: 55 },
  { id: 9, title: 'Product Manager', icon: Briefcase, color: 'from-beige to-peach', skills: ['Strategy', 'Analytics', 'Agile'], experience: 'Senior', questions: 42 },
]

export default function RoleGrid() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {roles.map((role, index) => (
        <RoleCard key={role.id} {...role} index={index} />
      ))}
    </div>
  )
}
