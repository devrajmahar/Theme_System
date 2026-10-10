// Theme Studio's small browser runtime. The page and its styles are static files.
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const themeButton = $('header button[aria-label]');
const systemDark = matchMedia('(prefers-color-scheme: dark)');
let chosenTheme = localStorage.getItem('theme-studio-theme');
function applyTheme() {
  const dark = chosenTheme ? chosenTheme === 'dark' : systemDark.matches;
  document.documentElement.classList.toggle('dark', dark);
  themeButton.setAttribute('aria-label', `Switch to ${dark ? 'light' : 'dark'} theme`);
  themeButton.innerHTML = dark
    ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>'
    : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.7 13.3A9 9 0 0 1 10.7 3.3 9 9 0 1 0 20.7 13.3Z"/></svg>';
  refreshTokenValues();
}
themeButton.addEventListener('click', () => {
  chosenTheme = document.documentElement.classList.contains('dark') ? 'light' : 'dark';
  localStorage.setItem('theme-studio-theme', chosenTheme);
  applyTheme();
});
systemDark.addEventListener('change', () => { if (!chosenTheme) applyTheme(); });

const tabs = $$('[data-tab]');
function selectTab(name) {
  tabs.forEach(tab => {
    const active = tab.dataset.tab === name;
    tab.setAttribute('aria-selected', String(active));
    tab.tabIndex = active ? 0 : -1;
  });
  $$('[data-panel]').forEach(panel => { panel.hidden = panel.dataset.panel !== name; });
  if (name === 'Brand' && !checksStarted) runChecks();
  refreshTokenValues();
}
tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectTab(tab.dataset.tab));
  tab.addEventListener('keydown', event => {
    let next = index;
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    else if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = tabs.length - 1;
    else return;
    event.preventDefault();
    selectTab(tabs[next].dataset.tab);
    tabs[next].focus();
  });
});
selectTab('Components');
$$('main > section button').filter(button => /^(Inspect tokens|Customize)$/.test(button.textContent.trim()))
  .forEach(button => button.addEventListener('click', () => $('#editor').scrollIntoView({ behavior: 'smooth' })));

const textarea = $('#theme-css');
const themeStyle = $('#live-theme');
const defaultCss = textarea.value;
const gutter = $('#editor-gutter');
const editorButtons = $$('#editor button');
const declarationCount = $$('#editor span').find(el => el.textContent.includes('declarations'));
function updateEditor() {
  themeStyle.textContent = textarea.value;
  const lines = Math.max(1, textarea.value.split('\n').length);
  gutter.firstElementChild.innerHTML = Array.from({ length: lines }, (_, i) => `<span class="block h-6 leading-6">${i + 1}</span>`).join('');
  if (declarationCount) declarationCount.textContent = `${(textarea.value.match(/--[\w-]+\s*:/g) || []).length} declarations`;
  refreshTokenValues();
}
textarea.addEventListener('input', updateEditor);
textarea.addEventListener('scroll', () => { gutter.scrollTop = textarea.scrollTop; });
editorButtons.find(el => el.textContent.includes('Reset'))?.addEventListener('click', () => {
  textarea.value = defaultCss;
  updateEditor();
});
const copyButton = editorButtons.find(el => el.textContent.includes('Copy CSS'));
copyButton?.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(textarea.value);
    const label = copyButton.lastChild;
    label.textContent = ' Copied';
    setTimeout(() => { label.textContent = ' Copy CSS'; }, 1400);
  } catch {
    textarea.focus();
    textarea.select();
  }
});

function refreshTokenValues() {
  const style = getComputedStyle(document.documentElement);
  $$('[data-panel="Tokens"] [title^="--"], [data-panel="Primary"] [title^="--"]').forEach(label => {
    const token = label.title.slice(2);
    const value = style.getPropertyValue(`--${token}`).trim();
    const row = label.parentElement;
    const valueElement = row?.querySelector('p:nth-child(2)');
    if (valueElement) {
      valueElement.textContent = value || '\u00a0';
      valueElement.title = value;
    }
  });
}

const signUpForm = $('[data-panel="Components"] form');
if (signUpForm) {
  const validators = {
    email(value) { return !value.trim() ? 'Please enter your email address.' : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) ? 'Please enter a valid email address.' : ''; },
    password(value) { return !value ? 'Please choose a password.' : value.length < 8 ? 'Password must be at least 8 characters.' : ''; }
  };
  function validate(input) {
    const message = validators[input.name](input.value);
    input.setAttribute('aria-invalid', String(Boolean(message)));
    let error = input.parentElement.querySelector('[role="alert"]');
    if (message && !error) {
      error = document.createElement('p');
      error.className = 'text-xs font-normal leading-[14px] text-text-danger';
      error.setAttribute('role', 'alert');
      input.after(error);
    }
    if (error) { error.textContent = message; if (!message) error.remove(); }
    return !message;
  }
  signUpForm.addEventListener('submit', event => {
    event.preventDefault();
    const valid = [...signUpForm.querySelectorAll('input')].map(validate).every(Boolean);
    if (valid) signUpForm.querySelector('input')?.focus();
  });
  signUpForm.addEventListener('input', event => {
    if (event.target.matches('input[aria-invalid="true"]')) validate(event.target);
  });
  signUpForm.addEventListener('reset', () => {
    signUpForm.querySelectorAll('[role="alert"]').forEach(el => el.remove());
    signUpForm.querySelectorAll('[aria-invalid]').forEach(el => el.removeAttribute('aria-invalid'));
  });
}

