import { ProjectFormData, DriveImage } from '../types';

// Project-level facts only. Unit data (area, price, frontage, ...) and market numbers are NEVER preset:
// they come from the sale's own input and from real scraped listings.
export interface ProjectPreset {
  id: string;
  name: string;
  batdongsanUrl: string;
  data: ProjectFormData; // project-level fields filled, every unit field empty
}

const baseForm = (f: Partial<ProjectFormData> & Pick<ProjectFormData, 'projectName' | 'address' | 'contactName' | 'phone' | 'personaVoice' | 'targetKeywords'>): ProjectFormData => ({
  subdivision: '',
  propertyType: '',
  area: '',
  bedrooms: '',
  bathrooms: '',
  price: '',
  pricePerM2: '',
  legal: '',
  amenities: '',
  keyHighlights: '',
  orientation: '',
  frontage: '',
  floors: '',
  constructionArea: '',
  ...f,
});

/** Form for a freshly selected project: keeps project-level fields, clears everything about a specific unit. */
export const projectBaseForm = (p: ProjectPreset): ProjectFormData => ({ ...p.data });

export const FOUR_VINHOMES_PROJECTS: ProjectPreset[] = [
  {
    id: 'ocean-park-2',
    name: 'Vinhomes Ocean Park 2',
    batdongsanUrl: 'https://batdongsan.com.vn/nha-dat-ban-vinhomes-ocean-park-2',
    data: baseForm({
      projectName: 'Vinhomes Ocean Park 2 - The Empire',
      address: 'Đại đô thị Vinhomes Ocean Park 2, Xã Nghĩa Trụ, Huyện Văn Giang, Tỉnh Hưng Yên',
      contactName: 'Ms Yến',
      phone: '0918 600 050',
      personaVoice: 'le_yen',
      targetKeywords: ['Vinhomes Ocean Park 2', 'mua liền kề Ocean Park 2', 'bán shophouse Sao Biển Ocean Park 2', 'cắt lỗ Ocean Park 2', 'giá nhà Vinhomes The Empire'],
    }),
  },
  {
    id: 'ocean-park-3',
    name: 'Vinhomes Ocean Park 3',
    batdongsanUrl: 'https://batdongsan.com.vn/ban-nha-biet-thu-lien-ke-vinhomes-ocean-park-3',
    data: baseForm({
      projectName: 'Vinhomes Ocean Park 3 - The Crown',
      address: 'Đại đô thị Vinhomes Ocean Park 3, Xã Tân Lập & Nghĩa Trụ, Huyện Văn Giang, Hưng Yên',
      contactName: 'Ms Yến',
      phone: '0918 600 050',
      personaVoice: 'le_yen',
      targetKeywords: ['Vinhomes Ocean Park 3', 'Vinhomes The Crown', 'mua liền kề Ocean Park 3', 'Phố Biển Ocean Park 3', 'bán shophouse Vịnh Tây'],
    }),
  },
  {
    id: 'ha-long-xanh',
    name: 'Vinhomes Hạ Long Xanh',
    batdongsanUrl: 'https://batdongsan.com.vn/ban-nha-biet-thu-lien-ke-vinhomes-global-gate-ha-long',
    data: baseForm({
      projectName: 'Đại Đô Thị Vinhomes Hạ Long Xanh',
      address: 'Thị xã Quảng Yên và TP. Hạ Long, Tỉnh Quảng Ninh',
      contactName: 'Mr Việt',
      phone: '090.223.5050',
      personaVoice: 'vu_viet',
      targetKeywords: ['Vinhomes Hạ Long Xanh', 'đất nền Vinhomes Hạ Long Xanh', 'giá bán Vinhomes Hạ Long Xanh', 'biệt thự biển Hạ Long Xanh', 'đầu tư BĐS Quảng Ninh'],
    }),
  },
  {
    id: 'olympic',
    name: 'Vinhomes Olympic Hà Nội',
    batdongsanUrl: 'https://batdongsan.com.vn/ban-nha-biet-thu-lien-ke-khu-do-thi-the-thao-olympic',
    data: baseForm({
      projectName: 'Đại Đô Thị Vinhomes Olympic Hà Nội',
      address: 'Khu đô thị sinh thái thể thao Olympic, Phía Tây Hà Nội',
      contactName: 'Mr Việt',
      phone: '090.223.5050',
      personaVoice: 'vu_viet',
      targetKeywords: ['Vinhomes Olympic', 'Vinhomes Đan Phượng', 'mua liền kề Vinhomes Olympic', 'giá bán Vinhomes Olympic', 'shophouse Vinhomes Olympic'],
    }),
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
