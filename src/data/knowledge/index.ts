import fs from 'fs';
import path from 'path';

export interface ProjectKnowledgeItem {
  id: string;
  name: string;
  aliases: string[];
  province: string;
  defaultBroker: 'le_yen' | 'vu_viet';
  defaultPhone: string;
  defaultContactName: string;
  markdownContent: string;
}

// In-memory bundled project knowledge bases for instant access & Gemini prompt grounding
export const PROJECT_KNOWLEDGE_BASE: Record<string, ProjectKnowledgeItem> = {
  'ocean-park-1': {
    id: 'ocean-park-1',
    name: 'Vinhomes Ocean Park 1',
    aliases: ['ocean park 1', 'ocean park gia lâm', 'quận 1 ocean city', 'gia lâm', 'hải âu 1', 'hải âu 2', 'sao biển 1', 'ngọc trai ocean park', 'san hô ocean park'],
    province: 'Hà Nội (Gia Lâm)',
    defaultBroker: 'le_yen',
    defaultPhone: '0918 600 050',
    defaultContactName: 'Ms Yến',
    markdownContent: `# TRI THỨC DỰ ÁN: VINHOMES OCEAN PARK 1 (GIA LÂM - HÀ NỘI)
- Tên chính thức: Vinhomes Ocean Park (Quận 1 Ocean City)
- Địa chỉ: Gia Lâm, Hà Nội
- Tiện ích độc quyền: Hồ điều hòa nước ngọt trung tâm 24.5ha, Biển hồ nước mặn nhân tạo Crystal Lagoon 6.1ha, Đại học VinUni, Vincom Mega Mall, Vinmec, Vinschool.
- Phân khu nổi bật: Hải Âu (100% shophouse thương mại kinh doanh tự do, sát chung cư & hồ), Sao Biển, San Hô, Ngọc Trai (compound khép kín).
- Pháp lý: Sổ đỏ lâu dài sở hữu vĩnh viễn, sẵn sàng công chứng ngay.
- CẤM NHẦM: Không gán công viên sóng Wave Park (của OP2) hay Vịnh thiên đường Paradise Bay (của OP3).`
  },
  'ocean-park-2': {
    id: 'ocean-park-2',
    name: 'Vinhomes Ocean Park 2',
    aliases: ['ocean park 2', 'the empire', 'quận 2 ocean city', 'hưng yên', 'văn giang', 'chà là', 'sao biển 2', 'kinh đô ánh sáng', 'đảo dừa', 'cọ xanh'],
    province: 'Hưng Yên (Văn Giang)',
    defaultBroker: 'le_yen',
    defaultPhone: '0918 600 050',
    defaultContactName: 'Ms Yến',
    markdownContent: `# TRI THỨC DỰ ÁN: VINHOMES OCEAN PARK 2 (THE EMPIRE - HƯNG YÊN)
- Tên chính thức: Vinhomes Ocean Park 2 - The Empire (Quận 2 Ocean City)
- Địa chỉ: Xã Nghĩa Trụ & Long Hưng, Văn Giang, Hưng Yên (sát Vành đai 3.5 & cao tốc HN - HP)
- Tiện ích độc quyền: Tổ hợp công viên sóng nhân tạo lớn nhất thế giới VinWonders Wave Park 18ha, Đại lộ Kinh Đô Ánh Sáng Kingdom Avenue, Công viên ven kênh Silk Park 2.6km, Vincom Mega Mall phong cách sóng, Vinmec Resort 5 sao.
- 8 Phân khu: Chà Là (kinh doanh sầm uất), Sao Biển (100% shophouse mở), Kinh Đô Ánh Sáng (phố đi bộ biểu tượng), San Hô, Cọ Xanh, Hải Âu, Đảo Dừa (compound nhiệt đới), Ngọc Trai (biệt thự đảo hoàng gia).
- Pháp lý: Sổ đỏ lâu dài / HĐMB trực tiếp CĐT, hỗ trợ vay 70%, ân hạn 24-36 tháng.
- CẤM NHẦM: Không phải Gia Lâm Hà Nội. Không gán biển nước mặn 4 mùa Tropical Lagoon (của OP3) hay hồ nước ngọt 24.5ha (của OP1).`
  },
  'ocean-park-3': {
    id: 'ocean-park-3',
    name: 'Vinhomes Ocean Park 3',
    aliases: ['ocean park 3', 'the crown', 'quận 3 ocean city', 'vịnh thiên đường', 'paradise bay', 'phố biển', 'thời đại', 'vịnh tây', 'vịnh xanh', 'ánh dương'],
    province: 'Hưng Yên (Văn Giang & Yên Mỹ)',
    defaultBroker: 'le_yen',
    defaultPhone: '0918 600 050',
    defaultContactName: 'Ms Yến',
    markdownContent: `# TRI THỨC DỰ ÁN: VINHOMES OCEAN PARK 3 (THE CROWN - HƯNG YÊN)
- Tên chính thức: Vinhomes Ocean Park 3 - The Crown (Quận 3 Ocean City)
- Địa chỉ: Huyện Văn Giang & Yên Mỹ, Hưng Yên (kết nối trực tiếp Ocean Park 2)
- Tiện ích độc quyền: Vịnh biển kỳ quan Paradise Bay 12.3ha, Biển hồ nước mặn 4 mùa trong nhà Tropical Lagoon lớn nhất Việt Nam (tắm biển 365 ngày), hồ bơi chuẩn Olympic, công viên nước mini Aqua Bay, liền kề Mega Grand World.
- 8 Phân khu: Phố Biển (kinh doanh homestay & F&B sát vịnh), Thời Đại (cửa ngõ giáp chung cư & trường học), Vịnh Tây, Vịnh Thiên Đường, Ánh Dương, Vịnh Xanh (compound), Hải Đăng, Đảo Ngọc.
- Chính sách cam kết: Cam kết tiền thuê 5 - 6%/năm trong 5 năm, ân hạn nợ gốc và lãi suất 0% 24 - 30 tháng.
- CẤM NHẦM: Không gán công viên sóng 18ha (của OP2).`
  },
  'ha-long-xanh': {
    id: 'ha-long-xanh',
    name: 'Vinhomes Hạ Long Xanh',
    aliases: ['hạ long xanh', 'ha long xanh', 'quảng ninh', 'quảng yên', 'quang ninh', 'vinhomes green hạ long', 'kỳ quan biển', 'golf hạ long'],
    province: 'Quảng Ninh (Quảng Yên & TP Hạ Long)',
    defaultBroker: 'vu_viet',
    defaultPhone: '090.223.5050',
    defaultContactName: 'Mr Việt',
    markdownContent: `# TRI THỨC DỰ ÁN: VINHOMES HẠ LONG XANH (QUẢNG NINH)
- Tên chính thức: Đại Đô Thị Vinhomes Hạ Long Xanh (Vinhomes Green Hạ Long)
- Địa chỉ: Thị xã Quảng Yên & TP. Hạ Long, Tỉnh Quảng Ninh (sát cao tốc ven biển và cầu Bến Rừng nối Hải Phòng)
- Quy mô kỷ lục: 4.109 ha ven vịnh di sản Vịnh Hạ Long, tổng mức đầu tư 10 tỷ USD.
- Tiện ích độc quyền: Sân golf 54 hố chuẩn PGA quốc tế ven biển, bến du thuyền quốc tế 5 sao, công viên chủ đề Safari bán hoang dã, trung tâm tài chính ven vịnh, hệ thống Vincom, Vinmec, Vinschool.
- Sản phẩm chính: Đất nền phân lô & Liền kề (90m² - 120m²), Shophouse trục đại lộ 36m-50m, Biệt thự song lập và đơn lập view biển & sân golf.
- Pháp lý & Giá: Đất ở đô thị sổ đỏ lâu dài từng lô, giá F0 chỉ từ 40 - 55 triệu/m² (tiềm năng tăng vốn x2 theo tiến độ hạ tầng cầu Rừng và thị xã lên thành phố).
- CẤM NHẦM: Nằm tại Quảng Ninh, không thuộc Hà Nội hay Hưng Yên. Giọng văn nam Mr Việt bóc tách số liệu vĩ mô và dòng tiền đầu tư dài hạn.`
  },
  'king-park-bac-ninh': {
    id: 'king-park-bac-ninh',
    name: 'Khu Đô Thị King Park Bắc Ninh',
    aliases: ['king park', 'bắc ninh', 'bac ninh', 'king park plaza'],
    province: 'Bắc Ninh',
    defaultBroker: 'vu_viet',
    defaultPhone: '090.223.5050',
    defaultContactName: 'Mr Việt',
    markdownContent: `# TRI THỨC DỰ ÁN: KHU ĐÔ THỊ KING PARK BẮC NINH
- Tên chính thức: Khu Đô Thị King Park Bắc Ninh
- Địa chỉ: Trục kết nối trung tâm TP. Bắc Ninh và các khu công nghiệp FDI trọng điểm (Samsung Yên Phong, Quế Võ)
- Khai thác: Liền kề & Shophouse hoàn thiện mặt ngoài, chuyên phục vụ ở và cho thuê chuyên gia nước ngoài Hàn Quốc, Đài Loan, Nhật Bản dòng tiền 8-10%/năm.
- Pháp lý: Sổ đỏ lâu dài trao tay từng lô, hạ tầng hoàn thiện 100%.
- Môi giới: Mr Việt 090.223.5050 (tư vấn pháp lý và tỷ suất sinh lời thực tế).`
  },
  'olympic': {
    id: 'olympic',
    name: 'Đại Đô Thị Vinhomes Olympic Hà Nội',
    aliases: ['olympic', 'đan phượng', 'vinhomes wonder park', 'wonder park'],
    province: 'Hà Nội (Phía Tây)',
    defaultBroker: 'vu_viet',
    defaultPhone: '090.223.5050',
    defaultContactName: 'Mr Việt',
    markdownContent: `# TRI THỨC DỰ ÁN: ĐẠI ĐÔ THỊ VINHOMES OLYMPIC HÀ NỘI
- Tên chính thức: Đại Đô Thị Vinhomes Olympic Hà Nội
- Địa chỉ: Khu đô thị sinh thái thể thao, cửa ngõ phía Tây Hà Nội
- Tiện ích: Tổ hợp sân vận động Olympic, đường chạy bộ sinh thái, khu thể thao tích hợp, Vincom Mega Mall, trường Vinschool.
- Loại hình: Liền kề, Shophouse thể thao sinh thái, Biệt thự sinh thái vườn.
- Môi giới: Mr Việt 090.223.5050.`
  }
};

/**
 * Find matched project knowledge based on any keyword, project name, or unit code
 */
export function matchProjectKnowledge(input: string): ProjectKnowledgeItem | null {
  if (!input) return null;
  const norm = input.toLowerCase().trim();

  // Check direct keys
  if (PROJECT_KNOWLEDGE_BASE[norm]) {
    return PROJECT_KNOWLEDGE_BASE[norm];
  }

  // Check aliases and names
  for (const item of Object.values(PROJECT_KNOWLEDGE_BASE)) {
    if (norm.includes(item.id) || norm.includes(item.name.toLowerCase())) {
      return item;
    }
    for (const alias of item.aliases) {
      if (norm.includes(alias)) {
        return item;
      }
    }
  }

  return null;
}
