// Market data from REAL listing rows (extracted from the batdongsan result pages by the user's browser).
// Every number shown in the research dashboard is computed here, never invented by the AI.
import type { MarketResearchData } from '../types';

export type Tier = 'diamond' | 'gold' | 'silver' | 'normal';

export interface ListingRow {
  id: string;
  tier: Tier;
  page: number;
  pos: number;
  title: string;
  price: string;
  area: string;
  pricePerM2: string;
  location: string;
  description: string;
  published: string;
  broker: string;
  brokerProfile: string;
  url: string;
}

export interface ProductGroup {
  type: string;
  count: number;
  priceRange: string;
  medianPrice: string;
  medianPricePerM2: string;
  areaRange: string;
  typicalArea: string;
  sampleTitles: string[];
}

export const TIER_LABEL: Record<Tier, string> = {
  diamond: 'VIP Kim Cương',
  gold: 'VIP Vàng',
  silver: 'VIP Bạc',
  normal: 'Tin thường',
};

// ---------- parsing ----------

const asTier = (v: any): Tier => {
  const s = String(v || '').toLowerCase().replace('vip-', '').replace('vip', '').trim();
  return s === 'diamond' || s === 'gold' || s === 'silver' ? s : 'normal';
};

const clean = (v: any) => String(v ?? '').replace(/\s+/g, ' ').trim();

export function parseDatasetJson(text: string): { rows: ListingRow[]; url: string; scrapedAt: string } {
  let raw: any;
  try {
    raw = JSON.parse(text.trim());
  } catch {
    throw new Error('Nội dung dán không phải JSON hợp lệ. Hãy bấm nút bookmarklet trên trang batdongsan rồi dán lại kết quả.');
  }
  const list: any[] = Array.isArray(raw) ? raw : Array.isArray(raw?.rows) ? raw.rows : [];
  const rows: ListingRow[] = list
    .filter((r) => r && (clean(r.title) || clean(r.price)))
    .map((r, i) => ({
      id: clean(r.id) || clean(r.url) || `row-${i}`,
      tier: asTier(r.tier),
      page: Number(r.page) > 0 ? Number(r.page) : 1,
      pos: Number(r.pos) > 0 ? Number(r.pos) : i + 1,
      title: clean(r.title),
      price: clean(r.price),
      area: clean(r.area),
      pricePerM2: clean(r.pricePerM2),
      location: clean(r.location).replace(/^[·\s]+/, ''),
      description: clean(r.description),
      published: clean(r.published),
      broker: clean(r.broker),
      brokerProfile: clean(r.brokerProfile),
      url: clean(r.url),
    }));
  if (rows.length === 0) throw new Error('Không tìm thấy tin nào trong dữ liệu dán. Hãy chạy bookmarklet ngay trên trang kết quả tìm kiếm của batdongsan.com.vn.');
  return { rows, url: clean(raw?.url), scrapedAt: clean(raw?.scrapedAt) };
}

export function mergeRows(existing: ListingRow[], incoming: ListingRow[]): ListingRow[] {
  // Key = listing id + page + position: a listing can legitimately occupy several slots (promoted),
  // and re-pasting the same page must replace those slots, not double them.
  const bySlot = new Map<string, ListingRow>();
  for (const r of existing) bySlot.set(`${r.id}@${r.page}@${r.pos}`, r);
  for (const r of incoming) bySlot.set(`${r.id}@${r.page}@${r.pos}`, r); // newer scrape of the same slot wins
  return [...bySlot.values()].sort((a, b) => a.page - b.page || a.pos - b.pos);
}

const toNumber = (s: string): number | null => {
  const t = s.replace(/\s/g, '');
  if (!t) return null;
  const n = /^\d{1,3}(\.\d{3})+(,\d+)?$/.test(t) ? Number(t.replace(/\./g, '').replace(',', '.')) : Number(t.replace(',', '.'));
  return Number.isFinite(n) ? n : null;
};

/** Total price in VND, or null (e.g. "Thỏa thuận", or a per-m² figure). */
export function parsePriceVnd(text: string): number | null {
  const s = clean(text).toLowerCase();
  if (!s || /\/\s*m/.test(s) || /\/\s*tháng/.test(s)) return null;
  const m = s.match(/([\d.,]+)\s*(tỷ|tỉ|triệu|tr)(?![a-zà-ỹ])/);
  if (!m) return null;
  const n = toNumber(m[1]);
  if (n === null) return null;
  return /tỷ|tỉ/.test(m[2]) ? n * 1e9 : n * 1e6;
}

export function parseAreaM2(text: string): number | null {
  const m = clean(text).match(/([\d.,]+)\s*m/i);
  return m ? toNumber(m[1]) : null;
}