const iconPanel = $('[data-panel="States & Icons"]');
if (iconPanel) {
  const iconButtons = $$('button[aria-pressed]', iconPanel);
  const selectedLabel = $$('span', iconPanel).find(el => el.textContent.trim() === 'Hugeicons · Home');
  iconButtons.forEach(button => button.addEventListener('click', () => {
    iconButtons.forEach(other => {
      const active = other === button;
      other.setAttribute('aria-pressed', String(active));
      other.classList.toggle('bg-active-bg', active);
      other.classList.toggle('bg-surface', !active);
      other.classList.toggle('text-icon-active', active);
      other.classList.toggle('text-icon', !active);
      const svg = other.querySelector('svg');
      svg?.classList.toggle('text-icon-active', active);
      svg?.classList.toggle('text-icon', !active);
    });
    if (selectedLabel) selectedLabel.textContent = `${button.getAttribute('aria-label').replace('Hugeicons ', 'Hugeicons · ').replace('Solar Bold ', 'Solar Bold · ')}`;
  }));
}

const dashboard = $('[data-panel="Dashboard"]');
if (dashboard) {
  const navButtons = $$('nav button', dashboard);
  navButtons.forEach(button => button.addEventListener('click', () => {
    navButtons.forEach(other => {
      const active = other === button;
      other.classList.toggle('bg-hover-bg', active);
      other.classList.toggle('font-medium', active);
      other.classList.toggle('text-text-primary', active);
      other.classList.toggle('text-text-secondary', !active);
      const svg = other.querySelector('svg');
      svg?.classList.toggle('text-icon-active', active);
      svg?.classList.toggle('text-icon', !active);
    });
  }));
}

const book = $$('#static-previews h3').find(el => el.textContent === 'Order book')?.closest('.rounded-medium');
if (book) {
  const liveButton = $('button[aria-pressed]', book);
  let live = true;
  liveButton.addEventListener('click', () => {
    live = !live;
    liveButton.setAttribute('aria-pressed', String(live));
    liveButton.lastChild.textContent = live ? 'Live' : 'Paused';
    liveButton.firstElementChild.classList.toggle('bg-positive', live);
    liveButton.firstElementChild.classList.toggle('bg-text-muted', !live);
  });
  const rows = $$('.relative.grid.h-6.grid-cols-3', book);
  const askRows = rows.slice(0, 8).reverse();
  const bidRows = rows.slice(8);
  setInterval(() => {
    if (!live || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let totals = [];
    for (const side of [askRows, bidRows]) {
      let total = 0;
      side.forEach(row => {
        const values = $$('span.relative', row);
        const current = Number(values[1].textContent);
        const size = Math.max(.01, current * (.75 + Math.random() * .5));
        total += size;
        values[1].textContent = size.toFixed(4);
        values[2].textContent = total.toFixed(4);
      });
      totals.push(total);
    }
    const max = Math.max(...totals);
    for (const side of [askRows, bidRows]) side.forEach(row => {
      $('span.absolute', row).style.width = `${Number($$('span.relative', row)[2].textContent) / max * 100}%`;
    });
    const share = Math.round(totals[1] / (totals[0] + totals[1]) * 100);
    const ratio = $$('.flex.h-6.overflow-hidden > div', book);
    if (ratio.length === 2) {
      ratio[0].style.width = `${share}%`;
      ratio[0].textContent = `B ${share}%`;
      ratio[1].textContent = `${100 - share}% S`;
    }
  }, 1400);
}

let checksStarted = false;
async function runChecks() {
  checksStarted = true;
  const status = $('#check-status');
  if (!status || !window.runBrandChecks) return;
  status.textContent = 'Checking…';
  const container = status.parentElement;
  $$('.check-results', container).forEach(el => el.remove());
  try {
    const checks = await window.runBrandChecks();
    const failed = checks.filter(check => !check.ok).length;
    status.className = `mb-4 text-sm font-medium ${failed ? 'text-text-danger' : 'text-text-positive'}`;
    status.textContent = failed ? `${failed} of ${checks.length} checks failed` : `All ${checks.length} checks passed`;
    const grid = document.createElement('div');
    grid.className = 'check-results grid gap-4 lg:grid-cols-2';
    for (const group of [...new Set(checks.map(check => check.group))]) {
      const section = document.createElement('div');
      const title = document.createElement('p');
      title.className = 'mb-2 text-xs font-semibold uppercase tracking-wider text-text-secondary';
      title.textContent = group;
      const list = document.createElement('ul');
      list.className = 'divide-y rounded-default border';
      for (const check of checks.filter(check => check.group === group)) {
        const item = document.createElement('li');
        item.className = 'flex gap-2.5 px-3 py-2';
        const mark = document.createElement('span');
        mark.className = `inline-grid size-4 shrink-0 place-items-center rounded-full text-[10px] font-bold text-white ${check.ok ? 'bg-positive' : 'bg-danger'}`;
        mark.textContent = check.ok ? '✓' : '✕';
        mark.setAttribute('aria-label', check.ok ? 'pass' : 'fail');
        const details = document.createElement('div');
        details.className = 'min-w-0';
        const name = document.createElement('p');
        name.className = 'break-all font-mono text-xs';
        name.textContent = check.name;
        const text = document.createElement('p');
        text.className = `text-xs ${check.ok ? 'text-text-secondary' : 'text-text-danger'}`;
        text.textContent = check.detail;
        details.append(name, text);
        item.append(mark, details);
        list.append(item);
      }
      section.append(title, list);
      grid.append(section);
    }
    container.append(grid);
  } catch (error) {
    status.className = 'text-sm text-text-danger';
    status.textContent = `Checks could not complete: ${error.message}`;
  }
}
$('#rerun-checks')?.addEventListener('click', runChecks);

updateEditor();
applyTheme();
