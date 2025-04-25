// Input.jsx
import './Input.css';

export default function Input({ label, value, onChange, type = 'text', name }) {
  return (
    <div className="input-wrapper">
      {label && <label htmlFor={name}>{label}</label>}
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}
