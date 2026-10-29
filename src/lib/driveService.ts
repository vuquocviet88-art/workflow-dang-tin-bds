import { DriveImage, ProjectFormData } from '../types';

export interface ProjectDriveConfig {
  id: string;
  projectName: string;
  folderId: string;
  folderUrl: string;
  description: string;
}

export const KNOWN_PROJECT_DRIVE_FOLDERS: ProjectDriveConfig[] = [
  {
    id: 'ocean-city',
    projectName: 'Vin Ocean City - thấp tầng',
    folderId: '1WdyE-agaHeD0XoKBWwRds9V0f17djnpJ',
    folderUrl: 'https://drive.google.com/drive/folders/1WdyE-agaHeD0XoKBWwRds9V0f17djnpJ?usp=drive_link',
    description: 'Thư mục dự án Vin Ocean City (Ocean Park 1, 2, 3 thấp tầng)',
  },
  {
    id: 'ha-long-xanh',
    projectName: 'Vin Hạ Long Xanh',
    folderId: '1gPBqGwLqH6wXKXmKy2YInAY8zZao_3N6',
    folderUrl: 'https://drive.google.com/drive/folders/1gPBqGwLqH6wXKXmKy2YInAY8zZao_3N6?usp=drive_link',
    description: 'Thư mục dự án Vin Hạ Long Xanh - Quảng Ninh',
  },
  {
    id: 'olympic',
    projectName: 'Vin Olympic Hà Nội',
    folderId: '1ElKpQfQm5tA1ckcpiX37dUvj71SsgrOU',
    folderUrl: 'https://drive.google.com/drive/folders/1ElKpQfQm5tA1ckcpiX37dUvj71SsgrOU?usp=drive_link',
    description: 'Thư mục dự án Vin Olympic Hà Nội - Thể thao sinh thái',
  },
];

export const BROLL_LIBRARY_CONFIG = {
  name: 'Thư viện B-roll Toàn Bộ Dự Án',
  folderId: '1piGcPWfMrW2DOfXVOBGnQ7Hn720ASu-D',
  folderUrl: 'https://drive.google.com/drive/folders/1piGcPWfMrW2DOfXVOBGnQ7Hn720ASu-D?usp=drive_link',
};

// Map property types to standardized abbreviations
export function abbreviatePropertyType(propertyType: string): string {
  const lower = (propertyType || '').toLowerCase();
  if (lower.includes('xẻ khe') || lower.includes('xe khe')) return 'LK xẻ khe';
  if (lower.includes('song lập') || lower.includes('song lap') || lower === 'sl') return 'SL';
  if (lower.includes('đơn lập') || lower.includes('don lap') || lower === 'đl' || lower === 'dl') return 'ĐL';
  if (lower.includes('biệt thự') || lower.includes('biet thu') || lower === 'bt') return 'BT';
  if (lower.includes('shophouse') || lower.includes('nhà phố thương mại') || lower === 'sh') return 'SH';
  if (lower.includes('liền kề') || lower.includes('lien ke') || lower.includes('lk')) return 'LK';
  if (lower.includes('đất nền') || lower.includes('dat nen') || lower === 'đn' || lower === 'dn') return 'ĐN';
  if (lower.includes('chung cư') || lower.includes('căn hộ') || lower === 'ch') return 'CH';
  return 'LK';
}

// Generate listing folder name: [tên phân khu]_[dòng sản phẩm (viết tắt)]_[mã căn]
export function generateListingFolderName(projectData: ProjectFormData): string {
  let sub = (projectData.subdivision || '').trim();
  // Strip parenthetical content like "(HA8-145)" if already in subdivision
  sub = sub.replace(/\([^)]*\)/g, '').replace(/Phân khu\s+/i, '').trim();
  if (!sub) sub = 'Hải Âu';

  const abbrType = abbreviatePropertyType(projectData.propertyType || '');
  
  let unit = (projectData.unitCode || '').trim();
  if (!unit) {
    const match = (projectData.subdivision || '').match(/(HA\d+-\d+|SB\d+-\d+|CL\d+-\d+|PB\d+-\d+|TĐ\d+-\d+|VT\d+-\d+|ĐD\d+-\d+|[A-Z0-9]+-\d+)/i);
    unit = match ? match[1].toUpperCase() : 'HA8-145';
  }

  return `${sub}_${abbrType}_${unit}`;
}

