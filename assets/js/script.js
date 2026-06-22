'use strict';

const STORAGE_KEYS = {
  language: 'bmj-language',
  theme: 'bmj-theme',
};

const translations = {
  ko: {
    'nav.about': '소개',
    'nav.skills': '관심 분야',
    'nav.publications': 'Publication',
    'nav.pubs': 'Pubs',
    'nav.resume': '학력',
    'nav.experience': '경험',
    'nav.experienceShort': '경험',
    'theme.system': '시스템',
    'theme.light': '라이트',
    'theme.dark': '다크',
    'profile.role': 'Graduate Student Candidate',
    'profile.name': '배민준',
    'profile.summary': '전자전기공학과 소프트웨어학을 함께 공부하며, 하드웨어 가까이에서 동작하는 소프트웨어를 탐구합니다.',
    'hero.kicker': 'Developer growing through challenges',
    'hero.title': '연구와 구현 사이를 잇는 소프트웨어 개발자.',
    'hero.copy': '디지털 시스템, 컴퓨터 구조, 네트워크, 컴퓨터 비전을 기반으로 실제 장치와 연결되는 연구형 소프트웨어 경험을 쌓고 있습니다.',
    'hero.ctaPublications': 'Publication 보기',
    'hero.ctaResume': '학력 살펴보기',
    'stats.gpa': '전체 학점',
    'stats.auto': '자율주행 수상',
    'stats.security': '보안 교육 수료',
    'about.eyebrow': 'About',
    'about.title': '하드웨어와 소프트웨어가 만나는 지점에서 연구 주제를 찾습니다.',
    'about.p1': '저는 성균관대학교에서 전자전기공학과 소프트웨어학을 복수전공하고 있습니다. 전공의 접점에서 디지털 회로, 시스템 구조, 네트워크 통신, 컴퓨터 비전처럼 실제 장치와 가까운 소프트웨어에 관심을 두고 있습니다.',
    'about.p2': '대학원 진학을 염두에 두고 연구 주제와 구현 역량을 함께 다듬고 있습니다. 실패를 빠르게 배우고, 다시 구현하고, 결과를 글과 발표로 정리하는 과정을 중요하게 생각합니다.',
    'skills.eyebrow': 'Research Interest',
    'skills.title': '관심 연구 분야와 기술 스택',
    'skills.copy': '임베디드 감각이 필요한 소프트웨어, 자율주행, 비전, 시스템 구현 경험을 중심으로 정리했습니다.',
    'focus.digital': 'VHDL/Verilog 기반 디지털 시스템 설계를 학습합니다.',
    'focus.arch': 'Intel x86 및 RISC-V ISA 기반 컴퓨터 구조를 공부합니다.',
    'focus.network': 'Socket I/O와 TCP/IP 통신에 관심을 갖고 있습니다.',
    'focus.vision': '자율주행과 연결되는 이미지 처리 및 비전 시스템을 탐구합니다.',
    'publications.eyebrow': 'Publications',
    'publications.title': '연구 발표와 관련 작업',
    'publications.overview': 'Publication Overview',
    'overview.autonomous': 'Autonomous Driving',
    'overview.systems': 'Embedded / Digital Systems',
    'overview.security': 'Security & Automation',
    'filter.all': '전체',
    'filter.domestic': 'Domestic',
    'filter.international': 'International',
    'pub.parking.title': 'Bezier Curve 기반 경로 계획과 머신러닝 기법을 활용한 피드백 주차 시스템',
    'pub.parking.desc': '2024 한국자동차공학회 추계학술대회 미래형 자동차 특별세션 제출 및 발표.',
    'pub.parking.venue': '2024 한국자동차공학회 추계학술대회, 미래형 자동차 특별세션',
    'pub.uart.title': 'UART 통신 기반 분할 바이트 명령 프로토콜을 이용한 주행 안정화 및 지연 최적화',
    'pub.uart.desc': '2024 한국자동차공학회 추계학술대회 발표. 장려상 및 도전상 수상.',
    'pub.uart.venue': '2024 한국자동차공학회 추계학술대회, 미래형 자동차 특별세션',
    'pub.type.conference': 'Conference',
    'pub.status.presented': 'Presented',
    'pub.award.ksae': '장려상 / 도전상',
    'pub.international.emptyTitle': 'International publications are being prepared.',
    'pub.international.emptyBody': 'Accepted or submitted international publications will be listed here.',
    'project.auto.title': '성균관대학교 자율주행 SW 경진대회 연구/구현 기록',
    'project.bug.title': '웹 자동화 도구 분석을 통한 버그바운티 최적화',
    'project.tetris.title': '논리 회로로 테트리스 구현하기',
    'project.open': '자세히 보기',
    'related.auto.desc': '자율주행 경진대회에서 수행한 경로 계획, 제어, 임베디드 통신 구현 기록입니다.',
    'related.security.desc': '버그바운티 워크플로우 최적화를 위한 웹 자동화 도구 분석 프로젝트입니다.',
    'related.tetris.desc': 'Logisim-evolution을 활용해 구현한 디지털 논리 회로 프로젝트입니다.',
    'resume.eyebrow': 'Education',
    'resume.title': '교육',
    'resume.education': 'Education',
    'resume.experience': 'Experience & Achievement',
    'experience.eyebrow': 'Experience',
    'experience.title': '수상 및 연구 경험',
    'edu.software': '소프트웨어학 복수전공',
    'edu.software.desc': '2023년 2학기부터 소프트웨어학과 복수전공 시작',
    'edu.skku': '성균관대학교 전자전기공학부',
    'edu.skku.desc': '전자전기공학과 소프트웨어학의 접점에서 학습 중',
    'exp.auto3': '제3회 성균관대학교 자율주행 경진대회 대상',
    'exp.auto3.desc': '2025.07.18 / 성균관대학교 총장상',
    'exp.coop': '동계 학기 CO-OP',
    'exp.coop.desc': '크로이스(주) AR-Guide 컴퓨터 비전 프로젝트 수행',
    'exp.ksae': '2024 KSAE 추계학술대회 미래형 자동차 특별세션',
    'exp.ksae.desc': '논문 2편 제출 및 발표, 장려상/도전상 수상',
    'exp.dna': '2024 DNA Hero 프로젝트',
    'exp.dna.desc': 'SNN-ViT 혼합 구조 기반 한글 획 인식 시스템 연구',
    'exp.whs': 'KITRI 화이트햇 스쿨 1기 수료',
    'exp.whs.desc': '보안 교육 과정 수료',
  },
  en: {
    'nav.about': 'About',
    'nav.skills': 'Interests',
    'nav.publications': 'Publications',
    'nav.pubs': 'Pubs',
    'nav.resume': 'Education',
    'nav.experience': 'Experience',
    'nav.experienceShort': 'Exp',
    'theme.system': 'System',
    'theme.light': 'Light',
    'theme.dark': 'Dark',
    'profile.role': 'Graduate Student Candidate',
    'profile.name': 'Bae Min Jun',
    'profile.summary': 'I study Electronic & Electrical Engineering and Software Engineering, with interest in software that runs close to hardware.',
    'hero.kicker': 'Developer growing through challenges',
    'hero.title': 'A software developer connecting research and implementation.',
    'hero.copy': 'I build research-oriented software experience around digital systems, computer architecture, networks, and computer vision for real-world devices.',
    'hero.ctaPublications': 'View publications',
    'hero.ctaResume': 'Explore education',
    'stats.gpa': 'Overall GPA',
    'stats.auto': 'Autonomous driving awards',
    'stats.security': 'Security education completed',
    'about.eyebrow': 'About',
    'about.title': 'I look for research questions where hardware and software meet.',
    'about.p1': 'I am double majoring in Electronic & Electrical Engineering and Software Engineering at Sungkyunkwan University. I am interested in software close to physical systems, including digital circuits, system architecture, network communication, and computer vision.',
    'about.p2': 'With graduate school in mind, I am refining both research direction and implementation skills. I value learning quickly from failure, rebuilding, and organizing results into writing and presentations.',
    'skills.eyebrow': 'Research Interest',
    'skills.title': 'Research interests and technical stack',
    'skills.copy': 'A compact view of software, autonomous driving, vision, and system implementation experience that benefits from hardware awareness.',
    'focus.digital': 'Studying digital system design based on VHDL/Verilog.',
    'focus.arch': 'Studying computer architecture based on Intel x86 and RISC-V ISA.',
    'focus.network': 'Interested in Socket I/O and TCP/IP communication.',
    'focus.vision': 'Exploring image processing and vision systems connected to autonomous driving.',
    'publications.eyebrow': 'Publications',
    'publications.title': 'Research presentations and related work',
    'publications.overview': 'Publication Overview',
    'overview.autonomous': 'Autonomous Driving',
    'overview.systems': 'Embedded / Digital Systems',
    'overview.security': 'Security & Automation',
    'filter.all': 'All',
    'filter.domestic': 'Domestic',
    'filter.international': 'International',
    'pub.parking.title': 'Feedback Parking System Using Bezier Curve-Based Path Planning and Machine Learning Techniques',
    'pub.parking.desc': 'Submitted and presented at the 2024 KSAE Fall Conference, Special Session on Future Automobiles.',
    'pub.parking.venue': '2024 KSAE Fall Conference, Special Session on Future Automobiles',
    'pub.uart.title': 'Driving Stabilization and Latency Optimization via UART Communication-Based Split Byte Command Protocol',
    'pub.uart.desc': 'Presented at the 2024 KSAE Fall Conference. Received Encouragement Award and Challenge Award.',
    'pub.uart.venue': '2024 KSAE Fall Conference, Special Session on Future Automobiles',
    'pub.type.conference': 'Conference',
    'pub.status.presented': 'Presented',
    'pub.award.ksae': 'Encouragement Award / Challenge Award',
    'pub.international.emptyTitle': 'International publications are being prepared.',
    'pub.international.emptyBody': 'Accepted or submitted international publications will be listed here.',
    'project.auto.title': 'Research and implementation notes from the SKKU Autonomous Driving SW Competition',
    'project.bug.title': 'Optimizing Bug Bounty Through Web Automation Tool Analysis',
    'project.tetris.title': 'Implementing Tetris with Logic Circuits',
    'project.open': 'Open details',
    'related.auto.desc': 'Path planning, control, and embedded communication work from autonomous driving competitions.',
    'related.security.desc': 'Security automation project analyzing web automation tools for bug bounty workflows.',
    'related.tetris.desc': 'Digital logic project implemented with Logisim-evolution.',
    'resume.eyebrow': 'Education',
    'resume.title': 'Education',
    'resume.education': 'Education',
    'resume.experience': 'Experience & Achievement',
    'experience.eyebrow': 'Experience',
    'experience.title': 'Awards and research experience',
    'edu.software': 'Double major in Software Engineering',
    'edu.software.desc': 'Started double majoring in Software Engineering from the fall semester of 2023.',
    'edu.skku': 'Sungkyunkwan University, Electronic & Electrical Engineering',
    'edu.skku.desc': 'Studying at the intersection of Electronic & Electrical Engineering and Software Engineering.',
    'exp.auto3': 'The 3rd SKKU Autonomous Driving Competition, Grand Prize',
    'exp.auto3.desc': 'July 18, 2025 / President Award of Sungkyunkwan University',
    'exp.coop': 'Winter Semester CO-OP',
    'exp.coop.desc': 'Computer vision project, AR-Guide, at Crois Inc.',
    'exp.ksae': '2024 KSAE Fall Conference, Special Session on Future Automobiles',
    'exp.ksae.desc': 'Submitted and presented two papers. Received Encouragement Award and Challenge Award.',
    'exp.dna': '2024 DNA Hero Project',
    'exp.dna.desc': 'Research on a Korean stroke recognition system based on an SNN-ViT hybrid structure.',
    'exp.whs': 'Completed KITRI White Hat School, 1st session',
    'exp.whs.desc': 'Completed security education hosted by KITRI.',
  },
};

