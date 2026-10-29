import React, { useState, useEffect } from 'react';
import { 
  FolderGit2, 
  Sparkles, 
  Check, 
  Copy, 
  ExternalLink, 
  Maximize2, 
  Star, 
  ArrowRight, 
  AlertCircle, 
  Plus, 
  CheckSquare, 
  Square,
  Search,
  FolderPlus,
  CheckCircle2,
  Image as ImageIcon,
  Quote,
  Layers,
  FileCheck,
  Tag,
  ShieldCheck,
  LogOut,
  FolderOpen
} from 'lucide-react';
import { DriveImage, ProjectFormData, PhotoPlanProposal } from '../types';
import { LightboxModal } from './LightboxModal';
import { PhotoStudioModal } from './PhotoStudioModal';
import { 
  KNOWN_PROJECT_DRIVE_FOLDERS, 
  BROLL_LIBRARY_CONFIG, 
  generateListingFolderName, 
  generateSeoFilename, 
  matchParentFolderConfig,
  abbreviatePropertyType 
} from '../lib/driveService';
import { 
  generatePhotoPlanProposal, 
  getRecommendedPhotosForProject,
  COMPREHENSIVE_BROLL_LIBRARY 
} from '../data/brollLibrary';
import { 
  initAuth, 
  googleSignIn, 
  logoutGoogle, 
  getCurrentUser, 
  getAccessToken 
} from '../lib/firebaseAuth';

interface ModuleDriveLibraryProps {
  images: DriveImage[];
  setImages: React.Dispatch<React.SetStateAction<DriveImage[]>>;
  projectData: ProjectFormData;
  driveFolderUrl?: string;
  setDriveFolderUrl?: (url: string) => void;
  onNextStep: () => void;
}

