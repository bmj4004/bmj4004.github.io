'use strict';



// element toggle function
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }



// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// sidebar toggle functionality for mobile
sidebarBtn.addEventListener("click", function () { elementToggleFunc(sidebar); });



// testimonials variables
const testimonialsItem = document.querySelectorAll("[data-testimonials-item]");
const modalContainer = document.querySelector("[data-modal-container]");
const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
const overlay = document.querySelector("[data-overlay]");

// modal variable
const modalImg = document.querySelector("[data-modal-img]");
const modalTitle = document.querySelector("[data-modal-title]");
const modalText = document.querySelector("[data-modal-text]");

// modal toggle function
const testimonialsModalFunc = function () {
  modalContainer.classList.toggle("active");
  overlay.classList.toggle("active");
}

// add click event to all modal items
for (let i = 0; i < testimonialsItem.length; i++) {

  testimonialsItem[i].addEventListener("click", function () {

    modalImg.src = this.querySelector("[data-testimonials-avatar]").src;
    modalImg.alt = this.querySelector("[data-testimonials-avatar]").alt;
    modalTitle.innerHTML = this.querySelector("[data-testimonials-title]").innerHTML;
    modalText.innerHTML = this.querySelector("[data-testimonials-text]").innerHTML;

    testimonialsModalFunc();

  });

}

// add click event to modal close button (absent on subpages — guard against null)
if (modalCloseBtn) modalCloseBtn.addEventListener("click", testimonialsModalFunc);
if (overlay) overlay.addEventListener("click", testimonialsModalFunc);



// custom select variables
const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-selecct-value]");
const filterBtn = document.querySelectorAll("[data-filter-btn]");

if (select) select.addEventListener("click", function () { elementToggleFunc(this); });

// add event in all select items
for (let i = 0; i < selectItems.length; i++) {
  selectItems[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    elementToggleFunc(select);
    filterFunc(selectedValue);

  });
}

// filter variables
const filterItems = document.querySelectorAll("[data-filter-item]");

const filterFunc = function (selectedValue) {

  for (let i = 0; i < filterItems.length; i++) {

    if (selectedValue === "all") {
      filterItems[i].classList.add("active");
    } else if (selectedValue === filterItems[i].dataset.category) {
      filterItems[i].classList.add("active");
    } else {
      filterItems[i].classList.remove("active");
    }

  }

}

// add event in all filter button items for large screen
let lastClickedBtn = filterBtn[0];

for (let i = 0; i < filterBtn.length; i++) {

  filterBtn[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    filterFunc(selectedValue);

    lastClickedBtn.classList.remove("active");
    this.classList.add("active");
    lastClickedBtn = this;

  });

}



// contact form variables
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");

// add event to all form input field
for (let i = 0; i < formInputs.length; i++) {
  formInputs[i].addEventListener("input", function () {

    // check form validation
    if (form.checkValidity()) {
      formBtn.removeAttribute("disabled");
    } else {
      formBtn.setAttribute("disabled", "");
    }

  });
}



// page navigation variables
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

// add event to all nav link
for (let i = 0; i < navigationLinks.length; i++) {
  navigationLinks[i].addEventListener("click", function () {

    for (let i = 0; i < pages.length; i++) {
      if (this.innerHTML.toLowerCase() === pages[i].dataset.page) {
        pages[i].classList.add("active");
        navigationLinks[i].classList.add("active");
        window.scrollTo(0, 0);
      } else {
        pages[i].classList.remove("active");
        navigationLinks[i].classList.remove("active");
      }
    }

  });
}

function setLanguage(lang) {
  localStorage.setItem('lang', lang);
  document.querySelectorAll('[data-en], [data-ko]').forEach(el => {
    const text = el.getAttribute(`data-${lang}`);
    if (text !== null) el.textContent = text;
    const href = el.getAttribute(`data-href-${lang}`);
    if (href) el.setAttribute('href', href);
  });
}

document.addEventListener('DOMContentLoaded', function() {
  const lang = localStorage.getItem('lang') || 'en';
  setLanguage(lang);
});

const COPY_TEXT_CHANGE_OFFSET = 1000;
const COPY_BUTTON_TEXT_BEFORE = 'Copy';
const COPY_BUTTON_TEXT_AFTER = 'Copied';
const COPY_ERROR_MESSAGE = '코드를 복사할 수 없습니다. 다시 시도해 주세요.';

const codeWrappers = document.querySelectorAll('pre[id^=code_]');

const copyBlockCode = async (target = null) => {
  if (!target) return;
  try {
    const code = decodeURI(target.dataset.code);

    await navigator.clipboard.writeText(code);
    target.textContent = COPY_BUTTON_TEXT_AFTER;
    setTimeout(() => {
      target.textContent = COPY_BUTTON_TEXT_BEFORE;
    }, COPY_TEXT_CHANGE_OFFSET);
  } catch(error) {
    alert(COPY_ERROR_MESSAGE);
    console.error(error);
  }
}

