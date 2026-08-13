import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { AppRoutes } from '../../constants/routes';

interface ModuleCardProps {
  to: AppRoutes;
  title: string;
  description: string;
  icon: ReactNode;
  gradient: string;
  hoverColor: string;
}

export const ModuleCard: React.FC<ModuleCardProps> = ({
  to,
  title,
  description,
  icon,
  gradient,
  hoverColor
}) => {
  return (
    <Link to={to} className="glass-card rounded-3xl p-6 group transition-all">
      <div className={`w-12 h-12 rounded-2xl ${gradient} flex items-center justify-center text-[#243024] mb-5 group-hover:scale-105 transition-transform`}>
        {icon}
      </div>
      <h3 className={`text-xl font-extrabold text-[#172018] ${hoverColor} group-hover:opacity-80 transition-colors`}>
        {title}
      </h3>
      <p className="text-sm leading-6 text-[#68756c] mt-2">{description}</p>
      <div className={`mt-4 flex items-center text-xs font-semibold ${hoverColor} gap-1`}>
        <span>Open</span>
        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  );
};
