"use client";

import { useEffect } from "react";

interface ModelViewerWrapperProps {
  src: string;
  poster?: string;
  alt: string;
  className?: string;
  autoRotate?: boolean;
  cameraOrbit?: string;
  interactionPrompt?: boolean;
}

export function ModelViewerWrapper({
  src,
  poster,
  alt,
  className = "",
  autoRotate = true,
  cameraOrbit = "0deg 75deg 105%",
  interactionPrompt = true,
}: ModelViewerWrapperProps) {
  useEffect(() => {
    import("@google/model-viewer");
  }, []);

  return (
    // @ts-expect-error model-viewer is a web component
    <model-viewer
      src={src}
      poster={poster}
      alt={alt}
      camera-controls
      touch-action="pan-y"
      auto-rotate={autoRotate || undefined}
      auto-rotate-delay={2000}
      loading="lazy"
      shadow-intensity="0"
      shadow-softness="0.5"
      exposure="3"
      environment-image="neutral"
      tone-mapping="commerce"
      camera-orbit={cameraOrbit}
      min-camera-orbit="auto auto 50%"
      max-camera-orbit="auto auto 200%"
      interaction-prompt={interactionPrompt ? "auto" : "none"}
      style={{ width: "100%", height: "100%" }}
      className={className}
    >
      <div
        slot="poster"
        className="flex h-full w-full items-center justify-center bg-surface"
      >
        {poster ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={poster} alt={alt} className="h-full w-full object-contain" />
        ) : (
          <div className="flex flex-col items-center gap-2 text-text-muted">
            <svg
              className="h-12 w-12 animate-spin"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            <span className="text-sm">Cargando 3D...</span>
          </div>
        )}
      </div>
      {/* @ts-expect-error model-viewer slot */}
    </model-viewer>
  );
}
