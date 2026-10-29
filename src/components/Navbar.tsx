import React, { useState } from 'react';
import { 
  Search, 
  FileText, 
  FolderGit2, 
  Database, 
  Send, 
  CheckCircle2,
  Building2,
  Share2,
  Copy,
  ExternalLink,
  Check,
  X,
  AlertTriangle,
  ShieldCheck
} from 'lucide-react';
import { FOUR_VINHOMES_PROJECTS, ProjectPreset } from '../data/samplePresets';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedProject: ProjectPreset;
  onSelectProject: (project: ProjectPreset) => void;
  hasAnalysis: boolean;
  hasListings: boolean;
  selectedImagesCount: number;
  hasNotionConfigured: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  selectedProject,
  onSelectProject,
  hasAnalysis,
  hasListings,
  selectedImagesCount,
  hasNotionConfigured,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const SHARED_APP_URL = 'https://ais-pre-oe267xdg35uvswmp7pkdnu-892567149226.asia-east1.run.app';

  const getPublicShareUrl = () => {
    if (typeof window !== 'undefined') {
      const origin = window.location.origin;
      if (origin.includes('ais-dev-')) {
        return origin.replace('ais-dev-', 'ais-pre-');
      }
      if (origin.includes('ais-pre-')) {
        return origin;
      }
    }
    return SHARED_APP_URL;
  };

  const handleCopyAppUrl = () => {
    // ALWAYS copy the shared preview URL (ais-pre-), NEVER the private dev URL (ais-dev-)
    const urlToCopy = getPublicShareUrl();
    navigator.clipboard.writeText(urlToCopy);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const steps = [
    {
      id: 'research',
      title: 'I. PHÂN TÍCH',
      subtitle: 'Nghiên Cứu & Đối Thủ',
      icon: Search,
      isDone: hasAnalysis,
    },
    {
      id: 'content',
      title: 'II. SOẠN TIN',
      subtitle: 'Quy trình tinh gọn cho sale',
      icon: FileText,
      isDone: hasListings,
    },
    {
      id: 'publish',
      title: 'III. XUẤT BẢN',
      subtitle: 'Lưu Notion & Prompt AI Đăng Tin',
      icon: Send,
      isDone: hasNotionConfigured,
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#1B3A2D] text-[#FBFAF5] border-b border-[#2C5E4A] shadow-md">
      {/* Top bar: Logo, App Title side-by-side, Quick Link Share, Project Selector */}
      {/* Top bar: Logo & App Title horizontally aligned */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="h-10 flex items-center justify-center rounded-lg overflow-hidden bg-[#152E24] px-2.5 py-1 border border-[#2C5E4A] shrink-0 shadow-sm">
            <img
              src="/assets/aistudio/Logo_Tr_ng_n_n_Deep_Forest_bd0259ac.png"
              alt="Logo Vũ Việt Home"
              className="h-7 w-auto object-contain"
            />
          </div>

          <div className="flex items-center gap-2.5">
            <h1 
              className="text-xl sm:text-2xl font-bold font-serif-brand tracking-normal select-none"
              style={{
                color: '#FF6B35',
              }}
            >
              Workflow Đăng Tin BĐS
            </h1>
            <span className="text-[11px] font-semibold bg-[#2C5E4A] text-[#FBFAF5]/90 px-2 py-0.5 rounded-full border border-[#3b795f]">
              Vũ Việt Home
            </span>
          </div>
        </div>
      </div>

       {/* Workflow Steps Tabs */}
       <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 border-t border-[#2C5E4A]/60 bg-[#152E24]/60">
         <nav className="flex overflow-x-auto no-scrollbar gap-1 py-1.5" aria-label="Workflow Steps">
           {steps.map((step) => {
             const Icon = step.icon;
             const isActive = activeTab === step.id;
             return (
               <button
                 key={step.id}
                 onClick={() => setActiveTab(step.id)}
                 className={`flex-1 min-w-[175px] sm:min-w-[205px] px-3.5 py-2.5 rounded-xl text-left transition-all relative flex items-center gap-2.5 cursor-pointer ${
                   isActive
                     ? 'bg-[#2C5E4A] text-white shadow-sm ring-1 ring-[#C95928]/50'
                     : 'text-[#FBFAF5]/70 hover:text-white hover:bg-[#2C5E4A]/30'
                 }`}
               >
                 <div
                   className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                     isActive
                       ? 'bg-[#C95928] text-white font-bold shadow-sm'
                       : step.isDone
                       ? 'bg-[#1B3A2D] text-[#FBFAF5] border border-[#2C5E4A]'
                       : 'bg-[#1B3A2D]/80 text-[#FBFAF5]/50 border border-[#2C5E4A]/40'
                   }`}
                 >
                   {step.isDone && !isActive ? (
                     <CheckCircle2 className="w-4 h-4 text-[#FBFAF5]" />
                   ) : (
                     <Icon className="w-4 h-4" />
                   )}
                 </div>
                 <div className="overflow-hidden">
                   <div className="text-sm font-bold tracking-wide uppercase truncate leading-tight flex items-center gap-1">
                     {step.title}
                   </div>
                   <div className="text-xs text-[#FBFAF5]/70 truncate mt-0.5">
                     {step.subtitle}
                   </div>
                 </div>
                 {isActive && (
                   <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-[#C95928] rounded-full" />
                 )}
               </button>
             );
           })}
         </nav>
      </div>
      {/* Share / Fix 403 Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn text-[#333333]">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-[#E5E0D3] space-y-5">
            <div className="flex items-start justify-between border-b border-[#E5E0D3] pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-[#FF6B35]/10 text-[#C95928] rounded-xl">
                  <Share2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold font-serif-brand text-[#1B3A2D]">
                    Khắc Phục Lỗi 403 &amp; Chia Sẻ Link Dùng Nhanh
                  </h3>
                  <p className="text-xs text-slate-500">
                    Dành cho Sale và người ngoài truy cập không bị lỗi &quot;403. That&apos;s an error&quot;
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Error Cause Explanation */}
            <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-2">
              <div className="flex items-center gap-2 font-bold text-amber-800">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Vì sao người khác bị lỗi 403: We&apos;re sorry, but you do not have access?</span>
              </div>
              <p className="leading-relaxed">
                Đường link bắt đầu bằng <code className="bg-amber-100 px-1 py-0.5 rounded font-mono font-bold text-amber-950">ais-dev-...</code> là link <strong>xem trước nội bộ (Development)</strong>, được Google khóa bằng tài khoản cá nhân của bạn (<span className="font-semibold">VuQuocViet88@gmail.com</span>). Khi gửi cho người khác hoặc mở ẩn danh, Google sẽ báo lỗi <strong>403 Forbidden</strong>.
              </p>
            </div>

            {/* Correct Public Link Box */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#1B3A2D] flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Đường Link Chia Sẻ Chuẩn Cho Người Khác (Shared URL):
                </span>
                <span className="text-[11px] font-normal text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  ais-pre-...run.app
                </span>
              </label>

              <div className="flex items-center gap-2 bg-[#FBFAF5] border-2 border-emerald-500/40 rounded-xl p-2.5">
                <input
                  type="text"
                  readOnly
                  value={getPublicShareUrl()}
                  className="bg-transparent font-mono text-xs text-slate-800 flex-1 outline-none select-all"
                />
                <button
                  type="button"
                  onClick={handleCopyAppUrl}
                  className="px-3.5 py-1.5 bg-[#1B3A2D] hover:bg-[#2C5E4A] text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer shadow-sm"
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Đã chép!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Chép link</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* 2 Step Checklist */}
            <div className="space-y-2.5 text-xs text-slate-700">
              <div className="font-bold text-[#1B3A2D] flex items-center gap-1.5">
                <span>📋 Quy trình 2 bước để người khác truy cập mượt mà:</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-start gap-2.5 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <span className="w-5 h-5 rounded-full bg-[#1B3A2D] text-white flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5">
                    1
                  </span>
                  <div>
                    <strong className="text-slate-900">Gửi đúng link Shared (ais-pre-):</strong>
                    <p className="text-slate-600 text-[11px] mt-0.5">
                      Chỉ gửi link copy từ nút &quot;Link Dùng Nhanh&quot; hoặc ô trên (có tiền tố <code className="bg-slate-200 px-1 py-0.5 rounded font-mono">ais-pre-</code>). Tuyệt đối không copy trực tiếp thanh địa chỉ trình duyệt khi đang code trên AI Studio.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <span className="w-5 h-5 rounded-full bg-[#C95928] text-white flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5">
                    2
                  </span>
                  <div>
                    <strong className="text-slate-900">Bật quyền chia sẻ trong Google AI Studio:</strong>
                    <p className="text-slate-600 text-[11px] mt-0.5">
                      Ở góc trên cùng bên phải màn hình làm việc Google AI Studio Build (ngoài giao diện web này), bấm nút <strong>Share</strong> (Chia sẻ) &rarr; chọn <strong>&quot;Anyone with the link&quot;</strong> (Bất kỳ ai có liên kết) hoặc thêm email của người nhận nếu bạn muốn hạn chế.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2.5 border-t border-[#E5E0D3] pt-4">
              <a
                href={getPublicShareUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Mở tab mới kiểm tra</span>
              </a>
              <button
                type="button"
                onClick={() => setShowShareModal(false)}
                className="px-5 py-2 bg-[#C95928] hover:bg-[#A8471F] text-white text-xs font-bold rounded-xl transition-colors shadow-sm cursor-pointer"
              >
                Đã hiểu &amp; Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
