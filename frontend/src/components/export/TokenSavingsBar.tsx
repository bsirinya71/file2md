import React from 'react';

interface TokenSavingsBarProps {
  stats: {
    standard_tokens: number;
    optimized_tokens: number;
    saved_tokens: number;
    savings_percentage: number;
  };
}

export const TokenSavingsBar: React.FC<TokenSavingsBarProps> = ({ stats }) => {
  return (
    <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-emerald-900 flex items-center space-x-1.5">
          <span>⚡</span>
          <span>LLM Token Optimization Dashboard</span>
        </span>
        <span className="px-2.5 py-0.5 bg-emerald-600 text-white text-xs font-extrabold rounded-full shadow-xs">
          {stats?.savings_percentage ? stats.savings_percentage.toFixed(1) : '0.0'}% Tokens Saved
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-2.5 bg-white rounded-lg border border-emerald-100 text-center">
          <span className="text-xs text-gray-500 font-medium block">Standard Markdown</span>
          <span className="text-base font-bold text-gray-800">{(stats?.standard_tokens || 0).toLocaleString()} tokens</span>
        </div>

        <div className="p-2.5 bg-white rounded-lg border border-emerald-200 text-center shadow-xs">
          <span className="text-xs text-emerald-700 font-semibold block">LLM-Optimized</span>
          <span className="text-base font-extrabold text-emerald-700">{(stats?.optimized_tokens || 0).toLocaleString()} tokens</span>
        </div>

        <div className="p-2.5 bg-emerald-100/60 rounded-lg border border-emerald-200 text-center">
          <span className="text-xs text-emerald-800 font-medium block">Total Saved</span>
          <span className="text-base font-bold text-emerald-900">-{(stats?.saved_tokens || 0).toLocaleString()} tokens</span>
        </div>
      </div>
    </div>
  );
};