type SectionTitleProps = {
  title: string;
  subtitle?: string;
  underlineColor?: string;
};

const SectionTitle = ({ title, subtitle, underlineColor = 'bg-blue-500' }: SectionTitleProps) => {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">{title}</h2>
      {subtitle && <p className="text-base text-gray-600 mb-3">{subtitle}</p>}
      <div className={`h-1 w-16 ${underlineColor}`}></div>
    </div>
  );
};

export default SectionTitle;