import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Music, Volume2, VolumeX, Play, Pause } from 'lucide-react';

interface MusicPlayerProps {
  shouldPlay: boolean;
}

export default function MusicPlayer({ shouldPlay }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Send command to YouTube iframe player
  const sendPlayerCommand = (func: string, args: any[] = []) => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      try {
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({
            event: 'command',
            func: func,
            args: args,
          }),
          '*'
        );
      } catch (e) {
        console.error('Error sending player command:', e);
      }
    }
  };

  // Play/Pause toggler
  const togglePlay = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    
    if (isPlaying) {
      sendPlayerCommand('pauseVideo');
      setIsPlaying(false);
    } else {
      sendPlayerCommand('playVideo');
      setIsPlaying(true);
      // Unmute if playing for the first time
      if (isMuted) {
        sendPlayerCommand('unMute');
        setIsMuted(false);
      }
    }
  };

  // Mute/Unmute toggler
  const toggleMute = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }

    if (isMuted) {
      sendPlayerCommand('unMute');
      setIsMuted(false);
      // If was paused, play it
      if (!isPlaying) {
        sendPlayerCommand('playVideo');
        setIsPlaying(true);
      }
    } else {
      sendPlayerCommand('mute');
      setIsMuted(true);
    }
  };

  // Handle auto-playback when trigger changes to true
  useEffect(() => {
    if (shouldPlay && iframeLoaded) {
      // Small timeout to allow user interaction context to register
      const timer = setTimeout(() => {
        sendPlayerCommand('setVolume', [45]); // Pleasant background volume
        sendPlayerCommand('unMute');
        sendPlayerCommand('playVideo');
        setIsPlaying(true);
        setIsMuted(false);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [shouldPlay, iframeLoaded]);

  return (
    <>
      {/* Invisible YouTube Iframe Player styled perfectly to be off-screen and non-intrusive */}
      <iframe
        ref={iframeRef}
        id="youtube-bg-player"
        width="1"
        height="1"
        src={`https://www.youtube.com/embed/sxFhAoxzYXc?enablejsapi=1&autoplay=0&controls=0&loop=1&playlist=sxFhAoxzYXc&origin=${typeof window !== 'undefined' ? encodeURIComponent(window.location.origin) : ''}`}
        allow="autoplay; encrypted-media"
        className="fixed -left-10 -top-10 w-[1px] h-[1px] opacity-0 pointer-events-none z-0"
        onLoad={() => setIframeLoaded(true)}
        title="Background Music Player"
      />

      {/* Floating Interactive Audio Hub Control */}
      <AnimatePresence>
        {shouldPlay && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 15 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
            className="fixed bottom-24 right-6 z-45"
            id="music-control-floating-widget"
          >
            <div className="flex items-center gap-2 bg-white/95 backdrop-blur-md border border-stone-200/80 rounded-full p-1.5 shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_10px_35px_rgb(0,0,0,0.1)] hover:border-stone-300 transition-all group">
              {/* Spinning / Pulsing Music Visualizer Bar */}
              <button
                onClick={togglePlay}
                className="w-10 h-10 rounded-full bg-sage-50 border border-sage-200 flex items-center justify-center text-sage-800 hover:bg-sage-700 hover:text-white transition-all cursor-pointer relative overflow-hidden group/btn"
                title={isPlaying ? "Pause Music" : "Play Music"}
              >
                {isPlaying ? (
                  /* Animated Audio Waves */
                  <div className="flex items-end gap-[2px] h-3">
                    <span className="w-[2px] h-2 bg-current rounded-full animate-pulse" style={{ animationDuration: '0.6s' }} />
                    <span className="w-[2px] h-3 bg-current rounded-full animate-pulse" style={{ animationDuration: '0.8s', animationDelay: '0.15s' }} />
                    <span className="w-[2px] h-1.5 bg-current rounded-full animate-pulse" style={{ animationDuration: '0.5s', animationDelay: '0.3s' }} />
                    <span className="w-[2px] h-2.5 bg-current rounded-full animate-pulse" style={{ animationDuration: '0.7s', animationDelay: '0.05s' }} />
                  </div>
                ) : (
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                )}
              </button>

              {/* Collapsed/Expanded Sound controls */}
              <div className="flex items-center gap-1.5 pr-3 pl-1 font-serif text-xs font-medium tracking-tight text-stone-700 select-none">
                <span className="hidden sm:inline-block max-w-[90px] truncate">Wedding Song</span>
                
                <div className="w-[1px] h-4 bg-stone-200 mx-1 hidden sm:block" />

                <button
                  onClick={toggleMute}
                  className="p-1 text-stone-500 hover:text-sage-800 active:scale-90 transition-all cursor-pointer"
                  title={isMuted ? "Unmute Music" : "Mute Music"}
                >
                  {isMuted ? (
                    <VolumeX className="w-4 h-4 text-red-500" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