const root = document.documentElement;
const themeMedia = window.matchMedia('(prefers-color-scheme: dark)');
const themeToggle = document.querySelector('[data-theme-toggle]');
const themeLabel = document.querySelector('[data-theme-label]');
const themePopover = document.querySelector('[data-theme-popover]');
const languageButtons = document.querySelectorAll('[data-lang-option]');
const themeButtons = document.querySelectorAll('[data-theme-option]');
const filterButtons = document.querySelectorAll('[data-filter]');
const filterItems = document.querySelectorAll('[data-publication-scope]');
const emptyPublication = document.querySelector('[data-publication-empty]');
const navLinks = document.querySelectorAll('.site-nav a');
const sections = document.querySelectorAll('main section[id]');

let selectedTheme = localStorage.getItem(STORAGE_KEYS.theme) || 'system';
let selectedLanguage = localStorage.getItem(STORAGE_KEYS.language) || 'ko';

const applyTheme = () => {
  const resolvedTheme = selectedTheme === 'system'
    ? (themeMedia.matches ? 'dark' : 'light')
    : selectedTheme;

  root.dataset.theme = resolvedTheme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute(
    'content',
    resolvedTheme === 'dark' ? '#101416' : '#f7f3ea',
  );

  themeButtons.forEach((button) => {
    button.classList.toggle('active', button.dataset.themeOption === selectedTheme);
  });

  if (themeLabel) {
    themeLabel.textContent = translations[selectedLanguage]?.[`theme.${selectedTheme}`] || selectedTheme;
  }
};

