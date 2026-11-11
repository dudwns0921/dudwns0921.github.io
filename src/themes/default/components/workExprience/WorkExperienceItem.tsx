import InfoItem, { type InfoItemProps } from '../common/InfoItem';
import type { Project, Team } from '@/content/types';
import ProjectInfo from './ProjectInfo';

// 한 회사 안에서 팀을 옮겼으면 팀마다 묶는다 — 소제목(팀 · 기간) 아래에 그 팀에서 한 프로젝트.

export interface WorkExperienceItemProps extends InfoItemProps {
  projects?: Project[];
  teams?: Team[];
}

const ProjectGrid = ({ projects }: { projects: Project[] }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-4">
    {projects.map((project, idx) => (
      <ProjectInfo key={project.title + idx} project={project} />
    ))}
  </div>
);

const WorkExperienceItem = ({
  title: company,
  subInfo: period,
  subInfo2: role,
  description,
  projects = [],
  teams = [],
}: WorkExperienceItemProps) => {
  return (
    <div className="flex flex-col gap-4">
      <InfoItem title={company} subInfo={period} subInfo2={role} description={description} />
      {teams.map((team) => (
        <div key={team.name} className="flex flex-col gap-3">
          <div className="pl-4 flex items-baseline gap-3 border-l-4 border-blue-500 break-after-avoid">
            <span className="text-xl font-semibold">{team.name}</span>
            <span className="text-gray-600">{team.period}</span>
          </div>
          <ProjectGrid projects={team.projects} />
        </div>
      ))}
      {projects.length > 0 && <ProjectGrid projects={projects} />}
    </div>
  );
};

export default WorkExperienceItem;
