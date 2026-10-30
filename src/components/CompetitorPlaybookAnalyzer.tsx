import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  ExternalLink, 
  Copy, 
  Check, 
  AlertCircle, 
  TrendingUp, 
  ShieldAlert, 
  Target, 
  Zap, 
  Layers, 
  ArrowRight, 
  FileText, 
  Download, 
  Users, 
  BrainCircuit, 
  CheckCircle2, 
  ChevronRight, 
  FileCheck2,
  Share2,
  Search,
  Lock,
  Unlock,
  Building,
  Flame,
  ArrowUpRight
} from 'lucide-react';
import { CompetitorDeepPlaybook, MarketResearchData } from '../types';
import { ProjectPreset } from '../data/samplePresets';
import type { ListingRow } from '../lib/market';

interface CompetitorPlaybookAnalyzerProps {
  selectedProject: ProjectPreset;
  marketData: MarketResearchData | null; // real, computed from scraped rows (null = nothing scraped yet)
  rows: ListingRow[];
  onApplyCounterTemplateToEditor?: (template: { title: string; subdivision?: string; highlights?: string; counterAngle?: string }) => void;
  onNextStep?: () => void;
  onNavigateToPart3?: () => void;
}

export const CompetitorPlaybookAnalyzer: React.FC<CompetitorPlaybookAnalyzerProps> = ({
  selectedProject,
  marketData,
  rows,
  onApplyCounterTemplateToEditor,
  onNextStep,
  onNavigateToPart3,
}) => {
  // Input form state. Nothing is pre-filled from sample data: the competitor comes from the real scraped rows.
  const [competitorUrl, setCompetitorUrl] = useState('');
  const [competitorName, setCompetitorName] = useState('');
  const [selectedBrokerKey, setSelectedBrokerKey] = useState('');
  const [customNotes, setCustomNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'strategy' | 'pillars' | 'roadmap' | 'markdown'>('strategy');
  const [playbook, setPlaybook] = useState<CompetitorDeepPlaybook | null>(null);

  // A different project means different data: clear the previous analysis.
  useEffect(() => {
    setCompetitorUrl('');
    setCompetitorName('');
    setSelectedBrokerKey('');
    setPlaybook(null);
    setError(null);
  }, [selectedProject.id]);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const brokerKeyOf = (b: { profileUrl: string; name: string }) => b.profileUrl.split('/pa/')[1] || b.name;

  const handleSelectBroker = (broker: MarketResearchData['top5Brokers'][0]) => {
    setSelectedBrokerKey(brokerKeyOf(broker));
    setCompetitorUrl(broker.profileUrl);
    setCompetitorName(broker.name);
    setError(null);
  };

  const brokerRows = selectedBrokerKey
    ? rows.filter((r) => (r.brokerProfile || r.broker) === selectedBrokerKey)
    : [];

  const handleAnalyze = async () => {
    if (brokerRows.length === 0 && !customNotes.trim()) {
      setError('Cần dữ liệu thật của đối thủ: chọn một môi giới trong danh sách bên trên (từ dữ liệu đã quét ở Phần 1), hoặc dán các tin đăng của họ vào ô ghi chú.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const resp = await fetch('/api/gemini/analyze-competitor-playbook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          competitorUrl: competitorUrl.trim(),
          competitorName: competitorName.trim(),
          projectName: selectedProject.name,
          customNotes: customNotes.trim(),
          rows: brokerRows,
        }),
      });

      const data = await resp.json().catch(() => ({}));
      if (!resp.ok) throw new Error(data?.error || `Lỗi ${resp.status}`);
      setPlaybook(data.data);
    } catch (err: any) {
      setError(err?.message || 'AI chưa phân tích được. Hãy thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadMarkdown = () => {
    try {
      const dateStr = new Date().toISOString().slice(0, 10);
      if (!playbook) return;
      const nameSlug = (playbook.competitorName || 'Doi-Thu').trim().replace(/[^a-zA-Z0-9]/g, '-');
      const blob = new Blob([playbook.markdownReport], { type: 'text/markdown;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Playbook-Doi-Thu-${nameSlug}-${dateStr}.md`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Input Console */}
      <div className="bg-white border-2 border-[#1B3A2D]/20 rounded-3xl p-6 sm:p-8 shadow-md space-y-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#C95928] uppercase tracking-widest mb-1.5">
            <BrainCircuit className="w-4 h-4 text-[#C95928]" />
            <span>Module I - Phần 2 &bull; Real Estate Growth Hacker AI</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold font-serif-brand text-[#1B3A2D]">
            Reverse-Engineering: Bóc Tách & Giải Mã Playbook Đối Thủ
          </h3>
          <p className="text-sm sm:text-base text-slate-600 mt-1 leading-relaxed">
            Chọn một môi giới trong dữ liệu thật đã quét ở Phần 1 (hoặc dán các tin đăng của họ). AI chỉ phân tích những tin thật đó: tiêu đề, giá, loại VIP, từ khóa. Phần nào danh sách không cho biết (traffic, Zalo/Facebook, tần suất đăng) sẽ ghi "Không có dữ liệu" thay vì đoán.
          </p>
        </div>

        {/* Quick select from Top 5 brokers of current project */}
        {marketData && marketData.top5Brokers.length > 0 && (
          <div className="bg-[#FBFAF5] p-4 rounded-2xl border border-[#E5E0D3] space-y-2.5">
            <span className="text-xs font-bold text-[#1B3A2D] uppercase tracking-wide flex items-center gap-1.5">
              <Users className="w-4 h-4 text-[#C95928]" />
              <span>Chọn một môi giới trong dữ liệu thật đã quét ({selectedProject.name}). App sẽ phân tích đúng các tin của họ:</span>
            </span>
            <div className="flex flex-wrap gap-2">
              {marketData.top5Brokers.map((b) => (
                <button
                  key={b.rank}
                  type="button"
                  onClick={() => handleSelectBroker(b)}
                  className={`px-3 py-1.5 rounded-xl hover:bg-[#1B3A2D] hover:text-white text-xs sm:text-sm font-semibold border transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${selectedBrokerKey === brokerKeyOf(b) ? 'bg-[#1B3A2D] text-white border-[#1B3A2D]' : 'bg-white border-[#DCD5C5]'}`}
                >
                  <span className="w-5 h-5 rounded-full bg-[#C95928] text-white text-[11px] font-bold flex items-center justify-center">
                    #{b.rank}
                  </span>
                  <span>{b.name}</span>
                  <span className="text-slate-400 text-xs">({b.totalListings} tin)</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Form Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-8 space-y-1.5">
            <label className="text-sm font-bold text-[#1B3A2D] flex items-center gap-1.5">
              <Search className="w-4 h-4 text-[#C95928]" />
              <span>Link Profile / Gian Hàng / Tin Đăng Đối Thủ (Batdongsan.com.vn):</span>
            </label>
            <input
              type="text"
              value={competitorUrl}
              onChange={(e) => setCompetitorUrl(e.target.value)}
              placeholder="https://batdongsan.com.vn/ban-nha-dat?q=0912888999"
              className="w-full bg-[#FBFAF5] border border-[#DCD5C5] rounded-xl px-4 py-3 text-sm sm:text-base text-[#1B3A2D] font-mono focus:outline-none focus:ring-2 focus:ring-[#1B3A2D]/30"
            />
          </div>

          <div className="md:col-span-4 space-y-1.5">
            <label className="text-sm font-bold text-[#1B3A2D] flex items-center gap-1.5">
              <Building className="w-4 h-4 text-[#C95928]" />
              <span>Tên / Sàn Của Đối Thủ:</span>
            </label>
            <input
              type="text"
              value={competitorName}
              onChange={(e) => setCompetitorName(e.target.value)}
              placeholder="Ví dụ: Nguyễn Văn Hùng (Newstarland)"
              className="w-full bg-[#FBFAF5] border border-[#DCD5C5] rounded-xl px-4 py-3 text-sm sm:text-base text-[#1B3A2D] focus:outline-none focus:ring-2 focus:ring-[#1B3A2D]/30"
            />
          </div>

          <div className="md:col-span-12 space-y-1.5">
            <label className="text-sm font-bold text-[#1B3A2D] flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-[#C95928]" />
                <span>Hoặc dán tin đăng / tiêu đề thật của đối thủ (nếu chưa chọn môi giới ở trên):</span>
              </span>
              <span className="text-xs text-slate-400 font-normal">Chỉ dán nội dung thật</span>
            </label>
            <textarea
              rows={2}
              value={customNotes}
              onChange={(e) => setCustomNotes(e.target.value)}
              placeholder="Dán nguyên văn tiêu đề / mô tả các tin của đối thủ, mỗi tin một dòng"
              className="w-full bg-[#FBFAF5] border border-[#DCD5C5] rounded-xl px-4 py-2.5 text-sm sm:text-base text-[#1B3A2D] focus:outline-none focus:ring-2 focus:ring-[#1B3A2D]/30 resize-none"
            />
          </div>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <div className="text-xs text-slate-500">
            Dự án tham chiếu: <strong className="text-[#1B3A2D]">{selectedProject.name}</strong>
          </div>
          <button
            type="button"
            onClick={handleAnalyze}
            disabled={loading}
            className="w-full sm:w-auto px-7 py-3.5 bg-[#C95928] hover:bg-[#A8471F] text-white font-bold text-sm sm:text-base rounded-xl transition-all shadow-md shadow-[#C95928]/25 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>AI đang phân tích tin của đối thủ...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Bóc Tách & Giải Mã Playbook Đối Thủ</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ===================== RESULT DASHBOARD ===================== */}
      {playbook && (
        <div className="space-y-6">
          {/* Competitor DNA Header Card */}
          <div className="bg-[#1B3A2D] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-[#2C5E4A] space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#2C5E4A] pb-6">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-[#FF6B35] uppercase tracking-widest mb-1.5">
                  <ShieldAlert className="w-4 h-4" />
                  <span>Hồ Sơ Tình Báo Cạnh Tranh &bull; Competitor DNA</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold font-serif-brand text-white">
                  {playbook.competitorName}
                </h3>
                <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-[#FBFAF5]/80">
                  <span className="flex items-center gap-1.5 text-slate-300 font-mono text-xs truncate max-w-md">
                    <ExternalLink className="w-3.5 h-3.5" />
                    {playbook.competitorUrl}
                  </span>
                  <span>&bull;</span>
                  <span>Quét lúc: {playbook.analyzedAt}</span>
                </div>
              </div>

              {/* Threat Level & Export actions */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <div className="bg-[#152E24] border border-[#2C5E4A] px-4 py-2.5 rounded-2xl flex items-center gap-3">
                  <span className="text-xs uppercase font-bold text-slate-300">Mức độ đe dọa:</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
                    playbook.threatLevel === 'Cực Kỳ Nguy Hiểm'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-400'
                      : playbook.threatLevel === 'Cao'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-400'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-400'
                  }`}>
                    <Flame className="w-3.5 h-3.5" />
                    <span>{playbook.threatLevel}</span>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopy(playbook.markdownReport, 'md-report')}
                    className="px-3.5 py-2.5 bg-[#2C5E4A] hover:bg-[#3B7B62] text-white rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                    title="Sao chép toàn bộ báo cáo Markdown"
                  >
                    {copiedKey === 'md-report' ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-300" />
                        <span>Đã copy</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copy Markdown</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleDownloadMarkdown}
                    className="px-3.5 py-2.5 bg-[#C95928] hover:bg-[#A8471F] text-white rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                    title="Tải file báo cáo Markdown về máy"
                  >
                    <Download className="w-4 h-4" />
                    <span>Tải .MD</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Synthesis Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-[#152E24]/80 p-4 rounded-2xl border border-[#2C5E4A]/60 space-y-1.5">
                <span className="text-xs uppercase font-bold text-[#FF6B35] tracking-wide block">
                  Định vị cốt lõi
                </span>
                <p className="text-[#FBFAF5] font-medium leading-relaxed">
                  {playbook.executiveSummary.corePositioning}
                </p>
              </div>

              <div className="bg-[#152E24]/80 p-4 rounded-2xl border border-[#2C5E4A]/60 space-y-1.5">
                <span className="text-xs uppercase font-bold text-[#FF6B35] tracking-wide block">
                  Phân khúc thống trị
                </span>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {playbook.executiveSummary.dominantSegments.map((seg, i) => (
                    <span key={i} className="px-2.5 py-0.5 rounded-lg bg-[#2C5E4A] text-white text-xs font-semibold">
                      {seg}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-[#152E24]/80 p-4 rounded-2xl border border-[#2C5E4A]/60 space-y-1.5">
                <span className="text-xs uppercase font-bold text-[#FF6B35] tracking-wide block">
                  Đòn bẩy traffic chính
                </span>
                <ul className="text-xs text-slate-200 space-y-1 list-disc list-inside">
                  {playbook.executiveSummary.primaryTrafficDrivers.map((td, i) => (
                    <li key={i}>{td}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-[#2C5E4A]/40 p-4 rounded-2xl border border-[#2C5E4A] text-sm text-[#FBFAF5] leading-relaxed">
              <strong className="text-[#FF6B35]">Đánh giá tổng hợp:</strong> {playbook.executiveSummary.summarySynthesis}
            </div>
          </div>

          {/* Subtabs selector for the detailed breakdown */}
          <div className="bg-white border border-[#E5E0D3] rounded-2xl p-2 flex flex-wrap gap-2 shadow-sm">
            <button
              type="button"
              onClick={() => setActiveTab('strategy')}
              className={`flex-1 min-w-[160px] py-3 px-4 rounded-xl text-sm sm:text-base font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'strategy'
                  ? 'bg-[#1B3A2D] text-white shadow-md'
                  : 'text-[#333333]/70 hover:text-[#1B3A2D] hover:bg-[#F5F2E9]'
              }`}
            >
              <Zap className="w-4 h-4 text-[#C95928]" />
              <span>3. Chiến Lược Phản Công</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('pillars')}
              className={`flex-1 min-w-[160px] py-3 px-4 rounded-xl text-sm sm:text-base font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'pillars'
                  ? 'bg-[#1B3A2D] text-white shadow-md'
                  : 'text-[#333333]/70 hover:text-[#1B3A2D] hover:bg-[#F5F2E9]'
              }`}
            >
              <Layers className="w-4 h-4 text-[#C95928]" />
              <span>2. Bóc Tách 4 Trụ Cột</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('roadmap')}
              className={`flex-1 min-w-[160px] py-3 px-4 rounded-xl text-sm sm:text-base font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'roadmap'
                  ? 'bg-[#1B3A2D] text-white shadow-md'
                  : 'text-[#333333]/70 hover:text-[#1B3A2D] hover:bg-[#F5F2E9]'
              }`}
            >
              <Target className="w-4 h-4 text-[#C95928]" />
              <span>4. Lộ Trình 3 Giai Đoạn</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('markdown')}
              className={`flex-1 min-w-[160px] py-3 px-4 rounded-xl text-sm sm:text-base font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'markdown'
                  ? 'bg-[#1B3A2D] text-white shadow-md'
                  : 'text-[#333333]/70 hover:text-[#1B3A2D] hover:bg-[#F5F2E9]'
              }`}
            >
              <FileCheck2 className="w-4 h-4 text-[#C95928]" />
              <span>Báo Cáo Toàn Văn (.MD)</span>
            </button>
          </div>

          {/* ===================== TAB 1: CHIẾN LƯỢC PHẢN CÔNG ===================== */}
          {activeTab === 'strategy' && (
            <div className="space-y-6">
              {/* Differentiation Matrix */}
              <div className="bg-white border border-[#E5E0D3] rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
                <div className="border-b border-[#E5E0D3] pb-3">
                  <h4 className="text-xl font-bold font-serif-brand text-[#1B3A2D] uppercase tracking-wide flex items-center gap-2">
                    <Zap className="w-5 h-5 text-[#C95928]" />
                    Ma Trận Khác Biệt Hoá Để Vượt Mặt Đối Thủ (Differentiation Matrix)
                  </h4>
                  <p className="text-sm text-slate-500 mt-1">
                    Chuyển đổi từ chiêu trò kêu gào "cắt lỗ / ngộp bank" sang định vị <strong>"Quiet Luxury"</strong> & Cố vấn tài chính chuyên sâu.
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#1B3A2D] text-white text-xs sm:text-sm uppercase tracking-wide font-bold">
                        <th className="p-3.5 rounded-l-xl w-1/3">Chiến Thuật Của Đối Thủ</th>
                        <th className="p-3.5 w-5/12 bg-[#2C5E4A]">Chiến Lược Phản Công Vũ Việt Home</th>
                        <th className="p-3.5 rounded-r-xl w-1/4">Tác Động Đo Lường</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E5E0D3] text-sm sm:text-base">
                      {playbook.offensiveCounterStrategy.differentiationMatrix.map((item, idx) => (
                        <tr key={idx} className={idx % 2 === 0 ? 'bg-[#FBFAF5]' : 'bg-white'}>
                          <td className="p-4 text-slate-700 font-medium align-top">
                            <span className="inline-block w-2 h-2 rounded-full bg-rose-500 mr-2" />
                            {item.competitorTactic}
                          </td>
                          <td className="p-4 text-[#1B3A2D] font-bold bg-[#F5F2E9]/60 align-top">
                            <span className="inline-block w-2 h-2 rounded-full bg-emerald-600 mr-2" />
                            {item.counterStrategy}
                          </td>
                          <td className="p-4 text-[#C95928] font-semibold align-top text-xs sm:text-sm">
                            {item.expectedImpact}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Counter Listing Templates */}
              <div className="bg-white border border-[#E5E0D3] rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E5E0D3] pb-3">
                  <div>
                    <h4 className="text-xl font-bold font-serif-brand text-[#1B3A2D] uppercase tracking-wide flex items-center gap-2">
                      <Target className="w-5 h-5 text-[#C95928]" />
                      Bộ Mẫu Tiêu Đề & Bài Đăng Phản Công Trực Diện
                    </h4>
                    <p className="text-sm text-slate-500 mt-0.5">
                      Được thiết kế để hạ gục tin đăng của đối thủ ngay trên cùng trang tìm kiếm Batdongsan.com.vn.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {playbook.offensiveCounterStrategy.counterListingTemplates.map((tpl, idx) => (
                    <div
                      key={idx}
                      className="p-5 rounded-2xl bg-[#FBFAF5] border-2 border-[#E5E0D3] hover:border-[#1B3A2D] transition-all flex flex-col justify-between space-y-4"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between gap-2">
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#1B3A2D] text-white">
                            Mẫu Phản Công #{idx + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopy(tpl.title, `tpl-${idx}`)}
                            className="text-xs text-[#C95928] hover:text-[#A8471F] font-bold flex items-center gap-1 cursor-pointer"
                          >
                            {copiedKey === `tpl-${idx}` ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-600" /> Đã copy
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" /> Copy Tiêu Đề
                              </>
                            )}
                          </button>
                        </div>

                        <h5 className="font-bold text-base sm:text-lg text-[#1B3A2D] leading-snug">
                          &quot;{tpl.title}&quot;
                        </h5>

                        <div className="p-3 rounded-xl bg-white border border-[#E5E0D3] text-xs sm:text-sm space-y-1.5">
                          <div>
                            <strong className="text-slate-600">Đối tượng mục tiêu:</strong>{' '}
                            <span className="text-[#1B3A2D]">{tpl.targetCustomer}</span>
                          </div>
                          <div>
                            <strong className="text-[#C95928]">Đòn bẩy tâm lý:</strong>{' '}
                            <span className="text-slate-800">{tpl.psychologicalHook}</span>
                          </div>
                          <div>
                            <strong className="text-emerald-700">Góc bẻ lái (Counter-angle):</strong>{' '}
                            <span className="text-slate-800">{tpl.counterAngle}</span>
                          </div>
                        </div>
                      </div>

                      {onApplyCounterTemplateToEditor && (
                        <button
                          type="button"
                          onClick={() => {
                            onApplyCounterTemplateToEditor({
                              title: tpl.title,
                              highlights: tpl.counterAngle,
                              counterAngle: tpl.counterAngle,
                            });
                            if (onNextStep) onNextStep();
                          }}
                          className="w-full py-2.5 px-4 bg-[#1B3A2D] hover:bg-[#C95928] text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <span>Áp dụng mẫu này sang Bước 2 Soạn Tin</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Omnichannel Interception Framework */}
              <div className="bg-white border border-[#E5E0D3] rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
                <h4 className="text-xl font-bold font-serif-brand text-[#1B3A2D] uppercase tracking-wide flex items-center gap-2 border-b border-[#E5E0D3] pb-3">
                  <Share2 className="w-5 h-5 text-[#C95928]" />
                  Khung Đón Đầu Đa Kênh (Omnichannel Interception)
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {playbook.offensiveCounterStrategy.omnichannelInterception.map((item, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-[#FBFAF5] border border-[#E5E0D3] space-y-2">
                      <span className="w-7 h-7 rounded-lg bg-[#C95928] text-white font-bold text-xs flex items-center justify-center">
                        #{idx + 1}
                      </span>
                      <p className="text-sm sm:text-base text-[#1B3A2D] font-medium leading-relaxed">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ===================== TAB 2: BÓC TÁCH 4 TRỤ CỘT ===================== */}
          {activeTab === 'pillars' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Pillar 1: Traffic & SEO */}
              <div className="bg-white border border-[#E5E0D3] rounded-3xl p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-[#E5E0D3] pb-3">
                  <h4 className="text-lg font-bold font-serif-brand text-[#1B3A2D] flex items-center gap-2 uppercase">
                    <span className="w-7 h-7 rounded-lg bg-sky-600 text-white text-xs flex items-center justify-center font-bold">1</span>
                    Traffic & SEO Saturation
                  </h4>
                  <span className="text-xs font-bold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-full">
                    Hiển Thị & Mật Độ
                  </span>
                </div>

                <div className="space-y-3 text-sm sm:text-base">
                  <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm">
                    <div className="bg-[#FBFAF5] p-3 rounded-xl border border-[#E5E0D3]">
                      <span className="text-slate-500 block uppercase font-bold text-[11px]">Số tin đăng ước tính</span>
                      <strong className="text-[#1B3A2D]">{playbook.pillar1TrafficAndSeo.activeListingsEstimate}</strong>
                    </div>
                    <div className="bg-[#FBFAF5] p-3 rounded-xl border border-[#E5E0D3]">
                      <span className="text-slate-500 block uppercase font-bold text-[11px]">Tần suất đẩy tin</span>
                      <strong className="text-[#1B3A2D]">{playbook.pillar1TrafficAndSeo.postingVelocity}</strong>
                    </div>
                  </div>

                  <div className="bg-[#FBFAF5] p-3.5 rounded-xl border border-[#E5E0D3] space-y-1">
                    <span className="text-xs uppercase font-bold text-slate-500">Công thức tiêu đề nhận diện:</span>
                    <ul className="text-xs sm:text-sm space-y-1 text-slate-800 list-disc list-inside">
                      {playbook.pillar1TrafficAndSeo.titleStructurePatterns.map((pat, i) => (
                        <li key={i}>{pat}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-[#FBFAF5] p-3.5 rounded-xl border border-[#E5E0D3] space-y-1.5">
                    <span className="text-xs uppercase font-bold text-slate-500">Từ khóa chiếm lĩnh:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {playbook.pillar1TrafficAndSeo.primaryKeywords.map((kw, i) => (
                        <span key={i} className="text-xs font-semibold bg-white text-sky-800 px-2.5 py-0.5 rounded border border-sky-200">
                          #{kw}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-sky-50/60 p-3 rounded-xl border border-sky-200 text-xs sm:text-sm text-sky-900 space-y-1">
                    <span className="font-bold block">Thủ thuật luồn lách thuật toán:</span>
                    <ul className="space-y-1 list-disc list-inside">
                      {playbook.pillar1TrafficAndSeo.algorithmicVisibilityTactics.map((t, i) => (
                        <li key={i}>{t}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Pillar 2: Copywriting & Pricing */}
              <div className="bg-white border border-[#E5E0D3] rounded-3xl p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-[#E5E0D3] pb-3">
                  <h4 className="text-lg font-bold font-serif-brand text-[#1B3A2D] flex items-center gap-2 uppercase">
                    <span className="w-7 h-7 rounded-lg bg-amber-600 text-white text-xs flex items-center justify-center font-bold">2</span>
                    Đòn Bẩy Tâm Lý & Định Giá
                  </h4>
                  <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full">
                    Copywriting Psychology
                  </span>
                </div>

                <div className="space-y-3 text-sm sm:text-base">
                  <div className="bg-rose-50 p-3.5 rounded-xl border border-rose-200 space-y-1.5">
                    <span className="text-xs uppercase font-bold text-rose-800 block">
                      Các từ khoá kích động hoảng loạn / ngộp bank:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {playbook.pillar2PsychologicalCopywriting.emotionalDistressHooks.map((hook, i) => (
                        <span key={i} className="text-xs font-bold bg-white text-rose-700 px-2.5 py-1 rounded-lg border border-rose-200">
                          {hook}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-[#FBFAF5] p-3.5 rounded-xl border border-[#E5E0D3] space-y-1">
                    <span className="text-xs uppercase font-bold text-slate-500">Chiến thuật tâm lý định giá:</span>
                    <p className="text-sm text-[#1B3A2D] font-medium leading-relaxed">
                      {playbook.pillar2PsychologicalCopywriting.pricingPsychology}
                    </p>
                  </div>

                  <div className="bg-[#FBFAF5] p-3.5 rounded-xl border border-[#E5E0D3] space-y-1">
                    <span className="text-xs uppercase font-bold text-slate-500">Cách tạo cảm giác &quot;mua hời&quot;:</span>
                    <p className="text-sm text-[#1B3A2D] font-medium leading-relaxed">
                      {playbook.pillar2PsychologicalCopywriting.valuePropositionTactic}
                    </p>
                  </div>

                  <div className="bg-amber-50/60 p-3 rounded-xl border border-amber-200 text-xs sm:text-sm text-amber-900 space-y-1">
                    <span className="font-bold block">Headline điển hình đối thủ đang dùng:</span>
                    <ul className="space-y-1 list-disc list-inside">
                      {playbook.pillar2PsychologicalCopywriting.analyzedHeadlines.map((hl, i) => (
                        <li key={i}>&quot;{hl}&quot;</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Pillar 3: Personal Branding & Funnel */}
              <div className="bg-white border border-[#E5E0D3] rounded-3xl p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-[#E5E0D3] pb-3">
                  <h4 className="text-lg font-bold font-serif-brand text-[#1B3A2D] flex items-center gap-2 uppercase">
                    <span className="w-7 h-7 rounded-lg bg-emerald-600 text-white text-xs flex items-center justify-center font-bold">3</span>
                    Thương Hiệu & Phễu Đa Kênh
                  </h4>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                    Branding & Funnel
                  </span>
                </div>

                <div className="space-y-3 text-sm sm:text-base">
                  <div className="bg-[#FBFAF5] p-3.5 rounded-xl border border-[#E5E0D3] space-y-1">
                    <span className="text-xs uppercase font-bold text-slate-500">Định vị hình ảnh cá nhân:</span>
                    <p className="text-sm text-[#1B3A2D] font-medium leading-relaxed">
                      {playbook.pillar3PersonalBranding.professionalPositioning}
                    </p>
                  </div>

                  <div className="bg-[#FBFAF5] p-3.5 rounded-xl border border-[#E5E0D3] space-y-1.5">
                    <span className="text-xs uppercase font-bold text-slate-500">Tín hiệu uy tín tạo dựng:</span>
                    <ul className="text-xs sm:text-sm text-slate-800 space-y-1 list-disc list-inside">
                      {playbook.pillar3PersonalBranding.credibilitySignals.map((cs, i) => (
                        <li key={i}>{cs}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-emerald-50/60 p-3.5 rounded-xl border border-emerald-200 text-xs sm:text-sm text-emerald-950 space-y-1">
                    <span className="font-bold text-emerald-900 block">Cơ chế gom phễu Zalo / SĐT:</span>
                    <p className="leading-relaxed">
                      {playbook.pillar3PersonalBranding.crossPlatformFunnel}
                    </p>
                  </div>
                </div>
              </div>

              {/* Pillar 4: Vulnerability & Gap Analysis */}
              <div className="bg-white border-2 border-rose-200 rounded-3xl p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-rose-200 pb-3">
                  <h4 className="text-lg font-bold font-serif-brand text-rose-900 flex items-center gap-2 uppercase">
                    <span className="w-7 h-7 rounded-lg bg-rose-600 text-white text-xs flex items-center justify-center font-bold">4</span>
                    Lỗ Hổng & Điểm Yếu Chết Người
                  </h4>
                  <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full">
                    Gaps to Exploit
                  </span>
                </div>

                <div className="space-y-3 text-sm sm:text-base">
                  <div className="bg-rose-50/80 p-3.5 rounded-xl border border-rose-200 space-y-1">
                    <span className="text-xs uppercase font-bold text-rose-800 block">
                      Điểm mù trong chiến lược của đối thủ:
                    </span>
                    <ul className="text-xs sm:text-sm text-slate-800 space-y-1 list-disc list-inside">
                      {playbook.pillar4VulnerabilityGaps.blindSpots.map((bs, i) => (
                        <li key={i}>{bs}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-[#FBFAF5] p-3.5 rounded-xl border border-[#E5E0D3] space-y-1">
                    <span className="text-xs uppercase font-bold text-slate-500">Góc tư vấn tài chính bị bỏ rơi:</span>
                    <ul className="text-xs sm:text-sm text-slate-800 space-y-1 list-disc list-inside">
                      {playbook.pillar4VulnerabilityGaps.missingFinancialAdvisory.map((fa, i) => (
                        <li key={i}>{fa}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-emerald-50 p-3.5 rounded-xl border border-emerald-200 text-xs sm:text-sm text-emerald-950 space-y-1">
                    <span className="font-bold text-emerald-900 block">Cơ hội vàng để Vũ Việt Home đánh gục:</span>
                    <ul className="space-y-1 list-disc list-inside">
                      {playbook.pillar4VulnerabilityGaps.vulnerabilitiesToExploit.map((ve, i) => (
                        <li key={i}>{ve}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===================== TAB 3: LỘ TRÌNH TRIỂN KHAI ===================== */}
          {activeTab === 'roadmap' && (
            <div className="bg-white border border-[#E5E0D3] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              <div className="border-b border-[#E5E0D3] pb-3">
                <h4 className="text-xl font-bold font-serif-brand text-[#1B3A2D] uppercase tracking-wide flex items-center gap-2">
                  <Target className="w-5 h-5 text-[#C95928]" />
                  Lộ Trình Triển Khai Thực Chiến 3 Giai Đoạn (Implementation Roadmap)
                </h4>
                <p className="text-sm text-slate-500 mt-0.5">
                  Các hành động kỹ thuật và marketing cụ thể sẵn sàng thực thi ngay lập tức.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Phase 1 */}
                <div className="p-5 rounded-2xl bg-[#FBFAF5] border border-[#E5E0D3] space-y-4">
                  <div className="flex items-center gap-2.5 border-b border-[#E5E0D3] pb-2.5">
                    <span className="w-8 h-8 rounded-xl bg-[#1B3A2D] text-white font-bold text-sm flex items-center justify-center">
                      G1
                    </span>
                    <div>
                      <span className="text-xs font-bold text-[#C95928] uppercase block">Ngày 1 - 7</span>
                      <h5 className="font-bold text-base text-[#1B3A2D]">Tinh Chỉnh Nội Dung</h5>
                    </div>
                  </div>
                  <ul className="space-y-2 text-xs sm:text-sm text-slate-800 leading-relaxed">
                    {playbook.actionableRoadmap.phase1ContentRefinement.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Phase 2 */}
                <div className="p-5 rounded-2xl bg-[#FBFAF5] border border-[#E5E0D3] space-y-4">
                  <div className="flex items-center gap-2.5 border-b border-[#E5E0D3] pb-2.5">
                    <span className="w-8 h-8 rounded-xl bg-[#2C5E4A] text-white font-bold text-sm flex items-center justify-center">
                      G2
                    </span>
                    <div>
                      <span className="text-xs font-bold text-[#C95928] uppercase block">Ngày 8 - 21</span>
                      <h5 className="font-bold text-base text-[#1B3A2D]">Thống Trị Thuật Toán SEO</h5>
                    </div>
                  </div>
                  <ul className="space-y-2 text-xs sm:text-sm text-slate-800 leading-relaxed">
                    {playbook.actionableRoadmap.phase2SeoDomination.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Phase 3 */}
                <div className="p-5 rounded-2xl bg-[#FBFAF5] border border-[#E5E0D3] space-y-4">
                  <div className="flex items-center gap-2.5 border-b border-[#E5E0D3] pb-2.5">
                    <span className="w-8 h-8 rounded-xl bg-[#C95928] text-white font-bold text-sm flex items-center justify-center">
                      G3
                    </span>
                    <div>
                      <span className="text-xs font-bold text-[#C95928] uppercase block">Ngày 22 - 30</span>
                      <h5 className="font-bold text-base text-[#1B3A2D]">Tự Động Hoá AI & CRM</h5>
                    </div>
                  </div>
                  <ul className="space-y-2 text-xs sm:text-sm text-slate-800 leading-relaxed">
                    {playbook.actionableRoadmap.phase3AiAutomation.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* ===================== TAB 4: BÁO CÁO TOÀN VĂN MARKDOWN ===================== */}
          {activeTab === 'markdown' && (
            <div className="bg-white border border-[#E5E0D3] rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E5E0D3] pb-3">
                <div>
                  <h4 className="text-xl font-bold font-serif-brand text-[#1B3A2D] uppercase tracking-wide flex items-center gap-2">
                    <FileCheck2 className="w-5 h-5 text-[#C95928]" />
                    Báo Cáo Chiến Lược Markdown Toàn Văn
                  </h4>
                  <p className="text-sm text-slate-500">
                    Cấu trúc 4 phần chuẩn Markdown sẵn sàng sao chép hoặc trích xuất gửi ban giám đốc.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopy(playbook.markdownReport, 'full-md')}
                    className="px-4 py-2 bg-[#1B3A2D] hover:bg-[#2C5E4A] text-white text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    {copiedKey === 'full-md' ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span>Đã copy toàn bộ</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Sao chép Markdown</span>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleDownloadMarkdown}
                    className="px-4 py-2 bg-[#C95928] hover:bg-[#A8471F] text-white text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <Download className="w-4 h-4" />
                    <span>Tải file .md</span>
                  </button>
                </div>
              </div>

              <div className="bg-[#152E24] text-[#FBFAF5] p-6 rounded-2xl font-mono text-xs sm:text-sm leading-relaxed overflow-x-auto whitespace-pre-wrap max-h-[600px] border border-[#2C5E4A]">
                {playbook.markdownReport}
              </div>
            </div>
          )}

          {/* Bottom Module Flow Bar - always visible */}
          <div className="bg-[#152E24] text-white p-5 sm:p-6 rounded-3xl border border-[#2C5E4A] flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg">
            <div className="space-y-1 text-center md:text-left">
              <span className="text-xs uppercase font-bold tracking-widest text-[#C95928] block">
                ✓ Hoàn Thành Phần 2: Bóc Tách Playbook Đối Thủ
              </span>
              <p className="text-sm text-[#FBFAF5]/90 font-medium">
                Bạn đã nắm rõ toàn bộ đòn bẩy tâm lý của đối thủ. Hãy chuyển tiếp sang Phần 3 hoặc bắt đầu soạn tin ngay.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              {onNavigateToPart3 && (
                <button
                  type="button"
                  onClick={onNavigateToPart3}
                  className="flex-1 md:flex-none px-4 py-3 bg-[#2C5E4A] hover:bg-[#397a61] text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-[#C95928]" />
                  <span>Xem Phần 3: Đề Xuất 3 Sản Phẩm</span>
                </button>
              )}
              {onNextStep && (
                <button
                  type="button"
                  onClick={onNextStep}
                  className="flex-1 md:flex-none px-5 py-3 bg-[#C95928] hover:bg-[#A8471F] text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Chuyển Sang II.SOẠN TIN</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
