import type { InfoItem as InfoItemData } from '@/content/types';
import InfoItem from '../common/InfoItem';
import TitleComponent from '../common/TitleComponent';

const Education = ({ items }: { items: InfoItemData[] }) => (
  <section>
    <TitleComponent title="Education" size="5xl" />
    <div className="w-full flex flex-col gap-4">
      {items.map((edu) => (
        <InfoItem key={edu.title} {...edu} />
      ))}
    </div>
  </section>
);

export default Education;
