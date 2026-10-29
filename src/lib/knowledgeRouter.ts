import { ProjectKnowledgeBaseItem, ContextInjectionMatchResult } from '../types';

// Default knowledge base entries initialized with standard markdown documents
export const DEFAULT_KNOWLEDGE_BASES: Record<string, ProjectKnowledgeBaseItem> = {
  'ocean-park-2': {
    id: 'ocean-park-2',
    name: 'Vinhomes Ocean Park 2 - The Empire',
    filename: 'vinhomes-ocean-park-2-the-empire.md',
    updatedAt: '29/10/2026',
    version: '2.4.0',
    sizeKb: 4.8,
    tags: ['Văn Giang', 'Hưng Yên', 'Ocean City', 'Wave Park', 'Kinh Đô Ánh Sáng'],
    subdivisions: [
      'Sao Biển',
      'Chà Là',
      'Đảo Dừa',
      'Hải Âu',
      'Cọ Xanh',
      'Kinh Đô Ánh Sáng',
      'San Hô',
      'Ánh Dương',
    ],
    productTypes: [
      'Liền kề tiêu chuẩn',
      'Liền kề xẻ khe / căn góc',
      'Shophouse kinh doanh thương mại',
      'Biệt thự song lập',
      'Biệt thự đơn lập',
    ],
    keyAmenities: [
      'Công viên biển tạo sóng VinWonders Wave Park 18ha lớn nhất thế giới',
      'Đại lộ Kinh Đô Ánh Sáng Kingdom Avenue 51m & Quảng trường Empire Square',
      'Công viên trung tâm Empire Park 7.5ha liên hoàn',
      'Công viên ven sông Silk Park dài 2.6km',
      'TTTM Vincom Mega Mall Life-Design lớn nhất miền Bắc',
      'Bệnh viện Vinmec Health Resort 5 sao & 18 căn biệt thự tổng thống',
      'Hệ thống trường học liên cấp Vinschool quốc tế',
      'Mạng lưới xe bus điện VinBus nội ngoại khu',
    ],
    markdownContent: `# CƠ SỞ TRI THỨC DỰ ÁN: VINHOMES OCEAN PARK 2 - THE EMPIRE
> Mã định danh: ocean-park-2
> Ngày cập nhật: 29/10/2026
> Phiên bản: 2.4.0 (Chuẩn hóa dữ liệu quy hoạch thực tế)
> Đơn vị quản lý: Vũ Việt Property Knowledge Base

---

## 1. TỔNG QUAN DỰ ÁN & VỊ TRÍ CHIẾN LƯỢC
- Tên dự án chính thức: Vinhomes Ocean Park 2 - The Empire (thuộc quần thể Siêu đô thị biển Ocean City 1.200ha)
- Chủ đầu tư: Tập đoàn Vingroup / Vinhomes
- Vị trí: Xã Nghĩa Trụ và Long Hưng, Huyện Văn Giang, Tỉnh Hưng Yên
- Quy mô: 458,4 ha, dân số dự kiến ~65.000 người
- Hạ tầng giao thông & Kết nối vùng:
  * Trực tiếp nút giao Vành đai 3.5 và Cao tốc Hà Nội - Hải Phòng (QL5B).
  * 3 phút kết nối Vinhomes Ocean Park 1 qua đường gom cao tốc và cầu vượt Vành đai 3.5.
  * 5 phút kết nối sang Vinhomes Ocean Park 3 - The Crown.
  * 15 phút tới cầu Vĩnh Tuy, cầu Thanh Trì; 25 phút tới Hồ Hoàn Kiếm (trung tâm Hà Nội).
  * 35 phút tới sân bay quốc tế Nội Bài qua cao tốc kết nối cầu Thanh Trì / cầu Nhật Tân.

---

## 2. QUY HOẠCH & CHI TIẾT 8 PHÂN KHU
### Phân khu Sao Biển (Kinh doanh sầm uất nhất)
- Định vị: Phân khu kinh doanh mở 100%, tọa lạc giữa 2 đại kỳ quan: Công viên Wave Park và Đại lộ Kinh Đô Ánh Sáng.
- Phong cách kiến trúc: Pháp tân cổ điển (French Neoclassical).
- Loại hình: Liền kề thương mại (shophouse), Biệt thự song lập, Biệt thự đơn lập.
- Đặc điểm nổi bật: 100% các căn đều có thể kinh doanh tự do hoặc cho thuê làm nhà hàng, cafe, spa, văn phòng; nằm sát 10 tòa chung cư cao tầng Masterise / Vinsmart.

### Phân khu Chà Là (Phân khu về ở sớm nhất & thanh khoản nhanh)
- Định vị: Phân khu mở, cảnh quan phong cách Đông Dương (Indochine).
- Loại hình: Liền kề (48m² - 58.5m² - 63m² - 70m²), Shophouse đại lộ Chà Là 20m, Biệt thự song lập.
- Đặc điểm nổi bật: Phân khu bàn giao đầu tiên, cư dân về ở đông đúc nhất; sở hữu 3 công viên nội khu (Lễ Hội, Âm Nhạc, Nghệ Thuật), đối diện trường học Vinschool và bệnh viện Vinmec.

### Phân khu Đảo Dừa (Khu Compound khép kín VIP nhất)
- Định vị: Phân khu compound khép kín biệt lập 100%, an ninh đa lớp 24/7.
- Phong cách kiến trúc: Nhiệt đới Florida sang trọng, bao bọc bởi nhánh sông sinh thái Silk Park.
- Loại hình: Liền kề, Biệt thự song lập, Biệt thự đơn lập.
- Đặc điểm nổi bật: Sở hữu Clubhouse riêng tư hồ bơi mái kính bốn mùa phong cách hoàng gia, không gian sống nghỉ dưỡng thượng lưu tĩnh lặng.

### Phân khu Hải Âu (Phong cách Địa Trung Hải ven sông)
- Định vị: Phân khu mở hài hòa giữa ở và kinh doanh nhẹ.
- Phong cách: Địa Trung Hải với mái vòm thoáng đãng, mặt tiền rộng.
- Loại hình: Liền kề, Biệt thự song lập, Shophouse đường Hải Âu 24m.
- Đặc điểm nổi bật: Dải công viên Silk Park trải dài ven sông sinh thái, gần công viên trung tâm Empire Park.

### Phân khu Cọ Xanh (Phong cách Florida sinh thái)
- Định vị: Không gian sống năng động bên 2 công viên xanh.
- Phong cách: Florida nhiệt đới Mỹ.
- Loại hình: Liền kề (64m² - 75m² - 80m²), Biệt thự song lập (110m² - 136m²).
- Đặc điểm nổi bật: Tiếp giáp công viên The Wave Island và Silk Park; gần nút giao cao tốc thuận tiện đi lại.

### Phân khu Kinh Đô Ánh Sáng (Trái tim phố đi bộ ẩm thực & lễ hội)
- Định vị: Khu shophouse phố đi bộ sầm uất bậc nhất miền Bắc.
- Phong cách: Pháp cổ điển Paris lãng mạn.
- Loại hình: Shophouse thương mại, Biệt thự song lập phố đi bộ.
- Đặc điểm nổi bật: Trục đại lộ Kingdom Avenue 51m với tượng thần Ánh Sáng 50m, tháp đồng hồ, hoạt động kinh doanh 24/7.

### Phân khu San Hô (View trực diện biển tạo sóng)
- Định vị: Phân khu mở lớn nhất dự án, nằm kế bên công viên sóng VinWonders Wave Park 18ha.
- Phong cách: Châu Âu hiện đại năng động.
- Loại hình: Liền kề, Shophouse đại lộ San Hô 51m, Biệt thự song lập ven hồ cát trắng.

### Phân khu Ánh Dương (Phong cách Ý hiện đại)
- Định vị: Nằm giữa đại lộ San Hô và công viên Silk Park.
- Phong cách: Ý tinh tế, tối giản sang trọng.
- Loại hình: Liền kề, Biệt thự tứ lập, Shophouse thương mại.

---

## 3. LOẠI HÌNH SẢN PHẨM & TIÊU CHUẨN XÂY DỰNG
- Liền kề tiêu chuẩn: Diện tích đất 48m², 56m², 63m², 65m², 70m², 75m², 80m². Mặt tiền: 4m - 5m. Chiều cao: 5 tầng. DTSXD: 180m² - 280m².
- Liền kề xẻ khe / Căn góc: Diện tích 90m² - 120m², mặt tiền 6.5m - 8m, sân vườn bên hông thoáng đãng.
- Shophouse kinh doanh: Trục đường 13m, 20m, 24m, 30m, 51m. Tối ưu kinh doanh tầng 1-2, tầng 3-5 ở hoặc cho thuê.
- Biệt thự Song lập: 110m² - 162m², mặt tiền 8m - 10m, xây 4 tầng.
- Biệt thự Đơn lập: 200m² - 465m², 4 mặt thoáng view hồ / sông.

---

## 4. HỆ THỐNG ĐẠI TIỆN ÍCH ALL-IN-ONE
1. Tổ hợp biển tạo sóng VinWonders Wave Park 18ha (6 hồ tạo sóng cao tới 3m, bãi cát trắng Nha Trang 24.000m²).
2. Đại lộ Kinh Đô Ánh Sáng Kingdom Avenue 51m & tháp Ánh Sáng 50m.
3. Công viên trung tâm Empire Park 7.5ha.
4. Công viên ven sông Silk Park dài 2.6km.
5. TTTM Vincom Mega Mall Life-Design.
6. Bệnh viện Vinmec Health Resort 5 sao & 18 biệt thự tổng thống.
7. Hệ thống giáo dục Vinschool liên cấp chuẩn quốc tế.
8. Mạng lưới xe bus điện VinBus kết nối toàn Ocean City.

---

## 5. PHÁP LÝ & CHÍNH SÁCH BÁN HÀNG TIÊU CHUẨN
- Hình thức sở hữu: Sổ đỏ lâu dài (người Việt Nam), sẵn sàng sang tên công chứng.
- Hỗ trợ vay bank: 70% - 80% (Techcombank, Vietcombank), ân hạn nợ gốc và 0% lãi suất.`,
  },

  'ocean-park-1': {
    id: 'ocean-park-1',
    name: 'Vinhomes Ocean Park 1',
    filename: 'vinhomes-ocean-park-1.md',
    updatedAt: '29/10/2026',
    version: '2.3.0',
    sizeKb: 4.2,
    tags: ['Gia Lâm', 'Hà Nội', 'Biển hồ nước mặn', 'Hồ Ngọc Trai', 'TechnoPark', 'VinUni'],
    subdivisions: ['Hải Âu', 'Sao Biển', 'San Hô', 'Ngọc Trai'],
    productTypes: [
      'Liền kề / Shophouse Hải Âu & Sao Biển',
      'Biệt thự song lập',
      'Biệt thự đơn lập',
      'Căn hộ cao cấp Sapphire, Zenpark, Pavilion',
    ],
    keyAmenities: [
      'Biển hồ nước mặn Crystal Lagoon 6.1ha lớn nhất Việt Nam',
      'Hồ ngọc trai cát trắng tự nhiên 24.5ha',
      'Đại học Tinh hoa VinUni phong cách Gothic châu Âu',
      'Tòa nhà văn phòng TechnoPark thông minh top 10 thế giới',
      'TTTM Vincom Mega Mall Ocean Park',
      'Bệnh viện Vinmec & Trường Vinschool liên cấp',
    ],
    markdownContent: `# CƠ SỞ TRI THỨC DỰ ÁN: VINHOMES OCEAN PARK 1 - THÀNH PHỐ BIỂN HỒ
> Mã định danh: ocean-park-1
> Ngày cập nhật: 29/10/2026
> Phiên bản: 2.3.0
> Đơn vị quản lý: Vũ Việt Property Knowledge Base

---

## 1. TỔNG QUAN DỰ ÁN & VỊ TRÍ CHIẾN LƯỢC
- Tên dự án chính thức: Vinhomes Ocean Park (Gia Lâm, Hà Nội) - Quận 1 Ocean City
- Chủ đầu tư: Tập đoàn Vingroup
- Vị trí: Thị trấn Trâu Quỳ, Huyện Gia Lâm, Hà Nội
- Quy mô: 420 ha, mật độ xây dựng ~19%
- Giao thông: Trực diện cao tốc Hà Nội - Hải Phòng, QL5A, nút giao Cổ Linh, cầu Vĩnh Tuy, cầu Thanh Trì.

---

## 2. QUY HOẠCH & CÁC PHÂN KHU THẤP TẦNG CHÍNH
### Phân khu Hải Âu (Thiên đường kinh doanh biển hồ)
- Định vị: 100% căn thấp tầng được kinh doanh như Shophouse. Kiến trúc Đông Dương Indochine.
- Loại hình: Liền kề thương mại (HA1, HA2, HA3...), Song lập, Đơn lập mặt hồ cát trắng.
- Đặc điểm: Sát 10 tòa chung cư Sapphire & Masteri, dòng khách kinh doanh đông đúc 24/7.

### Phân khu Sao Biển (Kề Vincom Mega Mall)
- Định vị: Phân khu mở năng động, tiếp giáp TTTM Vincom và biển hồ nước mặn.
- Đặc điểm: Vừa ở vừa kinh doanh đắc địa, trục đường 52m lớn nhất dự án.

### Phân khu San Hô (Bên hồ Ngọc Trai & VinUni)
- Định vị: View hồ cát trắng 24.5ha và đại học tinh hoa VinUni, kế bên bệnh viện Vinmec.

### Phân khu Ngọc Trai (Compound khép kín thượng lưu)
- Định vị: Đảo ngọc khép kín compound 100%, an ninh 24/7, bao quanh bởi sông hồ xanh mát.

---

## 3. LOẠI HÌNH SẢN PHẨM & TIÊU CHUẨN XÂY DỰNG
- Liền kề / Shophouse Hải Âu & Sao Biển: 56m² - 90m², mặt tiền 4m - 5.5m, xây 4-5 tầng.
- Biệt thự Song lập: 122m² - 150m², xây 3 tầng 1 tum.
- Biệt thự Đơn lập: 250m² - 380m² view trọn biển hồ cát trắng.

---

## 4. HỆ THỐNG ĐẠI TIỆN ÍCH ALL-IN-ONE
1. Biển hồ nước mặn Crystal Lagoon 6.1ha.
2. Hồ nước ngọt trung tâm 24.5ha bãi cát trắng mịn.
3. Đại học Quốc tế VinUni.
4. Tòa tháp thông minh TechnoPark Tower.
5. Vincom Mega Mall Ocean Park & Vinmec, Vinschool.

---

## 5. PHÁP LÝ & TÌNH TRẠNG CHUYỂN NHƯỢNG
- Pháp lý: 100% căn thấp tầng đã có Sổ đỏ sở hữu lâu dài sẵn sàng công chứng sang tên ngay trong 24h.`,
  },

  'ocean-park-3': {
    id: 'ocean-park-3',
    name: 'Vinhomes Ocean Park 3 - The Crown',
    filename: 'vinhomes-ocean-park-3-the-crown.md',
    updatedAt: '29/10/2026',
    version: '2.2.0',
    sizeKb: 4.1,
    tags: ['Văn Giang', 'Văn Lâm', 'Paradise Bay', 'Bể bơi Four Seasons', 'Vịnh Tây', 'Phố Biển'],
    subdivisions: [
      'Phố Biển',
      'Vịnh Tây',
      'Vịnh Thiên Đường',
      'Thời Đại',
      'Vịnh Xanh',
      'Ánh Dương',
      'Hải Đăng',
      'Đảo Ngọc',
    ],
    productTypes: ['Liền kề', 'Shophouse', 'Biệt thự song lập', 'Biệt thự đơn lập', 'Biệt thự đảo'],
    keyAmenities: [
      'Vịnh biển bốn mùa Paradise Bay 12ha & Biển hồ nước mặn Tropical Lagoon 2.8ha',
      'Bể bơi bốn mùa trong nhà Four Seasons mái kính bơi lội 365 ngày',
      'Công viên nước Aqua Bay do VinWonders thiết kế',
      'Hồ bơi Olympic chuẩn thi đấu 14 làn bơi',
      'Đại lộ Bốn Mùa rộng 51m kết nối toàn dự án',
    ],
    markdownContent: `# CƠ SỞ TRI THỨC DỰ ÁN: VINHOMES OCEAN PARK 3 - THE CROWN
> Mã định danh: ocean-park-3
> Ngày cập nhật: 29/10/2026
> Phiên bản: 2.2.0
> Đơn vị quản lý: Vũ Việt Property Knowledge Base

---

## 1. TỔNG QUAN DỰ ÁN & VỊ TRÍ CHIẾN LƯỢC
- Tên dự án: Vinhomes Ocean Park 3 - The Crown (Quận 3 Ocean City)
- Vị trí: Xã Nghĩa Trụ và Tân Quang, Hưng Yên. Liền kề nút giao Vành đai 3.5 và Cao tốc 5B.
- Quy mô: 294 ha, tổng vốn hơn 32.000 tỷ đồng.

---

## 2. QUY HOẠCH & CHI TIẾT 8 PHÂN KHU
### Phân khu Phố Biển (Kế sát Vịnh Paradise Bay)
- Định vị: Phân khu kinh doanh mở, kế sát công viên biển Paradise Bay 12ha và công viên nước Aqua Bay.

### Phân khu Vịnh Tây (Kiến trúc Đông Dương tân thời)
- Định vị: Phân khu mở vừa ở vừa kinh doanh, đối diện cụm chung cư cao tầng và Vinschool.
- Loại hình: Liền kề (52m² - 68m² - 75m²), Song lập, Shophouse đại lộ.

### Phân khu Vịnh Thiên Đường (Trái tim Vịnh biển 12ha)
- Định vị: Ôm trọn công viên Paradise Bay, bể bơi Four Seasons mái kính.

### Phân khu Thời Đại (Cửa ngõ dự án)
- Định vị: Cửa ngõ kết nối Vành đai 3.5 và đại lộ Bốn Mùa 51m, cư dân về ở sớm.

### Phân khu Vịnh Xanh & Đảo Ngọc
- Vịnh Xanh: Compound phong cách Hy Lạp ven sông sinh thái.
- Đảo Ngọc: Siêu compound đảo nổi kim cương biệt lập 100%.

---

## 3. LOẠI HÌNH SẢN PHẨM & TIÊU CHUẨN XÂY DỰNG
- Liền kề: 52m², 56m², 60m², 68m², 75m², xây 5 tầng kiên cố.
- Shophouse: Mặt đường 20m - 51m, diện tích 75m² - 120m².
- Biệt thự Song lập: 120m² - 180m², mặt tiền 8m - 10m.

---

## 4. HỆ THỐNG ĐẠI TIỆN ÍCH ALL-IN-ONE
1. Vịnh biển bốn mùa Paradise Bay 12ha.
2. Bể bơi trong nhà Four Seasons bơi 365 ngày/năm.
3. Biển hồ cát trắng nhiệt đới Tropical Lagoon 2.8ha.
4. Công viên nước Aqua Bay cảm giác mạnh.
5. Hồ bơi thi đấu Olympic 14 làn.

---

## 5. PHÁP LÝ & CHÍNH SÁCH BÁN HÀNG
- Pháp lý: Đầy đủ 1/500, bàn giao cấp sổ đỏ lâu dài, hỗ trợ vay 70%, ân hạn 0% lãi suất.`,
  },

  'ha-long-xanh': {
    id: 'ha-long-xanh',
    name: 'Vinhomes Hạ Long Xanh',
    filename: 'vinhomes-ha-long-xanh.md',
    updatedAt: '29/10/2026',
    version: '2.1.0',
    sizeKb: 3.9,
    tags: ['Quảng Ninh', 'Hạ Long', 'Quảng Yên', 'Ven biển di sản', 'Sân golf 36 lỗ', 'Bến du thuyền'],
    subdivisions: [
      'Shophouse Thương Cảng & Phố Đi Bộ',
      'Biệt Thự Đảo Sinh Thái',
      'Khu Resort Nghỉ Dưỡng',
      'Khu Công Nghệ Cao',
    ],
    productTypes: ['Shophouse biển thương mại', 'Liền kề sinh thái', 'Biệt thự song lập ven biển', 'Biệt thự đơn lập mặt vịnh'],
    keyAmenities: [
      'Sân golf quốc tế 36 lỗ chuẩn PGA ven biển',
      'Công viên giải trí VinWonders safari & thủy cung ngầm lớn nhất châu Á',
      'Bến du thuyền siêu sang Marina Bay chuẩn quốc tế',
      'Hệ thống cáp treo vượt biển nối các phân khu du lịch',
      'Đại lộ hoa biển & quảng trường nhạc nước',
    ],
    markdownContent: `# CƠ SỞ TRI THỨC DỰ ÁN: ĐẠI KỲ QUAN ĐÔ THỊ VINHOMES HẠ LONG XANH
> Mã định danh: ha-long-xanh
> Ngày cập nhật: 29/10/2026
> Phiên bản: 2.1.0
> Đơn vị quản lý: Vũ Việt Property Knowledge Base

---

## 1. TỔNG QUAN DỰ ÁN & VỊ TRÍ CHIẾN LƯỢC
- Tên dự án: Vinhomes Hạ Long Xanh (Quảng Yên - TP Hạ Long, Quảng Ninh)
- Quy mô: 4.109 ha, vốn đầu tư hơn 232.000 tỷ đồng (gần 10 tỷ USD).
- Kết nối: Nằm trên cao tốc Hà Nội - Hải Phòng - Hạ Long - Vân Đồn; 10 phút sang Hải Phòng qua cầu Bạch Đằng; 15 phút tới Bãi Cháy.

---

## 2. QUY HOẠCH & ĐẶC TÍNH SẢN PHẨM
- Shophouse thương cảng & bến du thuyền: Tuyến phố ven biển 10km, đón khách du lịch quốc tế.
- Liền kề sinh thái: 65m² - 90m², thiết kế sân vườn.
- Biệt thự ven biển & đơn lập mặt vịnh: 200m² - 1.000m² view trọn vịnh di sản UNESCO.

---

## 3. TIỆN ÍCH & PHÁP LÝ
- Tiện ích: Sân golf PGA 36 lỗ, Safari & thủy cung, bến du thuyền Marina Bay, cáp treo vượt biển.
- Pháp lý: Phê duyệt quy hoạch 1/500, đất ở sở hữu lâu dài.`,
  },

  'king-park-bac-ninh': {
    id: 'king-park-bac-ninh',
    name: 'Khu Đô Thị King Park Bắc Ninh',
    filename: 'khu-do-thi-king-park-bac-ninh.md',
    updatedAt: '29/10/2026',
    version: '2.0.0',
    sizeKb: 3.5,
    tags: ['Bắc Ninh', 'FDI Chuyên gia', 'Shophouse kinh doanh', 'Lý Thái Tổ', 'Dòng tiền cho thuê'],
    subdivisions: ['Shophouse Kinh Doanh Quốc Tế', 'Liền Kề Nhà Vườn An Cư', 'Biệt Thự Phố Chuyên Gia'],
    productTypes: ['Liền kề tiêu chuẩn', 'Shophouse thương mại', 'Biệt thự song lập'],
    keyAmenities: [
      'Công viên trung tâm King Park Central & hồ điều hòa',
      'Khu phố đi bộ ẩm thực Hàn - Nhật',
      'TTTM dịch vụ cao tầng & rạp chiếu phim',
      'Hệ thống an ninh camera thông minh 24/7',
    ],
    markdownContent: `# CƠ SỞ TRI THỨC DỰ ÁN: KHU ĐÔ THỊ KING PARK BẮC NINH
> Mã định danh: king-park-bac-ninh
> Ngày cập nhật: 29/10/2026
> Phiên bản: 2.0.0
> Đơn vị quản lý: Vũ Việt Property Knowledge Base

---

## 1. TỔNG QUAN & VỊ TRÍ
- Vị trí: Trung tâm TP Bắc Ninh, kết nối trục đường Lý Thái Tổ, Trần Hưng Đạo.
- Tiềm năng: Đón sóng hơn 60.000 chuyên gia FDI Hàn Quốc, Nhật Bản tại KCN Quế Võ và Yên Phong (Samsung).
- Pháp lý: Sổ đỏ lâu dài từng lô, sang tên công chứng ngay.

---

## 2. QUY HOẠCH & SẢN PHẨM
- Liền kề 75m² - 90m²: Xây 4-5 tầng, cho chuyên gia thuê dòng tiền 25 - 35 triệu/tháng.
- Shophouse thương mại mặt đường 24-30m: Phục vụ chuỗi nhà hàng ẩm thực và dịch vụ tài chính.`,
  },

  'olympic': {
    id: 'olympic',
    name: 'Đại Đô Thị Vinhomes Olympic Hà Nội',
    filename: 'dai-do-thi-vinhomes-olympic.md',
    updatedAt: '29/10/2026',
    version: '2.0.0',
    sizeKb: 3.6,
    tags: ['Đan Phượng', 'Tây Thăng Long', 'Hà Nội', 'Đô thị thể thao', 'Olympic Park'],
    subdivisions: ['Olympic Garden', 'Lakeview Avenue', 'Compound Hoàng Gia'],
    productTypes: ['Liền kề tiêu chuẩn', 'Shophouse thương mại', 'Biệt thự song lập', 'Biệt thự đơn lập'],
    keyAmenities: [
      'Quần thể liên hợp thể thao Olympic Park hơn 150 sân tập',
      'Hồ điều hòa sinh thái trung tâm và quảng trường ngắm cảnh',
      'TTTM Vincom Mega Mall phía Tây',
      'Bệnh viện Vinmec & Vinschool',
      'Tuyến VinBus nội ngoại khu',
    ],
    markdownContent: `# CƠ SỞ TRI THỨC DỰ ÁN: ĐẠI ĐÔ THỊ VINHOMES OLYMPIC HÀ NỘI
> Mã định danh: olympic
> Ngày cập nhật: 29/10/2026
> Phiên bản: 2.0.0
> Đơn vị quản lý: Vũ Việt Property Knowledge Base

---

## 1. TỔNG QUAN & VỊ TRÍ
- Vị trí: Đan Phượng - Hoài Đức, phía Tây Hà Nội.
- Trực diện Đại lộ Tây Thăng Long 60m vào hồ Tây 15 phút, kết nối Vành đai 3.5 & Vành đai 4.
- Pháp lý: Quy hoạch 1/500, sở hữu lâu dài (sổ hồng từng căn).

---

## 2. QUY HOẠCH & SẢN PHẨM
- Liền kề 60m² - 85m²: Xây 4 tầng 1 tum.
- Shophouse mặt đại lộ lớn: 90m² - 130m².
- Quần thể thể thao Olympic Park hơn 150 sân bóng, tennis, pickleball, hồ bơi Olympic.`,
  },
};

