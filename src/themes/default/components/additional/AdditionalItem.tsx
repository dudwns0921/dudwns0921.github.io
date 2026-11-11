interface AdditionalItemProps {
  href: string;
  label: string;
}

const AdditionalItem = ({ href, label }: AdditionalItemProps) => (
  <li>
    <p className="font-medium mr-2">{label}</p>
    <a
      href={href}
      className="text-blue-600 hover:underline break-all"
      target="_blank"
      rel="noopener noreferrer"
    >
      {href}
    </a>
  </li>
);

export default AdditionalItem;