/** Price per m² in million VND. */
export function parsePricePerM2(row: Pick<ListingRow, 'pricePerM2' | 'price' | 'area'>): number | null {
  const m = clean(row.pricePerM2).toLowerCase().match(/([\d.,]+)\s*(tr|triệu)/);
  if (m) return toNumber(m[1]);
  const p = parsePriceVnd(row.price);
  const a = parseAreaM2(row.area);
  return p && a ? p / 1e6 / a : null;
}

export function formatVnd(v: number): string {
  if (v >= 1e9) {
    const b = Math.round((v / 1e9) * 100) / 100;
    return `${String(b).replace('.', ',')} tỷ`;
  }
  return `${Math.round(v / 1e6)} triệu`;
}

const median = (xs: number[]): number | null => {
  if (!xs.length) return null;
  const s = [...xs].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
};

// ---------- classification ----------

export function productTypeOf(r: Pick<ListingRow, 'title' | 'description'>): string {
  const t = `${r.title} ${r.description}`.toLowerCase();
  if (/shop\s?house|nhà phố thương mại/.test(t)) return 'Shophouse';
  if (/biệt thự|song lập|đơn lập|tứ lập/.test(t)) return 'Biệt thự';
  if (/căn hộ|chung cư|studio|penthouse/.test(t)) return 'Căn hộ';
  if (/đất nền|lô đất/.test(t)) return 'Đất nền';
  if (/liền kề|\blk\b|xẻ khe|nhà phố/.test(t)) return 'Liền kề';
  return 'Chưa phân loại';
}

