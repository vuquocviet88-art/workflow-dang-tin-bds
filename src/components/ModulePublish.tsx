import React, { useState } from 'react';
import { 
  Send, 
  Sparkles, 
  Copy, 
  Check, 
  ExternalLink, 
  Terminal, 
  Bot, 
  FileText, 
  Image as ImageIcon, 
  Database, 
  Globe, 
  ArrowRight, 
  CheckCircle2, 
  HelpCircle, 
  Layers, 
  Share2, 
  Code, 
  Laptop, 
  Zap, 
  Building2, 
  UserCheck, 
  FolderPlus, 
  FolderSync, 
  ShieldAlert, 
  ChevronRight,
  BookmarkCheck,
  Compass
} from 'lucide-react';
import { 
  ProjectFormData, 
  GeneratedListings, 
  DriveImage,
  NotionSettings,
  NotionSyncHistoryItem
} from '../types';

interface ModulePublishProps {
  projectData: ProjectFormData;
  listings: GeneratedListings | null;
  selectedVersionType: 'investment' | 'family' | 'social';
  images: DriveImage[];
  driveFolderUrl?: string;
  notionSettings?: NotionSettings;
  setNotionSettings?: React.Dispatch<React.SetStateAction<NotionSettings>>;
  syncHistory?: NotionSyncHistoryItem[];
  setSyncHistory?: React.Dispatch<React.SetStateAction<NotionSyncHistoryItem[]>>;
  onNavigateToContent?: () => void;
}

