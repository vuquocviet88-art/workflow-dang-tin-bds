export interface CompetitorAnalysis {
  summary: string;
  keywords: Array<{
    term: string;
    type: 'primary' | 'secondary' | 'geo' | 'intent';
    reason: string;
  }>;
  titleStructure: {
    currentStructure: string;
    strengths: string[];
    weaknesses: string[];
    highConvertingFormulas: string[];
  };
  salesAngles: {
    primaryAngle: string;
    uspPoints: string[];
    financialHooks: string[];
    urgencyTactics: string[];
    lifestyleHooks: string[];
  };
  proposedOutline: Array<{
    sectionTitle: string;
    purpose: string;
    suggestedContent: string;
  }>;
  keyExtractedData?: {
    projectName?: string;
    subdivision?: string;
    propertyType?: string;
    area?: string;
    price?: string;
    address?: string;
    legal?: string;
  };
}

export interface MarketResearchData {
  projectName: string;
  batdongsanUrl: string;
  scannedAt: string;
  totalListingsCount: number;
  pageScope: '1_page' | '2_pages' | '3_pages';
  pagesBreakdown?: Array<{
    pageNumber: number;
    pageLabel: string;
    totalListings: number;
    vipDiamond: number;
    vipGold: number;
    vipSilver: number;
    normal: number;
    vipPercentage: number;
    keyCharacteristics: string;
  }>;
  vipStats: {
    vipDiamond: number;
    vipGold: number;
    vipSilver: number;
    normal: number;
    vipPercentage: number;
    competitionAnalysis: string;
  };
  agentsSummary: {
    totalActiveBrokers: number;
    dominantAgencies: string[];
  };
  top5Brokers: Array<{
    rank: number;
    name: string;
    phone: string;
    agency: string;
    totalListings: number;
    marketSharePercent: number;
    profileUrl: string;
    keyStrategy: string;
    strengths: string;
  }>;
  contentCategories: Array<{
    categoryName: string;
    count: number;
    percentage: number;
    angles: string[];
    keywords?: string[];
    topKeywords?: string[];
  }>;
  productsAndPricing: Array<{
    productType: string;
    count: number;
    priceRange: string;
    avgPriceM2: string;
    marketEvaluation: string;
  }>;
  historicalComparison: {
    previousBenchmarkPeriod: string;
    priceTrend: string;
    listingVolumeTrend: string;
    vipCompetitionShift: string;
    marketNotes: string;
  };
  recommendations: Array<{
    id: number;
    productName: string;
    productType: string;
    subdivision: string;
    priceEstimate: string;
    area: string;
    whyRecommended: string;
    sampleTitleBDS: string; // Batdongsan.com.vn style title
    outlineBullets: string[];
    specs: {
      projectName: string;
      area: string;
      price: string;
      pricePerM2: string;
      subdivision: string;
      propertyType: string;
      highlights: string;
      legal: string;
      amenities: string;
    };
  }>;
  // Present when the numbers come from real listings extracted from batdongsan result pages.
  dataSource?: {
    kind: 'real';
    scrapedAt: string;
    pages: number[];
    rowCount: number;
    aiNarrative: boolean; // true when the wording (not the numbers) was written by the AI
  };
}

export interface ListingVersion {
  title: string;
  content: string;
  summaryHighlights: string[];
  charCount?: number;
  titleCharCount?: number;
  personaVoice?: 'le_yen' | 'vu_viet';
}

export interface GeneratedListings {
  isOfflineFallback?: boolean; // true when the AI was NOT used (rule-based template text)
  warnings?: string[]; // facts in the text that are not in the input data / knowledge base
  suggestedTitles: string[];
  versionInvestment: ListingVersion;
  versionFamily: ListingVersion;
  versionSocial: ListingVersion;
  seoMeta: {
    metaDescription: string;
    focusKeywords: string[];
    hashtags: string[];
  };
}

export interface ProjectFormData {
  projectName: string;
  subdivision: string;
  unitCode?: string;
  propertyType: string;
  area: string;
  bedrooms: string;
  bathrooms: string;
  price: string;
  pricePerM2: string;
  address: string;
  legal: string;
  amenities: string;
  keyHighlights: string;
  contactName: string;
  phone: string;
  targetKeywords: string[];
  appliedTitle?: string;
  counterAngle?: string;
  targetCustomerSegment?: string;
  sourceStrategy?: 'counter_playbook' | 'top_recommendation' | 'manual';
  personaVoice?: 'le_yen' | 'vu_viet';
  orientation?: string;
  frontage?: string;
  floors?: string;
  constructionArea?: string;
}

