import type { InfoItem as InfoItemData } from '@/content/types';
import InfoItem from '../common/InfoItem';
import TitleComponent from '../common/TitleComponent';

const Qualification = ({ items }: { items: InfoItemData[] }) => (
  <section>
    <TitleComponent title="Qualification" size="5xl" />
    <div className="w-full flex flex-col gap-4">
      {items.map((exp) => (
        <InfoItem key={exp.title} {...exp} />
      ))}
    </div>
  </section>
);

export default Qualification;
