export default function RabbitCharacter({ size = 80 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size * (280 / 200)}
      viewBox="0 0 200 280"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <ellipse cx="100" cy="255" rx="36" ry="5" fill="#d8cfc2" opacity="0.3" />

      <ellipse cx="100" cy="195" rx="34" ry="32" fill="#f5f0e8" stroke="#d8cfc2" strokeWidth="2" />
      <ellipse cx="72" cy="207" rx="11" ry="14" fill="#f5f0e8" stroke="#d8cfc2" strokeWidth="2" />
      <ellipse cx="128" cy="207" rx="11" ry="14" fill="#f5f0e8" stroke="#d8cfc2" strokeWidth="2" />
      <ellipse cx="82" cy="223" rx="12" ry="9" fill="#f5f0e8" stroke="#d8cfc2" strokeWidth="2" />
      <ellipse cx="118" cy="223" rx="12" ry="9" fill="#f5f0e8" stroke="#d8cfc2" strokeWidth="2" />
      <ellipse cx="100" cy="198" rx="15" ry="13" fill="#fdf8f2" />

      <ellipse cx="78" cy="60" rx="13" ry="32" fill="#f5f0e8" stroke="#d8cfc2" strokeWidth="2" />
      <ellipse cx="122" cy="60" rx="13" ry="32" fill="#f5f0e8" stroke="#d8cfc2" strokeWidth="2" />
      <ellipse cx="78" cy="62" rx="6.5" ry="19" fill="#f8bbd0" opacity="0.6" />
      <ellipse cx="122" cy="62" rx="6.5" ry="19" fill="#f8bbd0" opacity="0.6" />

      <circle cx="100" cy="119" r="50" fill="#f5f0e8" stroke="#d8cfc2" strokeWidth="2" />
      <circle cx="74" cy="112" r="5" fill="#3d3530" />
      <circle cx="126" cy="112" r="5" fill="#3d3530" />
      <circle cx="65" cy="121" r="6" fill="#f8bbd0" opacity="0.7" />
      <circle cx="135" cy="121" r="6" fill="#f8bbd0" opacity="0.7" />
      <path d="M93 128 L107 128 L100 138 Z" fill="#f8a5c2" stroke="#e8829e" strokeWidth="1.5" />
      <path d="M100 138 Q100 146 89 148" fill="none" stroke="#3d3530" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M100 138 Q100 146 111 148" fill="none" stroke="#3d3530" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}
