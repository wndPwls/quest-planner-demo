export default function BearCharacter({ size = 80 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size * (280 / 200)}
      viewBox="0 0 200 280"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <ellipse cx="100" cy="255" rx="36" ry="5" fill="#b08e5e" opacity="0.25" />

      <ellipse cx="100" cy="195" rx="34" ry="32" fill="#c8a878" stroke="#b08e5e" strokeWidth="2" />
      <ellipse cx="72" cy="207" rx="11" ry="14" fill="#c8a878" stroke="#b08e5e" strokeWidth="2" />
      <ellipse cx="128" cy="207" rx="11" ry="14" fill="#c8a878" stroke="#b08e5e" strokeWidth="2" />
      <ellipse cx="82" cy="223" rx="12" ry="9" fill="#c8a878" stroke="#b08e5e" strokeWidth="2" />
      <ellipse cx="118" cy="223" rx="12" ry="9" fill="#c8a878" stroke="#b08e5e" strokeWidth="2" />
      <ellipse cx="100" cy="198" rx="15" ry="13" fill="#f0e4cf" />

      <circle cx="68" cy="75" r="17" fill="#c8a878" stroke="#b08e5e" strokeWidth="2" />
      <circle cx="132" cy="75" r="17" fill="#c8a878" stroke="#b08e5e" strokeWidth="2" />
      <circle cx="68" cy="75" r="7.5" fill="#e3c9a3" />
      <circle cx="132" cy="75" r="7.5" fill="#e3c9a3" />

      <circle cx="100" cy="119" r="50" fill="#c8a878" stroke="#b08e5e" strokeWidth="2" />
      <circle cx="74" cy="112" r="5" fill="#3d3530" />
      <circle cx="126" cy="112" r="5" fill="#3d3530" />
      <circle cx="65" cy="121" r="6" fill="#f4c7b1" opacity="0.7" />
      <circle cx="135" cy="121" r="6" fill="#f4c7b1" opacity="0.7" />
      <ellipse cx="100" cy="131" rx="16" ry="12" fill="#e3c9a3" />
      <ellipse cx="100" cy="129" rx="4.5" ry="4" fill="#f8a5c2" stroke="#e8829e" strokeWidth="1" />
      <path d="M100 134 Q100 142 89 144" fill="none" stroke="#3d3530" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M100 134 Q100 142 111 144" fill="none" stroke="#3d3530" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}
