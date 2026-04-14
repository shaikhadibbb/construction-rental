import type { CSSProperties, ReactNode } from 'react'

export function PageShell({ children }: { children: ReactNode }) {
  return <div className="ui-page-shell">{children}</div>
}

export function Container({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <div className="ui-container" style={style}>
      {children}
    </div>
  )
}

export function SurfaceCard({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <div className="ui-card" style={style}>
      {children}
    </div>
  )
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return <p className="ui-label">{children}</p>
}

export function PrimaryButton({
  children,
  type = 'button',
  disabled,
  style,
}: {
  children: ReactNode
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  style?: CSSProperties
}) {
  return (
    <button type={type} disabled={disabled} className="ui-button-primary" style={{ padding: '12px 18px', opacity: disabled ? 0.7 : 1, cursor: disabled ? 'not-allowed' : 'pointer', ...style }}>
      {children}
    </button>
  )
}

export function SecondaryButton({
  children,
  type = 'button',
  style,
}: {
  children: ReactNode
  type?: 'button' | 'submit' | 'reset'
  style?: CSSProperties
}) {
  return (
    <button type={type} className="ui-button-secondary" style={{ padding: '12px 18px', cursor: 'pointer', ...style }}>
      {children}
    </button>
  )
}

