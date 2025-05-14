export interface Testimonial {
  id: string
  quote: string
  author: string
  role: string
  image?: string
  approved: boolean
  createdAt: Date | string
}