// In-memory runtime cache for edited/uploaded knowledge bases
const runtimeKnowledgeCache: Map<string, ProjectKnowledgeBaseItem> = new Map(
  Object.entries(DEFAULT_KNOWLEDGE_BASES)
);

// Get list of all available project knowledge base items
export function getAllKnowledgeBases(): ProjectKnowledgeBaseItem[] {
  return Array.from(runtimeKnowledgeCache.values());
}

// Helper: Match project ID by input project name or fuzzy string
export function resolveProjectId(projectNameOrId: string = ''): string {
  const norm = (projectNameOrId || '').toLowerCase().trim();
  if (!norm) return 'ocean-park-2';

  if (norm === 'ocean-park-2' || norm.includes('ocean park 2') || norm.includes('the empire') || norm.includes('kinh đô')) {
    return 'ocean-park-2';
  }
  if (norm === 'ocean-park-1' || norm.includes('ocean park 1') || norm.includes('hải âu 1') || norm.includes('ngọc trai')) {
    return 'ocean-park-1';
  }
  if (norm === 'ocean-park-3' || norm.includes('ocean park 3') || norm.includes('the crown') || norm.includes('paradise bay') || norm.includes('vịnh tây') || norm.includes('phố biển')) {
    return 'ocean-park-3';
  }
  if (norm === 'ha-long-xanh' || norm.includes('hạ long') || norm.includes('ha long') || norm.includes('quảng yên')) {
    return 'ha-long-xanh';
  }
  if (norm === 'king-park-bac-ninh' || norm.includes('king park') || norm.includes('bắc ninh')) {
    return 'king-park-bac-ninh';
  }
  if (norm === 'olympic' || norm.includes('olympic') || norm.includes('đan phượng') || norm.includes('tây thăng long')) {
    return 'olympic';
  }

  // Fallback to match by tags or existing keys
  for (const [key, item] of runtimeKnowledgeCache.entries()) {
    if (item.name.toLowerCase().includes(norm) || norm.includes(item.name.toLowerCase())) {
      return key;
    }
  }

  return 'ocean-park-2';
}

