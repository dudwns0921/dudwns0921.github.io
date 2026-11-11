import DotComponent from './DotComponent';

// Tailwind는 문자열을 이어 붙인 클래스(`text-${size}`)를 찾지 못하므로 글자 크기를 그대로 적어 둔다.
const SIZE_CLASS = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl',
  '3xl': 'text-3xl',
  '4xl': 'text-4xl',
  '5xl': 'text-5xl',
} as const;

const TitleComponent = ({ title, size }: { title: string; size: keyof typeof SIZE_CLASS }) => (
  <h2 className={`${SIZE_CLASS[size]} font-bold mb-4 break-after-avoid`}>
    {title}
    <DotComponent />
  </h2>
);

export default TitleComponent;
