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

    const target = this.dataset.navTarget || this.textContent.trim().toLowerCase();

    for (let i = 0; i < pages.length; i++) {
      if (target === pages[i].dataset.page) {
        pages[i].classList.add("active");
        navigationLinks[i].classList.add("active");
        window.scrollTo(0, 0);
      } else {
        pages[i].classList.remove("active");
        navigationLinks[i].classList.remove("active");
      }
    }

    document.body.classList.toggle("conference-layout", target === "conferences");

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
  document.querySelectorAll(`[data-placeholder-${lang}]`).forEach(el => {
    el.setAttribute('placeholder', el.getAttribute(`data-placeholder-${lang}`));
  });
  if (typeof renderConferenceTable === 'function') renderConferenceTable();
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
const pubVenueRow = document.querySelector('.pub-filter-row[data-filter-group="venue"]');
const pubSelected = { scope: 'all', type: 'all', field: 'all', venue: 'all' };

const pubMatchesField = (item, value) =>
  value === 'all' || (item.dataset.pubField || '').split(/\s+/).includes(value);

// only show venue options that still have papers under the current scope/type/field
const updatePubVenueOptions = () => {
  if (!pubVenueRow) return;
  const matchesBase = (item) =>
    (pubSelected.scope === 'all' || item.dataset.pubScope === pubSelected.scope) &&
    (pubSelected.type === 'all' || item.dataset.pubType === pubSelected.type) &&
    pubMatchesField(item, pubSelected.field);
  pubVenueRow.querySelectorAll('button[data-filter]').forEach((btn) => {
    const v = btn.dataset.filter;
    btn.hidden = v !== 'all' && ![...pubItems].some((item) => item.dataset.pubVenue === v && matchesBase(item));
  });
  const activeVenue = pubVenueRow.querySelector('button[data-filter].active');
  if (activeVenue && activeVenue.hidden) {
    pubSelected.venue = 'all';
    pubVenueRow.querySelectorAll('button[data-filter]').forEach((b) => b.classList.toggle('active', b.dataset.filter === 'all'));
  }
};

const applyPubFilters = () => {
  let anyVisible = false;
  pubItems.forEach((item) => {
    const show =
      (pubSelected.scope === 'all' || item.dataset.pubScope === pubSelected.scope) &&
      (pubSelected.type === 'all' || item.dataset.pubType === pubSelected.type) &&
      pubMatchesField(item, pubSelected.field) &&
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
      updatePubVenueOptions();
      applyPubFilters();
    });
  });
});

updatePubVenueOptions();



// ===== "Go to Publications" button in About → activate the Publications tab =====
document.querySelectorAll('[data-go-publications]').forEach((btn) => {
  btn.addEventListener('click', () => {
    const navBtn = [...document.querySelectorAll('.navbar [data-nav-link]')]
      .find((b) => b.dataset.navTarget === 'publications');
    if (navBtn) navBtn.click();
  });
});



// ===== systems conferences: public table + GitHub Issue request editor =====
const conferenceTable = document.querySelector('[data-conference-table]');
const conferenceStatus = document.querySelector('[data-conference-status]');
const conferenceSearch = document.querySelector('[data-conference-search]');
const conferenceViewButtons = document.querySelectorAll('[data-conference-view]');
const conferenceSnapshot = document.querySelector('[data-conference-snapshot]');
const conferenceDialog = document.querySelector('[data-conference-admin-dialog]');
const conferenceEditorMessage = document.querySelector('[data-conference-editor-message]');
const conferenceEditorForm = document.querySelector('[data-conference-editor-form]');
const conferenceVenueList = document.querySelector('[data-conference-venues]');
const conferencePublishButton = document.querySelector('[data-conference-publish]');
const CONFERENCE_REPOSITORY = 'bmj4004/bmj4004.github.io';
const CONFERENCE_ISSUE_URL = `https://github.com/${CONFERENCE_REPOSITORY}/issues/new`;
const CONFERENCE_ISSUE_TITLE = '[Conference schedule] Update request';
const conferenceMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

let conferenceData = null;
let conferencePublicData = null;
let conferenceMode = 'deadline';
let conferenceQuery = '';
let conferenceDirty = false;
const conferencePendingChanges = new Map();

const conferenceLang = () => localStorage.getItem('lang') || 'en';
const conferenceText = (en, ko) => conferenceLang() === 'ko' ? ko : en;

const setConferenceMessage = (element, message = '', type = '') => {
  if (!element) return;
  element.textContent = message;
  element.classList.toggle('is-error', type === 'error');
  element.classList.toggle('is-success', type === 'success');
};

