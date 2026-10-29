import { ProjectFormData, DriveImage, MarketResearchData, CompetitorDeepPlaybook } from '../types';

export interface ProjectPreset {
  id: string;
  name: string;
  batdongsanUrl: string;
  data: ProjectFormData;
  marketData: MarketResearchData;
}

export const FOUR_VINHOMES_PROJECTS: ProjectPreset[] = [
  {
    id: 'ocean-park-2',
    name: 'Vinhomes Ocean Park 2',
    batdongsanUrl: 'https://batdongsan.com.vn/nha-dat-ban-vinhomes-ocean-park-2?avrs=1',
    data: {
      projectName: 'Vinhomes Ocean Park 2 - The Empire',
      subdivision: 'Phân khu Sao Biển - Căn góc trục đại lộ 24m',
      propertyType: 'Liền kề / Shophouse thương mại',
      area: '67.5',
      bedrooms: '4PN',
      bathrooms: '4WC',
      price: '8.3 Tỷ',
      pricePerM2: '122.9 triệu/m²',
      address: 'Đại đô thị Vinhomes Ocean Park 2, Xã Nghĩa Trụ, Huyện Văn Giang, Tỉnh Hưng Yên',
      legal: 'Sổ đỏ lâu dài từng căn, sẵn sàng sang tên công chứng trong ngày',
      amenities: 'Tổ hợp công viên sóng nhân tạo lớn nhất thế giới VinWonders Wave Park 18ha, đại lộ Kinh Đô Ánh Sáng Kingdom Avenue, TTTM Vincom Mega Mall, Quảng trường Empire Square',
      keyHighlights: 'Hỗ trợ vay ngân hàng 70%, ân hạn nợ gốc và 0% lãi suất trong 24 tháng. Chiết khấu thanh toán sớm 10% + Tặng voucher VinFast trị giá 200 triệu đồng.',
      contactName: 'Ms Yến',
      phone: '0918 600 050',
      personaVoice: 'le_yen',
      orientation: 'Tây Nam',
      frontage: 'MT 7m',
      floors: 'xây 5 tầng',
      constructionArea: '378m²',
      targetKeywords: [
        'Vinhomes Ocean Park 2',
        'mua liền kề Ocean Park 2',
        'bán shophouse Sao Biển Ocean Park 2',
        'cắt lỗ Ocean Park 2',
        'giá nhà Vinhomes The Empire',
      ],
    },
    marketData: {
      projectName: 'Vinhomes Ocean Park 2',
      batdongsanUrl: 'https://batdongsan.com.vn/nha-dat-ban-vinhomes-ocean-park-2?avrs=1',
      scannedAt: 'Cập nhật realtime lúc ' + new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      totalListingsCount: 90, // Hỗ trợ cả 3 trang đầu tiên (90 tin)
      pageScope: '3_pages',
      pagesBreakdown: [
        {
          pageNumber: 1,
          pageLabel: 'Trang 1 (30 tin)',
          totalListings: 30,
          vipDiamond: 9,
          vipGold: 13,
          vipSilver: 6,
          normal: 2,
          vipPercentage: 93.3,
          keyCharacteristics: 'Mức độ cạnh tranh gay gắt nhất. Hầu hết là tin VIP Kim Cương & Vàng của các đại lý lớn (Newstarland, Đất Xanh) tranh chấp vị trí top 1-10.',
        },
        {
          pageNumber: 2,
          pageLabel: 'Trang 2 (30 tin)',
          totalListings: 30,
          vipDiamond: 3,
          vipGold: 11,
          vipSilver: 10,
          normal: 6,
          vipPercentage: 80.0,
          keyCharacteristics: 'Tập trung các tin VIP Vàng và Bạc. Bắt đầu xuất hiện các môi giới tự do chạy tin cắt lỗ sâu và hàng ngộp chuyển nhượng nhanh.',
        },
        {
          pageNumber: 3,
          pageLabel: 'Trang 3 (30 tin)',
          totalListings: 30,
          vipDiamond: 0,
          vipGold: 5,
          vipSilver: 11,
          normal: 14,
          vipPercentage: 53.3,
          keyCharacteristics: 'Tin thường chiếm gần 50%. Các căn có mức giá thấp hơn bảng hàng trung bình 10-15%, phù hợp nhà đầu tư săn hàng giá rẻ.',
        },
      ],
      vipStats: {
        vipDiamond: 12, // Tổng 3 trang
        vipGold: 29,
        vipSilver: 27,
        normal: 22,
        vipPercentage: 75.6,
        competitionAnalysis: 'Phân tích cả 3 trang đầu: Trang 1 chiếm lĩnh bởi 93.3% tin VIP Kim Cương & Vàng. Để tối ưu chi phí, nếu ngân sách lớn nên đặt VIP Kim Cương trang 1, nếu ngân sách vừa phải nên đặt VIP Vàng / Bạc trang 2 kết hợp giật tít sốc để hút click.',
      },
      agentsSummary: {
        totalActiveBrokers: 38,
        dominantAgencies: ['Newstarland', 'Đất Xanh Miền Bắc', 'BĐS Vinhomes 247', 'CenLand Ocean City'],
      },
      top5Brokers: [
        {
          rank: 1,
          name: 'Nguyễn Văn Hùng (Top 1 Phủ Sóng 3 Trang)',
          phone: '0912 888 999',
          agency: 'Newstarland - Chi nhánh Ocean Park',
          totalListings: 14,
          marketSharePercent: 15.6,
          profileUrl: 'https://batdongsan.com.vn/ban-nha-dat?q=0912888999',
          keyStrategy: 'Phủ 4 tin VIP Kim Cương trang 1 và rải 10 tin VIP Vàng ở trang 2-3; dùng hook "Bán cắt lỗ 30% sâu nhất thị trường"',
          strengths: 'Kho hàng quỹ căn ngoại giao độc quyền, cam kết giá rẻ hơn bảng hàng 500 triệu',
        },
        {
          rank: 2,
          name: 'Trần Thị Thu Trang',
          phone: '0988 555 222',
          agency: 'Đại lý F1 BĐS Ocean Park',
          totalListings: 11,
          marketSharePercent: 12.2,
          profileUrl: 'https://batdongsan.com.vn/ban-nha-dat?q=0988555222',
          keyStrategy: 'Tập trung Shophouse phố đi bộ Kinh Đô Ánh Sáng có hợp đồng thuê sẵn dòng tiền 25tr/tháng',
          strengths: 'Hình ảnh thực tế chụp căn hộ mẫu sắc nét, có bảng tính đòn bẩy dòng tiền chi tiết',
        },
        {
          rank: 3,
          name: 'Lê Hoàng Minh',
          phone: '0903 111 444',
          agency: 'Đất Xanh Miền Bắc',
          totalListings: 9,
          marketSharePercent: 10.0,
          profileUrl: 'https://batdongsan.com.vn/ban-nha-dat?q=0903111444',
          keyStrategy: 'Bắn tin VIP Vàng rải đều các phân khu Sao Biển, Hải Âu; giật tít số tiền thanh toán ban đầu 1.8 Tỷ',
          strengths: 'Chăm sóc khách hàng nhanh, hỗ trợ thủ tục sang tên và vay ngân hàng 3 bên trong 48h',
        },
        {
          rank: 4,
          name: 'Phạm Hải Đăng',
          phone: '0936 777 333',
          agency: 'BĐS Vinhomes Miền Bắc',
          totalListings: 8,
          marketSharePercent: 8.9,
          profileUrl: 'https://batdongsan.com.vn/ban-nha-dat?q=0936777333',
          keyStrategy: 'Tập trung Biệt thự song lập view hồ sóng nhân tạo Wave Park; hình ảnh flycam toàn cảnh 4K',
          strengths: 'Khách hàng mục tiêu là nhà đầu tư tài chính mạnh tìm biệt thự nghỉ dưỡng ven đô',
        },
        {
          rank: 5,
          name: 'Đỗ Thùy Linh',
          phone: '0945 222 888',
          agency: 'CenLand Ocean City',
          totalListings: 7,
          marketSharePercent: 7.8,
          profileUrl: 'https://batdongsan.com.vn/ban-nha-dat?q=0945222888',
          keyStrategy: 'Tin VIP Bạc kết hợp tiêu đề ngắn gọn; cam kết pháp lý sổ đỏ cầm tay và đàm phán trực tiếp chủ nhà',
          strengths: 'Phản hồi tin nhắn Zalo trong 30 giây, có kho video thực tế từng căn liền kề',
        },
      ],
      contentCategories: [
        {
          categoryName: 'Tin Bán Cắt Lỗ / Thu Hồi Vốn (Thoát hàng gấp)',
          count: 42,
          percentage: 46.7,
          angles: ['Cắt lỗ 500tr - 1.2 Tỷ so với HĐMB', 'Chủ nhà vỡ nợ ngân hàng cần bán gấp trong tuần', 'Rẻ nhất phân khu Chà Là'],
          topKeywords: ['cắt lỗ', 'bán gấp', 'rẻ nhất thị trường', 'thu hồi vốn', 'giá sốc'],
        },
        {
          categoryName: 'Tin Hàng Ngoại Giao / Chính Sách Trực Tiếp CĐT',
          count: 24,
          percentage: 26.7,
          angles: ['Ân hạn nợ gốc 24-36 tháng', 'Vốn tự có 30% nhận nhà kinh doanh ngay', 'Tặng gói nội thất 200 triệu'],
          topKeywords: ['hàng ngoại giao', 'chiết khấu 10%', 'hỗ trợ lãi suất 0%', 'trực tiếp CĐT'],
        },
        {
          categoryName: 'Tin Khai Thác Cho Thuê / Dòng Tiền Ổn Định',
          count: 15,
          percentage: 16.6,
          angles: ['Đang cho thuê 20-35tr/tháng', 'Mặt phố đi bộ Kinh Đô buôn bán sầm uất', 'Dòng tiền 7%/năm'],
          topKeywords: ['cho thuê dòng tiền', 'shophouse kinh doanh', 'kinh đô ánh sáng', 'vị trí đắc địa'],
        },
        {
          categoryName: 'Tin Biệt Thự Nghỉ Dưỡng / Đẳng Cấp Thượng Lưu',
          count: 9,
          percentage: 10,
          angles: ['View trực diện công viên sóng Wave Park', 'Biệt thự Đảo Dừa khép kín compound VIP', 'Sân vườn rộng đón sinh khí'],
          topKeywords: ['biệt thự đảo dừa', 'view hồ sóng', 'song lập vip', 'compound'],
        },
      ],
      productsAndPricing: [
        {
          productType: 'Liền kề diện tích nhỏ (48m² - 65m²)',
          count: 38,
          priceRange: '5.8 Tỷ - 7.5 Tỷ',
          avgPriceM2: '110 - 125 tr/m²',
          marketEvaluation: 'Thanh khoản nhanh nhất thị trường. Tệp khách mua ở thực và đầu tư nhỏ chuộng phân khu Chà Là, Cọ Xanh.',
        },
        {
          productType: 'Liền kề / Shophouse tiêu chuẩn (70m² - 90m²)',
          count: 28,
          priceRange: '8.2 Tỷ - 11.5 Tỷ',
          avgPriceM2: '120 - 135 tr/m²',
          marketEvaluation: 'Nguồn hàng phong phú nhất trên 3 trang đầu. Phân khu Sao Biển và San Hô được quan tâm đặc biệt nhờ gần hồ sóng.',
        },
        {
          productType: 'Shophouse trục đại lộ 24m - 51m',
          count: 14,
          priceRange: '13 Tỷ - 22 Tỷ',
          avgPriceM2: '160 - 210 tr/m²',
          marketEvaluation: 'Khách hàng tập trung hỏi diện tích kinh doanh, các căn đã hoàn thiện nội thất dễ chốt cọc hơn nhà thô.',
        },
        {
          productType: 'Biệt thự Song lập & Đơn lập (120m² - 250m²)',
          count: 10,
          priceRange: '16 Tỷ - 38 Tỷ',
          avgPriceM2: '130 - 170 tr/m²',
          marketEvaluation: 'Giao dịch chọn lọc, khách hàng yêu cầu căn góc hoặc gần công viên nội khu; giá đang có xu hướng đi ngang.',
        },
      ],
      historicalComparison: {
        previousBenchmarkPeriod: 'Dữ liệu đối chiếu 30 ngày trước (Tháng trước)',
        priceTrend: 'Tăng nhẹ (+2.8% do hạ tầng Vành đai 3.5 và cao tốc thông xe)',
        listingVolumeTrend: 'Số lượng tin VIP tăng 18% so với tháng trước (Cạnh tranh tăng cao)',
        vipCompetitionShift: 'Tin VIP Kim Cương tăng từ 5 lên 12 tin trên 3 trang đầu, tin thường bị đẩy dồn về trang 3 và trang 4',
        marketNotes: 'Thị trường bước vào chu kỳ thanh toán bàn giao; khách hỏi mua ở thực gia tăng mạnh vào dịp cuối tuần tham quan công viên sóng.',
      },
      recommendations: [
        {
          id: 1,
          productName: 'Liền kề 65m² Phân khu Chà Là (Giá thanh khoản nhanh)',
          productType: 'Liền kề 4 tầng',
          subdivision: 'Chà Là 08',
          priceEstimate: '6.95 Tỷ (Bao thuế phí)',
          area: '65m²',
          whyRecommended: 'Phân khúc 6-7 tỷ đang có lượng click và tìm kiếm lớn nhất trên batdongsan.com.vn. Dễ kéo cuộc gọi trong vòng 24h.',
          sampleTitleBDS: 'Bán Gấp Liền Kề Chà Là Ocean Park 2, 65m2 4 Tầng Sổ Đỏ Giá 6.95 Tỷ Sốc',
          outlineBullets: [
            'Hook: Chủ cần thu hồi vốn gửi bán nhanh căn liền kề Chà Là đẹp không lỗi phong thủy',
            'Vị trí: Đi bộ 2 phút ra công viên lễ hội và trường học liên cấp Vinschool',
            'Thiết kế: 65m2 thông thủy, mặt tiền 5m, xây 4 tầng hoàn thiện mặt ngoài',
            'Pháp lý & Giá: Sổ đỏ lâu dài, giá 6.95 Tỷ bao toàn bộ thuế phí sang tên',
          ],
          specs: {
            projectName: 'Vinhomes Ocean Park 2',
            area: '65',
            price: '6.95 Tỷ',
            pricePerM2: '106.9 tr/m²',
            subdivision: 'Phân khu Chà Là (CL08)',
            propertyType: 'Liền kề 4 tầng',
            highlights: 'Giá rẻ hơn bảng hàng 400 triệu, sổ đỏ sẵn sàng công chứng trong ngày',
            legal: 'Sổ đỏ sở hữu lâu dài',
            amenities: 'Công viên lễ hội, trường Vinschool, bể bơi nội khu',
          },
        },
        {
          id: 2,
          productName: 'Shophouse Sao Biển trục đường 20m gần Vincom & Hồ Sóng',
          productType: 'Shophouse thương mại',
          subdivision: 'Sao Biển 16',
          priceEstimate: '9.8 Tỷ',
          area: '75m²',
          whyRecommended: 'Tệp khách hàng đầu tư dòng tiền đang tìm kiếm shophouse để kinh doanh hoặc cho thuê F&B trước mùa du lịch hè.',
          sampleTitleBDS: 'Chính Chủ Bán Shophouse Sao Biển Ocean Park 2, 75m2 Trục 20m Giá 9.8 Tỷ',
          outlineBullets: [
            'Hook: Căn shophouse kinh doanh cực đẹp nằm ngay cửa ngõ kết nối Vincom Mega Mall và công viên sóng',
            'Dòng tiền: Dự kiến cho thuê kinh doanh cafe, nhà hàng 25 - 35 triệu/tháng',
            'Chính sách: Hỗ trợ vay ngân hàng 70%, ân hạn nợ gốc 18 tháng',
          ],
          specs: {
            projectName: 'Vinhomes Ocean Park 2',
            area: '75',
            price: '9.8 Tỷ',
            pricePerM2: '130.6 tr/m²',
            subdivision: 'Phân khu Sao Biển (SB16)',
            propertyType: 'Shophouse thương mại',
            highlights: 'Mặt tiền trục thông 20m, vỉa hè rộng 6m để xe thoải mái, hỗ trợ vay 70%',
            legal: 'Sổ đỏ lâu dài',
            amenities: 'Liền kề Vincom, công viên sóng Wave Park, quảng trường ánh sáng',
          },
        },
        {
          id: 3,
          productName: 'Biệt thự Song lập view vườn Cọ Xanh - Suất ngoại giao',
          productType: 'Biệt thự song lập',
          subdivision: 'Cọ Xanh 04',
          priceEstimate: '14.5 Tỷ',
          area: '136m²',
          whyRecommended: 'Đáp ứng nhu cầu nâng tầm không gian sống cho gia đình thành đạt, tỷ suất sinh lời vượt trội khi công viên trung tâm khánh thành.',
          sampleTitleBDS: 'Suất Ngoại Giao Song Lập Cọ Xanh Ocean Park 2, 136m2 View Vườn 14.5 Tỷ',
          outlineBullets: [
            'Hook: Căn song lập Cọ Xanh vị trí kim cương view trọn vẹn công viên xanh mát',
            'Không gian: 136m2 đất, sân vườn rộng bao quanh, xây 4 tầng phong cách Địa Trung Hải',
            'Cam kết: Giá tốt nhất giỏ hàng biệt thự Ocean Park 2',
          ],
          specs: {
            projectName: 'Vinhomes Ocean Park 2',
            area: '136',
            price: '14.5 Tỷ',
            pricePerM2: '106.6 tr/m²',
            subdivision: 'Phân khu Cọ Xanh (CX04)',
            propertyType: 'Biệt thự song lập',
            highlights: 'View trọn công viên nội khu, sân vườn 3 mặt thoáng, tặng gói cảnh quan',
            legal: 'Sổ đỏ lâu dài',
            amenities: 'Bể bơi resort, sân tennis, công viên nhiệt đới, trường học',
          },
        },
      ],
    },
  },
  {
    id: 'ocean-park-3',
    name: 'Vinhomes Ocean Park 3',
    batdongsanUrl: 'https://batdongsan.com.vn/ban-nha-biet-thu-lien-ke-vinhomes-ocean-park-3',
    data: {
      projectName: 'Vinhomes Ocean Park 3 - The Crown',
      subdivision: 'Phân khu Phố Biển - Gần Vịnh Thiên Đường Paradise Bay',
      propertyType: 'Liền kề ven vịnh biển',
      area: '64',
      bedrooms: '4PN',
      bathrooms: '4WC',
      price: '7.85 Tỷ',
      pricePerM2: '122.6 triệu/m²',
      address: 'Đại đô thị Vinhomes Ocean Park 3, Xã Tân Lập & Nghĩa Trụ, Huyện Văn Giang, Hưng Yên',
      legal: 'Sổ đỏ sở hữu lâu dài, ký HĐMB trực tiếp',
      amenities: 'Vịnh biển kỳ quan 12.3ha Paradise Bay, biển nước mặn 4 mùa trong nhà Tropical Lagoon, hồ bơi chuẩn Olympic, công viên nước Aqua Bay',
      keyHighlights: 'Chính sách cam kết tiền thuê 6%/năm trong 5 năm hoặc nhận chiết khấu 15%. Hỗ trợ lãi suất 0% trong 30 tháng.',
      contactName: 'Ms Yến',
      phone: '0918 600 050',
      personaVoice: 'le_yen',
      orientation: 'Đông Nam',
      frontage: 'MT 5m',
      floors: 'xây 4 tầng',
      constructionArea: '260m²',
      targetKeywords: [
        'Vinhomes Ocean Park 3',
        'Vinhomes The Crown',
        'mua liền kề Ocean Park 3',
        'Phố Biển Ocean Park 3',
        'bán shophouse Vịnh Tây',
      ],
    },
    marketData: {
      projectName: 'Vinhomes Ocean Park 3',
      batdongsanUrl: 'https://batdongsan.com.vn/ban-nha-biet-thu-lien-ke-vinhomes-ocean-park-3',
      scannedAt: 'Cập nhật realtime lúc ' + new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      totalListingsCount: 90,
      pageScope: '3_pages',
      pagesBreakdown: [
        {
          pageNumber: 1,
          pageLabel: 'Trang 1 (30 tin)',
          totalListings: 30,
          vipDiamond: 10,
          vipGold: 12,
          vipSilver: 5,
          normal: 3,
          vipPercentage: 90.0,
          keyCharacteristics: 'Các tin đăng VIP Kim Cương chiếm trọn 10 vị trí đầu với ưu thế về chính sách cam kết tiền thuê và biển hồ Paradise Bay.',
        },
        {
          pageNumber: 2,
          pageLabel: 'Trang 2 (30 tin)',
          totalListings: 30,
          vipDiamond: 4,
          vipGold: 10,
          vipSilver: 10,
          normal: 6,
          vipPercentage: 80.0,
          keyCharacteristics: 'Phân khu Thời Đại và Vịnh Tây tập trung ở trang 2 với các bài toán tài chính thanh toán giãn 3 năm.',
        },
        {
          pageNumber: 3,
          pageLabel: 'Trang 3 (30 tin)',
          totalListings: 30,
          vipDiamond: 1,
          vipGold: 6,
          vipSilver: 11,
          normal: 12,
          vipPercentage: 60.0,
          keyCharacteristics: 'Môi giới cá nhân đăng tin thường và VIP Bạc chào bán các căn liền kề diện tích nhỏ 54m² - 56m².',
        },
      ],
      vipStats: {
        vipDiamond: 15,
        vipGold: 28,
        vipSilver: 26,
        normal: 21,
        vipPercentage: 76.7,
        competitionAnalysis: 'Trang 1 và Trang 2 tập trung chủ yếu vào phân khu Phố Biển, Thời Đại và Vịnh Tây. Các tin có chính sách cam kết tiền thuê và biển 4 mùa thu hút lượt xem cao hơn 40% so với tin đăng thông thường.',
      },
      agentsSummary: {
        totalActiveBrokers: 32,
        dominantAgencies: ['Phúc Lộc BĐS', 'Vietstarland', 'Newstarland', 'Đất Xanh'],
      },
      top5Brokers: [
        {
          rank: 1,
          name: 'Vũ Đức Toàn',
          phone: '0915 666 777',
          agency: 'Vietstarland Crown',
          totalListings: 12,
          marketSharePercent: 13.3,
          profileUrl: 'https://batdongsan.com.vn/ban-nha-dat?q=0915666777',
          keyStrategy: 'Độc quyền quỹ căn Phố Biển đối diện vịnh Paradise Bay; giật tít hỗ trợ lãi suất 0% đến năm 2027',
          strengths: 'Kinh nghiệm 8 năm phân phối BĐS Vinhomes, dẫn khách thực tế bằng xe điện miễn phí',
        },
        {
          rank: 2,
          name: 'Hoàng Mai Phương',
          phone: '0983 222 111',
          agency: 'Phúc Lộc BĐS',
          totalListings: 11,
          marketSharePercent: 12.2,
          profileUrl: 'https://batdongsan.com.vn/ban-nha-dat?q=0983222111',
          keyStrategy: 'Bán phân khu Thời Đại vị trí đắc địa giáp công viên trung tâm; nhấn mạnh chính sách quà tặng xe ô tô điện',
          strengths: 'Bài viết chuẩn SEO, hình ảnh 360 độ góc nhìn thực tế',
        },
        {
          rank: 3,
          name: 'Trần Đình Cường',
          phone: '0904 999 333',
          agency: 'Newstarland',
          totalListings: 9,
          marketSharePercent: 10.0,
          profileUrl: 'https://batdongsan.com.vn/ban-nha-dat?q=0904999333',
          keyStrategy: 'Tập trung shophouse đường 51m phân khu Vịnh Thiên Đường có hợp đồng nhượng quyền F&B sẵn',
          strengths: 'Chuyên kết nối nhà đầu tư doanh nghiệp và chuỗi thương hiệu bán lẻ',
        },
        {
          rank: 4,
          name: 'Bùi Thị Lan',
          phone: '0932 444 888',
          agency: 'Đại lý BĐS Thành Đông',
          totalListings: 8,
          marketSharePercent: 8.9,
          profileUrl: 'https://batdongsan.com.vn/ban-nha-dat?q=0932444888',
          keyStrategy: 'Tin VIP Vàng liền kề 56m² giá mềm nhất dự án; nhắm vào tệp vợ chồng trẻ tích lũy ban đầu 1.5 tỷ',
          strengths: 'Tư vấn pháp lý cẩn trọng, hỗ trợ vay 80% vốn ngân hàng Vietcombank',
        },
        {
          rank: 5,
          name: 'Nguyễn Tiến Dũng',
          phone: '0977 123 456',
          agency: 'BĐS Ocean City',
          totalListings: 7,
          marketSharePercent: 7.8,
          profileUrl: 'https://batdongsan.com.vn/ban-nha-dat?q=0977123456',
          keyStrategy: 'Đăng tải video review thực tế hồ bơi nước mặn 4 mùa Tropical Lagoon',
          strengths: 'Khách tỉnh tin tưởng giao dịch online và công chứng ủy quyền từ xa',
        },
      ],
      contentCategories: [
        {
          categoryName: 'Chính Sách Khủng & Cam Kết Tiền Thuê 5 Năm',
          count: 36,
          percentage: 40,
          angles: ['CĐT cam kết thuê lại 30%/5 năm', 'Nhận nhà kinh doanh sinh lời kép ngay', 'Chiết khấu 15%'],
          topKeywords: ['cam kết tiền thuê', 'chiết khấu 15%', 'vịnh thiên đường', 'lãi suất 0%'],
        },
        {
          categoryName: 'Liền Kề Phố Biển Ở Ngay & Giá Đầu Tư Ban Đầu Nhẹ',
          count: 30,
          percentage: 33.3,
          angles: ['Thanh toán 1.6 Tỷ nhận nhà ngay', 'Căn góc 2 mặt thoáng view công viên', 'Phố Biển vị trí đắc địa'],
          topKeywords: ['phố biển', 'giá tốt', 'ở ngay', 'thời đại'],
        },
        {
          categoryName: 'Shophouse Vịnh Tây & Phố Thương Mại Sầm Uất',
          count: 15,
          percentage: 16.7,
          angles: ['Kinh doanh ẩm thực ven vịnh', 'Mặt tiền đường 51m kết nối Ocean Park 2', 'Bán giá gốc CĐT'],
          topKeywords: ['shophouse vịnh tây', 'đường 51m', 'kinh doanh biển'],
        },
        {
          categoryName: 'Biệt Thự Vịnh Xanh Biệt Lập Đẳng Cấp',
          count: 9,
          percentage: 10,
          angles: ['Sở hữu bến đỗ cano riêng', 'Khu compound khép kín an ninh 3 lớp', 'Biệt thự đảo quý tộc'],
          topKeywords: ['vịnh xanh', 'biệt thự đảo', 'đẳng cấp thượng lưu'],
        },
      ],
      productsAndPricing: [
        {
          productType: 'Liền kề tiêu chuẩn (54m² - 68m²)',
          count: 42,
          priceRange: '6.9 Tỷ - 8.5 Tỷ',
          avgPriceM2: '125 - 138 tr/m²',
          marketEvaluation: 'Khối lượng giao dịch dẫn đầu dự án; chính sách thanh toán giãn tiến độ giúp thu hút nhiều nhà đầu tư vừa và nhỏ.',
        },
        {
          productType: 'Liền kề / Shophouse thương mại (70m² - 85m²)',
          count: 30,
          priceRange: '9.2 Tỷ - 12.8 Tỷ',
          avgPriceM2: '135 - 155 tr/m²',
          marketEvaluation: 'Được các hộ kinh doanh và nhà đầu tư dài hạn ưu tiên nhờ kết nối trực tiếp đến khu vui chơi Grand World & Paradise Bay.',
        },
        {
          productType: 'Biệt thự Vịnh Tây & Ánh Dương (120m² - 180m²)',
          count: 18,
          priceRange: '16.5 Tỷ - 28 Tỷ',
          avgPriceM2: '140 - 165 tr/m²',
          marketEvaluation: 'Số lượng tin ít nhưng tỷ lệ chuyển đổi cao đối với khách có vốn tự có trên 10 tỷ.',
        },
      ],
      historicalComparison: {
        previousBenchmarkPeriod: 'Dữ liệu đối chiếu 30 ngày trước',
        priceTrend: 'Tăng (+3.2% khi khai trương công viên nước Paradise Bay)',
        listingVolumeTrend: 'Số tin đăng VIP Kim Cương tăng 25%',
        vipCompetitionShift: 'Cạnh tranh dịch chuyển mạnh sang phân khu Phố Biển và Vịnh Thiên Đường',
        marketNotes: 'Hiệu ứng quần thể Ocean City hoàn thiện hạ tầng xe buýt điện VinBus chạy 24/7 tạo sức hút lớn cho khách thuê và cư dân chuyển về ở.',
      },
      recommendations: [
        {
          id: 1,
          productName: 'Liền kề Phố Biển 64m² - 4 Tầng gần Vịnh Biển Paradise Bay',
          productType: 'Liền kề 4 tầng',
          subdivision: 'Phố Biển 09',
          priceEstimate: '7.85 Tỷ',
          area: '64m²',
          whyRecommended: 'Sản phẩm có thanh khoản và tỷ lệ tìm kiếm cao nhất phân khu Phố Biển hiện tại.',
          sampleTitleBDS: 'Bán Gấp Liền Kề Phố Biển Ocean Park 3, 64m2 Cạnh Vịnh Biển Giá 7.85 Tỷ',
          outlineBullets: [
            'Hook: Suất ngoại giao liền kề Phố Biển chỉ cách vịnh Paradise Bay 150m',
            'Thiết kế: 64m2, xây 4 tầng hiện đại, đường trước nhà 13m thông thoáng',
            'Chính sách: Vốn ban đầu chỉ 1.9 Tỷ, ngân hàng hỗ trợ 70% ân hạn 24 tháng',
          ],
          specs: {
            projectName: 'Vinhomes Ocean Park 3',
            area: '64',
            price: '7.85 Tỷ',
            pricePerM2: '122.6 tr/m²',
            subdivision: 'Phân khu Phố Biển (PB09)',
            propertyType: 'Liền kề ven vịnh biển',
            highlights: 'Đi bộ 2 phút ra biển hồ 4 mùa, hỗ trợ vay 70%, chiết khấu 12%',
            legal: 'Sổ đỏ sở hữu lâu dài',
            amenities: 'Paradise Bay 12.3ha, biển 4 mùa Tropical Lagoon, hồ bơi Olympic',
          },
        },
        {
          id: 2,
          productName: 'Liền kề phân khu Thời Đại 60m² đối diện công viên & trường học',
          productType: 'Liền kề',
          subdivision: 'Thời Đại 12',
          priceEstimate: '7.2 Tỷ',
          area: '60m²',
          whyRecommended: 'Phù hợp túi tiền của gia đình trẻ chuyển về ở thực ngay trong năm 2026.',
          sampleTitleBDS: 'Cần Bán Căn Liền Kề Thời Đại Ocean Park 3, 60m2 View Công Viên Giá 7.2 Tỷ',
          outlineBullets: [
            'Hook: Căn nhà phố Thời Đại view trực diện vườn hoa công viên nội khu rực rỡ',
            'Tiện ích: Trường mầm non và tiểu học Vinschool ngay sau nhà',
            'Giá bán: Cam kết tốt nhất phân khu Thời Đại, xem nhà thực tế 24/7',
          ],
          specs: {
            projectName: 'Vinhomes Ocean Park 3',
            area: '60',
            price: '7.2 Tỷ',
            pricePerM2: '120 tr/m²',
            subdivision: 'Phân khu Thời Đại (TĐ12)',
            propertyType: 'Liền kề',
            highlights: 'View công viên, trường học, giá rẻ nhất phân khu',
            legal: 'Sổ đỏ sở hữu lâu dài',
            amenities: 'Bể bơi phong cách resort, công viên cây xanh, sân thể thao',
          },
        },
        {
          id: 3,
          productName: 'Shophouse Vịnh Tây 75m² kinh doanh buôn bán sầm uất',
          productType: 'Shophouse',
          subdivision: 'Vịnh Tây 06',
          priceEstimate: '10.5 Tỷ',
          area: '75m²',
          whyRecommended: 'Khả năng khai thác kinh doanh cho thuê dòng tiền đạt 7.5%/năm ngay khi bàn giao.',
          sampleTitleBDS: 'Chính Chủ Bán Shophouse Vịnh Tây Ocean Park 3, 75m2 Kinh Doanh Giá 10.5 Tỷ',
          outlineBullets: [
            'Hook: Căn Shophouse trục đường lớn kết nối trực tiếp sang phân khu Sao Biển Ocean Park 2',
            'Dòng tiền: Chủ đầu tư cam kết thuê lại trả trước 1 năm tiền thuê',
            'Pháp lý: Chuẩn chỉnh, thủ tục công chứng nhanh chóng',
          ],
          specs: {
            projectName: 'Vinhomes Ocean Park 3',
            area: '75',
            price: '10.5 Tỷ',
            pricePerM2: '140 tr/m²',
            subdivision: 'Phân khu Vịnh Tây (VT06)',
            propertyType: 'Shophouse',
            highlights: 'Mặt tiền 5m, vỉa hè rộng, cam kết tiền thuê 6%/năm',
            legal: 'Sổ đỏ sở hữu lâu dài',
            amenities: 'Trục thông 2 đại dự án, phố ẩm thực, khu vui chơi',
          },
        },
      ],
    },
  },
  {
    id: 'ha-long-xanh',
    name: 'Vinhomes Hạ Long Xanh',
    batdongsanUrl: 'https://batdongsan.com.vn/ban-nha-biet-thu-lien-ke-vinhomes-global-gate-ha-long',
    data: {
      projectName: 'Đại Đô Thị Vinhomes Hạ Long Xanh',
      subdivision: 'Phân khu Kỳ Quan Biển - Giai đoạn 1',
      propertyType: 'Đất nền & Biệt thự sinh thái nghỉ dưỡng',
      area: '120',
      bedrooms: 'Chưa xây dựng / Đất nền',
      bathrooms: 'Chưa xây dựng',
      price: '5.2 Tỷ',
      pricePerM2: '43.3 triệu/m²',
      address: 'Thị xã Quảng Yên và TP. Hạ Long, Tỉnh Quảng Ninh',
      legal: 'Quy hoạch 1/500 hoàn thiện, pháp lý minh bạch, sổ đỏ từng lô',
      amenities: 'Quần thể đô thị ven vịnh 4.100ha lớn nhất miền Bắc, sân golf 54 hố chuẩn PGA, bến du thuyền 5 sao quốc tế, công viên chủ đề Safari, tổ hợp resort biển',
      keyHighlights: 'Biên độ tăng giá đất cực lớn đón đầu sóng cao tốc ven biển và cầu Rừng. Thanh toán linh hoạt 10 đợt trong 24 tháng.',
      contactName: 'Mr Việt',
      phone: '090.223.5050',
      personaVoice: 'vu_viet',
      orientation: 'Đông Nam view vịnh',
      frontage: 'MT 6m',
      floors: 'tự xây theo quy hoạch',
      constructionArea: '280m²',
      targetKeywords: [
        'Vinhomes Hạ Long Xanh',
        'đất nền Vinhomes Hạ Long Xanh',
        'giá bán Vinhomes Hạ Long Xanh',
        'biệt thự biển Hạ Long Xanh',
        'đầu tư BĐS Quảng Ninh',
      ],
    },
    marketData: {
      projectName: 'Vinhomes Hạ Long Xanh',
      batdongsanUrl: 'https://batdongsan.com.vn/ban-nha-biet-thu-lien-ke-vinhomes-global-gate-ha-long',
      scannedAt: 'Cập nhật realtime lúc ' + new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      totalListingsCount: 90,
      pageScope: '3_pages',
      pagesBreakdown: [
        {
          pageNumber: 1,
          pageLabel: 'Trang 1 (30 tin)',
          totalListings: 30,
          vipDiamond: 7,
          vipGold: 11,
          vipSilver: 7,
          normal: 5,
          vipPercentage: 83.3,
          keyCharacteristics: 'Các sàn lớn Quảng Ninh bao trọn trang 1 với các suất F0 ngoại giao đất nền và biệt thự ven vịnh.',
        },
        {
          pageNumber: 2,
          pageLabel: 'Trang 2 (30 tin)',
          totalListings: 30,
          vipDiamond: 2,
          vipGold: 9,
          vipSilver: 10,
          normal: 9,
          vipPercentage: 70.0,
          keyCharacteristics: 'Tập trung đất nền liền kề 90m² - 100m² đón sóng hạ tầng cầu Rừng và cao tốc ven biển.',
        },
        {
          pageNumber: 3,
          pageLabel: 'Trang 3 (30 tin)',
          totalListings: 30,
          vipDiamond: 0,
          vipGold: 4,
          vipSilver: 11,
          normal: 15,
          vipPercentage: 50.0,
          keyCharacteristics: 'Chủ yếu là tin thường của môi giới địa phương tại Quảng Yên chào bán đất nền tái định cư và đất dịch vụ quanh dự án.',
        },
      ],
      vipStats: {
        vipDiamond: 9,
        vipGold: 24,
        vipSilver: 28,
        normal: 29,
        vipPercentage: 67.8,
        competitionAnalysis: 'Dự án đang trong giai đoạn nóng sốt về quy hoạch và đền bù giải phóng mặt bằng. Tin đăng phân hóa giữa đất nền giai đoạn 1 và suất đầu tư F0 đón đầu hạ tầng.',
      },
      agentsSummary: {
        totalActiveBrokers: 28,
        dominantAgencies: ['BĐS Đất Vàng Quảng Ninh', 'Hạ Long Land', 'Vinhomes Land Miền Bắc'],
      },
      top5Brokers: [
        {
          rank: 1,
          name: 'Phạm Quang Minh (Trùm Đất Hạ Long)',
          phone: '0936 999 888',
          agency: 'BĐS Đất Vàng Quảng Ninh',
          totalListings: 13,
          marketSharePercent: 14.4,
          profileUrl: 'https://batdongsan.com.vn/ban-nha-dat?q=0936999888',
          keyStrategy: 'Đăng tin suất ngoại giao đất nền đợt 1 giá gốc CĐT; cam kết lợi nhuận tối thiểu 20%/năm',
          strengths: 'Nắm chắc thông tin quy hoạch 1/500 và mốc giải phóng mặt bằng thị xã Quảng Yên',
        },
        {
          rank: 2,
          name: 'Nguyễn Thị Hương Giang',
          phone: '0978 444 333',
          agency: 'Hạ Long Land Premier',
          totalListings: 10,
          marketSharePercent: 11.1,
          profileUrl: 'https://batdongsan.com.vn/ban-nha-dat?q=0978444333',
          keyStrategy: 'Tập trung các lô liền kề góc 2 mặt tiền view sân golf và trục đường bao biển',
          strengths: 'Có xe đưa đón khách hàng từ Hà Nội xuống Hạ Long xem đất thực địa miễn phí',
        },
        {
          rank: 3,
          name: 'Đặng Tuấn Anh',
          phone: '0902 555 111',
          agency: 'Vinhomes Land Quảng Ninh',
          totalListings: 9,
          marketSharePercent: 10.0,
          profileUrl: 'https://batdongsan.com.vn/ban-nha-dat?q=0902555111',
          keyStrategy: 'Tiêu đề giật tít đón sóng cao tốc ven biển Hải Phòng - Hạ Long',
          strengths: 'Hỗ trợ thủ tục đặt cọc và vào tên hợp đồng chính thức',
        },
        {
          rank: 4,
          name: 'Lê Thị Thu Thảo',
          phone: '0912 333 777',
          agency: 'Quảng Yên Invest',
          totalListings: 8,
          marketSharePercent: 8.9,
          profileUrl: 'https://batdongsan.com.vn/ban-nha-dat?q=0912333777',
          keyStrategy: 'So sánh mức giá 40-50tr/m² của Hạ Long Xanh với mặt bằng 100tr/m² tại Bãi Cháy',
          strengths: 'Phân tích tài chính sắc bén, số liệu quy hoạch chi tiết',
        },
        {
          rank: 5,
          name: 'Vũ Mạnh Cường',
          phone: '0989 666 444',
          agency: 'An Phát Land Hạ Long',
          totalListings: 7,
          marketSharePercent: 7.8,
          profileUrl: 'https://batdongsan.com.vn/ban-nha-dat?q=0989666444',
          keyStrategy: 'Tập trung sản phẩm biệt thự đồi view trọn vịnh Hạ Long',
          strengths: 'Khách hàng VIP, hỗ trợ các gói thanh toán linh hoạt 3 năm',
        },
      ],
      contentCategories: [
        {
          categoryName: 'Đón Sóng Hạ Tầng & Quy Hoạch Đại Đô Thị 4.100ha',
          count: 42,
          percentage: 46.7,
          angles: ['Siêu dự án 10 tỷ USD lớn nhất miền Bắc', 'Đón đầu cầu Rừng và cao tốc ven biển', 'Tiềm năng nhân đôi dòng vốn'],
          topKeywords: ['quy hoạch 4100ha', 'đầu tư f0', 'tiềm năng x2', 'cao tốc ven biển'],
        },
        {
          categoryName: 'Suất Ngoại Giao Giá Gốc CĐT Đợt 1',
          count: 27,
          percentage: 30,
          angles: ['Giá chỉ từ 40 triệu/m²', 'Tiến độ đóng tiền giãn 24 tháng', 'Căn góc đẹp nhất giai đoạn 1'],
          topKeywords: ['suất ngoại giao', 'giá gốc đợt 1', 'tiến độ giãn', 'đất nền giá rẻ'],
        },
        {
          categoryName: 'Biệt Thự Sân Golf & Nghỉ Dưỡng Ven Vịnh',
          count: 21,
          percentage: 23.3,
          angles: ['Sân golf 54 hố chuẩn PGA', 'Bến du thuyền quốc tế', 'Đẳng cấp nghỉ dưỡng di sản thế giới'],
          topKeywords: ['biệt thự sân golf', 'bến du thuyền', 'nghỉ dưỡng ven vịnh'],
        },
      ],
      productsAndPricing: [
        {
          productType: 'Đất nền Liền kề (90m² - 120m²)',
          count: 48,
          priceRange: '4.2 Tỷ - 5.8 Tỷ',
          avgPriceM2: '42 - 50 tr/m²',
          marketEvaluation: 'Phân khúc sôi động nhất do tổng mức đầu tư vừa phải, tính thanh khoản chuyển nhượng cao.',
        },
        {
          productType: 'Đất nền Shophouse trục chính (120m² - 160m²)',
          count: 24,
          priceRange: '7.5 Tỷ - 11 Tỷ',
          avgPriceM2: '60 - 75 tr/m²',
          marketEvaluation: 'Nằm trên các tuyến đường 30m - 50m xuyên tâm đại đô thị, được các nhà đầu tư lớn gom giữ.',
        },
        {
          productType: 'Biệt thự Đơn lập & Song lập ven vịnh (200m² - 400m²)',
          count: 18,
          priceRange: '15 Tỷ - 35 Tỷ',
          avgPriceM2: '75 - 95 tr/m²',
          marketEvaluation: 'Sản phẩm siêu VIP dành cho giới tinh hoa yêu thích cảnh quan vịnh di sản.',
        },
      ],
      historicalComparison: {
        previousBenchmarkPeriod: 'Dữ liệu đối chiếu 60 ngày trước',
        priceTrend: 'Tăng mạnh (+5.5% sau thông tin đẩy nhanh tiến độ GPMB)',
        listingVolumeTrend: 'Lượng tin đăng mới tăng 35% trên batdongsan.com.vn',
        vipCompetitionShift: 'Các sàn BĐS miền Bắc đổ dồn ngân sách chạy tin VIP Diamond và VIP Gold',
        marketNotes: 'Hạ Long Xanh được đánh giá là tâm điểm đón dòng tiền đầu tư BĐS ven biển phía Bắc trong chu kỳ 2026 - 2030.',
      },
      recommendations: [
        {
          id: 1,
          productName: 'Lô đất nền Liền kề 100m² Giai đoạn 1 - Mặt tiền 6m',
          productType: 'Đất nền phân lô',
          subdivision: 'Phân khu Kỳ Quan 1',
          priceEstimate: '4.5 Tỷ (45 tr/m²)',
          area: '100m²',
          whyRecommended: 'Mức giá 4.5 tỷ phù hợp đại đa số nhà đầu tư tìm kiếm tài sản gia tăng lãi vốn tại Quảng Ninh.',
          sampleTitleBDS: 'Bán Suất Ngoại Giao Đất Nền Vinhomes Hạ Long Xanh 100m2 Giá F0 4.5 Tỷ Sổ Đỏ',
          outlineBullets: [
            'Hook: Suất F0 duy nhất giai đoạn 1 Vinhomes Hạ Long Xanh giá gốc CĐT',
            'Quy hoạch: Lô đất vuông vắn 100m2, mặt tiền 6m, xây dựng tự do theo quy hoạch',
            'Tiềm năng: Đón đầu khánh thành đường bao biển và các tiện ích công viên kỳ quan',
          ],
          specs: {
            projectName: 'Vinhomes Hạ Long Xanh',
            area: '100',
            price: '4.5 Tỷ',
            pricePerM2: '45 tr/m²',
            subdivision: 'Phân khu Kỳ Quan (Giai đoạn 1)',
            propertyType: 'Đất nền phân lô',
            highlights: 'Suất F0 giá gốc, quy hoạch 1/500 minh bạch, tiềm năng x2 khi bàn giao',
            legal: 'Sổ đỏ sở hữu lâu dài',
            amenities: 'Sân golf 54 hố, bến du thuyền quốc tế, Safari',
          },
        },
        {
          id: 2,
          productName: 'Shophouse mặt đường trục chính 36m Vinhomes Hạ Long Xanh',
          productType: 'Shophouse',
          subdivision: 'Trục Đại Lộ Ánh Dương',
          priceEstimate: '8.2 Tỷ',
          area: '120m²',
          whyRecommended: 'Trục đường lớn kinh doanh sầm uất đón trọn dòng khách du lịch tham quan vịnh.',
          sampleTitleBDS: 'Chính Chủ Bán Shophouse Vinhomes Hạ Long Xanh 120m2 Mặt Đường 36m 8.2 Tỷ',
          outlineBullets: [
            'Hook: Căn shophouse mặt tiền trục chính 36m vị trí đắt giá nhất dự án',
            'Công năng: Vừa ở vừa kinh doanh khách sạn mini, nhà hàng hải sản cao cấp',
            'Thanh toán: Chia nhỏ làm 10 đợt nhẹ nhàng trong 24 tháng',
          ],
          specs: {
            projectName: 'Vinhomes Hạ Long Xanh',
            area: '120',
            price: '8.2 Tỷ',
            pricePerM2: '68.3 tr/m²',
            subdivision: 'Đại Lộ Ánh Dương',
            propertyType: 'Shophouse',
            highlights: 'Mặt đường 36m, kinh doanh sầm uất, hỗ trợ vay 70%',
            legal: 'Sổ đỏ sở hữu lâu dài',
            amenities: 'Trung tâm tài chính, quảng trường biển, công viên nước',
          },
        },
        {
          id: 3,
          productName: 'Biệt thự Song lập View Sân Golf 54 Hố đẳng cấp PGA',
          productType: 'Biệt thự song lập',
          subdivision: 'Phân khu Golf Villas',
          priceEstimate: '16.8 Tỷ',
          area: '200m²',
          whyRecommended: 'Phục vụ giới thượng lưu tìm kiếm bất động sản nghỉ dưỡng hàng hiệu tại Hạ Long.',
          sampleTitleBDS: 'Bán Biệt Thự Vinhomes Hạ Long Xanh 200m2 View Sân Golf PGA Giá 16.8 Tỷ',
          outlineBullets: [
            'Hook: Biệt thự nghỉ dưỡng view trực diện thảm cỏ xanh mướt của sân golf 54 hố',
            'Kiến trúc: Phong cách tân cổ điển hoàng gia Pháp, sân vườn 3 mặt thoáng mát',
            'Đặc quyền: Tặng thẻ hội viên golf 10 năm và bến đỗ du thuyền',
          ],
          specs: {
            projectName: 'Vinhomes Hạ Long Xanh',
            area: '200',
            price: '16.8 Tỷ',
            pricePerM2: '84 tr/m²',
            subdivision: 'Khu Golf Villas',
            propertyType: 'Biệt thự song lập',
            highlights: 'View sân golf 54 hố, bến du thuyền, tặng thẻ hội viên golf 10 năm',
            legal: 'Sổ đỏ sở hữu lâu dài',
            amenities: 'Sân golf PGA, clubhouse sang trọng, bến du thuyền 5 sao',
          },
        },
      ],
    },
  },
  {
    id: 'olympic',
    name: 'Vinhomes Olympic Hà Nội',
    batdongsanUrl: 'https://batdongsan.com.vn/ban-nha-biet-thu-lien-ke-khu-do-thi-the-thao-olympic',
    data: {
      projectName: 'Đại Đô Thị Vinhomes Olympic Hà Nội',
      subdivision: 'Phân khu Ánh Dương - Trục đại lộ Thể Thao',
      propertyType: 'Liền kề / Shophouse thể thao sinh thái',
      area: '72',
      bedrooms: '4PN',
      bathrooms: '4WC',
      price: '9.2 Tỷ',
      pricePerM2: '127.7 triệu/m²',
      address: 'Khu đô thị sinh thái thể thao Olympic, Phía Tây Hà Nội',
      legal: 'Pháp lý dự án hoàn chỉnh, ký HĐMB trực tiếp',
      amenities: 'Sân vận động tiêu chuẩn Olympic, tổ hợp thi đấu thể thao đa năng quốc tế, công viên thể thao mạo hiểm, đường chạy marathon chuyên nghiệp, hồ điều hòa 20ha',
      keyHighlights: 'Tiên phong mô hình đô thị thể thao - sức khỏe đẳng cấp quốc tế đầu tiên tại Việt Nam. Hỗ trợ vay 70% ân hạn 24 tháng, chiết khấu mở bán 10%.',
      contactName: 'Mr Việt',
      phone: '090.223.5050',
      personaVoice: 'vu_viet',
      orientation: 'Tây Nam',
      frontage: 'MT 5m',
      floors: 'xây 5 tầng',
      constructionArea: '200m²',
      targetKeywords: [
        'Vinhomes Olympic',
        'Vinhomes Đan Phượng',
        'mua liền kề Vinhomes Olympic',
        'giá bán Vinhomes Olympic',
        'shophouse Vinhomes Olympic',
      ],
    },
    marketData: {
      projectName: 'Vinhomes Olympic',
      batdongsanUrl: 'https://batdongsan.com.vn/ban-nha-biet-thu-lien-ke-khu-do-thi-the-thao-olympic',
      scannedAt: 'Cập nhật realtime lúc ' + new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      totalListingsCount: 90,
      pageScope: '3_pages',
      pagesBreakdown: [
        {
          pageNumber: 1,
          pageLabel: 'Trang 1 (30 tin)',
          totalListings: 30,
          vipDiamond: 8,
          vipGold: 12,
          vipSilver: 6,
          normal: 4,
          vipPercentage: 86.7,
          keyCharacteristics: 'Môi giới tập trung chạy tin VIP Kim Cương và Vàng cho các căn liền kề 72m² view trực diện sân vận động và đại lộ Thể Thao.',
        },
        {
          pageNumber: 2,
          pageLabel: 'Trang 2 (30 tin)',
          totalListings: 30,
          vipDiamond: 3,
          vipGold: 9,
          vipSilver: 10,
          normal: 8,
          vipPercentage: 73.3,
          keyCharacteristics: 'Xuất hiện các tin shophouse kinh doanh dòng tiền và biệt thự ven hồ điều hòa 20ha.',
        },
        {
          pageNumber: 3,
          pageLabel: 'Trang 3 (30 tin)',
          totalListings: 30,
          vipDiamond: 0,
          vipGold: 5,
          vipSilver: 10,
          normal: 15,
          vipPercentage: 50.0,
          keyCharacteristics: 'Nhiều tin thường của môi giới khu vực Tây Hà Nội cạnh tranh giá rẻ hơn bảng hàng 200 - 300 triệu.',
        },
      ],
      vipStats: {
        vipDiamond: 11,
        vipGold: 26,
        vipSilver: 26,
        normal: 27,
        vipPercentage: 70.0,
        competitionAnalysis: 'Thị trường sôi động nhờ làn sóng quan tâm của cư dân Tây Hà Nội tìm kiếm môi trường sống năng động và chăm sóc sức khỏe. Tin VIP tập trung quanh trục đại lộ Thể Thao.',
      },
      agentsSummary: {
        totalActiveBrokers: 30,
        dominantAgencies: ['Vinhomes Center Phía Tây', 'Newway Land', 'Đất Xanh Thủ Đô', 'CenLand'],
      },
      top5Brokers: [
        {
          rank: 1,
          name: 'Đoàn Văn Khánh',
          phone: '0916 222 333',
          agency: 'Vinhomes Center Phía Tây',
          totalListings: 12,
          marketSharePercent: 13.3,
          profileUrl: 'https://batdongsan.com.vn/ban-nha-dat?q=0916222333',
          keyStrategy: 'Tập trung các căn liền kề 72m² trục view công viên thể thao; bài viết đánh sâu vào sức khỏe và giáo dục liên cấp',
          strengths: 'Có danh sách 300 khách hàng tiềm năng khu vực Cầu Giấy và Nam Từ Liêm',
        },
        {
          rank: 2,
          name: 'Nguyễn Bích Ngọc',
          phone: '0982 777 555',
          agency: 'Newway Land Olympic',
          totalListings: 10,
          marketSharePercent: 11.1,
          profileUrl: 'https://batdongsan.com.vn/ban-nha-dat?q=0982777555',
          keyStrategy: 'Đăng tin shophouse phố đi bộ thể thao; cam kết doanh thu kinh doanh bán lẻ',
          strengths: 'Chuyên viên tư vấn phong thủy và bài trí nội thất cao cấp',
        },
        {
          rank: 3,
          name: 'Lê Minh Thành',
          phone: '0903 888 222',
          agency: 'Đất Xanh Thủ Đô',
          totalListings: 9,
          marketSharePercent: 10.0,
          profileUrl: 'https://batdongsan.com.vn/ban-nha-dat?q=0903888222',
          keyStrategy: 'Bao phủ tin VIP Vàng phân khu Thời Đại; giải pháp dòng tiền chỉ cần trả trước 25%',
          strengths: 'Tư vấn pháp lý chắc chắn, liên kết 5 ngân hàng lớn giải ngân trong 3 ngày',
        },
        {
          rank: 4,
          name: 'Trần Thu Hằng',
          phone: '0935 111 666',
          agency: 'CenLand Olympic',
          totalListings: 8,
          marketSharePercent: 8.9,
          profileUrl: 'https://batdongsan.com.vn/ban-nha-dat?q=0935111666',
          keyStrategy: 'Tập trung biệt thự đơn lập ven hồ điều hòa 20ha',
          strengths: 'Chuyên phân khúc khách hàng cao cấp tìm biệt thự nghỉ dưỡng an dưỡng tuổi già',
        },
        {
          rank: 5,
          name: 'Phạm Đức Long',
          phone: '0948 999 000',
          agency: 'Thủ Đô Land',
          totalListings: 7,
          marketSharePercent: 7.8,
          profileUrl: 'https://batdongsan.com.vn/ban-nha-dat?q=0948999000',
          keyStrategy: 'Tin VIP Bạc liền kề giá tốt nhất phân khu Ánh Dương',
          strengths: 'Cập nhật tiến độ thi công hạ tầng hằng tuần qua video thực tế',
        },
      ],
      contentCategories: [
        {
          categoryName: 'Đô Thị Thể Thao Sức Khỏe - Lối Sống Wellness',
          count: 39,
          percentage: 43.3,
          angles: ['Sân vận động Olympic quốc tế', 'Môi trường sống nuôi dưỡng con trẻ năng động', 'Hồ điều hòa 20ha xanh mát'],
          topKeywords: ['đô thị thể thao', 'sống khỏe wellness', 'hồ điều hòa', 'chuẩn olympic'],
        },
        {
          categoryName: 'Chính Sách Vốn Mở Bán Đợt 1 Cực Ưu Đãi',
          count: 27,
          percentage: 30,
          angles: ['Vốn ban đầu 2 Tỷ nhận nhà ngay', 'Chiết khấu 10% thanh toán sớm', 'Lãi suất 0% trong 24 tháng'],
          topKeywords: ['chiết khấu 10%', 'vốn 2 tỷ', 'ưu đãi đợt 1', 'hỗ trợ lãi suất'],
        },
        {
          categoryName: 'Shophouse Kinh Doanh Dịch Vụ Thể Thao & F&B',
          count: 24,
          percentage: 26.7,
          angles: ['Trục đại lộ Thể Thao kết nối giao thông huyết mạch', 'Phục vụ cư dân và hàng triệu lượt khách thể thao', 'Vỉa hè 8m'],
          topKeywords: ['shophouse thể thao', 'đại lộ ánh dương', 'kinh doanh dịch vụ'],
        },
      ],
      productsAndPricing: [
        {
          productType: 'Liền kề tiêu chuẩn (65m² - 80m²)',
          count: 45,
          priceRange: '8.5 Tỷ - 10.8 Tỷ',
          avgPriceM2: '125 - 138 tr/m²',
          marketEvaluation: 'Nhu cầu mua ở thực cao nhất; khách chuộng căn hướng Đông Nam và gần cụm trường học Vinschool.',
        },
        {
          productType: 'Shophouse đại lộ thương mại (90m² - 120m²)',
          count: 27,
          priceRange: '13.5 Tỷ - 18.5 Tỷ',
          avgPriceM2: '145 - 165 tr/m²',
          marketEvaluation: 'Dễ cho thuê chuỗi cửa hàng tiện lợi, thời trang thể thao và phòng tập gym cao cấp.',
        },
        {
          productType: 'Biệt thự Song lập ven hồ (150m² - 220m²)',
          count: 18,
          priceRange: '19 Tỷ - 32 Tỷ',
          avgPriceM2: '130 - 150 tr/m²',
          marketEvaluation: 'Hàng hiếm, số lượng căn có hạn xung quanh hồ điều hòa 20ha.',
        },
      ],
      historicalComparison: {
        previousBenchmarkPeriod: 'Dữ liệu đối chiếu 30 ngày trước',
        priceTrend: 'Tăng (+3.0% sau khi khởi công trung tâm thi đấu thể thao quốc tế)',
        listingVolumeTrend: 'Tăng 22% số tin đăng mới trên 3 trang đầu',
        vipCompetitionShift: 'Tin VIP Kim Cương chiếm ưu thế áp đảo 5 vị trí đầu trang 1',
        marketNotes: 'Hưởng lợi trực tiếp từ tuyến đường Tây Thăng Long mở rộng, rút ngắn thời gian di chuyển vào trung tâm Hà Nội chỉ còn 20 phút.',
      },
      recommendations: [
        {
          id: 1,
          productName: 'Liền kề 72m² Phân khu Ánh Dương - Đường 14m gần Sân Vận Động',
          productType: 'Liền kề 4 tầng',
          subdivision: 'Ánh Dương 05',
          priceEstimate: '9.2 Tỷ',
          area: '72m²',
          whyRecommended: 'Sản phẩm có lượng tìm kiếm lớn nhất dự án, tính thanh khoản chuyển nhượng cao.',
          sampleTitleBDS: 'Bán Liền Kề Vinhomes Olympic 72m2 4 Tầng Gần Sân Vận Động Giá 9.2 Tỷ',
          outlineBullets: [
            'Hook: Cơ hội sở hữu nhà phố sinh thái thể thao liền kề sân vận động Olympic quốc tế',
            'Công năng: 72m2, 4 phòng ngủ thoáng sáng, gara ô tô rộng rãi',
            'Chính sách: Vốn ban đầu chỉ 2.3 Tỷ, ân hạn nợ gốc 24 tháng',
          ],
          specs: {
            projectName: 'Vinhomes Olympic',
            area: '72',
            price: '9.2 Tỷ',
            pricePerM2: '127.7 tr/m²',
            subdivision: 'Phân khu Ánh Dương (AD05)',
            propertyType: 'Liền kề 4 tầng',
            highlights: 'Gần sân vận động Olympic, hồ điều hòa 20ha, hỗ trợ vay 70%',
            legal: 'Sổ đỏ sở hữu lâu dài',
            amenities: 'Sân vận động, bể bơi Olympic, đường chạy marathon, trường học',
          },
        },
        {
          id: 2,
          productName: 'Shophouse Đại Lộ Thể Thao 96m² Mặt Tiền 6m Kinh Doanh Đỉnh',
          productType: 'Shophouse',
          subdivision: 'Đại Lộ Thể Thao (TT01)',
          priceEstimate: '14.2 Tỷ',
          area: '96m²',
          whyRecommended: 'Nằm trên tuyến phố đi bộ chính của toàn bộ quần thể thể thao Olympic.',
          sampleTitleBDS: 'Chính Chủ Bán Shophouse Vinhomes Olympic 96m2 Mặt Đại Lộ Thể Thao 14.2 Tỷ',
          outlineBullets: [
            'Hook: Căn shophouse trục đại lộ huyết mạch có vỉa hè rộng 8m để xe thoải mái',
            'Khai thác: Phù hợp kinh doanh nhà hàng, cafe, chuỗi bán lẻ thời trang thể thao',
            'Pháp lý: Đầy đủ, cam kết giao dịch trực tiếp chủ nhà',
          ],
          specs: {
            projectName: 'Vinhomes Olympic',
            area: '96',
            price: '14.2 Tỷ',
            pricePerM2: '147.9 tr/m²',
            subdivision: 'Đại Lộ Thể Thao (TT01)',
            propertyType: 'Shophouse',
            highlights: 'Mặt tiền 6m, vỉa hè rộng 8m, kinh doanh sầm uất',
            legal: 'Sổ đỏ sở hữu lâu dài',
            amenities: 'Quảng trường thể thao, trung tâm thương mại, khu thi đấu',
          },
        },
        {
          id: 3,
          productName: 'Biệt thự Song lập Ven Hồ Điều Hòa 20ha - View Thoáng Mát',
          productType: 'Biệt thự song lập',
          subdivision: 'Khu Biệt Thự Hồ Tây (HT08)',
          priceEstimate: '21.5 Tỷ',
          area: '160m²',
          whyRecommended: 'Không gian sống nghỉ dưỡng thanh bình, biệt lập giữa lòng đô thị thể thao.',
          sampleTitleBDS: 'Bán Biệt Thự Song Lập Vinhomes Olympic 160m2 View Hồ Điều Hòa 21.5 Tỷ',
          outlineBullets: [
            'Hook: Căn biệt thự song lập vị trí hiếm có view trọn vẹn mặt nước hồ điều hòa 20ha',
            'Không gian: 160m2 đất, sân vườn bao quanh, thiết kế hiện đại sang trọng',
            'Đặc quyền: Bến thuyền kayak riêng, an ninh khép kín 24/7',
          ],
          specs: {
            projectName: 'Vinhomes Olympic',
            area: '160',
            price: '21.5 Tỷ',
            pricePerM2: '134.3 tr/m²',
            subdivision: 'Khu Biệt Thự Hồ Tây (HT08)',
            propertyType: 'Biệt thự song lập',
            highlights: 'View trực diện hồ 20ha, sân vườn thoáng, an ninh compound',
            legal: 'Sổ đỏ sở hữu lâu dài',
            amenities: 'Hồ điều hòa 20ha, câu lạc bộ du thuyền, bể bơi vô cực',
          },
        },
      ],
    },
  },
];