// Get specific knowledge base item
export function getKnowledgeBase(projectIdOrName: string): ProjectKnowledgeBaseItem {
  const id = resolveProjectId(projectIdOrName);
  return runtimeKnowledgeCache.get(id) || DEFAULT_KNOWLEDGE_BASES['ocean-park-2'];
}

// Helper: Escape string for safe use in RegExp
export function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Robust dynamic extractor for subdivisions from any markdown format
export function extractSubdivisionsFromMarkdown(content: string): string[] {
  const subs: string[] = [];
  const lines = (content || '').split('\n');

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Pattern 1: Heading with "Phân khu" e.g. "### Phân khu Sao Biển (Kinh doanh...)"
    const pkMatch = trimmed.match(/^(?:#{2,4}|[-*•]|\*\*)\s*(?:Phân khu\s+)?([a-zA-Zà-ỹÀ-Ỹ0-9\s]+)/i);
    if (pkMatch && pkMatch[1]) {
      // Check if line mentions "Phân khu" or is a section under Planning
      if (/phân khu/i.test(trimmed)) {
        let name = trimmed.replace(/^(?:#{2,4}|[-*•]|\*\*)\s*/, '');
        name = name.replace(/^Phân khu\s+/i, '');
        // Clean trailing notes, parentheses, colons
        name = name.split(/[\(:—–\-*]/)[0].trim();
        if (
          name.length >= 2 &&
          name.length <= 35 &&
          !/^(chi tiết|tổng quan|loại hình|tiện ích|pháp lý|các phân khu|8 phân khu)/i.test(name)
        ) {
          if (!subs.some((s) => s.toLowerCase() === name.toLowerCase())) {
            subs.push(name);
          }
        }
      }
    }
  }

  // Fallback: If no "Phân khu" prefix was used, look under heading "QUY HOẠCH" or "PHÂN KHU"
  if (subs.length === 0) {
    let inPlanning = false;
    for (const line of lines) {
      const trimmed = line.trim();
      if (/^##+\s*.*(?:quy hoạch|phân khu)/i.test(trimmed)) {
        inPlanning = true;
        continue;
      }
      if (inPlanning && /^##\s+[^#]/i.test(trimmed)) {
        inPlanning = false;
        continue;
      }
      if (inPlanning && /^###\s+/.test(trimmed)) {
        let name = trimmed.replace(/^###\s+/, '').split(/[\(:—–\-*]/)[0].trim();
        name = name.replace(/^Phân khu\s+/i, '').trim();
        if (name && name.length >= 2 && name.length <= 35) {
          if (!subs.some((s) => s.toLowerCase() === name.toLowerCase())) {
            subs.push(name);
          }
        }
      }
    }
  }

  return subs;
}

// Robust dynamic extractor for key amenities from markdown
export function extractAmenitiesFromMarkdown(content: string): string[] {
  const amenities: string[] = [];
  const lines = (content || '').split('\n');
  let inAmenitySection = false;

  for (const line of lines) {
    const trimmed = line.trim();
    if (/^##+\s*.*(?:tiện ích|all-in-one)/i.test(trimmed)) {
      inAmenitySection = true;
      continue;
    }
    if (inAmenitySection && /^##\s+[^#]/i.test(trimmed)) {
      inAmenitySection = false;
      continue;
    }
    if (inAmenitySection && trimmed.length > 5) {
      const clean = trimmed
        .replace(/^[\d+.*•\-–]+\s*/, '')
        .replace(/^[A-Z\d]+\.\s*/, '')
        .trim();
      if (clean && clean.length > 5 && !clean.startsWith('#')) {
        amenities.push(clean);
      }
    }
  }

  return amenities;
}

// Robust dynamic extractor for product types from markdown
export function extractProductTypesFromMarkdown(content: string): string[] {
  const types: string[] = [];
  const lines = (content || '').split('\n');
  let inProductSection = false;

  for (const line of lines) {
    const trimmed = line.trim();
    if (/^##+\s*.*(?:loại hình|sản phẩm)/i.test(trimmed)) {
      inProductSection = true;
      continue;
    }
    if (inProductSection && /^##\s+[^#]/i.test(trimmed)) {
      inProductSection = false;
      continue;
    }
    if (inProductSection && trimmed.length > 3) {
      const clean = trimmed.replace(/^[\d+.*•\-–]+\s*/, '').split(/[:\-–]/)[0].trim();
      if (clean && clean.length >= 3 && clean.length <= 40 && !clean.startsWith('#')) {
        if (!types.some((t) => t.toLowerCase() === clean.toLowerCase())) {
          types.push(clean);
        }
      }
    }
  }

  return types;
}

// Extract subdivision specific text cleanly from markdown without regex failure
export function extractSubdivisionBlock(markdown: string, subName: string): string {
  if (!markdown || !subName) return '';
  const cleanTarget = subName.toLowerCase().trim();
  const lines = markdown.split('\n');

  let startIdx = -1;
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i].toLowerCase().trim();
    if (
      l.includes(cleanTarget) &&
      (l.startsWith('#') || l.startsWith('-') || l.startsWith('*') || l.includes('phân khu'))
    ) {
      startIdx = i;
      break;
    }
  }

  if (startIdx === -1) {
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].toLowerCase().includes(cleanTarget)) {
        startIdx = i;
        break;
      }
    }
  }

  if (startIdx === -1) return '';

  const snippetLines: string[] = [lines[startIdx]];
  for (let i = startIdx + 1; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    if (/^#{2,3}\s+/.test(trimmed) || /^---\s*$/.test(trimmed)) {
      break;
    }
    snippetLines.push(line);
  }

  return snippetLines.join('\n').trim();
}

