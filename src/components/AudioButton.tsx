import React, { useState } from 'react';
import { Volume2 } from 'lucide-react';
import { britishAudio } from '../lib/audio';

interface AudioButtonProps {
  word: string;
  rate?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showLabel?: boolean;
}

export const AudioButton: React.FC<AudioButtonProps> = ({
  word,
  rate = 0.88,
  size = 'md',
  className = '',
  showLabel = false,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPlaying) {
      britishAudio.stop();
      setIsPlaying(false);
      return;
    }

    setIsPlaying(true);
    britishAudio.speak(
      word,
      rate,
      () => setIsPlaying(false),
      () => setIsPlaying(false)
    );
  };

  const sizeClasses = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-11 h-11 text-base',
  };

  const iconSizes = {
    sm: 14,
    md: 18,
    lg: 22,
  };

  return (
    <button
      type="button"
      onClick={handlePlay}
      title="Nghe phát âm chuẩn Anh - Anh (UK)"
      className={`inline-flex items-center justify-center rounded-full transition-all duration-150 border active:scale-95 ${
        isPlaying
          ? 'bg-brand-600 text-white border-brand-700 shadow-sm'
          : 'bg-white hover:bg-brand-50 text-brand-700 border-stone-200 hover:border-brand-300'
      } ${sizeClasses[size]} ${className}`}
      aria-label={`Nghe phát âm từ ${word}`}
    >
      <Volume2
        size={iconSizes[size]}
        className={`transition-transform duration-200 ${isPlaying ? 'scale-110' : ''}`}
      />
      {showLabel && (
        <span className="ml-1.5 font-medium text-xs text-stone-600">
          UK {isPlaying ? 'Đang đọc...' : 'Phát âm'}
        </span>
      )}
    </button>
  );
};
