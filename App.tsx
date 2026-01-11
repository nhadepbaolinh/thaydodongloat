import React, { useState, useCallback } from 'react';
import { generateEditedImage } from './services/geminiService';
import type { ImageFile, Job } from './types';
import { JobStatus } from './types';
import { UploadIcon, TrashIcon, SparklesIcon, DownloadIcon, AlertTriangleIcon } from './components/Icons';
import ResultCard from './components/ResultCard';

const App: React.FC = () => {
  const [baseImage, setBaseImage] = useState<ImageFile | null>(null);
  const [outfitImages, setOutfitImages] = useState<ImageFile[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);

  const handleBaseImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setBaseImage({
        id: `base-${Date.now()}`,
        file: file,
        url: URL.createObjectURL(file),
      });
    }
  };

  const handleOutfitImagesUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      // FIX: Explicitly type the 'file' parameter as 'File' to resolve a TypeScript
      // inference issue where it was being incorrectly typed as 'unknown'. This fixes
      // assignment to ImageFile and usage in URL.createObjectURL.
      const newImages: ImageFile[] = files.map((file: File, index) => ({
        id: `outfit-${Date.now()}-${index}`,
        file: file,
        url: URL.createObjectURL(file),
      }));
      setOutfitImages(prev => [...prev, ...newImages]);
    }
  };

  const removeBaseImage = () => {
    if (baseImage) {
      URL.revokeObjectURL(baseImage.url);
      setBaseImage(null);
    }
  };

  const removeOutfitImage = (id: string) => {
    setOutfitImages(prev => {
      const imageToRemove = prev.find(img => img.id === id);
      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.url);
      }
      return prev.filter(img => img.id !== id);
    });
  };

  const handleGenerate = useCallback(async () => {
    if (!baseImage || outfitImages.length === 0 || isProcessing) return;

    setIsProcessing(true);
    setGlobalError(null);

    const initialJobs: Job[] = outfitImages.map(outfit => ({
      id: `job-${outfit.id}`,
      outfit: outfit,
      status: JobStatus.PENDING,
    }));
    setJobs(initialJobs);

    for (let i = 0; i < initialJobs.length; i++) {
      const currentJob = initialJobs[i];
      
      setJobs(prev => prev.map(j => j.id === currentJob.id ? { ...j, status: JobStatus.PROCESSING } : j));

      try {
        if (!process.env.API_KEY) {
          throw new Error("API key is not configured. Please set the API_KEY environment variable.");
        }
        const resultUrl = await generateEditedImage(baseImage.file, currentJob.outfit.file);
        setJobs(prev => prev.map(j => j.id === currentJob.id ? { ...j, status: JobStatus.COMPLETED, resultUrl } : j));
      } catch (error) {
        console.error(`Error processing job ${currentJob.id}:`, error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        setGlobalError(`Failed to process one or more images. Check console for details. Last error: ${errorMessage}`);
        setJobs(prev => prev.map(j => j.id === currentJob.id ? { ...j, status: JobStatus.FAILED, error: errorMessage } : j));
      }
    }

    setIsProcessing(false);
  }, [baseImage, outfitImages, isProcessing]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans">
      <main className="container mx-auto p-4 md:p-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-indigo-500 text-transparent bg-clip-text">
            Bulk Outfit Swapper AI
          </h1>
          <p className="text-slate-400 mt-2 max-w-2xl mx-auto">
            Upload a base model image and multiple outfits. Our AI will generate a new image for each outfit, swapping the clothes automatically.
          </p>
        </header>
        
        {globalError && (
          <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg relative mb-6 flex items-center gap-3">
            <AlertTriangleIcon className="h-6 w-6" />
            <span>{globalError}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Base Image Section */}
          <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
            <h2 className="text-2xl font-semibold mb-4 text-slate-200 flex items-center gap-2">
              <span className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold">1</span>
              Base Image
            </h2>
            {baseImage ? (
              <div className="relative group">
                <img src={baseImage.url} alt="Base model" className="w-full h-auto object-contain rounded-md max-h-96" />
                <button
                  onClick={removeBaseImage}
                  className="absolute top-2 right-2 bg-red-600/80 hover:bg-red-500 text-white p-2 rounded-full transition-opacity opacity-0 group-hover:opacity-100"
                  aria-label="Remove base image"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-slate-600 border-dashed rounded-lg cursor-pointer bg-slate-800 hover:bg-slate-700/50 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <UploadIcon className="w-10 h-10 mb-3 text-slate-400" />
                  <p className="mb-2 text-sm text-slate-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                  <p className="text-xs text-slate-500">The main person or model</p>
                </div>
                <input type="file" className="hidden" accept="image/*" onChange={handleBaseImageUpload} />
              </label>
            )}
          </div>

          {/* Outfit Images Section */}
          <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
            <h2 className="text-2xl font-semibold mb-4 text-slate-200 flex items-center gap-2">
              <span className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">2</span>
              Outfit Images
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4 max-h-80 overflow-y-auto pr-2">
              {outfitImages.map((image) => (
                <div key={image.id} className="relative group aspect-square">
                  <img src={image.url} alt="Outfit" className="w-full h-full object-cover rounded-md" />
                  <button
                    onClick={() => removeOutfitImage(image.id)}
                    className="absolute top-1 right-1 bg-red-600/80 hover:bg-red-500 text-white p-1 rounded-full transition-opacity opacity-0 group-hover:opacity-100"
                    aria-label="Remove outfit image"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
            <label className="flex items-center justify-center w-full p-3 border-2 border-slate-600 border-dashed rounded-lg cursor-pointer bg-slate-800 hover:bg-slate-700/50 transition-colors">
              <UploadIcon className="w-6 h-6 mr-2 text-slate-400" />
              <span className="text-sm text-slate-400 font-semibold">Add more outfits...</span>
              <input type="file" className="hidden" accept="image/*" multiple onChange={handleOutfitImagesUpload} />
            </label>
          </div>
        </div>

        <div className="text-center mb-10">
          <button
            onClick={handleGenerate}
            disabled={!baseImage || outfitImages.length === 0 || isProcessing}
            className="inline-flex items-center justify-center px-8 py-4 font-bold text-lg text-white rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-indigo-500/50 transform hover:scale-105 disabled:scale-100"
          >
            {isProcessing ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              <>
                <SparklesIcon className="h-6 w-6 mr-2" />
                Generate {outfitImages.length > 0 ? `${outfitImages.length} Image${outfitImages.length > 1 ? 's' : ''}` : ''}
              </>
            )}
          </button>
        </div>

        {jobs.length > 0 && (
          <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
            <h2 className="text-3xl font-bold mb-6 text-slate-200">Results</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {jobs.map(job => (
                <ResultCard key={job.id} job={job} />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;