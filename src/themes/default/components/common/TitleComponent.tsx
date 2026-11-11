import DotComponent from './DotComponent';

const TitleComponent = ({
  title,
  size,
}: {
  title: string;
  size: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl';
}) => (
  <h2 className={`text-${size} font-bold mb-4 break-after-avoid`}>
    {title}
    <DotComponent />
  </h2>
);

export default TitleComponent;
