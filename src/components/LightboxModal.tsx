import React from 'react';
import { X, ExternalLink } from 'lucide-react';
import { DriveImage } from '../types';

interface LightboxModalProps {
  image: DriveImage | null;
  onClose: () => void;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({ image, onClose }) => {
  if (!image) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#152E24]/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative max-w-4xl w-full max-h-[90vh] flex flex-col items-center">
        {/* Top actions */}
        <div className="w-full flex items-center justify-between text-[#FBFAF5] pb-3 px-1">
          <div>
            <h4 className="text-base font-bold font-serif-brand truncate max-w-md text-white">{image.title}</h4>
            <span className="text-xs text-[#F5F2E9]/70">{image.category || 'Vũ Việt Home Image Library'}</span>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={image.directViewUrl}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 rounded-xl bg-[#1B3A2D] hover:bg-[#2C5E4A] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors border border-[#2C5E4A]"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#C95928]" />
              <span className="hidden sm:inline">Mở ảnh gốc</span>
            </a>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl bg-[#1B3A2D] hover:bg-rose-900/60 hover:text-white text-[#FBFAF5] transition-colors border border-[#2C5E4A] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main image */}
        <div className="relative rounded-2xl overflow-hidden bg-[#1B3A2D] border border-[#2C5E4A] max-h-[75vh] flex items-center justify-center p-1 shadow-2xl">
          <img
            src={image.directViewUrl || image.thumbnailUrl}
            alt={image.title}
            className="max-h-[75vh] w-auto object-contain rounded-xl"
            onError={(e) => {
              (e.target as HTMLImageElement).src = image.thumbnailUrl;
            }}
          />
        </div>
      </div>
    </div>
  );
};
