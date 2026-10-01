// ícones no estilo SF Symbols, sempre em 24x24 e com currentColor

export function DropIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 2.6c-.32 0-.62.15-.82.4C9.36 5.3 5 10.7 5 14.6 5 18.68 8.13 21.6 12 21.6s7-2.92 7-7c0-3.9-4.36-9.3-6.18-11.6-.2-.25-.5-.4-.82-.4Z" />
      <path d="M9.2 14.2c0 1.8 1.1 3.1 2.8 3.4" fill="none" stroke="#fff" strokeOpacity=".55" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function ResetIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M4.5 12a7.5 7.5 0 1 0 2.2-5.3L4.5 8.9" />
      <path d="M4.5 4.4v4.5H9" />
    </svg>
  );
}
