import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { ModuleResearch } from './components/ModuleResearch';
import { ModuleContentCreator } from './components/ModuleContentCreator';
import { ModulePublish } from './components/ModulePublish';
import { 
  ProjectFormData, 
  GeneratedListings, 
  DriveImage, 
  NotionSettings, 
  NotionSyncHistoryItem,
  MarketResearchData
} from './types';
import { FOUR_VINHOMES_PROJECTS, ProjectPreset, SAMPLE_DRIVE_IMAGES, projectBaseForm } from './data/samplePresets';
import type { MarketContext } from './lib/market';
import { consumeHashImport } from './lib/importHash';
import { 
  CheckCircle, 
  ExternalLink,
  PhoneCall,
  Mail
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('research');

  // Currently selected project from the 4 Vinhomes projects
  const [selectedProject, setSelectedProject] = useState<ProjectPreset>(
    () => FOUR_VINHOMES_PROJECTS.find((p) => p.id === consumeHashImport().projectId) || FOUR_VINHOMES_PROJECTS[0]
  );

  // Module 2 State: Project Form & Generated Listings
  const [projectData, setProjectData] = useState<ProjectFormData>(() =>
    projectBaseForm(FOUR_VINHOMES_PROJECTS.find((p) => p.id === consumeHashImport().projectId) || FOUR_VINHOMES_PROJECTS[0])
  );

  // Real market data (scraped listings) summarised for the listing generator; null until the sale loads some.
  const [marketContext, setMarketContext] = useState<MarketContext | null>(null);
  const [listings, setListings] = useState<GeneratedListings | null>(null);
  const [selectedVersionType, setSelectedVersionType] = useState<'investment' | 'family' | 'social'>('investment');

  // Module 3 State: Drive Library
  const [images, setImages] = useState<DriveImage[]>(SAMPLE_DRIVE_IMAGES);
  const [driveFolderUrl, setDriveFolderUrl] = useState<string>('');

  // Module 4 State: Notion
  const [notionSettings, setNotionSettings] = useState<NotionSettings>({
    token: '',
    databaseId: '',
    isSimulated: true,
  });
  const [syncHistory, setSyncHistory] = useState<NotionSyncHistoryItem[]>([]);

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  React.useEffect(() => {
    const imp = consumeHashImport();
    if (imp.added > 0) showToast(`Đã nạp ${imp.added} tin thật từ trình duyệt vào dữ liệu thị trường.`);
  }, []);

  const handleSelectProject = (project: ProjectPreset) => {
    if (project.id !== selectedProject.id) {
      // Only project-level fields are filled; every unit field (area, price, ...) starts empty.
      setProjectData(projectBaseForm(project));
      setMarketContext(null);
    }
    setSelectedProject(project);
    showToast(`Đã chọn dự án: "${project.name}". Thông số căn để trống, hãy nhập thông tin căn thật.`);
  };

  // Helper when user selects from Part 2 (Counter Playbook) or Part 3 (3 Recommended Products)
  const handleApplyProductToEditor = (
    specs: MarketResearchData['recommendations'][0]['specs'] & {
      appliedTitle?: string;
      counterAngle?: string;
      sourceStrategy?: 'counter_playbook' | 'top_recommendation' | 'manual';
    }
  ) => {
    setProjectData((prev) => ({
      ...prev,
      projectName: specs.projectName || prev.projectName,
      subdivision: specs.subdivision || prev.subdivision,
      propertyType: specs.propertyType || prev.propertyType,
      area: specs.area || prev.area,
      price: specs.price || prev.price,
      pricePerM2: specs.pricePerM2 || prev.pricePerM2,
      keyHighlights: specs.highlights || prev.keyHighlights,
      legal: specs.legal || prev.legal,
      amenities: specs.amenities || prev.amenities,
      appliedTitle: specs.appliedTitle || prev.appliedTitle,
      counterAngle: specs.counterAngle || prev.counterAngle,
      sourceStrategy: specs.sourceStrategy || 'top_recommendation',
    }));

    if (specs.sourceStrategy === 'counter_playbook') {
      showToast(`🎯 Đã nạp Mẫu Phản Công Đối Thủ vào Bước 2 Soạn Tin!`);
    } else {
      showToast(`Đã áp dụng sản phẩm "${specs.subdivision}" vào Bước 2 Soạn tin!`);
    }
  };

  const selectedImagesCount = images.filter((img) => img.isSelected).length;

  return (
    <div className="min-h-screen bg-[#FBFAF5] text-[#333333] flex flex-col font-sans antialiased selection:bg-[#C95928] selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#1B3A2D] text-[#FBFAF5] px-4 py-3 rounded-xl shadow-2xl font-semibold text-sm flex items-center gap-2.5 border border-[#2C5E4A] animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle className="w-4 h-4 text-[#C95928]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedProject={selectedProject}
        onSelectProject={handleSelectProject}
        hasAnalysis={true}
        hasListings={Boolean(listings)}
        selectedImagesCount={selectedImagesCount}
        hasNotionConfigured={Boolean(notionSettings.token || notionSettings.isSimulated)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'research' && (
          <ModuleResearch
            selectedProject={selectedProject}
            onSelectProject={handleSelectProject}
            onApplyProductToEditor={handleApplyProductToEditor}
            onMarketContextChange={setMarketContext}
            onNextStep={() => setActiveTab('content')}
          />
        )}

        {activeTab === 'content' && (
          <ModuleContentCreator
            projectData={projectData}
            setProjectData={setProjectData}
            listings={listings}
            setListings={setListings}
            selectedVersionType={selectedVersionType}
            setSelectedVersionType={setSelectedVersionType}
            marketContext={marketContext}
            onNextStep={() => setActiveTab('publish')}
          />
        )}

        {activeTab === 'publish' && (
          <ModulePublish
            notionSettings={notionSettings}
            setNotionSettings={setNotionSettings}
            syncHistory={syncHistory}
            setSyncHistory={setSyncHistory}
            projectData={projectData}
            listings={listings}
            selectedVersionType={selectedVersionType}
            images={images}
            driveFolderUrl={driveFolderUrl}
            onNavigateToContent={() => setActiveTab('content')}
          />
        )}
      </main>

      {/* Footer adhering to Brand Guide */}
      <footer className="border-t border-[#1B3A2D] bg-[#152E24] text-[#FBFAF5] py-8 text-xs mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="h-9 flex items-center justify-center rounded-lg overflow-hidden bg-[#1B3A2D] px-2 py-0.5 border border-[#2C5E4A]">
                <img
                  src="/assets/aistudio/Logo_Tr_ng_n_n_Deep_Forest_bd0259ac.png"
                  alt="Logo"
                  className="h-7 w-auto object-contain"
                />
              </div>
              <div>
                <h3 className="font-serif-brand font-bold text-base text-white">Vũ Việt Home</h3>
                <p className="text-[11px] text-[#F5F2E9]/70">
                  Hệ thống phân tích thị trường & tự động hóa đăng tin BĐS cao cấp.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-5 text-[#F5F2E9]">
              <a
                href="https://VuVietHome.com.vn"
                target="_blank"
                rel="noreferrer"
                className="hover:text-white transition-colors flex items-center gap-1 font-medium"
              >
                <span>VuVietHome.com.vn</span>
                <ExternalLink className="w-3 h-3 text-[#C95928]" />
              </a>
              <span className="text-[#2C5E4A]">•</span>
              <span className="flex items-center gap-1">
                <PhoneCall className="w-3.5 h-3.5 text-[#C95928]" />
                0908 688 888
              </span>
              <span className="text-[#2C5E4A]">•</span>
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-[#C95928]" />
                VuQuocViet88@gmail.com
              </span>
            </div>
          </div>

          <div className="border-t border-[#1B3A2D] mt-5 pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-[#F5F2E9]/60">
            <div>
              © 2026 Vũ Việt Home. Số liệu thị trường là dữ liệu thật do bạn quét từ Batdongsan.com.vn.
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#C95928]" />
              <span>Số liệu do máy tính thống kê, AI chỉ viết lời</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