// Helper to sanitize Vietnamese string to slug
export function toSlug(str: string): string {
  return (str || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'd')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Mask unit code to protect broker source and avoid revealing exact house number
// Formula: [tên đường]-xx (e.g., HA8-145 -> ha8-xx, CL08-12 -> cl08-xx)
export function maskUnitCode(unitCode: string, subdivision: string = ''): string {
  const combined = `${unitCode || ''} ${subdivision || ''}`.trim();
  
  // Look for pattern like HA8-145 or HA1-95 or SB16-20
  const dashMatch = combined.match(/([a-zA-Z0-9à-ỹÀ-Ỹ]+)-[0-9a-zA-Z]+/i);
  if (dashMatch) {
    return `${toSlug(dashMatch[1])}-xx`;
  }

  // Look for street identifiers like Hải Âu 8, Sao Biển 16, Chà Là 08
  const streetMatch = combined.match(/((?:Hải Âu|Sao Biển|Chà Là|Cọ Xanh|Phố Biển|Thời Đại|Vịnh Tây|Vịnh Xanh|Ánh Dương|Đảo Dừa|San Hô|HA|SB|CL|CX|PB|TĐ|VT|VX|AD|ĐD|SH)\s*\d+)/i);
  if (streetMatch) {
    return `${toSlug(streetMatch[1])}-xx`;
  }

  if (unitCode) {
    const slug = toSlug(unitCode);
    const parts = slug.split('-');
    if (parts.length > 1) {
      parts[parts.length - 1] = 'xx';
      return parts.join('-');
    }
    return `${slug}-xx`;
  }

  return 'ha8-xx';
}

// Generate SEO filename: [du-an]-[phan-khu]-[dong-sp]-[ten-duong-xx]-[danh-muc]-[index].jpg
// Example: vinhomes-ocean-city-hai-au-lk-ha8-xx-mat-tien-01.jpg
export function generateSeoFilename(
  projectData: ProjectFormData,
  categoryType: string,
  imageTitle: string,
  index: number
): string {
  const projectSlug = toSlug(projectData.projectName || 'vinhomes-ocean-city');
  const subSlug = toSlug(projectData.subdivision || 'hai-au');
  const abbrSlug = toSlug(abbreviatePropertyType(projectData.propertyType || 'lk'));
  const maskedUnitSlug = maskUnitCode(projectData.unitCode || '', projectData.subdivision || '');
  const catSlug = toSlug(categoryType || imageTitle || 'anh');
  const idx = String(index + 1).padStart(2, '0');

  return `${projectSlug}-${subSlug}-${abbrSlug}-${maskedUnitSlug}-${catSlug}-${idx}.jpg`;
}

// Identify parent folder config by project name
export function matchParentFolderConfig(projectName: string): ProjectDriveConfig {
  const lower = (projectName || '').toLowerCase();
  if (lower.includes('hạ long') || lower.includes('ha long') || lower.includes('quảng ninh')) {
    return KNOWN_PROJECT_DRIVE_FOLDERS[1]; // Vin Hạ Long Xanh
  }
  if (lower.includes('olympic') || lower.includes('thể thao') || lower.includes('đan phượng')) {
    return KNOWN_PROJECT_DRIVE_FOLDERS[2]; // Vin Olympic Hà Nội
  }
  // Default to Ocean City (Park 1, 2, 3)
  return KNOWN_PROJECT_DRIVE_FOLDERS[0];
}

// Client-Side Google Drive API: Create Folder
export async function createFolderOnDrive(
  folderName: string,
  parentFolderId: string,
  accessToken: string
): Promise<{ id: string; name: string; webViewLink: string }> {
  const resp = await fetch('https://www.googleapis.com/drive/v3/files?fields=id,name,webViewLink', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: folderName,
      mimeType: 'application/vnd.google-apps.folder',
      parents: [parentFolderId],
    }),
  });

  const data = await resp.json();
  if (!resp.ok) {
    throw new Error(data?.error?.message || `Lỗi tạo thư mục Google Drive (${resp.status})`);
  }
  return data;
}

// Client-Side Google Drive API: Copy File with SEO Name
export async function copyFileOnDrive(
  fileId: string,
  newName: string,
  targetFolderId: string,
  accessToken: string
): Promise<{ id: string; name: string; webViewLink: string }> {
  const resp = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}/copy?fields=id,name,webViewLink`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: newName,
      parents: [targetFolderId],
    }),
  });

  const data = await resp.json();
  if (!resp.ok) {
    throw new Error(data?.error?.message || `Lỗi copy file Google Drive (${resp.status})`);
  }
  return data;
}

// Client-Side Google Drive API: Query files in folder
export async function listFolderFilesOnDrive(
  folderId: string,
  accessToken: string
): Promise<any[]> {
  const q = encodeURIComponent(`'${folderId}' in parents and trashed = false and mimeType != 'application/vnd.google-apps.folder'`);
  const fields = encodeURIComponent('files(id,name,mimeType,thumbnailLink,webContentLink,webViewLink)');
  const resp = await fetch(`https://www.googleapis.com/drive/v3/files?q=${q}&fields=${fields}&pageSize=100`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data = await resp.json();
  if (!resp.ok) {
    throw new Error(data?.error?.message || `Lỗi quét thư mục Google Drive (${resp.status})`);
  }
  return data.files || [];
}
