interface BadgeProps {
  text: string;
}

const COLORS = [
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

// 같은 글자는 어느 페이지에서나 같은 색이 나오도록 글자로 색을 고른다 (예전에는 무작위였다).
const colorFor = (text: string) => {
  let hash = 0;
  for (const ch of text.toLowerCase()) hash = (hash * 31 + ch.codePointAt(0)!) >>> 0;
  return COLORS[hash % COLORS.length];
};

// 굵기는 가진 폰트(400 · 600 · 700) 가운데 600을 쓴다.
const Badge = ({ text }: BadgeProps) => (
  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${colorFor(text)}`}>{text}</span>
);

export default Badge;
