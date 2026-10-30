import React, { useState, useEffect, useMemo } from 'react';
import { 
  Sparkles, 
  ExternalLink, 
  Copy, 
  Check, 
  AlertCircle, 
  TrendingUp, 
  BarChart3, 
  Crown, 
  Award, 
  Phone, 
  Layers, 
  ArrowRight, 
  Clock, 
  Printer, 
  History, 
  CheckCircle2,
  FolderKanban,
  FileText,
  Download,
  Save,
  Database,
  Calendar,
  BrainCircuit,
  Building2,
  Trash2
} from 'lucide-react';
import { MarketResearchData, ProjectFormData } from '../types';
import { ProjectPreset, FOUR_VINHOMES_PROJECTS } from '../data/samplePresets';
import { CompetitorPlaybookAnalyzer } from './CompetitorPlaybookAnalyzer';
import {
  ListingRow,
  MarketContext,
  parseDatasetJson,
  mergeRows,
  computeMarketData,
  buildMarketContext,
} from '../lib/market';
import { EXTRACT_SCRIPT, bookmarkletHref } from '../lib/bookmarklet';

// The AI only supplies wording. Numbers always come from the real rows.
function applyNarrative(base: MarketResearchData, n: any): MarketResearchData {
  if (!n) return base;
  return {
    ...base,
    vipStats: {
      ...base.vipStats,
      competitionAnalysis: [base.vipStats.competitionAnalysis, n.competitionAnalysis].filter(Boolean).join(' '),
    },
    contentCategories: base.contentCategories.map((c) => ({
      ...c,
      angles: n.categoryAngles?.find((a: any) => a.categoryName === c.categoryName)?.angles?.length
        ? n.categoryAngles.find((a: any) => a.categoryName === c.categoryName).angles
        : c.angles,
    })),
    historicalComparison: {
      ...base.historicalComparison,
      marketNotes: [base.historicalComparison.marketNotes, n.marketNotes].filter(Boolean).join(' '),
    },
    recommendations: base.recommendations.map((r) => {
      const a = n.recommendations?.find((x: any) => x.id === r.id);
      if (!a) return r;
      return {
        ...r,
        whyRecommended: a.whyRecommended || r.whyRecommended,
        sampleTitleBDS: a.sampleTitleBDS || r.sampleTitleBDS,
        outlineBullets: a.outlineBullets?.length ? a.outlineBullets : r.outlineBullets,
      };
    }),
    dataSource: base.dataSource ? { ...base.dataSource, aiNarrative: true } : base.dataSource,
  };
}

interface ModuleResearchProps {
  selectedProject: ProjectPreset;
  onSelectProject?: (project: ProjectPreset) => void;
  onApplyProductToEditor: (specs: MarketResearchData['recommendations'][0]['specs'] & {
    appliedTitle?: string;
    counterAngle?: string;
    sourceStrategy?: 'counter_playbook' | 'top_recommendation' | 'manual';
  }) => void;
  onMarketContextChange?: (ctx: MarketContext | null) => void;
  onNextStep: () => void;
}

