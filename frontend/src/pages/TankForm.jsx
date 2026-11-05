import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { createTank, deleteTank, getTank, updateTank } from '../api.js';
import { Field, FieldRow, FormActions, FormCard } from '../components/FormParts.jsx';
import { useData } from '../useData.js';

// dropdown options
const WATER_TYPES = ['Freshwater', 'Saltwater'];
const STYLES = ['Community', 'Planted', 'Betta', 'Shrimp', 'Nano', 'Reef', 'Other'];
// card colors, same names as the .tone- classes in styles.css
const TONES = [
  { value: 'sage', label: 'Sage' },
  { value: 'blue', label: 'Blue' },
  { value: 'sand', label: 'Sand' },
];

// what a brand new tank starts with
const EMPTY = {
  name: '',
  waterType: 'Freshwater',
  style: 'Community',
  volumeL: '',
  location: '',
  dimensions: '',
  started: '',
  substrate: '',
  tone: 'sage',
  notes: '',
};

// checks the required stuff, returns the errors to show
function validate(form) {
  const errors = {};
  if (!form.name.trim()) errors.name = 'Give your tank a name.';
  const volume = Number(form.volumeL);
  if (form.volumeL === '' || Number.isNaN(volume) || volume <= 0) {
    errors.volumeL = 'Enter the size in litres, like 120.';
  }
  return errors;
}

// the actual form, used for both adding and editing
function TankFormFields({ initial, tankId }) {
  const navigate = useNavigate();
  const isEdit = Boolean(tankId);
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});

  // updates one field and clears its error
  const set = (key) => (e) => {
    setForm({ ...form, [key]: e.target.value });
    if (errors[key]) setErrors({ ...errors, [key]: undefined });
  };

  async function handleSubmit(e) {
    e.preventDefault();
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    // clean up before saving
    const details = {
      ...form,
      name: form.name.trim(),
      volumeL: Number(form.volumeL),
      notes: form.notes.trim(),
    };

    if (isEdit) {
      await updateTank(tankId, details);
      navigate(`/tanks/${tankId}`);
    } else {
      const tank = await createTank(details);
      navigate(`/tanks/${tank.id}`);
    }
  }

  async function handleDelete() {
    const ok = window.confirm(`Delete "${initial.name}"? Its tasks and history will be deleted too.`);
    if (!ok) return;
    await deleteTank(tankId);
    navigate('/tanks');
  }

  const cancel = () => navigate(isEdit ? `/tanks/${tankId}` : '/tanks');

  return (
    <FormCard title="Tank details" onSubmit={handleSubmit}>
      <Field label="Tank name" required error={errors.name}>
        <input value={form.name} onChange={set('name')} placeholder="Living Room Community" />
      </Field>

      <FieldRow>
        <Field label="Water type" required>
          <select value={form.waterType} onChange={set('waterType')}>
            {WATER_TYPES.map((w) => (
              <option key={w}>{w}</option>
            ))}
          </select>
        </Field>
        <Field label="Style" required>
          <select value={form.style} onChange={set('style')}>
            {STYLES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </Field>
      </FieldRow>

      <FieldRow>
        <Field label="Size (litres)" required error={errors.volumeL}>
          <input type="number" min="1" inputMode="numeric" value={form.volumeL} onChange={set('volumeL')} placeholder="120" />
        </Field>
        <Field label="Dimensions">
          <input value={form.dimensions} onChange={set('dimensions')} placeholder="80 × 35 × 45 cm" />
        </Field>
      </FieldRow>

      <FieldRow>
        <Field label="Location">
          <input value={form.location} onChange={set('location')} placeholder="Living room" />
        </Field>
        <Field label="Date started">
          <input type="date" value={form.started} onChange={set('started')} />
        </Field>
      </FieldRow>

      <Field label="Substrate">
        <input value={form.substrate} onChange={set('substrate')} placeholder="Sand, gravel, aquasoil…" />
      </Field>

      {/* color picker, changes the tanks card color */}
      <fieldset className="field">
        <legend>Card color</legend>
        <div className="tone-picker">
          {TONES.map((t) => (
            <label key={t.value} className={`tone-option tone-${t.value}`}>
              <input
                type="radio"
                name="tone"
                value={t.value}
                checked={form.tone === t.value}
                onChange={set('tone')}
              />
              <span className="tone-swatch" aria-hidden="true" />
              {t.label}
            </label>
          ))}
        </div>
      </fieldset>

      <Field label="Notes">
        <textarea rows="3" value={form.notes} onChange={set('notes')} placeholder="Any other notable features of this tank" />
      </Field>

      <FormActions saveLabel={isEdit ? 'Save changes' : 'Add tank'} onCancel={cancel}>
        {isEdit && (
          <button type="button" className="btn btn-danger" onClick={handleDelete}>
            Delete tank
          </button>
        )}
      </FormActions>
    </FormCard>
  );
}

// page for /tanks/new and /tanks/:id/edit
export default function TankForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  // only loads a tank when editing
  const tank = useData(getTank, id ?? '');

  if (isEdit && tank === undefined) return null; // still loading
  if (isEdit && tank === null) {
    return (
      <>
        <Link to="/tanks" className="back-link">
          ← My Tanks
        </Link>
        <p>We couldn’t find that tank.</p>
      </>
    );
  }

  // fills the form with the tanks info when editing
  const initial = isEdit
    ? {
        ...EMPTY,
        ...tank,
        volumeL: String(tank.volumeL ?? ''),
        notes: tank.notes ?? '',
      }
    : EMPTY;

  return (
    <>
      <Link to={isEdit ? `/tanks/${id}` : '/tanks'} className="back-link">
        ← My Tanks{isEdit && ` / ${tank.name}`}
      </Link>
      <div className="page-header" style={{ marginBottom: 24 }}>
        <div>
          <h1 className="page-title">{isEdit ? 'Edit tank' : 'Add a tank'}</h1>
          <p className="page-sub">
            {isEdit
              ? 'Update the details for this aquarium.'
              : 'Start with the basics. You can add fish, plants and equipment after.'}
          </p>
        </div>
      </div>
      <TankFormFields initial={initial} tankId={id} />
    </>
  );
}
