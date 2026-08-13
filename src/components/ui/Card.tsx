type CardProps = {
  children: React.ReactNode
  className?: string
  highlight?: boolean
}

export function Card({ children, className = '', highlight = false }: CardProps) {
  return (
    <div
      className={`rounded-3xl border bg-surface p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg ${
        highlight
          ? 'border-transparent bg-white shadow-xl shadow-primary/15 ring-2 ring-primary'
          : 'border-border/80'
      } ${className}`}
    >
      {children}
    </div>
  )
}
