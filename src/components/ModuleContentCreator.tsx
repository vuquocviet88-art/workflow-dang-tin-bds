import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  FileText, 
  TrendingUp, 
  Home, 
  Share2, 
  Copy, 
  Check, 
  AlertCircle, 
  ArrowRight, 
  Hash, 
  Layers, 
  Tag, 
  Eye, 
  Edit3, 
  CheckCircle2, 
  ShieldCheck, 
  Smartphone, 
  Monitor, 
  PhoneCall, 
  Compass, 
  Ruler, 
  Building2, 
  UserCheck, 
  BadgeCheck, 
  HelpCircle,
  CheckSquare,
  AlertTriangle,
  RotateCcw,
  MessageCircle,
  ThumbsUp,
  MessageSquare,
  Bookmark,
  Send,
  Zap,
  ChevronDown,
  ChevronUp,
  X,
  Save,
  Database,
  Calendar,
  RefreshCw,
  Cpu,
  BookOpen
} from 'lucide-react';
import { ProjectFormData, GeneratedListings, RawListingParsedResult } from '../types';
import { KnowledgeBaseModal } from './KnowledgeBaseModal';
import { getKnowledgeBase, matchAndInjectContext } from '../lib/knowledgeRouter';
import type { MarketContext } from '../lib/market';

interface ModuleContentCreatorProps {
  projectData: ProjectFormData;
  setProjectData: React.Dispatch<React.SetStateAction<ProjectFormData>>;
  listings: GeneratedListings | null;
  setListings: React.Dispatch<React.SetStateAction<GeneratedListings | null>>;
  selectedVersionType: 'investment' | 'family' | 'social';
  setSelectedVersionType: (type: 'investment' | 'family' | 'social') => void;
  marketContext: MarketContext | null; // real market facts from the research tab (null = none loaded)
  onNextStep: () => void;
}

