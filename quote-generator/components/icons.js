// components/icons.js
// Icônes SVG minimalistes, sans dépendance externe.

export function IconQuote(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M7 8c-2 1-3 3-3 5.5S5.5 18 8 18M17 8c-2 1-3 3-3 5.5S16.5 18 19 18" strokeLinecap="round" />
    </svg>
  );
}

export function IconCopy(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <rect x="9" y="9" width="11" height="11" rx="2.5" />
      <path d="M5 15V6.5A2.5 2.5 0 0 1 7.5 4H15" strokeLinecap="round" />
    </svg>
  );
}

export function IconCheck(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M4 12l6 6L20 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconRefresh(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path
        d="M4 10a8 8 0 0 1 14-4.9M20 14a8 8 0 0 1-14 4.9M4 4v5h5M20 20v-5h-5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconAlert(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M12 9v4M12 17h.01" strokeLinecap="round" />
      <path d="M10.3 4.3 2.9 17.5A1.8 1.8 0 0 0 4.5 20h15a1.8 1.8 0 0 0 1.6-2.5L13.7 4.3a1.8 1.8 0 0 0-3.4 0Z" strokeLinejoin="round" />
    </svg>
  );
}

export function IconSparkle(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 2l1.8 5.7L19.5 9.5l-5.7 1.8L12 17l-1.8-5.7L4.5 9.5l5.7-1.8L12 2z" />
    </svg>
  );
}
