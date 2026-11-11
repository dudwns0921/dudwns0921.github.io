import type { InfoItem as InfoItemData } from '@/content/types';
import InfoItem from '../common/InfoItem';
import TitleComponent from '../common/TitleComponent';

const Award = ({ items }: { items: InfoItemData[] }) => (
  <section className="w-full">
    <TitleComponent title="Award" size="4xl" />
    <div className="w-full flex flex-col gap-4">
      {items.map((exp) => (
        <InfoItem key={exp.title} {...exp} />
      ))}
    </div>
  </section>
);

export default Award;
