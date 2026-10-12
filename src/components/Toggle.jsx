import { useId } from 'react';

export default function Toggle({ checked, onChange, label, description }) {
  const id = useId();
  const descId = `${id}-desc`;

  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex-1">
        <label
          htmlFor={id}
          className="text-base font-semibold cursor-pointer"
          style={{ color: 'var(--text-primary)' }}
        >
          {label}
        </label>
        {description && (
          <p
            id={descId}
            className="mt-1 text-sm"
            style={{ color: 'var(--text-secondary)' }}
          >
            {description}
          </p>
        )}
      </div>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-describedby={description ? descId : undefined}
        onClick={onChange}
        className="toggle-track a11y-transition flex-shrink-0 mt-1"
      >
        <span className="toggle-thumb" aria-hidden="true" />
      </button>
    </div>
  );
}
