import type { Dict } from './en';

// 繁體中文文案。結構必須與 en.ts 相同。
export const zhHant: Dict = {
  htmlLang: 'zh-Hant',
  langName: '繁體中文',
  skipToContent: '跳到主要內容',
  nav: {
    label: '主選單',
    home: '首頁',
    services: '服務',
    work: '作品',
    contact: '聯絡',
  },
  langSwitch: { label: '語言' },
  footer: {
    tagline: '軟體開發、技術顧問與 AI 工作流程導入。',
    githubLabel: 'GitHub',
    emailLabel: '電子郵件',
  },
  home: {
    title: '值得信賴的軟體開發與工程顧問',
    description:
      'Sympoies 是專業的軟體開發團隊，提供委託開發、技術顧問，以及協助工程團隊導入 AI 工作流程。',
    heroTitle: '值得信賴的軟體工程夥伴。',
    heroLead:
      '我們是專業的軟體開發團隊：打造軟體、為工程團隊提供顧問服務，並協助團隊把 AI 融入既有的工作方式。',
    ctaPrimary: '與我們聯絡',
    ctaSecondary: '查看作品',
    pillarsTitle: '我們的服務',
    pillars: [
      {
        title: '軟體開發',
        body: '承接網路服務、工具與內部平台的委託開發，從初步設計到正式發布，並以自動化測試與程式碼審查作為標準做法。',
      },
      {
        title: '技術顧問',
        body: '提供架構與程式碼審查、交付流程評估，並實際協助團隊做出並落實穩健的技術決策。',
      },
      {
        title: 'AI 工作流程導入',
        body: '協助團隊把 AI 助理導入需求、開發、審查與發布各環節，並建立明確的護欄，讓品質與責任始終由您的團隊掌握。',
      },
    ],
    learnMore: '了解更多服務內容',
    processTitle: '合作方式',
    processLead: '無論專案大小，我們都遵循同樣嚴謹的流程。',
    steps: [
      { title: '需求', body: '在動手寫程式之前，先共同確認什麼才算成功。' },
      { title: '設計', body: '確定整體做法與主要取捨，並以文件記錄下來。' },
      { title: '測試先行的交付', body: '先以測試定義行為，再以小而易於審查的步驟實作。' },
      { title: '審查', body: '每項變更在合併之前都經過審查。' },
      { title: '發布', body: '發布流程可重複且有文件記錄，讓上線成為例行工作。' },
    ],
    ctaTitle: '有專案或問題想討論嗎？',
    ctaBody: '告訴我們您正在進行的工作，我們會誠實地回覆可以如何協助。',
  },
  services: {
    title: '服務',
    description: '軟體開發、技術顧問與 AI 工作流程導入，透過清楚的合作流程交付：探索、提案、交付與交接。',
    heading: '服務',
    lead: '我們與工程團隊合作的三種方式，以及一次合作的進行方式。',
    areasTitle: '服務範圍',
    areas: [
      {
        title: '軟體開發',
        body: '在約定的範圍內，我們負責把軟體建置完成。',
        items: [
          '網路服務、API 與內部工具',
          '命令列工具與自動化',
          '擴充或現代化既有程式碼',
          '自動化測試與發布流程',
        ],
      },
      {
        title: '技術顧問',
        body: '為您的團隊提供獨立且務實的觀點。',
        items: [
          '架構與程式碼審查',
          '交付流程與品質評估',
          '技術選型與取捨分析',
          '與您的工程師實際協作',
        ],
      },
      {
        title: 'AI 工作流程導入',
        body: '協助您在工程工作中使用 AI 工具，同時不失去對品質的掌控。',
        items: [
          'AI 輔助適合放在流程的哪些環節，哪些則不適合',
          'AI 輔助變更的審查、測試與核准做法',
          '團隊共用的規範、指引與工具',
          '教學與交接，讓團隊自己掌握這套工作流程',
        ],
      },
    ],
    engagementTitle: '合作的進行方式',
    engagementLead: '每次合作都依循四個階段，讓您隨時清楚下一步會發生什麼。',
    stages: [
      {
        title: '探索',
        body: '了解您的目標、限制與既有系統，並提出有助於界定範圍的問題。',
      },
      {
        title: '提案',
        body: '提供書面提案，說明範圍、做法、交付項目與時程，供您審閱。',
      },
      {
        title: '交付',
        body: '以小而易於審查的增量進行，定期回報，讓您即時看到進度。',
      },
      {
        title: '交接',
        body: '交付程式碼、文件與知識，讓您的團隊不需要我們也能營運並持續擴充成果。',
      },
    ],
    ctaTitle: '想討論合作嗎？',
    ctaBody: '請簡述您的需求，我們會接續處理。',
  },
  work: {
    title: '作品與開源專案',
    description:
      'Sympoies 的公開專案包括工作流程看板、命令列工具、代理程式安全防護、協作檢視器、Alfred 工作流程與可自行架設的聊天工作區。',
    heading: '作品與開源專案',
    lead: '我們公開地開發。以下是我們維護的公開專案，程式碼與文件都可以直接閱讀。',
    repoLink: 'GitHub 原始碼',
    demoLink: '線上展示',
    releasesLink: '版本發布',
    earlyLabel: '早期開發中',
    projects: {
      symphonyBoard: {
        description:
          '適用於 GitHub 與 GitLab 的唯讀工作流程看板，將議題、拉取與合併請求、活動與關聯整合在同一個檢視中。',
        alt: 'Symphony Board 的活動頁面，顯示示範事件清單、所選事件的詳情，以及依使用者和儲存庫分類的活動摘要。',
      },
      agentCollab: {
        description:
          '讓人與其 AI 代理程式透過 Git 儲存庫協作的方法，並附有唯讀檢視器，以聊天室的形式呈現對話。',
        alt: 'agent-collab 檢視器畫面（虛構資料）：左側為主題清單，右側以聊天室形式呈現兩個虛構代理程式之間的對話。',
      },
      nilsCli: {
        description:
          '以 Rust 開發的一組專注型命令列工具，涵蓋 API 測試、Git 操作、平台自動化與工作流程證據，並提供一致且可由機器讀取的輸出。',
        alt: '終端機動畫：執行 git-scope 列出變更的檔案，並顯示最近一次提交。',
      },
      agentRuntimeKit: {
        description:
          '用來設定 Codex CLI、Claude Code 與 Hermes Agent 等程式開發代理程式的技能、掛鉤與政策，其共用的原始碼儲存庫。',
        alt: '虛構的終端機操作：安全規則阻止直接推送到預設分支，並引導代理程式改開拉取請求。',
      },
      nilsAlfredWorkflow: {
        description: '為 macOS 打造的一組 Alfred 工作流程，提供 Google、YouTube 搜尋、字典查詢等功能。',
        alt: '重製的 Alfred 結果清單，以搜尋「東京」為示範。',
      },
      salon: {
        description:
          '可自行架設、以容器為先的聊天工作區，讓您在瀏覽器中與程式開發代理程式合作，並能在之後重新連回同一個工作階段。',
        alt: 'Salon 畫面（合成資料）：多個代理程式工作階段並排，其中一個顯示計畫、程式碼差異、測試結果與圖表。',
      },
    },
  },
  contact: {
    title: '聯絡',
    description: '就軟體開發、技術顧問或 AI 工作流程導入與 Sympoies 聯絡。',
    heading: '聯絡我們',
    lead: '請簡述您正在進行的工作，我們會透過電子郵件回覆。',
    form: {
      name: '姓名',
      email: '電子郵件',
      company: '公司',
      optional: '選填',
      message: '訊息',
      messageHint: '您正在進行什麼工作？我們可以如何協助？',
      submit: '送出訊息',
      sending: '傳送中…',
      success: '謝謝您。訊息已送出，我們會透過電子郵件回覆。',
      error: '抱歉，訊息無法送出。請直接寄電子郵件給我們。',
    },
    emailTitle: '偏好電子郵件？',
    emailBody: '您也可以直接寫信給我們：',
  },
};
