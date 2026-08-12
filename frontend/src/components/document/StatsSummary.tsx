import React from 'react';
import { AstStats } from '../../utils/astUtils';

interface StatsSummaryProps {
  stats: AstStats;
}

export const StatsSummary: React.FC<StatsSummaryProps> = ({ stats }) => {
  const statItems = [
    { label: 'Total Blocks', count: stats.totalBlocks, color: 'bg-gray-100 text-gray-800' },
    { label: 'Headings', count: stats.headingsCount, color: 'bg-blue-50 text-blue-700' },
    { label: 'Paragraphs', count: stats.paragraphsCount, color: 'bg-slate-50 text-slate-700' },
    { label: 'Lists', count: stats.listsCount, color: 'bg-purple-50 text-purple-700' },
    { label: 'Tables', count: stats.tablesCount, color: 'bg-amber-50 text-amber-700' },
    { label: 'Images', count: stats.imagesCount, color: 'bg-emerald-50 text-emerald-700' },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {statItems.map((item) => (
        <div
          key={item.label}
          className={`p-3 rounded-lg border border-gray-200/60 ${item.color} flex flex-col items-center justify-center text-center`}
        >
          <span className="text-xl font-extrabold">{item.count}</span>
          <span className="text-xs font-medium opacity-80 mt-0.5">{item.label}</span>
        </div>
      ))}
    </div>
  );
};