// Update or store a project knowledge base item (e.g. when user updates MD file)
export function updateKnowledgeBase(
  id: string,
  updatedData: Partial<ProjectKnowledgeBaseItem> & { markdownContent: string }
): ProjectKnowledgeBaseItem {
  const targetId = resolveProjectId(id);
  const current = getKnowledgeBase(targetId);

  const content = updatedData.markdownContent || current.markdownContent;
  const sizeKb = +(new Blob([content]).size / 1024).toFixed(1);

  // Extract dynamically from markdown content
  const parsedSubs = extractSubdivisionsFromMarkdown(content);
  const parsedAmenities = extractAmenitiesFromMarkdown(content);
  const parsedTypes = extractProductTypesFromMarkdown(content);

  const merged: ProjectKnowledgeBaseItem = {
    ...current,
    ...updatedData,
    markdownContent: content,
    sizeKb,
    updatedAt: updatedData.updatedAt || new Date().toLocaleDateString('vi-VN'),
    subdivisions: parsedSubs.length > 0 ? parsedSubs : current.subdivisions,
    keyAmenities: parsedAmenities.length > 0 ? parsedAmenities : current.keyAmenities,
    productTypes: parsedTypes.length > 0 ? parsedTypes : current.productTypes,
  };

  runtimeKnowledgeCache.set(targetId, merged);
  return merged;
}

