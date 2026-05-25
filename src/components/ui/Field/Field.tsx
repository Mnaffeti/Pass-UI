import type { ReactNode } from 'react';

interface FieldProps {
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: ReactNode;
}

export function Field({ label, required, hint, error, children }: FieldProps) {
  return (
    <div className="field">
      <span className="field-label">
        {label}{' '}
        {required && <span style={{ color: 'var(--primary)' }}>*</span>}
        {hint && (
          <span style={{ color: 'var(--muted-soft)', fontWeight: 400 }}> — {hint}</span>
        )}
      </span>
      {children}
      {error && <span className="field-error">{error}</span>}
    </div>
  );
}
