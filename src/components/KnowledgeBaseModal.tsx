import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  Database,
  FileText,
  Upload,
  Save,
  CheckCircle2,
  RefreshCw,
  Cpu,
  Layers,
  Sparkles,
  Info,
  Calendar,
  Tag,
  ShieldAlert,
  ArrowRight,
  ExternalLink,
  Code
} from 'lucide-react';
import { ProjectKnowledgeBaseItem, ContextInjectionMatchResult } from '../types';
import {
  getAllKnowledgeBases,
  getKnowledgeBase,
  updateKnowledgeBase,
  matchAndInjectContext,
  extractSubdivisionsFromMarkdown,
} from '../lib/knowledgeRouter';

interface KnowledgeBaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProjectName: string;
  currentSubdivision?: string;
  currentPropertyType?: string;
  currentArea?: string;
  currentAmenities?: string;
  onKnowledgeUpdated?: (updatedDate: string) => void;
}

export const KnowledgeBaseModal: React.FC<KnowledgeBaseModalProps> = ({
  isOpen,
  onClose,
  currentProjectName,
  currentSubdivision,
  currentPropertyType,
  currentArea,
  currentAmenities,
  onKnowledgeUpdated,
}) => {
  const [activeTab, setActiveTab] = useState<'editor' | 'router_preview' | 'all_projects'>('editor');
  
  // Current active project in modal stored in state
  const initialKb = getKnowledgeBase(currentProjectName);
  const [selectedProjectId, setSelectedProjectId] = useState<string>(initialKb.id);
  const [kbItem, setKbItem] = useState<ProjectKnowledgeBaseItem>(initialKb);

  // Markdown edit state
  const [markdownText, setMarkdownText] = useState<string>(initialKb.markdownContent);
  const [isSavedNotice, setIsSavedNotice] = useState<boolean>(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Sync state whenever modal opens or currentProjectName changes
  useEffect(() => {
    if (isOpen) {
      const kb = getKnowledgeBase(currentProjectName);
      setSelectedProjectId(kb.id);
      setKbItem(kb);
      setMarkdownText(kb.markdownContent);
      setIsSavedNotice(false);
    }
  }, [isOpen, currentProjectName]);

  // Switch project handler
  const handleSelectProject = (projectId: string) => {
    setSelectedProjectId(projectId);
    const kb = getKnowledgeBase(projectId);
    setKbItem(kb);
    setMarkdownText(kb.markdownContent);
    setIsSavedNotice(false);
  };

  // Upload file .md handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setMarkdownText(content);
        // Automatically extract subdivisions from uploaded file for immediate visual feedback
        const liveSubs = extractSubdivisionsFromMarkdown(content);
        setSaveSuccessMsg(`Đã tải lên tệp "${file.name}" (${(file.size / 1024).toFixed(1)} KB) nhận diện ${liveSubs.length} phân khu! Hãy nhấn "Lưu & Cập nhật tri thức" để áp dụng.`);
        setIsSavedNotice(true);
        setTimeout(() => setIsSavedNotice(false), 6000);
      }
    };
    reader.readAsText(file);
  };

  // Live extracted subdivisions from current markdown in editor
  const liveSubdivisions = useMemo(() => {
    const extracted = extractSubdivisionsFromMarkdown(markdownText);
    return extracted.length > 0 ? extracted : kbItem.subdivisions;
  }, [markdownText, kbItem.subdivisions]);

  // Save changes handler with both Local Cache & Backend Server API sync
  const handleSave = async () => {
    setIsSaving(true);
    const today = new Date().toLocaleDateString('vi-VN');
    
    // 1. Update client-side runtime cache
    const updated = updateKnowledgeBase(selectedProjectId, {
      markdownContent: markdownText,
      updatedAt: today,
    });
    setKbItem(updated);

    // 2. Persist to Backend server so Gemini AI Prompt & Rulebook fallback use the new tri thức
    try {
      await fetch('/api/knowledge-base/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedProjectId,
          markdownContent: markdownText,
          updatedAt: today,
          version: updated.version,
        }),
      });
    } catch (err) {
      console.warn('Backend knowledge base update warning:', err);
    }

    setSaveSuccessMsg(`✅ Đã cập nhật thành công Cơ sở tri thức cho "${updated.name}" (${updated.subdivisions.length} phân khu)! Ngày cập nhật: ${today}`);
    setIsSavedNotice(true);
    setIsSaving(false);
    setTimeout(() => setIsSavedNotice(false), 5000);

    if (onKnowledgeUpdated) {
      onKnowledgeUpdated(today);
    }
  };

  // Run Router Matcher for preview with custom markdown passed so it's 100% REALTIME
  const matchResult: ContextInjectionMatchResult = useMemo(() => {
    return matchAndInjectContext({
      projectName: kbItem.name,
      subdivision: currentSubdivision,
      propertyType: currentPropertyType,
      area: currentArea,
      amenities: currentAmenities,
      customMarkdown: markdownText, // Live feedback with markdown in editor!
    });
  }, [kbItem.name, currentSubdivision, currentPropertyType, currentArea, currentAmenities, markdownText]);

  if (!isOpen) return null;

  const allProjects = getAllKnowledgeBases();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-[#FBFAF5] border border-[#DCD5C5] w-full max-w-5xl rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden text-[#333333]">
        
        {/* Modal Header */}
        <div className="bg-[#1B3A2D] text-white p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2C5E4A]">
          <div className="flex items-start sm:items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[#C95928] text-white shadow-sm shrink-0">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-xl sm:text-2xl font-bold font-serif-brand">
                  Cơ Sở Tri Thức Dự Án (Knowledge Base)
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  v{kbItem.version}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-emerald-100/80 mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1">
                <span>Dự án: <strong className="text-white">{kbItem.name}</strong></span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#C95928]" />
                  Ngày cập nhật: <strong className="text-white">{kbItem.updatedAt}</strong>
                </span>
                <span>•</span>
                <span>Tệp: <code className="bg-black/20 px-1.5 py-0.5 rounded text-amber-200">{kbItem.filename}</code></span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            <button
              onClick={onClose}
              className="p-2 text-white/70 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
              title="Đóng modal"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-[#F0ECE1] px-6 pt-3 border-b border-[#DCD5C5] flex items-center justify-between overflow-x-auto">
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setActiveTab('editor')}
              className={`px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
                activeTab === 'editor'
                  ? 'bg-[#FBFAF5] text-[#1B3A2D] border-t-2 border-[#C95928] shadow-xs'
                  : 'text-stone-600 hover:text-[#1B3A2D] hover:bg-white/40'
              }`}
            >
              <FileText className="w-4 h-4 text-[#C95928]" />
              Biên tập File .MD & Tải lên
            </button>

            <button
              onClick={() => setActiveTab('router_preview')}
              className={`px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
                activeTab === 'router_preview'
                  ? 'bg-[#FBFAF5] text-[#1B3A2D] border-t-2 border-[#C95928] shadow-xs'
                  : 'text-stone-600 hover:text-[#1B3A2D] hover:bg-white/40'
              }`}
            >
              <Cpu className="w-4 h-4 text-emerald-600" />
              Bộ Lọc Router & Context Injection
              <span className="px-1.5 py-0.2 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                Smart Filter
              </span>
            </button>

            <button
              onClick={() => setActiveTab('all_projects')}
              className={`px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
                activeTab === 'all_projects'
                  ? 'bg-[#FBFAF5] text-[#1B3A2D] border-t-2 border-[#C95928] shadow-xs'
                  : 'text-stone-600 hover:text-[#1B3A2D] hover:bg-white/40'
              }`}
            >
              <Layers className="w-4 h-4 text-blue-600" />
              Danh Mục 6 Dự Án ({allProjects.length})
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs text-stone-500 pb-2">
            <span>Dự án đang chọn:</span>
            <select
              value={selectedProjectId}
              onChange={(e) => handleSelectProject(e.target.value)}
              className="bg-white border border-[#DCD5C5] rounded-lg px-2.5 py-1 text-xs font-semibold text-[#1B3A2D]"
            >
              {allProjects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Feedback Alert */}
        {isSavedNotice && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-6 py-3 text-emerald-800 text-xs sm:text-sm font-semibold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{saveSuccessMsg}</span>
          </div>
        )}

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          
          {/* TAB 1: MARKDOWN EDITOR & UPLOAD */}
          {activeTab === 'editor' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#DCD5C5]">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[#1B3A2D]">File tri thức:</span>
                    <code className="text-xs bg-[#F5F2E9] text-[#1B3A2D] font-mono px-2 py-0.5 rounded border border-[#DCD5C5]">
                      {kbItem.filename}
                    </code>
                    <span className="text-xs text-stone-500">({kbItem.sizeKb} KB)</span>
                  </div>
                  <p className="text-xs text-stone-500">
                    Nếu dữ liệu đã cũ, bạn có thể chỉnh sửa trực tiếp nội dung Markdown bên dưới hoặc tải lên tệp <code>.md</code> mới nhất từ chủ đầu tư.
                  </p>
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                  {/* File Upload Button */}
                  <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-[#DCD5C5] hover:bg-stone-50 text-xs font-bold text-[#1B3A2D] transition-colors shadow-2xs">
                    <Upload className="w-3.5 h-3.5 text-[#C95928]" />
                    <span>Tải file .md mới</span>
                    <input
                      type="file"
                      accept=".md,.txt"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>

                  {/* Save Button */}
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1B3A2D] hover:bg-[#152e24] disabled:opacity-60 text-xs font-bold text-white transition-colors shadow-xs cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5 text-[#C95928]" />
                    <span>{isSaving ? 'Đang lưu...' : 'Lưu & Cập nhật tri thức'}</span>
                  </button>
                </div>
              </div>

              {/* Tag previews - Live from active markdown */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs bg-white p-3 rounded-2xl border border-[#DCD5C5]">
                <span className="text-stone-500 font-bold mr-1 flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5 text-[#C95928]" />
                  Phân khu trong tri thức ({liveSubdivisions.length}):
                </span>
                {liveSubdivisions.map((sub, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-0.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold"
                  >
                    {sub}
                  </span>
                ))}
              </div>

              {/* Textarea Markdown Editor */}
              <div className="relative">
                <textarea
                  value={markdownText}
                  onChange={(e) => setMarkdownText(e.target.value)}
                  rows={18}
                  className="w-full font-mono text-xs sm:text-sm p-4 bg-white border border-[#DCD5C5] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#1B3A2D] text-stone-800 leading-relaxed shadow-inner"
                  placeholder="Nhập hoặc dán nội dung Markdown của dự án..."
                />
                <div className="absolute bottom-3 right-3 text-[11px] text-stone-400 bg-white/90 px-2 py-0.5 rounded border border-stone-200">
                  {markdownText.split('\n').length} dòng • {markdownText.length} ký tự
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ROUTER & CONTEXT INJECTION PREVIEW */}
          {activeTab === 'router_preview' && (
            <div className="space-y-5">
              {/* Concept Banner */}
              <div className="bg-linear-to-r from-[#1B3A2D]/5 via-amber-50 to-emerald-50 p-4 sm:p-5 rounded-2xl border border-emerald-200">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-[#1B3A2D] text-white shrink-0 mt-0.5">
                    <Cpu className="w-5 h-5 text-[#C95928]" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-sm text-[#1B3A2D] flex items-center gap-2">
                      Cơ Chế Context Injection & Bộ Lọc Thông Minh (Router/Matcher)
                      <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold">
                        Độ chính xác {matchResult.confidenceScore}%
                      </span>
                    </h4>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      Thay vì nhồi nhét toàn bộ tài liệu dự án hàng chục nghìn chữ vào ngữ cảnh chung (gây loãng chú ý và AI tự bịa đặt),
                      bộ lọc <strong>Router / Matcher</strong> chỉ trích xuất chính xác phân đoạn về: <strong>Quy hoạch phân khu</strong>, 
                      <strong>Tiêu chuẩn loại hình sản phẩm</strong>, <strong>Đại tiện ích thực tế kề cận</strong> và <strong>Vị trí kết nối giao thông</strong> của căn nhà đang soạn.
                    </p>
                  </div>
                </div>
              </div>

              {/* Matching Status Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="bg-white p-3.5 rounded-2xl border border-[#DCD5C5] shadow-2xs space-y-1">
                  <div className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">Dự án nhận diện</div>
                  <div className="font-bold text-sm text-[#1B3A2D] truncate">{matchResult.projectName}</div>
                  <div className="text-[11px] text-emerald-600 font-medium">Khớp từ Knowledge Base</div>
                </div>

                <div className="bg-white p-3.5 rounded-2xl border border-[#DCD5C5] shadow-2xs space-y-1">
                  <div className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">Phân khu khớp</div>
                  <div className="font-bold text-sm text-[#C95928] truncate">{matchResult.matchedSubdivision || 'Trung tâm'}</div>
                  <div className="text-[11px] text-stone-500 font-medium">Trích xuất quy hoạch chuẩn</div>
                </div>

                <div className="bg-white p-3.5 rounded-2xl border border-[#DCD5C5] shadow-2xs space-y-1">
                  <div className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">Loại hình sản phẩm</div>
                  <div className="font-bold text-sm text-[#1B3A2D] truncate">{matchResult.matchedProductType}</div>
                  <div className="text-[11px] text-stone-500 font-medium">Khớp tiêu chuẩn xây dựng</div>
                </div>

                <div className="bg-white p-3.5 rounded-2xl border border-[#DCD5C5] shadow-2xs space-y-1">
                  <div className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">Tiện ích liên kết</div>
                  <div className="font-bold text-sm text-emerald-700">{matchResult.matchedAmenities.length} tiện ích chọn lọc</div>
                  <div className="text-[11px] text-stone-500 font-medium">Chính xác 100% CĐT</div>
                </div>
              </div>

              {/* Injected Context Box */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#1B3A2D] flex items-center gap-1.5">
                    <Code className="w-4 h-4 text-[#C95928]" />
                    Khối Dữ Liệu Context Injection Nạp Vào Prompt Của AI:
                  </label>
                  <span className="text-[11px] text-stone-400 italic">
                    AI sẽ đọc khối này đầu tiên và tuân thủ dữ liệu quy hoạch
                  </span>
                </div>
                
                <pre className="p-4 rounded-2xl bg-[#1B3A2D] text-emerald-100 font-mono text-xs leading-relaxed overflow-x-auto whitespace-pre-wrap border border-[#2C5E4A] shadow-inner max-h-[340px]">
                  {matchResult.injectedContextText}
                </pre>
              </div>

              {/* Matched Amenities Checklist */}
              <div className="bg-white p-4 rounded-2xl border border-[#DCD5C5] space-y-3">
                <div className="text-xs font-bold text-[#1B3A2D] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Danh mục Đại Tiện Ích Xác Thực Được Bộ Lọc Chọn Lọc Cho Bài Viết:
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                  {matchResult.matchedAmenities.map((amenity, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-[#F5F2E9] border border-[#E5E0D3] text-stone-800 flex items-start gap-2"
                    >
                      <span className="w-5 h-5 rounded-full bg-[#1B3A2D] text-white flex items-center justify-center text-[10px] shrink-0 font-bold">
                        {idx + 1}
                      </span>
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ALL PROJECTS DIRECTORY */}
          {activeTab === 'all_projects' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-stone-600">
                  Hệ thống quản lý cơ sở tri thức cho 6 đại đô thị trọng điểm. Nhấn vào dự án bất kỳ để chuyển đổi và biên tập file <code>.md</code> tương ứng.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {allProjects.map((p) => {
                  const isSelected = p.id === selectedProjectId;
                  return (
                    <div
                      key={p.id}
                      onClick={() => handleSelectProject(p.id)}
                      className={`cursor-pointer p-4 rounded-2xl border transition-all text-left space-y-2.5 ${
                        isSelected
                          ? 'bg-[#1B3A2D]/5 border-[#1B3A2D] ring-2 ring-[#1B3A2D]/20 shadow-sm'
                          : 'bg-white border-[#DCD5C5] hover:border-stone-400 hover:shadow-2xs'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h5 className="font-bold text-sm text-[#1B3A2D] flex items-center gap-1.5">
                            {p.name}
                            {isSelected && (
                              <span className="px-2 py-0.5 rounded-full bg-[#1B3A2D] text-white text-[10px]">
                                Đang chọn
                              </span>
                            )}
                          </h5>
                          <div className="text-[11px] text-stone-400 font-mono mt-0.5">
                            {p.filename} ({p.sizeKb} KB)
                          </div>
                        </div>

                        <span className="text-xs font-semibold px-2 py-1 rounded-lg bg-emerald-100 text-emerald-800 shrink-0">
                          v{p.version}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-1 text-[11px]">
                        {p.tags.slice(0, 4).map((t, i) => (
                          <span key={i} className="px-2 py-0.5 rounded-md bg-[#F5F2E9] text-stone-700">
                            #{t}
                          </span>
                        ))}
                      </div>

                      <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-[#C95928]" />
                          Cập nhật: <strong className="text-stone-700">{p.updatedAt}</strong>
                        </span>
                        <span className="text-emerald-700 font-semibold flex items-center gap-1">
                          {p.subdivisions.length} phân khu <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="bg-[#F0ECE1] px-6 py-4 border-t border-[#DCD5C5] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="text-xs text-stone-600 flex items-center gap-2">
            <Info className="w-4 h-4 text-[#C95928] shrink-0" />
            <span>
              Cơ chế <strong>Context Injection</strong> tự động kích hoạt mỗi khi nhấn "Soạn Tin AI" tại Bước 2.
            </span>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            {activeTab === 'editor' && (
              <button
                onClick={handleSave}
                className="px-4 py-2 rounded-xl bg-[#1B3A2D] hover:bg-[#152e24] text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <Save className="w-3.5 h-3.5 text-[#C95928]" />
                Lưu Thay Đổi File .MD
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white border border-[#DCD5C5] hover:bg-stone-50 text-xs font-bold text-[#1B3A2D] transition-colors"
            >
              Đóng
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
