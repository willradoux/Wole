import "./IconButton.css";

// botão só com ícone. o label vira o aria-label e a dica que aparece no hover.
// com href vira um link (abre em outra aba)
export function IconButton({
  label,
  href,
  variant = "primary",
  size = "md",
  tooltip = "right",
  hidden = false,
  className = "",
  children,
  ...props
}) {
  const Tag = href ? "a" : "button";
  const linkProps = href ? { href, target: "_blank", rel: "noreferrer" } : { type: "button" };

  return (
    <Tag
      {...linkProps}
      aria-label={label}
      className={`icon-button icon-button--${variant} icon-button--${size} ${hidden ? "is-hidden" : ""} ${className}`}
      inert={hidden}
      {...props}
    >
      {children}
      <span className={`icon-button__tooltip icon-button__tooltip--${tooltip}`} role="tooltip">
        {label}
      </span>
    </Tag>
  );
}
