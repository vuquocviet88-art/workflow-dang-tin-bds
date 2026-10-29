import { DriveImage, PhotoPlanProposal, ProjectFormData } from '../types';
import { generateSeoFilename, toSlug } from '../lib/driveService';

export const COMPREHENSIVE_BROLL_LIBRARY: DriveImage[] = [
  // 1. Vin Ocean City - Hải Âu & Thấp Tầng
  {
    id: 'broll-oc-01',
    title: 'Phối cảnh toàn cảnh phân khu Hải Âu & Trục đường lớn',
    originalUrl: 'https://drive.google.com/file/d/broll-oc-01/view',
    thumbnailUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    directViewUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85',
    webUrl: 'https://drive.google.com/file/d/broll-oc-01/view',
    isCover: true,
    isSelected: true,
    category: 'Ảnh Bìa / Hero Shot',
    categoryType: 'hero',
    sourceOrigin: 'broll_library',
  },
  {
    id: 'broll-oc-02',
    title: 'Mặt tiền căn nhà góc rộng, vỉa hè lát đá 5m, đường thông 13m',
    originalUrl: 'https://drive.google.com/file/d/broll-oc-02/view',
    thumbnailUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
    directViewUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1600&q=85',
    webUrl: 'https://drive.google.com/file/d/broll-oc-02/view',
    isCover: false,
    isSelected: true,
    category: 'Mặt tiền & Đường trước nhà',
    categoryType: 'facade',
    sourceOrigin: 'broll_library',
  },
  {
    id: 'broll-oc-03',
    title: 'Trục đường nội khu ô tô đỗ và lưu thông 2 chiều thuận tiện',
    originalUrl: 'https://drive.google.com/file/d/broll-oc-03/view',
    thumbnailUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
    directViewUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=85',
    webUrl: 'https://drive.google.com/file/d/broll-oc-03/view',
    isCover: false,
    isSelected: true,
    category: 'Mặt tiền & Đường trước nhà',
    categoryType: 'facade',
    sourceOrigin: 'broll_library',
  },
  {
    id: 'broll-oc-04',
    title: 'Không gian phòng khách tầng 1 thông thoáng, sàn ốp cao cấp',
    originalUrl: 'https://drive.google.com/file/d/broll-oc-04/view',
    thumbnailUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80',
    directViewUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=85',
    webUrl: 'https://drive.google.com/file/d/broll-oc-04/view',
    isCover: false,
    isSelected: true,
    category: 'Không gian nội thất / Hiện trạng',
    categoryType: 'interior',
    sourceOrigin: 'broll_library',
  },
  {
    id: 'broll-oc-05',
    title: 'Khu vực bếp và bàn ăn gia đình thiết kế mở hiện đại',
    originalUrl: 'https://drive.google.com/file/d/broll-oc-05/view',
    thumbnailUrl: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80',
    directViewUrl: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1600&q=85',
    webUrl: 'https://drive.google.com/file/d/broll-oc-05/view',
    isCover: false,
    isSelected: true,
    category: 'Không gian nội thất / Hiện trạng',
    categoryType: 'interior',
    sourceOrigin: 'broll_library',
  },
  {
    id: 'broll-oc-06',
    title: 'Phòng ngủ Master tầng 2 có ban công đón gió trong lành',
    originalUrl: 'https://drive.google.com/file/d/broll-oc-06/view',
    thumbnailUrl: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80',
    directViewUrl: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1600&q=85',
    webUrl: 'https://drive.google.com/file/d/broll-oc-06/view',
    isCover: false,
    isSelected: true,
    category: 'Không gian nội thất / Hiện trạng',
    categoryType: 'interior',
    sourceOrigin: 'broll_library',
  },
  {
    id: 'broll-oc-07',
    title: 'Sơ đồ mặt bằng chi tiết 5 tầng & Kích thước xây dựng',
    originalUrl: 'https://drive.google.com/file/d/broll-oc-07/view',
    thumbnailUrl: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80',
    directViewUrl: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1600&q=85',
    webUrl: 'https://drive.google.com/file/d/broll-oc-07/view',
    isCover: false,
    isSelected: true,
    category: 'Pháp lý & Sơ đồ thửa đất',
    categoryType: 'legal',
    sourceOrigin: 'broll_library',
  },
  {
    id: 'broll-oc-08',
    title: 'Biển hồ nước mặn Crystal Lagoon & Bãi cát trắng trải dài',
    originalUrl: 'https://drive.google.com/file/d/broll-oc-08/view',
    thumbnailUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    directViewUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=85',
    webUrl: 'https://drive.google.com/file/d/broll-oc-08/view',
    isCover: false,
    isSelected: true,
    category: 'B-roll Tiện ích phân khu',
    categoryType: 'amenity',
    sourceOrigin: 'broll_library',
  },
  {
    id: 'broll-oc-09',
    title: 'Công viên nội khu Silk Park, máy tập gym ngoài trời và đường dạo',
    originalUrl: 'https://drive.google.com/file/d/broll-oc-09/view',
    thumbnailUrl: 'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?auto=format&fit=crop&w=800&q=80',
    directViewUrl: 'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?auto=format&fit=crop&w=1600&q=85',
    webUrl: 'https://drive.google.com/file/d/broll-oc-09/view',
    isCover: false,
    isSelected: true,
    category: 'B-roll Tiện ích phân khu',
    categoryType: 'amenity',
    sourceOrigin: 'broll_library',
  },
  {
    id: 'broll-oc-10',
    title: 'Trường học liên cấp quốc tế Vinschool cách nhà 200m',
    originalUrl: 'https://drive.google.com/file/d/broll-oc-10/view',
    thumbnailUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80',
    directViewUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1600&q=85',
    webUrl: 'https://drive.google.com/file/d/broll-oc-10/view',
    isCover: false,
    isSelected: true,
    category: 'B-roll Tiện ích phân khu',
    categoryType: 'amenity',
    sourceOrigin: 'broll_library',
  },
  {
    id: 'broll-oc-11',
    title: 'Phố thương mại sầm uất, hàng quán sáng đèn nhộn nhịp ban đêm',
    originalUrl: 'https://drive.google.com/file/d/broll-oc-11/view',
    thumbnailUrl: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=800&q=80',
    directViewUrl: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1600&q=85',
    webUrl: 'https://drive.google.com/file/d/broll-oc-11/view',
    isCover: false,
    isSelected: true,
    category: 'B-roll Nhịp sống & Kinh doanh',
    categoryType: 'lifestyle',
    sourceOrigin: 'broll_library',
  },
  {
    id: 'broll-oc-12',
    title: 'Xe điện VinBus chạy 24/7 đón trả ngay trước cổng phân khu',
    originalUrl: 'https://drive.google.com/file/d/broll-oc-12/view',
    thumbnailUrl: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=800&q=80',
    directViewUrl: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=1600&q=85',
    webUrl: 'https://drive.google.com/file/d/broll-oc-12/view',
    isCover: false,
    isSelected: true,
    category: 'B-roll Nhịp sống & Kinh doanh',
    categoryType: 'lifestyle',
    sourceOrigin: 'broll_library',
  },

  // 2. Vin Hạ Long Xanh B-roll
  {
    id: 'broll-hl-01',
    title: 'Flycam toàn cảnh vịnh di sản và quỹ đất ven biển Hạ Long Xanh',
    originalUrl: 'https://drive.google.com/file/d/broll-hl-01/view',
    thumbnailUrl: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80',
    directViewUrl: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1600&q=85',
    webUrl: 'https://drive.google.com/file/d/broll-hl-01/view',
    isCover: false,
    isSelected: false,
    category: 'Ảnh Bìa / Hero Shot',
    categoryType: 'hero',
    sourceOrigin: 'broll_library',
  },
  {
    id: 'broll-hl-02',
    title: 'Sân golf 54 hố chuẩn PGA quốc tế và clubhouse sang trọng',
    originalUrl: 'https://drive.google.com/file/d/broll-hl-02/view',
    thumbnailUrl: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?auto=format&fit=crop&w=800&q=80',
    directViewUrl: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?auto=format&fit=crop&w=1600&q=85',
    webUrl: 'https://drive.google.com/file/d/broll-hl-02/view',
    isCover: false,
    isSelected: false,
    category: 'B-roll Tiện ích phân khu',
    categoryType: 'amenity',
    sourceOrigin: 'broll_library',
  },

  // 3. Vin Olympic B-roll
  {
    id: 'broll-ol-01',
    title: 'Quần thể tổ hợp thể thao Olympic và hồ điều hòa cảnh quan 20ha',
    originalUrl: 'https://drive.google.com/file/d/broll-ol-01/view',
    thumbnailUrl: 'https://images.unsplash.com/photo-1508873696983-2df5293cb39f?auto=format&fit=crop&w=800&q=80',
    directViewUrl: 'https://images.unsplash.com/photo-1508873696983-2df5293cb39f?auto=format&fit=crop&w=1600&q=85',
    webUrl: 'https://drive.google.com/file/d/broll-ol-01/view',
    isCover: false,
    isSelected: false,
    category: 'Ảnh Bìa / Hero Shot',
    categoryType: 'hero',
    sourceOrigin: 'broll_library',
  },
  {
    id: 'broll-ol-02',
    title: 'Đường chạy bộ thể thao rợp bóng cây xanh ven hồ sinh thái',
    originalUrl: 'https://drive.google.com/file/d/broll-ol-02/view',
    thumbnailUrl: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=800&q=80',
    directViewUrl: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=1600&q=85',
    webUrl: 'https://drive.google.com/file/d/broll-ol-02/view',
    isCover: false,
    isSelected: false,
    category: 'B-roll Nhịp sống & Kinh doanh',
    categoryType: 'lifestyle',
    sourceOrigin: 'broll_library',
  },
];

