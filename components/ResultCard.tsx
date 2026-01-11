import React from 'react';
import type { Job } from '../types';
import { JobStatus } from '../types';
import { DownloadIcon, AlertTriangleIcon } from './Icons';

interface ResultCardProps {
  job: Job;
}

const ResultCard: React.FC<ResultCardProps> = ({ job }) => {
  const getStatusColor = () => {
    switch (job.status) {
      case JobStatus.COMPLETED:
        return 'border-green-500';
      case JobStatus.PROCESSING:
        return 'border-blue-500 animate-pulse';
      case JobStatus.FAILED:
        return 'border-red-500';
      case JobStatus.PENDING:
      default:
        return 'border-slate-600';
    }
  };

  const handleDownload = () => {
    if (!job.resultUrl) return;
    const link = document.createElement('a');
    link.href = job.resultUrl;
    link.download = `result_${job.outfit.file.name}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={`bg-slate-800 rounded-lg overflow-hidden border-2 ${getStatusColor()} transition-all`}>
      <div className="aspect-[9/16] relative bg-slate-900 flex items-center justify-center">
        {job.status === JobStatus.COMPLETED && job.resultUrl && (
          <>
            <img src={job.resultUrl} alt="Generated result" className="w-full h-full object-cover" />
            <button
              onClick={handleDownload}
              className="absolute bottom-3 right-3 bg-indigo-600/80 hover:bg-indigo-500 text-white p-2 rounded-full transition-transform hover:scale-110"
              aria-label="Download image"
            >
              <DownloadIcon className="h-5 w-5" />
            </button>
          </>
        )}
        {job.status === JobStatus.PROCESSING && (
          <div className="flex flex-col items-center text-slate-400">
            <svg className="animate-spin h-8 w-8 text-white mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Generating...</span>
          </div>
        )}
        {job.status === JobStatus.FAILED && (
          <div className="flex flex-col items-center text-red-400 p-4 text-center">
            <AlertTriangleIcon className="h-8 w-8 mb-2" />
            <span className="font-semibold">Generation Failed</span>
            <p className="text-xs text-red-500 mt-1 truncate" title={job.error}>{job.error}</p>
          </div>
        )}
        {job.status === JobStatus.PENDING && (
          <div className="flex flex-col items-center text-slate-500">
            <span className="text-sm">Queued</span>
          </div>
        )}
      </div>
      <div className="p-3">
        <p className="text-sm text-slate-300 font-medium truncate" title={`Outfit: ${job.outfit.file.name}`}>
          Outfit: {job.outfit.file.name}
        </p>
      </div>
    </div>
  );
};

export default ResultCard;
