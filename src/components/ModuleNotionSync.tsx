import React, { useState } from 'react';
import { 
  Database, 
  Check, 
  ExternalLink, 
  AlertCircle, 
  Key, 
  HelpCircle, 
  ArrowRight, 
  Clock, 
  ShieldCheck, 
  RefreshCw,
  Layers
} from 'lucide-react';
import { 
  NotionSettings, 
  NotionSyncHistoryItem, 
  ProjectFormData, 
  GeneratedListings, 
  DriveImage 
} from '../types';

interface ModuleNotionSyncProps {
  notionSettings: NotionSettings;
  setNotionSettings: React.Dispatch<React.SetStateAction<NotionSettings>>;
  syncHistory: NotionSyncHistoryItem[];
  setSyncHistory: React.Dispatch<React.SetStateAction<NotionSyncHistoryItem[]>>;
  projectData: ProjectFormData;
  listings: GeneratedListings | null;
  selectedVersionType: 'investment' | 'family' | 'social';
  images: DriveImage[];
  driveFolderUrl?: string;
  onNextStep: () => void;
}

export const ModuleNotionSync: React.FC<ModuleNotionSyncProps> = ({
  notionSettings,
  setNotionSettings,
  syncHistory,
  setSyncHistory,
  projectData,
  listings,
  selectedVersionType,
  images,
  driveFolderUrl = '',
  onNextStep,
}) => {
  const [testingConnection, setTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<{
    success?: boolean;
    message?: string;
    databaseTitle?: string;
  } | null>(null);

  const [saving, setSaving] = useState(false);
  const [saveResult, setSaveResult] = useState<{
    success: boolean;
    message: string;
    pageUrl?: string;
    mode?: string;
  } | null>(null);

  const [showGuide, setShowGuide] = useState(false);

  // Active listing content
  const activeVersion = listings
    ? selectedVersionType === 'investment'
      ? listings.versionInvestment
      : selectedVersionType === 'family'
      ? listings.versionFamily
      : listings.versionSocial
    : null;

  const coverImage = images.find((i) => i.isCover) || images[0];

  const handleTestConnection = async () => {
    if (!notionSettings.token || !notionSettings.databaseId) {
      setConnectionStatus({
        success: false,
        message: 'Vui lòng điền đủ Notion Integration Token và Database ID trước khi kiểm tra.',
      });
      return;
    }

    setTestingConnection(true);
    setConnectionStatus(null);

    try {
      const resp = await fetch('/api/notion/test-connection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          notionToken: notionSettings.token,
          databaseId: notionSettings.databaseId,
        }),
      });

      const data = await resp.json();
      if (!resp.ok) {
        throw new Error(data.error || 'Không kết nối được database Notion');
      }

      setConnectionStatus({
        success: true,
        databaseTitle: data.databaseTitle,
        message: `Kết nối thành công tới Database: "${data.databaseTitle}". Sẵn sàng đồng bộ!`,
      });
    } catch (err: any) {
      setConnectionStatus({
        success: false,
        message: err.message || 'Lỗi khi kiểm tra kết nối Notion.',
      });
    } finally {
      setTestingConnection(false);
    }
  };

  const handleSaveToNotion = async () => {
    const titleToSave = activeVersion?.title || projectData.projectName;
    const contentToSave = activeVersion?.content || `Thông tin dự án: ${projectData.projectName}\nGiá: ${projectData.price}`;

    if (!titleToSave) {
      setSaveResult({
        success: false,
        message: 'Vui lòng nhập thông tin dự án hoặc tạo nội dung trước khi lưu vào Notion.',
      });
      return;
    }

    setSaving(true);
    setSaveResult(null);

    try {
      const resp = await fetch('/api/notion/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          notionToken: notionSettings.token,
          databaseId: notionSettings.databaseId,
          mode: notionSettings.isSimulated ? 'simulate' : 'live',
          listing: {
            title: titleToSave,
            price: projectData.price,
            area: projectData.area,
            propertyType: projectData.propertyType,
            subdivision: projectData.subdivision,
            address: projectData.address,
            status: 'Đã duyệt',
            driveFolderUrl: driveFolderUrl || coverImage?.webUrl || 'https://drive.google.com',
            coverImageUrl: coverImage?.directViewUrl || coverImage?.thumbnailUrl,
            attachedImages: images.filter((i) => i.isSelected).map((i) => i.directViewUrl),
            selectedVersionType,
            content: contentToSave,
          },
        }),
      });

      const data = await resp.json();
      if (!resp.ok) {
        throw new Error(data.error || 'Lỗi khi lưu vào Notion');
      }

      setSaveResult({
        success: true,
        message: data.message,
        pageUrl: data.pageUrl,
        mode: data.mode,
      });

      // Add to history
      const newHistoryItem: NotionSyncHistoryItem = {
        id: data.pageId || `hist-${Date.now()}`,
        title: titleToSave,
        price: projectData.price,
        propertyType: projectData.propertyType,
        timestamp: new Date().toLocaleTimeString('vi-VN') + ' - ' + new Date().toLocaleDateString('vi-VN'),
        pageUrl: data.pageUrl || '#',
        mode: data.mode === 'live' ? 'live' : 'simulated',
      };
      setSyncHistory((prev) => [newHistoryItem, ...prev]);
    } catch (err: any) {
      console.error(err);
      setSaveResult({
        success: false,
        message: err.message || 'Có lỗi xảy ra khi lưu vào Notion.',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Module Title Banner */}
      <div className="bg-[#F5F2E9] border border-[#E5E0D3] rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-[#1B3A2D] text-white">
                <Database className="w-5 h-5" />
              </span>
              <h2 className="text-2xl font-bold font-serif-brand text-[#1B3A2D]">
                III. LƯU TRỮ VÀO DATABASE NOTION
              </h2>
            </div>
            <p className="text-sm text-[#333333]/80 mt-1.5 leading-relaxed">
              Tự động định dạng và đồng bộ các trường: <strong>Tiêu đề</strong>, <strong>Giá</strong>, <strong>Diện tích</strong>, <strong>Nội dung bài viết</strong> và <strong>Link Google Drive</strong> vào database quản lý BĐS của Vũ Việt Home.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowGuide(!showGuide)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-[#1B3A2D] bg-white hover:bg-[#F5F2E9] border border-[#DCD5C5] transition-colors shrink-0 cursor-pointer shadow-sm"
          >
            <HelpCircle className="w-4 h-4 text-[#C95928]" />
            <span>{showGuide ? 'Ẩn hướng dẫn' : 'Hướng dẫn kết nối Notion'}</span>
          </button>
        </div>
      </div>

      {/* Guide accordion if opened */}
      {showGuide && (
        <div className="bg-white border border-[#1B3A2D]/20 rounded-2xl p-6 text-xs text-[#333333] space-y-3 shadow-sm animate-in fade-in">
          <h4 className="font-bold text-sm font-serif-brand text-[#1B3A2D] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#C95928]" /> 3 Bước nhanh kết nối Notion:
          </h4>
          <ol className="list-decimal list-inside space-y-2 text-[#333333]/90 leading-relaxed">
            <li>
              Truy cập{' '}
              <a
                href="https://www.notion.so/my-integrations"
                target="_blank"
                rel="noreferrer"
                className="text-[#C95928] underline font-bold"
              >
                notion.so/my-integrations
              </a>
              , tạo một Integration mới và copy chuỗi <strong>Internal Integration Secret</strong> (bắt đầu bằng <code className="bg-[#F5F2E9] px-1.5 py-0.5 rounded text-[#1B3A2D] font-mono">secret_...</code>).
            </li>
            <li>
              Mở Database BĐS trên Notion. Bấm menu ba chấm <strong className="text-[#1B3A2D]">&quot;...&quot;</strong> góc trên bên phải → chọn <strong className="text-[#1B3A2D]">Connections</strong> → Chọn Integration bot bạn vừa tạo để cấp quyền.
            </li>
            <li>
              Copy đường link của Database Notion và dán vào ô <strong>Database ID</strong> bên dưới (Hệ thống tự động lọc mã ID 32 ký tự).
            </li>
          </ol>
          <p className="text-[11px] text-[#333333]/70 pt-2 border-t border-[#E5E0D3]">
            * Mẹo: Nếu bạn đang trải nghiệm thử nghiệm, hãy giữ bật <strong className="text-[#C95928]">&apos;Chế độ Mô phỏng / Thử nghiệm&apos;</strong> để xem luồng lưu trữ hoạt động mượt mà ngay lập tức!
          </p>
        </div>
      )}

      {/* Config Form & Mapping preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Credentials & Config (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white border border-[#E5E0D3] rounded-2xl p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-[#E5E0D3] pb-3">
              <h3 className="text-sm font-bold font-serif-brand text-[#1B3A2D] uppercase tracking-wider flex items-center gap-2">
                <Key className="w-4 h-4 text-[#C95928]" /> Cấu Hình Notion API
              </h3>
              {/* Simulation Mode Toggle */}
              <label className="flex items-center gap-2 text-xs text-[#333333] cursor-pointer font-medium">
                <input
                  type="checkbox"
                  checked={notionSettings.isSimulated}
                  onChange={(e) =>
                    setNotionSettings({ ...notionSettings, isSimulated: e.target.checked })
                  }
                  className="rounded bg-[#FBFAF5] border-[#DCD5C5] text-[#1B3A2D] focus:ring-0"
                />
                <span className={notionSettings.isSimulated ? 'text-[#C95928] font-bold' : 'text-slate-500'}>
                  Chế độ Mô phỏng (Demo)
                </span>
              </label>
            </div>

            {/* Token */}
            <div>
              <label className="block text-xs font-bold text-[#1B3A2D] mb-1">
                Notion Integration Token <span className="text-slate-400 font-normal">(Internal Secret)</span>
              </label>
              <input
                type="password"
                value={notionSettings.token}
                onChange={(e) => setNotionSettings({ ...notionSettings, token: e.target.value })}
                placeholder="secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                disabled={notionSettings.isSimulated}
                className="w-full bg-[#FBFAF5] border border-[#DCD5C5] rounded-xl px-3.5 py-2 text-xs sm:text-sm text-[#333333] placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#1B3A2D] disabled:opacity-50 font-mono"
              />
            </div>

            {/* Database ID */}
            <div>
              <label className="block text-xs font-bold text-[#1B3A2D] mb-1">
                Database ID hoặc Đường dẫn Database Notion
              </label>
              <input
                type="text"
                value={notionSettings.databaseId}
                onChange={(e) => setNotionSettings({ ...notionSettings, databaseId: e.target.value })}
                placeholder="VD: a1b2c3d4e5f6... hoặc https://notion.so/workspace/a1b2c3d4..."
                disabled={notionSettings.isSimulated}
                className="w-full bg-[#FBFAF5] border border-[#DCD5C5] rounded-xl px-3.5 py-2 text-xs sm:text-sm text-[#333333] placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#1B3A2D] disabled:opacity-50 font-mono"
              />
            </div>

            {/* Test Connection Button */}
            {!notionSettings.isSimulated && (
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleTestConnection}
                  disabled={testingConnection}
                  className="px-4 py-2 bg-[#F5F2E9] hover:bg-[#E5E0D3] text-[#1B3A2D] text-xs font-semibold rounded-xl border border-[#DCD5C5] flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {testingConnection ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Đang kiểm tra...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-3.5 h-3.5 text-[#C95928]" />
                      <span>Kiểm tra kết nối Database</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Connection feedback message */}
            {connectionStatus && (
              <div
                className={`p-3.5 rounded-xl text-xs flex items-center gap-2 ${
                  connectionStatus.success
                    ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                    : 'bg-rose-50 border border-rose-200 text-rose-800'
                }`}
              >
                {connectionStatus.success ? (
                  <Check className="w-4 h-4 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0" />
                )}
                <span>{connectionStatus.message}</span>
              </div>
            )}

            {/* Save action button */}
            <div className="pt-2 border-t border-[#E5E0D3]">
              <button
                type="button"
                onClick={handleSaveToNotion}
                disabled={saving}
                className="w-full py-3 px-4 rounded-xl bg-[#C95928] hover:bg-[#A8471F] text-white font-bold text-sm transition-all shadow-md shadow-[#C95928]/25 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Đang đồng bộ vào Notion...</span>
                  </>
                ) : (
                  <>
                    <Database className="w-4 h-4" />
                    <span>Lưu vào Notion ngay</span>
                  </>
                )}
              </button>
            </div>

            {/* Save result banner */}
            {saveResult && (
              <div
                className={`p-4 rounded-xl text-xs space-y-2 border ${
                  saveResult.success
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    : 'bg-rose-50 border-rose-200 text-rose-800'
                }`}
              >
                <div className="flex items-center gap-2 font-semibold">
                  {saveResult.success ? (
                    <Check className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-600" />
                  )}
                  <span>{saveResult.message}</span>
                </div>
                {saveResult.pageUrl && (
                  <a
                    href={saveResult.pageUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1B3A2D] underline hover:text-[#C95928]"
                  >
                    <span>Mở trang bài viết trên Notion</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right: Field Mapping Preview (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white border border-[#E5E0D3] rounded-2xl p-6 space-y-4 shadow-sm">
            <h3 className="text-sm font-bold font-serif-brand text-[#1B3A2D] uppercase tracking-wider flex items-center gap-2 border-b border-[#E5E0D3] pb-3">
              <Layers className="w-4 h-4 text-[#C95928]" /> Bản Đồ Ánh Xạ Trường (Field Mapping)
            </h3>

            <div className="space-y-2.5 text-xs">
              {/* Field 1: Title */}
              <div className="bg-[#FBFAF5] p-3.5 rounded-xl border border-[#E5E0D3] flex items-center justify-between gap-2">
                <span className="text-[#333333] font-medium">Trường Notion: <strong>Name / Tiêu đề</strong></span>
                <span className="text-[#1B3A2D] font-bold truncate max-w-[200px]">
                  {activeVersion?.title || projectData.projectName || '(Chưa có)'}
                </span>
              </div>

              {/* Field 2: Price */}
              <div className="bg-[#FBFAF5] p-3.5 rounded-xl border border-[#E5E0D3] flex items-center justify-between gap-2">
                <span className="text-[#333333] font-medium">Trường Notion: <strong>Giá</strong></span>
                <span className="text-[#C95928] font-bold">{projectData.price || 'Thương lượng'}</span>
              </div>

              {/* Field 3: Area */}
              <div className="bg-[#FBFAF5] p-3.5 rounded-xl border border-[#E5E0D3] flex items-center justify-between gap-2">
                <span className="text-[#333333] font-medium">Trường Notion: <strong>Diện tích</strong></span>
                <span className="text-[#1B3A2D] font-semibold">{projectData.area ? `${projectData.area} m²` : 'Tiêu chuẩn'}</span>
              </div>

              {/* Field 4: Property Type */}
              <div className="bg-[#FBFAF5] p-3.5 rounded-xl border border-[#E5E0D3] flex items-center justify-between gap-2">
                <span className="text-[#333333] font-medium">Trường Notion: <strong>Loại hình</strong></span>
                <span className="text-[#1B3A2D] font-medium">{projectData.propertyType}</span>
              </div>

              {/* Field 5: Status */}
              <div className="bg-[#FBFAF5] p-3.5 rounded-xl border border-[#E5E0D3] flex items-center justify-between gap-2">
                <span className="text-[#333333] font-medium">Trường Notion: <strong>Trạng thái</strong></span>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-[#1B3A2D]/10 text-[#1B3A2D] border border-[#1B3A2D]/20">
                  Đã duyệt
                </span>
              </div>

              {/* Field 6: Drive Link */}
              <div className="bg-[#FBFAF5] p-3.5 rounded-xl border border-[#E5E0D3] flex items-center justify-between gap-2">
                <span className="text-[#333333] font-medium">Trường Notion: <strong>Link Drive / Ảnh</strong></span>
                <span className="text-slate-500 truncate max-w-[200px] font-mono text-[11px]">
                  {coverImage?.directViewUrl || 'Thư viện Google Drive'}
                </span>
              </div>

              {/* Field 7: Content Blocks */}
              <div className="bg-[#FBFAF5] p-3.5 rounded-xl border border-[#E5E0D3]">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[#333333] font-medium">Trường Notion: <strong>Page Body Content (Blocks)</strong></span>
                  <span className="text-[#C95928] font-bold">
                    Bản: {selectedVersionType.toUpperCase()}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 line-clamp-2 italic">
                  {activeVersion?.content ? activeVersion.content.slice(0, 160) + '...' : '(Tạo nội dung ở Bước 2)'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notion Sync History */}
      <div className="bg-white border border-[#E5E0D3] rounded-2xl p-6 space-y-4 shadow-sm">
        <h3 className="text-sm font-bold font-serif-brand text-[#1B3A2D] uppercase tracking-wider flex items-center gap-2 border-b border-[#E5E0D3] pb-3">
          <Clock className="w-4 h-4 text-[#C95928]" /> Lịch Sử Đồng Bộ Notion ({syncHistory.length})
        </h3>

        {syncHistory.length === 0 ? (
          <div className="text-center py-6 text-slate-400 text-xs">
            Chưa có bài đăng nào được đồng bộ sang Notion. Hãy nhấn &quot;Lưu vào Notion ngay&quot; ở trên.
          </div>
        ) : (
          <div className="space-y-2">
            {syncHistory.map((item) => (
              <div
                key={item.id}
                className="p-3.5 bg-[#FBFAF5] rounded-xl border border-[#E5E0D3] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <h4 className="font-bold text-[#1B3A2D]">{item.title}</h4>
                  <div className="flex items-center gap-3 text-slate-500 mt-1">
                    <span className="text-[#C95928] font-bold">{item.price}</span>
                    <span>•</span>
                    <span>{item.propertyType}</span>
                    <span>•</span>
                    <span className="text-[11px] text-slate-400">{item.timestamp}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <span
                    className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                      item.mode === 'live'
                        ? 'bg-[#1B3A2D] text-white'
                        : 'bg-[#F5F2E9] text-[#1B3A2D] border border-[#DCD5C5]'
                    }`}
                  >
                    {item.mode === 'live' ? 'Live Notion' : 'Mô phỏng'}
                  </span>
                  <a
                    href={item.pageUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded-lg bg-white hover:bg-[#F5F2E9] border border-[#DCD5C5] text-[#1B3A2D] flex items-center gap-1 transition-colors text-xs font-medium"
                  >
                    <span>Mở trang</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="border-t border-[#E5E0D3] pt-3 flex justify-end">
          <button
            type="button"
            onClick={onNextStep}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#C95928] hover:bg-[#A8471F] text-white font-bold text-xs rounded-xl shadow-md transition-all shrink-0 cursor-pointer"
          >
            <span>Tiếp tục: Bước 5 (Export & Bắn Webhook)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