const safeConferenceUrl = (value) => {
  if (!value) return '';
  try {
    const url = new URL(value);
    return ['http:', 'https:'].includes(url.protocol) && !url.username && !url.password ? url.href : '';
  } catch (_) {
    return '';
  }
};

const createConferenceElement = (tag, className, text) => {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
};

const conferenceScheduleForRow = (row) => {
  const schedules = (row.events || []).flatMap((event) => {
    const match = String(event.value || '').trim().match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (!match) return [];
    const monthIndex = Number(match[2]) - 1;
    if (monthIndex < 0 || monthIndex >= conferenceMonths.length) return [];
    const parsedDay = Number(match[3]);
    return [{
      month: conferenceMonths[monthIndex],
      monthIndex,
      day: parsedDay >= 1 && parsedDay <= 31 ? parsedDay : 32,
      year: Number(event.year) || Number(match[1]) || 0,
    }];
  }).sort((a, b) => b.year - a.year);

  if (schedules.length) return schedules[0];
  const fallbackIndex = conferenceMonths.indexOf(row.month);
  return {
    month: fallbackIndex >= 0 ? row.month : conferenceMonths[0],
    monthIndex: fallbackIndex >= 0 ? fallbackIndex : 0,
    day: 32,
    year: 0,
  };
};

const compareConferenceRows = (a, b) => {
  const scheduleA = conferenceScheduleForRow(a);
  const scheduleB = conferenceScheduleForRow(b);
  return scheduleA.monthIndex - scheduleB.monthIndex
    || scheduleA.day - scheduleB.day
    || a.venue.localeCompare(b.venue)
    || (a.cycle || '').localeCompare(b.cycle || '');
};

const synchronizeConferenceMonths = (view) => {
  view.rows.forEach((row) => {
    row.month = conferenceScheduleForRow(row).month;
  });
  view.rows.sort(compareConferenceRows);
};

