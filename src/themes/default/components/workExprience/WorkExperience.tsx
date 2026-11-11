import type { WorkExperience as WorkExperienceData } from '@/content/types';
import TitleComponent from '../common/TitleComponent';
import WorkExperienceItem from './WorkExperienceItem';

const WorkExperience = ({ items }: { items: WorkExperienceData[] }) => (
  <section>
    <TitleComponent title="Work Experience" size="5xl" />
    <div className="w-full flex flex-col gap-4">
      {items.map((exp, idx) => (
        <div key={exp.title}>
          <WorkExperienceItem {...exp} />
          {idx < items.length - 1 && <hr className="my-4 border-gray-300" />}
        </div>
      ))}
    </div>
  </section>
);

export default WorkExperience;