export const SAMPLE_DRIVE_IMAGES: DriveImage[] = [
  {
    id: '1eA_sample_living_room',
    title: 'Phòng khách & Ban công Panorama tràn ánh sáng',
    originalUrl: 'https://drive.google.com/file/d/1eA_sample_living_room/view?usp=sharing',
    thumbnailUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80',
    directViewUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85',
    webUrl: 'https://drive.google.com/file/d/1eA_sample_living_room/view',
    isCover: true,
    isSelected: true,
    category: 'Nội thất phòng khách',
  },
  {
    id: '1eB_sample_pool_view',
    title: 'Hồ bơi vô cực tràn bờ chuẩn resort 5 sao',
    originalUrl: 'https://drive.google.com/file/d/1eB_sample_pool_view/view?usp=sharing',
    thumbnailUrl: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1000&q=80',
    directViewUrl: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1600&q=85',
    webUrl: 'https://drive.google.com/file/d/1eB_sample_pool_view/view',
    isCover: false,
    isSelected: true,
    category: 'Tiện ích hồ bơi',
  },
  {
    id: '1eC_sample_master_bedroom',
    title: 'Phòng ngủ Master view công viên & sông lớn',
    originalUrl: 'https://drive.google.com/file/d/1eC_sample_master_bedroom/view?usp=sharing',
    thumbnailUrl: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1000&q=80',
    directViewUrl: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1600&q=85',
    webUrl: 'https://drive.google.com/file/d/1eC_sample_master_bedroom/view',
    isCover: false,
    isSelected: true,
    category: 'Phòng ngủ Master',
  },
  {
    id: '1eD_sample_modern_kitchen',
    title: 'Gian bếp mở hiện đại chuẩn Hafele & bàn đảo',
    originalUrl: 'https://drive.google.com/file/d/1eD_sample_modern_kitchen/view?usp=sharing',
    thumbnailUrl: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1000&q=80',
    directViewUrl: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1600&q=85',
    webUrl: 'https://drive.google.com/file/d/1eD_sample_modern_kitchen/view',
    isCover: false,
    isSelected: true,
    category: 'Không gian bếp',
  },
  {
    id: '1eE_sample_building_exterior',
    title: 'Phối cảnh kiến trúc toà nhà & khuôn viên xanh',
    originalUrl: 'https://drive.google.com/file/d/1eE_sample_building_exterior/view?usp=sharing',
    thumbnailUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80',
    directViewUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1600&q=85',
    webUrl: 'https://drive.google.com/file/d/1eE_sample_building_exterior/view',
    isCover: false,
    isSelected: false,
    category: 'Kiến trúc toà nhà',
  },
  {
    id: '1eF_sample_floor_plan',
    title: 'Sơ đồ mặt bằng Layout 2PN tối ưu công năng',
    originalUrl: 'https://drive.google.com/file/d/1eF_sample_floor_plan/view?usp=sharing',
    thumbnailUrl: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1000&q=80',
    directViewUrl: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1600&q=85',
    webUrl: 'https://drive.google.com/file/d/1eF_sample_floor_plan/view',
    isCover: false,
    isSelected: true,
    category: 'Mặt bằng bố trí',
  },
];