const formatConferenceSnapshot = () => {
  if (!conferenceSnapshot || !conferenceData?.snapshot) return;
  const date = new Date(`${conferenceData.snapshot}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) {
    conferenceSnapshot.textContent = `${conferenceData.snapshot}. `;
    return;
  }
  conferenceSnapshot.textContent = conferenceLang() === 'ko'
    ? `${conferenceData.snapshot} 기준. `
    : `Snapshot: ${new Intl.DateTimeFormat('en', { dateStyle: 'long', timeZone: 'UTC' }).format(date)}. `;
};

const conferenceRowsForDisplay = (view) => {
  const query = conferenceQuery.trim().toLocaleLowerCase();
  const rows = query ? view.rows.filter((row) => {
    const eventText = row.events.map((event) => `${event.value} ${event.location} ${event.details}`).join(' ');
    return `${row.venue} ${row.fullName} ${row.cycle} ${eventText}`.toLocaleLowerCase().includes(query);
  }) : view.rows;
  return [...rows].sort(compareConferenceRows);
};

const renderConferenceTable = () => {
  if (!conferenceTable || !conferenceData) return;
  const view = conferenceData.views?.[conferenceMode];
  if (!view) return;

  const currentYear = String(new Date().getFullYear());
  const fragment = document.createDocumentFragment();
  const head = document.createElement('thead');
  const headerRow = document.createElement('tr');
  const monthHeader = createConferenceElement('th', 'conference-month-column', conferenceText('Month', '월'));
  const venueHeader = createConferenceElement('th', 'conference-venue-column', conferenceText('Venue', '학회'));
  monthHeader.scope = 'col';
  venueHeader.scope = 'col';
  headerRow.append(monthHeader, venueHeader);

  view.years.forEach((year) => {
    const label = conferenceMode === 'deadline'
      ? conferenceText(`Deadline ${year}`, `${year} 마감일`)
      : conferenceText(`Date ${year}`, `${year} 개최일`);
    const th = createConferenceElement('th', year === currentYear ? 'is-current-year' : '', label);
    th.scope = 'col';
    headerRow.append(th);
  });
  head.append(headerRow);
  fragment.append(head);

  const body = document.createElement('tbody');
  const rows = conferenceRowsForDisplay(view);
  let previousMonth = '';
  let monthGroupIndex = -1;

  rows.forEach((row) => {
    const tr = document.createElement('tr');
    const rowMonth = conferenceScheduleForRow(row).month;
    const startsMonth = rowMonth !== previousMonth;
    if (startsMonth) monthGroupIndex += 1;
    tr.classList.add(monthGroupIndex % 2 === 0 ? 'conference-month-group-a' : 'conference-month-group-b');
    if (startsMonth) tr.classList.add('conference-month-start');
    const month = startsMonth ? rowMonth : '';
    previousMonth = rowMonth;
    tr.append(createConferenceElement('td', 'conference-month-column', month));

    const venueCell = createConferenceElement('td', 'conference-venue-column');
    if (row.fullName) venueCell.title = row.fullName;
    venueCell.append(createConferenceElement('span', 'conference-venue-name', row.venue));
    if (row.cycle) venueCell.append(createConferenceElement('span', 'conference-cycle', row.cycle));
    tr.append(venueCell);

    const eventByYear = new Map(row.events.map((event) => [String(event.year), event]));
    view.years.forEach((year) => {
      const event = eventByYear.get(String(year)) || { year, value: '-', url: '', location: '', details: '' };
      const cell = document.createElement('td');
      if (String(year) === currentYear) cell.classList.add('is-current-year');
      if (event.details) {
        cell.title = event.details;
        cell.tabIndex = 0;
      }

      const url = safeConferenceUrl(event.url);
      if (url && event.value !== '-') {
        const link = createConferenceElement('a', 'conference-date-link', event.value);
        link.href = url;
        link.target = '_blank';
        link.rel = 'noreferrer';
        cell.append(link);
      } else {
        cell.append(createConferenceElement('span', event.value === '-' ? 'conference-empty' : '', event.value || '-'));
      }
      if (event.location) cell.append(createConferenceElement('span', 'conference-location', event.location));

      const editButton = createConferenceElement('button', 'conference-cell-edit');
      editButton.type = 'button';
      editButton.title = conferenceText('Request a change to this entry', '이 항목의 수정 요청');
      editButton.setAttribute('aria-label', editButton.title);
      const icon = document.createElement('ion-icon');
      icon.setAttribute('name', 'create-outline');
      editButton.append(icon);
      editButton.addEventListener('click', (eventObject) => {
        eventObject.preventDefault();
        eventObject.stopPropagation();
        populateConferenceEditor(row, event, conferenceMode);
        openConferenceDialog();
      });
      cell.append(editButton);
      tr.append(cell);
    });
    body.append(tr);
  });

  fragment.append(body);
  conferenceTable.replaceChildren(fragment);
  setConferenceMessage(
    conferenceStatus,
    rows.length ? '' : conferenceText('No conferences match your search.', '검색 조건에 맞는 학회가 없습니다.')
  );
  formatConferenceSnapshot();
};

const loadPublicConferenceData = async () => {
  if (!conferenceTable) return;
  setConferenceMessage(conferenceStatus, conferenceText('Loading conference schedule…', '학회 일정을 불러오는 중…'));
  try {
    const response = await fetch('./assets/data/sysvenues.json?v=20260907', { cache: 'no-cache' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    conferencePublicData = await response.json();
    conferenceData = JSON.parse(JSON.stringify(conferencePublicData));
    renderConferenceTable();
  } catch (error) {
    console.error('Could not load conference data:', error);
    setConferenceMessage(
      conferenceStatus,
      conferenceText('The conference schedule could not be loaded.', '학회 일정을 불러오지 못했습니다.'),
      'error'
    );
  }
};

conferenceViewButtons.forEach((button) => {
  button.addEventListener('click', () => {
    conferenceMode = button.dataset.conferenceView;
    conferenceViewButtons.forEach((candidate) => candidate.classList.toggle('active', candidate === button));
    renderConferenceTable();
  });
});

if (conferenceSearch) {
  conferenceSearch.addEventListener('input', () => {
    conferenceQuery = conferenceSearch.value;
    renderConferenceTable();
  });
}

const openConferenceDialog = () => {
  if (!conferenceDialog) return;
  if (typeof conferenceDialog.showModal === 'function') conferenceDialog.showModal();
  else conferenceDialog.setAttribute('open', '');
};

const closeConferenceDialog = () => {
  if (!conferenceDialog) return;
  if (conferenceDirty && !window.confirm(conferenceText(
    'Close without creating your GitHub request?',
    'GitHub 요청을 만들지 않고 닫을까요?'
  ))) return;
  conferenceDialog.close();
};

const rebuildConferenceVenueList = () => {
  if (!conferenceVenueList || !conferenceData) return;
  const names = new Set();
  Object.values(conferenceData.views).forEach((view) => {
    view.rows.forEach((row) => names.add(row.venue));
  });
  const options = [...names].sort((a, b) => a.localeCompare(b)).map((name) => {
    const option = document.createElement('option');
    option.value = name;
    return option;
  });
  conferenceVenueList.replaceChildren(...options);
};


const populateConferenceEditor = (row, event, mode) => {
  if (!conferenceEditorForm) return;
  conferenceEditorForm.elements.mode.value = mode;
  conferenceEditorForm.elements.venue.value = row.venue || '';
  conferenceEditorForm.elements.fullName.value = row.fullName || '';
  conferenceEditorForm.elements.cycle.value = row.cycle || '';
  conferenceEditorForm.elements.year.value = event.year || '';
  conferenceEditorForm.elements.value.value = event.value === '-' ? '' : event.value || '';
  conferenceEditorForm.elements.url.value = event.url || '';
  conferenceEditorForm.elements.location.value = event.location || '';
  conferenceEditorForm.elements.details.value = event.details || '';
  setConferenceMessage(conferenceEditorMessage, conferenceText(
    `Editing ${row.venue} ${event.year}.`,
    `${row.venue} ${event.year} 항목을 수정합니다.`
  ));
};

const normalizeConferenceYears = (view) => {
  view.years = [...new Set(view.years.map(String))].sort((a, b) => Number(b) - Number(a));
  view.rows.forEach((row) => {
    const byYear = new Map(row.events.map((event) => [String(event.year), event]));
    row.events = view.years.map((year) => byYear.get(year) || {
      year, value: '-', url: '', location: '', details: ''
    });
  });
};

const conferenceChangeKey = (change) => JSON.stringify([
  change.mode,
  change.venue.toLocaleLowerCase(),
  change.cycle.toLocaleLowerCase(),
  change.year,
]);

const validConferenceDate = (value, year) => {
  const match = value.match(/^(\d{4})-(0[1-9]|1[0-2])-([0-2]\d|3[01])(?:\.\.([0-2]\d|3[01]))?$/);
  if (!match || match[1] !== year) return false;
  const date = new Date(`${match[1]}-${match[2]}-${match[3]}T00:00:00Z`);
  return !Number.isNaN(date.getTime())
    && String(date.getUTCFullYear()) === match[1]
    && String(date.getUTCMonth() + 1).padStart(2, '0') === match[2]
    && String(date.getUTCDate()).padStart(2, '0') === match[3];
};

const conferenceMarkdown = (value) => String(value || '')
  .replace(/([\\`*_{}\[\]()<>#+\-.!|])/g, '\\$1')
  .replace(/[\r\n]+/g, ' ');

const buildConferenceIssueBody = () => {
  const changes = [...conferencePendingChanges.values()];
  const summary = changes.map((change, index) => [
    `### ${index + 1}. ${conferenceMarkdown(change.venue)}${change.cycle ? ` — ${conferenceMarkdown(change.cycle)}` : ''}`,
    `- View: ${conferenceMarkdown(change.mode)}`,
    `- Year: ${conferenceMarkdown(change.year)}`,
    `- Date: ${conferenceMarkdown(change.value)}`,
    change.location ? `- Location: ${conferenceMarkdown(change.location)}` : '',
    change.url ? `- Official URL: ${conferenceMarkdown(change.url)}` : '',
    change.details ? `- Details: ${conferenceMarkdown(change.details)}` : '',
  ].filter(Boolean).join('\n')).join('\n\n');

  return [
    '# Conference schedule update request',
    '',
    'This request was prepared with the conference editor on the website.',
    'Please review the human-readable changes and official links below. Only the repository owner can apply this request by commenting exactly `/approve`.',
    '',
    '## Requested changes',
    '',
    summary,
    '',
    '## Machine-readable request',
    '',
    '<!-- Do not edit the JSON block below. Invalid or unexpected fields are rejected. -->',
    '```json',
    JSON.stringify({ version: 1, changes }, null, 2),
    '```',
  ].join('\n');
};

if (conferenceEditorForm) {
  conferenceEditorForm.addEventListener('submit', (eventObject) => {
    eventObject.preventDefault();
    if (!conferenceData) return;

    const form = new FormData(conferenceEditorForm);
    const mode = String(form.get('mode'));
    const view = conferenceData.views[mode];
    const year = String(form.get('year')).trim();
    const venue = String(form.get('venue')).trim();
    const cycle = String(form.get('cycle')).trim();
    const value = String(form.get('value')).trim();
    const rawUrl = String(form.get('url')).trim();
    const url = safeConferenceUrl(rawUrl);
    if (!view || !year || !venue) return;
    if (!validConferenceDate(value, year)) {
      setConferenceMessage(conferenceEditorMessage, conferenceText(
        'Enter a valid date in YYYY-MM-DD or YYYY-MM-DD..DD format. Its year must match the Year field.',
        'YYYY-MM-DD 또는 YYYY-MM-DD..DD 형식의 올바른 날짜를 입력하세요. 날짜의 연도와 연도 입력값도 같아야 합니다.'
      ), 'error');
      return;
    }
    if (rawUrl && !url) {
      setConferenceMessage(conferenceEditorMessage, conferenceText(
        'The official URL must start with http:// or https://.',
        '공식 URL은 http:// 또는 https://로 시작해야 합니다.'
      ), 'error');
      return;
    }

    const change = {
      mode,
      venue,
      fullName: String(form.get('fullName')).trim(),
      cycle,
      year,
      value,
      url,
      location: String(form.get('location')).trim(),
      details: String(form.get('details')).trim(),
    };

    if (Object.values(change).some((field) => String(field).includes('```'))) {
      setConferenceMessage(conferenceEditorMessage, conferenceText(
        'Three consecutive backticks are not allowed in a request.',
        '요청 내용에는 백틱 3개를 연속해서 사용할 수 없습니다.'
      ), 'error');
      return;
    }

    if (!view.years.includes(year)) view.years.push(year);
    normalizeConferenceYears(view);

    let row = view.rows.find((candidate) =>
      candidate.venue.toLocaleLowerCase() === venue.toLocaleLowerCase() &&
      (candidate.cycle || '').toLocaleLowerCase() === cycle.toLocaleLowerCase()
    );
    if (!row) {
      row = {
        month: conferenceMonths[0],
        venue,
        fullName: change.fullName,
        cycle,
        events: view.years.map((itemYear) => ({
          year: itemYear, value: '-', url: '', location: '', details: ''
        })),
      };
      view.rows.push(row);
    }

    row.fullName = change.fullName || row.fullName || '';
    row.cycle = cycle;
    const entry = row.events.find((candidate) => String(candidate.year) === year);
    Object.assign(entry, {
      year,
      value: change.value,
      url: change.url,
      location: change.location,
      details: change.details,
    });

    synchronizeConferenceMonths(view);
    conferencePendingChanges.set(conferenceChangeKey(change), change);
    conferenceDirty = true;
    if (conferencePublishButton) conferencePublishButton.disabled = false;
    conferenceMode = mode;
    conferenceViewButtons.forEach((button) => {
      button.classList.toggle('active', button.dataset.conferenceView === mode);
    });
    rebuildConferenceVenueList();
    renderConferenceTable();
    const requestCount = conferencePendingChanges.size;
    setConferenceMessage(conferenceEditorMessage, conferenceText(
      `Preview updated. ${requestCount} change${requestCount === 1 ? '' : 's'} ready for a GitHub request.`,
      `미리보기에 반영했습니다. GitHub 요청에 포함할 변경 ${requestCount}개가 준비되었습니다.`
    ), 'success');
  });
}

if (conferencePublishButton) {
  conferencePublishButton.addEventListener('click', () => {
    if (!conferenceDirty || !conferencePendingChanges.size) return;
    const body = buildConferenceIssueBody();
    const issueUrl = `${CONFERENCE_ISSUE_URL}?${new URLSearchParams({
      title: CONFERENCE_ISSUE_TITLE,
      body,
    })}`;
    if (issueUrl.length > 7500) {
      setConferenceMessage(conferenceEditorMessage, conferenceText(
        'This request is too large for one link. Open a request with fewer changes first.',
        '한 링크에 담기에는 요청이 너무 큽니다. 변경 수를 줄여 먼저 요청해 주세요.'
      ), 'error');
      return;
    }
    window.open(issueUrl, '_blank', 'noopener,noreferrer');
    setConferenceMessage(conferenceEditorMessage, conferenceText(
      'GitHub opened in a new tab. Submit the Issue there; the data changes only after owner approval.',
      '새 탭에서 GitHub가 열렸습니다. Issue를 등록해 주세요. 소유자가 승인해야 실제 데이터가 변경됩니다.'
    ), 'success');
  });
}

document.querySelectorAll('[data-conference-admin-open]').forEach((button) => {
  button.addEventListener('click', () => {
    openConferenceDialog();
    rebuildConferenceVenueList();
  });
});

document.querySelectorAll('[data-conference-admin-close]').forEach((button) => {
  button.addEventListener('click', closeConferenceDialog);
});

if (conferenceDialog) {
  conferenceDialog.addEventListener('click', (eventObject) => {
    if (eventObject.target === conferenceDialog) closeConferenceDialog();
  });
}

const initializeConferencePage = async () => {
  if (!conferenceTable) return;
  await loadPublicConferenceData();
  rebuildConferenceVenueList();
};

initializeConferencePage();
