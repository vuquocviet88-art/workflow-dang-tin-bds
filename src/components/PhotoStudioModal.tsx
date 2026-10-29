import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Download, 
  Image as ImageIcon, 
  Quote, 
  Sparkles, 
  Check, 
  Star,
  RefreshCw,
  Palette
} from 'lucide-react';
import { DriveImage, ProjectFormData } from '../types';

interface PhotoStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: DriveImage[];
  projectData: ProjectFormData;
  onSaveGeneratedImage: (newImage: DriveImage, setAsCover?: boolean) => void;
}

export const PhotoStudioModal: React.FC<PhotoStudioModalProps> = ({
  isOpen,
  onClose,
  images,
  projectData,
  onSaveGeneratedImage,
}) => {
  const [activeMode, setActiveMode] = useState<'thumbnail' | 'quote'>('thumbnail');
  
  // Available backgrounds from selected images or all images
  const backgroundCandidates = images.filter((img) => img.isSelected).length > 0
    ? images.filter((img) => img.isSelected)
    : images;

  const [selectedBgUrl, setSelectedBgUrl] = useState<string>(
    backgroundCandidates[0]?.thumbnailUrl ||
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'
  );

  // Thumbnail Studio Fields
  const [thumbHeadline, setThumbHeadline] = useState<string>(
    `${projectData.subdivision || 'Hải Âu'} - Giá Sốc ${projectData.price || '7 Tỷ'}`
  );
  const [thumbBadge, setThumbBadge] = useState<string>('SỔ ĐỎ CẤT KÉT • BAO THUẾ PHÍ');
  const [thumbSpecs, setThumbSpecs] = useState<string>(
    `${projectData.area || '56'}m² • ${projectData.floors || '5 Tầng'} • ${projectData.frontage || 'MT 4m'}`
  );
  const [thumbHotline, setThumbHotline] = useState<string>(
    `${projectData.contactName || 'Ms Yến'}: ${projectData.phone || '0918 600 050'}`
  );

  // Quote Studio Fields
  const [quoteText, setQuoteText] = useState<string>(
    `"Vị trí kinh doanh đối diện cụm 10 tòa chung cư là đòn bẩy dòng tiền an toàn nhất cho chu kỳ 2026 - 2030."`
  );
  const [quoteAuthor, setQuoteAuthor] = useState<string>(
    `${projectData.contactName || 'Ms Yến'} - Cố Vấn BĐS Cao Cấp Vũ Việt Home`
  );
  const [quoteSubtext, setQuoteSubtext] = useState<string>(
    `Đại đô thị ${projectData.projectName || 'Vinhomes Ocean City'} • Hotline: ${projectData.phone || '0918 600 050'}`
  );

  const [canvasRatio, setCanvasRatio] = useState<'16:9' | '1:1'>('16:9');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isRendering, setIsRendering] = useState(false);
  const [logoImageObj, setLogoImageObj] = useState<HTMLImageElement | null>(null);

  // Preload logo
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = '/assets/aistudio/Logo_Tr_ng_n_n_Deep_Forest_bd0259ac.png';
    img.onload = () => setLogoImageObj(img);
  }, []);

  // Update defaults when projectData changes
  useEffect(() => {
    if (projectData) {
      setThumbHeadline(`${projectData.subdivision || 'Hải Âu'} - Giá Sốc ${projectData.price || '7 Tỷ'}`);
      setThumbSpecs(`${projectData.area || '56'}m² • ${projectData.floors || '5 Tầng'} • ${projectData.frontage || 'MT 4m'}`);
      setThumbHotline(`${projectData.contactName || 'Ms Yến'}: ${projectData.phone || '0918 600 050'}`);
      setQuoteAuthor(`${projectData.contactName || 'Ms Yến'} - Cố Vấn BĐS Cao Cấp Vũ Việt Home`);
      setQuoteSubtext(`Đại đô thị ${projectData.projectName || 'Vinhomes Ocean City'} • Hotline: ${projectData.phone || '0918 600 050'}`);
    }
  }, [projectData]);

  // Main Canvas Render Logic
  const renderCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsRendering(true);

    const width = canvasRatio === '16:9' ? 1280 : 1080;
    const height = canvasRatio === '16:9' ? 720 : 1080;
    canvas.width = width;
    canvas.height = height;

    // Load background image
    const bgImg = new Image();
    bgImg.crossOrigin = 'anonymous';
    bgImg.src = selectedBgUrl;

    bgImg.onload = () => {
      // Draw Cover Image with Aspect Fill
      const imgRatio = bgImg.width / bgImg.height;
      const targetRatio = width / height;
      let drawW = width;
      let drawH = height;
      let startX = 0;
      let startY = 0;

      if (imgRatio > targetRatio) {
        drawW = height * imgRatio;
        startX = (width - drawW) / 2;
      } else {
        drawH = width / imgRatio;
        startY = (height - drawH) / 2;
      }

      ctx.drawImage(bgImg, startX, startY, drawW, drawH);

      if (activeMode === 'thumbnail') {
        // --- THUMBNAIL STUDIO RENDER ---
        // Top Vignette
        const topGrad = ctx.createLinearGradient(0, 0, 0, 160);
        topGrad.addColorStop(0, 'rgba(21, 46, 36, 0.85)'); // Forest Dark
        topGrad.addColorStop(1, 'rgba(21, 46, 36, 0)');
        ctx.fillStyle = topGrad;
        ctx.fillRect(0, 0, width, 160);

        // Bottom Heavy Gradient for Readability (WCAG contrast compliant)
        const botGrad = ctx.createLinearGradient(0, height * 0.35, 0, height);
        botGrad.addColorStop(0, 'rgba(21, 46, 36, 0)');
        botGrad.addColorStop(0.5, 'rgba(27, 58, 45, 0.88)'); // Deep Forest
        botGrad.addColorStop(1, 'rgba(21, 46, 36, 0.98)'); // Forest Dark
        ctx.fillStyle = botGrad;
        ctx.fillRect(0, height * 0.35, width, height * 0.65);

        // Draw Logo or Brand Mark top left
        if (logoImageObj) {
          const logoH = 44;
          const logoW = (logoImageObj.width / logoImageObj.height) * logoH;
          ctx.drawImage(logoImageObj, 40, 32, logoW, logoH);
        } else {
          ctx.fillStyle = '#FBFAF5';
          ctx.font = '700 24px "Cormorant Garamond", Georgia, serif';
          ctx.fillText('VŨ VIỆT HOME', 40, 56);
        }

        // Top Right Exclusive Tag
        ctx.fillStyle = '#C95928'; // Terra Cotta
        const tagText = 'ĐỘC QUYỀN • VUVIETHOME.COM.VN';
        ctx.font = '700 13px "Source Sans 3", sans-serif';
        const tagW = ctx.measureText(tagText).width + 24;
        ctx.beginPath();
        ctx.roundRect(width - tagW - 40, 36, tagW, 30, 8);
        ctx.fill();

        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(tagText, width - tagW - 28, 56);

        // Badge pill above headline
        if (thumbBadge) {
          ctx.fillStyle = '#F5F2E9';
          ctx.font = '700 14px "Source Sans 3", sans-serif';
          const badgeW = ctx.measureText(thumbBadge).width + 28;
          ctx.beginPath();
          ctx.roundRect(40, height - 250, badgeW, 34, 6);
          ctx.fill();

          ctx.fillStyle = '#1B3A2D';
          ctx.fillText(thumbBadge, 54, height - 228);
        }

        // Main Headline (Cormorant Garamond)
        ctx.fillStyle = '#FBFAF5';
        ctx.font = '700 48px "Cormorant Garamond", Georgia, serif';
        ctx.shadowColor = 'rgba(0,0,0,0.6)';
        ctx.shadowBlur = 8;
        ctx.fillText(thumbHeadline, 40, height - 165);
        ctx.shadowBlur = 0;

        // Key Specs Bar
        ctx.fillStyle = '#F5F2E9';
        ctx.font = '600 20px "Source Sans 3", sans-serif';
        ctx.fillText(thumbSpecs, 40, height - 118);

        // Bottom Bar: Deep Forest with Terra Cotta Accent
        ctx.fillStyle = '#152E24';
        ctx.fillRect(40, height - 85, width - 80, 50);

        ctx.fillStyle = '#C95928';
        ctx.fillRect(40, height - 85, 6, 50);

        ctx.fillStyle = '#FFFFFF';
        ctx.font = '600 17px "Source Sans 3", sans-serif';
        ctx.fillText('HOTLINE CHUYÊN GIA:', 60, height - 54);

        ctx.fillStyle = '#F5F2E9';
        ctx.font = '700 19px "Source Sans 3", sans-serif';
        ctx.fillText(thumbHotline, 235, height - 54);

      } else {
        // --- QUOTE STUDIO RENDER ("Quiet Luxury" Style) ---
        // Full overlay with deep forest tone
        const overlay = ctx.createLinearGradient(0, 0, width, height);
        overlay.addColorStop(0, 'rgba(27, 58, 45, 0.92)'); // Deep Forest
        overlay.addColorStop(1, 'rgba(21, 46, 36, 0.96)'); // Forest Dark
        ctx.fillStyle = overlay;
        ctx.fillRect(0, 0, width, height);

        // Subtle geometric frame in Beige #E5E0D3 with low opacity
        ctx.strokeStyle = 'rgba(245, 242, 233, 0.2)';
        ctx.lineWidth = 1;
        ctx.strokeRect(30, 30, width - 60, height - 60);

        // Top Brand Logo
        if (logoImageObj) {
          const logoH = 48;
          const logoW = (logoImageObj.width / logoImageObj.height) * logoH;
          ctx.drawImage(logoImageObj, (width - logoW) / 2, 60, logoW, logoH);
        }

        // Giant Elegant Double Quotes Icon “
        ctx.fillStyle = '#C95928'; // Terra Cotta
        ctx.font = '700 90px "Cormorant Garamond", Georgia, serif';
        ctx.textAlign = 'center';
        ctx.fillText('“', width / 2, 210);

        // Main Quote Text (Wrap nicely)
        ctx.fillStyle = '#FBFAF5'; // Ivory
        ctx.font = '600 32px "Cormorant Garamond", Georgia, serif';
        ctx.textAlign = 'center';

        const words = quoteText.replace(/^["“”]|["“”]$/g, '').split(' ');
        let line = '';
        const lines: string[] = [];
        const maxWidth = width - 180;

        for (let n = 0; n < words.length; n++) {
          const testLine = line + words[n] + ' ';
          const metrics = ctx.measureText(testLine);
          if (metrics.width > maxWidth && n > 0) {
            lines.push(line.trim());
            line = words[n] + ' ';
          } else {
            line = testLine;
          }
        }
        lines.push(line.trim());

        const startY = 270;
        const lineHeight = 44;
        lines.forEach((l, i) => {
          ctx.fillText(`“${l}${i === lines.length - 1 ? '”' : ''}`, width / 2, startY + i * lineHeight);
        });

        // Golden divider line
        const divY = startY + lines.length * lineHeight + 40;
        ctx.strokeStyle = '#C95928';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(width / 2 - 50, divY);
        ctx.lineTo(width / 2 + 50, divY);
        ctx.stroke();

        // Author Name
        ctx.fillStyle = '#FBFAF5';
        ctx.font = '700 22px "Source Sans 3", sans-serif';
        ctx.fillText(quoteAuthor, width / 2, divY + 45);

        // Subtext / Hotline
        ctx.fillStyle = '#F5F2E9';
        ctx.font = '400 15px "Source Sans 3", sans-serif';
        ctx.fillText(quoteSubtext, width / 2, divY + 75);

        // Reset text alignment
        ctx.textAlign = 'left';
      }

      setIsRendering(false);
    };

    bgImg.onerror = () => {
      // Fallback solid background if image fails
      ctx.fillStyle = '#1B3A2D';
      ctx.fillRect(0, 0, width, height);
      setIsRendering(false);
    };
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(renderCanvas, 100);
    }
  }, [isOpen, activeMode, selectedBgUrl, thumbHeadline, thumbBadge, thumbSpecs, thumbHotline, quoteText, quoteAuthor, quoteSubtext, canvasRatio, logoImageObj]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `${activeMode === 'thumbnail' ? 'thumbnail' : 'quote'}-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const handleApplyAsCover = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    
    const newImg: DriveImage = {
      id: `generated-${Date.now()}`,
      title: activeMode === 'thumbnail' ? `Thumbnail Bìa: ${thumbHeadline}` : `Quote: ${quoteAuthor}`,
      originalUrl: dataUrl,
      thumbnailUrl: dataUrl,
      directViewUrl: dataUrl,
      webUrl: dataUrl,
      isCover: true,
      isSelected: true,
      category: activeMode === 'thumbnail' ? 'Ảnh Bìa / Hero Shot' : 'Ảnh Quote Chuyên Gia',
      categoryType: 'hero',
      seoFilename: `${activeMode}-${Date.now()}.png`,
    };

    onSaveGeneratedImage(newImg, true);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-[#FBFAF5] rounded-2xl shadow-2xl border border-[#DCD5C5] overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-[#1B3A2D] text-white flex items-center justify-between border-b border-[#2C5E4A]">
          <div className="flex items-center gap-3">
            <span className="p-2 bg-[#C95928] rounded-xl text-white shadow-sm">
              <Sparkles className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-serif-brand font-bold text-lg text-[#FBFAF5]">
                Studio Thiết Kế Ảnh Thumbnail & Quote (Brand Guide VuVietHome)
              </h3>
              <p className="text-xs text-[#F5F2E9]/75">
                Vẽ đồ họa canvas độ nét cao với logo, font Cormorant Garamond, bảng màu Deep Forest & Terra Cotta.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Studio Tabs & Controls */}
        <div className="flex items-center justify-between px-6 py-2.5 bg-[#F5F2E9] border-b border-[#E5E0D3] text-xs">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setActiveMode('thumbnail');
                setCanvasRatio('16:9');
              }}
              className={`px-4 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
                activeMode === 'thumbnail'
                  ? 'bg-[#1B3A2D] text-white shadow-sm'
                  : 'bg-white text-[#333333] border border-[#DCD5C5] hover:bg-white/80'
              }`}
            >
              <ImageIcon className="w-4 h-4 text-[#C95928]" />
              Skill Tạo Ảnh Thumbnail (16:9)
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveMode('quote');
                setCanvasRatio('1:1');
              }}
              className={`px-4 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
                activeMode === 'quote'
                  ? 'bg-[#1B3A2D] text-white shadow-sm'
                  : 'bg-white text-[#333333] border border-[#DCD5C5] hover:bg-white/80'
              }`}
            >
              <Quote className="w-4 h-4 text-[#C95928]" />
              Skill Tạo Ảnh Quote Chuyên Gia
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium">Tỷ lệ:</span>
            <button
              type="button"
              onClick={() => setCanvasRatio('16:9')}
              className={`px-2.5 py-1 rounded-lg font-semibold ${
                canvasRatio === '16:9' ? 'bg-[#1B3A2D] text-white' : 'bg-white border text-slate-700'
              }`}
            >
              16:9
            </button>
            <button
              type="button"
              onClick={() => setCanvasRatio('1:1')}
              className={`px-2.5 py-1 rounded-lg font-semibold ${
                canvasRatio === '1:1' ? 'bg-[#1B3A2D] text-white' : 'bg-white border text-slate-700'
              }`}
            >
              1:1
            </button>
          </div>
        </div>

        {/* Studio Content Grid */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Canvas Preview Area (Col 7) */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center bg-[#152E24]/5 border border-[#E5E0D3] rounded-2xl p-4">
            <div className="relative w-full flex items-center justify-center overflow-hidden rounded-xl shadow-lg bg-black/10">
              <canvas
                ref={canvasRef}
                className="max-w-full max-h-[380px] object-contain rounded-xl shadow-inner transition-all"
              />
              {isRendering && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-xs gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin text-[#C95928]" />
                  Đang vẽ canvas...
                </div>
              )}
            </div>

            {/* Quick Actions Under Canvas */}
            <div className="mt-4 w-full flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleDownload}
                className="px-4 py-2 bg-white hover:bg-slate-50 text-[#1B3A2D] border border-[#DCD5C5] rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all"
              >
                <Download className="w-4 h-4 text-[#C95928]" />
                Tải ảnh PNG về máy
              </button>

              <button
                type="button"
                onClick={handleApplyAsCover}
                className="px-4 py-2 bg-[#C95928] hover:bg-[#A8471F] text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition-all"
              >
                <Star className="w-4 h-4 fill-white" />
                Đặt làm Ảnh bìa bài viết
              </button>
            </div>
          </div>

          {/* Controls & Customization Area (Col 5) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Background Image Picker */}
            <div>
              <label className="block text-xs font-bold text-[#1B3A2D] mb-2 flex items-center justify-between">
                <span>Chọn ảnh nền từ kho ảnh:</span>
                <span className="text-[11px] text-[#C95928] font-normal">
                  ({backgroundCandidates.length} ảnh sẵn có)
                </span>
              </label>
              <div className="grid grid-cols-4 gap-2 max-h-36 overflow-y-auto p-1.5 bg-[#F5F2E9] rounded-xl border border-[#E5E0D3]">
                {backgroundCandidates.map((img) => (
                  <button
                    key={img.id}
                    type="button"
                    onClick={() => setSelectedBgUrl(img.thumbnailUrl)}
                    className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all ${
                      selectedBgUrl === img.thumbnailUrl
                        ? 'border-[#C95928] ring-2 ring-[#C95928]/40 scale-95'
                        : 'border-transparent opacity-75 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img.thumbnailUrl}
                      alt={img.title}
                      className="w-full h-full object-cover"
                    />
                    {selectedBgUrl === img.thumbnailUrl && (
                      <span className="absolute top-1 right-1 bg-[#C95928] text-white rounded-full p-0.5">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Mode-specific Fields */}
            {activeMode === 'thumbnail' ? (
              <div className="space-y-3 bg-white p-4 rounded-xl border border-[#E5E0D3] shadow-sm">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#1B3A2D] border-b pb-2">
                  <Palette className="w-4 h-4 text-[#C95928]" />
                  <span>Tùy chỉnh Nội dung Thumbnail (CTR Cao)</span>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Tiêu đề giật tít chính (Headline):
                  </label>
                  <input
                    type="text"
                    value={thumbHeadline}
                    onChange={(e) => setThumbHeadline(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-[#FBFAF5] border border-[#DCD5C5] rounded-lg font-serif-brand font-bold text-[#1B3A2D]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Badge đòn bẩy / Pháp lý (Pill trên cùng):
                  </label>
                  <input
                    type="text"
                    value={thumbBadge}
                    onChange={(e) => setThumbBadge(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-[#FBFAF5] border border-[#DCD5C5] rounded-lg text-[#1B3A2D] font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Thông số nổi bật (Diện tích, Tầng, Mặt tiền):
                  </label>
                  <input
                    type="text"
                    value={thumbSpecs}
                    onChange={(e) => setThumbSpecs(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-[#FBFAF5] border border-[#DCD5C5] rounded-lg text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Hotline & Tên chuyên viên:
                  </label>
                  <input
                    type="text"
                    value={thumbHotline}
                    onChange={(e) => setThumbHotline(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-[#FBFAF5] border border-[#DCD5C5] rounded-lg text-[#C95928] font-bold"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-3 bg-white p-4 rounded-xl border border-[#E5E0D3] shadow-sm">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#1B3A2D] border-b pb-2">
                  <Quote className="w-4 h-4 text-[#C95928]" />
                  <span>Tùy chỉnh Ảnh Quote ("Quiet Luxury")</span>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Câu châm ngôn / Nhận định sắc bén:
                  </label>
                  <textarea
                    rows={3}
                    value={quoteText}
                    onChange={(e) => setQuoteText(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-[#FBFAF5] border border-[#DCD5C5] rounded-lg font-serif-brand font-medium text-[#1B3A2D]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Tên & Chức danh chuyên gia:
                  </label>
                  <input
                    type="text"
                    value={quoteAuthor}
                    onChange={(e) => setQuoteAuthor(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-[#FBFAF5] border border-[#DCD5C5] rounded-lg font-bold text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Dự án & Hotline liên hệ:
                  </label>
                  <input
                    type="text"
                    value={quoteSubtext}
                    onChange={(e) => setQuoteSubtext(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-[#FBFAF5] border border-[#DCD5C5] rounded-lg text-[#C95928] font-semibold"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-[#F5F2E9] border-t border-[#E5E0D3] flex items-center justify-between text-xs">
          <span className="text-slate-500">
            * Màu sắc và typography tuân thủ nghiêm ngặt Brand Guide chính thức VuVietHome.com.vn (Deep Forest #1B3A2D & Terra Cotta #C95928).
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-[#1B3A2D] hover:bg-[#2C5E4A] text-white rounded-xl font-bold transition-colors cursor-pointer"
          >
            Đóng Studio
          </button>
        </div>
      </div>
    </div>
  );
};
