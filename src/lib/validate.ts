// Guards against facts the AI made up: every figure in generated text must also appear in the
// data we gave it (form fields, project knowledge base, real market data).

const UNIT_ALIASES: Record<string, string> = { 'tỉ': 'tỷ', tr: 'triệu', 'm²': 'm2', pn: 'phòng ngủ' };

const FIGURE_RE = /(\d+(?:[.,]\d+)*)\s?(tỷ|tỉ|triệu|tr|m2|m²|ha|%|tầng|tháng|năm|phòng ngủ|pn|wc|m)(?![a-zà-ỹ0-9²])/gi;

function canonNumber(raw: string): string {
  let n = raw;
  if (/^\d{1,3}(\.\d{3})+$/.test(n)) n = n.replace(/\./g, ''); // 1.250 -> 1250
  n = n.replace(',', '.');
  if (n.includes('.')) n = n.replace(/0+$/, '').replace(/\.$/, '');
  return n;
}

export function extractFigures(text: string): string[] {
  const out: string[] = [];
  // "4mx14m" / "4m x 14m" -> both sizes become separate figures
  const t = (text || '').toLowerCase().replace(/(\d)\s*m\s*[x×]\s*(\d)/g, '$1m x $2');
  let m: RegExpExecArray | null;
  FIGURE_RE.lastIndex = 0;
  while ((m = FIGURE_RE.exec(t))) {
    const unit = UNIT_ALIASES[m[2]] || m[2];
    out.push(`${canonNumber(m[1])}${unit}`);
  }
  return out;
}

export function phonesIn(text: string): string[] {
  return ((text || '').match(/(?:\+?84|0)[\d .]{8,12}\d/g) || []).map((p) => p.replace(/\D/g, '')).filter((p) => p.length >= 9);
}

/** Figures present in `text` but absent from `allowedText`. */
export function unsupportedFigures(text: string, allowedText: string): string[] {
  const allowed = new Set(extractFigures(allowedText));
  return [...new Set(extractFigures(text).filter((f) => !allowed.has(f)))];
}

const BANNED = /(tốt nhất|rẻ nhất|duy nhất|số 1|số một|nhất thị trường)/i;

export interface ListingCheckInput {
  bdsTitle: string;
  bdsContent: string;
  otherTexts: string[]; // zalo / facebook title+content
  allowedText: string;
  expectedPhone: string;
  projectName: string;
}

export function checkListing(i: ListingCheckInput): string[] {
  const warnings: string[] = [];
  const len = i.bdsTitle.length;
  if (len < 90 || len > 99) warnings.push(`Tiêu đề Batdongsan dài ${len} ký tự (chuẩn 90–99).`);
  if (i.projectName && !i.bdsTitle.toLowerCase().includes(i.projectName.toLowerCase().slice(0, 14))) {
    warnings.push('Tiêu đề Batdongsan có thể thiếu tên dự án đầy đủ.');
  }
  const banned = i.bdsContent.match(BANNED);
  if (banned) warnings.push(`Tin Batdongsan dùng từ tuyệt đối bị cấm: "${banned[0]}".`);

  const expected = i.expectedPhone.replace(/\D/g, '');
  const phones = phonesIn(i.bdsContent);
  const phoneCount = phones.filter((p) => p === expected).length;
  if (expected && phoneCount !== 2) warnings.push(`SĐT xuất hiện ${phoneCount} lần trong tin Batdongsan (chuẩn đúng 2 lần).`);
  const foreign = [...new Set([...phones, ...i.otherTexts.flatMap(phonesIn)].filter((p) => expected && p !== expected))];
  if (foreign.length) warnings.push(`Có SĐT lạ trong tin: ${foreign.join(', ')}.`);

  const all = [i.bdsTitle, i.bdsContent, ...i.otherTexts].join('\n');
  const bad = unsupportedFigures(all, i.allowedText);
  if (bad.length) {
    warnings.push(`Con số không có trong dữ liệu căn / kho dự án / thị trường, cần kiểm tra trước khi đăng: ${bad.join(', ')}.`);
  }
  return warnings;
}