const applyLanguage = () => {
  const dictionary = translations[selectedLanguage];
  root.lang = selectedLanguage;

  document.querySelectorAll('[data-i18n]').forEach((element) => {
    const value = dictionary[element.dataset.i18n];
    if (value) element.textContent = value;
  });

  languageButtons.forEach((button) => {
    button.classList.toggle('active', button.dataset.langOption === selectedLanguage);
  });

  applyTheme();
};

const closeThemePopover = () => {
  themePopover?.classList.remove('open');
  themeToggle?.setAttribute('aria-expanded', 'false');
};

themeToggle?.addEventListener('click', () => {
  const isOpen = themePopover.classList.toggle('open');
  themeToggle.setAttribute('aria-expanded', String(isOpen));
});

document.addEventListener('click', (event) => {
  if (!event.target.closest('.theme-menu')) closeThemePopover();
});

themeButtons.forEach((button) => {
  button.addEventListener('click', () => {
    selectedTheme = button.dataset.themeOption;
    localStorage.setItem(STORAGE_KEYS.theme, selectedTheme);
    applyTheme();
    closeThemePopover();
  });
});

languageButtons.forEach((button) => {
  button.addEventListener('click', () => {
    selectedLanguage = button.dataset.langOption;
    localStorage.setItem(STORAGE_KEYS.language, selectedLanguage);
    applyLanguage();
  });
});

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const selectedFilter = button.dataset.filter;

    filterButtons.forEach((item) => {
      item.classList.toggle('active', item === button);
    });

    filterItems.forEach((item) => {
      const shouldShow = selectedFilter === 'all' || item.dataset.publicationScope === selectedFilter;
      item.classList.toggle('hidden', !shouldShow);
    });

    if (emptyPublication) {
      emptyPublication.classList.toggle('visible', selectedFilter === 'international');
    }
  });
});

const navObserver = new IntersectionObserver((entries) => {
  const visible = entries
    .filter((entry) => entry.isIntersecting)
    .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

  if (!visible) return;

  navLinks.forEach((link) => {
    link.classList.toggle('active', link.getAttribute('href') === `#${visible.target.id}`);
  });
}, {
  rootMargin: '-30% 0px -55% 0px',
  threshold: [0.1, 0.25, 0.5],
});

sections.forEach((section) => navObserver.observe(section));
themeMedia.addEventListener('change', applyTheme);

applyTheme();
applyLanguage();
