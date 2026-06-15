export default function ChickCharacter({ size = 80 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size * (280 / 200)}
      viewBox="0 0 200 280"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <ellipse cx="100" cy="255" rx="36" ry="5" fill="#f4c430" opacity="0.25" />

      <ellipse cx="100" cy="195" rx="34" ry="32" fill="#fde68a" stroke="#f4c430" strokeWidth="2" />
      <path
        d="M68 197 Q52 188 56 212 Q70 218 78 206 Z"
        fill="#fde68a"
        stroke="#f4c430"
        strokeWidth="2"
      />
      <path
        d="M132 197 Q148 188 144 212 Q130 218 122 206 Z"
        fill="#fde68a"
        stroke="#f4c430"
        strokeWidth="2"
      />
      <ellipse cx="82" cy="223" rx="12" ry="9" fill="#fde68a" stroke="#f4c430" strokeWidth="2" />
      <ellipse cx="118" cy="223" rx="12" ry="9" fill="#fde68a" stroke="#f4c430" strokeWidth="2" />
      <ellipse cx="100" cy="198" rx="15" ry="13" fill="#fff6d6" />

      <path d="M100 60 L88 40 L112 40 Z" fill="#f4a020" stroke="#e8a06e" strokeWidth="1.5" />

      <circle cx="100" cy="119" r="50" fill="#fde68a" stroke="#f4c430" strokeWidth="2" />
      <circle cx="74" cy="112" r="5" fill="#3d3530" />
      <circle cx="126" cy="112" r="5" fill="#3d3530" />
      <circle cx="65" cy="121" r="6" fill="#fbc4ab" opacity="0.7" />
      <circle cx="135" cy="121" r="6" fill="#fbc4ab" opacity="0.7" />
      <path d="M91 130 L109 130 L100 142 Z" fill="#f4a020" />
    </svg>
  );
}
