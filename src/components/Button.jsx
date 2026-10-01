import "./Button.css";

export function Button({ variant = "primary", className = "", ...props }) {
  return <button type="button" className={`button button--${variant} ${className}`} {...props} />;
}
