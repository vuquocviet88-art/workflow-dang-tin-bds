import React, { useState, useEffect } from 'react';
import { 
  Send, 
  Copy, 
  Check, 
  Sparkles, 
  FileText, 
  Image as ImageIcon, 
  Code, 
  AlertCircle, 
  RotateCw, 
  Trash2,
  CheckCircle2,
  Server,
  Zap
} from 'lucide-react';
import { 
  ProjectFormData, 
  GeneratedListings, 
  DriveImage, 
  WebhookConfig, 
  WebhookResponseLog 
} from '../types';

interface ModuleExportWebhookProps {
  projectData: ProjectFormData;
  listings: GeneratedListings | null;
  selectedVersionType: 'investment' | 'family' | 'social';
  images: DriveImage[];
  driveFolderUrl?: string;
}

export const ModuleExportWebhook: React.FC<ModuleExportWebhookProps> = ({
  projectData,
  listings,
  selectedVersionType,
  images,
  driveFolderUrl = '',
}) => {
  const [webhookConfig, setWebhookConfig] = useState<WebhookConfig>({
    url: '',
    customHeaders: '{\n  "Authorization": "Bearer vu-viet-home-token"\n}',
  });

  const [sending, setSending] = useState(false);
  const [lastResponse, setLastResponse] = useState<WebhookResponseLog | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [internalLogs, setInternalLogs] = useState<any[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);

  // Active version content
  const activeVersion = listings
    ? selectedVersionType === 'investment'
      ? listings.versionInvestment
      : selectedVersionType === 'family'
      ? listings.versionFamily
      : listings.versionSocial
    : null;

  const coverImage = images.find((i) => i.isCover) || images[0];
  const selectedImages = images.filter((img) => img.isSelected);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Compile full formatted listing text with VuVietHome signature
  const fullFormattedListing = `🏡 VŨ VIỆT HOME - BẤT ĐỘNG SẢN CAO CẤP
🌐 Website: VuVietHome.com.vn | Hotline: 0908 688 888

🎯 TIÊU ĐỀ:
${activeVersion?.title || projectData.projectName}

📊 THÔNG TIN DỰ ÁN:
• Dự án: ${projectData.projectName} ${projectData.subdivision ? `(${projectData.subdivision})` : ''}
• Loại hình: ${projectData.propertyType}
• Diện tích: ${projectData.area ? `${projectData.area} m²` : 'Tiêu chuẩn'} | ${projectData.bedrooms} | ${projectData.bathrooms}
• Giá bán: ${projectData.price} ${projectData.pricePerM2 ? `(${projectData.pricePerM2})` : ''}
• Vị trí: ${projectData.address}
• Pháp lý: ${projectData.legal}
• Tiện ích đẳng cấp: ${projectData.amenities}
• Chính sách & Ưu đãi: ${projectData.keyHighlights}

📝 NỘI DUNG CHI TIẾT (${selectedVersionType.toUpperCase()}):
${activeVersion?.content || '(Chưa tạo nội dung)'}

📸 HÌNH ẢNH GOOGLE DRIVE:
${coverImage ? `• Ảnh bìa: ${coverImage.directViewUrl}` : ''}
${selectedImages.map((img, i) => `• Ảnh ${i + 1}: ${img.directViewUrl}`).join('\n')}

☎️ LIÊN HỆ TƯ VẤN & THAM QUAN THỰC TẾ:
• Chuyên viên: ${projectData.contactName}
• Hotline / Zalo: ${projectData.phone}
• Vũ Việt Home - Đồng hành cùng bạn tìm kiếm tổ ấm & cơ hội đầu tư bền vững!
`.trim();

  // Full structured JSON payload for webhook
  const webhookPayload = {
    brand: 'VuVietHome',
    website: 'VuVietHome.com.vn',
    event: 'real_estate_listing_published',
    source: 'VuVietHome_Workflow_App',
    timestamp: new Date().toISOString(),
    project: {
      name: projectData.projectName,
      subdivision: projectData.subdivision,
      propertyType: projectData.propertyType,
      area: projectData.area,
      bedrooms: projectData.bedrooms,
      bathrooms: projectData.bathrooms,
      price: projectData.price,
      pricePerM2: projectData.pricePerM2,
      address: projectData.address,
      legal: projectData.legal,
      amenities: projectData.amenities,
      highlights: projectData.keyHighlights,
      contact: {
        name: projectData.contactName,
        phone: projectData.phone,
        email: 'VuQuocViet88@gmail.com',
      },
    },
    content: {
      selectedVersion: selectedVersionType,
      title: activeVersion?.title || projectData.projectName,
      body: activeVersion?.content || '',
      summaryHighlights: activeVersion?.summaryHighlights || [],
      seoMeta: listings?.seoMeta || null,
      fullFormattedText: fullFormattedListing,
    },
    media: {
      coverImageUrl: coverImage?.directViewUrl || '',
      driveFolderUrl: driveFolderUrl || coverImage?.webUrl || '',
      attachedImages: selectedImages.map((img) => ({
        id: img.id,
        title: img.title,
        directUrl: img.directViewUrl,
        webUrl: img.webUrl,
      })),
    },
  };

  const handleSendWebhook = async () => {
    if (!webhookConfig.url.trim()) {
      alert('Vui lòng nhập Webhook URL.');
      return;
    }

    setSending(true);
    setLastResponse(null);

    let parsedHeaders = {};
    try {
      if (webhookConfig.customHeaders.trim()) {
        parsedHeaders = JSON.parse(webhookConfig.customHeaders);
      }
    } catch {
      // ignore
    }

    try {
      const resp = await fetch('/api/webhook/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          webhookUrl: webhookConfig.url.trim(),
          headers: parsedHeaders,
          payload: webhookPayload,
        }),
      });

      const data = await resp.json();
      setLastResponse({
        id: `resp-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString('vi-VN'),
        url: webhookConfig.url,
        status: data.statusCode || (resp.ok ? 200 : 500),
        statusText: data.statusText || (data.success ? 'OK' : 'Error'),
        latencyMs: data.latencyMs || 0,
        success: data.success,
        responseData: data.responseData || data.error,
      });

      if (webhookConfig.url.includes('/api/webhook/test-receiver')) {
        fetchInternalLogs();
      }
    } catch (err: any) {
      setLastResponse({
        id: `resp-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString('vi-VN'),
        url: webhookConfig.url,
        status: 500,
        statusText: 'Network Error',
        latencyMs: 0,
        success: false,
        responseData: err.message || 'Lỗi kết nối Webhook.',
      });
    } finally {
      setSending(false);
    }
  };

  const setInternalTestUrl = () => {
    const internalUrl = `${window.location.origin}/api/webhook/test-receiver`;
    setWebhookConfig((prev) => ({ ...prev, url: internalUrl }));
  };

  const fetchInternalLogs = async () => {
    setLoadingLogs(true);
    try {
      const resp = await fetch('/api/webhook/test-logs');
      const data = await resp.json();
      setInternalLogs(data.logs || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingLogs(false);
    }
  };

  const clearInternalLogs = async () => {
    try {
      await fetch('/api/webhook/test-logs', { method: 'DELETE' });
      setInternalLogs([]);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchInternalLogs();
  }, []);

  return (
    <div className="space-y-6">
      {/* Module Title Banner */}
      <div className="bg-[#F5F2E9] border border-[#E5E0D3] rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-[#1B3A2D] text-white">
                <Send className="w-5 h-5" />
              </span>
              <h2 className="text-2xl font-bold font-serif-brand text-[#1B3A2D]">
                IV. EXPORT NHANH & BẮN WEBHOOK ĐA KÊNH
              </h2>
            </div>
            <p className="text-sm text-[#333333]/80 mt-1.5 leading-relaxed">
              Bộ công cụ copy nhanh 1-click lên các sàn BĐS/Mạng xã hội và hệ thống Bắn Webhook tự động sang Make.com, n8n, Zapier, Telegram Bot hoặc CRM của Vũ Việt Home.
            </p>
          </div>
        </div>
      </div>

      {/* 1. Quick Copy Action Buttons */}
      <div className="bg-white border border-[#E5E0D3] rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="text-sm font-bold font-serif-brand text-[#1B3A2D] uppercase tracking-wider flex items-center gap-2 border-b border-[#E5E0D3] pb-3">
          <Copy className="w-4 h-4 text-[#C95928]" /> Bộ Nút Bấm Nhanh (1-Click Quick Copy)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Copy Title */}
          <button
            type="button"
            onClick={() => handleCopy(activeVersion?.title || projectData.projectName, 'copy-title')}
            className="p-4 rounded-xl bg-[#FBFAF5] border border-[#E5E0D3] hover:border-[#1B3A2D] hover:bg-[#F5F2E9] transition-all flex items-center justify-between text-left group cursor-pointer"
          >
            <div>
              <div className="text-xs font-bold text-[#1B3A2D] flex items-center gap-1.5 mb-1">
                <FileText className="w-3.5 h-3.5 text-[#C95928]" />
                <span>Copy Tiêu Đề</span>
              </div>
              <p className="text-[11px] text-[#333333]/70 truncate max-w-[180px]">
                {activeVersion?.title || projectData.projectName}
              </p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-lg bg-white border border-[#DCD5C5] group-hover:bg-[#1B3A2D] group-hover:text-white transition-colors">
              {copiedKey === 'copy-title' ? <Check className="w-3.5 h-3.5 text-emerald-600 group-hover:text-white" /> : <Copy className="w-3.5 h-3.5" />}
            </span>
          </button>

          {/* Copy Content */}
          <button
            type="button"
            onClick={() => handleCopy(activeVersion?.content || '', 'copy-content')}
            className="p-4 rounded-xl bg-[#FBFAF5] border border-[#E5E0D3] hover:border-[#1B3A2D] hover:bg-[#F5F2E9] transition-all flex items-center justify-between text-left group cursor-pointer"
          >
            <div>
              <div className="text-xs font-bold text-[#1B3A2D] flex items-center gap-1.5 mb-1">
                <FileText className="w-3.5 h-3.5 text-[#1B3A2D]" />
                <span>Copy Nội Dung</span>
              </div>
              <p className="text-[11px] text-[#333333]/70">
                Bản: {selectedVersionType.toUpperCase()} ({activeVersion?.content?.length || 0} ký tự)
              </p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-lg bg-white border border-[#DCD5C5] group-hover:bg-[#1B3A2D] group-hover:text-white transition-colors">
              {copiedKey === 'copy-content' ? <Check className="w-3.5 h-3.5 text-emerald-600 group-hover:text-white" /> : <Copy className="w-3.5 h-3.5" />}
            </span>
          </button>

          {/* Copy Image Links */}
          <button
            type="button"
            onClick={() => {
              const links = selectedImages.map((img) => img.directViewUrl).join('\n');
              handleCopy(links, 'copy-images');
            }}
            className="p-4 rounded-xl bg-[#FBFAF5] border border-[#E5E0D3] hover:border-[#1B3A2D] hover:bg-[#F5F2E9] transition-all flex items-center justify-between text-left group cursor-pointer"
          >
            <div>
              <div className="text-xs font-bold text-[#1B3A2D] flex items-center gap-1.5 mb-1">
                <ImageIcon className="w-3.5 h-3.5 text-[#2C5E4A]" />
                <span>Copy Link Ảnh</span>
              </div>
              <p className="text-[11px] text-[#333333]/70">
                {selectedImages.length} link ảnh Drive trực tiếp
              </p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-lg bg-white border border-[#DCD5C5] group-hover:bg-[#1B3A2D] group-hover:text-white transition-colors">
              {copiedKey === 'copy-images' ? <Check className="w-3.5 h-3.5 text-emerald-600 group-hover:text-white" /> : <Copy className="w-3.5 h-3.5" />}
            </span>
          </button>

          {/* Copy Full Package */}
          <button
            type="button"
            onClick={() => handleCopy(fullFormattedListing, 'copy-full')}
            className="p-4 rounded-xl bg-[#1B3A2D] text-white border border-[#2C5E4A] hover:bg-[#2C5E4A] transition-all flex items-center justify-between text-left group cursor-pointer shadow-md"
          >
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-1.5 mb-1">
                <Sparkles className="w-3.5 h-3.5 text-[#C95928]" />
                <span>Copy Full Bộ Tin</span>
              </div>
              <p className="text-[11px] text-[#F5F2E9]/80">
                Tiêu đề + Bảng thông số + Bài viết + Ảnh + SĐT
              </p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-lg bg-[#C95928] text-white font-bold group-hover:bg-[#A8471F] transition-colors">
              {copiedKey === 'copy-full' ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
            </span>
          </button>
        </div>
      </div>

      {/* 2. Webhook Automation Section */}
      <div className="bg-white border border-[#E5E0D3] rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E5E0D3] pb-3">
          <div>
            <h3 className="text-sm font-bold font-serif-brand text-[#1B3A2D] uppercase tracking-wider flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#C95928]" /> Bắn Webhook Tự Động Hóa (Automation Dispatcher)
            </h3>
            <p className="text-xs text-[#333333]/70 mt-0.5">
              Đẩy toàn bộ JSON tin đăng, thông số kỹ thuật và ảnh Drive sang Make, Zapier, n8n, CRM hoặc Telegram Bot.
            </p>
          </div>

          <button
            type="button"
            onClick={setInternalTestUrl}
            className="text-xs font-bold px-3.5 py-2 rounded-xl bg-[#F5F2E9] text-[#1B3A2D] border border-[#DCD5C5] hover:bg-[#E5E0D3] transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <Server className="w-3.5 h-3.5 text-[#C95928]" />
            <span>Dùng Test Webhook Nội Bộ (In-App)</span>
          </button>
        </div>

        {/* Endpoint Input */}
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-[#1B3A2D] mb-1">
              Webhook URL Endpoint <span className="text-[#C95928]">*</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={webhookConfig.url}
                onChange={(e) => setWebhookConfig({ ...webhookConfig, url: e.target.value })}
                placeholder="VD: https://hook.eu1.make.com/xxx hoặc https://api.yourcrm.com/webhook"
                className="flex-1 bg-[#FBFAF5] border border-[#DCD5C5] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-[#333333] placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#1B3A2D] font-mono"
              />
              <button
                type="button"
                onClick={handleSendWebhook}
                disabled={sending}
                className="px-6 py-2.5 bg-[#C95928] hover:bg-[#A8471F] text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-[#C95928]/25 disabled:opacity-50 flex items-center gap-2 shrink-0 cursor-pointer"
              >
                {sending ? (
                  <>
                    <RotateCw className="w-4 h-4 animate-spin" />
                    <span>Đang gửi...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Bắn Webhook</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Custom Headers */}
          <div>
            <label className="block text-xs font-bold text-[#1B3A2D] mb-1">
              Custom Headers (Tùy chọn, định dạng JSON):
            </label>
            <textarea
              rows={2}
              value={webhookConfig.customHeaders}
              onChange={(e) => setWebhookConfig({ ...webhookConfig, customHeaders: e.target.value })}
              className="w-full bg-[#FBFAF5] border border-[#DCD5C5] rounded-xl p-3 text-xs text-[#333333] font-mono focus:outline-none focus:ring-1 focus:ring-[#1B3A2D]"
            />
          </div>
        </div>

        {/* Live Response Banner if available */}
        {lastResponse && (
          <div
            className={`p-4 rounded-xl border space-y-2 text-xs ${
              lastResponse.success
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-rose-50 border-rose-200 text-rose-800'
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-2 font-bold">
              <div className="flex items-center gap-2">
                {lastResponse.success ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-600" />
                )}
                <span>
                  Phản hồi: HTTP {lastResponse.status} {lastResponse.statusText}
                </span>
              </div>
              <div className="flex items-center gap-3 text-[11px] font-normal text-slate-500">
                <span>Độ trễ: {lastResponse.latencyMs}ms</span>
                <span>{lastResponse.timestamp}</span>
              </div>
            </div>

            <div className="bg-white p-3 rounded-lg border border-slate-200 text-[#333333] font-mono text-[11px] max-h-36 overflow-y-auto">
              <pre>{typeof lastResponse.responseData === 'object' ? JSON.stringify(lastResponse.responseData, null, 2) : String(lastResponse.responseData)}</pre>
            </div>
          </div>
        )}

        {/* Payload JSON Inspector */}
        <div className="border-t border-[#E5E0D3] pt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold font-serif-brand text-[#1B3A2D] uppercase tracking-wide flex items-center gap-1.5">
              <Code className="w-3.5 h-3.5 text-[#C95928]" /> Xem Trước JSON Payload Gửi Đi (Vũ Việt Home Schema):
            </span>
            <button
              type="button"
              onClick={() => handleCopy(JSON.stringify(webhookPayload, null, 2), 'copy-payload-json')}
              className="text-xs text-[#1B3A2D] hover:bg-[#F5F2E9] flex items-center gap-1 px-3 py-1 bg-white rounded-lg border border-[#DCD5C5] transition-colors font-medium cursor-pointer"
            >
              {copiedKey === 'copy-payload-json' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" /> Đã sao chép JSON
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" /> Sao chép JSON
                </>
              )}
            </button>
          </div>
          <div className="bg-[#152E24] text-[#FBFAF5] rounded-xl p-4 border border-[#2C5E4A] text-[11px] font-mono max-h-48 overflow-y-auto">
            <pre>{JSON.stringify(webhookPayload, null, 2)}</pre>
          </div>
        </div>
      </div>

      {/* 3. Internal Webhook Receiver Logs Inspector */}
      <div className="bg-white border border-[#E5E0D3] rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-[#E5E0D3] pb-3">
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-[#1B3A2D]" />
            <h3 className="text-sm font-bold font-serif-brand text-[#1B3A2D] uppercase tracking-wider">
              Lịch Sử Webhook Test Nội Bộ ({internalLogs.length})
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={fetchInternalLogs}
              disabled={loadingLogs}
              className="px-2.5 py-1.5 rounded-lg bg-[#F5F2E9] hover:bg-[#E5E0D3] text-[#1B3A2D] transition-colors text-xs flex items-center gap-1 font-medium cursor-pointer"
              title="Làm mới log"
            >
              <RotateCw className={`w-3.5 h-3.5 ${loadingLogs ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Làm mới</span>
            </button>
            {internalLogs.length > 0 && (
              <button
                type="button"
                onClick={clearInternalLogs}
                className="px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors text-xs flex items-center gap-1 font-medium cursor-pointer"
                title="Xóa logs"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Xóa</span>
              </button>
            )}
          </div>
        </div>

        {internalLogs.length === 0 ? (
          <div className="text-center py-6 text-slate-400 text-xs">
            Chưa có payload nào được gửi tới Test Endpoint nội bộ.
            <br />
            Bấm nút &quot;Dùng Test Webhook Nội Bộ&quot; ở trên rồi nhấn &quot;Bắn Webhook&quot; để trải nghiệm nhận dữ liệu thời gian thực.
          </div>
        ) : (
          <div className="space-y-3">
            {internalLogs.map((log) => (
              <div key={log.id} className="p-4 bg-[#FBFAF5] rounded-xl border border-[#E5E0D3] text-xs space-y-2">
                <div className="flex items-center justify-between text-slate-500">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#1B3A2D]" />
                    <span className="font-mono text-[#1B3A2D] font-bold">{log.id}</span>
                  </div>
                  <span className="text-[11px]">{new Date(log.timestamp).toLocaleTimeString('vi-VN')}</span>
                </div>
                <div className="bg-[#152E24] text-[#FBFAF5] p-3 rounded-lg font-mono text-[11px] max-h-36 overflow-y-auto">
                  <pre>{JSON.stringify(log.body, null, 2)}</pre>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