export const ModulePublish: React.FC<ModulePublishProps> = ({
  projectData,
  listings,
  selectedVersionType,
  images,
  driveFolderUrl = '',
  onNavigateToContent,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all_in_one' | 'part1_notion' | 'part2_drive' | 'part3_batdongsan' | 'payload_json'>('all_in_one');

  // Copy handler
  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  // Active version content
  const activeVersion = listings
    ? selectedVersionType === 'investment'
      ? listings.versionInvestment
      : selectedVersionType === 'family'
      ? listings.versionFamily
      : listings.versionSocial
    : null;

  const currentTitle = activeVersion?.title || projectData.appliedTitle || `${projectData.price} căn ${projectData.propertyType} ${projectData.subdivision} ${projectData.area}m2 - ${projectData.projectName}`;
  const currentContent = activeVersion?.content || `Thông tin căn nhà ${projectData.propertyType} ${projectData.subdivision} tại ${projectData.projectName}.\nDiện tích: ${projectData.area}m2, Giá: ${projectData.price}.\nLiên hệ: ${projectData.contactName} - ${projectData.phone}`;

  const isLand = projectData.propertyType.toLowerCase().includes('đất');
  const isShophouse = projectData.propertyType.toLowerCase().includes('shophouse') || projectData.propertyType.toLowerCase().includes('thương mại');

  // Dynamic photo breakdown (pure text list, NO illustration drawing)
  const photoList = isLand ? [
    { stt: 1, name: 'Ảnh bìa (Hero Thumbnail)', description: 'Flycam toàn cảnh lô đất góc rộng, thể hiện vị trí đắc địa, tỷ lệ chuẩn 4:3' },
    { stt: 2, name: 'Mặt bằng & Cọc mốc lô đất', description: 'Góc chụp trực diện ranh giới lô đất thực địa, thể hiện rõ vỉa hè và hạ tầng hoàn thiện' },
    { stt: 3, name: 'Tuyến đường trước mặt', description: 'Hình ảnh đường giao thông trước lô đất, độ rộng lòng đường và cây xanh cảnh quan' },
    { stt: 4, name: 'Trục kết nối giao thông', description: 'Hình ảnh trục đại lộ chính kết nối từ lô đất ra các tuyến đường huyết mạch' },
    { stt: 5, name: 'Bản đồ quy hoạch 1/500', description: 'Trích lục bản đồ phân lô quy hoạch 1/500 rõ ràng chỉ số xây dựng và chỉ giới đường đỏ' },
    { stt: 6, name: 'Pháp lý / Trích lục sổ đỏ', description: 'Ảnh chụp trích lục bản đồ địa chính hoặc sổ đỏ từng lô (đã che thông tin cá nhân)' },
    { stt: 7, name: 'Tiện ích điểm nhấn', description: 'Hình ảnh tiện ích sân golf / bến du thuyền / hồ nước cảnh quan kề cận' },
    { stt: 8, name: 'Toàn cảnh đại dự án', description: 'Góc flycam nhịp sống, tiến độ hạ tầng và tiềm năng kết nối của toàn đại đô thị' },
  ] : [
    { stt: 1, name: 'Ảnh bìa (Hero Thumbnail)', description: 'Góc chụp mặt tiền đắt giá nhất của căn nhà, góc 4:3 sắc nét, bao quát kiến trúc và vỉa hè' },
    { stt: 2, name: 'Mặt tiền & Đường trước nhà', description: 'Góc chụp ngang tầm mắt thấy rõ vỉa hè rộng, khoảng lùi và trục đường thông thoáng' },
    { stt: 3, name: 'Tầm nhìn từ cửa chính', description: 'Góc nhìn từ trong nhà ra ngoài hoặc ngã tư đối diện, thể hiện sự sầm uất kinh doanh' },
    { stt: 4, name: 'Không gian tầng 1', description: 'Mặt bằng kinh doanh hoặc phòng khách thoáng mát, ánh sáng tự nhiên đầy đủ' },
    { stt: 5, name: 'Khu vực bếp & Sân sau', description: 'Thiết kế bếp hiện đại kết hợp giếng trời hoặc sân vườn nhỏ thoáng mát' },
    { stt: 6, name: 'Phòng ngủ Master', description: 'Không gian phòng ngủ chính có ban công kính đón nắng gió, view đẹp' },
    { stt: 7, name: 'Phòng ngủ phụ & Ban công', description: 'Phòng ngủ thứ 2-3 và chi tiết lan can ban công, góc thư giãn ngoài trời' },
    { stt: 8, name: 'Phòng tắm / WC', description: 'Khu vực nhà vệ sinh với trang thiết bị cao cấp, ốp lát gạch chống trơn sạch sẽ' },
    { stt: 9, name: 'Bản vẽ mặt bằng tầng', description: 'Sơ đồ thiết kế kiến trúc công năng các tầng hoặc mặt bằng bàn giao' },
    { stt: 10, name: 'Pháp lý sổ đỏ chính chủ', description: 'Ảnh chụp trang bìa & sơ đồ thửa đất của sổ đỏ (đã che thông tin cá nhân chủ cũ)' },
    { stt: 11, name: 'Tiện ích phân khu', description: 'Ảnh B-roll công viên cây xanh, hồ bơi phong cách resort hoặc sân chơi trẻ em ngay gần' },
    { stt: 12, name: 'Tiện ích đại đô thị', description: 'Ảnh B-roll TTTM Vincom, trường liên cấp Vinschool hoặc biển hồ sóng nhân tạo' },
  ];

  // =========================================================================
  // MASTER PROMPT: ALL-IN-ONE SINGLE COPY COMMAND FOR AI
  // =========================================================================
  const masterPrompt = `# ==============================================================================
# PROMPT TỔNG HỢP: TỰ ĐỘNG HÓA QUY TRÌNH XUẤT BẢN TIN ĐĂNG BẤT ĐỘNG SẢN VŨ VIỆT HOME
# Dành cho: Claude Code / Cowork / Cursor / AI Automation Agent
# Dự án: ${projectData.projectName} | Căn: ${projectData.subdivision || 'Căn chuẩn'} | Giá: ${projectData.price}
# ==============================================================================

Bạn là Chuyên gia Tự Động Hóa Workflow Đăng Tin BĐS (AI Real Estate Automation Agent) tại Vũ Việt Home (VuVietHome.com.vn).
Nhiệm vụ của bạn là thực thi tuần tự 3 công việc sau đây bằng cách sử dụng các công cụ, API hoặc script tương ứng:

---
### 1/ TIÊU ĐỀ - NỘI DUNG TIN ĐĂNG: LƯU VÀO NOTION
Mục tiêu: Lưu trữ thông tin chi tiết và toàn văn nội dung tin đăng vào Database "Tin Đăng" của dự án "${projectData.projectName}" trên Notion.

1. Thông tin cấu hình Notion:
- Tên Database mục tiêu: "Tin Đăng - ${projectData.projectName}" (hoặc Database Tin Đăng dự án trên Notion của Vũ Việt Home)
- Trạng thái ban đầu: "Sẵn sàng đăng" (Ready to Publish)

2. Thuộc tính & Dữ liệu cần ghi vào Notion:
- Tiêu đề tin đăng (Title - ${currentTitle.length}/99 ký tự):
  "${currentTitle}"
- Dự án (Select): "${projectData.projectName}"
- Phân khu & Mã căn (Text): "${projectData.subdivision || 'Chưa định rõ'}"
- Loại hình BĐS (Select): "${projectData.propertyType || 'Liền kề'}"
- Diện tích (Number/Text): "${projectData.area || '56'} m²"
- Mức giá (Text): "${projectData.price || 'Thương lượng'}" ${projectData.pricePerM2 ? `(Đơn giá: ${projectData.pricePerM2})` : ''}
- Mặt tiền (Text): "${projectData.frontage || 'MT thoáng'}"
- Hướng nhà (Select/Text): "${projectData.orientation || 'Tây Bắc'}"
- Số tầng / DTSXD (Text): "${projectData.floors || 'Xây 5 tầng'}" ${projectData.constructionArea ? `(Tổng sàn: ${projectData.constructionArea})` : ''}
- Pháp lý (Text): "${projectData.legal || 'Sổ đỏ sẵn có sang tên ngay'}"
- Điểm nhấn & Tiện ích (Text): "${projectData.keyHighlights || 'Vị trí đắc địa kề cận công viên'}"
- Chuyên viên tư vấn (Text): "${projectData.contactName || 'Mr Việt'}" - SĐT: "${projectData.phone || '090.223.5050'}"
- Kênh đăng chính (Select): "Batdongsan.com.vn"
- Ngày tạo (Date): "${new Date().toLocaleDateString('vi-VN')}"

3. Toàn văn nội dung mô tả (Lưu vào thân trang Page Content của Notion dạng Block Paragraphs):
"""
${currentContent}
"""

---
### 2/ GỢI Ý HÌNH ẢNH & QUẢN LÝ GOOGLE DRIVE
Mục tiêu: Tạo folder ảnh đăng tin cho căn nhà, tìm kiếm và gom ảnh B-roll tương ứng, tạo ảnh Thumbnail chuẩn.

1. Cấu trúc danh mục gợi ý hình ảnh (Tổng cộng: ${photoList.length} ảnh):
[LƯU Ý: Chỉ liệt kê số lượng và nội dung văn bản cụ thể từng ảnh, KHÔNG vẽ ảnh minh họa]
${photoList.map((p) => `- Ảnh ${p.stt} (${p.name}): ${p.description}`).join('\n')}

2. Nhiệm vụ thực thi trên Google Drive:
- Bước 2.1: Truy cập vào folder "Đăng tin" của dự án "${projectData.projectName}" trên Google Drive.
- Bước 2.2: Tạo một folder mới với quy tắc đặt tên chuẩn:
  Tên folder: "${(projectData.subdivision || 'Can-Ho').replace(/[\s()-]+/g, '_')}_${projectData.area}m2_${projectData.propertyType.replace(/[\s/]+/g, '_')}_${new Date().toISOString().slice(0, 10)}"
- Bước 2.3: Tìm kiếm các hình ảnh phù hợp trong "Thư viện B-roll" của dự án (mặt tiền phân khu, công viên, tiện ích, trường học, hồ bơi/biển hồ).
- Bước 2.4: Sao chép (Copy) các ảnh tìm được về folder mới vừa tạo.
- Bước 2.5: Đổi tên các file ảnh chuẩn SEO theo cú pháp:
  "${projectData.projectName.replace(/\s+/g, '-')}-${(projectData.subdivision || 'Can-Ho').replace(/[\s()-]+/g, '-')}-${projectData.area}m2-[01-${photoList.length < 10 ? '0' + photoList.length : photoList.length}].jpg"
- Bước 2.6: Tạo ảnh Thumbnail: Chọn Ảnh 1 làm ảnh đại diện, kiểm tra dung lượng < 5MB, gắn watermark text mờ góc dưới:
  "VuVietHome.com.vn • Hotline ${projectData.phone}" (opacity 40%).
- Bước 2.7: Cập nhật đường link folder Drive vừa tạo vào thuộc tính "Link Thư Viện Ảnh" trên Notion.

---
### 3/ ĐĂNG TIN LÊN WEBSITE BATDONGSAN.COM.VN
Mục tiêu: Đăng tin bán bất động sản lên sàn Batdongsan.com.vn theo đúng chuẩn SEO và nhận diện thương hiệu.

1. BƯỚC BẮT BUỘC TRƯỚC KHI ĐĂNG TIN (BẮT BUỘC HỎI NGƯỜI DÙNG):
Trước khi thực hiện thao tác đăng tin, bạn PHẢI dừng lại và hỏi người dùng 3 câu hỏi sau:
  a. "Bạn muốn đăng bằng TÀI KHOẢN nào trên Batdongsan.com.vn? (Vui lòng nhập Email hoặc Số điện thoại đăng nhập)"
  b. "Bạn muốn chọn LOẠI TIN ĐĂNG nào cho căn này?
     - 1. VIP Kim Cương (Hiển thị đầu trang 1, tiếp cận tối đa)
     - 2. VIP Vàng (Vị trí top 2-15, tỷ lệ click cao)
     - 3. VIP Bạc (Tầng giữa, tối ưu ngân sách)
     - 4. Tin Thường (Duy trì hiện diện dài hạn)"
  c. "Bạn muốn đăng tin trong THỜI GIAN bao nhiêu ngày? (Ví dụ: 7 ngày, 10 ngày, 15 ngày, 30 ngày)"

2. THỰC THI ĐIỀN FORM ĐĂNG TIN SAU KHI CÓ XÁC NHẬN:
Sau khi người dùng phản hồi thông tin tài khoản và loại tin, hãy tiến hành điền form đăng tin trên website Batdongsan.com.vn:
- Loại BĐS: "${isShophouse ? 'Bán nhà mặt phố / Shophouse' : isLand ? 'Bán đất nền dự án' : 'Bán nhà biệt thự, liền kề'}"
- Địa chỉ: "${projectData.address || projectData.projectName}"
- Tên dự án chính thức: "${projectData.projectName}"
- Tiêu đề (Độ dài: ${currentTitle.length}/99 ký tự - Đạt chuẩn 90 đến 99 ký tự):
  "${currentTitle}"
- Nội dung mô tả (Chuẩn 1 màn hình laptop, đúng 5 cụm, SĐT xuất hiện đúng 2 lần ở dòng 3 và câu chốt):
"""
${currentContent}
"""
- Mức giá: ${projectData.price.replace(/[^\d.,]/g, '') || '7'} (Đơn vị: Tỷ)
- Diện tích: ${projectData.area || '56'} m²
- Mặt tiền: ${projectData.frontage ? projectData.frontage.replace(/[^\d.,]/g, '') : '4'} m
- Hướng nhà: "${projectData.orientation || 'Tây Bắc'}"
- Số phòng ngủ: ${projectData.bedrooms ? projectData.bedrooms.replace(/[^\d]/g, '') : '4'} | Số tầng: ${projectData.floors ? projectData.floors.replace(/[^\d]/g, '') : '5'}
- Pháp lý: "${projectData.legal || 'Sổ đỏ sẵn có sang tên ngay'}"
- Tải toàn bộ các ảnh từ folder Drive vừa chuẩn bị ở Phần 2 lên mục upload media.
- Thông tin người liên hệ: "${projectData.contactName || 'Mr Việt'}" - SĐT: "${projectData.phone || '090.223.5050'}".

3. HOÀN TẤT & PHẢN HỒI:
- Sau khi bấm Đăng Tin (hoặc Lưu Nháp thành công), lấy đường link URL bài đăng trên Batdongsan.com.vn.
- Cập nhật lại trên Notion:
  * Thuộc tính "Trạng thái" = "Đã xuất bản"
  * Thuộc tính "Link Tin Đăng" = [URL bài đăng trên Batdongsan.com.vn]
- Báo cáo kết quả trực quan cho người dùng kèm link bài đăng để kiểm tra.`.trim();

  // Individual sub-prompts
  const promptPart1 = `# 1/ TIÊU ĐỀ - NỘI DUNG TIN ĐĂNG: LƯU VÀO NOTION
Mục tiêu: Lưu trữ vào Database "Tin Đăng" của dự án "${projectData.projectName}" trên Notion.

- Tiêu đề tin đăng: "${currentTitle}" (${currentTitle.length}/99 ký tự)
- Dự án: "${projectData.projectName}"
- Phân khu / Mã căn: "${projectData.subdivision || ''}"
- Loại hình: "${projectData.propertyType || 'Liền kề'}"
- Diện tích: "${projectData.area || '56'} m²"
- Giá bán: "${projectData.price}" ${projectData.pricePerM2 ? `(${projectData.pricePerM2})` : ''}
- Mặt tiền: "${projectData.frontage || 'MT thoáng'}" | Hướng: "${projectData.orientation || 'Tây Bắc'}" | Số tầng: "${projectData.floors || '5 tầng'}"
- Pháp lý: "${projectData.legal || 'Sổ đỏ sẵn có'}"
- Môi giới phụ trách: "${projectData.contactName}" - SĐT: "${projectData.phone}"
- Trạng thái: "Sẵn sàng đăng"

Nội dung mô tả chi tiết:
"""
${currentContent}
"""`.trim();

  const promptPart2 = `# 2/ GỢI Ý HÌNH ẢNH & THƯ VIỆN B-ROLL DRIVE
Mục tiêu: Tạo folder ảnh đăng tin trong folder dự án trên Drive, gom ảnh B-roll và tạo Thumbnail.

Cấu trúc ${photoList.length} ảnh cần có (Chỉ mô tả văn bản số lượng & nội dung, KHÔNG vẽ ảnh minh họa):
${photoList.map((p) => `- Ảnh ${p.stt} (${p.name}): ${p.description}`).join('\n')}

Hành động trên Drive:
1. Vào folder "Đăng tin" của dự án "${projectData.projectName}".
2. Tạo folder mới: "${(projectData.subdivision || 'Can-Ho').replace(/[\s()-]+/g, '_')}_${projectData.area}m2_${new Date().toISOString().slice(0, 10)}"
3. Tìm các ảnh tương ứng trong thư viện B-roll của dự án và copy về folder mới.
4. Đổi tên file chuẩn SEO: "${projectData.projectName.replace(/\s+/g, '-')}-${projectData.area}m2-[01-${photoList.length < 10 ? '0' + photoList.length : photoList.length}].jpg"
5. Tạo ảnh Thumbnail từ Ảnh 1, kiểm tra dung lượng < 5MB, gắn watermark "VuVietHome.com.vn • ${projectData.phone}".`.trim();

  const promptPart3 = `# 3/ ĐĂNG TIN LÊN WEBSITE BATDONGSAN.COM.VN
Mục tiêu: Đăng tin lên website Batdongsan.com.vn theo chuẩn SEO Vũ Việt Home.

BƯỚC 1: HỎI NGƯỜI DÙNG TRƯỚC KHI ĐĂNG TIN (BẮT BUỘC):
Hãy dừng lại và hỏi người dùng:
1. "Bạn muốn đăng bằng TÀI KHOẢN nào trên Batdongsan.com.vn? (Email hoặc SĐT)"
2. "Bạn chọn LOẠI TIN ĐĂNG nào? (VIP Kim Cương / VIP Vàng / VIP Bạc / Tin Thường)"
3. "Thời gian hiển thị bao nhiêu ngày? (Ví dụ: 7, 10, 15, 30 ngày)"

BƯỚC 2: ĐIỀN FORM SAU KHI CÓ XÁC NHẬN:
- Loại BĐS: "${isShophouse ? 'Bán nhà mặt phố / Shophouse' : isLand ? 'Bán đất nền dự án' : 'Bán nhà biệt thự, liền kề'}"
- Dự án: "${projectData.projectName}"
- Tiêu đề (90 - 99 ký tự): "${currentTitle}"
- Mô tả (chuẩn 1 màn hình laptop, SĐT xuất hiện đúng 2 lần):
"""
${currentContent}
"""
- Giá: ${projectData.price.replace(/[^\d.,]/g, '') || '7'} Tỷ | Diện tích: ${projectData.area || '56'} m² | Mặt tiền: ${projectData.frontage ? projectData.frontage.replace(/[^\d.,]/g, '') : '4'} m
- Tải toàn bộ ảnh từ folder vừa tạo lên.
- Liên hệ: ${projectData.contactName} - SĐT: ${projectData.phone}.
- Đăng xong cập nhật lại Notion thành "Đã xuất bản".`.trim();

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="bg-[#1B3A2D] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-[#2C5E4A] space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#FF6B35] uppercase tracking-widest mb-1">
              <Bot className="w-4 h-4" />
              <span>AI Automation Master Prompt &bull; Xuất Bản Đa Nền Tảng</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif-brand text-white">
              III. XUẤT BẢN: PROMPT TỔNG HỢP CHO AI
            </h2>
            <p className="text-xs sm:text-sm text-[#FBFAF5]/80 mt-1 max-w-2xl leading-relaxed">
              Toàn bộ dữ liệu của căn nhà đã được tự động điền sẵn vào Prompt tổng hợp. Chỉ cần <strong>1 lệnh copy</strong> gửi cho Claude Code, Cowork hoặc Cursor để thực thi tuần tự từ Notion, Google Drive đến đăng tin Batdongsan.com.vn.
            </p>
          </div>

          {/* Master 1-Click Copy Button */}
          <div className="shrink-0">
            <button
              type="button"
              onClick={() => handleCopy(masterPrompt, 'master-prompt')}
              className="w-full sm:w-auto px-7 py-4 bg-[#C95928] hover:bg-[#A8471F] text-white font-bold text-sm sm:text-base rounded-2xl transition-all shadow-xl shadow-[#C95928]/30 flex items-center justify-center gap-2.5 cursor-pointer ring-2 ring-white/20 hover:scale-[1.02] active:scale-[0.98]"
            >
              {copiedKey === 'master-prompt' ? (
                <>
                  <Check className="w-5 h-5 text-white" />
                  <span>ĐÃ SAO CHÉP PROMPT TỔNG!</span>
                </>
              ) : (
                <>
                  <Copy className="w-5 h-5" />
                  <span>SAO CHÉP TOÀN BỘ PROMPT (1-CLICK)</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* 3 Step Instruction Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3 border-t border-[#2C5E4A]/80 text-xs">
          <div className="bg-[#152E24] p-3 rounded-xl border border-[#2C5E4A] flex items-center gap-2.5">
            <span className="w-6 h-6 rounded-lg bg-[#C95928] text-white font-bold flex items-center justify-center shrink-0">1</span>
            <span className="text-[#FBFAF5]"><strong>Lưu Notion:</strong> Tự lưu vào DB Tin Đăng của dự án</span>
          </div>
          <div className="bg-[#152E24] p-3 rounded-xl border border-[#2C5E4A] flex items-center gap-2.5">
            <span className="w-6 h-6 rounded-lg bg-[#2C5E4A] text-white font-bold flex items-center justify-center shrink-0">2</span>
            <span className="text-[#FBFAF5]"><strong>Thư viện ảnh Drive:</strong> Tạo folder, gom B-roll &amp; Thumbnail</span>
          </div>
          <div className="bg-[#152E24] p-3 rounded-xl border border-[#2C5E4A] flex items-center gap-2.5">
            <span className="w-6 h-6 rounded-lg bg-emerald-700 text-white font-bold flex items-center justify-center shrink-0">3</span>
            <span className="text-[#FBFAF5]"><strong>Đăng Batdongsan:</strong> Hỏi tài khoản &amp; gói VIP trước khi đăng</span>
          </div>
        </div>
      </div>

      {/* Summary of pre-populated listing data */}
      <div className="bg-white border border-[#E5E0D3] rounded-3xl p-5 sm:p-6 shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-[#E5E0D3] pb-2.5">
          <span className="text-xs font-bold text-[#1B3A2D] uppercase tracking-wider flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Dữ Liệu Đã Nạp Tự Động Vào Prompt:
          </span>
          <span className="text-xs font-mono font-bold text-[#C95928] bg-[#C95928]/10 px-2.5 py-0.5 rounded-full">
            {currentTitle.length}/99 Ký Tự Tiêu Đề
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
          <div className="p-2.5 bg-[#FBFAF5] rounded-xl border border-[#E5E0D3]">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Dự án</span>
            <strong className="text-[#1B3A2D] truncate block">{projectData.projectName}</strong>
          </div>
          <div className="p-2.5 bg-[#FBFAF5] rounded-xl border border-[#E5E0D3]">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Phân khu / Căn</span>
            <strong className="text-[#1B3A2D] truncate block">{projectData.subdivision || 'Chưa định rõ'}</strong>
          </div>
          <div className="p-2.5 bg-[#FBFAF5] rounded-xl border border-[#E5E0D3]">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Loại hình</span>
            <strong className="text-[#1B3A2D] truncate block">{projectData.propertyType}</strong>
          </div>
          <div className="p-2.5 bg-[#FBFAF5] rounded-xl border border-[#E5E0D3]">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Giá bán</span>
            <strong className="text-[#C95928] truncate block">{projectData.price}</strong>
          </div>
          <div className="p-2.5 bg-[#FBFAF5] rounded-xl border border-[#E5E0D3]">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Diện tích &amp; MT</span>
            <strong className="text-[#1B3A2D] truncate block">{projectData.area} m² ({projectData.frontage || 'MT thoáng'})</strong>
          </div>
          <div className="p-2.5 bg-[#FBFAF5] rounded-xl border border-[#E5E0D3]">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Môi giới &amp; SĐT</span>
            <strong className="text-[#1B3A2D] truncate block">{projectData.contactName} - {projectData.phone}</strong>
          </div>
        </div>
      </div>

      {/* Subtab navigation to view full master prompt or individual sections */}
      <div className="bg-white border border-[#E5E0D3] rounded-2xl p-2 flex flex-wrap gap-2 shadow-sm">
        <button
          type="button"
          onClick={() => setActiveTab('all_in_one')}
          className={`flex-1 min-w-[200px] py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'all_in_one'
              ? 'bg-[#1B3A2D] text-white shadow-md ring-1 ring-[#C95928]/40'
              : 'text-[#333333]/70 hover:text-[#1B3A2D] hover:bg-[#F5F2E9]'
          }`}
        >
          <Sparkles className="w-4 h-4 text-[#FF6B35]" />
          <span>PROMPT TỔNG HỢP (TẤT CẢ TRONG 1)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('part1_notion')}
          className={`flex-1 min-w-[170px] py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'part1_notion'
              ? 'bg-[#1B3A2D] text-white shadow-md'
              : 'text-[#333333]/70 hover:text-[#1B3A2D] hover:bg-[#F5F2E9]'
          }`}
        >
          <Database className="w-4 h-4 text-[#C95928]" />
          <span>1. Lưu Notion Database</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('part2_drive')}
          className={`flex-1 min-w-[170px] py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'part2_drive'
              ? 'bg-[#1B3A2D] text-white shadow-md'
              : 'text-[#333333]/70 hover:text-[#1B3A2D] hover:bg-[#F5F2E9]'
          }`}
        >
          <ImageIcon className="w-4 h-4 text-[#C95928]" />
          <span>2. Thư Viện Ảnh Drive</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('part3_batdongsan')}
          className={`flex-1 min-w-[190px] py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'part3_batdongsan'
              ? 'bg-[#1B3A2D] text-white shadow-md'
              : 'text-[#333333]/70 hover:text-[#1B3A2D] hover:bg-[#F5F2E9]'
          }`}
        >
          <Laptop className="w-4 h-4 text-[#C95928]" />
          <span>3. Đăng Batdongsan.com.vn</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('payload_json')}
          className={`flex-1 min-w-[140px] py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'payload_json'
              ? 'bg-[#1B3A2D] text-white shadow-md'
              : 'text-[#333333]/70 hover:text-[#1B3A2D] hover:bg-[#F5F2E9]'
          }`}
        >
          <Code className="w-4 h-4 text-[#C95928]" />
          <span>Payload JSON</span>
        </button>
      </div>

      {/* Main Prompt Display Container */}
      <div className="bg-white border border-[#E5E0D3] rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
        {/* TAB 1: ALL IN ONE MASTER PROMPT */}
        {activeTab === 'all_in_one' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E5E0D3] pb-3">
              <div>
                <h3 className="text-lg font-bold font-serif-brand text-[#1B3A2D] flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#C95928]" />
                  Prompt Tổng Hợp: Tự Động Hóa 3 Bước (Notion &rarr; Drive &rarr; Batdongsan.com.vn)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Đã tự động điền đủ thông số của căn nhà. Bấm nút sao chép và dán vào Claude Code / Cowork / Cursor.
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleCopy(masterPrompt, 'master-tab')}
                className="px-5 py-2.5 bg-[#C95928] hover:bg-[#A8471F] text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer shrink-0"
              >
                {copiedKey === 'master-tab' ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Đã sao chép!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Sao Chép Prompt Tổng</span>
                  </>
                )}
              </button>
            </div>

            <div className="p-3.5 bg-amber-50/80 rounded-2xl border border-amber-200 text-xs text-amber-950 space-y-1 leading-relaxed">
              <div className="font-bold flex items-center gap-1.5 text-amber-900">
                <Zap className="w-4 h-4 text-amber-600" />
                <span>Quy trình AI sẽ thực thi sau khi nhận prompt này:</span>
              </div>
              <ul className="list-disc list-inside space-y-1 pl-1 text-[11px] sm:text-xs">
                <li><strong>Mục 1:</strong> AI lưu dữ liệu vào database <em>Tin Đăng</em> của dự án <strong>{projectData.projectName}</strong> trên Notion.</li>
                <li><strong>Mục 2:</strong> AI tạo folder Drive mới, tìm ảnh B-roll và chuẩn hóa {photoList.length} ảnh (chỉ danh sách văn bản, không vẽ ảnh minh họa).</li>
                <li><strong>Mục 3:</strong> Trước khi đăng web, AI sẽ <strong>dừng lại hỏi tài khoản &amp; loại tin VIP</strong>, sau đó mới điền form Batdongsan.com.vn.</li>
              </ul>
            </div>

            <pre className="bg-[#152E24] text-[#FBFAF5] p-5 sm:p-6 rounded-2xl text-xs font-mono leading-relaxed overflow-x-auto whitespace-pre-wrap max-h-[580px] shadow-inner select-all">
              {masterPrompt}
            </pre>
          </div>
        )}

        {/* TAB 2: PART 1 NOTION */}
        {activeTab === 'part1_notion' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E5E0D3] pb-3">
              <div>
                <h3 className="text-lg font-bold font-serif-brand text-[#1B3A2D] flex items-center gap-2">
                  <Database className="w-5 h-5 text-[#C95928]" />
                  Phần 1: Prompt Lưu Trữ Vào Database Tin Đăng Trên Notion
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Chỉ gồm phần hướng dẫn AI lưu dữ liệu căn nhà vào Database Notion dự án {projectData.projectName}.
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleCopy(promptPart1, 'part1')}
                className="px-4 py-2 bg-[#1B3A2D] hover:bg-[#2C5E4A] text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                {copiedKey === 'part1' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>Copy Phần 1</span>
              </button>
            </div>

            <pre className="bg-[#152E24] text-[#FBFAF5] p-5 rounded-2xl text-xs font-mono leading-relaxed overflow-x-auto whitespace-pre-wrap max-h-[500px]">
              {promptPart1}
            </pre>
          </div>
        )}

        {/* TAB 3: PART 2 DRIVE PHOTO PIPELINE */}
        {activeTab === 'part2_drive' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E5E0D3] pb-3">
              <div>
                <h3 className="text-lg font-bold font-serif-brand text-[#1B3A2D] flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-[#C95928]" />
                  Phần 2: Prompt Tạo Folder Drive, Gom Ảnh B-roll &amp; Thumbnail
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Liệt kê cụ thể {photoList.length} ảnh cần có (dạng văn bản danh sách, không vẽ ảnh minh họa).
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleCopy(promptPart2, 'part2')}
                className="px-4 py-2 bg-[#1B3A2D] hover:bg-[#2C5E4A] text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                {copiedKey === 'part2' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>Copy Phần 2</span>
              </button>
            </div>

            {/* List of Photos preview */}
            <div className="bg-[#FBFAF5] p-4 rounded-2xl border border-[#E5E0D3] space-y-2">
              <span className="text-xs font-bold text-[#1B3A2D] uppercase tracking-wider block">
                Danh Sách {photoList.length} Ảnh Đăng Tin Chuẩn Sàn Batdongsan:
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                {photoList.map((p) => (
                  <div key={p.stt} className="p-2.5 bg-white rounded-xl border border-[#E5E0D3] flex items-start gap-2">
                    <span className="w-5 h-5 rounded-md bg-[#1B3A2D] text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                      {p.stt}
                    </span>
                    <div>
                      <strong className="text-[#1B3A2D] block">{p.name}</strong>
                      <span className="text-slate-500 text-[11px] leading-tight block">{p.description}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <pre className="bg-[#152E24] text-[#FBFAF5] p-5 rounded-2xl text-xs font-mono leading-relaxed overflow-x-auto whitespace-pre-wrap max-h-[500px]">
              {promptPart2}
            </pre>
          </div>
        )}

        {/* TAB 4: PART 3 BATDONGSAN AUTOMATION */}
        {activeTab === 'part3_batdongsan' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E5E0D3] pb-3">
              <div>
                <h3 className="text-lg font-bold font-serif-brand text-[#1B3A2D] flex items-center gap-2">
                  <Laptop className="w-5 h-5 text-[#C95928]" />
                  Phần 3: Prompt Đăng Web Batdongsan.com.vn (Hỏi Tài Khoản &amp; Loại Tin)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Quy định AI bắt buộc phải hỏi người dùng tài khoản và gói VIP trước khi tiến hành điền form.
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleCopy(promptPart3, 'part3')}
                className="px-4 py-2 bg-[#1B3A2D] hover:bg-[#2C5E4A] text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                {copiedKey === 'part3' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>Copy Phần 3</span>
              </button>
            </div>

            <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900 leading-relaxed flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <strong>Cơ chế an toàn:</strong> AI sẽ không tự ý đăng tin ngay mà phải đợi bạn phản hồi tài khoản đăng nhập (SĐT/Email), loại tin (Kim Cương / Vàng / Bạc / Thường) và số ngày hiển thị mong muốn.
              </div>
            </div>

            <pre className="bg-[#152E24] text-[#FBFAF5] p-5 rounded-2xl text-xs font-mono leading-relaxed overflow-x-auto whitespace-pre-wrap max-h-[500px]">
              {promptPart3}
            </pre>
          </div>
        )}

        {/* TAB 5: PAYLOAD JSON */}
        {activeTab === 'payload_json' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E5E0D3] pb-3">
              <div>
                <h3 className="text-lg font-bold font-serif-brand text-[#1B3A2D] flex items-center gap-2">
                  <Code className="w-5 h-5 text-[#C95928]" />
                  Cấu Trúc JSON Payload Đầy Đủ
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Sử dụng cho lập trình viên, webhook hoặc script tự động hóa tùy chỉnh.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  handleCopy(
                    JSON.stringify(
                      {
                        brand: 'VuVietHome',
                        website: 'VuVietHome.com.vn',
                        project: {
                          name: projectData.projectName,
                          subdivision: projectData.subdivision,
                          propertyType: projectData.propertyType,
                          price: projectData.price,
                          pricePerM2: projectData.pricePerM2,
                          area: projectData.area,
                          frontage: projectData.frontage,
                          orientation: projectData.orientation,
                          floors: projectData.floors,
                          legal: projectData.legal,
                          address: projectData.address,
                        },
                        listingContent: {
                          titleStrict99: currentTitle,
                          titleLength: currentTitle.length,
                          description: currentContent,
                          contact: {
                            name: projectData.contactName,
                            phone: projectData.phone,
                          },
                        },
                        photoLibrary: {
                          totalCount: photoList.length,
                          photos: photoList,
                        },
                        publishingRules: {
                          notionDatabase: `Tin Đăng - ${projectData.projectName}`,
                          targetPlatform: 'batdongsan.com.vn',
                          askUserBeforePublish: ['account', 'vip_tier', 'duration_days'],
                        },
                      },
                      null,
                      2
                    ),
                    'json'
                  )
                }
                className="px-4 py-2 bg-[#1B3A2D] hover:bg-[#2C5E4A] text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                {copiedKey === 'json' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>Copy JSON</span>
              </button>
            </div>

            <pre className="bg-[#152E24] text-[#FBFAF5] p-5 rounded-2xl text-xs font-mono leading-relaxed overflow-x-auto whitespace-pre-wrap max-h-[500px]">
              {JSON.stringify(
                {
                  brand: 'VuVietHome',
                  website: 'VuVietHome.com.vn',
                  project: {
                    name: projectData.projectName,
                    subdivision: projectData.subdivision,
                    propertyType: projectData.propertyType,
                    price: projectData.price,
                    pricePerM2: projectData.pricePerM2,
                    area: projectData.area,
                    frontage: projectData.frontage,
                    orientation: projectData.orientation,
                    floors: projectData.floors,
                    legal: projectData.legal,
                    address: projectData.address,
                  },
                  listingContent: {
                    titleStrict99: currentTitle,
                    titleLength: currentTitle.length,
                    description: currentContent,
                    contact: {
                      name: projectData.contactName,
                      phone: projectData.phone,
                    },
                  },
                  photoLibrary: {
                    totalCount: photoList.length,
                    photos: photoList,
                  },
                  publishingRules: {
                    notionDatabase: `Tin Đăng - ${projectData.projectName}`,
                    targetPlatform: 'batdongsan.com.vn',
                    askUserBeforePublish: ['account', 'vip_tier', 'duration_days'],
                  },
                },
                null,
                2
              )}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
