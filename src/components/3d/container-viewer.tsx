"use client";

import { useState } from "react";
import { ModelViewerWrapper } from "./model-viewer-wrapper";
import { Maximize2, Minimize2, RotateCcw } from "lucide-react";

interface ContainerViewerProps {
  src: string;
  poster?: string;
  alt: string;
  className?: string;
}

export function ContainerViewer({
  src,
  poster,
  alt,
  className = "",
}: ContainerViewerProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  function toggleFullscreen() {
    setIsFullscreen(!isFullscreen);
  }

  function resetCamera() {
    const mv = document.querySelector("model-viewer") as HTMLElement & {
      cameraOrbit: string;
      resetTurntableRotation: () => void;
    };
    if (mv) {
      mv.cameraOrbit = "0deg 75deg 105%";
    }
  }

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-white">
        <div className="absolute right-4 top-4 z-10 flex gap-2">
          <button
            onClick={resetCamera}
            className="rounded-full bg-white/90 p-2 shadow-md transition-colors hover:bg-white"
            title="Reset camera"
          >
            <RotateCcw className="h-5 w-5 text-text" />
          </button>
          <button
            onClick={toggleFullscreen}
            className="rounded-full bg-white/90 p-2 shadow-md transition-colors hover:bg-white"
            title="Exit fullscreen"
          >
            <Minimize2 className="h-5 w-5 text-text" />
          </button>
        </div>
        <ModelViewerWrapper src={src} poster={poster} alt={alt} />
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-surface ${className}`}
    >
      <div className="absolute right-3 top-3 z-10 flex gap-2">
        <button
          onClick={resetCamera}
          className="rounded-full bg-white/90 p-2 shadow-md transition-colors hover:bg-white"
          title="Reset camera"
        >
          <RotateCcw className="h-4 w-4 text-text" />
        </button>
        <button
          onClick={toggleFullscreen}
          className="rounded-full bg-white/90 p-2 shadow-md transition-colors hover:bg-white"
          title="Fullscreen"
        >
          <Maximize2 className="h-4 w-4 text-text" />
        </button>
      </div>
      <ModelViewerWrapper src={src} poster={poster} alt={alt} />
    </div>
  );
}
