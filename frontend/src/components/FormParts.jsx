// pieces every add/edit form uses so they all look the same
// (tank form now, task/fish/equipment forms later)

// the white box around the form with the title and "* required fields"
export function FormCard({ title, children, onSubmit }) {
  return (
    <form className="card form-card" onSubmit={onSubmit} noValidate>
      <div className="form-card-head">
        <h2 className="panel-title">{title}</h2>
        <span className="muted small">* Required fields</span>
      </div>
      {children}
    </form>
  );
}

// a label with an input (or dropdown etc) under it, and an error if theres one
export function Field({ label, required, error, hint, children }) {
  return (
    <label className={`field ${error ? 'field-error' : ''}`}>
      <span>
        {label}
        {required && ' *'}
      </span>
      {children}
      {hint && !error && <small className="muted">{hint}</small>}
      {error && <small className="error-text">{error}</small>}
    </label>
  );
}

// puts fields side by side (stacks them on phones)
export function FieldRow({ children }) {
  return <div className="field-row">{children}</div>;
}

// list of name + value rows the user can add or remove
// fields looks like [{ name: 'Water volume', value: '30 L' }]
export function CustomFields({ fields, onChange }) {
  const update = (i, key, value) =>
    onChange(fields.map((f, idx) => (idx === i ? { ...f, [key]: value } : f)));
  const remove = (i) => onChange(fields.filter((_, idx) => idx !== i));
  const add = () => onChange([...fields, { name: '', value: '' }]);

  return (
    <div className="custom-fields">
      <div className="custom-fields-head">
        <span className="field-title">Custom fields (optional)</span>
        <button type="button" className="link-button" onClick={add}>
          + Add custom field
        </button>
      </div>
      {fields.length === 0 && (
        <p className="muted small">For anything that doesn’t fit the fields above.</p>
      )}
      {fields.map((f, i) => (
        <div className="custom-row" key={i}>
          <input
            placeholder="Field name"
            aria-label="Field name"
            value={f.name}
            onChange={(e) => update(i, 'name', e.target.value)}
          />
          <input
            placeholder="Value"
            aria-label="Value"
            value={f.value}
            onChange={(e) => update(i, 'value', e.target.value)}
          />
          <button type="button" className="icon-button" onClick={() => remove(i)} aria-label="Remove field" title="Remove">
            <TrashIcon />
          </button>
        </div>
      ))}
    </div>
  );
}

// save + cancel at the bottom, extra stuff (like delete) goes on the right
export function FormActions({ saveLabel = 'Save changes', onCancel, children }) {
  return (
    <div className="form-actions">
      <div className="actions">
        <button type="submit" className="btn btn-primary">
          {saveLabel}
        </button>
        <button type="button" className="btn" onClick={onCancel}>
          Cancel
        </button>
      </div>
      {children}
    </div>
  );
}

function TrashIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" />
    </svg>
  );
}