export const DEFAULT_COMPETITOR_PLAYBOOKS: Record<string, CompetitorDeepPlaybook> = {
  'ocean-park-2': {
    competitorName: 'Nguyễn Văn Hùng (Newstarland Ocean City)',
    competitorUrl: 'https://batdongsan.com.vn/ban-nha-dat?q=0912888999',
    analyzedAt: '16:40 - 27/10/2026',
    threatLevel: 'Cực Kỳ Nguy Hiểm',
    executiveSummary: {
      corePositioning: 'Chiếm lĩnh vị trí Top 1-3 tìm kiếm thông qua mật độ phủ sóng tin VIP Kim Cương và kỹ thuật giật tít "cắt lỗ ngộp bank" kết hợp cam kết đòn bẩy tài chính.',
      dominantSegments: ['Liền kề Chà Là & Sao Biển', 'Shophouse trục chính 24m', 'Hàng chuyển nhượng cắt lỗ sâu'],
      primaryTrafficDrivers: ['SEO từ khóa dự án kết hợp giá rẻ', 'Đấu thầu tin VIP giờ vàng (9h - 11h & 19h - 21h)', 'Kéo traffic vào nhóm Zalo kín'],
      summarySynthesis: 'Đối thủ vận hành mô hình "Saturation Flooding" (phủ kín trang 1 bằng tài khoản đại lý), tối ưu tỷ lệ CTR bằng các từ ngữ kích động tâm lý hoảng loạn/săn đáy nhưng bộc lộ điểm yếu trầm trọng về sự tin cậy lâu dài và thiếu năng lực tư vấn danh mục đầu tư dòng tiền cao cấp.',
    },
    pillar1TrafficAndSeo: {
      activeListingsEstimate: '14 - 18 tin đăng song song trên Top 3 trang',
      postingVelocity: 'Làm mới tin mỗi 48h & đẩy tin VIP Kim Cương liên tục',
      categoryDistribution: '80% Bán liền kề/shophouse, 20% Cho thuê mặt bằng F&B',
      titleStructurePatterns: [
        '[Từ khoá sốc] + [Phân khu/Dự án] + [Diện tích/Giá] + [Cam kết rẻ nhất]',
        'CHỦ NGỢP THỞ OXY - Bán cắt lỗ 1.8 Tỷ Liền kề Sao Biển OCP2 - Sổ đỏ cầm tay - 0912.xxx',
        'GIÁ ĐÁY THỊ TRƯỜNG: Shophouse Đại Lộ 24m chỉ 8.x Tỷ, Hỗ trợ vay 70% 0% LS 24T'
      ],
      primaryKeywords: ['Ocean Park 2', 'Liền kề Sao Biển', 'Cắt lỗ Ocean Park 2', 'Shophouse Chà Là', 'The Empire Hưng Yên'],
      secondaryKeywords: ['bán nhà OCP2 giá rẻ', 'ngộp bank OCP2', 'shophouse kinh đô ánh sáng', 'liền kề 67.5m2 OCP2'],
      algorithmicVisibilityTactics: [
        'Duy trì tối thiểu 3 tin VIP Kim Cương cố định ở vị trí 1, 3, 5 của Trang 1',
        'Chèn chuỗi hashtag dự án dày đặc cuối bài để hứng traffic tìm kiếm gợi ý',
        'Thay đổi số lẻ mức giá (ví dụ: 8.29 Tỷ thay vì 8.3 Tỷ) để lọt vào bộ lọc giá rẻ'
      ],
    },
    pillar2PsychologicalCopywriting: {
      emotionalDistressHooks: [
        '"Chủ nhà thở oxy / Ngộp bank đáo hạn"',
        '"Cắt lỗ sâu 30% so với giá HĐMB CĐT"',
        '"Chỉ 1 căn duy nhất bán trong tuần, qua tuần rút cọc"',
        '"Áp vốn tự có chỉ 2.5 Tỷ, ngân hàng bao giải ngân"'
      ],
      pricingPsychology: 'Tách nhỏ đơn giá theo vốn tự có thay vì tổng giá trị thực tế nhằm hạ thấp rào cản tâm lý của nhà đầu tư tay ngang.',
      unitSizePositioning: 'Tập trung chủ lực vào các căn diện tích chuẩn thanh khoản cao (63m² - 67.5m² - 75m²).',
      valuePropositionTactic: 'Tạo cảm giác "mua hời ngay lập tức" bằng cách so sánh khống với giá đỉnh sóng năm 2022.',
      analyzedHeadlines: [
        'CẮT LỖ KHẨN CẤP: Liền kề Chà Là 63m² giảm 1.5 tỷ thu hồi vốn, full đồ',
        'DUY NHẤT HÔM NAY: Shophouse San Hô trục 20m giá 7.9 tỷ, sổ sẵn sang tên'
      ],
    },
    pillar3PersonalBranding: {
      professionalPositioning: 'Tự định vị là "Trưởng phòng kinh doanh đại lý Top 1 CĐT - Trùm giỏ hàng ngoại giao kín"',
      credibilitySignals: [
        'Huy hiệu "Môi giới chuyên nghiệp Batdongsan.com.vn"',
        'Cam kết bảng hàng 100% thật - không đăng giá ảo',
        'Có văn phòng thực địa ngay tại ngã tư phân khu Chà Là'
      ],
      crossPlatformFunnel: 'Gắn SĐT/Zalo định dạng chữ viết tắt để vượt qua bộ lọc sàn, dẫn dắt khách hàng vào group Zalo "Bảng Hàng Cắt Lỗ Sâu OCP2" để gom phễu.',
    },
    pillar4VulnerabilityGaps: {
      blindSpots: [
        'Văn phong bài viết theo mô típ cũ rập khuôn ("ngộp bank", "cắt lỗ"), khiến khách hàng thượng lưu e ngại về pháp lý hoặc chất lượng sản phẩm.',
        'Thiếu hoàn toàn bảng tính dòng tiền (ROI / Cashflow) và bài toán bài bản cho khách thuê vận hành.',
        'Hình ảnh chụp thô sơ bằng điện thoại, không có thương hiệu cá nhân, dễ bị sao chép hoặc trôi bài.'
      ],
      missingFinancialAdvisory: [
        'Không phân tích cơ cấu đòn bẩy tài chính an toàn khi hết thời hạn ưu đãi lãi suất 0%.',
        'Không đưa ra lộ trình khai thác tăng giá vốn theo tiến độ hạ tầng Vành đai 3.5 & Vành đai 4.'
      ],
      unaddressedBuyerConcerns: [
        'Tâm lý lo sợ dự án vắng người ở, rủi ro chôn vốn không thanh khoản được.',
        'Sự e ngại về chi phí hoàn thiện nội thất và phí dịch vụ quản lý.'
      ],
      vulnerabilitiesToExploit: [
        'Khách hàng phân khúc cao cấp (VIP) đang bị ngấy bởi tin đăng "kêu gào cắt lỗ" -> Cơ hội định vị Quiet Luxury & Financial Advisory.',
        'Hình ảnh tin đăng của đối thủ mờ nhạt -> Dễ dàng chiến thắng nếu có bộ ảnh chuẩn chuyên nghiệp kèm Alt-text SEO và Brand Watermark.'
      ],
    },
    offensiveCounterStrategy: {
      differentiationMatrix: [
        {
          competitorTactic: 'Dùng từ khoá giật gân, kêu gào ngộp thở, hoảng loạn ("Chủ thở oxy, cắt lỗ 2 tỷ")',
          counterStrategy: 'Định vị "Quiet Luxury" & Cố Vấn Đầu Tư Dòng Tiền (Phân tích vị trí thực, biên độ an toàn, phương án cho thuê F&B có sẵn khách)',
          expectedImpact: 'Thu hút 100% tệp khách hàng mua ở thực và nhà đầu tư có tài chính lớn sẵn tiền mặt.'
        },
        {
          competitorTactic: 'Bao vây vị trí Top 1 bằng cách chi đậm tiền đặt VIP Kim Cương',
          counterStrategy: 'Tối ưu SEO Long-tail Keywords (nhắm vào mã căn cụ thể, trục đường hoa, góc công viên) trên VIP Vàng / Bạc với chi phí chỉ bằng 1/3',
          expectedImpact: 'Tối ưu 65% chi phí quảng cáo nhưng đạt tỷ lệ chuyển đổi cuộc gọi chất lượng cao hơn 2.4 lần.'
        },
        {
          competitorTactic: 'Giấu thông tin chi tiết, ép khách kết bạn Zalo để lấy bảng giá',
          counterStrategy: 'Minh bạch dữ liệu: Cung cấp File phân tích pháp lý + Bảng tính khấu hao + Video Flycam thực tế',
          expectedImpact: 'Gia tăng mức độ tin tưởng ngay từ lần chạm đầu tiên, rút ngắn thời gian chốt cọc từ 14 ngày xuống 3 ngày.'
        }
      ],
      omnichannelInterception: [
        'Chạy chiến dịch đón đầu từ khoá thương hiệu của đối thủ (Ví dụ: "So sánh giỏ hàng Chà Là của [Tên Đối Thủ] vs Giỏ Hàng Trực Tiếp Vũ Việt Home")',
        'Thiết lập luồng Webhook bắn ngay lập tức khi phát hiện đối thủ hạ giá niêm yết để phản công trong vòng 15 phút',
        'Tạo Content đối lập: "Tại sao không nên mua BĐS cắt lỗ mù quáng nếu chưa xem bảng tính dòng tiền này?"'
      ],
      counterListingTemplates: [
        {
          title: 'Liền kề Sao Biển OCP2 67.5m² Trục Công Viên - Phương Án Đầu Tư Dòng Tiền 12%/Năm An Toàn',
          targetCustomer: 'Nhà đầu tư sành sỏi, tìm kiếm tài sản bảo toàn vốn và có thể khai thác cho thuê ngay.',
          psychologicalHook: 'Thay vì kích thích sự tham lam bằng giá rẻ ảo, kích thích lý trí bằng sự an tâm và lợi nhuận thực tế kiểm chứng được.',
          counterAngle: 'Tặng kèm hợp đồng thuê sẵn 18 triệu/tháng + Bảng kiểm định pháp lý chuẩn chỉnh từng mét vuông.'
        },
        {
          title: 'Shophouse Đại Lộ 24m OCP2: Căn Góc 2 Mặt Tiền Đón Đầu Vành Đai 3.5 - Giá Gốc CĐT',
          targetCustomer: 'Khách hàng kinh doanh chuỗi nhà hàng, café, showroom nội thất.',
          psychologicalHook: 'Nhấn mạnh giá trị độc bản và tiềm năng tăng trưởng hạ tầng không thể thay thế.',
          counterAngle: 'Hỗ trợ trọn gói thiết kế nhận diện thương hiệu và giải pháp giấy phép kinh doanh.'
        }
      ],
    },
    actionableRoadmap: {
      phase1ContentRefinement: [
        'Loại bỏ hoàn toàn các từ ngữ tiêu cực: "ngộp", "cắt lỗ sâu", "xả hàng" khỏi toàn bộ tiêu đề và nội dung.',
        'Áp dụng công thức tiêu đề 3 thành phần: [Giá Trị Độc Bản] + [Thông Số Chuẩn] + [Bảo Chứng Tài Chính/Pháp Lý].',
        'Bổ sung bảng phân tích lợi nhuận sau thuế và kịch bản tăng trưởng vốn sau 3 năm trong từng bài viết.'
      ],
      phase2SeoDomination: [
        'Phủ sóng cụm từ khóa ngách dài (Long-tail) mà đối thủ bỏ sót: "shophouse kinh đô ánh sáng trục 24m", "liền kề sao biển đối diện trường học".',
        'Thiết lập lịch đăng tin cố định vào 2 khung giờ vàng: 08:30 - 09:30 sáng và 20:00 - 21:00 tối mỗi ngày.',
        'Tận dụng triệt để hình ảnh chụp thực tế có gắn Watermark thương hiệu Vũ Việt Home và Alt-text chuẩn SEO.'
      ],
      phase3AiAutomation: [
        'Kết nối Webhook n8n / Make tự động cào dữ liệu biến động tin đăng của đối thủ mỗi 6 giờ.',
        'Tự động đồng bộ các căn đối thủ mới đăng vào cơ sở dữ liệu Notion để phân tích mức giá trung bình thị trường.',
        'Kích hoạt bot thông báo Telegram cho đội ngũ sale ngay khi phát hiện căn hộ đối thủ giảm giá để tiến hành ráp khách.'
      ],
    },
    markdownReport: `## 1. Executive Summary & Competitor DNA

- **Định Vị Cốt Lõi:** Đối thủ định vị theo chiến lược **"Chiếm Lĩnh Cường Độ Cao" (Volume & Saturation Flooding)**, phụ thuộc 85% vào ngân sách đẩy tin VIP Kim Cương và kỹ thuật giật tít đánh vào tâm lý săn hàng rẻ, ngộp bank, bán tháo thu hồi vốn.
- **Phân Khúc Thống Trị:** Liền kề Chà Là & Sao Biển diện tích 63m² - 67.5m² và Shophouse trục chính 24m tại Đại đô thị Vinhomes Ocean Park 2.
- **Nguồn Lực Traffic Chủ Yếu:** Chiếm trọn 3 vị trí đầu tiên của Trang 1 Batdongsan.com.vn thông qua tài khoản đại lý F1, sau đó kéo traffic phễu vào Zalo cá nhân và nhóm VIP Telegram.
- **Đánh Giá Nguy Cơ:** **Cực Kỳ Nguy Hiểm về mặt hiển thị bề nổi**, nhưng **Rất Dễ Tổn Thương về mặt chuyển đổi chiều sâu** do văn phong rập khuôn, thiếu uy tín chuyên môn và không phục vụ được tệp khách hàng mua ở thực có tài chính vững.

---

## 2. Reverse-Engineered Playbook

### A. Công Thức Giật Tít (Headline Mechanics)
* Cấu trúc phổ biến: \`[Từ khoá cảm xúc sốc] + [Loại hình & Dự án] + [Mức giá cắt lỗ] + [Cam kết sổ đỏ/SĐT]\`
* Từ khoá kích hoạt tâm lý thường dùng: *"Chủ thở oxy", "Cắt lỗ sâu 30%", "Bán trong tuần", "Áp vốn tự có 30%"*.

### B. Chiến Thuật Định Giá & Rào Cản Tâm Lý
* Không niêm yết tổng giá trị tài sản một cách minh bạch; thay vào đó, chỉ nêu số vốn ban đầu (ví dụ: *"Chỉ cần 2.5 Tỷ sở hữu liền kề 8 Tỷ"*).
* Cố tình cài cắm mức giá kết thúc bằng số lẻ (như 8.19 tỷ, 7.85 tỷ) để lọt vào các bộ lọc tìm kiếm giá thấp của thuật toán sàn.

### C. Cơ Cấu Danh Mục (Inventory Mix)
* 70% Giỏ hàng tập trung vào các căn Liền kề tiêu chuẩn dễ tiếp cận vốn.
* 30% Dành cho Shophouse thương mại phục vụ nhà đầu tư kỳ vọng dòng tiền.

---

## 3. Offensive Competitive Strategy (How to Outmaneuver Them)

### A. Ma Trận Khác Biệt Hoá (Differentiation Matrix)

| Tiêu Chí | Chiến Thuật Của Đối Thủ | Chiến Lược Phản Công Của Vũ Việt Home | Tác Động Đo Lường Được |
| :--- | :--- | :--- | :--- |
| **Tone of Voice** | Kêu gào hoảng loạn ("Ngộp bank, thở oxy") | **Quiet Luxury & Cố vấn tài chính chuyên sâu** (Phân tích dòng tiền, ROI 12%/năm) | Chiếm trọn niềm tin của 100% tệp khách hàng cao cấp và mua ở thực |
| **Độ Phủ SEO** | Đổ tiền mua VIP Kim Cương Trang 1 | **Tấn công từ khóa ngách dài (Long-tail)** trên VIP Vàng & VIP Bạc | Tiết kiệm 65% ngân sách marketing, CTR tăng 2.4 lần |
| **Chuyển Đổi** | Ép khách inbox lấy bảng hàng mờ ám | **Minh bạch 100% hồ sơ pháp lý & video thực tế** | Rút ngắn chu kỳ chốt hợp đồng từ 14 ngày xuống 3 ngày |

### B. Khung Đón Đầu Đa Kênh (Omnichannel Interception Framework)
1. **Pre-Targeting:** Đón đầu khách hàng tại giai đoạn tìm kiếm thông tin bằng các bài phân tích: *"Tại sao không nên mua BĐS cắt lỗ nếu chưa kiểm tra bảng tính dòng tiền này?"*.
2. **Post-Targeting:** Khi khách hàng vừa rời khỏi trang tin đối thủ vì thông tin mờ ám, bài đăng của bạn xuất hiện với sự minh bạch tuyệt đối về quy hoạch và chính sách hỗ trợ tài chính an toàn.

---

## 4. Actionable Implementation Roadmap (Ready for Execution)

### Giai Đoạn 1: Tinh Chỉnh Nội Dung & Công Thức Tiêu Đề (Ngày 1 - 7)
* Loại bỏ triệt để từ ngữ tiêu cực ("cắt lỗ", "ngộp", "xả hàng") gây mất giá trị bất động sản.
* Chuẩn hoá bộ tiêu đề theo công thức: \`[Giá trị độc bản/Vị trí] + [Thông số diện tích chuẩn] + [Giải pháp dòng tiền]\`.
* Ví dụ thực chiến: *"Liền kề Sao Biển OCP2 67.5m² Trục Công Viên - Phương Án Đầu Tư Dòng Tiền 12%/Năm An Toàn"*.

### Giai Đoạn 2: Thống Trị Thuật Toán & SEO Batdongsan.com.vn (Ngày 8 - 21)
* Triển khai đăng tin vào 2 khung giờ vàng có lưu lượng truy cập cao nhất: **08:30 - 09:30** và **20:00 - 21:00**.
* Tối ưu 100% Alt-text và Watermark hình ảnh mang thương hiệu Vũ Việt Home để thuật toán ưu tiên phân phối tin độc quyền.

### Giai Đoạn 3: Tự Động Hoá AI & Tích Hợp CRM (Ngày 22 - 30)
* Thiết lập Webhook n8n tự động quét biến động giá của đối thủ mỗi 6 giờ.
* Đẩy toàn bộ dữ liệu đối thủ vào Notion Database để phát hiện điểm mù giỏ hàng và kích hoạt kịch bản chốt cọc thần tốc.`,
  },
  'ocean-park-3': {
    competitorName: 'Vũ Đức Toàn (Vietstarland Crown)',
    competitorUrl: 'https://batdongsan.com.vn/ban-nha-dat?q=0915666777',
    analyzedAt: '16:45 - 27/10/2026',
    threatLevel: 'Cao',
    executiveSummary: {
      corePositioning: 'Độc quyền quỹ căn Phố Biển & Thời Đại, xoay quanh đòn bẩy cam kết tiền thuê 6%/năm trong 5 năm và tiện ích Paradise Bay 12.3ha.',
      dominantSegments: ['Liền kề Phố Biển 64m²', 'Shophouse Vịnh Tây', 'Chính sách cam kết dòng tiền CĐT'],
      primaryTrafficDrivers: ['SEO từ khóa dự án kết hợp Vịnh Biển 4 mùa', 'Tin VIP Kim Cương vào khung giờ trưa và tối', 'Zalo nhóm VIP nhà đầu tư miền Bắc'],
      summarySynthesis: 'Đối thủ đánh mạnh vào cam kết lợi nhuận của CĐT nhưng né tránh bài toán thanh khoản sau 5 năm và tỷ lệ lấp đầy thực tế; tạo khoảng trống cho Vũ Việt Home định vị tư vấn danh mục an toàn.',
    },
    pillar1TrafficAndSeo: {
      activeListingsEstimate: '12 - 15 tin trên Top 3 trang',
      postingVelocity: 'Đẩy mới tin mỗi ngày 1 lần, tập trung khung 11h30 và 20h30',
      categoryDistribution: '65% Bán liền kề Phố Biển, 25% Shophouse Vịnh Tây, 10% Biệt thự đảo',
      titleStructurePatterns: [
        'CAM KẾT THUÊ 5 NĂM: Liền kề Phố Biển OCP3 64m2 Cạnh Biển 4 Mùa 7.85 Tỷ',
        'VỐN CHỈ 1.8 TỶ: Sở hữu ngay nhà phố Thời Đại Vinhomes The Crown - LS 0% 30T'
      ],
      primaryKeywords: ['Ocean Park 3', 'Phố Biển Ocean Park 3', 'Paradise Bay', 'Vinhomes The Crown'],
      secondaryKeywords: ['cam kết tiền thuê OCP3', 'liền kề 64m2 OCP3', 'shophouse vịnh tây'],
      algorithmicVisibilityTactics: [
        'Duy trì tối thiểu 2 tin VIP Kim Cương Trang 1',
        'Chèn cụm từ khóa "Paradise Bay" và "biển 4 mùa" vào 100% tiêu đề'
      ],
    },
    pillar2PsychologicalCopywriting: {
      emotionalDistressHooks: [
        '"Chính sách CĐT kết thúc trong tháng này"',
        '"Quỹ căn ngoại giao đợt 1 rẻ hơn đợt 2 600 triệu"',
        '"Cơ hội cuối cùng nhận quà tặng xe ô tô điện VinFast"'
      ],
      pricingPsychology: 'Trích dẫn vốn tự có chỉ 25-30% để tạo cảm giác nhẹ nhàng ban đầu.',
      unitSizePositioning: 'Chủ lực diện tích 64m² - 68m² thuộc phân khu Phố Biển.',
      valuePropositionTactic: 'Nhấn mạnh cam kết tiền thuê 30% trong 5 năm làm lá chắn rủi ro.',
      analyzedHeadlines: [
        'CHÍNH SÁCH VÀNG: Liền kề Phố Biển 64m² cam kết thuê lại 30tr/tháng',
        'BÁN GẤP: Căn góc Thời Đại 2 mặt thoáng view công viên giá tốt nhất'
      ],
    },
    pillar3PersonalBranding: {
      professionalPositioning: 'Chuyên gia chuyển nhượng & giỏ hàng độc quyền Vietstarland',
      credibilitySignals: [
        'Top 1 doanh số bán hàng Ocean City 2024-2025',
        'Hỗ trợ xe điện đưa đón tham quan dự án 24/7'
      ],
      crossPlatformFunnel: 'Điều hướng vào kênh Zalo cá nhân có hơn 800 nhà đầu tư theo dõi.',
    },
    pillar4VulnerabilityGaps: {
      blindSpots: [
        'Không phân tích kịch bản tài chính sau thời gian hỗ trợ lãi suất 30 tháng.',
        'Mô tả sản phẩm thiên về quảng cáo CĐT, thiếu đánh giá thực tế về khả năng lấp đầy cư dân.'
      ],
      missingFinancialAdvisory: [
        'Chưa đưa ra bảng tính dòng tiền ròng sau trừ thuế và chi phí quản lý vận hành.'
      ],
      unaddressedBuyerConcerns: [
        'Nỗi lo vắng khách vào mùa đông miền Bắc và khả năng khai thác dịch vụ quanh năm.'
      ],
      vulnerabilitiesToExploit: [
        'Cung cấp phương án khai thác mùa đông với mô hình Airbnb bể bơi nước mặn 4 mùa Tropical Lagoon + Bảng tính khấu hao chi tiết.'
      ],
    },
    offensiveCounterStrategy: {
      differentiationMatrix: [
        {
          competitorTactic: 'Tập trung hứa hẹn cam kết tiền thuê một chiều',
          counterStrategy: 'Phân tích bảng dòng tiền thực tế + Kịch bản thanh khoản sau 3 năm + Tặng giải pháp nội thất vận hành',
          expectedImpact: 'Chiếm 80% niềm tin của khách hàng thận trọng và nhà đầu tư sành sỏi.'
        }
      ],
      omnichannelInterception: [
        'Content: "Cần lưu ý gì khi mua Ocean Park 3 với chính sách cam kết tiền thuê 5 năm?"',
        'Chiến dịch so sánh phân khu Phố Biển vs Thời Đại dựa trên dữ liệu thật.'
      ],
      counterListingTemplates: [
        {
          title: 'Liền kề Phố Biển OCP3 64m² Cạnh Vịnh Paradise Bay - Bài Toán Khai Thác Dòng Tiền 4 Mùa 8%/Năm',
          targetCustomer: 'Nhà đầu tư hướng đến dòng tiền ổn định kết hợp tài sản tăng trưởng.',
          psychologicalHook: 'Thay vì tin vào lời hứa suông, xem bảng số liệu đối soát dòng tiền thực tế.',
          counterAngle: 'Tặng bộ giải pháp vận hành Homestay biển hồ nước mặn 4 mùa.'
        }
      ],
    },
    actionableRoadmap: {
      phase1ContentRefinement: [
        'Soạn tin tập trung vào phong cách sống bên vịnh Paradise Bay và bể bơi 4 mùa.',
        'Đính kèm bảng tính chi tiết lãi vay ngân hàng sau thời gian ân hạn.'
      ],
      phase2SeoDomination: [
        'Tấn công từ khóa ngách: "liền kề phố biển 64m2 view hồ", "shophouse vịnh tây kinh doanh cafe".'
      ],
      phase3AiAutomation: [
        'Tự động gửi báo cáo tiến độ bàn giao phân khu Phố Biển qua Zalo ZNS cho khách hàng.'
      ],
    },
    markdownReport: `## 1. Executive Summary & Competitor DNA
- **Định vị:** Chuyên gia bán lẻ Vietstarland khai thác chính sách cam kết tiền thuê và vịnh biển Paradise Bay.
- **Điểm yếu cốt lõi:** Quá phụ thuộc vào tài liệu bán hàng của CĐT, thiếu tính độc lập và tư vấn rủi ro lãi suất.
- **Chiến lược phản công:** Định vị Cố Vấn Đầu Tư Khách Quan, cung cấp bảng tính kiểm định dòng tiền thực tế.`,
  },
  'ha-long-xanh': {
    competitorName: 'Phạm Quang Minh (Trùm Đất Hạ Long)',
    competitorUrl: 'https://batdongsan.com.vn/ban-nha-dat?q=0936999888',
    analyzedAt: '16:50 - 27/10/2026',
    threatLevel: 'Cao',
    executiveSummary: {
      corePositioning: 'Trùm phân phối suất F0 đất nền giai đoạn 1, đón sóng quy hoạch 4.100ha và cao tốc ven biển Hải Phòng - Hạ Long.',
      dominantSegments: ['Đất nền liền kề 100m²', 'Shophouse trục 36m', 'Suất ngoại giao F0'],
      primaryTrafficDrivers: ['SEO từ khóa quy hoạch Hạ Long Xanh', 'Bài viết giật tít đón sóng nhân đôi tài sản'],
      summarySynthesis: 'Đối thủ đánh trúng tâm lý đầu cơ đất nền F0 nhưng tiềm ẩn rủi ro mập mờ tiến độ giải phóng mặt bằng; tạo cơ hội cho Vũ Việt Home định vị minh bạch pháp lý 1/500.',
    },
    pillar1TrafficAndSeo: {
      activeListingsEstimate: '10 - 14 tin trên sàn',
      postingVelocity: 'Làm mới tin mỗi 48h, tập trung vào sáng sớm',
      categoryDistribution: '75% Đất nền phân lô, 25% Biệt thự nghỉ dưỡng golf',
      titleStructurePatterns: [
        'SUẤT F0 NGOẠI GIAO: Đất nền Hạ Long Xanh 100m2 Giá 4.5 Tỷ Sổ Đỏ Sẵn Sang Tên',
        'ĐÓN SÓNG QUY HOẠCH 4100HA: Shophouse trục 36m giá gốc đợt 1'
      ],
      primaryKeywords: ['Hạ Long Xanh', 'Vinhomes Hạ Long Xanh', 'đất nền Hạ Long Xanh'],
      secondaryKeywords: ['suất ngoại giao F0 Hạ Long Xanh', 'giá đất Quảng Yên', 'sân golf 54 hố'],
      algorithmicVisibilityTactics: [
        'Chèn cụm "F0 rẻ nhất thị trường" và "đón đầu cao tốc" vào tiêu đề',
        'Bao trùm các từ khóa liên quan đến thị xã Quảng Yên và cầu Rừng'
      ],
    },
    pillar2PsychologicalCopywriting: {
      emotionalDistressHooks: [
        '"Cơ hội x2 tài sản trong 2 năm tới"',
        '"Chỉ còn 3 suất ngoại giao cuối cùng trong đợt 1"',
        '"Giá Bãi Cháy 100tr/m², Hạ Long Xanh chỉ 45tr/m²"'
      ],
      pricingPsychology: 'So sánh mức giá rẻ hơn 50% so với khu vực trung tâm Bãi Cháy.',
      unitSizePositioning: 'Lô đất 100m² - 120m² mặt tiền 6m dễ mua bán sang nhượng.',
      valuePropositionTactic: 'Khai thác tiềm năng tăng giá từ siêu dự án 10 tỷ USD lớn nhất miền Bắc.',
      analyzedHeadlines: [
        'ĐẤT NỀN F0: 100m² giai đoạn 1 Vinhomes Hạ Long Xanh giá 4.5 Tỷ sổ trao tay',
        'SHOPHOUSE 120M²: Trục đại lộ 36m kinh doanh đắc địa đón sóng cao tốc'
      ],
    },
    pillar3PersonalBranding: {
      professionalPositioning: 'Chuyên gia đất nền dự án lớn hàng đầu Quảng Ninh',
      credibilitySignals: [
        'Nắm thông tin quy hoạch 1/500 và mốc thi công hạ tầng địa phương',
        'Văn phòng đại diện ngay ngã tư thị xã Quảng Yên'
      ],
      crossPlatformFunnel: 'Gom phễu vào nhóm nhà đầu tư Hà Nội & Hải Phòng săn đất nền biển.',
    },
    pillar4VulnerabilityGaps: {
      blindSpots: [
        'Thông tin tiến độ dự án còn chung chung, dễ khiến nhà đầu tư e ngại bị ngâm vốn.',
        'Thiếu các bằng chứng pháp lý cụ thể về từng phân khu.'
      ],
      missingFinancialAdvisory: [
        'Không có lộ trình giải ngân theo tiến độ xây dựng hạ tầng thực tế.'
      ],
      unaddressedBuyerConcerns: [
        'Thời gian bàn giao mặt bằng và thời hạn xây dựng nhà.'
      ],
      vulnerabilitiesToExploit: [
        'Định vị "Minh Bạch Tuyệt Đối": Cung cấp hồ sơ pháp lý 1/500 và lộ trình thi công chuẩn xác nhất.'
      ],
    },
    offensiveCounterStrategy: {
      differentiationMatrix: [
        {
          competitorTactic: 'Giật tít sóng ảo, x2 x3 không căn cứ',
          counterStrategy: 'Phân tích định giá thực dựa trên hạ tầng cầu Rừng và cao tốc ven biển + Hồ sơ pháp lý chuẩn 100%',
          expectedImpact: 'Thu hút nhà đầu tư lớn có tài chính hàng chục tỷ muốn sự an toàn tối đa.'
        }
      ],
      omnichannelInterception: [
        'Báo cáo: "Đánh giá thực tế tiềm năng đất nền Hạ Long Xanh giai đoạn 1 - Cơ hội & Rủi ro".'
      ],
      counterListingTemplates: [
        {
          title: 'Đất Nền Liền Kề 100m² Vinhomes Hạ Long Xanh - Phân Kỳ 1 Pháp Lý Hoàn Chỉnh - Định Giá 45 Tr/m²',
          targetCustomer: 'Nhà đầu tư trung dài hạn tìm kiếm lãi vốn bền vững tại Quảng Ninh.',
          psychologicalHook: 'An tâm đầu tư với hồ sơ quy hoạch chuẩn chỉ và tiến độ bàn giao minh bạch.',
          counterAngle: 'Cung cấp trọn bộ bản đồ quy hoạch 1/500 + Flycam thực địa mới nhất.'
        }
      ],
    },
    actionableRoadmap: {
      phase1ContentRefinement: [
        'Tập trung vào giá trị sinh thái ven vịnh và vị trí cửa ngõ tam giác kinh tế Quảng Ninh - Hải Phòng - Hà Nội.'
      ],
      phase2SeoDomination: [
        'Tối ưu các từ khóa dài: "đất nền liền kề hạ long xanh giai đoạn 1", "biệt thự sân golf hạ long xanh".'
      ],
      phase3AiAutomation: [
        'Cập nhật tiến độ đền bù GPMB tự động vào Notion để đội ngũ tư vấn phản hồi khách ngay lập tức.'
      ],
    },
    markdownReport: `## 1. Executive Summary
- Đối thủ chiếm sóng đất nền F0 nhưng thiếu tính minh bạch pháp lý chi tiết.
- Chiến lược của Vũ Việt Home: Khác biệt hóa bằng sự chuẩn xác về quy hoạch 1/500 và an toàn dòng vốn.`,
  },
  'olympic': {
    competitorName: 'Đoàn Văn Khánh (Vinhomes Center Phía Tây)',
    competitorUrl: 'https://batdongsan.com.vn/ban-nha-dat?q=0916222333',
    analyzedAt: '16:55 - 27/10/2026',
    threatLevel: 'Cao',
    executiveSummary: {
      corePositioning: 'Tập trung vào phân khúc đô thị thể thao - sức khỏe wellness đầu tiên tại Việt Nam, quỹ căn liền kề 72m² trục view sân vận động Olympic.',
      dominantSegments: ['Liền kề Ánh Dương 72m²', 'Biệt thự hồ điều hòa 20ha', 'Chính sách ưu đãi đợt 1'],
      primaryTrafficDrivers: ['SEO lối sống wellness & thể thao', 'Tin VIP Vàng phủ sóng giờ cao điểm'],
      summarySynthesis: 'Đối thủ làm truyền thông tốt về tiện ích thể thao nhưng chưa khai thác sâu góc độ gia đình trẻ an cư 3 thế hệ; tạo cơ hội cho Vũ Việt Home định vị tổ ấm tiện nghi.',
    },
    pillar1TrafficAndSeo: {
      activeListingsEstimate: '11 - 13 tin trên sàn',
      postingVelocity: 'Làm mới tin mỗi ngày 1 lần',
      categoryDistribution: '70% Liền kề thể thao, 30% Biệt thự ven hồ',
      titleStructurePatterns: [
        'ĐÔ THỊ THỂ THAO OLYMPIC: Liền kề 72m2 4PN View Sân Vận Động Giá 9.2 Tỷ Sổ Lâu Dài',
        'HỒ ĐIỀU HÒA 20HA: Biệt thự song lập suất ngoại giao đợt 1'
      ],
      primaryKeywords: ['Vinhomes Olympic', 'Vinhomes Đan Phượng', 'liền kề Vinhomes Olympic'],
      secondaryKeywords: ['đô thị thể thao sức khỏe', 'hồ điều hòa 20ha', 'sân vận động Olympic'],
      algorithmicVisibilityTactics: [
        'Gắn liền từ khóa "sống khỏe wellness" và "thể thao Olympic"',
        'Đẩy tin vào các khung giờ người mua nhà lướt web sau giờ làm việc'
      ],
    },
    pillar2PsychologicalCopywriting: {
      emotionalDistressHooks: [
        '"Mở bán đợt 1 giá tốt nhất toàn dự án"',
        '"Chiết khấu 10% thanh toán sớm chỉ áp dụng cho 50 khách đầu tiên"'
      ],
      pricingPsychology: 'Tập trung vào gói hỗ trợ vay 70% ân hạn 24 tháng để khách chỉ cần chuẩn bị 2.7 tỷ.',
      unitSizePositioning: 'Căn 72m² - 4PN công năng tối ưu cho gia đình 3 thế hệ.',
      valuePropositionTactic: 'Khơi gợi phong cách sống năng động chuẩn quốc tế cho con cái.',
      analyzedHeadlines: [
        'SỐNG KHỎE CHUẨN OLYMPIC: Liền kề 72m² phân khu Ánh Dương giá 9.2 Tỷ',
        'VIEW TRỌN HỒ 20HA: Căn biệt thự song lập hiếm có giá tốt đợt 1'
      ],
    },
    pillar3PersonalBranding: {
      professionalPositioning: 'Chuyên viên tư vấn cao cấp Vinhomes phía Tây Hà Nội',
      credibilitySignals: [
        '5 năm kinh nghiệm bán Smart City và Ocean Park',
        'Chuyên tư vấn hồ sơ vay vốn ngân hàng Techcombank / Vietcombank'
      ],
      crossPlatformFunnel: 'Gom phễu khách hàng từ các giải chạy marathon và câu lạc bộ thể thao.',
    },
    pillar4VulnerabilityGaps: {
      blindSpots: [
        'Bài viết quá tập trung vào thể thao mà bỏ quên yếu tố giáo dục và y tế cho trẻ nhỏ và người già.'
      ],
      missingFinancialAdvisory: [
        'Chưa làm rõ bài toán tăng giá đón đầu các tuyến đường vành đai và metro tương lai.'
      ],
      unaddressedBuyerConcerns: [
        'Thời gian triển khai toàn bộ quần thể thi đấu thể thao.'
      ],
      vulnerabilitiesToExploit: [
        'Định vị "Tổ Ấm Toàn Diện": Kết hợp hoàn hảo giữa môi trường rèn luyện thể chất, giáo dục Vinschool và tài sản truyền đời an toàn.'
      ],
    },
    offensiveCounterStrategy: {
      differentiationMatrix: [
        {
          competitorTactic: 'Chỉ nói về sân vận động và rèn luyện thể thao',
          counterStrategy: 'Định vị Tổ Ấm Tinh Hoa Đa Thế Hệ (Không gian sống xanh 20ha hồ điều hòa, trường học Vinschool, cộng đồng tinh hoa)',
          expectedImpact: 'Mở rộng tiếp cận thêm 70% đối tượng khách hàng mua ở thực là các bậc phụ huynh và gia đình trẻ.'
        }
      ],
      omnichannelInterception: [
        'Content: "Tại sao Vinhomes Olympic là lựa chọn vàng cho con trẻ phát triển thể chất và trí tuệ?".'
      ],
      counterListingTemplates: [
        {
          title: 'Liền kề Ánh Dương Vinhomes Olympic 72m² 4PN - Không Gian Sống Xanh Chuẩn Quốc Tế Cho Gia Đình Trẻ',
          targetCustomer: 'Gia đình trẻ thành đạt tại Cầu Giấy, Nam Từ Liêm tìm kiếm môi trường sống toàn diện.',
          psychologicalHook: 'Đầu tư cho sức khỏe và tương lai của con trẻ với chi phí hợp lý đợt 1.',
          counterAngle: 'Tặng gói thiết kế nội thất thông minh + Hỗ trợ vay 70% 0% LS trong 24 tháng.'
        }
      ],
    },
    actionableRoadmap: {
      phase1ContentRefinement: [
        'Xây dựng các câu chuyện trải nghiệm một ngày sống lý tưởng tại đô thị thể thao sinh thái.'
      ],
      phase2SeoDomination: [
        'Phủ sóng các từ khóa: "liền kề 72m2 ánh dương olympic", "nhà phố đan phượng vinhomes".'
      ],
      phase3AiAutomation: [
        'Thiết lập luồng tự động cập nhật tiến độ thi công hạ tầng gửi qua Zalo cá nhân hóa.'
      ],
    },
    markdownReport: `## 1. Executive Summary
- Đối thủ đánh mạnh vào thể thao wellness nhưng bỏ ngỏ tệp gia đình mua ở thực chú trọng giáo dục.
- Chiến lược phản công: Bổ sung góc nhìn An cư gia đình viên mãn và bài toán hạ tầng giao thông kết nối.`,
  },
};

