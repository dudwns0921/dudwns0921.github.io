interface BadgeProps {
  text: string;
}

const Badge = ({ text }: BadgeProps) => {
  const colors = [
    'bg-blue-100 text-blue-800',
    'bg-green-100 text-green-800',
    'bg-purple-100 text-purple-800',
    'bg-orange-100 text-orange-800',
    'bg-pink-100 text-pink-800',
    'bg-indigo-100 text-indigo-800',
    'bg-yellow-100 text-yellow-800',
    'bg-red-100 text-red-800',
    'bg-teal-100 text-teal-800',
    'bg-cyan-100 text-cyan-800',
  ];

  const randomIndex = Math.floor(Math.random() * colors.length);
  const colorClass = colors[randomIndex % colors.length];

  return <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>{text}</span>;
};

export default Badge;
