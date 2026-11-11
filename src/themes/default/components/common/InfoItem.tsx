import DotComponent from './DotComponent';

export interface InfoItemProps {
  title: string;
  subInfo: string;
  subInfo2: string;
  description: string;
  // PDF에서 짧은 항목은 페이지 사이에서 나뉘지 않게 한다. 긴 프로젝트는 false로 두어 줄 단위로 흐르게 한다.
  keepTogether?: boolean;
  // 제목 크기. 시리즈 안의 항목처럼 한 단계 낮출 때 'text-xl'을 준다.
  titleSize?: string;
}

const InfoItem = ({ title, subInfo, subInfo2, description, keepTogether = true, titleSize = 'text-2xl' }: InfoItemProps) => {
  return (
    <div className={keepTogether ? 'break-inside-avoid' : undefined}>
      <div className={`font-semibold ${titleSize} break-keep break-after-avoid`}>
        {title}
        <DotComponent />
      </div>
      <div className="text-lg">{subInfo}</div>
      <div className="text-lg">{subInfo2}</div>
      <div className="text-gray-700">{description}</div>
    </div>
  );
};

export default InfoItem;
