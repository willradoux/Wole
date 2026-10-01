import "./IconButton.css";

// botão só com ícone. o label vira o aria-label e a dica que aparece no hover
export function IconButton({ label, variant = "primary", size = "md", hidden = false, children, ...props }) {
  return (
    <button
      type="button"
      aria-label={label}
      className={`icon-button icon-button--${variant} icon-button--${size} ${hidden ? "is-hidden" : ""}`}
      inert={hidden}
      {...props}
    >
      {children}
      <span className="icon-button__tooltip" role="tooltip">
        {label}
      </span>
    </button>
  );
}