// Generate structured photo proposal tailored to listing details
export function generatePhotoPlanProposal(projectData: ProjectFormData): PhotoPlanProposal {
  const isOcean = (projectData.projectName || '').toLowerCase().includes('ocean');
  const isHaLong = (projectData.projectName || '').toLowerCase().includes('hạ long');
  const isOlympic = (projectData.projectName || '').toLowerCase().includes('olympic');
  const sub = projectData.subdivision || 'Hải Âu';
  const type = projectData.propertyType || 'Liền kề';
  const price = projectData.price || '7 tỷ';

  const amenityDesc = isHaLong
    ? 'Sân golf 54 hố PGA, bến du thuyền 5 sao, đường bao biển'
    : isOlympic
    ? 'Hồ điều hòa 20ha, sân vận động tiêu chuẩn Olympic, công viên thể thao'
    : 'Biển hồ nước mặn Crystal Lagoon, công viên Silk Park, Vincom, Vinschool';

  return {
    totalRecommended: 15,
    overviewSummary: `Đề xuất bộ ảnh chuẩn 15 ảnh cho ${type} ${sub} (${price}) - Tối ưu tỷ lệ click CTR trên Batdongsan.com.vn và giữ chân người mua nhà.`,
    categories: [
      {
        id: 'cat-hero',
        category: '1. Ảnh Bìa / Hero Shot',
        categoryKey: 'hero',
        targetCount: '1 - 2 ảnh',
        title: 'Ảnh Bìa Chính Diện & Phối Cảnh Góc Rộng',
        description: 'Mặt tiền căn nhà hoặc phối cảnh phân khu toàn cảnh sắc nét, ánh sáng tự nhiên ban ngày, thể hiện sự khang trang, bề thế.',
        seoTagSuggestion: `${toSlug(projectData.projectName)}-${toSlug(sub)}-anh-bia-hero`,
        recommendedAngle: 'Góc 3/4 chính diện hoặc flycam từ trên cao đón ánh sáng sớm.',
      },
      {
        id: 'cat-facade',
        category: '2. Mặt Tiền & Tuyến Đường Trực Diện',
        categoryKey: 'facade',
        targetCount: '2 - 3 ảnh',
        title: 'Lòng Đường Trước Nhà & Không Gian Đỗ Xe',
        description: 'Thể hiện rõ mặt tiền căn nhà, vỉa hè lát đá, lòng đường thông thoáng (tối thiểu 13m - 30m), ô tô đỗ và di chuyển 2 chiều.',
        seoTagSuggestion: `${toSlug(projectData.projectName)}-${toSlug(sub)}-mat-tien-duong-thong`,
        recommendedAngle: 'Góc đứng từ vỉa hè đối diện lấy trọn chiều cao 5 tầng và độ rộng đường.',
      },
      {
        id: 'cat-interior',
        category: '3. Không Gian Nội Thất / Hiện Trạng Bàn Giao',
        categoryKey: 'interior',
        targetCount: '3 - 5 ảnh',
        title: 'Không Gian Tầng 1, Bếp, Phòng Ngủ Master, Ban Công',
        description: 'Tầng 1 kinh doanh/tiếp khách, khu bếp, các tầng ngủ phía trên, ban công view thoáng mát và giếng trời đón sinh khí.',
        seoTagSuggestion: `${toSlug(projectData.projectName)}-${toSlug(sub)}-noi-that-tang-1`,
        recommendedAngle: 'Góc rộng ống kính 16-24mm bao quát góc phòng, mở hết rèm cửa đón sáng.',
      },
      {
        id: 'cat-legal',
        category: '4. Sơ Đồ Thửa Đất & Pháp Lý Sổ Đỏ',
        categoryKey: 'legal',
        targetCount: '1 - 2 ảnh',
        title: 'Bản Vẽ Layout Phân Căn & Ảnh Sổ Đỏ Cầm Tay',
        description: 'Trích lục bản vẽ mặt bằng từng tầng, hình chụp sổ đỏ/sổ hồng (che mờ số seri/tên chủ nhà nhạy cảm để tạo uy tín tuyệt đối).',
        seoTagSuggestion: `${toSlug(projectData.projectName)}-${toSlug(sub)}-so-do-phap-ly-so-do`,
        recommendedAngle: 'Chụp thẳng góc trên xuống rõ ràng, tương phản cao, dễ nhìn kích thước số đo.',
      },
      {
        id: 'cat-amenity',
        category: '5. B-roll Tiện Ích Đẳng Cấp Phân Khu',
        categoryKey: 'amenity',
        targetCount: '3 - 4 ảnh',
        title: 'Tiện Ích Nội Ngoại Khu Liền Kề',
        description: `${amenityDesc}. Giúp người mua hình dung trọn vẹn đặc quyền phong cách sống nghỉ dưỡng.`,
        seoTagSuggestion: `${toSlug(projectData.projectName)}-tien-ich-cao-cap`,
        recommendedAngle: 'Ảnh phong cảnh đẹp góc rộng, hồ nước xanh biếc, cây cối xanh tươi.',
      },
      {
        id: 'cat-lifestyle',
        category: '6. B-roll Nhịp Sống & Tiềm Năng Khai Thác',
        categoryKey: 'lifestyle',
        targetCount: '2 - 3 ảnh',
        title: 'Cư Dân Nhộn Nhịp, Phố Đêm & Hạ Tầng Kết Nối',
        description: 'Hình ảnh cư dân sinh hoạt thực tế, phố ẩm thực sáng đèn kinh doanh buôn bán tấp nập, trạm sạc và xe buýt điện VinBus.',
        seoTagSuggestion: `${toSlug(projectData.projectName)}-nhip-song-kinh-doanh-sam-uat`,
        recommendedAngle: 'Góc chụp đời sống tự nhiên, ánh đèn hoàng hôn hoặc buổi tối lung linh.',
      },
    ],
  };
}

// Filter or enrich library images with SEO filenames
export function getRecommendedPhotosForProject(projectData: ProjectFormData): DriveImage[] {
  const pName = (projectData.projectName || '').toLowerCase();
  
  let targetPhotos = COMPREHENSIVE_BROLL_LIBRARY.filter((img) => {
    if (pName.includes('hạ long') || pName.includes('ha long')) {
      return img.id.startsWith('broll-hl') || img.categoryType === 'interior' || img.categoryType === 'legal';
    }
    if (pName.includes('olympic')) {
      return img.id.startsWith('broll-ol') || img.categoryType === 'interior' || img.categoryType === 'legal';
    }
    // Default Ocean City
    return img.id.startsWith('broll-oc');
  });

  if (targetPhotos.length === 0) {
    targetPhotos = COMPREHENSIVE_BROLL_LIBRARY.slice(0, 12);
  }

  // Populate SEO filenames according to convention
  return targetPhotos.map((img, index) => ({
    ...img,
    isSelected: true,
    isCover: index === 0,
    seoFilename: generateSeoFilename(projectData, img.categoryType || 'anh', img.title, index),
  }));
}
