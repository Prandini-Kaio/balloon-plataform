import { Link, type LinkProps } from 'react-router-dom'

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'light'
type ButtonSize = 'sm' | 'md' | 'lg'

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-primary text-white hover:bg-primary-dark shadow-lg shadow-primary/30 hover:-translate-y-0.5',
  secondary:
    'bg-navy text-white hover:bg-brand-mid shadow-lg shadow-navy/25 hover:-translate-y-0.5',
  outline:
    'border-2 border-navy/15 bg-white/70 text-navy hover:border-primary hover:text-primary',
  ghost: 'text-navy hover:bg-navy/5',
  light:
    'bg-white text-navy hover:bg-cream shadow-lg shadow-navy/10 hover:-translate-y-0.5',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
}

type CommonProps = {
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
  children: React.ReactNode
}

type ButtonAsLink = CommonProps & {
  to: LinkProps['to']
} & Omit<LinkProps, 'to' | 'className' | 'children'>

type ButtonAsButton = CommonProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    to?: undefined
  }

type ButtonProps = ButtonAsLink | ButtonAsButton

export function Button(props: ButtonProps) {
  const {
    variant = 'primary',
    size = 'md',
    className = '',
    children,
    ...rest
  } = props

  const classes = `inline-flex items-center justify-center gap-2 rounded-full font-display font-semibold transition-all duration-200 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 ${variantClasses[variant]} ${sizeClasses[size]} ${className}`

  if ('to' in rest && rest.to !== undefined) {
    const { to, ...linkProps } = rest as Omit<ButtonAsLink, keyof CommonProps>
    return (
      <Link to={to} className={classes} {...linkProps}>
        {children}
      </Link>
    )
  }

  const buttonProps = rest as React.ButtonHTMLAttributes<HTMLButtonElement>
  return (
    <button className={classes} {...buttonProps}>
      {children}
    </button>
  )
}
