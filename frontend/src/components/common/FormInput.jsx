/**
 * FormInput — Reusable styled input with label and error state.
 */

export default function FormInput({
  label,
  id,
  type = 'text',
  value,
  onChange,
  placeholder = '',
  error = '',
  required = false,
  disabled = false,
  className = '',
  ...props
}) {
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label htmlFor={id} className="label">
          {label}
          {required && <span style={{ color: 'var(--error)' }}> *</span>}
        </label>
      )}
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className="input"
        style={error ? { borderColor: 'var(--error)' } : {}}
        {...props}
      />
      {error && (
        <p className="mt-1 text-xs" style={{ color: 'var(--error)' }}>
          {error}
        </p>
      )}
    </div>
  );
}

/**
 * TextAreaInput — Reusable styled textarea.
 */
export function TextAreaInput({
  label,
  id,
  value,
  onChange,
  placeholder = '',
  error = '',
  required = false,
  rows = 3,
  className = '',
  ...props
}) {
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label htmlFor={id} className="label">
          {label}
          {required && <span style={{ color: 'var(--error)' }}> *</span>}
        </label>
      )}
      <textarea
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        rows={rows}
        className="textarea"
        style={error ? { borderColor: 'var(--error)' } : {}}
        {...props}
      />
      {error && (
        <p className="mt-1 text-xs" style={{ color: 'var(--error)' }}>
          {error}
        </p>
      )}
    </div>
  );
}
