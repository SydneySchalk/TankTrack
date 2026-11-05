import { useNavigate } from 'react-router-dom';

// placeholder page for stuff thats not built yet (add/edit forms)
// title changes depending on which button you clicked
export default function WorkInProgress({ title }) {
  const navigate = useNavigate();
  return (
    <>
      {/* back button just goes to whatever page you were on before */}
      <button className="back-link reset" style={{ marginTop: 0 }} onClick={() => navigate(-1)}>
        ← Back
      </button>
      <div className="card card-pad" style={{ maxWidth: 560 }}>
        <span className="pill">Work in progress</span>
        <h1 className="section-title" style={{ marginTop: 12 }}>
          {title}
        </h1>
        <p className="muted" style={{ marginTop: 8 }}>
          This page is still being worked on. 
        </p>
      </div>
    </>
  );
}