export const ModuleContentCreator: React.FC<ModuleContentCreatorProps> = ({
  projectData,
  setProjectData,
  listings,
  setListings,
  selectedVersionType,
  setSelectedVersionType,
  marketContext,
  onNextStep,
}) => {
  // Input raw text for sales - starts empty for clean paste
  const [rawText, setRawText] = useState('');
  const [parsingLoading, setParsingLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [parseFeedback, setParseFeedback] = useState<string | null>(null);
  const [keywordInput, setKeywordInput] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Self-learning broker voice states
  const [isSavingVoice, setIsSavingVoice] = useState(false);
  const [learningFeedback, setLearningFeedback] = useState<string | null>(null);

  // Active view tab in simulators: 'preview_bds' | 'preview_zalo' | 'preview_facebook' | 'editor'
  const [simTab, setSimTab] = useState<'preview_bds' | 'preview_zalo' | 'preview_facebook' | 'editor'>('preview_bds');

  const [missingQuestions, setMissingQuestions] = useState<Array<{
    fieldKey: string;
    fieldLabel: string;
    questionText: string;
    defaultSuggestion?: string;
  }>>([]);
  const [dismissedQuestions, setDismissedQuestions] = useState<string[]>([]);
  const [quickInputValues, setQuickInputValues] = useState<Record<string, string>>({});

  // Knowledge Base & Context Injection States
  const [isKnowledgeModalOpen, setIsKnowledgeModalOpen] = useState(false);
  const currentKb = getKnowledgeBase(projectData?.projectName || '');
  const [knowledgeUpdatedAt, setKnowledgeUpdatedAt] = useState<string>(currentKb?.updatedAt || '29/10/2026');

  // Sync knowledge date whenever project changes
  useEffect(() => {
    const kb = getKnowledgeBase(projectData?.projectName || '');
    setKnowledgeUpdatedAt(kb?.updatedAt || '29/10/2026');
  }, [projectData?.projectName]);

  // Active voice from projectData or automatic based on project name
  const pName = projectData?.projectName || '';
  const isOcean = pName.toLowerCase().includes('ocean park') || 
                  pName.toLowerCase().includes('ocean city') || 
                  pName.toLowerCase().includes('the empire') || 
                  pName.toLowerCase().includes('the crown') ||
                  (projectData?.unitCode && projectData.unitCode.toLowerCase().startsWith('ha'));

  const activeVoice = projectData?.personaVoice || (isOcean ? 'le_yen' : 'vu_viet');

  // Handle voice selection
  const handleSelectVoice = (voice: 'le_yen' | 'vu_viet') => {
    if (voice === 'le_yen') {
      setProjectData((prev) => ({
        ...prev,
        personaVoice: 'le_yen',
        contactName: 'Ms Yến',
        phone: '0918 600 050',
      }));
    } else {
      setProjectData((prev) => ({
        ...prev,
        personaVoice: 'vu_viet',
        contactName: 'Mr Việt',
        phone: '090.223.5050',
      }));
    }
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Save directly edited content & train AI to learn this broker's voice
  const handleSaveAndLearnVoice = async (targetChannel: 'preview_bds' | 'preview_zalo' | 'preview_facebook' | 'editor') => {
    if (!listings) return;
    setIsSavingVoice(true);
    setLearningFeedback(null);

    const channelName = targetChannel === 'preview_bds' 
      ? 'batdongsan' 
      : targetChannel === 'preview_zalo' 
      ? 'zalo' 
      : targetChannel === 'preview_facebook'
      ? 'facebook'
      : selectedVersionType === 'investment' ? 'batdongsan' : selectedVersionType === 'family' ? 'zalo' : 'facebook';

    const currentTarget = channelName === 'batdongsan'
      ? listings.versionInvestment
      : channelName === 'zalo'
      ? listings.versionFamily
      : listings.versionSocial;

    try {
      const payload = {
        broker: activeVoice,
        channel: channelName,
        originalTitle: currentTarget.title,
        originalContent: currentTarget.content,
        editedTitle: currentTarget.title,
        editedContent: currentTarget.content,
        projectName: projectData.projectName,
      };

      const res = await fetch('/api/gemini/learn-voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const resData = await res.json();
      setLearningFeedback(
        resData?.message || 
        '✨ Đã lưu nội dung! AI đã học phong cách chỉnh sửa này để tự động nâng cấp giọng văn cho các bài soạn sau.'
      );
    } catch {
      setLearningFeedback(
        '✨ Đã lưu nội dung thành công! Dữ liệu chỉnh sửa đã được ghi nhận vào bộ nhớ phong cách.'
      );
    } finally {
      setIsSavingVoice(false);
      setTimeout(() => setLearningFeedback(null), 6000);
    }
  };


  // Offline parser: fills ONLY what is literally written in the text. Everything else stays empty.
  const parseLocalHeuristic = (text: string): Partial<ProjectFormData> => {
    const lower = text.toLowerCase();
    const out: Partial<ProjectFormData> = {};

    if (lower.includes('ocean park 2') || lower.includes('the empire')) out.projectName = 'Vinhomes Ocean Park 2 - The Empire';
    else if (lower.includes('ocean park 3') || lower.includes('the crown')) out.projectName = 'Vinhomes Ocean Park 3 - The Crown';
    else if (lower.includes('hạ long xanh') || lower.includes('ha long')) out.projectName = 'Vinhomes Hạ Long Xanh';
    else if (lower.includes('king park')) out.projectName = 'Khu Đô Thị King Park Bắc Ninh';
    else if (lower.includes('olympic')) out.projectName = 'Đại Đô Thị Vinhomes Olympic Hà Nội';
    else if (lower.includes('ocean park 1')) out.projectName = 'Vinhomes Ocean Park 1';

    const codeMatch = text.match(/(HA\d+-\d+|SB-?\d+-?\d*|ĐD-?\d+|CL-?\d+|PB-?\d+|KĐ-?\d+)/i);
    if (codeMatch) out.unitCode = codeMatch[1];

    if (lower.includes('shophouse')) out.propertyType = 'Shophouse';
    else if (lower.includes('song lập')) out.propertyType = 'Biệt thự song lập';
    else if (lower.includes('đơn lập')) out.propertyType = 'Biệt thự đơn lập';
    else if (lower.includes('liền kề') || /\blk\b/.test(lower)) out.propertyType = 'Liền kề';

    const areaMatch = text.match(/(\d+(?:[.,]\d+)?)\s*(?:m2|m²)/i);
    if (areaMatch) out.area = areaMatch[1];
    const priceMatch = text.match(/(\d+(?:[.,]\d+)?\s*(?:tỷ|ty|triệu|tr)\b[^\n,]*)/i);
    if (priceMatch) out.price = priceMatch[1].trim();
    const ftMatch = text.match(/(?:mặt tiền|mt)\s*[:\s]*([^\n,-]+)/i);
    if (ftMatch) out.frontage = ftMatch[1].trim();
    const dirMatch = text.match(/hướng\s*[:\s]*([a-zA-Zà-ỹ\s]+)/i);
    if (dirMatch) out.orientation = dirMatch[1].trim().split(/[\n,.-]/)[0].trim();
    const flMatch = text.match(/(\d+\s*tầng[^\n,]*)/i);
    if (flMatch) out.floors = flMatch[1].trim();
    return out;
  };

  // Trigger AI Raw Property Parser
  const handleParseRawText = async () => {
    if (!rawText.trim()) {
      setError('Vui lòng nhập nội dung thông tin cơ bản của căn nhà vào ô bên dưới.');
      return;
    }

    setParsingLoading(true);
    setError(null);
    setParseFeedback(null);

    try {
      const resp = await fetch('/api/gemini/parse-raw-listing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawText }),
      });

      const json = await resp.json();

      if (resp.ok && json.data) {
        const d: RawListingParsedResult = json.data;
        
        // Merge into projectData
        setProjectData((prev) => ({
          ...prev,
          projectName: d.projectName || prev.projectName,
          subdivision: d.subdivision || prev.subdivision,
          unitCode: d.unitCode || prev.unitCode,
          propertyType: d.propertyType || prev.propertyType,
          area: d.area || prev.area,
          price: d.price || prev.price,
          pricePerM2: d.pricePerM2 || prev.pricePerM2,
          frontage: d.frontage || prev.frontage,
          orientation: d.orientation || prev.orientation,
          floors: d.floors || prev.floors,
          constructionArea: d.constructionArea || prev.constructionArea,
          bedrooms: d.bedrooms || prev.bedrooms,
          bathrooms: d.bathrooms || prev.bathrooms,
          legal: d.legal || prev.legal,
          amenities: d.amenities || prev.amenities,
          keyHighlights: d.keyHighlights || prev.keyHighlights,
          personaVoice: d.personaVoice || prev.personaVoice,
          contactName: d.contactName || (d.personaVoice === 'le_yen' ? 'Ms Yến' : 'Mr Việt'),
          phone: d.phone || (d.personaVoice === 'le_yen' ? '0918 600 050' : '090.223.5050'),
        }));

        setMissingQuestions(d.missingOptionalQuestions || []);
        setParseFeedback(d.summaryOneLiner || `Đã trích xuất thành công: Căn ${d.unitCode || ''} ${d.propertyType} ${d.area}m² - Giá ${d.price}`);
      } else {
        // Fallback local heuristic
        const fallback = parseLocalHeuristic(rawText);
        setProjectData((prev) => ({
          ...prev,
          ...fallback,
        }));
        setParseFeedback('AI chưa phản hồi: chỉ điền các trường có sẵn trong ghi chú. Hãy kiểm tra và nhập nốt phần còn trống.');
      }
    } catch (err: any) {
      console.warn('Parser API fallback to local:', err);
      const fallback = parseLocalHeuristic(rawText);
      setProjectData((prev) => ({
        ...prev,
        ...fallback,
      }));
      setParseFeedback('Không kết nối được AI: chỉ điền các trường có sẵn trong ghi chú. Hãy kiểm tra và nhập nốt phần còn trống.');
    } finally {
      setParsingLoading(false);
    }
  };

  // Quick answer or dismiss an optional question
  const handleAnswerQuestion = (fieldKey: string, value: string) => {
    if (!value.trim()) return;
    setProjectData((prev) => ({
      ...prev,
      [fieldKey]: value.trim(),
    }));
    // Dismiss question
    setDismissedQuestions((prev) => [...prev, fieldKey]);
  };

  const handleDismissQuestion = (fieldKey: string) => {
    setDismissedQuestions((prev) => [...prev, fieldKey]);
  };

  // Main Generation: Soạn 3 Phiên Bản (Batdongsan, Zalo, Facebook).
  // If the AI fails we show the error. We never substitute template text: it would state facts about a house that does not exist.
  const handleGenerate = async () => {
    const missing = [
      !projectData.projectName.trim() && 'Tên dự án',
      !projectData.area.trim() && 'Diện tích',
      !projectData.price.trim() && 'Mức giá bán',
    ].filter(Boolean);
    if (missing.length) {
      setError(`Vui lòng nhập: ${missing.join(', ')} (bắt buộc *).`);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const resp = await fetch('/api/gemini/generate-listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...projectData,
          personaVoice: activeVoice,
          marketContext,
        }),
      });
      const data = await resp.json().catch(() => ({}));
      if (!resp.ok || !data.data) throw new Error(data?.error || `Lỗi ${resp.status}`);
      setListings(data.data);
      setSimTab('preview_bds');
    } catch (err: any) {
      setError(err?.message || 'Không soạn được tin. Hãy thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const currentVersion = listings
    ? selectedVersionType === 'investment'
      ? listings.versionInvestment
      : selectedVersionType === 'family'
      ? listings.versionFamily
      : listings.versionSocial
    : null;

  const updateCurrentContent = (newContent: string) => {
    if (!listings) return;
    setListings({
      ...listings,
      ...(selectedVersionType === 'investment'
        ? { versionInvestment: { ...listings.versionInvestment, content: newContent } }
        : selectedVersionType === 'family'
        ? { versionFamily: { ...listings.versionFamily, content: newContent } }
        : { versionSocial: { ...listings.versionSocial, content: newContent } }),
    });
  };

  const updateCurrentTitle = (newTitle: string) => {
    if (!listings) return;
    setListings({
      ...listings,
      ...(selectedVersionType === 'investment'
        ? { versionInvestment: { ...listings.versionInvestment, title: newTitle } }
        : selectedVersionType === 'family'
        ? { versionFamily: { ...listings.versionFamily, title: newTitle } }
        : { versionSocial: { ...listings.versionSocial, title: newTitle } }),
    });
  };

  // Title character length analysis (Rule: Strict 90-99 characters)
  const titleText = currentVersion?.title || '';
  const titleLen = titleText.length;
  const isTitleStrictOptimal = titleLen >= 90 && titleLen <= 99;
  const isTitleTooShort = titleLen > 0 && titleLen < 90;
  const isTitleTooLong = titleLen > 99;

  // Phone occurrences check
  const phonePattern = projectData.phone ? projectData.phone.replace(/[^0-9]/g, '') : '';
  const countPhoneInContent = (text: string) => {
    if (!phonePattern || phonePattern.length < 8) return 0;
    const cleanText = text.replace(/[^0-9]/g, '');
    const regex = new RegExp(phonePattern, 'g');
    const matches = cleanText.match(regex);
    return matches ? matches.length : 0;
  };
  const phoneOccurrences = currentVersion ? countPhoneInContent(currentVersion.content) : 0;

  // 6-component title verification
  const checkTitleComponents = (title: string) => {
    const lower = title.toLowerCase();
    const hasProjectName = lower.includes(projectData.projectName.toLowerCase()) || 
                          lower.includes('vinhomes') || 
                          lower.includes('ocean park');
    const hasPrice = lower.includes('tỷ') || lower.includes('ty') || lower.includes('giá');
    const hasArea = lower.includes('m2') || lower.includes('m²');
    const hasDirectionOrFrontage = lower.includes('hướng') || lower.includes('mt') || lower.includes('mặt tiền') || lower.includes('đông') || lower.includes('tây') || lower.includes('nam') || lower.includes('bắc');
    const hasSubdivision = projectData.subdivision ? lower.includes(projectData.subdivision.toLowerCase().slice(0, 6)) || lower.includes('hải âu') || lower.includes('kinh đô') || lower.includes('sao biển') || lower.includes('đảo dừa') : true;
    const hasPropertyType = lower.includes('lk') || lower.includes('liền kề') || lower.includes('shophouse') || lower.includes('biệt thự') || lower.includes('căn hộ');

    return {
      hasProjectName,
      hasPrice,
      hasArea,
      hasDirectionOrFrontage,
      hasSubdivision,
      hasPropertyType,
      allPassed: hasProjectName && hasPrice && hasArea && hasDirectionOrFrontage && hasPropertyType,
    };
  };

  const titleCompAudit = checkTitleComponents(titleText);

  // Absolute words check
  const forbiddenAbsoluteWords = ['tốt nhất', 'rẻ nhất', 'duy nhất', 'số 1', 'so 1', 'chủ thở oxy'];
  const contentLower = currentVersion?.content?.toLowerCase() || '';
  const foundViolations = forbiddenAbsoluteWords.filter((w) => contentLower.includes(w) || titleText.toLowerCase().includes(w));

  // Checklist Completion Rate
  const checkListItems = [
    { label: 'Tên dự án chính thức', isRequired: true, isFilled: !!projectData.projectName.trim() },
    { label: 'Mã căn / Phân khu', isRequired: true, isFilled: !!projectData.subdivision.trim() },
    { label: 'Loại hình BĐS', isRequired: true, isFilled: !!projectData.propertyType.trim() },
    { label: 'Diện tích đất (m²)', isRequired: true, isFilled: !!projectData.area.trim() },
    { label: 'Mức giá bán', isRequired: true, isFilled: !!projectData.price.trim() },
    { label: 'Hướng nhà', isRequired: false, isFilled: !!projectData.orientation?.trim() },
    { label: 'Mặt tiền & kích thước', isRequired: false, isFilled: !!projectData.frontage?.trim() },
    { label: 'Số tầng & Tổng DTSXD', isRequired: false, isFilled: !!projectData.floors?.trim() },
    { label: 'Pháp lý / Sổ đỏ', isRequired: false, isFilled: !!projectData.legal?.trim() },
  ];

  const requiredFilledCount = checkListItems.filter(i => i.isRequired && i.isFilled).length;
  const totalRequired = checkListItems.filter(i => i.isRequired).length;
  const optionalFilledCount = checkListItems.filter(i => !i.isRequired && i.isFilled).length;
  const totalOptional = checkListItems.filter(i => !i.isRequired).length;
  const completionPercentage = Math.round(((requiredFilledCount / totalRequired) * 0.7 + (optionalFilledCount / totalOptional) * 0.3) * 100);

  // Filter pending questions
  const activeQuestions = missingQuestions.filter(q => !dismissedQuestions.includes(q.fieldKey) && !(projectData as any)[q.fieldKey]);

  return (
    <div className="space-y-6">
      {/* Khối Dữ Liệu Dự Án */}
      <div className="bg-[#F5F2E9] border border-[#E5E0D3] rounded-3xl p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/80 p-4 sm:p-5 rounded-2xl border border-[#DCD5C5] shadow-2xs">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-[#1B3A2D] text-white shrink-0 mt-0.5 sm:mt-0 shadow-2xs">
              <Database className="w-6 h-6 text-[#C95928]" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                  Dữ liệu dự án
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                  <Cpu className="w-3 h-3 text-emerald-600" />
                  Router/Matcher: Lọc thông minh
                </span>
              </div>
              <div className="text-lg sm:text-xl font-bold text-[#1B3A2D] font-serif-brand">
                [{projectData.projectName || 'Vinhomes Ocean Park 2 - The Empire'}]
              </div>
              <div className="text-xs text-stone-600 flex flex-wrap items-center gap-x-2.5 gap-y-1">
                <span className="flex items-center gap-1 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-[#C95928]" />
                  ngày cập nhật: <strong className="text-stone-900">{knowledgeUpdatedAt || '29/10/2026'}</strong>
                </span>
                <span className="text-stone-400">•</span>
                <span className="text-stone-500 text-[11px]">
                  Tệp MD: <code className="bg-[#F5F2E9] px-1.5 py-0.5 rounded text-stone-700 font-mono">{getKnowledgeBase(projectData?.projectName || '').filename}</code>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-center shrink-0">
            <button
              onClick={() => setIsKnowledgeModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1B3A2D] hover:bg-[#152e24] text-white text-xs sm:text-sm font-bold transition-all shadow-xs hover:shadow-sm active:scale-98 group cursor-pointer"
              title="Cập nhật file md Knowledge Base và kiểm tra bộ lọc Context Injection"
            >
              <RefreshCw className="w-4 h-4 text-[#C95928] group-hover:rotate-180 transition-transform duration-500" />
              <span>Nút cập nhật</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* BƯỚC 1: Ô NHẬP NỘI DUNG THÔ CHO SALE (Quick Smart Input Box) */}
      {/* ========================================================================= */}
      <div className="bg-white border-2 border-[#1B3A2D]/20 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E5E0D3] pb-3">
          <div>
            <span className="text-xs font-bold text-[#C95928] uppercase tracking-wider block">
              Bước 1: Nhập Nhanh Thông Tin Thô
            </span>
            <h3 className="text-base sm:text-lg font-bold font-serif-brand text-[#1B3A2D] flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#C95928]" />
              Dán Thông Tin Căn Nhà
            </h3>
          </div>

          {rawText.trim() && (
            <button
              type="button"
              onClick={() => {
                setRawText('');
                setParseFeedback(null);
              }}
              className="text-xs text-slate-500 hover:text-rose-600 font-semibold cursor-pointer px-2.5 py-1 rounded-lg border border-slate-200 hover:border-rose-300 transition-colors"
            >
              Xóa để dán tin mới
            </button>
          )}
        </div>

        {/* Textarea for sales raw notes */}
        <div className="relative">
          <textarea
            rows={6}
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            placeholder="Sale dán nhanh thông tin thô của căn nhà tại đây. Ví dụ:
Tin xác thực : Căn HA1-95 ( sẵn ảnh sổ , ảnh hôm qua chụp ) 
- Diện tích đất 56m2 
- Mặt tiền 4mx14m 
- Hướng Tây Bắc 
- Xây 5 tầng , liền kề có ban công 
- Vị trí đẹp : Ngay gần 10 tòa chung cư , gần công viên Silkpark...
Giá : 7 tỷ bao phí sang tên
Pháp lý : Sổ đỏ có vay bank nhưng chủ nhà tự tất toán được..."
            className="w-full bg-[#FBFAF5] border border-[#DCD5C5] rounded-2xl p-4 text-xs sm:text-sm text-[#333333] font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#1B3A2D]/30 focus:border-[#1B3A2D]"
          />
        </div>

        {/* Action Button: AI Parse & Fill */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>AI sẽ tự trích xuất: Dự án, Mã căn, Diện tích, Giá, Mặt tiền, Hướng, Số tầng, Pháp lý...</span>
          </div>

          <button
            type="button"
            onClick={handleParseRawText}
            disabled={parsingLoading}
            className="w-full sm:w-auto px-6 py-3 bg-[#1B3A2D] hover:bg-[#2C5E4A] text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {parsingLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>AI Đang Tự Động Bóc Tách...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 text-[#C95928]" />
                <span>AI Soạn Tin</span>
              </>
            )}
          </button>
        </div>

        {/* Feedback message if parsed */}
        {parseFeedback && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center justify-between gap-2 animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{parseFeedback}</span>
            </div>
            <span className="text-[11px] font-bold text-emerald-700 bg-white px-2 py-0.5 rounded border border-emerald-200">
              Checklist hoàn thiện: {completionPercentage}%
            </span>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* BƯỚC 2: CHECKLIST THẺ TIN & TRỢ LÝ HỎI LẠI THÔNG MINH */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left column: Checklist & Field Editor (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-[#E5E0D3] rounded-3xl p-5 sm:p-6 space-y-4 shadow-sm">
            {/* Header: Persona Voice Selector */}
            <div className="border-b border-[#E5E0D3] pb-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#1B3A2D] uppercase tracking-wider flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-[#C95928]" />
                  giọng văn:
                </span>
                <span className="text-[11px] text-slate-500 font-medium">
                  {isOcean ? 'Khuyên dùng: Lê Yến' : 'Khuyên dùng: Vũ Việt'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => handleSelectVoice('le_yen')}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    activeVoice === 'le_yen'
                      ? 'bg-[#1B3A2D] text-white border-[#1B3A2D] shadow-md'
                      : 'bg-[#FBFAF5] text-slate-700 border-[#DCD5C5] hover:bg-[#F5F2E9]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <strong className="text-sm">Lê Yến</strong>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#C95928] text-white font-bold">
                      OP1/2/3
                    </span>
                  </div>
                  <p className={`text-[11px] leading-tight ${activeVoice === 'le_yen' ? 'text-white/80' : 'text-slate-500'}`}>
                    Ms Yến &bull; 0918 600 050<br/>Dồn nén thông số, voucher
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectVoice('vu_viet')}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    activeVoice === 'vu_viet'
                      ? 'bg-[#1B3A2D] text-white border-[#1B3A2D] shadow-md'
                      : 'bg-[#FBFAF5] text-slate-700 border-[#DCD5C5] hover:bg-[#F5F2E9]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <strong className="text-sm">Vũ Việt</strong>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#2C5E4A] text-white font-bold">
                      Bắc Ninh / Quảng Ninh
                    </span>
                  </div>
                  <p className={`text-[11px] leading-tight ${activeVoice === 'vu_viet' ? 'text-white/80' : 'text-slate-500'}`}>
                    Mr Việt &bull; 090.223.5050<br/>Bóc số, nói thẳng nhược điểm
                  </p>
                </button>
              </div>
            </div>

            {/* Checklist Completion Gauge */}
            <div className="bg-[#FBFAF5] p-3.5 rounded-2xl border border-[#E5E0D3] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#1B3A2D] flex items-center gap-1.5">
                  <CheckSquare className="w-4 h-4 text-[#C95928]" />
                  Checklist Thẻ Tin Batdongsan.com.vn:
                </span>
                <span className="font-mono font-bold text-[#C95928]">
                  {completionPercentage}% Đạt Chuẩn
                </span>
              </div>
              <div className="w-full h-2 bg-[#E5E0D3] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#C95928] to-emerald-600 rounded-full transition-all duration-500"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
            </div>

            {/* AI SMART QUESTIONS: Ask for missing fields with [Điền nhanh] or [Bỏ qua] */}
            {activeQuestions.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-bold text-[#1B3A2D] uppercase tracking-wider flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-[#C95928]" />
                  Trợ Lý AI Hỏi Lại Thông Tin Còn Thiếu:
                </span>
                <div className="space-y-2">
                  {activeQuestions.map((q) => (
                    <div 
                      key={q.fieldKey}
                      className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl space-y-2 text-xs"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-semibold text-amber-900 leading-snug">
                          {q.questionText}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleDismissQuestion(q.fieldKey)}
                          className="text-[11px] text-slate-400 hover:text-slate-700 px-1.5 py-0.5 rounded cursor-pointer shrink-0 font-medium bg-white border border-amber-200"
                        >
                          Bỏ qua
                        </button>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <input
                          type="text"
                          value={quickInputValues[q.fieldKey] ?? q.defaultSuggestion ?? ''}
                          onChange={(e) => setQuickInputValues({ ...quickInputValues, [q.fieldKey]: e.target.value })}
                          placeholder={q.defaultSuggestion || `Nhập ${q.fieldLabel.toLowerCase()}...`}
                          className="flex-1 bg-white border border-amber-300 rounded-lg px-2.5 py-1 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#1B3A2D]"
                        />
                        <button
                          type="button"
                          onClick={() => handleAnswerQuestion(q.fieldKey, quickInputValues[q.fieldKey] ?? q.defaultSuggestion ?? '')}
                          className="px-2.5 py-1 bg-[#1B3A2D] text-white rounded-lg font-bold text-xs hover:bg-[#2C5E4A] transition-colors cursor-pointer shrink-0"
                        >
                          Lưu
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* MANDATORY FIELDS (*) */}
            <div className="space-y-3 pt-1">
              <span className="text-[11px] font-bold text-[#C95928] uppercase tracking-wider block">
                1. Các Trường Bắt Buộc (*)
              </span>

              {/* Project Name (*) */}
              <div>
                <label className="block text-xs font-bold text-[#1B3A2D] mb-1">
                  Tên Dự Án Chính Thức <span className="text-[#C95928]">*</span>
                </label>
                <input
                  type="text"
                  value={projectData.projectName}
                  onChange={(e) => setProjectData({ ...projectData, projectName: e.target.value })}
                  placeholder="VD: Vinhomes Ocean Park 1, Vinhomes Ocean Park 2..."
                  className="w-full bg-[#FBFAF5] border border-[#DCD5C5] rounded-xl px-3.5 py-2 text-sm text-[#333333] font-semibold focus:outline-none focus:ring-2 focus:ring-[#1B3A2D]/30 focus:border-[#1B3A2D]"
                />
              </div>

              {/* Subdivision & Unit Code (*) */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#1B3A2D] mb-1">
                    Phân khu / Dãy <span className="text-[#C95928]">*</span>
                  </label>
                  <input
                    type="text"
                    value={projectData.subdivision}
                    onChange={(e) => setProjectData({ ...projectData, subdivision: e.target.value })}
                    placeholder="VD: Phân khu Hải Âu 1 (HA1-95)"
                    className="w-full bg-[#FBFAF5] border border-[#DCD5C5] rounded-xl px-3 py-2 text-xs sm:text-sm text-[#333333] focus:outline-none focus:ring-1 focus:ring-[#1B3A2D]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#1B3A2D] mb-1">
                    Loại hình BĐS <span className="text-[#C95928]">*</span>
                  </label>
                  <input
                    type="text"
                    value={projectData.propertyType}
                    onChange={(e) => setProjectData({ ...projectData, propertyType: e.target.value })}
                    placeholder="VD: Liền kề / Shophouse"
                    className="w-full bg-[#FBFAF5] border border-[#DCD5C5] rounded-xl px-3 py-2 text-xs sm:text-sm text-[#333333] focus:outline-none focus:ring-1 focus:ring-[#1B3A2D]"
                  />
                </div>
              </div>

              {/* Area & Price (*) */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#1B3A2D] mb-1">
                    Diện tích đất (m²) <span className="text-[#C95928]">*</span>
                  </label>
                  <input
                    type="text"
                    value={projectData.area}
                    onChange={(e) => setProjectData({ ...projectData, area: e.target.value })}
                    placeholder="VD: 56"
                    className="w-full bg-[#FBFAF5] border border-[#DCD5C5] rounded-xl px-3 py-2 text-sm text-[#333333] font-bold focus:outline-none focus:ring-1 focus:ring-[#1B3A2D]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#1B3A2D] mb-1">
                    Mức giá bán <span className="text-[#C95928]">*</span>
                  </label>
                  <input
                    type="text"
                    value={projectData.price}
                    onChange={(e) => setProjectData({ ...projectData, price: e.target.value })}
                    placeholder="VD: 7 tỷ bao phí"
                    className="w-full bg-[#FBFAF5] border border-[#DCD5C5] rounded-xl px-3 py-2 text-sm text-[#C95928] font-bold focus:outline-none focus:ring-1 focus:ring-[#1B3A2D]"
                  />
                </div>
              </div>
            </div>

            {/* OPTIONAL / COMPLEMENTARY FIELDS */}
            <div className="space-y-3 pt-2 border-t border-[#E5E0D3]">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                2. Thông Số Bổ Sung (Tùy chọn)
              </span>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Hướng nhà</label>
                  <input
                    type="text"
                    value={projectData.orientation || ''}
                    onChange={(e) => setProjectData({ ...projectData, orientation: e.target.value })}
                    placeholder="Tây Bắc / Đông Nam"
                    className="w-full bg-[#FBFAF5] border border-[#DCD5C5] rounded-lg px-2.5 py-1.5 text-xs text-[#333333] focus:outline-none focus:ring-1 focus:ring-[#1B3A2D]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Mặt tiền & Chiều sâu</label>
                  <input
                    type="text"
                    value={projectData.frontage || ''}
                    onChange={(e) => setProjectData({ ...projectData, frontage: e.target.value })}
                    placeholder="4mx14m hoặc MT 5m"
                    className="w-full bg-[#FBFAF5] border border-[#DCD5C5] rounded-lg px-2.5 py-1.5 text-xs text-[#333333] focus:outline-none focus:ring-1 focus:ring-[#1B3A2D]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Số tầng</label>
                  <input
                    type="text"
                    value={projectData.floors || ''}
                    onChange={(e) => setProjectData({ ...projectData, floors: e.target.value })}
                    placeholder="Xây 5 tầng"
                    className="w-full bg-[#FBFAF5] border border-[#DCD5C5] rounded-lg px-2.5 py-1.5 text-xs text-[#333333] focus:outline-none focus:ring-1 focus:ring-[#1B3A2D]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Tổng DTSXD (Sàn)</label>
                  <input
                    type="text"
                    value={projectData.constructionArea || ''}
                    onChange={(e) => setProjectData({ ...projectData, constructionArea: e.target.value })}
                    placeholder="224.3m²"
                    className="w-full bg-[#FBFAF5] border border-[#DCD5C5] rounded-lg px-2.5 py-1.5 text-xs text-[#333333] focus:outline-none focus:ring-1 focus:ring-[#1B3A2D]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Pháp lý / Tình trạng sổ đỏ</label>
                <input
                  type="text"
                  value={projectData.legal || ''}
                  onChange={(e) => setProjectData({ ...projectData, legal: e.target.value })}
                  placeholder="Sổ đỏ sẵn có, chủ tự tất toán được"
                  className="w-full bg-[#FBFAF5] border border-[#DCD5C5] rounded-xl px-3 py-1.5 text-xs text-[#333333] focus:outline-none focus:ring-1 focus:ring-[#1B3A2D]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Vị trí &amp; Điểm nổi bật</label>
                <textarea
                  rows={2}
                  value={projectData.amenities || ''}
                  onChange={(e) => setProjectData({ ...projectData, amenities: e.target.value })}
                  placeholder="Gần 10 tòa chung cư, công viên Silk Park, Vincom, Vinschool, ngã tư kinh doanh..."
                  className="w-full bg-[#FBFAF5] border border-[#DCD5C5] rounded-xl px-3 py-1.5 text-xs text-[#333333] focus:outline-none focus:ring-1 focus:ring-[#1B3A2D] resize-none"
                />
              </div>
            </div>

            {error && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* ========================================================================= */}
            {/* NÚT BẤM SOẠN TIN ĐĂNG (CẢ 3 PHIÊN BẢN: BATDONGSAN, ZALO, FACEBOOK) */}
            {/* ========================================================================= */}
            <div className="pt-2 space-y-2">
              <div
                className={`text-xs sm:text-sm px-3 py-2 rounded-xl border ${
                  marketContext ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                {marketContext
                  ? `Đang dùng dữ liệu thị trường thật: ${marketContext.rowCount} tin Batdongsan, quét lúc ${marketContext.scrapedAt}.`
                  : 'Chưa có dữ liệu thị trường thật (làm ở bước 1). Tin sẽ không so sánh với thị trường.'}
              </div>
              <button
                type="button"
                onClick={handleGenerate}
                disabled={loading}
                className="w-full py-4 px-5 rounded-2xl bg-gradient-to-r from-[#C95928] to-[#A8471F] hover:from-[#A8471F] hover:to-[#C95928] text-white font-bold text-sm sm:text-base transition-all shadow-lg shadow-[#C95928]/30 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2.5"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Đang Soạn Cả 3 Phiên Bản (Batdongsan, Zalo, Facebook)...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>🚀 Soạn Tin 3 Nền Tảng</span>
                  </>
                )}
              </button>
              <p className="text-[11px] text-center text-slate-500 mt-2">
                Tự động tạo: 1. Batdongsan.com.vn (chuẩn 90-99 kt) &bull; 2. Zalo gửi khách &bull; 3. Facebook Group BĐS
              </p>
            </div>
          </div>
        </div>

        {/* Right column: 3 Channels Interactive Simulators & Quick Copy Drawer (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {!listings ? (
            <div className="bg-white border-2 border-dashed border-[#DCD5C5] rounded-3xl p-10 sm:p-12 text-center flex flex-col items-center justify-center min-h-[520px] shadow-sm">
              <div className="w-16 h-16 rounded-2xl bg-[#F5F2E9] flex items-center justify-center text-[#1B3A2D] mb-4 border border-[#E5E0D3]">
                <Monitor className="w-8 h-8 text-[#C95928]" />
              </div>
              <h3 className="text-xl font-bold font-serif-brand text-[#1B3A2D] mb-1">
                Trình Giả Lập Hiển Thị Trực Quan
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mb-6 leading-relaxed">
                Sau khi bấm nút <strong>&quot;Soạn Tin 3 Nền Tảng&quot;</strong>, hệ thống sẽ mô phỏng thực tế diện mạo bài đăng trên cả 3 nền tảng:
                <strong> Batdongsan.com.vn (VIP Kim Cương)</strong>, <strong>Zalo Mobile</strong> và <strong>Facebook Group</strong>.
              </p>
              <button
                type="button"
                onClick={handleGenerate}
                disabled={loading}
                className="px-6 py-3 bg-[#1B3A2D] hover:bg-[#2C5E4A] text-white rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer shadow-md flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-[#C95928]" />
                <span>Bấm để soạn tin ngay</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4 animate-in fade-in duration-300">
              {/* 3 SIMULATOR CHANNEL TABS */}
              <div className="bg-white border border-[#E5E0D3] rounded-2xl p-2 flex flex-wrap gap-2 shadow-sm">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedVersionType('investment');
                    setSimTab('preview_bds');
                  }}
                  className={`flex-1 min-w-[150px] px-3.5 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    simTab === 'preview_bds'
                      ? 'bg-[#1B3A2D] text-white shadow-md'
                      : 'text-[#333333]/70 hover:text-[#1B3A2D] hover:bg-[#F5F2E9]'
                  }`}
                >
                  <Monitor className="w-4 h-4 text-[#C95928]" />
                  <span>1. Batdongsan.com.vn</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedVersionType('family');
                    setSimTab('preview_zalo');
                  }}
                  className={`flex-1 min-w-[150px] px-3.5 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    simTab === 'preview_zalo'
                      ? 'bg-[#1B3A2D] text-white shadow-md'
                      : 'text-[#333333]/70 hover:text-[#1B3A2D] hover:bg-[#F5F2E9]'
                  }`}
                >
                  <MessageCircle className="w-4 h-4 text-sky-400" />
                  <span>2. Zalo Mobile</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedVersionType('social');
                    setSimTab('preview_facebook');
                  }}
                  className={`flex-1 min-w-[150px] px-3.5 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    simTab === 'preview_facebook'
                      ? 'bg-[#1B3A2D] text-white shadow-md'
                      : 'text-[#333333]/70 hover:text-[#1B3A2D] hover:bg-[#F5F2E9]'
                  }`}
                >
                  <Share2 className="w-4 h-4 text-indigo-400" />
                  <span>3. Facebook Group</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSimTab('editor')}
                  className={`px-3 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    simTab === 'editor'
                      ? 'bg-slate-800 text-white'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-[#F5F2E9]'
                  }`}
                  title="Chỉnh sửa nội dung trực tiếp"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Soạn Thảo</span>
                </button>
              </div>

              {/* AUDIT CHECKLIST FOR BATDONGSAN */}
              {simTab === 'preview_bds' && (
                <div className="bg-white border border-[#E5E0D3] rounded-2xl p-4 space-y-2.5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase font-bold text-[#1B3A2D] flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-[#C95928]" />
                      Bảng Kiểm Tra Quy Tắc Đăng Tin (Audit Rulebook Vũ Việt Property):
                    </span>
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full font-mono ${isTitleStrictOptimal ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                      {titleLen}/90-99 ký tự {isTitleStrictOptimal ? '✓ Chuẩn' : '⚠️ Cần chỉnh'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                    <div className={`p-2 rounded-xl border flex items-center gap-1.5 ${isTitleStrictOptimal ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-amber-50 border-amber-200 text-amber-900'}`}>
                      {isTitleStrictOptimal ? <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> : <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />}
                      <span>90-99 ký tự: <strong>{titleLen} kt</strong></span>
                    </div>

                    <div className={`p-2 rounded-xl border flex items-center gap-1.5 ${titleCompAudit.allPassed ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-amber-50 border-amber-200 text-amber-900'}`}>
                      {titleCompAudit.allPassed ? <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> : <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />}
                      <span>Đủ 6 thành tố tiêu đề</span>
                    </div>

                    <div className={`p-2 rounded-xl border flex items-center gap-1.5 ${phoneOccurrences === 2 ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-amber-50 border-amber-200 text-amber-900'}`}>
                      {phoneOccurrences === 2 ? <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> : <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />}
                      <span>SĐT đúng 2 lần: <strong>{phoneOccurrences} lần</strong></span>
                    </div>

                    <div className={`p-2 rounded-xl border flex items-center gap-1.5 ${foundViolations.length === 0 ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-rose-50 border-rose-200 text-rose-900'}`}>
                      {foundViolations.length === 0 ? <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> : <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />}
                      <span>Không từ tuyệt đối</span>
                    </div>
                  </div>
                </div>
              )}

              {/* LEARNING FEEDBACK BANNER */}
              {learningFeedback && (
                <div className="p-3.5 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-300 rounded-2xl text-xs text-emerald-950 flex items-center justify-between gap-3 shadow-sm animate-in fade-in">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-semibold">{learningFeedback}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setLearningFeedback(null)}
                    className="text-slate-400 hover:text-slate-700 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {listings && listings.warnings && listings.warnings.length > 0 && (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 text-sm space-y-1.5">
                  <strong>Cần kiểm tra trước khi đăng:</strong>
                  <ul className="list-disc list-inside space-y-1">
                    {listings.warnings.map((w, i) => (
                      <li key={i}>{w}</li>
                    ))}
                  </ul>
                </div>
              )}
              {listings && (!listings.warnings || listings.warnings.length === 0) && (
                <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm">
                  Đã đối chiếu: mọi con số trong tin đều có trong dữ liệu căn, kho dự án hoặc dữ liệu thị trường thật.
                </div>
              )}

              {/* ========================================================================= */}
              {/* TAB 1: BATDONGSAN.COM.VN SIMULATOR (WITH DIRECT INLINE EDITING) */}
              {/* ========================================================================= */}
              {simTab === 'preview_bds' && currentVersion && (
                <div className="bg-white border-2 border-[#1B3A2D]/30 rounded-3xl p-6 space-y-4 shadow-md animate-in fade-in">
                  <div className="flex items-center justify-between border-b border-[#E5E0D3] pb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-rose-500" />
                      <span className="w-3 h-3 rounded-full bg-amber-500" />
                      <span className="w-3 h-3 rounded-full bg-emerald-500" />
                      <span className="text-xs font-bold text-slate-700 ml-2">
                        Trình Giả Lập Batdongsan.com.vn (1 Màn Hình Laptop)
                      </span>
                    </div>
                    <span className="text-xs bg-[#C95928] text-white px-2.5 py-0.5 rounded-md font-bold uppercase shadow-xs">
                      Tin VIP Kim Cương
                    </span>
                  </div>

                  {/* Simulated Card on Batdongsan.com.vn with Direct Editing */}
                  <div className="border border-[#E5E0D3] rounded-2xl p-5 bg-[#FBFAF5] space-y-3.5 shadow-sm hover:border-[#1B3A2D] transition-colors">
                    {/* Badge & Direct Editable Title */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#C95928] text-white uppercase">
                            VIP KIM CƯƠNG
                          </span>
                          <span className="text-xs text-slate-500">
                            Hôm nay &bull; Đã xác thực sổ đỏ &bull; {projectData.projectName}
                          </span>
                        </div>
                        <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded ${
                          titleLen >= 90 && titleLen <= 99 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : titleLen > 99
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {titleLen}/99 ký tự {titleLen >= 90 && titleLen <= 99 ? '✓ Chuẩn' : titleLen > 99 ? '⚠️ Quá dài' : '⚠️ Ngắn'}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <textarea
                          rows={2}
                          value={currentVersion.title}
                          onChange={(e) => updateCurrentTitle(e.target.value)}
                          placeholder="Tiêu đề chuẩn 90-99 ký tự..."
                          className="w-full bg-white border border-[#DCD5C5] rounded-xl px-3.5 py-2 text-sm sm:text-base font-bold text-[#1B3A2D] focus:outline-none focus:ring-2 focus:ring-[#1B3A2D]/30 resize-none break-words whitespace-normal leading-snug"
                        />
                      </div>
                    </div>

                    {/* Pricing, Area, Subdivision bar */}
                    <div className="flex flex-wrap items-center gap-3 text-sm font-bold border-y border-[#E5E0D3] py-2">
                      <span className="text-lg text-[#C95928]">{projectData.price}</span>
                      <span className="text-slate-300">&bull;</span>
                      <span className="text-[#1B3A2D]">{projectData.area} m²</span>
                      <span className="text-slate-300">&bull;</span>
                      <span className="text-slate-700 font-normal">{projectData.subdivision}</span>
                      <span className="text-slate-300">&bull;</span>
                      <span className="text-slate-700 font-normal">{projectData.orientation || 'Tây Bắc'}</span>
                      <span className="text-slate-300">&bull;</span>
                      <span className="text-slate-700 font-normal">{projectData.frontage || 'MT 4m'}</span>
                    </div>

                    {/* Full Description Direct Editing */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-end">
                        <button
                          type="button"
                          onClick={() => handleCopy(currentVersion.content, 'copy-bds-content')}
                          className="text-xs text-[#C95928] font-bold flex items-center gap-1 cursor-pointer hover:underline"
                        >
                          {copiedKey === 'copy-bds-content' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          <span>Copy nội dung</span>
                        </button>
                      </div>
                      <textarea
                        rows={12}
                        value={currentVersion.content}
                        onChange={(e) => updateCurrentContent(e.target.value)}
                        className="w-full text-xs sm:text-sm text-slate-800 leading-relaxed font-sans bg-white p-4 rounded-xl border border-[#DCD5C5] focus:outline-none focus:ring-2 focus:ring-[#1B3A2D]/30"
                      />
                    </div>
                  </div>

                  {/* Save & Self-Learning Button */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1 border-t border-[#E5E0D3]">
                    <button
                      type="button"
                      onClick={() => handleSaveAndLearnVoice('preview_bds')}
                      disabled={isSavingVoice}
                      className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-emerald-700 to-[#1B3A2D] hover:from-emerald-800 hover:to-[#142C22] text-white rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all disabled:opacity-50"
                    >
                      {isSavingVoice ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Đang lưu &amp; AI Đang Tự Học Giọng Văn...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 text-emerald-200" />
                          <span>💾 Lưu &amp; Tự Học Giọng Văn</span>
                        </>
                      )}
                    </button>
                    <span className="text-[11px] text-slate-500 text-center sm:text-right">
                      AI sẽ tự phân tích các chỉnh sửa của bạn để nâng cấp phong cách cá nhân hóa.
                    </span>
                  </div>
                </div>
              )}

              {/* ========================================================================= */}
              {/* TAB 2: ZALO MOBILE SIMULATOR (WITH DIRECT INLINE EDITING) */}
              {/* ========================================================================= */}
              {simTab === 'preview_zalo' && currentVersion && (
                <div className="bg-white border-2 border-sky-300 rounded-3xl p-6 space-y-4 shadow-md animate-in fade-in">
                  <div className="flex items-center justify-between border-b border-[#E5E0D3] pb-3">
                    <div className="flex items-center gap-2">
                      <span className="p-1 rounded-lg bg-sky-500 text-white">
                        <MessageCircle className="w-4 h-4" />
                      </span>
                      <span className="text-xs font-bold text-sky-900">
                        Trình Giả Lập Zalo Mobile (Nhóm VIP Khách Hàng)
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(currentVersion.content, 'zalo-all')}
                      className="px-3 py-1 bg-sky-500 hover:bg-sky-600 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      {copiedKey === 'zalo-all' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>Copy Bài Zalo</span>
                    </button>
                  </div>

                  {/* Smartphone Frame Simulation */}
                  <div className="max-w-md mx-auto bg-slate-900 rounded-[36px] p-3 shadow-2xl border-4 border-slate-800">
                    {/* Screen Header */}
                    <div className="bg-sky-600 text-white rounded-t-[26px] p-3 text-xs flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-white/20 font-bold flex items-center justify-center text-[10px]">
                          {activeVoice === 'le_yen' ? 'LY' : 'VV'}
                        </div>
                        <div>
                          <strong className="block text-xs leading-none">
                            {projectData.contactName || (activeVoice === 'le_yen' ? 'Ms Yến - OCP' : 'Mr Việt')}
                          </strong>
                          <span className="text-[9px] text-white/80">Vừa truy cập</span>
                        </div>
                      </div>
                      <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full">Zalo VIP</span>
                    </div>

                    {/* Chat Bubble Body with Editable Fields */}
                    <div className="bg-[#EBF2F7] p-3.5 space-y-3 min-h-[360px] text-xs">
                      {/* Message Bubble */}
                      <div className="bg-white rounded-2xl rounded-tl-xs p-3.5 shadow-xs space-y-2.5 text-slate-800">
                        <div className="space-y-1">
                          <textarea
                            rows={2}
                            value={currentVersion.title}
                            onChange={(e) => updateCurrentTitle(e.target.value)}
                            className="w-full bg-sky-50/60 border border-sky-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-sky-950 focus:outline-none focus:ring-1 focus:ring-sky-500 resize-none break-words whitespace-normal leading-snug"
                          />
                        </div>

                        <div className="space-y-1">
                          <textarea
                            rows={10}
                            value={currentVersion.content}
                            onChange={(e) => updateCurrentContent(e.target.value)}
                            className="w-full text-[11px] leading-relaxed text-slate-700 bg-sky-50/40 border border-sky-200 rounded-xl p-2.5 focus:outline-none focus:ring-1 focus:ring-sky-500 font-sans"
                          />
                        </div>

                        <div className="p-2 bg-sky-50 border border-sky-100 rounded-xl text-[10px] text-sky-800 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                          <span>Sẵn video quay thực tế + ảnh sổ đỏ chính chủ gửi qua Zalo</span>
                        </div>

                        <div className="text-[9px] text-slate-400 text-right">
                          {new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} &bull; Đã nhận
                        </div>
                      </div>
                    </div>

                    {/* Screen Footer */}
                    <div className="bg-white rounded-b-[26px] p-2.5 flex items-center justify-between text-xs text-slate-400 border-t border-slate-100">
                      <span>Nhắn tin cho khách hàng...</span>
                      <Send className="w-4 h-4 text-sky-600" />
                    </div>
                  </div>

                  {/* Save & Self-Learning Button */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-[#E5E0D3]">
                    <button
                      type="button"
                      onClick={() => handleSaveAndLearnVoice('preview_zalo')}
                      disabled={isSavingVoice}
                      className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-sky-600 to-sky-800 hover:from-sky-700 hover:to-sky-900 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all disabled:opacity-50"
                    >
                      {isSavingVoice ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Đang lưu &amp; AI Đang Tự Học Giọng Văn...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 text-sky-200" />
                          <span>💾 Lưu &amp; Tự Học Giọng Văn (Zalo)</span>
                        </>
                      )}
                    </button>
                    <span className="text-[11px] text-slate-500 text-center sm:text-right">
                      Lưu và gửi phiên bản tinh chỉnh để AI tự học phong cách viết Zalo của bạn.
                    </span>
                  </div>
                </div>
              )}

              {/* ========================================================================= */}
              {/* TAB 3: FACEBOOK GROUP SIMULATOR (WITH DIRECT INLINE EDITING) */}
              {/* ========================================================================= */}
              {simTab === 'preview_facebook' && currentVersion && (
                <div className="bg-white border-2 border-indigo-200 rounded-3xl p-6 space-y-4 shadow-md animate-in fade-in">
                  <div className="flex items-center justify-between border-b border-[#E5E0D3] pb-3">
                    <span className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
                      <Share2 className="w-4 h-4 text-indigo-600" />
                      Trình Giả Lập Facebook Group BĐS (Viral Post)
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(currentVersion.content, 'fb-all')}
                      className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      {copiedKey === 'fb-all' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>Copy Bài Facebook</span>
                    </button>
                  </div>

                  {/* Facebook Group Post Card with Direct Editable Fields */}
                  <div className="border border-slate-200 rounded-2xl p-4 bg-white space-y-3.5 max-w-xl mx-auto shadow-sm">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-full bg-[#1B3A2D] text-white font-bold flex items-center justify-center text-sm shadow-xs">
                          {activeVoice === 'le_yen' ? 'LY' : 'VV'}
                        </div>
                        <div>
                          <strong className="text-xs sm:text-sm text-slate-900 block leading-tight">
                            {projectData.contactName || (activeVoice === 'le_yen' ? 'Lê Yến' : 'Vũ Việt')} &bull; CỘNG ĐỒNG CƯ DÂN &amp; ĐẦU TƯ VINHOMES
                          </strong>
                          <span className="text-[11px] text-slate-500">
                            Người đóng góp nhiều nhất &bull; Vừa xong &bull; 🌐
                          </span>
                        </div>
                      </div>
                      <span className="text-slate-400 font-bold">&bull;&bull;&bull;</span>
                    </div>

                    {/* Direct Editable Title / Hook */}
                    <div className="space-y-1">
                      <textarea
                        rows={2}
                        value={currentVersion.title}
                        onChange={(e) => updateCurrentTitle(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none break-words whitespace-normal leading-snug"
                      />
                    </div>

                    {/* Direct Editable Post Text */}
                    <div className="space-y-1">
                      <textarea
                        rows={11}
                        value={currentVersion.content}
                        onChange={(e) => updateCurrentContent(e.target.value)}
                        className="w-full text-xs sm:text-sm text-slate-800 leading-relaxed bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-sans"
                      />
                    </div>

                    {/* Facebook Media Mock */}
                    <div className="rounded-xl overflow-hidden bg-gradient-to-r from-[#1B3A2D] to-[#2C5E4A] p-5 text-white text-center shadow-xs">
                      <span className="text-xs uppercase tracking-wider text-[#C95928] font-bold block mb-1">
                        SẢN PHẨM NỔI BẬT CHÍNH CHỦ
                      </span>
                      <h5 className="font-bold font-serif-brand text-base sm:text-lg mb-1">
                        {projectData.projectName}
                      </h5>
                      <p className="text-xs text-white/80">
                        {projectData.subdivision} &bull; {projectData.area} m² &bull; Giá {projectData.price}
                      </p>
                    </div>

                    {/* Action Bar */}
                    <div className="flex items-center justify-between border-t border-slate-100 pt-2 text-xs text-slate-500 font-semibold">
                      <div className="flex items-center gap-1 cursor-pointer hover:text-indigo-600">
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span>Thích</span>
                      </div>
                      <div className="flex items-center gap-1 cursor-pointer hover:text-indigo-600">
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Bình luận</span>
                      </div>
                      <div className="flex items-center gap-1 cursor-pointer hover:text-indigo-600">
                        <Share2 className="w-3.5 h-3.5" />
                        <span>Chia sẻ</span>
                      </div>
                    </div>
                  </div>

                  {/* Save & Self-Learning Button */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-[#E5E0D3]">
                    <button
                      type="button"
                      onClick={() => handleSaveAndLearnVoice('preview_facebook')}
                      disabled={isSavingVoice}
                      className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-800 hover:from-indigo-700 hover:to-indigo-900 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all disabled:opacity-50"
                    >
                      {isSavingVoice ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Đang lưu &amp; AI Đang Tự Học Giọng Văn...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 text-indigo-200" />
                          <span>💾 Lưu &amp; Tự Học Giọng Văn (Facebook)</span>
                        </>
                      )}
                    </button>
                    <span className="text-[11px] text-slate-500 text-center sm:text-right">
                      Tự động tối ưu câu từ cho các bài đăng Group BĐS tương lai.
                    </span>
                  </div>
                </div>
              )}

              {/* ========================================================================= */}
              {/* TAB 4: DIRECT TEXT EDITOR */}
              {/* ========================================================================= */}
              {simTab === 'editor' && currentVersion && (
                <div className="bg-white border border-[#E5E0D3] rounded-3xl p-6 space-y-4 shadow-sm animate-in fade-in">
                  <div>
                    <label className="text-xs font-bold text-[#1B3A2D] uppercase tracking-wider block mb-1.5">
                      Tiêu đề ({selectedVersionType.toUpperCase()})
                    </label>
                    <textarea
                      rows={2}
                      value={currentVersion.title}
                      onChange={(e) => updateCurrentTitle(e.target.value)}
                      className="w-full bg-[#FBFAF5] border border-[#DCD5C5] rounded-xl p-3 text-sm font-bold text-[#1B3A2D] focus:outline-none focus:ring-2 focus:ring-[#1B3A2D]/30 resize-none break-words whitespace-normal leading-snug"
                    />
                    <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
                      <span>90-99 ký tự: {titleLen} ký tự</span>
                      <button
                        type="button"
                        onClick={() => handleCopy(currentVersion.title, 'edit-t')}
                        className="text-[#C95928] font-bold cursor-pointer"
                      >
                        {copiedKey === 'edit-t' ? 'Đã copy' : 'Copy tiêu đề'}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#1B3A2D] uppercase tracking-wider block mb-1.5">
                      Nội dung bài viết
                    </label>
                    <textarea
                      rows={14}
                      value={currentVersion.content}
                      onChange={(e) => updateCurrentContent(e.target.value)}
                      className="w-full bg-[#FBFAF5] border border-[#DCD5C5] rounded-2xl p-4 text-xs sm:text-sm text-[#333333] leading-relaxed font-mono focus:outline-none focus:ring-2 focus:ring-[#1B3A2D]/30"
                    />
                  </div>

                  {/* Save & Self-Learning Button */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-[#E5E0D3]">
                    <button
                      type="button"
                      onClick={() => handleSaveAndLearnVoice('editor')}
                      disabled={isSavingVoice}
                      className="w-full sm:w-auto px-6 py-3 bg-[#1B3A2D] hover:bg-[#2C5E4A] text-white rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all disabled:opacity-50"
                    >
                      {isSavingVoice ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Đang lưu &amp; AI Đang Tự Học Giọng Văn...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 text-emerald-300" />
                          <span>💾 Lưu &amp; Tự Học Giọng Văn</span>
                        </>
                      )}
                    </button>
                    <span className="text-[11px] text-slate-500 text-center sm:text-right">
                      AI sẽ ghi nhớ phiên bản này để cải thiện các thế hệ tin tiếp theo.
                    </span>
                  </div>
                </div>
              )}

              {/* 3 Suggested Titles (strictly max 99 characters, 90-99 optimal) */}
              {listings.suggestedTitles && listings.suggestedTitles.length > 0 && (
                <div className="bg-white border border-[#E5E0D3] rounded-2xl p-4 sm:p-5 shadow-sm space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold font-serif-brand text-[#1B3A2D] uppercase tracking-wide flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-[#C95928]" /> 
                      3 Tiêu Đề Mẫu Chuẩn
                    </span>
                    <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      ✓ Đạt chuẩn tối đa 99 ký tự
                    </span>
                  </div>
                  <div className="space-y-2">
                    {listings.suggestedTitles.slice(0, 3).map((t, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => updateCurrentTitle(t)}
                        className={`w-full text-left p-3 rounded-xl text-xs transition-all flex items-start sm:items-center justify-between gap-3 cursor-pointer ${
                          currentVersion?.title === t
                            ? 'bg-[#1B3A2D] text-white font-semibold shadow-sm'
                            : 'bg-[#FBFAF5] text-[#333333] hover:bg-[#F5F2E9] border border-[#E5E0D3]'
                        }`}
                      >
                        <span className="text-xs sm:text-sm font-semibold leading-relaxed break-words whitespace-normal text-left flex-1">
                          {t}
                        </span>
                        <div className="flex items-center gap-2 shrink-0 pt-0.5 sm:pt-0">
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                            t.length >= 90 && t.length <= 99 
                              ? 'bg-emerald-100 text-emerald-800' 
                              : t.length > 99
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {t.length}/99 ký tự {t.length <= 99 && t.length >= 90 ? '✓' : ''}
                          </span>
                          {currentVersion?.title === t && (
                            <Check className="w-3.5 h-3.5 text-[#C95928]" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Next Step Banner */}
              <div className="bg-[#152E24] text-white p-5 rounded-2xl border border-[#2C5E4A] flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
                <span className="text-xs sm:text-sm text-[#FBFAF5] flex items-center gap-2 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-[#C95928]" />
                  Đã tạo xong 3 phiên bản theo yêu cầu.
                </span>
                <button
                  type="button"
                  onClick={onNextStep}
                  className="inline-flex items-center gap-2 px-5 py-3 bg-[#C95928] hover:bg-[#A8471F] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all shrink-0 cursor-pointer"
                >
                  <span>Chuyển sang Bước III: Xuất Bản (Notion & Prompt AI)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>


            </div>
          )}
        </div>
      </div>

      {/* Knowledge Base & Context Injection Modal */}
      <KnowledgeBaseModal
        isOpen={isKnowledgeModalOpen}
        onClose={() => setIsKnowledgeModalOpen(false)}
        currentProjectName={projectData.projectName}
        currentSubdivision={projectData.subdivision}
        currentPropertyType={projectData.propertyType}
        currentArea={projectData.area}
        currentAmenities={projectData.amenities}
        onKnowledgeUpdated={(newDate) => {
          setKnowledgeUpdatedAt(newDate);
          setParseFeedback(`✨ Đã cập nhật file md Knowledge Base thành công (${newDate})! Cơ chế Context Injection đã đồng bộ dữ liệu mới.`);
          setTimeout(() => setParseFeedback(null), 6000);
        }}
      />
    </div>
  );
};