export const ModuleResearch: React.FC<ModuleResearchProps> = ({
  selectedProject,
  onSelectProject,
  onApplyProductToEditor,
  onMarketContextChange,
  onNextStep,
}) => {
  // Sub-tabs: 'part1' (Top đầu dự án), 'part2' (Phân tích đồng nghiệp), 'part3' (Đề xuất 3 sản phẩm)
  const [activeSubTab, setActiveSubTab] = useState<'part1' | 'part2' | 'part3'>('part1');

  // Page Scope selection: '1_page' (30 listings), '2_pages' (60 listings), or '3_pages' (90 listings)
  const [selectedScope, setSelectedScope] = useState<'1_page' | '2_pages' | '3_pages'>('3_pages');

  // URL state - auto-populated when project changes
  const [batdongsanUrl, setBatdongsanUrl] = useState(selectedProject.batdongsanUrl);
  const [rows, setRows] = useState<ListingRow[]>([]);
  const [scrapedAt, setScrapedAt] = useState('');
  const [pasteText, setPasteText] = useState('');
  const [narrative, setNarrative] = useState<any | null>(null);
  const [narrating, setNarrating] = useState(false);
  const [intakeNotice, setIntakeNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const storageKey = `vvh_rows_${selectedProject.id}`;

  // When the project changes: load the rows previously scraped for it (never any sample data)
  useEffect(() => {
    setBatdongsanUrl(selectedProject.batdongsanUrl);
    setError(null);
    setNarrative(null);
    setIntakeNotice(null);
    try {
      const stored = localStorage.getItem(`vvh_rows_${selectedProject.id}`);
      const parsed = stored ? JSON.parse(stored) : null;
      setRows(Array.isArray(parsed?.rows) ? parsed.rows : []);
      setScrapedAt(parsed?.scrapedAt || '');
    } catch {
      setRows([]);
      setScrapedAt('');
    }
  }, [selectedProject.id]);

  const persistRows = (nextRows: ListingRow[], at: string) => {
    try {
      localStorage.setItem(storageKey, JSON.stringify({ rows: nextRows, scrapedAt: at }));
    } catch (e) {
      console.warn('Cannot persist rows', e);
    }
  };

  const baseMarketData = useMemo(
    () => computeMarketData(rows, { projectName: selectedProject.name, batdongsanUrl, scrapedAt }),
    [rows, selectedProject.name, batdongsanUrl, scrapedAt]
  );
  const hasData = rows.length > 0;
  const marketData: MarketResearchData = useMemo(
    () => (hasData ? applyNarrative(baseMarketData, narrative) : baseMarketData),
    [hasData, baseMarketData, narrative]
  );

  useEffect(() => {
    setSelectedScope(marketData.pageScope || '3_pages');
  }, [marketData.pageScope]);

  // Phase 3: hand the real market facts to the listing generator
  useEffect(() => {
    if (!onMarketContextChange) return;
    onMarketContextChange(
      hasData ? buildMarketContext(rows, { projectName: selectedProject.name, batdongsanUrl, scrapedAt }) : null
    );
  }, [hasData, rows, selectedProject.name, batdongsanUrl, scrapedAt]);

  const handleAddData = () => {
    setError(null);
    try {
      const parsed = parseDatasetJson(pasteText);
      const merged = mergeRows(rows, parsed.rows);
      const at = parsed.scrapedAt || new Date().toLocaleString('vi-VN');
      setRows(merged);
      setScrapedAt(at);
      setNarrative(null); // the data changed, old wording no longer matches
      persistRows(merged, at);
      setPasteText('');
      const pages = [...new Set(parsed.rows.map((r) => r.page))].join(', ');
      setIntakeNotice(`Đã thêm ${parsed.rows.length} tin (trang ${pages}). Tổng đang có ${merged.length} tin.`);
    } catch (err: any) {
      setError(err?.message || 'Không đọc được dữ liệu dán vào.');
    }
  };

  const handleClearData = () => {
    setRows([]);
    setScrapedAt('');
    setNarrative(null);
    setIntakeNotice(null);
    persistRows([], '');
  };

  const handleNarrative = async () => {
    setNarrating(true);
    setError(null);
    try {
      const resp = await fetch('/api/market/narrative', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectName: selectedProject.name, batdongsanUrl: batdongsanUrl.trim(), scrapedAt, rows }),
      });
      const data = await resp.json().catch(() => ({}));
      if (!resp.ok) throw new Error(data?.error || `Lỗi ${resp.status}`);
      setNarrative(data.data);
    } catch (err: any) {
      setError(err?.message || 'AI chưa viết được nhận định. Các con số thống kê vẫn đúng.');
    } finally {
      setNarrating(false);
    }
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Compute dynamic stats based on selected scope
  const page1 = marketData.pagesBreakdown?.[0];
  const page2 = marketData.pagesBreakdown?.[1];
  const page3 = marketData.pagesBreakdown?.[2];

  const currentStats = React.useMemo(() => {
    if (selectedScope === '1_page' && page1) {
      return {
        totalListings: page1.totalListings,
        vipDiamond: page1.vipDiamond,
        vipGold: page1.vipGold,
        vipSilver: page1.vipSilver,
        normal: page1.normal,
        vipPercentage: page1.vipPercentage,
        label: `Trang 1 (${page1.totalListings} tin)`,
      };
    }
    if (selectedScope === '2_pages' && page1 && page2) {
      const diamond = page1.vipDiamond + page2.vipDiamond;
      const gold = page1.vipGold + page2.vipGold;
      const silver = page1.vipSilver + page2.vipSilver;
      const normal = page1.normal + page2.normal;
      const total = page1.totalListings + page2.totalListings;
      const vipTotal = diamond + gold + silver;
      return {
        totalListings: total,
        vipDiamond: diamond,
        vipGold: gold,
        vipSilver: silver,
        normal: normal,
        vipPercentage: Number(((vipTotal / total) * 100).toFixed(1)),
        label: `Trang 1-2 (${total} tin)`,
      };
    }
    // Default 3 pages
    return {
      totalListings: marketData.totalListingsCount,
      vipDiamond: marketData.vipStats.vipDiamond,
      vipGold: marketData.vipStats.vipGold,
      vipSilver: marketData.vipStats.vipSilver,
      normal: marketData.vipStats.normal,
      vipPercentage: marketData.vipStats.vipPercentage,
      label: `${marketData.dataSource?.pages.length || 0} trang đã quét (${marketData.totalListingsCount} tin)`,
    };
  }, [selectedScope, marketData, page1, page2, page3]);

  // Local snapshots state for historical comparison
  interface MarketSnapshot {
    id: string;
    savedAt: string;
    projectName: string;
    totalListings: number;
    vipPercentage: number;
    vipDiamond: number;
    vipGold: number;
    vipSilver: number;
    normal: number;
    topBrokerName: string;
    notes: string;
  }

  const [snapshots, setSnapshots] = useState<MarketSnapshot[]>([]);
  const [selectedSnapshotId, setSelectedSnapshotId] = useState<string>('baseline');
  const [snapshotSavedNotice, setSnapshotSavedNotice] = useState<string | null>(null);
  const [reportNotice, setReportNotice] = useState<string | null>(null);

  // Load snapshots for this project from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(`vvh_snapshots_${selectedProject.id}`);
      if (stored) {
        setSnapshots(JSON.parse(stored));
      } else {
        setSnapshots([]);
      }
    } catch {
      setSnapshots([]);
    }
  }, [selectedProject.id]);

  const handleSaveSnapshot = () => {
    const newSnapshot: MarketSnapshot = {
      id: `snap_${Date.now()}`,
      savedAt: new Date().toLocaleString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      projectName: selectedProject.name,
      totalListings: currentStats.totalListings,
      vipPercentage: currentStats.vipPercentage,
      vipDiamond: currentStats.vipDiamond,
      vipGold: currentStats.vipGold,
      vipSilver: currentStats.vipSilver,
      normal: currentStats.normal,
      topBrokerName: marketData.top5Brokers?.[0]?.name || 'N/A',
      notes: `Mặt bằng giá: ${marketData.productsAndPricing?.[0]?.priceRange || 'N/A'} - Tin VIP chiếm ${currentStats.vipPercentage}%`,
    };

    const updated = [newSnapshot, ...snapshots.slice(0, 9)];
    setSnapshots(updated);
    setSelectedSnapshotId(newSnapshot.id);
    try {
      localStorage.setItem(`vvh_snapshots_${selectedProject.id}`, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
    setSnapshotSavedNotice('Đã lưu snapshot dữ liệu này vào bộ nhớ lịch sử thành công!');
    setTimeout(() => setSnapshotSavedNotice(null), 3500);
  };

  const generateReportHtml = () => {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const reportDateStr = `${day}/${month}/${year}`;
    const reportFullTitle = `Báo Cáo Nghiên Cứu Đăng Tin ${marketData.projectName} ${reportDateStr}`;

    return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${reportFullTitle}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Source+Sans+3:wght@400;600;700&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Source Sans 3', sans-serif;
      color: #333333;
      background: #FBFAF5;
      padding: 24px;
      line-height: 1.5;
    }
    @page {
      size: A4 portrait;
      margin: 12mm 10mm;
    }
    @media print {
      body { background: white; padding: 0; }
      .no-print { display: none !important; }
      .container { box-shadow: none !important; border: none !important; padding: 0 !important; }
    }
    .container {
      max-width: 900px;
      margin: 0 auto;
      background: white;
      padding: 32px;
      border-radius: 16px;
      border: 1px solid #E5E0D3;
      box-shadow: 0 4px 20px rgba(0,0,0,0.06);
    }
    .print-bar {
      position: sticky;
      top: 10px;
      z-index: 100;
      background: #1B3A2D;
      color: #FBFAF5;
      padding: 12px 20px;
      border-radius: 12px;
      margin-bottom: 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 4px 15px rgba(27, 58, 45, 0.25);
    }
    .btn-print {
      background: #C95928;
      color: white;
      border: none;
      padding: 9px 18px;
      border-radius: 8px;
      font-weight: 700;
      cursor: pointer;
      font-size: 13px;
    }
    .header {
      border-bottom: 2px solid #1B3A2D;
      padding-bottom: 16px;
      margin-bottom: 20px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }
    .brand-title {
      font-family: 'Cormorant Garamond', serif;
      font-size: 26px;
      font-weight: 700;
      color: #1B3A2D;
    }
    .brand-sub {
      font-size: 11px;
      color: #C95928;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .meta-box {
      text-align: right;
      font-size: 12px;
      color: #555555;
    }
    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
      margin-bottom: 24px;
    }
    .kpi-card {
      background: #FBFAF5;
      border: 1px solid #E5E0D3;
      border-radius: 10px;
      padding: 12px;
      text-align: center;
    }
    .kpi-label {
      font-size: 11px;
      text-transform: uppercase;
      font-weight: 700;
      color: #666;
      margin-bottom: 4px;
    }
    .kpi-value {
      font-family: 'Cormorant Garamond', serif;
      font-size: 24px;
      font-weight: 700;
      color: #1B3A2D;
    }
    .kpi-value.highlight { color: #C95928; }
    .section-title {
      font-family: 'Cormorant Garamond', serif;
      font-size: 17px;
      font-weight: 700;
      color: #1B3A2D;
      border-bottom: 1px solid #E5E0D3;
      padding-bottom: 6px;
      margin-bottom: 12px;
      margin-top: 20px;
      text-transform: uppercase;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 16px;
      font-size: 12px;
    }
    th {
      background: #1B3A2D;
      color: white;
      text-align: left;
      padding: 8px 10px;
      font-weight: 600;
    }
    td {
      padding: 8px 10px;
      border-bottom: 1px solid #E5E0D3;
    }
    tr:nth-child(even) { background: #FBFAF5; }
    .badge {
      display: inline-block;
      padding: 2px 7px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: bold;
    }
    .badge-vip { background: #FDE8E1; color: #C95928; }
    .badge-gold { background: #FEF3C7; color: #B45309; }
    .badge-silver { background: #E0F2FE; color: #0369A1; }
    .footer {
      border-top: 1px solid #E5E0D3;
      margin-top: 24px;
      padding-top: 12px;
      font-size: 11px;
      color: #888;
      display: flex;
      justify-content: space-between;
    }
  </style>
</head>
<body>
  <div class="print-bar no-print">
    <div><strong>Vũ Việt Home</strong> &bull; ${reportFullTitle}</div>
    <button class="btn-print" onclick="window.print()">In hoặc Lưu Thành PDF</button>
  </div>
  <div class="container">
    <div class="header">
      <div>
        <div class="brand-sub">Hệ Thống Workflow Đăng Tin BĐS Cao Cấp &bull; Vũ Việt Home</div>
        <div class="brand-title">${reportFullTitle}</div>
        <div style="font-size: 12px; color: #555; margin-top: 4px;">Nguồn dữ liệu: Batdongsan.com.vn &bull; ${currentStats.label}</div>
      </div>
      <div class="meta-box">
        <div><strong>Thời điểm quét:</strong> ${marketData.scannedAt}</div>
        <div><strong>Ngày lập báo cáo:</strong> ${reportDateStr}</div>
        <div><strong>Đơn vị thực hiện:</strong> Vũ Việt Home</div>
      </div>
    </div>

    <!-- KPIs -->
    <div class="kpi-grid">
      <div class="kpi-card">
        <div class="kpi-label">Tổng Tin Quét</div>
        <div class="kpi-value">${currentStats.totalListings}</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">Tỷ Lệ Tin VIP</div>
        <div class="kpi-value highlight">${currentStats.vipPercentage}%</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">VIP Kim Cương</div>
        <div class="kpi-value">${currentStats.vipDiamond} tin</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">Môi Giới Phủ Sóng</div>
        <div class="kpi-value">${marketData.agentsSummary.totalActiveBrokers}</div>
      </div>
    </div>

    <!-- 1. VIP Breakdown -->
    <div class="section-title">1. Phân Bổ Cấp Độ Tin Đăng (VIP vs Thường)</div>
    <table>
      <thead>
        <tr>
          <th>Cấp độ tin</th>
          <th>Số lượng tin</th>
          <th>Tỷ lệ %</th>
          <th>Ước tính chi phí / ngày</th>
          <th>Vị trí & Tính năng</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><span class="badge badge-vip">VIP Kim Cương</span></td>
          <td><strong>${currentStats.vipDiamond} tin</strong></td>
          <td>${((currentStats.vipDiamond / currentStats.totalListings) * 100).toFixed(1)}%</td>
          <td>~250.000đ - 350.000đ</td>
          <td>Vị trí top đầu trang 1, kích thước lớn nhất, huy hiệu đỏ nổi bật</td>
        </tr>
        <tr>
          <td><span class="badge badge-gold">VIP Vàng</span></td>
          <td><strong>${currentStats.vipGold} tin</strong></td>
          <td>${((currentStats.vipGold / currentStats.totalListings) * 100).toFixed(1)}%</td>
          <td>~150.000đ - 220.000đ</td>
          <td>Nằm ngay sau VIP Kim Cương, tỷ lệ xem & click cao</td>
        </tr>
        <tr>
          <td><span class="badge badge-silver">VIP Bạc</span></td>
          <td><strong>${currentStats.vipSilver} tin</strong></td>
          <td>${((currentStats.vipSilver / currentStats.totalListings) * 100).toFixed(1)}%</td>
          <td>~70.000đ - 110.000đ</td>
          <td>Phủ sóng tầng giữa, chi phí tối ưu</td>
        </tr>
        <tr>
          <td><span>Tin Thường</span></td>
          <td><strong>${currentStats.normal} tin</strong></td>
          <td>${((currentStats.normal / currentStats.totalListings) * 100).toFixed(1)}%</td>
          <td>~15.000đ - 25.000đ</td>
          <td>Xếp sau tin VIP, duy trì hiện diện</td>
        </tr>
      </tbody>
    </table>
    <div style="font-size: 12px; background: #FBFAF5; border-left: 3px solid #C95928; padding: 8px 12px; margin-bottom: 20px;">
      <strong>Đánh giá cạnh tranh:</strong> ${marketData.vipStats.competitionAnalysis}
    </div>

    <!-- 2. Top 5 Brokers -->
    <div class="section-title">2. Top 5 Môi Giới Chuyên Nghiệp Đăng Tin Nhiều Nhất</div>
    <table>
      <thead>
        <tr>
          <th style="width: 40px;">Hạng</th>
          <th>Tên Môi Giới</th>
          <th>Sàn / Đơn Vị</th>
          <th>Số Điện Thoại</th>
          <th>Số Tin Đăng</th>
          <th>Thị Phần</th>
          <th>Chiến Lược Chủ Đạo</th>
        </tr>
      </thead>
      <tbody>
        ${marketData.top5Brokers.map(b => `
          <tr>
            <td><strong>#${b.rank}</strong></td>
            <td><strong>${b.name}</strong></td>
            <td>${b.agency}</td>
            <td style="font-family: monospace; font-weight: bold; color: #C95928;">${b.phone}</td>
            <td><strong>${b.totalListings}</strong> tin</td>
            <td><strong>${b.marketSharePercent}%</strong></td>
            <td style="font-size: 11px;">${b.keyStrategy}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>

    <!-- 3. Products & Pricing -->
    <div class="section-title">3. Các Loại Sản Phẩm & Đánh Giá Mức Giá Hiện Giờ</div>
    <table>
      <thead>
        <tr>
          <th>Loại Sản Phẩm</th>
          <th>Số Lượng Tin</th>
          <th>Khoảng Giá Chào Bán</th>
          <th>Đơn Giá TB / m²</th>
          <th>Đánh Giá Mức Độ Thanh Khoản</th>
        </tr>
      </thead>
      <tbody>
        ${marketData.productsAndPricing.map(p => `
          <tr>
            <td><strong>${p.productType}</strong></td>
            <td>${p.count} tin</td>
            <td style="color: #C95928; font-weight: bold;">${p.priceRange}</td>
            <td style="font-family: monospace;">${p.avgPriceM2}</td>
            <td style="font-size: 11px;">${p.marketEvaluation}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>

    <!-- 4. Historical comparison -->
    <div class="section-title">4. So Sánh Với Dữ Liệu Lịch Sử & Chu Kỳ Thị Trường</div>
    <div style="font-size: 12px; background: #FBFAF5; border: 1px solid #E5E0D3; border-radius: 8px; padding: 12px; margin-bottom: 20px;">
      <div style="margin-bottom: 6px;"><strong>Mốc đối chiếu:</strong> ${marketData.historicalComparison.previousBenchmarkPeriod}</div>
      <div style="margin-bottom: 6px;"><strong>Biến động giá:</strong> <span style="color: #10B981; font-weight: bold;">${marketData.historicalComparison.priceTrend}</span></div>
      <div style="margin-bottom: 6px;"><strong>Cạnh tranh tin VIP:</strong> ${marketData.historicalComparison.vipCompetitionShift}</div>
      <div><strong>Nhận định chuyên sâu:</strong> ${marketData.historicalComparison.marketNotes}</div>
    </div>

    <!-- 5. Recommendations -->
    <div class="section-title">5. Đề Xuất 3 Sản Phẩm & Tiêu Đề Chuẩn SEO</div>
    ${marketData.recommendations.map((rec, idx) => `
      <div style="border: 1px solid #E5E0D3; border-radius: 8px; padding: 12px; margin-bottom: 10px; background: ${idx === 0 ? '#FBFAF5' : 'white'};">
        <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
          <strong style="color: #1B3A2D; font-size: 13px;">${idx + 1}. ${rec.productName} (${rec.productType})</strong>
          <span style="color: #C95928; font-weight: bold; font-size: 12px;">${rec.specs.price} &bull; ${rec.specs.area}</span>
        </div>
        <div style="font-size: 12px; color: #1B3A2D; font-weight: 600; margin-bottom: 4px;">Tiêu đề tối ưu: "${rec.sampleTitleBDS}"</div>
        <div style="font-size: 11px; color: #555;">Phân khu: ${rec.subdivision} &bull; Lý do đề xuất: ${rec.whyRecommended}</div>
      </div>
    `).join('')}

    <div class="footer">
      <div>Hệ thống Workflow Đăng Tin BĐS &bull; Bộ nhận diện thương hiệu Vũ Việt Home</div>
      <div>Báo cáo chuẩn A4 &bull; Tự động trích xuất lúc ${new Date().toLocaleTimeString('vi-VN')} - ${new Date().toLocaleDateString('vi-VN')}</div>
    </div>
  </div>
</body>
</html>`;
  };

  const handleDownloadReport = () => {
    try {
      const now = new Date();
      const day = String(now.getDate()).padStart(2, '0');
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const year = now.getFullYear();
      const dateStr = `${day}-${month}-${year}`;
      const projectNameSlug = (selectedProject?.name || marketData.projectName || 'Du-An').trim().replace(/\s+/g, '-');

      const htmlContent = generateReportHtml();
      const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Bao-Cao-Nghien-Cuu-Dang-Tin-${projectNameSlug}-${dateStr}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setReportNotice(`Đã tải xuống: Bao-Cao-Nghien-Cuu-Dang-Tin-${projectNameSlug}-${dateStr}.html`);
      setTimeout(() => setReportNotice(null), 4000);
    } catch (err: any) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Sub-navigation Tabs: 3 trang đầu, Phân Tích Đối Thủ, Đề Xuất Tin Đăng */}
      <div className="bg-white border border-[#E5E0D3] rounded-2xl p-2.5 flex flex-wrap gap-2.5 shadow-sm">
        <button
          type="button"
          onClick={() => setActiveSubTab('part1')}
          className={`flex-1 min-w-[180px] px-4 py-3 rounded-xl text-sm sm:text-base font-bold transition-all flex items-center justify-center gap-2.5 cursor-pointer ${
            activeSubTab === 'part1'
              ? 'bg-[#1B3A2D] text-white shadow-md'
              : 'text-[#333333]/70 hover:text-[#1B3A2D] hover:bg-[#F5F2E9]'
          }`}
        >
          <span className="w-6 h-6 rounded-full bg-[#C95928] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
            1
          </span>
          <span>3 trang đầu</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('part2')}
          className={`flex-1 min-w-[190px] px-4 py-3 rounded-xl text-sm sm:text-base font-bold transition-all flex items-center justify-center gap-2.5 cursor-pointer ${
            activeSubTab === 'part2'
              ? 'bg-[#1B3A2D] text-white shadow-md'
              : 'text-[#333333]/70 hover:text-[#1B3A2D] hover:bg-[#F5F2E9]'
          }`}
        >
          <span className="w-6 h-6 rounded-full bg-[#C95928] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
            2
          </span>
          <span>Phân Tích Đối Thủ</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('part3')}
          className={`flex-1 min-w-[180px] px-4 py-3 rounded-xl text-sm sm:text-base font-bold transition-all flex items-center justify-center gap-2.5 cursor-pointer ${
            activeSubTab === 'part3'
              ? 'bg-[#1B3A2D] text-white shadow-md'
              : 'text-[#333333]/70 hover:text-[#1B3A2D] hover:bg-[#F5F2E9]'
          }`}
        >
          <span className="w-6 h-6 rounded-full bg-[#C95928] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
            3
          </span>
          <span>Đề Xuất Tin Đăng</span>
        </button>
      </div>

      {/* ===================== PHẦN 1: 3 TRANG ĐẦU ===================== */}
      {activeSubTab === 'part1' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Link Input Bar with Project Selector */}
          <div className="bg-white border border-[#E5E0D3] rounded-2xl p-5 sm:p-6 shadow-sm space-y-3.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 flex-wrap">
                <Building2 className="w-4 h-4 text-[#C95928]" />
                <label htmlFor="project-select-link-bar" className="text-sm font-bold font-serif-brand text-[#1B3A2D] uppercase tracking-wider">
                  Chọn Dự Án:
                </label>
                <select
                  id="project-select-link-bar"
                  aria-label="Chọn Dự Án"
                  value={selectedProject.id}
                  onChange={(e) => {
                    const found = FOUR_VINHOMES_PROJECTS.find((p) => p.id === e.target.value);
                    if (found && onSelectProject) {
                      onSelectProject(found);
                    }
                  }}
                  className="bg-[#FBFAF5] text-[#1B3A2D] font-bold border-2 border-[#DCD5C5] rounded-xl px-3 py-1.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#C95928] cursor-pointer shadow-inner min-w-[200px]"
                >
                  {FOUR_VINHOMES_PROJECTS.map((proj) => (
                    <option key={proj.id} value={proj.id}>
                      {proj.name}
                    </option>
                  ))}
                </select>
              </div>

              <span className="text-xs text-slate-500 font-medium hidden sm:inline">
                Tự động liên kết link Batdongsan.com.vn theo dự án
              </span>
            </div>

            <div className="flex flex-col md:flex-row gap-3">
              <input
                type="text"
                value={batdongsanUrl}
                onChange={(e) => setBatdongsanUrl(e.target.value)}
                placeholder="https://batdongsan.com.vn/ban-nha-biet-thu-lien-ke-..."
                className="flex-1 bg-[#FBFAF5] border border-[#DCD5C5] rounded-xl px-4 py-3 text-sm sm:text-base text-[#1B3A2D] font-mono focus:outline-none focus:ring-2 focus:ring-[#1B3A2D]/30 focus:border-[#1B3A2D]"
              />
              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={batdongsanUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-3 bg-white hover:bg-[#F5F2E9] text-[#1B3A2D] font-bold text-sm sm:text-base rounded-xl border-2 border-[#1B3A2D] transition-all flex items-center gap-2 cursor-pointer"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Mở trang Batdongsan</span>
                </a>

                <button
                  type="button"
                  onClick={handleNarrative}
                  disabled={!hasData || narrating}
                  className="px-5 py-3 bg-[#C95928] hover:bg-[#A8471F] text-white font-bold text-sm sm:text-base rounded-xl transition-all shadow-md shadow-[#C95928]/25 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
                  title="AI chỉ viết nhận định bằng lời; mọi con số do máy tính thống kê từ dữ liệu thật"
                >
                  {narrating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>AI đang viết...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Viết nhận định AI</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleDownloadReport}
                  disabled={!hasData}
                  className="disabled:opacity-40 px-4 py-3 bg-[#1B3A2D] hover:bg-[#2C5E4A] text-white font-bold text-sm sm:text-base rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-sm"
                  title="Tải file báo cáo (.html) chuẩn A4 về máy tính"
                >
                  <Download className="w-4 h-4 text-[#FBFAF5]" />
                  <span>Tải Báo Cáo</span>
                </button>
              </div>
            </div>

            {reportNotice && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center justify-between gap-2 animate-in fade-in">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{reportNotice}</span>
                </div>
                <button 
                  type="button" 
                  onClick={() => setReportNotice(null)} 
                  className="text-sm font-bold text-emerald-700 underline cursor-pointer"
                >
                  Đóng
                </button>
              </div>
            )}

            {error && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>

          {/* ============ BƯỚC 1: LẤY DỮ LIỆU THẬT ============ */}
          <div className="bg-white border-2 border-[#C95928]/40 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex items-start gap-3">
              <Database className="w-5 h-5 text-[#C95928] mt-0.5 shrink-0" />
              <div>
                <h4 className="font-bold font-serif-brand text-[#1B3A2D] text-lg">Lấy dữ liệu thật từ Batdongsan.com.vn</h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Batdongsan chặn máy chủ tự đọc trang, và AI không thể tự vào link. Vì vậy bạn dùng chính trình duyệt của mình để lấy
                  tin đang hiển thị (thường 30 tin mỗi trang), app sẽ tự đếm VIP, giá, môi giới. Không có dữ liệu thì app để trống, không bịa.
                </p>
              </div>
            </div>

            <ol className="text-sm text-[#333333] space-y-2 list-decimal list-inside leading-relaxed">
              <li>
                Kéo nút này lên thanh dấu trang (một lần duy nhất):{' '}
                <a
                  ref={(el) => el?.setAttribute('href', bookmarkletHref())}
                  onClick={(e) => e.preventDefault()}
                  draggable
                  className="inline-block px-3 py-1 rounded-lg bg-[#1B3A2D] text-white font-bold cursor-grab"
                >
                  Lấy tin Batdongsan
                </a>{' '}
                <span className="text-slate-500">hoặc</span>{' '}
                <button
                  type="button"
                  onClick={() => handleCopy(EXTRACT_SCRIPT, 'extract-script')}
                  className="px-3 py-1 rounded-lg border border-[#DCD5C5] font-bold text-[#1B3A2D] cursor-pointer hover:bg-[#F5F2E9]"
                >
                  {copiedKey === 'extract-script' ? 'Đã copy script' : 'Copy script (dán vào Console F12)'}
                </button>
              </li>
              <li>Bấm "Mở trang Batdongsan" ở trên, đứng ở trang kết quả (trang 1).</li>
              <li>Bấm nút dấu trang "Lấy tin Batdongsan". Một hộp nhỏ hiện ra và dữ liệu đã được copy.</li>
              <li>Quay lại đây, dán vào ô bên dưới rồi bấm "Thêm vào dữ liệu".</li>
              <li>Lặp lại cho trang 2 và trang 3 (thêm /p2, /p3 vào cuối link). Mỗi trang bấm một lần, app tự gộp và loại tin trùng.</li>
            </ol>

            <textarea
              value={pasteText}
              onChange={(e) => setPasteText(e.target.value)}
              placeholder='Dán dữ liệu vừa copy vào đây (bắt đầu bằng {"source":"batdongsan.com.vn",...)'
              rows={3}
              className="w-full bg-[#FBFAF5] border border-[#DCD5C5] rounded-xl px-3 py-2 text-xs font-mono text-[#1B3A2D] focus:outline-none focus:ring-2 focus:ring-[#1B3A2D]/30"
            />

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleAddData}
                disabled={!pasteText.trim()}
                className="px-5 py-2.5 bg-[#1B3A2D] hover:bg-[#2C5E4A] text-white font-bold rounded-xl disabled:opacity-40 cursor-pointer"
              >
                Thêm vào dữ liệu
              </button>
              {hasData && (
                <>
                  <span className="text-sm font-bold text-[#1B3A2D] bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg">
                    Đang có {rows.length} tin thật • trang {marketData.dataSource?.pages.join(', ')} • quét lúc {scrapedAt}
                  </span>
                  <button
                    type="button"
                    onClick={handleClearData}
                    className="px-3 py-2 text-sm font-bold text-rose-700 border border-rose-200 rounded-xl hover:bg-rose-50 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                    Xóa dữ liệu
                  </button>
                </>
              )}
            </div>

            {intakeNotice && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm">{intakeNotice}</div>
            )}
            <p className="text-xs text-slate-500">
              Lưu ý: Batdongsan che số điện thoại trên trang danh sách nên app không hiển thị SĐT; tên môi giới chỉ có trên tin VIP Kim Cương/Vàng.
            </p>
          </div>

          {!hasData && (
            <div className="p-6 rounded-2xl bg-[#F5F2E9] border border-[#E5E0D3] text-[#1B3A2D] text-sm sm:text-base">
              Chưa có dữ liệu thật cho <strong>{selectedProject.name}</strong>. Báo cáo thị trường sẽ hiện ngay sau khi bạn thêm dữ liệu ở trên.
            </div>
          )}

          {/* ============ BÁO CÁO INFOGRAPHIC DASHBOARD TRONG 1 TRANG ============ */}
          {hasData && (
          <div className="bg-[#FBFAF5] border-2 border-[#1B3A2D]/20 rounded-3xl p-5 sm:p-8 shadow-md space-y-6 print:border-none print:p-0">
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-sm">
              <strong>Dữ liệu thật</strong> từ Batdongsan.com.vn, quét lúc {scrapedAt}: {marketData.totalListingsCount} tin, trang {marketData.dataSource?.pages.join(', ')}.
              Mọi con số do máy tính thống kê.{' '}
              {marketData.dataSource?.aiNarrative ? 'Phần nhận định bằng lời do AI viết (đã loại câu có số liệu lạ).' : 'Bấm "Viết nhận định AI" để có thêm phần nhận định bằng lời.'}
            </div>
            {/* Infographic Header */}
            <div className="border-b border-[#E5E0D3] pb-5">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                  <h3 className="text-2xl sm:text-3xl font-bold font-serif-brand text-[#1B3A2D] tracking-tight">
                    Báo Cáo Thị Trường
                  </h3>
                  <p className="text-sm sm:text-base text-slate-600 mt-1 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#1B3A2D]" />
                    <span>{marketData.scannedAt}</span>
                    <span>•</span>
                    <span className="font-bold text-[#1B3A2D]">{marketData.projectName}</span>
                  </p>
                </div>

                {/* Quick KPI stats in header */}
                <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                  <div className="bg-white border border-[#E5E0D3] rounded-2xl px-4 py-3 text-center shadow-sm">
                    <span className="block text-xs uppercase font-bold text-slate-500 mb-0.5">Tổng mẫu quét</span>
                    <span className="text-xl sm:text-2xl font-bold font-serif-brand text-[#1B3A2D]">
                      {currentStats.totalListings} Tin
                    </span>
                  </div>
                  <div className="bg-white border border-[#E5E0D3] rounded-2xl px-4 py-3 text-center shadow-sm">
                    <span className="block text-xs uppercase font-bold text-slate-500 mb-0.5">Tỷ lệ tin VIP</span>
                    <span className="text-xl sm:text-2xl font-bold font-serif-brand text-[#C95928]">
                      {currentStats.vipPercentage}%
                    </span>
                  </div>
                  <div className="bg-white border border-[#E5E0D3] rounded-2xl px-4 py-3 text-center shadow-sm">
                    <span className="block text-xs uppercase font-bold text-slate-500 mb-0.5">Môi giới phủ sóng</span>
                    <span className="text-xl sm:text-2xl font-bold font-serif-brand text-[#1B3A2D]">
                      {marketData.agentsSummary.totalActiveBrokers}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* PHÂN TÍCH TOP 3 TRANG (Bao gồm 3 trang & Gộp luôn Phân Bổ Loại Tin) */}
            <div className="bg-white border border-[#E5E0D3] rounded-2xl p-5 sm:p-6 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-[#E5E0D3] pb-3">
                <h4 className="text-base sm:text-lg font-bold font-serif-brand text-[#1B3A2D] uppercase tracking-wide flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-[#C95928]" />
                  Phân Tích Top 3 Trang
                </h4>
                <span className="text-sm sm:text-base text-[#C95928] font-bold">
                  Tổng {marketData.totalListingsCount} tin đã quét
                </span>
              </div>

              {marketData.pagesBreakdown && marketData.pagesBreakdown.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {marketData.pagesBreakdown.map((p) => {
                    return (
                      <div
                        key={p.pageNumber}
                        className="rounded-2xl p-4 sm:p-5 border bg-[#FBFAF5] border-[#1B3A2D] shadow-sm ring-1 ring-[#1B3A2D]/20 transition-all"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className="px-3 py-1 rounded-lg text-sm sm:text-base font-bold bg-[#1B3A2D] text-white">
                            {p.pageLabel}
                          </span>
                          <span className="text-sm sm:text-base font-bold text-[#C95928]">
                            {p.vipPercentage}% VIP
                          </span>
                        </div>

                        {/* Breakdown Pills */}
                        <div className="grid grid-cols-2 gap-2 my-3 text-sm">
                          <div className="bg-rose-50 text-rose-800 p-2.5 rounded-xl border border-rose-200">
                            <span className="block text-xs text-rose-700 font-bold uppercase">Kim Cương</span>
                            <span className="text-base sm:text-lg font-bold">{p.vipDiamond} tin</span>
                          </div>
                          <div className="bg-amber-50 text-amber-800 p-2.5 rounded-xl border border-amber-200">
                            <span className="block text-xs text-amber-700 font-bold uppercase">VIP Vàng</span>
                            <span className="text-base sm:text-lg font-bold">{p.vipGold} tin</span>
                          </div>
                          <div className="bg-sky-50 text-sky-800 p-2.5 rounded-xl border border-sky-200">
                            <span className="block text-xs text-sky-700 font-bold uppercase">VIP Bạc</span>
                            <span className="text-base sm:text-lg font-bold">{p.vipSilver} tin</span>
                          </div>
                          <div className="bg-slate-100 text-slate-800 p-2.5 rounded-xl border border-slate-200">
                            <span className="block text-xs text-slate-600 font-bold uppercase">Tin Thường</span>
                            <span className="text-base sm:text-lg font-bold">{p.normal} tin</span>
                          </div>
                        </div>

                        <p className="text-sm sm:text-base text-[#333333] leading-relaxed border-t border-[#E5E0D3] pt-2.5">
                          <strong className="text-[#1B3A2D]">Đặc tính:</strong> {p.keyCharacteristics}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Phân Bổ Loại Tin gộp luôn vào Phân Tích Top 3 Trang */}
              <div className="border-t border-[#E5E0D3] pt-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h5 className="text-base font-bold font-serif-brand text-[#1B3A2D] uppercase tracking-wide flex items-center gap-2">
                    <Crown className="w-5 h-5 text-[#C95928]" />
                    Phân Bổ Loại Tin:
                  </h5>
                  <span className="text-sm font-bold text-[#C95928]">
                    {currentStats.vipPercentage}% Tin VIP
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm sm:text-base">
                  {/* VIP Kim Cương */}
                  <div className="p-3 bg-[#FBFAF5] rounded-xl border border-[#E5E0D3]">
                    <div className="flex justify-between font-semibold mb-1.5">
                      <span className="flex items-center gap-1.5 text-rose-700">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-600 inline-block" />
                        VIP Kim Cương (Diamond)
                      </span>
                      <span className="font-bold text-[#1B3A2D]">
                        {currentStats.vipDiamond} tin ({((currentStats.vipDiamond / currentStats.totalListings) * 100).toFixed(1)}%)
                      </span>
                    </div>
                    <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-rose-600 rounded-full"
                        style={{ width: `${(currentStats.vipDiamond / currentStats.totalListings) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* VIP Vàng */}
                  <div className="p-3 bg-[#FBFAF5] rounded-xl border border-[#E5E0D3]">
                    <div className="flex justify-between font-semibold mb-1.5">
                      <span className="flex items-center gap-1.5 text-amber-700">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                        VIP Vàng (Gold)
                      </span>
                      <span className="font-bold text-[#1B3A2D]">
                        {currentStats.vipGold} tin ({((currentStats.vipGold / currentStats.totalListings) * 100).toFixed(1)}%)
                      </span>
                    </div>
                    <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-500 rounded-full"
                        style={{ width: `${(currentStats.vipGold / currentStats.totalListings) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* VIP Bạc */}
                  <div className="p-3 bg-[#FBFAF5] rounded-xl border border-[#E5E0D3]">
                    <div className="flex justify-between font-semibold mb-1.5">
                      <span className="flex items-center gap-1.5 text-sky-700">
                        <span className="w-2.5 h-2.5 rounded-full bg-sky-500 inline-block" />
                        VIP Bạc (Silver)
                      </span>
                      <span className="font-bold text-[#1B3A2D]">
                        {currentStats.vipSilver} tin ({((currentStats.vipSilver / currentStats.totalListings) * 100).toFixed(1)}%)
                      </span>
                    </div>
                    <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-sky-500 rounded-full"
                        style={{ width: `${(currentStats.vipSilver / currentStats.totalListings) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Tin Thường */}
                  <div className="p-3 bg-[#FBFAF5] rounded-xl border border-[#E5E0D3]">
                    <div className="flex justify-between font-semibold mb-1.5">
                      <span className="flex items-center gap-1.5 text-slate-600">
                        <span className="w-2.5 h-2.5 rounded-full bg-slate-400 inline-block" />
                        Tin Thường (Normal)
                      </span>
                      <span className="font-bold text-[#1B3A2D]">
                        {currentStats.normal} tin ({((currentStats.normal / currentStats.totalListings) * 100).toFixed(1)}%)
                      </span>
                    </div>
                    <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-slate-400 rounded-full"
                        style={{ width: `${(currentStats.normal / currentStats.totalListings) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-[#FBFAF5] p-3.5 rounded-xl border border-[#E5E0D3] text-sm sm:text-base text-[#333333] leading-relaxed">
                  <strong className="text-[#1B3A2D]">Đánh giá cạnh tranh:</strong> {marketData.vipStats.competitionAnalysis}
                </div>
              </div>
            </div>

            {/* Phân Loại Nội Dung Tin Đăng */}
            <div className="bg-white border border-[#E5E0D3] rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-[#E5E0D3] pb-3">
                <h4 className="text-base sm:text-lg font-bold font-serif-brand text-[#1B3A2D] uppercase tracking-wide flex items-center gap-2">
                  <Layers className="w-5 h-5 text-[#C95928]" />
                  Phân Loại Nội Dung Tin Đăng
                </h4>
                <span className="text-sm text-slate-500">
                  Phân loại {marketData.contentCategories.length} chủ đề chính
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                {marketData.contentCategories.map((cat, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-[#FBFAF5] border border-[#E5E0D3] flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1.5 mb-2">
                        <span className="font-bold text-sm sm:text-base text-[#1B3A2D] line-clamp-1">{cat.categoryName}</span>
                        <span className="text-xs font-bold bg-[#C95928]/15 text-[#C95928] px-2.5 py-0.5 rounded-full shrink-0">
                          {cat.count} tin ({cat.percentage}%)
                        </span>
                      </div>
                      <ul className="text-sm text-[#333333] space-y-1.5 mb-3 leading-relaxed">
                        {cat.angles.slice(0, 2).map((a, i) => (
                          <li key={i} className="line-clamp-1">• {a}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex flex-wrap gap-1.5 pt-2 border-t border-[#E5E0D3]">
                      {((cat.topKeywords || cat.keywords || []) as string[]).slice(0, 3).map((kw: string, i: number) => (
                        <span key={i} className="text-xs sm:text-sm font-medium bg-white text-slate-700 px-2 py-0.5 rounded border border-[#E5E0D3]">
                          #{kw}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Grid 2: Top 5 Môi Giới Của Dự Án */}
            <div className="bg-white border border-[#E5E0D3] rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
              <div className="border-b border-[#E5E0D3] pb-3">
                <h4 className="text-lg font-bold font-serif-brand text-[#1B3A2D] uppercase tracking-wide flex items-center gap-2">
                  <Award className="w-5 h-5 text-[#C95928]" />
                  Top 5 Môi Giới Đăng Tin Nhiều Nhất
                </h4>
                <p className="text-sm text-slate-600 mt-0.5">
                  Bảng xếp hạng 5 môi giới có thị phần tin đăng lớn nhất dự án.
                </p>
              </div>

              {/* Table / Cards of Top 5 Brokers */}
              <div className="space-y-3">
                {marketData.top5Brokers.map((broker) => {
                  return (
                    <div
                      key={broker.rank}
                      className="p-4 rounded-xl bg-[#FBFAF5] border border-[#E5E0D3] hover:border-[#1B3A2D]/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-start gap-3.5 flex-1">
                        <span
                          className={`w-9 h-9 rounded-xl font-bold text-sm sm:text-base flex items-center justify-center shrink-0 shadow-sm ${
                            broker.rank === 1
                              ? 'bg-[#C95928] text-white'
                              : broker.rank === 2
                              ? 'bg-[#1B3A2D] text-white'
                              : broker.rank === 3
                              ? 'bg-[#2C5E4A] text-white'
                              : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          #{broker.rank}
                        </span>
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h5 className="font-bold text-base sm:text-lg text-[#1B3A2D]">{broker.name}</h5>
                            {broker.profileUrl ? (
                              <a
                                href={broker.profileUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-sm font-bold text-[#C95928] flex items-center gap-1 underline"
                              >
                                <ExternalLink className="w-4 h-4" />
                                Hồ sơ môi giới
                              </a>
                            ) : (
                              <span className="text-xs text-slate-500">SĐT bị Batdongsan che</span>
                            )}
                          </div>
                          <p className="text-sm sm:text-base text-[#333333] leading-relaxed">
                            <strong className="text-[#1B3A2D]">Chiến lược:</strong> {broker.keyStrategy}
                          </p>
                          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                            <strong className="text-slate-700">Thế mạnh:</strong> {broker.strengths}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-3.5 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#E5E0D3]">
                        <div className="text-left sm:text-right">
                          <span className="block text-base sm:text-lg font-bold font-serif-brand text-[#1B3A2D]">
                            {broker.totalListings} Tin đăng
                          </span>
                          <span className="text-sm sm:text-base text-[#C95928] font-bold">
                            {broker.marketSharePercent}% thị phần
                          </span>
                        </div>

                        {broker.profileUrl && (
                          <button
                            type="button"
                            onClick={() => handleCopy(broker.profileUrl, `phone-${broker.rank}`)}
                            className="px-4 py-2.5 bg-white hover:bg-[#1B3A2D] hover:text-white text-[#1B3A2D] border border-[#DCD5C5] rounded-xl text-sm font-bold transition-all flex items-center gap-2 shadow-sm cursor-pointer"
                            title="Sao chép link hồ sơ môi giới"
                          >
                            {copiedKey === `phone-${broker.rank}` ? (
                              <>
                                <Check className="w-4 h-4 text-emerald-600" />
                                <span className="text-emerald-700">Đã copy link</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-4 h-4 text-[#C95928]" />
                                <span>Copy link hồ sơ</span>
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Grid 3: Sản phẩm BĐS & Đánh giá mức giá + So sánh dữ liệu cũ */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Box 3: Các loại sản phẩm & Mức giá (7 cols) */}
              <div className="lg:col-span-7 bg-white border border-[#E5E0D3] rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
                <h4 className="text-base sm:text-lg font-bold font-serif-brand text-[#1B3A2D] uppercase tracking-wide flex items-center gap-2 border-b border-[#E5E0D3] pb-3">
                  <TrendingUp className="w-5 h-5 text-[#C95928]" />
                  Các Loại Sản Phẩm BĐS & Mức Giá Hiện Tại
                </h4>

                <div className="space-y-3.5">
                  {marketData.productsAndPricing.map((prod, idx) => {
                    const totalCount = marketData.totalListingsCount || 1;
                    const percent = ((prod.count / totalCount) * 100).toFixed(1);
                    return (
                      <div
                        key={idx}
                        className="p-4 rounded-xl bg-[#FBFAF5] border border-[#E5E0D3] space-y-2"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-base sm:text-lg text-[#1B3A2D]">
                              {prod.productType}
                            </span>
                            <span className="text-xs sm:text-sm font-bold bg-[#C95928]/15 text-[#C95928] px-2.5 py-0.5 rounded-full">
                              {prod.count} tin ({percent}%)
                            </span>
                          </div>
                          <div className="flex items-center gap-2.5">
                            <span className="text-base sm:text-lg font-bold text-[#C95928]">{prod.priceRange}</span>
                            <span className="text-sm sm:text-base text-slate-600 font-mono font-medium">({prod.avgPriceM2})</span>
                          </div>
                        </div>
                        <p className="text-sm sm:text-base text-[#333333] leading-relaxed">
                          {prod.marketEvaluation}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Box 4: So sánh với dữ liệu cũ đã tổng hợp (5 cols) */}
              <div className="lg:col-span-5 bg-white border border-[#E5E0D3] rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E5E0D3] pb-3">
                  <h4 className="text-base sm:text-lg font-bold font-serif-brand text-[#1B3A2D] uppercase tracking-wide flex items-center gap-2">
                    <History className="w-5 h-5 text-[#C95928]" />
                    <span>So Sánh Dữ Liệu Cũ</span>
                  </h4>

                  {/* Nút lưu Snapshot mốc lịch sử */}
                  <button
                    type="button"
                    onClick={handleSaveSnapshot}
                    className="px-3.5 py-2 bg-[#C95928] hover:bg-[#A8471F] text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
                    title="Lưu kết quả quét hiện tại thành một mốc lịch sử để so sánh cho các lần sau"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Lưu Mốc Này</span>
                  </button>
                </div>

                {snapshotSavedNotice && (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-2 animate-in fade-in">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-semibold">{snapshotSavedNotice}</span>
                  </div>
                )}

                {/* Dropdown chọn mốc so sánh */}
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-[#1B3A2D] flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-[#C95928]" />
                    <span>Chọn mốc dữ liệu cũ đối chiếu:</span>
                  </label>
                  <select
                    value={selectedSnapshotId}
                    onChange={(e) => setSelectedSnapshotId(e.target.value)}
                    className="w-full bg-[#FBFAF5] border border-[#DCD5C5] rounded-xl px-3.5 py-2.5 text-sm sm:text-base font-semibold text-[#1B3A2D] focus:outline-none focus:ring-2 focus:ring-[#1B3A2D]/30 cursor-pointer"
                  >
                    <option value="baseline">
                      Mốc đối chiếu ban đầu (30 ngày trước - Baseline)
                    </option>
                    {snapshots.map((snap) => (
                      <option key={snap.id} value={snap.id}>
                        Snapshot đã lưu lúc: {snap.savedAt} ({snap.totalListings} tin, VIP {snap.vipPercentage}%)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Nội dung đối chiếu tùy theo mốc được chọn */}
                <div className="space-y-3.5 text-sm sm:text-base">
                  {selectedSnapshotId === 'baseline' ? (
                    <>
                      <div className="p-3.5 rounded-xl bg-[#FBFAF5] border border-[#E5E0D3] space-y-1">
                        <span className="text-slate-500 block text-xs uppercase font-bold">Biến động giá bán</span>
                        <strong className="text-emerald-700 text-sm sm:text-base font-bold flex items-center gap-1.5">
                          <TrendingUp className="w-4 h-4" />
                          {marketData.historicalComparison.priceTrend}
                        </strong>
                      </div>

                      <div className="p-3.5 rounded-xl bg-[#FBFAF5] border border-[#E5E0D3] space-y-1">
                        <span className="text-slate-500 block text-xs uppercase font-bold">Cạnh tranh tin VIP</span>
                        <p className="text-[#333333] font-medium leading-relaxed">
                          {marketData.historicalComparison.vipCompetitionShift}
                        </p>
                      </div>
                    </>
                  ) : (
                    (() => {
                      const activeSnap = snapshots.find((s) => s.id === selectedSnapshotId);
                      if (!activeSnap) return null;
                      const vipDiff = Number((currentStats.vipPercentage - activeSnap.vipPercentage).toFixed(1));
                      const listingsDiff = currentStats.totalListings - activeSnap.totalListings;

                      return (
                        <div className="space-y-3.5">
                          <div className="grid grid-cols-2 gap-3">
                            <div className="p-3 rounded-xl bg-white border border-[#E5E0D3] text-center">
                              <span className="text-xs text-slate-500 font-bold block uppercase">Chênh lệch tin VIP</span>
                              <span className={`text-lg font-bold font-serif-brand ${vipDiff >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                                {vipDiff >= 0 ? `+${vipDiff}%` : `${vipDiff}%`}
                              </span>
                              <span className="text-xs text-slate-400 block">Hiện tại: {currentStats.vipPercentage}%</span>
                            </div>
                            <div className="p-3 rounded-xl bg-white border border-[#E5E0D3] text-center">
                              <span className="text-xs text-slate-500 font-bold block uppercase">Tổng tin quét</span>
                              <span className="text-lg font-bold font-serif-brand text-[#1B3A2D]">
                                {listingsDiff >= 0 ? `+${listingsDiff}` : listingsDiff} tin
                              </span>
                              <span className="text-xs text-slate-400 block">Hiện tại: {currentStats.totalListings} tin</span>
                            </div>
                          </div>

                          <div className="p-3.5 rounded-xl bg-[#FBFAF5] border border-[#E5E0D3] space-y-1">
                            <span className="text-slate-500 block text-xs uppercase font-bold">Môi giới số 1 thời điểm đó</span>
                            <p className="text-[#1B3A2D] font-bold text-sm sm:text-base">
                              {activeSnap.topBrokerName}
                            </p>
                          </div>
                        </div>
                      );
                    })()
                  )}
                </div>
              </div>
            </div>

            {/* Direct jump to Part 3 recommendations */}
            <div className="border-t border-[#E5E0D3] pt-4 flex flex-col sm:flex-row items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setActiveSubTab('part3')}
                className="px-5 py-3 bg-[#C95928] hover:bg-[#A8471F] text-white font-bold text-sm sm:text-base rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Xem Phần 3: Đề Xuất 3 Sản Phẩm & Tiêu Đề</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
          )}
        </div>
      )}

      {/* ===================== PHẦN 2: BÓC TÁCH PLAYBOOK ĐỐI THỦ ===================== */}
      {activeSubTab === 'part2' && (
        <CompetitorPlaybookAnalyzer
          selectedProject={selectedProject}
          marketData={hasData ? marketData : null}
          rows={rows}
          onApplyCounterTemplateToEditor={({ title, highlights, counterAngle }) => {
            // Empty strings keep whatever the sale already typed; nothing about the unit is invented here.
            onApplyProductToEditor({
              projectName: selectedProject.data?.projectName || selectedProject.name,
              area: '',
              price: '',
              pricePerM2: '',
              subdivision: '',
              propertyType: '',
              highlights: highlights || '',
              legal: '',
              amenities: '',
              appliedTitle: title,
              counterAngle: counterAngle || highlights,
              sourceStrategy: 'counter_playbook',
            });
          }}
          onNextStep={onNextStep}
          onNavigateToPart3={() => setActiveSubTab('part3')}
        />
      )}

      {/* ===================== PHẦN 3: ĐỀ XUẤT 3 SẢN PHẨM & TIÊU ĐỀ ===================== */}
      {activeSubTab === 'part3' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-[#F5F2E9] border border-[#E5E0D3] rounded-2xl p-5 shadow-sm">
            <h3 className="text-xl sm:text-2xl font-bold font-serif-brand text-[#1B3A2D]">
              Đề Xuất 3 Sản Phẩm Chiến Lược Cho: {marketData.projectName}
            </h3>
          </div>

          {!hasData && (
            <div className="p-6 rounded-2xl bg-[#F5F2E9] border border-[#E5E0D3] text-[#1B3A2D]">
              Chưa có dữ liệu thật để đề xuất. Quay lại Phần 1, thêm dữ liệu quét từ Batdongsan.
            </div>
          )}
          {/* 3 Recommended Products Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {(hasData ? marketData.recommendations : []).map((rec) => (
              <div
                key={rec.id}
                className="bg-white border-2 border-[#E5E0D3] hover:border-[#1B3A2D] rounded-2xl p-5 sm:p-6 flex flex-col justify-between shadow-sm transition-all group"
              >
                <div className="space-y-4">
                  {/* Badge & Title */}
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-3.5 py-1 rounded-full text-xs sm:text-sm font-bold bg-[#1B3A2D] text-white">
                        Sản phẩm #{rec.id}
                      </span>
                      <span className="text-sm sm:text-base font-bold text-[#C95928]">
                        {rec.priceEstimate}
                      </span>
                    </div>

                    <h4 className="text-lg sm:text-xl font-bold font-serif-brand text-[#1B3A2D] group-hover:text-[#C95928] transition-colors leading-snug">
                      {rec.productName}
                    </h4>

                    <p className="text-sm sm:text-base text-[#333333] leading-relaxed bg-[#FBFAF5] p-3.5 rounded-xl border border-[#E5E0D3]">
                      <strong className="text-[#1B3A2D]">Lý do đề xuất:</strong> {rec.whyRecommended}
                    </p>
                  </div>

                  {/* Sample Title for Batdongsan.com.vn (Under 99 chars) */}
                  <div className="bg-[#F5F2E9] p-4 rounded-xl border border-[#DCD5C5] space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs uppercase font-bold text-[#1B3A2D] flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-[#C95928]" />
                        Tiêu đề chuẩn Batdongsan.com.vn:
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(rec.sampleTitleBDS, `title-${rec.id}`)}
                        className="text-xs sm:text-sm text-[#C95928] hover:text-[#A8471F] font-bold flex items-center gap-1 cursor-pointer"
                      >
                        {copiedKey === `title-${rec.id}` ? (
                          <>
                            <Check className="w-4 h-4 text-emerald-600" /> Đã copy
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" /> Copy
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-base sm:text-lg font-bold text-[#1B3A2D] leading-snug">
                      &quot;{rec.sampleTitleBDS}&quot;
                    </p>
                    <span className="text-xs sm:text-sm text-slate-600 block font-medium">
                      Độ dài: {rec.sampleTitleBDS.length}/99 ký tự. Số trong tiêu đề là trung vị thị trường để tham khảo; khi soạn tin hãy dùng số liệu căn thật.
                    </span>
                  </div>

                  {/* Outline Bullets */}
                  <div className="space-y-2 text-sm sm:text-base text-[#333333]">
                    <span className="font-bold text-[#1B3A2D] text-xs sm:text-sm uppercase tracking-wide block">
                      Dàn ý bài viết gợi ý:
                    </span>
                    <ul className="space-y-1.5 list-disc list-inside text-slate-800 leading-relaxed">
                      {rec.outlineBullets.map((b, i) => (
                        <li key={i}>{b}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Action button: Apply to Step 2 */}
                <div className="pt-5 border-t border-[#E5E0D3] mt-5">
                  <button
                    type="button"
                    onClick={() => {
                      onApplyProductToEditor(rec.specs);
                      onNextStep();
                    }}
                    className="w-full py-3.5 px-4 bg-[#1B3A2D] hover:bg-[#C95928] text-white font-bold text-sm sm:text-base rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Chọn & Soạn tin với sản phẩm này</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