interface Bucket {
  name: string;
  terms: Array<{ term: string; re: RegExp }>;
}
const mk = (term: string, re?: RegExp) => ({ term, re: re || new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') });
export const CONTENT_BUCKETS: Bucket[] = [
  { name: 'Giá tốt / cắt lỗ / chiết khấu', terms: ['cắt lỗ', 'giá tốt', 'giá rẻ', 'rẻ nhất', 'bán gấp', 'chiết khấu', 'giá sốc', 'ngộp', 'thanh lý', 'giảm giá'].map((t) => mk(t)) },
  { name: 'Chính chủ / ngoại giao / trực tiếp CĐT', terms: ['chính chủ', 'ngoại giao', 'chủ đầu tư', 'cđt', 'trực tiếp', 'suất'].map((t) => mk(t)) },
  { name: 'Kinh doanh / mặt phố', terms: ['kinh doanh', 'mặt phố', 'mặt đường', 'sầm uất', 'trục chính', 'thương mại'].map((t) => mk(t)) },
  { name: 'Cho thuê / dòng tiền', terms: ['cho thuê', 'dòng tiền', 'thuê'].map((t) => mk(t)) },
  { name: 'Pháp lý / sổ đỏ', terms: ['sổ đỏ', 'sổ hồng', 'pháp lý', 'công chứng', 'sang tên'].map((t) => mk(t)) },
  { name: 'Vị trí / view / căn góc', terms: ['căn góc', 'view', 'công viên', 'ngã tư', 'xẻ khe', 'hồ', 'đối diện'].map((t) => mk(t)) },
];

// ---------- aggregation ----------

const rowsWithPrice = (rows: ListingRow[]) => rows.map((r) => parsePriceVnd(r.price)).filter((v): v is number => v !== null);

export function groupByProduct(rows: ListingRow[]): ProductGroup[] {
  const map = new Map<string, ListingRow[]>();
  for (const r of rows) {
    const k = productTypeOf(r);
    map.set(k, [...(map.get(k) || []), r]);
  }
  return [...map.entries()]
    .map(([type, rs]) => {
      const prices = rs.map((r) => parsePriceVnd(r.price)).filter((v): v is number => v !== null);
      const areas = rs.map((r) => parseAreaM2(r.area)).filter((v): v is number => v !== null);
      const ppms = rs.map(parsePricePerM2).filter((v): v is number => v !== null);
      const medArea = median(areas);
      const medPrice = median(prices);
      const medPpm = median(ppms);
      return {
        type,
        count: rs.length,
        priceRange: prices.length ? `${formatVnd(Math.min(...prices))} – ${formatVnd(Math.max(...prices))}` : 'Chưa có giá',
        medianPrice: medPrice ? formatVnd(medPrice) : '',
        medianPricePerM2: medPpm ? `${String(Math.round(medPpm * 10) / 10).replace('.', ',')} triệu/m²` : '',
        areaRange: areas.length ? `${Math.min(...areas)} – ${Math.max(...areas)} m²` : '',
        typicalArea: medArea ? String(Math.round(medArea)) : '',
        sampleTitles: rs.slice(0, 6).map((r) => r.title),
      };
    })
    .sort((a, b) => b.count - a.count);
}

export function bucketStats(rows: ListingRow[]) {
  return CONTENT_BUCKETS.map((b) => {
    const hits = rows.filter((r) => b.terms.some((t) => t.re.test(`${r.title} ${r.description}`)));
    const freq = new Map<string, number>();
    for (const r of rows) for (const t of b.terms) if (t.re.test(r.title)) freq.set(t.term, (freq.get(t.term) || 0) + 1);
    return {
      categoryName: b.name,
      count: hits.length,
      percentage: rows.length ? Math.round((hits.length / rows.length) * 1000) / 10 : 0,
      topKeywords: [...freq.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5).map(([k]) => k),
    };
  })
    .filter((b) => b.count > 0)
    .sort((a, b) => b.count - a.count);
}

export function tierCounts(rows: ListingRow[]) {
  const c = { diamond: 0, gold: 0, silver: 0, normal: 0 };
  for (const r of rows) c[r.tier]++;
  const vip = c.diamond + c.gold + c.silver;
  return { ...c, vipPercentage: rows.length ? Math.round((vip / rows.length) * 1000) / 10 : 0 };
}

const tierText = (c: ReturnType<typeof tierCounts>) =>
  `${c.diamond} Kim Cương, ${c.gold} Vàng, ${c.silver} Bạc, ${c.normal} thường`;

export function brokerStats(rows: ListingRow[]) {
  const map = new Map<string, { name: string; profile: string; rows: ListingRow[] }>();
  for (const r of rows) {
    if (!r.broker && !r.brokerProfile) continue;
    const key = r.brokerProfile || r.broker;
    const cur = map.get(key) || { name: r.broker || r.brokerProfile, profile: r.brokerProfile, rows: [] };
    cur.rows.push(r);
    map.set(key, cur);
  }
  return [...map.values()].sort((a, b) => b.rows.length - a.rows.length);
}

const ABBR: Record<string, string> = { 'Liền kề': 'LK', Shophouse: 'Shophouse', 'Biệt thự': 'Biệt thự', 'Căn hộ': 'Căn hộ', 'Đất nền': 'Đất nền' };

/** Data-only recommendations (no AI). The AI later rewrites the wording, never the numbers. */
export function seedRecommendations(groups: ProductGroup[], projectName: string): MarketResearchData['recommendations'] {
  const usable = groups.filter((g) => g.type !== 'Chưa phân loại');
  const top = (usable.length ? usable : groups).slice(0, 3);
  return top.map((g, i) => {
    const abbr = ABBR[g.type] || g.type;
    const title = `${g.medianPrice ? `Giá ${g.medianPrice} ` : ''}${abbr}${g.typicalArea ? ` ${g.typicalArea}m2` : ''} - ${projectName}`.slice(0, 99);
    return {
      id: i + 1,
      productName: `${g.type} (${g.count} tin trên thị trường)`,
      productType: g.type,
      subdivision: '',
      priceEstimate: g.priceRange,
      area: g.areaRange,
      whyRecommended: `Có ${g.count} tin ${g.type} trong dữ liệu đã quét; khoảng giá ${g.priceRange}${g.medianPricePerM2 ? `, đơn giá trung vị ${g.medianPricePerM2}` : ''}.`,
      sampleTitleBDS: title,
      outlineBullets: [
        'Mở đầu: dồn thông số chính của căn (loại hình, phân khu, diện tích, giá).',
        'Vị trí và tiện ích đúng với phân khu của căn.',
        'Pháp lý và chính sách đúng thực tế của căn.',
        'Chốt: liên hệ xem nhà.',
      ],
      specs: {
        projectName,
        area: '', // never prefill the unit's own numbers from market averages
        price: '',
        pricePerM2: '',
        subdivision: '',
        propertyType: g.type,
        highlights: '',
        legal: '',
        amenities: '',
      },
    };
  });
}

export interface DatasetMeta {
  projectName: string;
  batdongsanUrl: string;
  scrapedAt: string;
}

/** Everything in MarketResearchData that can be computed from rows alone. */
export function computeMarketData(rows: ListingRow[], meta: DatasetMeta): MarketResearchData {
  const total = rows.length;
  const tiers = tierCounts(rows);
  const pages = [...new Set(rows.map((r) => r.page))].sort((a, b) => a - b);
  const groups = groupByProduct(rows);
  const brokers = brokerStats(rows);
  const withBroker = brokers.reduce((n, b) => n + b.rows.length, 0);

  const pagesBreakdown = pages.map((p) => {
    const pr = rows.filter((r) => r.page === p);
    const tc = tierCounts(pr);
    const med = median(rowsWithPrice(pr));
    return {
      pageNumber: p,
      pageLabel: `Trang ${p}`,
      totalListings: pr.length,
      vipDiamond: tc.diamond,
      vipGold: tc.gold,
      vipSilver: tc.silver,
      normal: tc.normal,
      vipPercentage: tc.vipPercentage,
      keyCharacteristics: `${tierText(tc)}.${med ? ` Giá trung vị ${formatVnd(med)}.` : ''}`,
    };
  });

  const top5Brokers = brokers.slice(0, 5).map((b, i) => {
    const tc = tierCounts(b.rows);
    const types = groupByProduct(b.rows).slice(0, 2).map((g) => g.type).join(', ');
    const prices = rowsWithPrice(b.rows);
    return {
      rank: i + 1,
      name: b.name,
      phone: '', // batdongsan masks phones on result pages; we do not guess them
      agency: '',
      totalListings: b.rows.length,
      marketSharePercent: total ? Math.round((b.rows.length / total) * 1000) / 10 : 0,
      profileUrl: b.profile ? `https://guru.batdongsan.com.vn/pa/${b.profile}` : '',
      keyStrategy: `${b.rows.length} tin: ${tierText(tc)}.${types ? ` Chủ yếu: ${types}.` : ''}`,
      strengths: prices.length ? `Khoảng giá đang đăng: ${formatVnd(Math.min(...prices))} – ${formatVnd(Math.max(...prices))}.` : 'Chưa có dữ liệu giá.',
    };
  });

  const note = 'Chưa có mốc so sánh. Bấm "Lưu snapshot" để làm mốc cho lần quét sau.';
  return {
    projectName: meta.projectName,
    batdongsanUrl: meta.batdongsanUrl,
    scannedAt: meta.scrapedAt,
    totalListingsCount: total,
    pageScope: pages.length >= 3 ? '3_pages' : pages.length === 2 ? '2_pages' : '1_page',
    pagesBreakdown,
    vipStats: {
      vipDiamond: tiers.diamond,
      vipGold: tiers.gold,
      vipSilver: tiers.silver,
      normal: tiers.normal,
      vipPercentage: tiers.vipPercentage,
      competitionAnalysis: `Trong ${total} tin đã quét có ${tierText(tiers)} (tin VIP chiếm ${tiers.vipPercentage}%).`,
    },
    agentsSummary: {
      totalActiveBrokers: brokers.length,
      dominantAgencies: brokers.slice(0, 3).map((b) => `${b.name} (${b.rows.length} tin)`),
    },
    top5Brokers,
    contentCategories: bucketStats(rows).map((b) => ({ ...b, angles: [] })),
    productsAndPricing: groups.map((g) => ({
      productType: g.type,
      count: g.count,
      priceRange: g.priceRange,
      avgPriceM2: g.medianPricePerM2 || 'Chưa có',
      marketEvaluation: `${g.count} tin (${total ? Math.round((g.count / total) * 100) : 0}%)${g.medianPrice ? `, giá trung vị ${g.medianPrice}` : ''}${g.areaRange ? `, diện tích ${g.areaRange}` : ''}.`,
    })),
    historicalComparison: {
      previousBenchmarkPeriod: 'Chưa có mốc so sánh',
      priceTrend: note,
      listingVolumeTrend: note,
      vipCompetitionShift: note,
      marketNotes: `Môi giới chỉ hiển thị trên tin VIP Kim Cương/Vàng: ${withBroker}/${total} tin có thông tin môi giới. SĐT bị batdongsan che trên trang danh sách nên app không hiển thị SĐT.`,
    },
    recommendations: seedRecommendations(groups, meta.projectName),
    dataSource: {
      kind: 'real',
      scrapedAt: meta.scrapedAt,
      pages,
      rowCount: total,
      aiNarrative: false,
    },
  };
}

/** Compact, real-data-only context handed to the listing generator (phase 3). */
export interface MarketContext {
  projectName: string;
  scrapedAt: string;
  rowCount: number;
  vipPercentage: number;
  products: Array<{ type: string; count: number; priceRange: string; medianPricePerM2: string }>;
  topKeywords: string[];
  topTitles: string[];
}

export function buildMarketContext(rows: ListingRow[], meta: DatasetMeta): MarketContext {
  const tiers = tierCounts(rows);
  const buckets = bucketStats(rows);
  const top = rows
    .filter((r) => r.tier === 'diamond' || r.tier === 'gold')
    .sort((a, b) => a.page - b.page || a.pos - b.pos)
    .slice(0, 8)
    .map((r) => r.title);
  return {
    projectName: meta.projectName,
    scrapedAt: meta.scrapedAt,
    rowCount: rows.length,
    vipPercentage: tiers.vipPercentage,
    products: groupByProduct(rows)
      .slice(0, 4)
      .map((g) => ({ type: g.type, count: g.count, priceRange: g.priceRange, medianPricePerM2: g.medianPricePerM2 })),
    topKeywords: [...new Set(buckets.flatMap((b) => b.topKeywords))].slice(0, 10),
    topTitles: top,
  };
}