// =========================================================================
// SMART ROUTER & MATCHER ENGINE (Context Injection)
// =========================================================================
export interface MatcherInputParams {
  projectName: string;
  subdivision?: string;
  propertyType?: string;
  area?: string;
  price?: string;
  amenities?: string;
  keyHighlights?: string;
  customMarkdown?: string;
}

/**
 * Smart Router / Matcher:
 * Filters relevant project data chunks instead of dumping the whole knowledge base.
 * Injects targeted, high-relevance facts: Subdivision planning, product type standard specs,
 * nearby utilities, and verified location links.
 */
export function matchAndInjectContext(params: MatcherInputParams): ContextInjectionMatchResult {
  const kb = getKnowledgeBase(params.projectName);
  const activeMarkdown = params.customMarkdown || kb.markdownContent;

  // Extract current subdivisions, amenities, types dynamically from the active markdown
  const dynamicSubs = extractSubdivisionsFromMarkdown(activeMarkdown);
  const availableSubdivisions = dynamicSubs.length > 0 ? dynamicSubs : kb.subdivisions;

  const dynamicAmenities = extractAmenitiesFromMarkdown(activeMarkdown);
  const availableAmenities = dynamicAmenities.length > 0 ? dynamicAmenities : kb.keyAmenities;

  const dynamicTypes = extractProductTypesFromMarkdown(activeMarkdown);
  const availableTypes = dynamicTypes.length > 0 ? dynamicTypes : kb.productTypes;

  const rawSub = (params.subdivision || '').trim();
  const rawType = (params.propertyType || '').toLowerCase().trim();
  const rawAmenities = (params.amenities || '').toLowerCase().trim();

  // 1. Match Subdivision
  let matchedSubdivision = '';
  let subSpecificText = '';

  if (rawSub) {
    for (const sub of availableSubdivisions) {
      const cleanSub = sub.split(/[\(:—–\-]/)[0].trim();
      if (
        rawSub.toLowerCase().includes(cleanSub.toLowerCase()) ||
        cleanSub.toLowerCase().includes(rawSub.toLowerCase())
      ) {
        matchedSubdivision = cleanSub;
        break;
      }
    }
  }

  if (!matchedSubdivision && availableSubdivisions.length > 0) {
    matchedSubdivision = availableSubdivisions[0].split(/[\(:—–\-]/)[0].trim();
  }

  // Extract specific subdivision paragraph from markdown safely without regex syntax errors
  if (matchedSubdivision) {
    subSpecificText = extractSubdivisionBlock(activeMarkdown, matchedSubdivision);
  }

  // 2. Match Product Type specs
  let matchedProductType = availableTypes[0] || 'Liền kề';
  for (const pt of availableTypes) {
    if (rawType && (rawType.includes(pt.toLowerCase()) || pt.toLowerCase().includes(rawType))) {
      matchedProductType = pt;
      break;
    }
  }

  // 3. Match Key Amenities
  const matchedAmenities: string[] = [];
  for (const a of availableAmenities) {
    const aLower = a.toLowerCase();
    if (
      (rawAmenities && (rawAmenities.includes(aLower.slice(0, 15)) || aLower.includes(rawAmenities.slice(0, 15)))) ||
      (matchedSubdivision && aLower.includes(matchedSubdivision.toLowerCase()))
    ) {
      matchedAmenities.unshift(a);
    } else {
      matchedAmenities.push(a);
    }
  }
  const finalAmenities = Array.from(new Set(matchedAmenities)).slice(0, 4);

  // 4. Extract Location & Transport Highlights
  const matchedLocationHighlights: string[] = [];
  const locRegex = /## 1\. TỔNG QUAN[^#]+/i;
  const locMatch = activeMarkdown.match(locRegex);
  if (locMatch) {
    const locLines = locMatch[0]
      .split('\n')
      .filter((line) =>
        line.includes('Vành đai') ||
        line.includes('Cao tốc') ||
        line.includes('kết nối') ||
        line.includes('nút giao') ||
        line.includes('cầu ') ||
        line.includes('Quốc lộ')
      )
      .map((l) => l.replace(/^[-*•\s]+/, '').trim());
    matchedLocationHighlights.push(...locLines.slice(0, 3));
  }

  // Calculate confidence score (90-99%)
  const confidenceScore = matchedSubdivision && subSpecificText ? 99 : 92;

  // Build the synthesized Context Injection Prompt Block
  const injectedContextText = `
=== [CONTEXT INJECTION: DỮ LIỆU TRI THỨC DỰ ÁN TỪ KNOWLEDGE BASE] ===
📌 DỰ ÁN: ${kb.name}
📄 Tệp tri thức: ${kb.filename} (Ngày cập nhật: ${kb.updatedAt} | Phiên bản: ${kb.version})
🎯 KẾT QUẢ BỘ LỌC ROUTER / MATCHER THÔNG MINH:
- Phân khu trọng tâm khớp: ${matchedSubdivision || 'Phân khu trung tâm'}
- Loại hình sản phẩm khớp: ${matchedProductType}

[1. QUY HOẠCH & ĐẶC TÍNH PHÂN KHU ĐANG SOẠN]:
${subSpecificText || `- Phân khu ${matchedSubdivision || rawSub}: Thuộc quy hoạch dự án ${kb.name}, đồng bộ tiện ích và hạ tầng cao cấp.`}

[2. TIÊU CHUẨN XÂY DỰNG & LOẠI HÌNH (${matchedProductType})]:
- Loại hình xác thực: ${matchedProductType}
- Diện tích đang soạn: ${params.area ? `${params.area}m²` : 'Tiêu chuẩn'}
- Bàn giao tiêu chuẩn: Xây dựng kiên cố, hoàn thiện mặt ngoài đồng bộ, tối ưu công năng ở kết hợp kinh doanh.

[3. HỆ THỐNG ĐẠI TIỆN ÍCH XÁC THỰC CỦA DỰ ÁN (BẮT BUỘC DÙNG ĐÚNG)]:
${finalAmenities.length > 0 ? finalAmenities.map((item, idx) => `  ${idx + 1}. ${item}`).join('\n') : '  1. Tiện ích đại đô thị đẳng cấp đồng bộ.'}

[4. VỊ TRÍ & HẠ TẦNG KẾT NỐI CHUẨN]:
${matchedLocationHighlights.length > 0 ? matchedLocationHighlights.map((l) => `  - ${l}`).join('\n') : `  - Tọa lạc tại vị trí chiến lược của ${kb.name}, kết nối giao thông đồng bộ.`}

⛔ YÊU CẦU ĐỐI VỚI AI KHI SOẠN TIN (NGHIÊM CẤM TỰ BỊA ĐẶT):
- Bạn BẮT BUỘC phải dùng đúng các tiện ích, tên phân khu và vị trí đã được bộ lọc Router trích xuất ở trên.
- TUYỆT ĐỐI KHÔNG tự bịa đặt các tiện ích không có trong dự án (ví dụ không nhầm biển sóng Ocean Park 2 sang Ocean Park 1, không nhầm vịnh Paradise Bay của OCP3 sang OCP2).
====================================================================`.trim();

  const routerSummary = `Đã khớp thành công: Phân khu "${matchedSubdivision || 'Trung tâm'}" + Loại hình "${matchedProductType}" từ file ${kb.filename} (Cập nhật ${kb.updatedAt})`;

  return {
    projectId: kb.id,
    projectName: kb.name,
    filename: kb.filename,
    updatedAt: kb.updatedAt,
    matchedSubdivision,
    matchedProductType,
    matchedAmenities: finalAmenities,
    matchedLocationHighlights,
    confidenceScore,
    injectedContextText,
    routerSummary,
  };
}
