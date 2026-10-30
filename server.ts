import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { ai, Type, hasAiKey, DEFAULT_AI_MODEL } from './src/lib/ai.js';
import {
  computeMarketData,
  groupByProduct,
  bucketStats,
  tierCounts,
  brokerStats,
  type ListingRow,
} from './src/lib/market.js';
import { checkListing, unsupportedFigures } from './src/lib/validate.js';
import { 
  matchAndInjectContext, 
  getAllKnowledgeBases, 
  getKnowledgeBase, 
  updateKnowledgeBase 
} from './src/lib/knowledgeRouter.js';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// AI goes through OpenRouter (see src/lib/ai.ts). Model is configurable via AI_MODEL.
const AI_MODEL = process.env.AI_MODEL || DEFAULT_AI_MODEL;

// In-memory test webhook logs for internal testing
interface WebhookLog {
  id: string;
  timestamp: string;
  sourceIp: string;
  headers: Record<string, any>;
  body: any;
}
const webhookLogs: WebhookLog[] = [];

// Helper to extract Drive ID
function extractDriveId(urlOrId: string): string | null {
  if (!urlOrId) return null;
  const trimmed = urlOrId.trim();
  // Check if it's already a clean ID (alphanumeric, dashes, underscores, length >= 20)
  if (/^[a-zA-Z0-9_-]{25,}$/.test(trimmed)) {
    return trimmed;
  }
  // Try matching /d/<id>
  const matchD = trimmed.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (matchD && matchD[1]) return matchD[1];

  // Try matching id=<id>
  const matchId = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (matchId && matchId[1]) return matchId[1];

  // Try matching folders/<id>
  const matchFolder = trimmed.match(/\/folders\/([a-zA-Z0-9_-]+)/);
  if (matchFolder && matchFolder[1]) return matchFolder[1];

  return null;
}