export interface RawListingParsedResult {
  projectName: string;
  subdivision: string;
  unitCode?: string;
  propertyType: string;
  area: string;
  price: string;
  pricePerM2?: string;
  frontage?: string;
  orientation?: string;
  floors?: string;
  constructionArea?: string;
  bedrooms?: string;
  bathrooms?: string;
  legal?: string;
  amenities?: string;
  keyHighlights?: string;
  address?: string;
  personaVoice?: 'le_yen' | 'vu_viet';
  contactName?: string;
  phone?: string;
  confidenceScore: number;
  summaryOneLiner: string;
  missingRequiredFields: string[];
  missingOptionalQuestions: Array<{
    fieldKey: string;
    fieldLabel: string;
    questionText: string;
    defaultSuggestion?: string;
  }>;
}

export interface DriveImage {
  id: string;
  title: string;
  originalUrl: string;
  thumbnailUrl: string;
  directViewUrl: string;
  webUrl: string;
  isCover: boolean;
  isSelected: boolean;
  category?: string;
  seoFilename?: string;
  categoryType?: 'hero' | 'facade' | 'interior' | 'legal' | 'amenity' | 'lifestyle';
  sourceOrigin?: 'broll_library' | 'uploaded' | 'custom_folder';
}

export interface PhotoProposalItem {
  id: string;
  category: string;
  categoryKey: 'hero' | 'facade' | 'interior' | 'legal' | 'amenity' | 'lifestyle';
  targetCount: string;
  title: string;
  description: string;
  seoTagSuggestion: string;
  recommendedAngle: string;
}

export interface PhotoPlanProposal {
  totalRecommended: number;
  overviewSummary: string;
  categories: PhotoProposalItem[];
}


export interface NotionSettings {
  token: string;
  databaseId: string;
  isSimulated: boolean;
}

export interface NotionSyncHistoryItem {
  id: string;
  title: string;
  price: string;
  propertyType: string;
  timestamp: string;
  pageUrl: string;
  mode: 'live' | 'simulated';
}

export interface WebhookConfig {
  url: string;
  customHeaders: string;
}

export interface WebhookResponseLog {
  id: string;
  timestamp: string;
  url: string;
  status: number;
  statusText: string;
  latencyMs: number;
  success: boolean;
  responseData: any;
}

export interface CompetitorDeepPlaybook {
  competitorName: string;
  competitorUrl: string;
  analyzedAt: string;
  threatLevel: 'Cao' | 'Trung Bình' | 'Cực Kỳ Nguy Hiểm';
  executiveSummary: {
    corePositioning: string;
    dominantSegments: string[];
    primaryTrafficDrivers: string[];
    summarySynthesis: string;
  };
  pillar1TrafficAndSeo: {
    activeListingsEstimate: string;
    postingVelocity: string;
    categoryDistribution: string;
    titleStructurePatterns: string[];
    primaryKeywords: string[];
    secondaryKeywords: string[];
    algorithmicVisibilityTactics: string[];
  };
  pillar2PsychologicalCopywriting: {
    emotionalDistressHooks: string[];
    pricingPsychology: string;
    unitSizePositioning: string;
    valuePropositionTactic: string;
    analyzedHeadlines: string[];
  };
  pillar3PersonalBranding: {
    professionalPositioning: string;
    credibilitySignals: string[];
    crossPlatformFunnel: string;
  };
  pillar4VulnerabilityGaps: {
    blindSpots: string[];
    missingFinancialAdvisory: string[];
    unaddressedBuyerConcerns: string[];
    vulnerabilitiesToExploit: string[];
  };
  offensiveCounterStrategy: {
    differentiationMatrix: Array<{
      competitorTactic: string;
      counterStrategy: string;
      expectedImpact: string;
    }>;
    omnichannelInterception: string[];
    counterListingTemplates: Array<{
      title: string;
      targetCustomer: string;
      psychologicalHook: string;
      counterAngle: string;
    }>;
  };
  actionableRoadmap: {
    phase1ContentRefinement: string[];
    phase2SeoDomination: string[];
    phase3AiAutomation: string[];
  };
  markdownReport: string;
}

export interface ProjectKnowledgeBaseItem {
  id: string; // e.g. 'ocean-park-2'
  name: string; // 'Vinhomes Ocean Park 2 - The Empire'
  filename: string; // 'vinhomes-ocean-park-2-the-empire.md'
  updatedAt: string; // '29/10/2026'
  version: string; // '2.4.0'
  markdownContent: string;
  sizeKb: number;
  tags: string[];
  subdivisions: string[];
  productTypes: string[];
  keyAmenities: string[];
}

export interface ContextInjectionMatchResult {
  projectId: string;
  projectName: string;
  filename: string;
  updatedAt: string;
  matchedSubdivision?: string;
  matchedProductType?: string;
  matchedAmenities: string[];
  matchedLocationHighlights: string[];
  confidenceScore: number;
  injectedContextText: string;
  routerSummary: string;
}
