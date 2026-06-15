export default function DefaultAvatar({ size = 80 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="40" cy="40" r="40" fill="#ede8e1" />
      <circle cx="40" cy="32" r="13" fill="#c8bdb5" />
      <ellipse cx="40" cy="68" rx="22" ry="16" fill="#c8bdb5" />
    </svg>
  );
}