for (const codeWrapper of codeWrappers) {
  const codeBlock = codeWrapper.querySelector('code');
  console.log(codeBlock);
  const codes = codeBlock.innerHTML.split('\n');
  
  const processedCodes = codes.reduce((prevCodes, curCode) => prevCodes + `<div class="line">${curCode}</div>`, '');
  
  const copyButton = `<button type="button" class="copy-btn" data-code="${encodeURI(codeBlock.textContent)}" onclick="copyBlockCode(this)">${COPY_BUTTON_TEXT_BEFORE}</button>`;
  
  const codeBody = `<div class="code-body">${processedCodes}</div>`;
  
  const codeHeader = `
  <div class="code-header">
    <span class="red btn"></span>
    <span class="yellow btn"></span>
    <span class="green btn"></span>
    ${copyButton}
  </div>`;
  
  codeBlock.innerHTML = codeHeader + codeBody;
}



// ===== theme: follows the system by default, sun/moon manual toggle =====
const THEME_KEY = 'bmj-theme';
const themeMedia = window.matchMedia('(prefers-color-scheme: dark)');
const themeToggleBtns = document.querySelectorAll('[data-theme-toggle]');

// stored value is 'light' | 'dark' | null (null = follow the system)
const storedTheme = () => localStorage.getItem(THEME_KEY);
const resolvedTheme = () => {
  const s = storedTheme();
  return (s === 'light' || s === 'dark') ? s : (themeMedia.matches ? 'dark' : 'light');
};

const applyTheme = () => {
  const resolved = resolvedTheme();
  document.documentElement.dataset.theme = resolved;

  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', resolved === 'dark' ? '#15131d' : '#f6f3fb');

  themeToggleBtns.forEach((btn) => {
    const icon = btn.querySelector('[data-theme-icon]');
    if (icon) icon.setAttribute('name', resolved === 'dark' ? 'moon-outline' : 'sunny-outline');
    const label = resolved === 'dark' ? '라이트 모드로 전환' : '다크 모드로 전환';
    btn.setAttribute('aria-label', label);
    btn.setAttribute('title', label);
  });
};

themeToggleBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    const next = resolvedTheme() === 'dark' ? 'light' : 'dark';
    localStorage.setItem(THEME_KEY, next);
    applyTheme();
  });
});

// keep tracking the OS setting until the visitor picks a theme explicitly
themeMedia.addEventListener('change', () => { if (!storedTheme()) applyTheme(); });

applyTheme();



// ===== publications: multi-dimensional filter (scope / type / field / venue) =====
const pubItems = document.querySelectorAll('.pub-item');
const pubGroups = document.querySelectorAll('[data-pub-group]');
const pubEmpty = document.querySelector('[data-pub-empty]');
const pubFilterRows = document.querySelectorAll('.pub-filter-row[data-filter-group]');
const pubSelected = { scope: 'all', type: 'all', field: 'all', venue: 'all' };

const applyPubFilters = () => {
  let anyVisible = false;
  pubItems.forEach((item) => {
    const fields = (item.dataset.pubField || '').split(/\s+/);
    const show =
      (pubSelected.scope === 'all' || item.dataset.pubScope === pubSelected.scope) &&
      (pubSelected.type === 'all' || item.dataset.pubType === pubSelected.type) &&
      (pubSelected.field === 'all' || fields.includes(pubSelected.field)) &&
      (pubSelected.venue === 'all' || item.dataset.pubVenue === pubSelected.venue);
    item.classList.toggle('hidden', !show);
    if (show) anyVisible = true;
  });
  pubGroups.forEach((group) => {
    group.classList.toggle('hidden', !group.querySelector('.pub-item:not(.hidden)'));
  });
  if (pubEmpty) pubEmpty.classList.toggle('visible', !anyVisible);
};

pubFilterRows.forEach((row) => {
  const group = row.dataset.filterGroup;
  row.querySelectorAll('button[data-filter]').forEach((btn) => {
    btn.addEventListener('click', () => {
      row.querySelectorAll('button[data-filter]').forEach((b) => b.classList.toggle('active', b === btn));
      pubSelected[group] = btn.dataset.filter;
      applyPubFilters();
    });
  });
});



// ===== "Go to Publications" button in About → activate the Publications tab =====
document.querySelectorAll('[data-go-publications]').forEach((btn) => {
  btn.addEventListener('click', () => {
    const navBtn = [...document.querySelectorAll('.navbar [data-nav-link]')]
      .find((b) => b.textContent.trim().toLowerCase() === 'publications');
    if (navBtn) navBtn.click();
  });
});