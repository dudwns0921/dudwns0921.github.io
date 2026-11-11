import type { Additional as AdditionalData } from '@/content/types';
import TitleComponent from '../common/TitleComponent';
import AdditionalItem from './AdditionalItem';

const Additional = ({ items }: { items: AdditionalData[] }) => (
  <section className="w-full break-inside-avoid">
    <TitleComponent title="Additional" size="5xl" />
    <ul className="space-y-2 list-disc pl-6">
      {items.map((c) => (
        <AdditionalItem key={c.href} {...c} />
      ))}
    </ul>
  </section>
);

export default Additional;
