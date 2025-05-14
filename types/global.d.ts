// Tipos globales para el proyecto

// Tipo para proyectos
export interface Project {
  id: string
  title: string
  description: string
  initialCapital: number
  currentBalance: number
  targetAmount: number
  startDate: string
  targetDate: string
  progressPercentage: number
  type: string
  goalFrequency?: string
  goalAmount?: number
  totalTarget?: number
  progressHistory?: ProgressEntry[]
  milestones?: {
    "25%": Milestone
    "50%": Milestone
    "75%": Milestone
    "100%"?: Milestone
  }
  journal?: JournalEntry[]
}

// Tipo para entradas de progreso
export interface ProgressEntry {
  id: string
  date: string
  amount: number
  balance: number
  progressPercentage: number
}

// Tipo para hitos
export interface Milestone {
  date: string
  achieved: boolean
  achievedDate: string | null
  icon?: any
  color?: string
  bgColor?: string
  borderColor?: string
}

// Tipo para entradas de diario
export interface JournalEntry {
  id: string
  date: string
  content: string
  tags?: string[]
}

// Tipo para usuario
export interface User {
  uid: string
  email: string
  nombre?: string
  photoURL?: string
}

// Tipo para notificaciones
export interface Notification {
  id: string
  title: string
  message: string
  read: boolean
  date: string
  type?: string
  link?: string
}

// Tipo para estadísticas
export interface Statistics {
  totalProjects: number
  completedProjects: number
  activeProjects: number
  averageROI: number
  totalProfits: number
  winRate: number
  bestProject: {
    name: string
    roi: number
  }
  worstProject: {
    name: string
    roi: number
  }
}

// Tipo para datos de gráficos
export interface ChartData {
  name: string
  [key: string]: any
}

// Tipo para opciones de filtro
export interface FilterOptions {
  projectTypes: string[]
  timeRange: string
  dateFrom?: string
  dateTo?: string
  instruments?: string[]
  timeframes?: string[]
}