export const ModuleDriveLibrary: React.FC<ModuleDriveLibraryProps> = ({
  images,
  setImages,
  projectData,
  driveFolderUrl = '',
  setDriveFolderUrl,
  onNextStep,
}) => {
  // Auth state
  const [user, setUser] = useState<any>(getCurrentUser());
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);

  // Tab mode for source collection: 'existing' (Phương án 1) or 'ai_broll' (Phương án 2)
  const [collectionMethod, setCollectionMethod] = useState<'existing' | 'ai_broll'>('ai_broll');

  // Input fields
  const [driveInput, setDriveInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [lightboxImage, setLightboxImage] = useState<DriveImage | null>(null);
  const [isStudioOpen, setIsStudioOpen] = useState(false);

  // Filter for B-roll library
  const [brollFilterProject, setBrollFilterProject] = useState<string>('all');
  const [brollSearchKeyword, setBrollSearchKeyword] = useState<string>('');

  // AI Photo Plan Proposal
  const [photoProposal, setPhotoProposal] = useState<PhotoPlanProposal>(() => 
    generatePhotoPlanProposal(projectData)
  );

  // Step 3: Folder creation settings
  const defaultParentFolder = matchParentFolderConfig(projectData.projectName);
  const [selectedParentFolderId, setSelectedParentFolderId] = useState<string>(defaultParentFolder.folderId);
  const [customParentFolderUrl, setCustomParentFolderUrl] = useState<string>('');
  const [folderName, setFolderName] = useState<string>(() => generateListingFolderName(projectData));

  // Folder creation action state
  const [isCreatingFolder, setIsCreatingFolder] = useState<boolean>(false);
  const [createdFolderResult, setCreatedFolderResult] = useState<{
    success: boolean;
    folderUrl: string;
    folderName: string;
    folderId: string;
    copiedCount: number;
    timestamp: string;
  } | null>(null);

  // Init Auth listener
  useEffect(() => {
    initAuth(
      (currentUser, token) => {
        setUser(currentUser);
        setAccessToken(token);
      },
      () => {
        // Not authenticated or token expired
      }
    );
  }, []);

  // Update proposed photo plan and folder name when projectData changes
  useEffect(() => {
    if (projectData) {
      setPhotoProposal(generatePhotoPlanProposal(projectData));
      setFolderName(generateListingFolderName(projectData));
      const matched = matchParentFolderConfig(projectData.projectName);
      setSelectedParentFolderId(matched.folderId);
    }
  }, [projectData]);

  // Handle Google Sign In
  const handleGoogleSignIn = async () => {
    setIsSigningIn(true);
    setError(null);
    try {
      const res = await googleSignIn();
      if (res) {
        setUser(res.user);
        setAccessToken(res.accessToken);
        setSuccessMsg(`Đã kết nối tài khoản Google: ${res.user.email} với quyền Google Drive!`);
        setTimeout(() => setSuccessMsg(null), 4000);
      }
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Không thể đăng nhập Google. Vui lòng thử lại.');
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleGoogleLogout = async () => {
    await logoutGoogle();
    setUser(null);
    setAccessToken(null);
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Method 1: Parse user's custom drive folder URL
  const handleParseDrive = async () => {
    if (!driveInput.trim()) {
      setError('Vui lòng nhập Link hoặc Folder ID Google Drive.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const resp = await fetch('/api/drive/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: driveInput }),
      });

      const data = await resp.json();
      if (!resp.ok) {
        throw new Error(data.error || 'Lỗi xử lý link Drive');
      }

      if (data.items && data.items.length > 0) {
        const newImages: DriveImage[] = data.items.map((item: any, idx: number) => ({
          id: item.id,
          title: item.title || `Ảnh căn nhà #${images.length + idx + 1}`,
          originalUrl: item.originalUrl,
          thumbnailUrl: item.thumbnailUrl,
          directViewUrl: item.directViewUrl,
          webUrl: item.webUrl,
          isCover: images.length === 0 && idx === 0,
          isSelected: true,
          category: 'Ảnh thực tế căn nhà',
          categoryType: 'facade',
          sourceOrigin: 'custom_folder',
          seoFilename: generateSeoFilename(projectData, 'thuc-te', item.title || 'anh', images.length + idx),
        }));

        setImages((prev) => [...prev, ...newImages]);
        setDriveInput('');
        setSuccessMsg(`Đã nạp thành công ${newImages.length} ảnh từ Google Drive.`);
        setTimeout(() => setSuccessMsg(null), 3500);
      } else {
        setError('Không tìm thấy tệp ảnh hợp lệ từ dữ liệu bạn nhập.');
      }
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Có lỗi xảy ra khi phân tích link Google Drive.');
    } finally {
      setLoading(false);
    }
  };

  // Method 2: Load recommended B-roll images automatically tailored to project
  const handleLoadRecommendedBroll = () => {
    const recommended = getRecommendedPhotosForProject(projectData);
    setImages(recommended);
    setError(null);
    setSuccessMsg(`Đã nạp trọn bộ ${recommended.length} ảnh B-roll chuẩn SEO cho dự án "${projectData.projectName}".`);
    setTimeout(() => setSuccessMsg(null), 3500);
  };

  // Add a specific B-roll item to current selection
  const handleAddBrollImage = (broll: DriveImage) => {
    if (images.some((img) => img.id === broll.id)) {
      setImages((prev) => prev.map((img) => img.id === broll.id ? { ...img, isSelected: true } : img));
    } else {
      const idx = images.length;
      const newImg: DriveImage = {
        ...broll,
        isSelected: true,
        seoFilename: generateSeoFilename(projectData, broll.categoryType || 'anh', broll.title, idx),
      };
      setImages((prev) => [...prev, newImg]);
    }
    setSuccessMsg(`Đã thêm: "${broll.title}" vào danh sách ảnh chọn.`);
    setTimeout(() => setSuccessMsg(null), 2000);
  };

  // Toggle selection
  const toggleSelect = (id: string) => {
    setImages((prev) =>
      prev.map((img) => (img.id === id ? { ...img, isSelected: !img.isSelected } : img))
    );
  };

  // Set as Cover photo
  const setAsCover = (id: string) => {
    setImages((prev) =>
      prev.map((img) => ({
        ...img,
        isCover: img.id === id,
        isSelected: img.id === id ? true : img.isSelected,
      }))
    );
  };

  // Select / Deselect all
  const toggleSelectAll = (select: boolean) => {
    setImages((prev) => prev.map((img) => ({ ...img, isSelected: select })));
  };

  // Update SEO filename inline
  const updateSeoFilename = (id: string, newFilename: string) => {
    setImages((prev) =>
      prev.map((img) => (img.id === id ? { ...img, seoFilename: newFilename } : img))
    );
  };

  // Regenerate all SEO filenames
  const regenerateAllSeoFilenames = () => {
    setImages((prev) =>
      prev.map((img, idx) => ({
        ...img,
        seoFilename: generateSeoFilename(projectData, img.categoryType || 'anh', img.title, idx),
      }))
    );
    setSuccessMsg('Đã chuẩn hoá lại toàn bộ tên file theo chuẩn SEO Google.');
    setTimeout(() => setSuccessMsg(null), 2500);
  };

  // Step 3 Action: Create Folder and Copy Files
  const handleConfirmCreateFolder = async () => {
    if (!folderName.trim()) {
      setError('Tên thư mục không được để trống.');
      return;
    }

    const selectedPhotos = images.filter((img) => img.isSelected);
    if (selectedPhotos.length === 0) {
      setError('Vui lòng chọn ít nhất 1 ảnh để sao chép vào thư mục.');
      return;
    }

    setIsCreatingFolder(true);
    setError(null);

    const activeParentId = customParentFolderUrl 
      ? (customParentFolderUrl.match(/folders\/([a-zA-Z0-9_-]+)/)?.[1] || customParentFolderUrl.trim())
      : selectedParentFolderId;

    try {
      const resp = await fetch('/api/drive/create-folder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          parentFolderId: activeParentId,
          folderName: folderName.trim(),
          accessToken: accessToken || undefined,
        }),
      });

      const data = await resp.json();
      if (!resp.ok) {
        throw new Error(data.error || 'Lỗi khi tạo thư mục trên Google Drive');
      }

      const newFolderUrl = data.folderUrl || `https://drive.google.com/drive/folders/${data.folderId}`;
      const newFolderId = data.folderId;

      // Copy files to new folder
      await fetch('/api/drive/copy-files', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetFolderId: newFolderId,
          files: selectedPhotos.map((p) => ({
            fileId: p.id,
            name: p.title,
            seoFilename: p.seoFilename,
          })),
          accessToken: accessToken || undefined,
        }),
      });

      const result = {
        success: true,
        folderUrl: newFolderUrl,
        folderName: folderName.trim(),
        folderId: newFolderId,
        copiedCount: selectedPhotos.length,
        timestamp: new Date().toLocaleTimeString('vi-VN') + ' - ' + new Date().toLocaleDateString('vi-VN'),
      };

      setCreatedFolderResult(result);
      if (setDriveFolderUrl) {
        setDriveFolderUrl(newFolderUrl);
      }

      setSuccessMsg(`✅ Tạo folder "${folderName}" và sao chép ${selectedPhotos.length} ảnh chuẩn SEO thành công!`);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Có lỗi xảy ra khi tạo folder trên Drive.');
    } finally {
      setIsCreatingFolder(false);
    }
  };

  const selectedImages = images.filter((img) => img.isSelected);
  const coverImage = images.find((img) => img.isCover) || selectedImages[0];

  // Filter B-roll library candidates for Method 2
  const filteredBrollLibrary = COMPREHENSIVE_BROLL_LIBRARY.filter((item) => {
    const matchProj = brollFilterProject === 'all' || 
      (brollFilterProject === 'ocean' && item.id.startsWith('broll-oc')) ||
      (brollFilterProject === 'halong' && item.id.startsWith('broll-hl')) ||
      (brollFilterProject === 'olympic' && item.id.startsWith('broll-ol'));

    const matchKw = !brollSearchKeyword.trim() || 
      item.title.toLowerCase().includes(brollSearchKeyword.toLowerCase()) ||
      (item.category || '').toLowerCase().includes(brollSearchKeyword.toLowerCase());

    return matchProj && matchKw;
  });

  return (
    <div className="space-y-6">
      {/* Lightbox Modal */}
      <LightboxModal image={lightboxImage} onClose={() => setLightboxImage(null)} />

      {/* Photo Studio Modal (Thumbnail & Quote Canvas Generator) */}
      <PhotoStudioModal
        isOpen={isStudioOpen}
        onClose={() => setIsStudioOpen(false)}
        images={images}
        projectData={projectData}
        onSaveGeneratedImage={(newImg, asCover) => {
          setImages((prev) => [newImg, ...prev]);
          if (asCover) setAsCover(newImg.id);
          setSuccessMsg(`Đã lưu ảnh từ Studio vào thư viện!`);
          setTimeout(() => setSuccessMsg(null), 3000);
        }}
      />

      {/* Module Title Banner & Actions */}
      <div className="bg-[#F5F2E9] border border-[#E5E0D3] rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="p-2.5 rounded-xl bg-[#1B3A2D] text-white shadow-sm">
                <FolderGit2 className="w-6 h-6" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold font-serif-brand text-[#1B3A2D]">
                    Module 3: III. ẢNH & THƯ VIỆN GOOGLE DRIVE
                  </h2>
                  <span className="text-[10px] bg-[#C95928] text-white font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Quy Chuẩn BĐS
                  </span>
                </div>
                <p className="text-xs text-[#333333]/80 mt-1 leading-relaxed">
                  Đề xuất bộ ảnh chuẩn 10–20 ảnh theo phân loại • Quét thư viện B-roll • Đặt tên file chuẩn SEO Google • Tự động tạo thư mục con trên Drive theo quy tắc <code className="bg-white px-1.5 py-0.5 rounded border border-[#DCD5C5] text-[#C95928] font-bold">[tên phân khu]_[dòng sản phẩm]_[mã căn]</code>.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => setIsStudioOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#1B3A2D] hover:bg-[#2C5E4A] text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#C95928]" />
              Studio Tạo Thumbnail & Quote (Brand VuVietHome)
            </button>

            <button
              type="button"
              onClick={handleLoadRecommendedBroll}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 bg-white hover:bg-slate-50 text-[#1B3A2D] border border-[#DCD5C5] font-semibold text-xs rounded-xl shadow-sm transition-all cursor-pointer"
            >
              <FolderOpen className="w-4 h-4 text-[#C95928]" />
              Nạp mẫu bộ B-roll ({projectData.projectName ? projectData.projectName.slice(0, 15) : 'Ocean City'}...)
            </button>
          </div>
        </div>

        {/* Google Workspace OAuth Connection Status Bar */}
        <div className="mt-5 pt-4 border-t border-[#E5E0D3] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <span className="font-bold text-[#1B3A2D] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#2C5E4A]" />
              Kết nối Google Drive (Cơ chế 1 - OAuth):
            </span>
            {user ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold text-[11px]">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Đã ủy quyền: <strong>{user.email || 'VuQuocViet88@gmail.com'}</strong>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[11px]">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                Chưa đăng nhập (Ứng dụng vẫn hỗ trợ mô phỏng tạo folder đầy đủ)
              </span>
            )}
          </div>

          <div>
            {user ? (
              <button
                type="button"
                onClick={handleGoogleLogout}
                className="inline-flex items-center gap-1 text-[11px] text-slate-500 hover:text-rose-600 transition-colors"
              >
                <LogOut className="w-3 h-3" />
                Đăng xuất tài khoản Google
              </button>
            ) : (
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isSigningIn}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white hover:bg-slate-100 text-[#1B3A2D] border border-[#DCD5C5] rounded-xl font-bold text-xs shadow-sm transition-all cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                </svg>
                {isSigningIn ? 'Đang mở cửa sổ đăng nhập...' : 'Đăng nhập Google để đồng bộ Drive'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Global Toast / Feedback */}
      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="font-medium">{successMsg}</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 animate-in fade-in">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* SECTION 1: AI ĐỀ XUẤT BỘ ẢNH CHUẨN THEO CẤU TRÚC PHÂN LOẠI */}
      <div className="bg-white border border-[#E5E0D3] rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E5E0D3] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-[#1B3A2D] text-white font-bold text-xs">
                Mục 1
              </span>
              <h3 className="text-base font-bold text-[#1B3A2D]">
                AI Đề Xuất Cấu Trúc Bộ Ảnh Chuẩn ({photoProposal.totalRecommended} Ảnh)
              </h3>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              {photoProposal.overviewSummary}
            </p>
          </div>

          <button
            type="button"
            onClick={handleLoadRecommendedBroll}
            className="px-4 py-2 bg-[#C95928] hover:bg-[#A8471F] text-white rounded-xl text-xs font-bold shadow transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <CheckSquare className="w-4 h-4" />
            Tự động lọc & Áp dụng {photoProposal.totalRecommended} ảnh B-roll ngay
          </button>
        </div>

        {/* 6 Category Proposal Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {photoProposal.categories.map((cat, idx) => (
            <div
              key={cat.id || idx}
              className="p-3.5 rounded-xl border border-[#E5E0D3] bg-[#FBFAF5] flex flex-col justify-between hover:border-[#1B3A2D]/40 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-xs font-bold text-[#1B3A2D] line-clamp-1">
                    {cat.category}
                  </span>
                  <span className="text-[10px] font-bold bg-[#F5F2E9] text-[#C95928] px-2 py-0.5 rounded-full border border-[#DCD5C5] shrink-0">
                    {cat.targetCount}
                  </span>
                </div>
                <h4 className="text-xs font-semibold text-slate-800 line-clamp-1 mb-1">
                  {cat.title}
                </h4>
                <p className="text-[11px] text-slate-600 leading-relaxed line-clamp-2 mb-2">
                  {cat.description}
                </p>
              </div>

              <div className="pt-2 border-t border-[#E5E0D3] text-[10px] text-slate-500 flex items-center justify-between">
                <span className="font-mono text-[9px] text-[#2C5E4A] truncate max-w-[160px]">
                  Tag: #{cat.seoTagSuggestion}
                </span>
                <span className="text-slate-400">Góc: {cat.recommendedAngle.slice(0, 16)}...</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 2: THU THẬP TỪ LINK DRIVE B-ROLL (2 PHƯƠNG ÁN) */}
      <div className="bg-white border border-[#E5E0D3] rounded-2xl p-6 shadow-sm space-y-5">
        <div className="flex items-center justify-between border-b border-[#E5E0D3] pb-3">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md bg-[#1B3A2D] text-white font-bold text-xs">
              Mục 2
            </span>
            <h3 className="text-base font-bold text-[#1B3A2D]">
              Thu Thập Ảnh Từ Google Drive B-roll
            </h3>
          </div>

          {/* 2 Method Switches */}
          <div className="flex items-center p-1 bg-[#F5F2E9] rounded-xl border border-[#DCD5C5] text-xs">
            <button
              type="button"
              onClick={() => setCollectionMethod('ai_broll')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                collectionMethod === 'ai_broll'
                  ? 'bg-[#1B3A2D] text-white shadow-sm'
                  : 'text-slate-600 hover:text-[#1B3A2D]'
              }`}
            >
              Phương án 2: AI đề xuất & Thư viện B-roll
            </button>
            <button
              type="button"
              onClick={() => setCollectionMethod('existing')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                collectionMethod === 'existing'
                  ? 'bg-[#1B3A2D] text-white shadow-sm'
                  : 'text-slate-600 hover:text-[#1B3A2D]'
              }`}
            >
              Phương án 1: Đã có ảnh (Dán link Folder)
            </button>
          </div>
        </div>

        {/* Tab Content 1: Đã Có Ảnh (Điền Link Drive Folder Chứa Ảnh) */}
        {collectionMethod === 'existing' && (
          <div className="space-y-4 p-4 rounded-xl bg-[#FBFAF5] border border-[#E5E0D3]">
            <div className="flex items-start gap-2.5">
              <span className="p-2 bg-[#F5F2E9] rounded-lg text-[#1B3A2D]">
                <FolderOpen className="w-5 h-5" />
              </span>
              <div>
                <h4 className="text-xs font-bold text-[#1B3A2D]">
                  Phương án 1: Điền link Google Drive folder chứa ảnh sẵn có của căn nhà
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Mục tiêu phục vụ lấy ảnh thực tế làm Thumbnail, ảnh Quote và đồng bộ sang Bước 4 (Notion Database).
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={driveInput}
                onChange={(e) => setDriveInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleParseDrive())}
                placeholder="Dán link folder hoặc danh sách link ảnh: https://drive.google.com/drive/folders/..."
                className="flex-1 bg-white border border-[#DCD5C5] rounded-xl px-4 py-2.5 text-xs text-[#333333] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1B3A2D]/20 focus:border-[#1B3A2D]"
              />
              <button
                type="button"
                onClick={handleParseDrive}
                disabled={loading}
                className="px-6 py-2.5 bg-[#C95928] hover:bg-[#A8471F] text-white font-bold text-xs rounded-xl transition-all shadow disabled:opacity-50 flex items-center justify-center gap-2 shrink-0 cursor-pointer"
              >
                {loading ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Đang nạp ảnh...</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>Quét & Nạp Ảnh Từ Folder Này</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Tab Content 2: AI Đề Xuất & Tìm Kiếm Trong Thư Viện B-roll Tổng */}
        {collectionMethod === 'ai_broll' && (
          <div className="space-y-4">
            <div className="p-3.5 rounded-xl bg-[#F5F2E9] border border-[#DCD5C5] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <span className="font-bold text-[#1B3A2D]">Thư viện B-roll toàn bộ các dự án:</span>
                <div className="flex items-center gap-2 mt-0.5">
                  <a
                    href={BROLL_LIBRARY_CONFIG.folderUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#C95928] hover:underline font-mono text-[11px] flex items-center gap-1"
                  >
                    <span>ID: {BROLL_LIBRARY_CONFIG.folderId}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <span className="text-slate-400">• Tiêu chí: Lọc ảnh ở folder dự án bài đăng tin trước, có thể tìm thêm ảnh minh họa phù hợp ở các folder khác.</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleLoadRecommendedBroll}
                className="px-4 py-2 bg-[#1B3A2D] hover:bg-[#2C5E4A] text-white rounded-xl font-bold text-xs shadow flex items-center gap-1.5 transition-all shrink-0 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#C95928]" />
                Nạp tự động cho {projectData.projectName || 'Dự án này'}
              </button>
            </div>

            {/* Filter and Search in B-roll */}
            <div className="flex flex-col sm:flex-row gap-3 text-xs">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  value={brollSearchKeyword}
                  onChange={(e) => setBrollSearchKeyword(e.target.value)}
                  placeholder="Tìm ảnh theo từ khóa: Hải Âu, mặt tiền, nội thất, biển hồ, Vinschool, ban công..."
                  className="w-full pl-9 pr-4 py-2 bg-[#FBFAF5] border border-[#DCD5C5] rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#1B3A2D]"
                />
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <span className="text-slate-500 font-medium">Lọc dự án:</span>
                <select
                  value={brollFilterProject}
                  onChange={(e) => setBrollFilterProject(e.target.value)}
                  className="bg-white border border-[#DCD5C5] rounded-xl px-3 py-2 text-xs font-medium text-[#1B3A2D] focus:outline-none"
                >
                  <option value="all">Tất cả dự án ({COMPREHENSIVE_BROLL_LIBRARY.length} ảnh)</option>
                  <option value="ocean">Vin Ocean City (12 ảnh)</option>
                  <option value="halong">Vin Hạ Long Xanh (2 ảnh)</option>
                  <option value="olympic">Vin Olympic (2 ảnh)</option>
                </select>
              </div>
            </div>

            {/* Compact B-roll Browser Carousel / Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 max-h-56 overflow-y-auto p-2 bg-[#FBFAF5] rounded-xl border border-[#E5E0D3]">
              {filteredBrollLibrary.map((broll) => {
                const isAlreadySelected = images.some((img) => img.id === broll.id && img.isSelected);
                return (
                  <div
                    key={broll.id}
                    className={`relative rounded-xl overflow-hidden border group bg-white flex flex-col justify-between ${
                      isAlreadySelected ? 'border-[#1B3A2D] ring-2 ring-[#1B3A2D]/20' : 'border-[#E5E0D3]'
                    }`}
                  >
                    <div 
                      className="aspect-video w-full overflow-hidden bg-slate-100 cursor-pointer relative"
                      onClick={() => setLightboxImage(broll)}
                    >
                      <img
                        src={broll.thumbnailUrl}
                        alt={broll.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <span className="absolute bottom-1 left-1 text-[9px] bg-black/60 text-white px-1.5 py-0.5 rounded backdrop-blur-sm">
                        {broll.categoryType || 'ảnh'}
                      </span>
                    </div>

                    <div className="p-1.5 flex flex-col justify-between gap-1 text-[11px]">
                      <span className="text-[10px] font-semibold text-slate-800 line-clamp-1" title={broll.title}>
                        {broll.title}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleAddBrollImage(broll)}
                        className={`w-full py-1 rounded text-[10px] font-bold transition-colors ${
                          isAlreadySelected
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-[#F5F2E9] hover:bg-[#1B3A2D] hover:text-white text-[#1B3A2D]'
                        }`}
                      >
                        {isAlreadySelected ? '✓ Đã chọn' : '+ Chọn ảnh'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* SECTION 3: BẢNG TỔNG SỐ ẢNH ĐÃ CHỌN + GỢI Ý ĐẶT TÊN FILE CHUẨN SEO */}
      <div className="bg-white border border-[#E5E0D3] rounded-2xl p-6 shadow-sm space-y-5">
        {/* Controls bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E5E0D3] pb-4">
          <div className="flex items-center gap-3">
            <span className="px-2 py-0.5 rounded-md bg-[#1B3A2D] text-white font-bold text-xs">
              Mục 3
            </span>
            <span className="text-sm font-bold text-[#1B3A2D]">
              Bảng Tổng Số Ảnh Đã Chọn: <strong>{images.length}</strong> ảnh
            </span>
            <span className="text-xs text-[#C95928] font-bold">
              (Đang tích chọn: {selectedImages.length} ảnh)
            </span>
            {coverImage && (
              <span className="text-[11px] bg-[#F5F2E9] text-[#1B3A2D] px-2.5 py-0.5 rounded-lg border border-[#DCD5C5] flex items-center gap-1 font-semibold">
                <Star className="w-3 h-3 fill-[#C95928] text-[#C95928]" />
                Bìa: {coverImage.title.slice(0, 20)}...
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={regenerateAllSeoFilenames}
              className="text-xs text-[#1B3A2D] hover:bg-[#F5F2E9] px-3 py-1.5 rounded-xl bg-white border border-[#DCD5C5] flex items-center gap-1.5 transition-colors cursor-pointer font-medium"
              title="Đặt lại toàn bộ tên file theo chuẩn SEO Google"
            >
              <Tag className="w-3.5 h-3.5 text-[#C95928]" /> Chuẩn hoá tên file SEO
            </button>

            <button
              type="button"
              onClick={() => toggleSelectAll(selectedImages.length < images.length)}
              className="text-xs text-[#1B3A2D] hover:bg-[#F5F2E9] px-3 py-1.5 rounded-xl bg-white border border-[#DCD5C5] flex items-center gap-1.5 transition-colors cursor-pointer font-medium"
            >
              {selectedImages.length === images.length ? (
                <>
                  <Square className="w-3.5 h-3.5 text-slate-400" /> Bỏ chọn hết
                </>
              ) : (
                <>
                  <CheckSquare className="w-3.5 h-3.5 text-[#1B3A2D]" /> Chọn tất cả
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                const links = selectedImages.map((img, i) => `${i + 1}. [${img.seoFilename || img.title}]: ${img.directViewUrl}`).join('\n');
                handleCopy(links, 'copy-all-links');
              }}
              disabled={selectedImages.length === 0}
              className="text-xs text-white bg-[#1B3A2D] hover:bg-[#2C5E4A] px-3.5 py-1.5 rounded-xl font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-40 cursor-pointer shadow-sm"
            >
              {copiedKey === 'copy-all-links' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" /> Đã copy link ({selectedImages.length})
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" /> Copy danh sách link
                </>
              )}
            </button>
          </div>
        </div>

        {/* Image Grid with SEO Filename Inline Editor */}
        {images.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-[#DCD5C5] rounded-xl bg-[#FBFAF5]">
            <FolderGit2 className="w-12 h-12 text-[#1B3A2D]/40 mx-auto mb-2" />
            <p className="text-sm font-bold font-serif-brand text-[#1B3A2D]">Chưa có ảnh nào trong thư viện</p>
            <p className="text-xs text-slate-500 mt-1 mb-5">
              Hãy chọn &quot;Phương án 2: AI đề xuất &amp; Thư viện B-roll&quot; hoặc dán link Google Drive ở trên.
            </p>
            <button
              type="button"
              onClick={handleLoadRecommendedBroll}
              className="px-5 py-2.5 bg-[#1B3A2D] text-white rounded-xl text-xs font-semibold hover:bg-[#2C5E4A] transition-colors cursor-pointer"
            >
              Nạp ngay bộ ảnh B-roll dự án ({projectData.projectName || 'Vinhomes'})
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {images.map((img, idx) => (
              <div
                key={img.id}
                className={`group relative rounded-2xl overflow-hidden border transition-all bg-white flex flex-col justify-between ${
                  img.isCover
                    ? 'border-[#C95928] ring-2 ring-[#C95928]/30 shadow-md'
                    : img.isSelected
                    ? 'border-[#1B3A2D]/50 shadow-sm'
                    : 'border-[#E5E0D3] opacity-60 hover:opacity-100'
                }`}
              >
                {/* Image Thumbnail with Overlay */}
                <div
                  className="relative aspect-video w-full overflow-hidden bg-[#F5F2E9] cursor-pointer"
                  onClick={() => setLightboxImage(img)}
                >
                  <img
                    src={img.thumbnailUrl}
                    alt={img.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80';
                    }}
                  />

                  {/* Top Left: Cover badge or Set Cover button */}
                  <div className="absolute top-2 left-2 flex items-center gap-1.5 z-10">
                    {img.isCover ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#C95928] text-white shadow-md flex items-center gap-1">
                        <Star className="w-3 h-3 fill-white" /> ẢNH BÌA
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setAsCover(img.id);
                        }}
                        className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#1B3A2D]/85 text-white hover:bg-[#C95928] transition-colors shadow"
                      >
                        Đặt làm Ảnh bìa
                      </button>
                    )}
                  </div>

                  {/* Top Right: Selection Checkbox */}
                  <div className="absolute top-2 right-2 flex items-center gap-1 z-10">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSelect(img.id);
                      }}
                      className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                        img.isSelected
                          ? 'bg-[#1B3A2D] text-white font-bold shadow'
                          : 'bg-white/90 text-slate-400 hover:text-[#1B3A2D] border border-slate-300'
                      }`}
                      title={img.isSelected ? 'Bỏ chọn ảnh này' : 'Chọn ảnh này'}
                    >
                      {img.isSelected ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : null}
                    </button>
                  </div>

                  {/* Zoom Lightbox Trigger */}
                  <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setLightboxImage(img);
                      }}
                      className="p-1.5 rounded-lg bg-[#1B3A2D]/90 text-white hover:bg-[#1B3A2D] transition-colors shadow"
                      title="Phóng to ảnh"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Category Pill on Image */}
                  <div className="absolute bottom-2 left-2">
                    <span className="text-[9px] bg-black/60 text-white px-2 py-0.5 rounded backdrop-blur-sm font-medium">
                      {img.category || 'B-roll'}
                    </span>
                  </div>
                </div>

                {/* Metadata & SEO Filename Input */}
                <div className="p-3 flex-1 flex flex-col justify-between gap-2.5">
                  <div>
                    <h4 className="text-xs font-bold text-[#1B3A2D] line-clamp-1">{img.title}</h4>

                    {/* SEO Filename Input Field */}
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
                        <span className="font-semibold text-[#2C5E4A] flex items-center gap-1">
                          <Tag className="w-3 h-3 text-[#C95928]" /> Tên file SEO (mã căn: tên đường-xx, ko lộ số căn):
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy(img.seoFilename || '', `seo-${img.id}`)}
                          className="text-[#C95928] hover:underline cursor-pointer"
                        >
                          {copiedKey === `seo-${img.id}` ? 'Đã copy' : 'Copy tên'}
                        </button>
                      </div>
                      <input
                        type="text"
                        value={img.seoFilename || generateSeoFilename(projectData, img.categoryType || 'anh', img.title, idx)}
                        onChange={(e) => updateSeoFilename(img.id, e.target.value)}
                        className="w-full text-[11px] font-mono px-2 py-1 bg-[#FBFAF5] border border-[#DCD5C5] rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#1B3A2D]"
                      />
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="flex items-center justify-between gap-2 border-t border-[#E5E0D3] pt-2 text-[11px]">
                    <button
                      type="button"
                      onClick={() => handleCopy(img.directViewUrl, `link-${img.id}`)}
                      className="text-[#C95928] hover:text-[#A8471F] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      {copiedKey === `link-${img.id}` ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" /> Đã copy link
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" /> Copy direct link
                        </>
                      )}
                    </button>

                    <a
                      href={img.webUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-slate-400 hover:text-[#1B3A2D] flex items-center gap-0.5"
                    >
                      <span>Mở Drive</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SECTION 4: ĐỀ XUẤT TẠO LINK FOLDER ẢNH & NÚT XÁC NHẬN LƯU FOLDER */}
      <div className="bg-white border border-[#E5E0D3] rounded-2xl p-6 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E5E0D3] pb-4">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md bg-[#1B3A2D] text-white font-bold text-xs">
              Mục 4
            </span>
            <div>
              <h3 className="text-base font-bold text-[#1B3A2D]">
                Tự Động Tạo Thư Mục Tin Đăng &amp; Sao Chép Ảnh Vào Drive
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Quy tắc đặt tên folder: <strong className="text-[#C95928] font-mono">[tên phân khu]_[dòng sản phẩm (viết tắt)]_[mã căn]</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">
              Dòng sản phẩm viết tắt: <strong className="text-[#1B3A2D] bg-[#F5F2E9] px-2 py-0.5 rounded border border-[#DCD5C5]">{abbreviatePropertyType(projectData.propertyType || '')}</strong> <span className="text-[11px] text-slate-400">(SL: Song lập • ĐL: Đơn lập • LK: Liền kề • SH: Shophouse)</span>
            </span>
          </div>
        </div>

        {/* Folder Configuration Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Parent Folder Target */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#1B3A2D]">
              1. Chọn Thư mục dự án cha trên Google Drive:
            </label>
            <select
              value={selectedParentFolderId}
              onChange={(e) => {
                setSelectedParentFolderId(e.target.value);
                setCustomParentFolderUrl('');
              }}
              className="w-full bg-[#FBFAF5] border border-[#DCD5C5] rounded-xl px-3.5 py-2.5 text-xs text-[#333333] font-medium focus:outline-none focus:ring-1 focus:ring-[#1B3A2D]"
            >
              {KNOWN_PROJECT_DRIVE_FOLDERS.map((f) => (
                <option key={f.id} value={f.folderId}>
                  {f.projectName} (ID: {f.folderId.slice(0, 8)}...)
                </option>
              ))}
            </select>
            <span className="text-[11px] text-slate-500 block">
              * Tự động nhận diện từ dự án đang chọn ({projectData.projectName || 'Vin Ocean City'}).
            </span>
          </div>

          {/* Folder Name according to formula */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#1B3A2D]">
              2. Tên Thư mục con sẽ tạo (theo đúng chuẩn quy tắc):
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                placeholder="VD: Hải Âu_LK xẻ khe_HA8-145"
                className="flex-1 bg-[#FBFAF5] border border-[#DCD5C5] rounded-xl px-3.5 py-2.5 text-xs text-[#1B3A2D] font-bold focus:outline-none focus:ring-1 focus:ring-[#1B3A2D]"
              />
              <button
                type="button"
                onClick={() => setFolderName(generateListingFolderName(projectData))}
                className="px-3 py-2.5 bg-[#F5F2E9] hover:bg-[#E5E0D3] text-[#1B3A2D] rounded-xl text-xs font-semibold shrink-0 cursor-pointer"
                title="Tạo lại tên theo dữ liệu căn"
              >
                Tạo lại
              </button>
            </div>
            <span className="text-[11px] text-slate-500 block">
              Quy tắc mẫu: <code>Hải Âu LK xẻ khe HA8-145</code> hoặc <code>Hải Âu_LK xẻ khe_HA8-145</code>
            </span>
          </div>
        </div>

        {/* Confirm Create Folder Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={handleConfirmCreateFolder}
            disabled={isCreatingFolder || selectedImages.length === 0}
            className="w-full sm:w-auto px-6 py-3 bg-[#C95928] hover:bg-[#A8471F] text-white font-bold text-xs rounded-xl shadow-md transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
          >
            {isCreatingFolder ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Đang tạo Folder &amp; Sao chép {selectedImages.length} ảnh vào Drive...</span>
              </>
            ) : (
              <>
                <FolderPlus className="w-4 h-4" />
                <span>Xác nhận tạo Folder &amp; Sao chép {selectedImages.length} ảnh vào Drive</span>
              </>
            )}
          </button>
        </div>

        {/* Finished / Success Folder Box with ✅ Badge */}
        {createdFolderResult && (
          <div className="mt-4 p-5 rounded-2xl bg-emerald-50 border-2 border-emerald-300 text-[#1B3A2D] space-y-3 animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-emerald-600 text-white shadow-sm">
                  <Check className="w-5 h-5 stroke-[3]" />
                </span>
                <div>
                  <h4 className="text-sm font-bold text-emerald-900 flex items-center gap-1.5">
                    <span>ĐÃ TẠO FOLDER &amp; SAO CHÉP ẢNH XONG</span>
                    <span className="text-base">✅</span>
                  </h4>
                  <p className="text-xs text-emerald-800">
                    Thư mục: <strong className="font-mono">{createdFolderResult.folderName}</strong> ({createdFolderResult.copiedCount} ảnh chuẩn SEO) • {createdFolderResult.timestamp}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleCopy(createdFolderResult.folderUrl, 'copy-folder-url')}
                  className="px-3.5 py-1.5 bg-white text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold hover:bg-emerald-100 transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  {copiedKey === 'copy-folder-url' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" /> Đã copy link
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" /> Copy link folder
                    </>
                  )}
                </button>

                <a
                  href={createdFolderResult.folderUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <span>Mở trên Google Drive</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            <div className="bg-white/80 p-2.5 rounded-xl border border-emerald-200 text-[11px] font-mono break-all text-slate-700 flex items-center justify-between gap-2">
              <span>{createdFolderResult.folderUrl}</span>
            </div>
            
            <p className="text-[11px] text-emerald-700">
              * Đường link thư mục này đã được tự động lưu vào bài viết để đẩy sang Bước 4 (Notion Database - trường Link Drive) và Bước 5 (Webhook Make/n8n).
            </p>
          </div>
        )}
      </div>

      {/* FOOTER: PROCEED TO MODULE 4 (NOTION) */}
      <div className="bg-white border border-[#E5E0D3] rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-xs">
          {createdFolderResult ? (
            <span className="text-emerald-800 font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Đã hoàn thành tạo Folder ảnh trên Google Drive. Sẵn sàng đồng bộ sang Notion Database!
            </span>
          ) : coverImage ? (
            <span className="text-[#1B3A2D] font-medium flex items-center gap-1.5">
              <Check className="w-4 h-4 text-[#C95928]" />
              Đã có ảnh bìa và {selectedImages.length} ảnh đính kèm sẵn sàng. Bạn có thể bấm xác nhận tạo folder ở Mục 4 hoặc tiếp tục sang Notion.
            </span>
          ) : (
            <span className="text-[#C95928] font-medium">
              Lưu ý: Bạn nên chọn ít nhất 1 ảnh làm ảnh bìa bài viết.
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={onNextStep}
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#C95928] hover:bg-[#A8471F] text-white font-bold text-xs rounded-xl shadow-md transition-all shrink-0 cursor-pointer"
        >
          <span>Tiếp tục: Bước 4 (Đồng bộ Notion)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