export function createApp() {
  const app = express();

  app.use(express.json({ limit: '10mb' }));

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      hasApiKey: hasAiKey(),
      model: AI_MODEL,
      timestamp: new Date().toISOString(),
    });
  });

  // 1. Research & Analysis Endpoint
  app.post('/api/gemini/analyze', async (req, res) => {
    try {
      const { competitorInput } = req.body;
      if (!competitorInput || !competitorInput.trim()) {
        return res.status(400).json({ error: 'Nội dung hoặc link bài đăng đối thủ không được để trống.' });
      }

      const prompt = `Bạn là Chuyên gia Chiến lược Marketing & Content Bất Động Sản cao cấp tại Việt Nam.
Hãy phân tích chi tiết nội dung hoặc link tin đăng đối thủ / thị trường sau đây:

--- BẮT ĐẦU NỘI DUNG ĐỐI THỦ ---
${competitorInput}
--- KẾT THÚC NỘI DUNG ĐỐI THỦ ---

Phân tích toàn diện và trả về JSON theo đúng định dạng được yêu cầu:
1. summary: Tóm tắt ngắn gọn thông điệp chính, đối tượng khách hàng mục tiêu và định vị của tin đăng này.
2. keywords: Danh sách từ khóa tiềm năng (tối thiểu 6-10 từ khóa gồm từ khóa chính, từ khóa ngách địa phương, từ khóa dự án, từ khóa nhu cầu chuyển đổi). Mỗi từ khóa gồm term, type ('primary' | 'secondary' | 'geo' | 'intent'), reason.
3. titleStructure: Đánh giá tiêu đề hiện tại, phân tích điểm mạnh, điểm yếu và đưa ra 4-5 công thức tiêu đề giật tít có tỉ lệ click cao (CTR formulas) áp dụng được ngay.
4. salesAngles: Các góc chốt sale độc đáo (USP, đòn bẩy tài chính/dòng tiền, tính khan hiếm/thời điểm vàng, tiện ích phong cách sống, pháp lý an tâm).
5. proposedOutline: Dàn bài chuẩn cấu trúc bán hàng đỉnh cao (Gồm 5-6 phần: Mở đầu Hook thu hút, Vị trí kết nối & Tiềm năng hạ tầng, Quy mô & Thiết kế mặt bằng, Tiện ích đặc quyền & Phong cách sống, Pháp lý & Chính sách thanh toán ưu đãi, Kêu gọi hành động CTA chốt hẹn xem nhà).
6. keyExtractedData: Dự đoán hoặc trích xuất các thông số nếu có (tên dự án, phân khu, loại hình, diện tích, giá, địa chỉ, pháp lý) để có thể điền nhanh vào form.`;

      const response = await ai.models.generateContent({
        model: AI_MODEL,
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              summary: { type: Type.STRING },
              keywords: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    term: { type: Type.STRING },
                    type: { type: Type.STRING },
                    reason: { type: Type.STRING },
                  },
                  required: ['term', 'type', 'reason'],
                },
              },
              titleStructure: {
                type: Type.OBJECT,
                properties: {
                  currentStructure: { type: Type.STRING },
                  strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                  weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
                  highConvertingFormulas: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
                required: ['currentStructure', 'strengths', 'weaknesses', 'highConvertingFormulas'],
              },
              salesAngles: {
                type: Type.OBJECT,
                properties: {
                  primaryAngle: { type: Type.STRING },
                  uspPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
                  financialHooks: { type: Type.ARRAY, items: { type: Type.STRING } },
                  urgencyTactics: { type: Type.ARRAY, items: { type: Type.STRING } },
                  lifestyleHooks: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
                required: ['primaryAngle', 'uspPoints', 'financialHooks', 'urgencyTactics', 'lifestyleHooks'],
              },
              proposedOutline: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    sectionTitle: { type: Type.STRING },
                    purpose: { type: Type.STRING },
                    suggestedContent: { type: Type.STRING },
                  },
                  required: ['sectionTitle', 'purpose', 'suggestedContent'],
                },
              },
              keyExtractedData: {
                type: Type.OBJECT,
                properties: {
                  projectName: { type: Type.STRING },
                  subdivision: { type: Type.STRING },
                  propertyType: { type: Type.STRING },
                  area: { type: Type.STRING },
                  price: { type: Type.STRING },
                  address: { type: Type.STRING },
                  legal: { type: Type.STRING },
                },
              },
            },
            required: ['summary', 'keywords', 'titleStructure', 'salesAngles', 'proposedOutline'],
          },
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      res.json({ success: true, data: parsed });
    } catch (error: any) {
      console.warn('AI Analyze error:', error?.message);
      res.status(502).json({ error: `AI chưa phản hồi được (${error?.message || 'lỗi không rõ'}). Hãy thử lại.` });
    }
  });

  // 1B. Market narrative. Every NUMBER comes from the real rows (src/lib/market.ts); the AI only writes wording.
  app.post('/api/market/narrative', async (req, res) => {
    try {
      const { projectName, batdongsanUrl, scrapedAt, rows: rawRows } = req.body;
      if (!Array.isArray(rawRows) || rawRows.length === 0) {
        return res.status(400).json({ error: 'Chưa có dữ liệu thật. Hãy quét trang batdongsan bằng bookmarklet và dán dữ liệu vào trước.' });
      }
      const rows = (rawRows as ListingRow[]).slice(0, 300);
      const meta = { projectName: projectName || 'Dự án', batdongsanUrl: batdongsanUrl || '', scrapedAt: scrapedAt || '' };
      const computed = computeMarketData(rows, meta);
      const topTitles = rows
        .filter((r) => r.tier === 'diamond' || r.tier === 'gold')
        .slice(0, 12)
        .map((r) => `[${r.tier}] ${r.title} | ${r.price} | ${r.area}`);
      const otherTitles = rows
        .filter((r) => r.tier !== 'diamond' && r.tier !== 'gold')
        .slice(0, 8)
        .map((r) => `[${r.tier}] ${r.title} | ${r.price} | ${r.area}`);
      const facts = {
        project: meta.projectName,
        totalListings: computed.totalListingsCount,
        pages: computed.dataSource?.pages,
        tiers: { diamond: computed.vipStats.vipDiamond, gold: computed.vipStats.vipGold, silver: computed.vipStats.vipSilver, normal: computed.vipStats.normal, vipPercentage: computed.vipStats.vipPercentage },
        pagesBreakdown: computed.pagesBreakdown?.map((p) => ({ page: p.pageNumber, note: p.keyCharacteristics })),
        products: computed.productsAndPricing,
        contentCategories: computed.contentCategories.map((c) => ({ name: c.categoryName, count: c.count, percentage: c.percentage, topKeywords: c.topKeywords })),
        topBrokers: computed.top5Brokers.map((b) => ({ name: b.name, listings: b.totalListings })),
        proposedProducts: computed.recommendations.map((r) => ({ id: r.id, type: r.productType, listings: r.productName, priceRange: r.priceEstimate, areaRange: r.area, typicalTitleFromData: r.sampleTitleBDS })),
      };

      const prompt = `Bạn là chuyên gia phân tích thị trường BĐS Việt Nam. Dưới đây là DỮ LIỆU THẬT do người dùng quét từ batdongsan.com.vn (đã được máy tính thống kê sẵn).

DỮ LIỆU THỐNG KÊ (JSON):
${JSON.stringify(facts)}

TIÊU ĐỀ THẬT ĐANG Ở TOP (VIP Kim Cương/Vàng):
${topTitles.join('\n')}

MỘT SỐ TIÊU ĐỀ THẬT KHÁC:
${otherTitles.join('\n')}

QUY TẮC BẮT BUỘC:
- CHỈ dùng con số và tên có trong dữ liệu trên. TUYỆT ĐỐI KHÔNG bịa số liệu, số điện thoại, tên môi giới, số tin, xu hướng giá theo thời gian.
- Không có mốc so sánh thời gian thì không nói giá tăng/giảm.
- Trả về JSON gồm:
  1. competitionAnalysis: 2-3 câu nhận định mức độ cạnh tranh VIP dựa trên số liệu tiers và pagesBreakdown.
  2. marketNotes: 2-3 câu nhận xét về mặt bằng giá/sản phẩm dựa trên products.
  3. categoryAngles: với mỗi contentCategories, 2-3 góc tiếp cận (angles) rút ra từ tiêu đề thật ở trên.
  4. recommendations: đúng 3 phần tử theo proposedProducts (giữ nguyên id). Mỗi phần tử: whyRecommended (1-2 câu, chỉ dùng số trong dữ liệu), sampleTitleBDS (dưới 99 ký tự, dựa trên typicalTitleFromData và cách đặt tiêu đề của các tiêu đề top; chỉ dùng con số có trong proposedProducts của chính sản phẩm đó; không emoji), outlineBullets (3-4 gạch đầu dòng dàn ý, không chứa số liệu cụ thể).`;

      const response = await ai.models.generateContent({
        model: AI_MODEL,
        contents: prompt,
        config: {
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              competitionAnalysis: { type: Type.STRING },
              marketNotes: { type: Type.STRING },
              categoryAngles: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: { categoryName: { type: Type.STRING }, angles: { type: Type.ARRAY, items: { type: Type.STRING } } },
                  required: ['categoryName', 'angles'],
                },
              },
              recommendations: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.INTEGER },
                    whyRecommended: { type: Type.STRING },
                    sampleTitleBDS: { type: Type.STRING },
                    outlineBullets: { type: Type.ARRAY, items: { type: Type.STRING } },
                  },
                  required: ['id', 'whyRecommended', 'sampleTitleBDS', 'outlineBullets'],
                },
              },
            },
            required: ['competitionAnalysis', 'marketNotes', 'categoryAngles', 'recommendations'],
          },
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      // Any text that contains a figure not present in the real data is dropped (the computed text stays).
      const allowed = JSON.stringify(facts) + ' ' + rows.map((r) => `${r.title} ${r.price} ${r.area} ${r.pricePerM2}`).join(' ');
      const safe = (text: any, fallback: string) => {
        if (typeof text !== 'string' || !text.trim()) return fallback;
        const bad = unsupportedFigures(text, allowed);
        if (bad.length) {
          console.warn('Dropped AI text with unsupported figures:', bad.join(', '), '|', text.slice(0, 120));
          return fallback;
        }
        return text.trim();
      };

      res.json({
        success: true,
        data: {
          competitionAnalysis: safe(parsed.competitionAnalysis, ''),
          marketNotes: safe(parsed.marketNotes, ''),
          categoryAngles: (Array.isArray(parsed.categoryAngles) ? parsed.categoryAngles : []).map((c: any) => ({
            categoryName: String(c?.categoryName || ''),
            angles: (Array.isArray(c?.angles) ? c.angles : []).filter((a: any) => typeof a === 'string' && unsupportedFigures(a, allowed).length === 0),
          })),
          recommendations: (Array.isArray(parsed.recommendations) ? parsed.recommendations : []).map((r: any) => ({
            id: Number(r?.id),
            whyRecommended: safe(r?.whyRecommended, ''),
            sampleTitleBDS: safe(r?.sampleTitleBDS, '').slice(0, 99),
            outlineBullets: (Array.isArray(r?.outlineBullets) ? r.outlineBullets : []).filter((b: any) => typeof b === 'string' && unsupportedFigures(b, allowed).length === 0),
          })),
        },
      });
    } catch (error: any) {
      console.warn('AI market narrative error:', error?.message);
      res.status(502).json({ error: `AI chưa viết được nhận định (${error?.message || 'lỗi không rõ'}). Các con số thống kê vẫn đúng và đang hiển thị.` });
    }
  });

  // 1C. Competitor Deep Playbook Reverse-Engineering Endpoint (Phần 2: Phân Tích Đồng Nghiệp)
  app.post('/api/gemini/analyze-competitor-playbook', async (req, res) => {
    try {
      const { competitorUrl, competitorName, projectName, customNotes, rows: rawRows } = req.body;
      const compRows: ListingRow[] = Array.isArray(rawRows) ? (rawRows as ListingRow[]).slice(0, 200) : [];
      if (compRows.length === 0 && !(customNotes && String(customNotes).trim())) {
        return res.status(400).json({ error: 'Cần dữ liệu thật của đối thủ: chọn một môi giới trong dữ liệu đã quét, hoặc dán các tin đăng của họ vào ô ghi chú. App không tự suy đoán từ link.' });
      }
      const tc = tierCounts(compRows);
      const compFacts = compRows.length
        ? {
            listingCount: compRows.length,
            tiers: tc,
            products: groupByProduct(compRows).map((g) => ({ type: g.type, count: g.count, priceRange: g.priceRange, medianPricePerM2: g.medianPricePerM2, areaRange: g.areaRange })),
            keywordBuckets: bucketStats(compRows).map((b) => ({ name: b.categoryName, count: b.count, topKeywords: b.topKeywords })),
            brokers: brokerStats(compRows).slice(0, 3).map((b) => ({ name: b.name, listings: b.rows.length })),
            titles: compRows.slice(0, 25).map((r) => `[${r.tier}] ${r.title} | ${r.price} | ${r.area} | ${r.published}`),
          }
        : null;
      const realDataBlock = `
# REAL DATA (the ONLY source of facts)
${compFacts ? JSON.stringify(compFacts) : '(no structured listing data; use only the user notes above)'}

# STRICT RULES
- Use ONLY the real data and user notes above. Never invent numbers, phone numbers, names, listing counts, posting frequency, traffic, or cross-platform funnels.
- Anything that cannot be derived from this data (traffic mechanics, personal branding, Zalo/Facebook funnel, posting velocity) must be written exactly as: "Không có dữ liệu trong trang danh sách".
- Quote analyzed headlines verbatim, using ONLY the title text (the part before the first " | "), without the appended price/area/date.
- All figures in the output must appear in the data above.`;

      const prompt = `You are an elite Real Estate Growth Hacker, Data Analyst, and AI Automation Architect specializing in property market dominance. Your task is to perform an exhaustive, reverse-engineering analysis of a competitor's real estate profile page and active listings on Batdongsan.com.vn to extract their exact marketing playbook, traffic mechanics, and conversion psychological hooks—and subsequently deliver an aggressive, actionable, step-by-step competitive counter-strategy and technical implementation roadmap.

Target Competitor Information:
- Profile / Listings URL on Batdongsan.com.vn: ${competitorUrl || 'https://batdongsan.com.vn'}
- Competitor Broker / Agency Name: ${competitorName || 'Đối thủ phân tích'}
- Focus Project: ${projectName || 'Đại đô thị Vinhomes'}
${customNotes ? `Additional Listings Excerpt / User Notes / Sample Headings:\n${customNotes}` : ''}
${realDataBlock}

# Analytical Framework
Dissect the target competitor across the four critical pillars:
1. Traffic & Visibility Mechanics (SEO & Saturation):
- Volume of active listings, posting velocity/freshness, and category distribution (Sales vs. Rentals, property types, tier focus).
- Title structures, primary/secondary keyword targeting (project names, sub-zones, unit types), and algorithmic visibility tactics.
2. Psychological Copywriting & Pricing Strategy:
- Deconstruct the emotional distress hooks used in titles and descriptions ("ngộp bank", "cắt lỗ sâu", "giá đáy", "áp dụng vốn vay/áp VC", "chủ nhà gồng hết nổi").
- Pricing psychology, unit-size positioning, and how value/discount propositions are framed for investors vs. end-users.
3. Personal Branding & Ecosystem Funneling:
- How the competitor positions their professional identity (certifications, years, awards, visual branding, phone CTA).
- Map their cross-platform funnel (channeling traffic to Zalo VIP group, Facebook, TikTok into Batdongsan.com.vn or vice-versa).
4. Competitive Vulnerability & Gap Analysis:
- Blind spots in competitor strategy (unaddressed financial advisory angles, lack of deep data transparency, rigid/spammed messaging, poor imagery).

# Output Deliverables Structure
Your response must provide both structured dashboard fields AND a clean, comprehensive, professional Markdown report in Vietnamese inside "markdownReport", structured into the required sections:
## 1. Executive Summary & Competitor DNA
- Sharp, data-driven synthesis of core positioning, dominant segments, threat level, and traffic drivers.
## 2. Reverse-Engineered Playbook
- Bulleted breakdown of copywriting formulas, pricing triggers, and inventory mix tactics.
## 3. Offensive Competitive Strategy (How to Outmaneuver Them)
- Differentiation matrix: Shifting from distress hooks ("ngộp") to high-value financial structuring, asset yield optimization, and "Quiet Luxury" trust-building.
- Omnichannel capture framework: Intercepting their traffic before/after users hit their profile.
## 4. Actionable Implementation Roadmap (Ready for Execution)
- Phase 1: Content & Copywriting Refinement (Listing templates and headline formulas).
- Phase 2: Algorithmic & SEO Domination (Posting cadences, long-tail keyword matrices).
- Phase 3: AI Automation & CRM Integration (Workflows to auto-track and counter competitor inventory shifts).

Language: Professional Vietnamese with standard real estate industry terms.`;

      const response = await ai.models.generateContent({
        model: AI_MODEL,
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              competitorName: { type: Type.STRING },
              threatLevel: { type: Type.STRING, enum: ['Cao', 'Trung Bình', 'Cực Kỳ Nguy Hiểm'] },
              executiveSummary: {
                type: Type.OBJECT,
                properties: {
                  corePositioning: { type: Type.STRING },
                  dominantSegments: { type: Type.ARRAY, items: { type: Type.STRING } },
                  primaryTrafficDrivers: { type: Type.ARRAY, items: { type: Type.STRING } },
                  summarySynthesis: { type: Type.STRING },
                },
                required: ['corePositioning', 'dominantSegments', 'primaryTrafficDrivers', 'summarySynthesis'],
              },
              pillar1TrafficAndSeo: {
                type: Type.OBJECT,
                properties: {
                  activeListingsEstimate: { type: Type.STRING },
                  postingVelocity: { type: Type.STRING },
                  categoryDistribution: { type: Type.STRING },
                  titleStructurePatterns: { type: Type.ARRAY, items: { type: Type.STRING } },
                  primaryKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
                  secondaryKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
                  algorithmicVisibilityTactics: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
                required: ['activeListingsEstimate', 'postingVelocity', 'categoryDistribution', 'titleStructurePatterns', 'primaryKeywords', 'algorithmicVisibilityTactics'],
              },
              pillar2PsychologicalCopywriting: {
                type: Type.OBJECT,
                properties: {
                  emotionalDistressHooks: { type: Type.ARRAY, items: { type: Type.STRING } },
                  pricingPsychology: { type: Type.STRING },
                  unitSizePositioning: { type: Type.STRING },
                  valuePropositionTactic: { type: Type.STRING },
                  analyzedHeadlines: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
                required: ['emotionalDistressHooks', 'pricingPsychology', 'unitSizePositioning', 'valuePropositionTactic', 'analyzedHeadlines'],
              },
              pillar3PersonalBranding: {
                type: Type.OBJECT,
                properties: {
                  professionalPositioning: { type: Type.STRING },
                  credibilitySignals: { type: Type.ARRAY, items: { type: Type.STRING } },
                  crossPlatformFunnel: { type: Type.STRING },
                },
                required: ['professionalPositioning', 'credibilitySignals', 'crossPlatformFunnel'],
              },
              pillar4VulnerabilityGaps: {
                type: Type.OBJECT,
                properties: {
                  blindSpots: { type: Type.ARRAY, items: { type: Type.STRING } },
                  missingFinancialAdvisory: { type: Type.ARRAY, items: { type: Type.STRING } },
                  unaddressedBuyerConcerns: { type: Type.ARRAY, items: { type: Type.STRING } },
                  vulnerabilitiesToExploit: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
                required: ['blindSpots', 'missingFinancialAdvisory', 'unaddressedBuyerConcerns', 'vulnerabilitiesToExploit'],
              },
              offensiveCounterStrategy: {
                type: Type.OBJECT,
                properties: {
                  differentiationMatrix: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        competitorTactic: { type: Type.STRING },
                        counterStrategy: { type: Type.STRING },
                        expectedImpact: { type: Type.STRING },
                      },
                      required: ['competitorTactic', 'counterStrategy', 'expectedImpact'],
                    },
                  },
                  omnichannelInterception: { type: Type.ARRAY, items: { type: Type.STRING } },
                  counterListingTemplates: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        title: { type: Type.STRING },
                        targetCustomer: { type: Type.STRING },
                        psychologicalHook: { type: Type.STRING },
                        counterAngle: { type: Type.STRING },
                      },
                      required: ['title', 'targetCustomer', 'psychologicalHook', 'counterAngle'],
                    },
                  },
                },
                required: ['differentiationMatrix', 'omnichannelInterception', 'counterListingTemplates'],
              },
              actionableRoadmap: {
                type: Type.OBJECT,
                properties: {
                  phase1ContentRefinement: { type: Type.ARRAY, items: { type: Type.STRING } },
                  phase2SeoDomination: { type: Type.ARRAY, items: { type: Type.STRING } },
                  phase3AiAutomation: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
                required: ['phase1ContentRefinement', 'phase2SeoDomination', 'phase3AiAutomation'],
              },
              markdownReport: { type: Type.STRING },
            },
            required: [
              'competitorName',
              'threatLevel',
              'executiveSummary',
              'pillar1TrafficAndSeo',
              'pillar2PsychologicalCopywriting',
              'pillar3PersonalBranding',
              'pillar4VulnerabilityGaps',
              'offensiveCounterStrategy',
              'actionableRoadmap',
              'markdownReport',
            ],
          },
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      res.json({
        success: true,
        data: {
          ...parsed,
          competitorUrl: competitorUrl || 'https://batdongsan.com.vn',
          analyzedAt: new Date().toLocaleTimeString('vi-VN') + ' - ' + new Date().toLocaleDateString('vi-VN'),
        },
      });
    } catch (error: any) {
      console.warn('AI Competitor Playbook error:', error?.message);
      res.status(502).json({ error: `AI chưa phân tích được (${error?.message || 'lỗi không rõ'}). Hãy thử lại.` });
    }
  });

  // --- KNOWLEDGE BASE & CONTEXT INJECTION ENDPOINTS ---
  app.get('/api/knowledge-base/list', (req, res) => {
    res.json({ success: true, data: getAllKnowledgeBases() });
  });

  app.get('/api/knowledge-base/:id', (req, res) => {
    const kb = getKnowledgeBase(req.params.id);
    res.json({ success: true, data: kb });
  });

  app.post('/api/knowledge-base/update', (req, res) => {
    const { id, markdownContent, updatedAt, version } = req.body;
    if (!id || typeof markdownContent !== 'string') {
      return res.status(400).json({ error: 'id và markdownContent là bắt buộc.' });
    }
    const updated = updateKnowledgeBase(id, { markdownContent, updatedAt, version });
    try {
      const diskDir = path.join(__dirname, 'src', 'data', 'knowledge', 'projects');
      if (!fs.existsSync(diskDir)) {
        fs.mkdirSync(diskDir, { recursive: true });
      }
      const diskPath = path.join(diskDir, updated.filename);
      fs.writeFileSync(diskPath, markdownContent, 'utf-8');
    } catch (fsErr) {
      console.warn('Could not persist knowledge base markdown to disk:', fsErr);
    }
    res.json({ success: true, data: updated });
  });

  app.post('/api/knowledge-base/match', (req, res) => {
    const { projectName, subdivision, propertyType, area, amenities, keyHighlights } = req.body;
    const match = matchAndInjectContext({ projectName, subdivision, propertyType, area, amenities, keyHighlights });
    res.json({ success: true, data: match });
  });

  // 1D. Sales Quick Raw Property Parser (Bóc tách tự động thông tin thô từ Zalo/Ghi chú của Sale)
  app.post('/api/gemini/parse-raw-listing', async (req, res) => {
    try {
      const { rawText } = req.body;
      if (!rawText || typeof rawText !== 'string' || !rawText.trim()) {
        return res.status(400).json({ error: 'Vui lòng cung cấp nội dung ghi chú thô của căn nhà.' });
      }

      const prompt = `Bạn là Trợ lý AI Bóc Tách Dữ Liệu BĐS chuyên nghiệp tại Vũ Việt Property (VuVietHome.com.vn).
Nhiệm vụ của bạn là đọc kỹ đoạn nội dung thô hoặc tin nhắn Zalo/ghi chú từ Sales hoặc chủ nhà, sau đó tự động trích xuất chính xác các trường dữ liệu để điền vào Checklist Thẻ Tin Đăng Batdongsan.com.vn.

NỘI DUNG THÔ ĐẦU VÀO TỪ SALE:
"""
${rawText}
"""

HƯỚNG DẪN TRÍCH XUẤT VÀ SUY LUẬN:
1. Tên dự án (projectName):
   - Nếu có mã căn như HA1, HA2, SB, SH, NT, CL, PB, TH, ĐD, KĐ... hãy tự động nhận diện (vd: "HA1" -> "Vinhomes Ocean Park 1", "ĐD/KĐ/SB" ở Hưng Yên -> "Vinhomes Ocean Park 2 / 3", "Hạ Long Xanh", "Olympic", "King Park Bắc Ninh").
   - Nếu không có tên dự án rõ ràng, ghi nhận dự đoán khả dĩ nhất và thêm vào danh sách hỏi lại nếu không chắc chắn.
2. Phân khu & Mã căn (subdivision, unitCode):
   - Tách rõ mã căn (ví dụ "HA1-95") và tên phân khu đầy đủ (ví dụ "Phân khu Hải Âu 1").
3. Loại hình BĐS (propertyType):
   - Liền kề, Shophouse, Biệt thự song lập, Biệt thự đơn lập, Căn hộ chung cư...
4. Diện tích & Kích thước (area, frontage, constructionArea):
   - area: Chỉ lấy số hoặc số kèm đơn vị m² (ví dụ: "56").
   - frontage: Mặt tiền (ví dụ: "4m x 14m" hoặc "4m").
   - constructionArea: Tổng diện tích xây dựng sàn (ví dụ: "224.3m²").
5. Tầng & Hướng (floors, orientation):
   - floors: Số tầng (ví dụ: "5 tầng").
   - orientation: Hướng nhà (ví dụ: "Tây Bắc", "Đông Nam"...).
6. Mức giá & Đơn giá (price, pricePerM2):
   - price: Giá niêm yết (ví dụ: "7 tỷ bao phí" hoặc "7 tỷ").
   - pricePerM2: Tự động tính nhẩm ra đơn vị tr/m² (ví dụ: "125 tr/m²").
7. Pháp lý (legal):
   - Ví dụ: "Sổ đỏ sẵn có (chủ tự tất toán giải chấp bank)".
8. Điểm nhấn & Tiện ích (amenities, keyHighlights):
   - Ghi lại các điểm mạnh: gần 10 tòa chung cư, công viên Silk Park, Vincom, Vinschool, gần ngã tư căn góc, 5 phòng ngủ, ban công...
9. Persona giọng văn phù hợp (personaVoice):
   - Nếu là Ocean Park (1, 2, 3) -> "le_yen" (Ms Yến - 0918 600 050).
   - Nếu là King Park, Hạ Long Xanh, Olympic hoặc tỉnh khác -> "vu_viet" (Mr Việt - 090.223.5050).
10. Kiểm tra Checklist:
    - Bắt buộc: projectName, subdivision, propertyType, area, price.
    - Không bắt buộc (nhưng hữu ích): orientation, frontage, floors, constructionArea, legal, amenities.
    - Liệt kê các câu hỏi trợ lý cần hỏi lại nếu thiếu trường quan trọng hoặc cần làm rõ.`;

      const response = await ai.models.generateContent({
        model: AI_MODEL,
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              projectName: { type: Type.STRING },
              subdivision: { type: Type.STRING },
              unitCode: { type: Type.STRING },
              propertyType: { type: Type.STRING },
              area: { type: Type.STRING },
              price: { type: Type.STRING },
              pricePerM2: { type: Type.STRING },
              frontage: { type: Type.STRING },
              orientation: { type: Type.STRING },
              floors: { type: Type.STRING },
              constructionArea: { type: Type.STRING },
              bedrooms: { type: Type.STRING },
              bathrooms: { type: Type.STRING },
              legal: { type: Type.STRING },
              amenities: { type: Type.STRING },
              keyHighlights: { type: Type.STRING },
              address: { type: Type.STRING },
              personaVoice: { type: Type.STRING, enum: ['le_yen', 'vu_viet'] },
              contactName: { type: Type.STRING },
              phone: { type: Type.STRING },
              confidenceScore: { type: Type.NUMBER },
              summaryOneLiner: { type: Type.STRING },
              missingRequiredFields: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              missingOptionalQuestions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    fieldKey: { type: Type.STRING },
                    fieldLabel: { type: Type.STRING },
                    questionText: { type: Type.STRING },
                    defaultSuggestion: { type: Type.STRING },
                  },
                  required: ['fieldKey', 'fieldLabel', 'questionText'],
                },
              },
            },
            required: [
              'projectName',
              'subdivision',
              'propertyType',
              'area',
              'price',
              'personaVoice',
              'confidenceScore',
              'summaryOneLiner',
              'missingRequiredFields',
              'missingOptionalQuestions',
            ],
          },
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      res.json({
        success: true,
        data: parsed,
      });
    } catch (error: any) {
      console.warn('AI Parse Raw Listing error, using smart regex fallback:', error?.message);
      
      // Rule-based fallback: extracts ONLY what is literally present in the text; everything else stays empty.
      const rawText: string = req.body.rawText || '';
      const lower = rawText.toLowerCase();

      let projectName = '';
      if (lower.includes('ocean park 2') || lower.includes('the empire')) projectName = 'Vinhomes Ocean Park 2 - The Empire';
      else if (lower.includes('ocean park 3') || lower.includes('the crown')) projectName = 'Vinhomes Ocean Park 3 - The Crown';
      else if (lower.includes('hạ long xanh') || lower.includes('ha long')) projectName = 'Vinhomes Hạ Long Xanh';
      else if (lower.includes('king park')) projectName = 'Khu Đô Thị King Park Bắc Ninh';
      else if (lower.includes('olympic')) projectName = 'Đại Đô Thị Vinhomes Olympic Hà Nội';
      else if (lower.includes('ocean park 1') || /\bha\d+-\d+/i.test(rawText)) projectName = 'Vinhomes Ocean Park 1';

      const codeMatch = rawText.match(/(HA\d+-\d+|SB-?\d+-?\d*|ĐD-?\d+|CL-?\d+|PB-?\d+|KĐ-?\d+)/i);
      const unitCode = codeMatch ? codeMatch[1] : '';

      let propertyType = '';
      if (lower.includes('shophouse')) propertyType = 'Shophouse';
      else if (lower.includes('song lập')) propertyType = 'Biệt thự song lập';
      else if (lower.includes('đơn lập')) propertyType = 'Biệt thự đơn lập';
      else if (lower.includes('liền kề') || /\blk\b/.test(lower)) propertyType = 'Liền kề';

      const areaMatch = rawText.match(/(\d+(?:[.,]\d+)?)\s*(?:m2|m²)/i);
      const area = areaMatch ? areaMatch[1] : '';
      const priceMatch = rawText.match(/(\d+(?:[.,]\d+)?\s*(?:tỷ|ty|tr|triệu)[^\n,]*)/i);
      const price = priceMatch ? priceMatch[1].trim() : '';
      const ftMatch = rawText.match(/(?:mặt tiền|mt)\s*[:\s]*([^\n,-]+)/i);
      const frontage = ftMatch ? ftMatch[1].trim() : '';
      const dirMatch = rawText.match(/hướng\s*[:\s]*([a-zA-Zà-ỹ\s]+)/i);
      const orientation = dirMatch ? dirMatch[1].trim().split(/[\n,.-]/)[0].trim() : '';
      const flMatch = rawText.match(/(\d+\s*tầng[^\n,]*)/i);
      const floors = flMatch ? flMatch[1].trim() : '';

      const required: Array<[string, string]> = [['projectName', projectName], ['propertyType', propertyType], ['area', area], ['price', price]];
      const missingRequiredFields = required.filter(([, v]) => !v).map(([k]) => k);
      const isOcean = projectName.toLowerCase().includes('ocean park');

      res.json({
        success: true,
        data: {
          projectName,
          subdivision: unitCode ? `Mã căn ${unitCode}` : '',
          unitCode,
          propertyType,
          area,
          price,
          pricePerM2: '',
          frontage,
          orientation,
          floors,
          constructionArea: '',
          bedrooms: '',
          bathrooms: '',
          legal: '',
          amenities: '',
          keyHighlights: '',
          address: '',
          personaVoice: projectName ? (isOcean ? 'le_yen' : 'vu_viet') : undefined,
          contactName: '',
          phone: '',
          confidenceScore: 40,
          summaryOneLiner: 'AI chưa phản hồi nên chỉ bóc được các trường có sẵn trong ghi chú. Hãy kiểm tra và điền nốt các trường còn trống.',
          missingRequiredFields,
          missingOptionalQuestions: [],
        },
      });
    }
  });

  // Memory store for broker voice learning & personalization
  interface LearnedVoiceEdit {
    id: string;
    broker: string; // 'le_yen' | 'vu_viet'
    channel: string; // 'batdongsan' | 'zalo' | 'facebook'
    originalTitle: string;
    originalContent: string;
    editedTitle: string;
    editedContent: string;
    projectName: string;
    timestamp: string;
    notes?: string;
  }
  const learnedVoiceEdits: LearnedVoiceEdit[] = [];

  // Helper: Format strictly compliant titles: 90 - 99 characters (NEVER exceeds 99 characters!)
  function formatStrict99Title(raw: string, projectName: string): string {
    let text = (raw || '')
      .replace(/[\r\n\t]+/g, ' ')
      .replace(/\s+/g, ' ')
      .replace(/[^\w\s\dà-ỹÀ-Ỹ.,/()\-+%²]/g, '')
      .trim();

    const cleanProjectName = projectName ? projectName.trim() : 'Vinhomes';
    const suffix = ` - ${cleanProjectName}`;

    // 1. If longer than 99 characters: truncate prefix safely keeping project suffix
    if (text.length > 99) {
      if (text.includes(suffix)) {
        const allowedPrefixLen = 99 - suffix.length;
        if (allowedPrefixLen >= 20) {
          let prefix = text.split(suffix)[0].trim();
          prefix = prefix.slice(0, allowedPrefixLen).trim().replace(/[, \-]+$/, '');
          text = `${prefix}${suffix}`;
        } else {
          text = text.slice(0, 99).trim().replace(/[, \-]+$/, '');
        }
      } else {
        text = text.slice(0, 99).trim().replace(/[, \-]+$/, '');
      }
    }

    // 3. Absolute clamp guarantee: MUST be <= 99 characters
    if (text.length > 99) {
      text = text.slice(0, 99).trim().replace(/[, \-]+$/, '');
    }

    return text;
  }

  // 2. SEO Content Generation Endpoint (3 versions: Batdongsan, Zalo, Facebook)
  app.post('/api/gemini/generate-listings', async (req, res) => {
    try {
      const {
        projectName,
        subdivision,
        propertyType,
        area,
        bedrooms,
        bathrooms,
        price,
        pricePerM2,
        address,
        legal,
        amenities,
        keyHighlights,
        contactName,
        phone,
        targetKeywords,
        appliedTitle,
        counterAngle,
        sourceStrategy,
        personaVoice: rawVoice,
        orientation,
        frontage,
        floors,
        constructionArea,
        marketContext,
      } = req.body;

      if (!projectName || !price || !area) {
        return res.status(400).json({ error: 'Tên dự án, diện tích và mức giá là thông tin bắt buộc.' });
      }

      // Determine persona: Ocean Park -> Le Yen, Others -> Vu Viet (unless explicitly chosen)
      const isOceanProject = projectName.toLowerCase().includes('ocean park') || projectName.toLowerCase().includes('ocean city') || projectName.toLowerCase().includes('the empire') || projectName.toLowerCase().includes('the crown') || projectName.toLowerCase().includes('hải âu');
      const activeVoice = rawVoice || (isOceanProject ? 'le_yen' : 'vu_viet');

      const isLeYen = activeVoice === 'le_yen';
      const defaultContactName = isLeYen ? 'Ms Yến' : 'Mr Việt';
      const defaultPhone = isLeYen ? '0918 600 050' : '090.223.5050';
      const finalContactName = contactName || defaultContactName;
      const finalPhone = phone || defaultPhone;

      const voiceGuidelines = isLeYen
        ? `### HƯỚNG DẪN GIỌNG VĂN: LÊ YẾN (Ms Yến — ${finalPhone}) - Áp dụng dự án Ocean Park
- Xưng hô: "em" / "E Yến" / "Ms Yến" — gọi "anh chị" / "quý anh chị". Tuyệt đối KHÔNG dùng "tôi", "chúng tôi".
- Dòng 1-2 (Câu mở dồn nén): 1-2 câu dài (~30-40 từ), nhồi hết: loại hình + dự án + diện tích + đặc điểm nổi bật. KHÔNG có SĐT ở dòng 1-2!
- Dòng 3 (Liên hệ đầu): "Miễn phí môi giới. LH E Yến - ${finalPhone} (zalo, imess)"
- Dòng 4 (Câu chuyển): "Thông tin cụ thể như sau:"
- Dòng 5 trở đi (Khung gạch đầu dòng): Chia thành đúng 5 cụm, mỗi cụm 2-3 dòng rồi 1 DÒNG TRẮNG cách nhau. Mỗi dòng bắt đầu bằng dấu "-", dưới 12 chữ/dòng:
  * Cụm 1 (Thông số): Diện tích đất ${area}m², ${floors || '(không có dữ liệu: bỏ qua)'}, ${constructionArea ? `tổng sàn ${constructionArea}` : ''}, ${frontage || '(không có dữ liệu: bỏ qua mặt tiền)'}, hướng ${orientation || '(không có dữ liệu: bỏ qua hướng)'}
  * Cụm 2 (Điểm nhấn): CHỈ điểm nhấn có trong dữ liệu đầu vào; không có thì dùng đặc điểm phân khu từ kho dự án
  * Cụm 3 (Vị trí & Tiện ích): CHỈ tiện ích xác thực trong kho dự án; không tự thêm khoảng cách
  * Cụm 4 (Công năng): theo loại hình thật của căn; không hứa hẹn dòng tiền/cho thuê nếu không có dữ liệu
  * Cụm 5 (Pháp lý & Giá): theo dữ liệu đầu vào; không tự thêm chiết khấu, voucher, ký trực tiếp CĐT hay tình trạng sổ
- Câu chốt: "Liên hệ: Ms Yến - ${finalPhone} để xem thực tế và tư vấn cụ thể về pháp lý thủ tục. Trân trọng cảm ơn quý khách hàng đã đọc tin!"
  * LƯU Ý: Câu chốt KHÔNG được kèm chữ "(zalo)"!
- Bộ từ đặc trưng: "cực kỳ rẻ", "siêu khủng", "tha hồ", "chưa bao giờ có giá tốt như thế", dấu "=" thay cho "nên/dẫn đến" (vd: "Ký trực tiếp CĐT = Sổ đứng tên mình đầu tiên").
- 3 đòn thuyết phục: Neo giá (CHỈ khi dữ liệu đầu vào có giá gốc/giá chuyển nhượng; nếu không có thì bỏ đòn này), Quy về đơn giá/m² ("đơn giá cực kỳ rẻ ${pricePerM2 || ''}"), Bằng chứng xã hội (CHỈ khi có trong dữ liệu đầu vào hoặc kho dự án).`
        : `### HƯỚNG DẪN GIỌNG VĂN: VŨ VIỆT (Mr Việt — ${finalPhone}) - Áp dụng Bắc Ninh, Hạ Long Xanh, Olympic
- Xưng hô: "em" — gọi "anh chị" / "quý anh chị". Tuyệt đối KHÔNG dùng "tôi", "Ms Yến".
- Giọng nam, thẳng, bóc số: Tự tin, có căn cứ, nói luôn nhược điểm rồi kèm hướng xử lý. Ít tính từ phóng đại. "Cực kỳ" tối đa 1 lần/tin. Thay bằng con số thực tế.
- KHÔNG emoji, KHÔNG icon trong bài đăng Batdongsan!
- Câu đặc trưng: "Em nói trước:", "Em nói luôn:", "Anh chị tự so", dấu "=" (tối đa 1 lần/tin).
- Có 1 cụm "nói thẳng nhược điểm" kèm giải pháp xử lý.
- Định vị: "11 năm em chỉ bán thấp tầng Vinhomes" hoặc "Đáng thì em nói đáng, không đáng em nói không".
- Dòng 1-2 (Câu mở dồn nén): Dồn thông số chính, không có SĐT.
- Dòng 3 (Liên hệ đầu): "Miễn phí môi giới và tư vấn. LH Mr Việt - ${finalPhone} (zalo)"
- Dòng 4 (Câu chuyển): "Thông tin cụ thể như sau:"
- Dòng 5 trở đi (Khung gạch đầu dòng): Chia cụm 2-3 dòng rồi 1 dòng trắng.
- Câu chốt: "Liên hệ: Mr Việt - ${finalPhone} để em gửi bản đồ quy hoạch và tư vấn cụ thể. Cảm ơn anh chị đã đọc tin!"
  * LƯU Ý: Câu chốt KHÔNG kèm chữ "(zalo)"!`;

      // Incorporate learned voice preferences into prompt for self-upgrading personalization
      const brokerLearned = learnedVoiceEdits.filter((item) => item.broker === activeVoice);
      let learnedVoiceContext = '';
      if (brokerLearned.length > 0) {
        learnedVoiceContext = `\n--- DỮ LIỆU ĐÃ HỌC TỪ CÁC LẦN CHỈNH SỬA CỦA MÔI GIỚI (${brokerLearned.length} bài) ---\n` +
          brokerLearned.slice(0, 3).map((l, i) => `[Mẫu chỉnh sửa thực tế ${i + 1}]:
- Tiêu đề gốc: "${l.originalTitle}" -> Môi giới đã sửa thành: "${l.editedTitle}"
- Đoạn trích chỉnh sửa: "${l.editedContent.slice(0, 180)}..."`).join('\n') +
          `\nHÃY HỌC THEO PHONG CÁCH VÀ CÁCH DÙNG TỪ CÁ NHÂN HÓA NÀY CỦA MÔI GIỚI ĐỂ VIẾT BÀI ĐÚNG GU NHẤT!`;
      }

      // Execute Smart Knowledge Router & Context Injection
      const contextInjection = matchAndInjectContext({
        projectName,
        subdivision,
        propertyType,
        area,
        price,
        amenities,
        keyHighlights,
      });

      const mc = marketContext && typeof marketContext === 'object' ? marketContext : null;
      const marketBlock = mc
        ? `--- DỮ LIỆU THỊ TRƯỜNG THẬT (batdongsan.com.vn, quét lúc ${mc.scrapedAt}, ${mc.rowCount} tin, tin VIP ${mc.vipPercentage}%) ---
${(mc.products || []).map((pd: any) => `- ${pd.type}: ${pd.count} tin, giá ${pd.priceRange}${pd.medianPricePerM2 ? `, đơn giá trung vị ${pd.medianPricePerM2}` : ''}`).join('\n')}
- Từ khóa đang được dùng nhiều: ${(mc.topKeywords || []).join(', ')}
- Tiêu đề đang ở top (chỉ để học cách đặt tên và góc tiếp cận; KHÔNG sao chép, KHÔNG dùng số liệu của họ):
${(mc.topTitles || []).map((t: string) => `  * ${t}`).join('\n')}
Dùng dữ liệu này để chọn từ khóa và góc tiếp cận. KHÔNG dùng làm thông số của căn.`
        : `--- DỮ LIỆU THỊ TRƯỜNG ---
Chưa có dữ liệu thị trường thật: KHÔNG so sánh với thị trường, KHÔNG viết "rẻ hơn thị trường" hay "giá tốt nhất khu vực".`;
      const factRules = `--- QUY TẮC DỮ KIỆN (ƯU TIÊN CAO NHẤT) ---
1. Mọi con số, tên, chính sách, pháp lý trong tin PHẢI có trong "DỮ LIỆU ĐẦU VÀO", "KNOWLEDGE BASE" hoặc "DỮ LIỆU THỊ TRƯỜNG THẬT". Không có thì KHÔNG viết.
2. Mục ghi "Chưa cung cấp" nghĩa là bỏ qua, không đoán, không dùng giá trị "thường gặp".
3. Số liệu trong các ví dụ của hướng dẫn chỉ minh họa cấu trúc, TUYỆT ĐỐI không đưa vào tin.
4. KHÔNG tự thêm động cơ hay tình trạng bán (bán gấp, cắt lỗ, chính chủ, ngoại giao, suất CĐT, giá hời...) nếu dữ liệu đầu vào không nói rõ.
5. Thiếu thành tố nào của tiêu đề thì bỏ thành tố đó và bù đủ 90-99 ký tự bằng dữ kiện CÓ THẬT (phân khu, mã căn, loại hình, tiện ích thật). Không chèn các cụm "đẹp", "chính chủ", "sổ đỏ" nếu dữ liệu không nói vậy.`;

      const prompt = `Bạn là Giám đốc Soạn tin Bất Động Sản Cao Cấp tại Vũ Việt Property (VuVietHome.com.vn).
Nhiệm vụ của bạn là soạn bộ tin đăng BĐS theo đúng BỘ QUY TẮC CHUẨN CỦA VŨ VIỆT PROPERTY TRÊN BATDONGSAN.COM.VN (Cập nhật 28/10/2026).

${contextInjection.injectedContextText}

--- DỮ LIỆU ĐẦU VÀO CỦA CĂN NHÀ ---
- Tên dự án CHÍNH THỨC: ${projectName}
- Phân khu / Dãy / Căn: ${subdivision || contextInjection.matchedSubdivision || 'Chưa định rõ'}
- Loại hình BĐS: ${propertyType || 'Chưa cung cấp (không khẳng định loại hình)'}
- Diện tích đất: ${area}m2
- Mặt tiền: ${frontage || 'Chưa cung cấp (KHÔNG nhắc mặt tiền)'}
- Hướng nhà: ${orientation || 'Chưa cung cấp (KHÔNG nhắc hướng)'}
- Số tầng / Xây dựng: ${floors || 'Chưa cung cấp (KHÔNG nhắc số tầng)'} ${constructionArea ? `(Tổng sàn: ${constructionArea})` : ''}
- Mức giá: ${price} ${pricePerM2 ? `(Đơn giá: ${pricePerM2})` : ''}
- Pháp lý: ${legal || 'Chưa cung cấp (KHÔNG khẳng định tình trạng sổ của căn này)'}
- Tiện ích & Vị trí: ${amenities || contextInjection.matchedAmenities.slice(0, 3).join(', ')}
- Điểm nhấn & Chính sách: ${keyHighlights || 'Chưa cung cấp (KHÔNG tự thêm chính sách vay, chiết khấu, voucher)'}
${appliedTitle ? `- Tiêu đề mẫu từ bước phân tích: "${appliedTitle}"` : ''}
${counterAngle ? `- Chiến lược phản công đối thủ: "${counterAngle}"` : ''}

${voiceGuidelines}
${learnedVoiceContext}

${factRules}

${marketBlock}

--- CHỈ DẪN QUAN TRỌNG TỪ HỆ THỐNG CONTEXT INJECTION (ROUTER/MATCHER) ---
1. Phân khu trọng tâm: "${contextInjection.matchedSubdivision || subdivision}". BẮT BUỘC viết đúng quy hoạch thực tế của phân khu này.
2. Tiêu chuẩn loại hình: "${contextInjection.matchedProductType}". BẮT BUỘC viết đúng đặc tính kỹ thuật và công năng.
3. Đại tiện ích xác thực của dự án:
${contextInjection.matchedAmenities.map((a, i) => `   * ${a}`).join('\n')}
   -> BẮT BUỘC chọn lọc các tiện ích trên. TUYỆT ĐỐI KHÔNG tự bịa đặt hoặc nhầm lẫn tiện ích dự án khác!
4. Vị trí & hạ tầng giao thông kết nối: ${contextInjection.matchedLocationHighlights.join(' | ') || 'Kết nối giao thông đồng bộ'}.

--- 3 LUẬT CỨNG VỀ TIÊU ĐỀ (BẮT BUỘC TUÂN THỦ 100%) ---
1. Luôn viết đủ tên dự án chính thức: "${projectName}". Tuyệt đối KHÔNG viết "Vin 2", KHÔNG viết mỗi "Ocean City".
2. BẮT BUỘC ĐỘ DÀI TỪ 90 ĐẾN TỐI ĐA 99 KÝ TỰ! (TUYỆT ĐỐI KHÔNG ĐƯỢC VƯỢT QUÁ 99 KÝ TỰ! Nếu tiêu đề từ 100 ký tự trở lên sẽ bị lỗi hệ thống và không dùng được!).
3. Nhồi đủ 6 thành phần vào tiêu đề:
   [loại hình] + [phân khu] + [diện tích] + [hướng hoặc mặt tiền] + [giá] + [tên dự án đầy đủ]
   Mẫu cấu trúc (chỉ minh họa, KHÔNG dùng số liệu trong mẫu): "Giá 11,8 tỷ căn LK Xẻ Khe Kinh Đô 108m2 hướng Tây Nam MT 7m xây 5 tầng - Vinhomes Ocean Park 2" (94 ký tự)
4. TUYỆT ĐỐI KHÔNG emoji, KHÔNG ký tự đặc biệt (| , — , ★). Ngăn ý bằng dấu phẩy hoặc gạch ngang.

--- QUY TẮC MÔ TẢ "VỪA 1 MÀN HÌNH LAPTOP" ---
- SĐT xuất hiện ĐÚNG 2 LẦN: Dòng 3 (có zalo) + Câu chốt (không zalo). Tuyệt đối KHÔNG xuất hiện ở dòng 1-2.
- Tuyệt đối KHÔNG dùng từ tuyệt đối: "tốt nhất, rẻ nhất, duy nhất, số 1". Thay bằng "giá tốt", "giá cạnh tranh", "hiếm có".
- Cụm gạch đầu dòng chia làm 5 cụm, mỗi cụm 2-3 dòng rồi 1 dòng trắng. Dưới 12 chữ mỗi dòng.
- Không thơ/vè, không hashtag trong bài Batdongsan.

Hãy xuất chính xác 3 phiên bản đăng tin:
1. versionInvestment -> ĐẶC BIỆT DÀNH CHO BATDONGSAN.COM.VN:
   - Tiêu đề: BẮT BUỘC ĐỦ 90-99 KÝ TỰ (TỐI ĐA 99 KÝ TỰ), đủ 6 thành tố, KHÔNG emoji, tên dự án chính thức "${projectName}".
   - Nội dung mô tả: Chuẩn 5 phần của ${activeVoice === 'le_yen' ? 'Lê Yến' : 'Vũ Việt'}, vừa đúng 1 màn hình laptop, 5 cụm gạch đầu dòng (<12 chữ/dòng), SĐT xuất hiện đúng 2 lần (lần 1 ở dòng 3 có zalo, lần 2 ở câu chốt không zalo). Tuyệt đối không từ ngữ cấm ("tốt nhất, rẻ nhất, duy nhất, số 1").
2. versionFamily -> ĐẶC BIỆT DÀNH CHO ZALO (Nhật ký Zalo & Tin nhắn gửi khách/Group VIP Zalo):
   - Tiêu đề: Ngắn gọn, có icon sang trọng, nêu ngay điểm cốt lõi (Mã căn, Phân khu, Vị trí đắc địa, Tình trạng sổ đỏ & ảnh thực tế).
   - Nội dung: Cực kỳ dễ đọc trên màn hình điện thoại di động, phân đoạn rõ ràng, liệt kê các ưu điểm nổi bật (ví dụ: sẵn ảnh sổ, ảnh mới chụp hôm qua, gần công viên/Vincom/trường học), câu kêu gọi kết nối Zalo ${finalPhone} để gửi video/sổ đỏ gốc.
3. versionSocial -> ĐẶC BIỆT DÀNH CHO FACEBOOK (Group BĐS & Trang cá nhân):
   - Tiêu đề / Hook: Câu mở đầu kích thích tò mò hoặc đánh trúng bài toán đầu tư/an cư (ví dụ: "SỞ HỮU CĂN LIỀN KỀ SÁT CĂN GÓC ĐỐI DIỆN 10 TÒA CHUNG CƯ...").
   - Nội dung: Văn phong thuyết phục, phân tích tiềm năng kinh doanh thực tế hoặc dòng tiền, có ngắt đoạn thoáng, đầy đủ hashtag liên quan (#${projectName.replace(/\s+/g, '')}, #${(subdivision || 'batdongsan').replace(/\s+/g, '')}, #VuVietProperty, #BatDongSan).
Ngoài ra, cung cấp danh sách ĐÚNG 3 suggestedTitles ĐẠT CHUẨN ĐỘ DÀI TỐI ĐA 99 KÝ TỰ (BẮT BUỘC TỪ 90 ĐẾN 99 KÝ TỰ) cho Batdongsan.com.vn và metaDescription (150-160 ký tự).`;

      // Multi-model fallback list in order of preference
      const candidateModels = [AI_MODEL, process.env.AI_FALLBACK_MODEL].filter((m): m is string => Boolean(m));
      const deadline = Date.now() + 110_000; // keep under Vercel maxDuration (120s, see vercel.json)
      let lastError: any = null;
      let parsedResponse: any = null;

      for (const mName of candidateModels) {
        try {
          const remainingMs = deadline - Date.now();
          if (remainingMs < 5_000) break;
          const response: any = await ai.models.generateContent({
            timeoutMs: Math.min(100_000, remainingMs),
            model: mName,
            contents: prompt,
            config: {
              responseMimeType: 'application/json',
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  suggestedTitles: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  versionInvestment: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING },
                      content: { type: Type.STRING },
                      summaryHighlights: { type: Type.ARRAY, items: { type: Type.STRING } },
                    },
                    required: ['title', 'content', 'summaryHighlights'],
                  },
                  versionFamily: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING },
                      content: { type: Type.STRING },
                      summaryHighlights: { type: Type.ARRAY, items: { type: Type.STRING } },
                    },
                    required: ['title', 'content', 'summaryHighlights'],
                  },
                  versionSocial: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING },
                      content: { type: Type.STRING },
                      summaryHighlights: { type: Type.ARRAY, items: { type: Type.STRING } },
                    },
                    required: ['title', 'content', 'summaryHighlights'],
                  },
                  seoMeta: {
                    type: Type.OBJECT,
                    properties: {
                      metaDescription: { type: Type.STRING },
                      focusKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
                      hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
                    },
                    required: ['metaDescription', 'focusKeywords', 'hashtags'],
                  },
                },
                required: ['suggestedTitles', 'versionInvestment', 'versionFamily', 'versionSocial', 'seoMeta'],
              },
            },
          });

          if (response.text) {
            parsedResponse = JSON.parse(response.text);
            break;
          }
        } catch (err: any) {
          console.warn(`Model ${mName} attempt failed or timed out:`, err?.message);
          lastError = err;
        }
      }

      if (!parsedResponse) {
        console.warn('All AI models failed or timed out:', lastError?.message);
        return res.status(502).json({
          error: `AI chưa phản hồi được (${lastError?.message || 'hết thời gian chờ'}). Hãy bấm Soạn tin lại sau ít giây. App không tự chèn bản mẫu vì bản mẫu sẽ chứa thông tin không đúng với căn của bạn.`,
        });
      }

      const rawTitles: string[] = Array.isArray(parsedResponse.suggestedTitles) ? parsedResponse.suggestedTitles : [];
      let final3Titles = rawTitles
        .filter((t) => typeof t === 'string' && t.trim().length > 0)
        .slice(0, 3)
        .map((t) => formatStrict99Title(t, projectName));
      if (final3Titles.length === 0 && parsedResponse.versionInvestment?.title) {
        final3Titles = [formatStrict99Title(parsedResponse.versionInvestment.title, projectName)];
      }
      parsedResponse.suggestedTitles = final3Titles;
      if (parsedResponse.versionInvestment?.title) {
        parsedResponse.versionInvestment.title = formatStrict99Title(parsedResponse.versionInvestment.title, projectName);
      }

      // Cross-check every figure in the output against what we gave the AI.
      const kbFull = getKnowledgeBase(projectName);
      const allowedText = [
        JSON.stringify(req.body),
        `Diện tích ${area}m2. ${pricePerM2 || ''}`,
        contextInjection.injectedContextText,
        kbFull.markdownContent,
        JSON.stringify(mc || {}),
        finalPhone,
      ].join('\n');
      const warnings = checkListing({
        bdsTitle: parsedResponse.versionInvestment?.title || '',
        bdsContent: parsedResponse.versionInvestment?.content || '',
        otherTexts: [
          parsedResponse.versionFamily?.title || '',
          parsedResponse.versionFamily?.content || '',
          parsedResponse.versionSocial?.title || '',
          parsedResponse.versionSocial?.content || '',
        ],
        allowedText,
        expectedPhone: finalPhone,
        projectName,
      });

      return res.json({ success: true, data: { ...parsedResponse, warnings } });
    } catch (error: any) {
      console.error('AI Generate Listings unexpected error:', error);
      return res.status(500).json({ error: error?.message || 'Lỗi không xác định khi soạn tin.' });
    }
  });

  // 2b. Endpoint: Broker Voice Learning & Personalization Engine
  app.post('/api/gemini/learn-voice', (req, res) => {
    try {
      const {
        broker,
        channel,
        originalTitle,
        originalContent,
        editedTitle,
        editedContent,
        projectName,
        notes,
      } = req.body;

      const record: LearnedVoiceEdit = {
        id: `voice_learn_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        broker: broker || 'le_yen',
        channel: channel || 'batdongsan',
        originalTitle: (originalTitle || '').trim(),
        originalContent: (originalContent || '').trim(),
        editedTitle: (editedTitle || '').trim(),
        editedContent: (editedContent || '').trim(),
        projectName: projectName || 'Vinhomes',
        timestamp: new Date().toISOString(),
        notes,
      };

      learnedVoiceEdits.unshift(record);
      if (learnedVoiceEdits.length > 50) {
        learnedVoiceEdits.pop();
      }

      return res.json({
        success: true,
        message: 'AI đã ghi nhận và lưu phong cách chỉnh sửa! Các tin soạn tiếp theo sẽ tự động tối ưu hóa theo phong cách riêng của bạn.',
        totalLearned: learnedVoiceEdits.length,
        learnedSample: record,
      });
    } catch (err: any) {
      return res.status(500).json({ error: err?.message || 'Lỗi khi lưu giọng văn học tập.' });
    }
  });

  // 2c. Endpoint: Get Learned Voice Samples
  app.get('/api/gemini/learned-voice', (_req, res) => {
    return res.json({
      success: true,
      count: learnedVoiceEdits.length,
      samples: learnedVoiceEdits.slice(0, 10),
    });
  });

  // 3. Drive Link Parser & Image Tools
  app.post('/api/drive/parse', (req, res) => {
    try {
      const { input } = req.body;
      if (!input || typeof input !== 'string') {
        return res.status(400).json({ error: 'Vui lòng cung cấp link hoặc Folder ID Google Drive.' });
      }

      // Check if user entered multiple URLs separated by newline or commas
      const rawUrls = input
        .split(/[\n,]+/)
        .map((s) => s.trim())
        .filter(Boolean);

      const items = rawUrls.map((url, idx) => {
        const id = extractDriveId(url) || `img-${Date.now()}-${idx}`;
        const isFolder = url.includes('/folders/') || (!url.includes('/file/d/') && !url.includes('id=') && url.length < 40);
        return {
          id,
          originalUrl: url,
          isFolder,
          thumbnailUrl: `https://lh3.googleusercontent.com/d/${id}=w800`,
          directViewUrl: `https://drive.google.com/uc?export=view&id=${id}`,
          webUrl: isFolder ? `https://drive.google.com/drive/folders/${id}` : `https://drive.google.com/file/d/${id}/view`,
          title: `Ảnh Google Drive #${idx + 1}`,
        };
      });

      res.json({
        success: true,
        count: items.length,
        items,
      });
    } catch (error: any) {
      res.status(500).json({ error: error?.message || 'Lỗi xử lý link Google Drive.' });
    }
  });

  // 3b. Google Drive: Create Subfolder in Target Project Folder
  app.post('/api/drive/create-folder', async (req, res) => {
    try {
      const { parentFolderId, folderName, accessToken } = req.body;
      if (!folderName || !parentFolderId) {
        return res.status(400).json({ error: 'Thiếu tên thư mục hoặc Parent Folder ID.' });
      }

      if (accessToken) {
        const driveResp = await fetch('https://www.googleapis.com/drive/v3/files?fields=id,name,webViewLink', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken.trim()}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: folderName.trim(),
            mimeType: 'application/vnd.google-apps.folder',
            parents: [parentFolderId.trim()],
          }),
        });

        const driveData = await driveResp.json();
        if (!driveResp.ok) {
          throw new Error(driveData?.error?.message || `Lỗi Google Drive API: ${driveResp.status}`);
        }

        return res.json({
          success: true,
          mode: 'live',
          folderId: driveData.id,
          folderUrl: driveData.webViewLink || `https://drive.google.com/drive/folders/${driveData.id}`,
          name: driveData.name,
        });
      }

      // Simulated / fallback mode if no token provided
      const simFolderId = `sim_fld_${Date.now()}`;
      return res.json({
        success: true,
        mode: 'simulated',
        folderId: simFolderId,
        folderUrl: `https://drive.google.com/drive/folders/${parentFolderId}?subfolder=${encodeURIComponent(folderName)}`,
        name: folderName,
        message: 'Đã tạo thư mục theo chuẩn quy tắc thành công!',
      });
    } catch (err: any) {
      console.error('Create Drive folder error:', err);
      res.status(500).json({ error: err?.message || 'Lỗi khi tạo thư mục Google Drive.' });
    }
  });

  // 3c. Google Drive: Copy files to new folder with SEO filenames
  app.post('/api/drive/copy-files', async (req, res) => {
    try {
      const { targetFolderId, files, accessToken } = req.body;
      if (!targetFolderId || !Array.isArray(files)) {
        return res.status(400).json({ error: 'Thiếu targetFolderId hoặc danh sách files.' });
      }

      const results = [];
      if (accessToken) {
        for (const file of files) {
          if (file.fileId && !file.fileId.startsWith('broll-') && !file.fileId.startsWith('img-')) {
            try {
              const copyResp = await fetch(`https://www.googleapis.com/drive/v3/files/${file.fileId}/copy?fields=id,name,webViewLink`, {
                method: 'POST',
                headers: {
                  Authorization: `Bearer ${accessToken.trim()}`,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  name: file.seoFilename || file.name,
                  parents: [targetFolderId],
                }),
              });
              const copyData = await copyResp.json();
              results.push(copyData);
            } catch (copyErr) {
              console.warn('Copy file error for', file.fileId, copyErr);
            }
          }
        }
      }

      return res.json({
        success: true,
        copiedCount: files.length,
        targetFolderUrl: `https://drive.google.com/drive/folders/${targetFolderId}`,
      });
    } catch (err: any) {
      res.status(500).json({ error: err?.message || 'Lỗi khi sao chép file vào thư mục Drive.' });
    }
  });

  // 3d. Gemini: Suggest Photos Breakdown tailored to listing specs
  app.post('/api/gemini/suggest-photos', async (req, res) => {
    try {
      const { projectData } = req.body;
      const prompt = `Bạn là Giám đốc Sáng tạo và Chuyên gia Hình ảnh BĐS cao cấp tại Vũ Việt Home.
Dựa vào thông tin chi tiết căn nhà sau:
- Tên dự án: ${projectData?.projectName || 'Vinhomes Ocean City'}
- Phân khu: ${projectData?.subdivision || 'Hải Âu 1'}
- Loại hình: ${projectData?.propertyType || 'Liền kề'}
- Diện tích: ${projectData?.area || '56'}m²
- Mức giá: ${projectData?.price || '7 tỷ'}
- Điểm nhấn: ${projectData?.keyHighlights || ''}
- Tiện ích: ${projectData?.amenities || ''}

Hãy đề xuất chi tiết cấu trúc bộ ảnh chuẩn từ 12 đến 18 ảnh gồm đúng 6 danh mục:
1. Ảnh Bìa / Hero Shot (1-2 ảnh)
2. Ảnh Mặt Tiền & Tuyến Đường Trực Diện (2-3 ảnh)
3. Không Gian Nội Thất / Hiện Trạng Bàn Giao (3-5 ảnh)
4. Sơ Đồ Thửa Đất & Pháp Lý Sổ Đỏ (1-2 ảnh)
5. B-roll Tiện Ích Đẳng Cấp Phân Khu (3-4 ảnh)
6. B-roll Nhịp Sống & Tiềm Năng Khai Thác (2-3 ảnh)

Mỗi danh mục nêu rõ:
- category: Tên danh mục kèm số lượng
- categoryKey: 'hero' | 'facade' | 'interior' | 'legal' | 'amenity' | 'lifestyle'
- targetCount: Số lượng đề xuất
- title: Tiêu đề mô tả ảnh
- description: Chi tiết cần chụp
- seoTagSuggestion: Gợi ý thẻ tên file chuẩn SEO
- recommendedAngle: Góc máy khuyên dùng
Trả về JSON.`;

      const response = await ai.models.generateContent({
        model: AI_MODEL,
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              totalRecommended: { type: Type.INTEGER },
              overviewSummary: { type: Type.STRING },
              categories: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    category: { type: Type.STRING },
                    categoryKey: { type: Type.STRING },
                    targetCount: { type: Type.STRING },
                    title: { type: Type.STRING },
                    description: { type: Type.STRING },
                    seoTagSuggestion: { type: Type.STRING },
                    recommendedAngle: { type: Type.STRING },
                  },
                  required: ['id', 'category', 'categoryKey', 'targetCount', 'title', 'description', 'seoTagSuggestion', 'recommendedAngle'],
                },
              },
            },
            required: ['totalRecommended', 'overviewSummary', 'categories'],
          },
        },
      });

      const data = JSON.parse(response.text || '{}');
      res.json({ success: true, data });
    } catch (err: any) {
      console.warn('AI photo suggest error:', err);
      res.status(500).json({ error: err?.message || 'Lỗi gợi ý bộ ảnh từ AI.' });
    }
  });

  // 4. Notion Sync Endpoint
  app.post('/api/notion/sync', async (req, res) => {
    try {
      const { notionToken, databaseId, mode, listing } = req.body;

      if (!listing || !listing.title) {
        return res.status(400).json({ error: 'Dữ liệu tin đăng thiếu tiêu đề.' });
      }

      // If user is in Simulation mode or didn't provide a real token
      if (mode === 'simulate' || !notionToken || !databaseId) {
        // Return a mock success response with the structured Notion payload
        const simulatedPageId = `sim-${Date.now().toString(36)}`;
        return res.json({
          success: true,
          mode: 'simulated',
          message: 'Lưu vào Notion (Chế độ Thử nghiệm/Mô phỏng) thành công!',
          pageUrl: `https://notion.so/bds-listing-${simulatedPageId}`,
          pageId: simulatedPageId,
          timestamp: new Date().toISOString(),
          notionPayloadPreview: {
            parent: { database_id: databaseId || 'demo-database-id' },
            properties: {
              'Tiêu đề': { title: [{ text: { content: listing.title } }] },
              'Giá': { rich_text: [{ text: { content: listing.price || 'Thương lượng' } }] },
              'Diện tích': { rich_text: [{ text: { content: listing.area ? `${listing.area} m²` : '' } }] },
              'Loại hình': { select: { name: listing.propertyType || 'Căn hộ' } },
              'Trạng thái': { select: { name: listing.status || 'Đã duyệt' } },
              'Link Drive': { url: listing.driveFolderUrl || (listing.coverImageUrl || 'https://drive.google.com') },
            },
          },
        });
      }

      // Live Notion API integration
      // Clean database ID (strip dashes or full URL)
      let cleanDbId = databaseId.trim();
      const dbUrlMatch = cleanDbId.match(/([a-f0-9]{32})/);
      if (dbUrlMatch && dbUrlMatch[1]) {
        cleanDbId = dbUrlMatch[1];
      }

      // Chunk content into Notion blocks (each paragraph max 2000 chars)
      const contentParagraphs = (listing.content || '')
        .split('\n\n')
        .map((p: string) => p.trim())
        .filter(Boolean);

      const childrenBlocks = contentParagraphs.slice(0, 50).map((para: string) => ({
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [
            {
              type: 'text',
              text: {
                content: para.slice(0, 2000),
              },
            },
          ],
        },
      }));

      // Add cover image block if present
      if (listing.coverImageUrl) {
        childrenBlocks.unshift({
          object: 'block',
          type: 'paragraph',
          paragraph: {
            rich_text: [
              {
                type: 'text',
                text: {
                  content: `📸 Ảnh bìa: ${listing.coverImageUrl}`,
                  link: { url: listing.coverImageUrl },
                },
              },
            ],
          },
        });
      }

      // Prepare request to Notion v1/pages
      const notionBody: any = {
        parent: { database_id: cleanDbId },
        properties: {
          // Standard title property is commonly "Name" or "Tiêu đề" or "Title"
          Name: {
            title: [
              {
                text: {
                  content: listing.title.slice(0, 2000),
                },
              },
            ],
          },
        },
        children: childrenBlocks,
      };

      // Add cover if valid web url
      if (listing.coverImageUrl && listing.coverImageUrl.startsWith('http')) {
        notionBody.cover = {
          type: 'external',
          external: {
            url: listing.coverImageUrl,
          },
        };
      }

      const notionResponse = await fetch('https://api.notion.com/v1/pages', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${notionToken.trim()}`,
          'Notion-Version': '2022-06-28',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(notionBody),
      });

      const notionData = await notionResponse.json();

      if (!notionResponse.ok) {
        // Notion returned error, provide user friendly feedback
        const errorMsg = notionData?.message || 'Không thể đồng bộ với Notion.';
        return res.status(notionResponse.status).json({
          error: `Lỗi Notion API (${notionResponse.status}): ${errorMsg}. Lưu ý: Đảm bảo đã Share database Notion cho Integration bot của bạn.`,
          notionDetails: notionData,
        });
      }

      res.json({
        success: true,
        mode: 'live',
        message: 'Đã tạo trang mới trong Notion Database thành công!',
        pageUrl: notionData.url,
        pageId: notionData.id,
        createdTime: notionData.created_time,
      });
    } catch (error: any) {
      console.error('Notion Sync error:', error);
      res.status(500).json({
        error: error?.message || 'Có lỗi xảy ra khi kết nối tới Notion.',
      });
    }
  });

  // 5. Test Notion Connection Endpoint
  app.post('/api/notion/test-connection', async (req, res) => {
    try {
      const { notionToken, databaseId } = req.body;
      if (!notionToken || !databaseId) {
        return res.status(400).json({ error: 'Thiếu Notion Token hoặc Database ID.' });
      }

      let cleanDbId = databaseId.trim();
      const dbUrlMatch = cleanDbId.match(/([a-f0-9]{32})/);
      if (dbUrlMatch && dbUrlMatch[1]) {
        cleanDbId = dbUrlMatch[1];
      }

      const resp = await fetch(`https://api.notion.com/v1/databases/${cleanDbId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${notionToken.trim()}`,
          'Notion-Version': '2022-06-28',
        },
      });

      const data = await resp.json();
      if (!resp.ok) {
        return res.status(resp.status).json({
          success: false,
          error: data?.message || 'Không thể truy cập Database Notion.',
        });
      }

      res.json({
        success: true,
        databaseTitle: data.title?.[0]?.plain_text || 'Database Notion',
        properties: Object.keys(data.properties || {}),
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error?.message || 'Lỗi kiểm tra Notion.' });
    }
  });

  // 6. Webhook Dispatcher Endpoint
  app.post('/api/webhook/send', async (req, res) => {
    const startTime = Date.now();
    try {
      const { webhookUrl, headers, payload } = req.body;

      if (!webhookUrl || !webhookUrl.trim()) {
        return res.status(400).json({ error: 'URL Webhook không được để trống.' });
      }

      const parsedHeaders: Record<string, string> = {
        'Content-Type': 'application/json',
        'User-Agent': 'BDS-ProFlow-Webhook-Client/1.0',
        ...(headers || {}),
      };

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 12000); // 12s timeout

      const response = await fetch(webhookUrl.trim(), {
        method: 'POST',
        headers: parsedHeaders,
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeout);
      const latencyMs = Date.now() - startTime;

      let responseText = '';
      let responseJson: any = null;
      try {
        responseText = await response.text();
        responseJson = JSON.parse(responseText);
      } catch {
        // keep text
      }

      res.json({
        success: response.ok,
        statusCode: response.status,
        statusText: response.statusText,
        latencyMs,
        responseData: responseJson || responseText || '(Phản hồi rỗng)',
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      const latencyMs = Date.now() - startTime;
      console.error('Webhook dispatch error:', error);
      res.status(500).json({
        success: false,
        error: error?.message || 'Lỗi khi gửi dữ liệu sang Webhook.',
        latencyMs,
      });
    }
  });

  // 7. Internal In-App Test Webhook Receiver & Logs
  app.post('/api/webhook/test-receiver', (req, res) => {
    const logItem: WebhookLog = {
      id: `hook-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      timestamp: new Date().toISOString(),
      sourceIp: req.ip || req.socket.remoteAddress || 'unknown',
      headers: req.headers,
      body: req.body,
    };
    webhookLogs.unshift(logItem);
    if (webhookLogs.length > 30) webhookLogs.pop(); // keep last 30

    res.json({
      status: 'received',
      message: 'BĐS ProFlow Internal Test Receiver đã nhận payload thành công!',
      logId: logItem.id,
      timestamp: logItem.timestamp,
      receivedFieldsCount: Object.keys(req.body || {}).length,
    });
  });

  app.get('/api/webhook/test-logs', (req, res) => {
    res.json({
      logs: webhookLogs,
      count: webhookLogs.length,
    });
  });

  app.delete('/api/webhook/test-logs', (req, res) => {
    webhookLogs.length = 0;
    res.json({ success: true, message: 'Đã xóa toàn bộ lịch sử test webhook.' });
  });

  return app;
}

// Local entry (npm run dev / npm start). On Vercel the app is served by api/index.ts instead.
async function startServer() {
  const app = createApp();
  const PORT = Number(process.env.PORT) || 3000;

  // Serve static files in production or Vite in dev
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[BĐS ProFlow Server] Running at http://0.0.0.0:${PORT}`);
  });
}

if (!process.env.VERCEL) {
  startServer().catch((err) => {
    console.error('Failed to start server:', err);
  });
}
