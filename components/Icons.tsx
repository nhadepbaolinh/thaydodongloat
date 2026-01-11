import React from 'react';

type IconProps = {
  className?: string;
};

export const UploadIcon: React.FC<IconProps> = ({ className }) => (
  <svg className={className} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
  </svg>
);

export const TrashIcon: React.FC<IconProps> = ({ className }) => (
  <svg className={className} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 20">
    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h16M7 8v8m4-8v8M5 5v12a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V5M3 5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v0"/>
  </svg>
);

export const SparklesIcon: React.FC<IconProps> = ({ className }) => (
  <svg className={className} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
      <path d="M10 0C4.478 0 0 4.478 0 10s4.478 10 10 10 10-4.478 10-10S15.522 0 10 0Zm.5 16a.5.5 0 0 1-1 0V4a.5.5 0 0 1 1 0v12ZM5.44 15.28a.5.5 0 0 1-.354-.853l7.07-7.071a.5.5 0 0 1 .707.707l-7.07 7.071a.5.5 0 0 1-.353.146Z" />
      <path d="M10 3a1 1 0 0 1-1-1V1a1 1 0 1 1 2 0v1a1 1 0 0 1-1 1Zm0 16a1 1 0 0 1-1-1v-1a1 1 0 1 1 2 0v1a1 1 0 0 1-1 1Zm-7-8a1 1 0 0 1-1-1H1a1 1 0 1 1 0-2h1a1 1 0 1 1 0 2Zm14 0a1 1 0 0 1-1-1h-1a1 1 0 1 1 0-2h1a1 1 0 1 1 0 2ZM4.22 15.78a1 1 0 0 1-.707-.293l-1-1a1 1 0 1 1 1.414-1.414l1 1A1 1 0 0 1 4.22 15.78Zm11.314-11.314a1 1 0 0 1-.707-.293l-1-1a1 1 0 0 1 1.414-1.414l1 1a1 1 0 0 1-.707 1.707Zm-11.314 0a1 1 0 0 1 .707-.293l1-1a1 1 0 0 1-1.414-1.414l-1 1a1 1 0 0 1 .707 1.707Zm11.314 11.314a1 1 0 0 1 .707.293l1 1a1 1 0 0 1-1.414 1.414l-1-1a1 1 0 0 1 .707-1.707Z" transform="translate(-1, -1) scale(0.8)"/>
  </svg>
);

export const DownloadIcon: React.FC<IconProps> = ({ className }) => (
  <svg className={className} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 19">
    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 15v-2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5V15m0-12.5V5a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5V2.5m4 5V5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v2.5m-4 5V12a.5.5 0 0 0-.5.5h-1a.5.5 0 0 0-.5-.5v-2.5m10 5.5h.5a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-13a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h.5"/>
  </svg>
);

export const AlertTriangleIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
        <path d="M12 9v4"></path><path d="M12 17h.01"></path>
    </svg>
);
