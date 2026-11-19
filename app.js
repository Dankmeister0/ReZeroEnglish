const EXTRA_CHAPTERS_AFTER = {
  24: ["24.1", "24.2"],
  76: ["76.1", "76.16", "76.2", "76.3", "76.5", "76.7"],
  269: ["269.1"],
  497: ["497.1", "497.2", "497.3", "497.4", "497.5", "497.6", "497.7"],
};

const SPECIAL_STORIES = {
  "24.1": { title: "Emilia's Royal Capital Sightseeing Record", collection: "Side Stories", targetArc: 1 },
  "24.2": { title: "Ram's Refusal of Pickup Attempts", collection: "Side Stories", targetArc: 1 },
  "75": { collection: "One Day I", targetArc: 2, useChapterNumber: true },
  "76": { collection: "One Day I", targetArc: 2, useChapterNumber: true },
  "76.1": { title: "Rem Meets Subaru", collection: "Side Stories", targetArc: 2 },
  "76.16": { title: "Rem's Maiden Heart Is Super Complicated", collection: "Side Stories", targetArc: 2 },
  "76.2": { title: "Emilia's Starry Sky Classroom", collection: "Side Stories", targetArc: 2 },
  "76.3": { title: "Ram and the Night Study Session", collection: "Side Stories", targetArc: 2 },
  "76.5": { title: "Emilia's First Date", collection: "Side Stories", targetArc: 2 },
  "76.7": { title: "The Best Day of Rem's Life", collection: "Side Stories", targetArc: 2 },
  "269": { title: "The Butterfly Dream", collection: "Arc 3 IF Story", targetArc: 3 },
  "269.1": { title: "The Butterfly Dream (Original)", collection: "Arc 3 IF Story", targetArc: 3 },
  "308": { collection: "One Day II", targetArc: 4, useChapterNumber: true },
  "309": { collection: "One Day II", targetArc: 4, useChapterNumber: true },
  "310": { collection: "One Day II", targetArc: 4, useChapterNumber: true },
  "311": { collection: "One Day II", targetArc: 4, useChapterNumber: true },
  "312": { collection: "One Day II", targetArc: 4, useChapterNumber: true },
  "313": { collection: "One Day II", targetArc: 4, useChapterNumber: true },
  "314": { collection: "One Day II", targetArc: 4, useChapterNumber: true },
  "315": { collection: "One Day II", targetArc: 4, useChapterNumber: true },
  "316": { collection: "One Day II", targetArc: 4, useChapterNumber: true },
  "427": { title: "Repeating Life in an Alternate World from Zero", collection: "Arc 4 IF Story", targetArc: 4 },
  "434": { title: "Life in an Erroneous World from Zero", collection: "Arc 1 IF Story", targetArc: 1 },
  "443": { title: "Starting Life in Another World Drowning from Zero", collection: "Arc 2 IF Story", targetArc: 2 },
  "473": { title: "Patchwork Life in a Different World from Zero", collection: "Arc 6 IF Story", targetArc: 6 },
  "497.1": { title: "The Days Spent Waiting for You", collection: "Scorpion Tale", targetArc: 6 },
  "497.2": { title: "Memories of the Redhead", collection: "Scorpion Tale", targetArc: 6 },
  "497.3": { title: "Memories of Blondie", collection: "Scorpion Tale", targetArc: 6 },
  "497.4": { title: "Memories of Beard", collection: "Scorpion Tale", targetArc: 6 },
  "497.5": { title: "Memories of Kaka-sama", collection: "Scorpion Tale", targetArc: 6 },
  "497.6": { title: "Leilani Alnair", collection: "Scorpion Tale", targetArc: 6 },
  "497.7": { title: "The Days I Waited for You", collection: "Scorpion Tale", targetArc: 6 },
  "676": { title: "Iris and the King of Thorns (Part 1)", collection: "Side Stories", targetArc: 8 },
  "677": { title: "Iris and the King of Thorns (Part 2)", collection: "Side Stories", targetArc: 8 },
  "719": { title: "Life in a Different World Deceiving from Zero", collection: "Arc 7 IF Story", targetArc: 7 },
  "771": { title: "Devoting an Otherworldly Life, from Zero", collection: "Arc 9 IF Story", targetArc: 9 },
};

const SPECIAL_NAVIGATION_NAMES = {
  "24.1": "Arc 1 Side",
  "24.2": "Arc 1 Side",
  "76.1": "Arc 2 Side",
  "76.16": "Arc 2 Side",
  "76.2": "Arc 2 Side",
  "76.3": "Arc 2 Side",
  "76.5": "Arc 2 Side",
  "76.7": "Arc 2 Side",
  "269": "Re:Zero EX",
  "269.1": "Re:Zero EX",
  "427": "Re:Zero EX",
  "434": "Re:Zero EX",
  "443": "Re:Zero EX",
  "473": "Re:Zero EX",
  "497.1": "Scorpion Tale Prologue",
  "497.2": "Scorpion Tale Chapter 1",
  "497.3": "Scorpion Tale Chapter 2",
  "497.4": "Scorpion Tale Chapter 3",
  "497.5": "Scorpion Tale Chapter 4",
  "497.6": "Scorpion Tale Chapter 5",
  "497.7": "Scorpion Tale Epilogue",
  "676": "Re:Zero EX",
  "677": "Re:Zero EX",
  "719": "Re:Zero EX",
  "771": "Re:Zero EX",
};

const chapterIds = Array.from({ length: 802 }, (_, index) => String(index + 1)).flatMap((id) => [
  id,
  ...(EXTRA_CHAPTERS_AFTER[id] || []),
]);

const arcs = [
  { number: 1, name: "The Capital", start: "1", end: "24.2" },
  { number: 2, name: "The Roswaal Manor", start: "25", end: "76.7" },
  { number: 3, name: "Return to the Capital", start: "77", end: "166" },
  { number: 4, name: "The Everlasting Contract", start: "167", end: "316" },
  { number: 5, name: "Stars That Engrave History", start: "317", end: "402" },
  { number: 6, name: "The Hall of Memories", start: "403", end: "497.7" },
  { number: 7, name: "Land of Wolves", start: "498", end: "616" },
  { number: 8, name: "Vincent Vollachia", start: "617", end: "694" },
  { number: 9, name: "The Light of a Nameless Star", start: "695", end: "757" },
  { number: 10, name: "The Dragon Kingdom of Lugunica", start: "758", end: "802" },
];

function specialCollectionsForArc(arcNumber) {
  const stories = Object.keys(SPECIAL_STORIES).filter((id) => SPECIAL_STORIES[id].targetArc === arcNumber);
  const collections = stories.reduce((grouped, id) => {
    const collection = SPECIAL_STORIES[id].collection;
    (grouped[collection] ||= []).push(id);
    return grouped;
  }, {});
  return Object.entries(collections).sort(([, storiesA], [, storiesB]) => (
    Number(Boolean(SPECIAL_STORIES[storiesB[0]].useChapterNumber))
    - Number(Boolean(SPECIAL_STORIES[storiesA[0]].useChapterNumber))
  ));
}

function navigatorChaptersForArc(arc) {
  const regularChapters = chapterIds
    .slice(chapterIds.indexOf(arc.start), chapterIds.indexOf(arc.end) + 1)
    .filter((id) => !SPECIAL_STORIES[id]);
  const specialChapters = specialCollectionsForArc(arc.number).flatMap(([, stories]) => stories);
  return [...regularChapters, ...specialChapters];
}

const navigatorChapterIds = arcs.flatMap(navigatorChaptersForArc);
const progressKey = "rezero-reader-progress-v1";
const preferencesKey = "rezero-reader-preferences-v1";
const chapterIndex = new Map(chapterIds.map((id, index) => [id, index]));
const navigatorChapterIndex = new Map(navigatorChapterIds.map((id, index) => [id, index]));
const els = {
  body: document.body,
  title: document.title,
  panel: document.querySelector("#libraryPanel"),
  openLibrary: document.querySelector("#openLibrary"),
  closeLibrary: document.querySelector("#closeLibrary"),
  panelScrim: document.querySelector("#panelScrim"),
  chapterList: document.querySelector("#chapterList"),
  chapterSearch: document.querySelector("#chapterSearch"),
  chapterIndex: document.querySelector("#chapterIndex"),
  arcLabel: document.querySelector("#arcLabel"),
  chapterTitle: document.querySelector("#chapterTitle"),
  chapterSubtitle: document.querySelector("#chapterSubtitle"),
  chapterContent: document.querySelector("#chapterContent"),
  previous: document.querySelector("#previousChapter"),
  next: document.querySelector("#nextChapter"),
  previousLabel: document.querySelector("#previousLabel"),
  nextLabel: document.querySelector("#nextLabel"),
  pageProgress: document.querySelector("#pageProgress"),
  libraryProgress: document.querySelector("#libraryProgress"),
  libraryPosition: document.querySelector("#libraryPosition"),
  libraryPercentage: document.querySelector("#libraryPercentage"),
  saveButton: document.querySelector("#saveButton"),
  saveStatus: document.querySelector("#saveStatus"),
  decreaseText: document.querySelector("#decreaseText"),
  increaseText: document.querySelector("#increaseText"),
  themeToggle: document.querySelector("#themeToggle"),
  backToTop: document.querySelector("#backToTop"),
  toast: document.querySelector("#toast"),
};

let activeId = "1";
let activeTitle = "";
let restoreRatio = 0;
let scrollSaveTimer;
let toastTimer;
let isInitialLoad = true;
let loadRequest = 0;

function getSavedProgress() {
  try {
    return JSON.parse(localStorage.getItem(progressKey)) || null;
  } catch {
    return null;
  }
}

function getPreferences() {
  try {
    return JSON.parse(localStorage.getItem(preferencesKey)) || {};
  } catch {
    return {};
  }
}

function escapeHtml(value) {
  return value.replace(/[&<>"]/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
  })[character]);
}

function formatInline(value) {
  return escapeHtml(value)
    .replace(/\*([^*\n]+)\*/g, "<em>$1</em>")
    .replace(/—{3,}/g, "<span aria-hidden=\"true\">— — —</span>");
}

function splitHeading(firstLine, id) {
  const match = firstLine.match(/^(.*):\s*[“\"](.+)[”\"]\s*$/);
  if (match) {
    const sourceSection = match[1].trim();
    const arcMatch = sourceSection.match(/^Arc\s+(\d+)\s+(.*)$/i);
    return {
      arc: arcMatch ? `ARC ${arcMatch[1]}` : `CHAPTER ${id}`,
      designation: arcMatch ? arcMatch[2] : sourceSection,
      title: match[2],
    };
  }
  const looseMatch = firstLine.match(/^Arc\s+(\d+)\s+(.*)$/i);
  return {
    arc: looseMatch ? `ARC ${looseMatch[1]}` : `CHAPTER ${id}`,
    designation: looseMatch ? `Chapter ${id}` : "",
    title: looseMatch ? looseMatch[2] : firstLine,
  };
}

function specialSectionName(sourceSection, collection) {
  if (!sourceSection) return "";
  const escapedCollection = collection.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return sourceSection.replace(new RegExp(`^${escapedCollection}\\s*`, "i"), "").trim();
}

function arcForChapter(id) {
  const position = chapterIndex.get(id);
  return arcs.find((arc) => position >= chapterIndex.get(arc.start) && position <= chapterIndex.get(arc.end));
}

function navigationArcForChapter(id) {
  return SPECIAL_STORIES[id]?.targetArc || arcForChapter(id)?.number;
}

function renderContent(text) {
  const paragraphs = text.trim().split(/\r?\n\s*\r?\n/).filter(Boolean);
  if (!paragraphs.length) return "<p>This chapter is empty.</p>";
  return paragraphs.map((paragraph) => {
    const compact = paragraph.trim();
    if (/^[*—\-\s]{3,}$/.test(compact)) return '<div class="scene-break" aria-label="Scene break">✦ ✦ ✦</div>';
    return `<p>${formatInline(compact).replace(/\r?\n/g, "<br>")}</p>`;
  }).join("");
}

function relativeTime(date) {
  if (!date) return "";
  const minutes = Math.max(0, Math.round((Date.now() - date) / 60000));
  if (minutes < 1) return "Just saved";
  if (minutes === 1) return "Saved a minute ago";
  if (minutes < 60) return `Saved ${minutes} minutes ago`;
  return "Your place is saved automatically.";
}

function updateSavedUi(progress = getSavedProgress()) {
  const position = progress && chapterIndex.has(progress.chapterId) ? chapterIndex.get(progress.chapterId) + 1 : 0;
  const percent = position ? Math.round((position / chapterIds.length) * 100) : 0;
  els.libraryPosition.textContent = position ? `Reading chapter ${progress.chapterId}` : "Start reading";
  els.libraryPercentage.textContent = `${percent}%`;
  els.libraryProgress.style.width = `${percent}%`;
  els.saveStatus.textContent = progress ? relativeTime(progress.updatedAt) : "Your place is saved automatically.";
}

function saveProgress(showFeedback = false) {
  if (!chapterIndex.has(activeId)) return;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const scrollRatio = maxScroll > 0 ? Math.max(0, Math.min(1, window.scrollY / maxScroll)) : 0;
  const progress = { chapterId: activeId, scrollRatio, updatedAt: Date.now() };
  localStorage.setItem(progressKey, JSON.stringify(progress));
  updateSavedUi(progress);
  els.saveButton.classList.add("saved");
  if (showFeedback) showToast(`Saved · Chapter ${activeId}`);
}

function showToast(message) {
  window.clearTimeout(toastTimer);
  els.toast.textContent = message;
  els.toast.classList.add("visible");
  toastTimer = window.setTimeout(() => els.toast.classList.remove("visible"), 2400);
}

function setActiveButton() {
  document.querySelectorAll(".chapter-link").forEach((button) => {
    const selected = button.dataset.chapter === activeId;
    button.classList.toggle("active", selected);
    button.setAttribute("aria-current", selected ? "page" : "false");
  });
  const group = document.querySelector(`.arc-group[data-arc="${navigationArcForChapter(activeId)}"]`);
  if (group && !els.chapterSearch.value.trim()) group.dataset.open = "true";
}

function renderLibrary() {
  els.chapterList.innerHTML = arcs.map((arc) => {
    const arcChapters = chapterIds.slice(chapterIndex.get(arc.start), chapterIndex.get(arc.end) + 1);
    const numberedChapters = arcChapters.filter((id) => !SPECIAL_STORIES[id]);
    const sideStoryCollections = specialCollectionsForArc(arc.number);
    const isOpen = navigationArcForChapter(activeId) === arc.number;
    const chapterButton = (id, sideStory = false) => {
      const specialStory = SPECIAL_STORIES[id];
      const label = sideStory && !specialStory.useChapterNumber ? specialStory.title : `Ch. ${id}`;
      const searchText = sideStory ? `${specialStory.collection} ${id} ${specialStory.title || ""}` : `chapter ${id}`;
      return `<button class="chapter-link${sideStory ? " side-story" : ""}${specialStory?.useChapterNumber ? " in-order-chapter" : ""}${id === activeId ? " active" : ""}" type="button" data-chapter="${id}" data-search="${escapeHtml(searchText)}" aria-current="${id === activeId ? "page" : "false"}" title="${escapeHtml(label)}">${escapeHtml(label)}</button>`;
    };
    return `
      <section class="arc-group" data-arc="${arc.number}" data-open="${isOpen}">
        <button class="arc-summary" type="button" aria-expanded="${isOpen}">
          <span><b>ARC ${arc.number}</b>${arc.name}</span>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
        </button>
        <div class="arc-chapters">
          <div class="numbered-chapters">${numberedChapters.map((id) => chapterButton(id)).join("")}</div>
          ${sideStoryCollections.map(([collection, stories]) => `
            <section class="side-stories${SPECIAL_STORIES[stories[0]].useChapterNumber ? " in-order-section" : ""}" aria-label="${escapeHtml(collection)}">
              <p class="side-stories-label">${escapeHtml(collection)}</p>
              <div class="side-story-chapters">${stories.map((id) => chapterButton(id, true)).join("")}</div>
            </section>`).join("")}
        </div>
      </section>`;
  }).join("");

  els.chapterList.querySelectorAll(".arc-summary").forEach((button) => {
    button.addEventListener("click", () => {
      const group = button.closest(".arc-group");
      const open = group.dataset.open !== "true";
      group.dataset.open = String(open);
      button.setAttribute("aria-expanded", String(open));
    });
  });
  els.chapterList.querySelectorAll(".chapter-link").forEach((button) => {
    button.addEventListener("click", () => loadChapter(button.dataset.chapter));
  });
}

function updateNav() {
  const position = navigatorChapterIndex.get(activeId);
  const previousId = navigatorChapterIds[position - 1];
  const nextId = navigatorChapterIds[position + 1];
  els.previous.disabled = !previousId;
  els.next.disabled = !nextId;
  els.previousLabel.textContent = previousId ? navigationLabel(previousId) : "Beginning";
  els.nextLabel.textContent = nextId ? navigationLabel(nextId) : "The end…";
}

function navigationLabel(id) {
  const specialStory = SPECIAL_STORIES[id];
  if (specialStory && !specialStory.useChapterNumber) {
    return SPECIAL_NAVIGATION_NAMES[id] || specialStory.collection;
  }
  return `Chapter ${id}`;
}

async function loadChapter(id, options = {}) {
  if (!chapterIndex.has(id)) return;
  const { fromHistory = false, restore = 0 } = options;
  if (!isInitialLoad && id !== activeId) saveProgress();
  window.clearTimeout(scrollSaveTimer);
  const requestId = ++loadRequest;
  activeId = id;
  restoreRatio = restore;
  els.chapterContent.setAttribute("aria-busy", "true");
  els.chapterContent.innerHTML = '<div class="reader-loading"><span></span><p>Opening the book…</p></div>';
  setActiveButton();
  updateNav();
  closeLibrary();

  if (!fromHistory) {
    const url = new URL(window.location.href);
    url.searchParams.set("chapter", id);
    window.history.pushState({ chapter: id }, "", url);
  }

  try {
    const response = await fetch(`chapters/${encodeURIComponent(id)}.txt`);
    if (!response.ok) throw new Error(`Chapter ${id} could not be found.`);
    const rawText = (await response.text()).replace(/^\uFEFF/, "");
    if (requestId !== loadRequest) return;
    const lines = rawText.split(/\r?\n/);
    const heading = splitHeading(lines.shift().trim(), id);
    const fallbackArc = arcForChapter(id);
    const specialStory = SPECIAL_STORIES[id];
    const headerSection = specialStory ? specialStory.collection : heading.arc || `ARC ${fallbackArc?.number || "?"}`;
    const headerSubtitle = specialStory
      ? specialSectionName(heading.designation, specialStory.collection)
      : heading.designation;
    activeTitle = heading.title || `Chapter ${id}`;
    els.arcLabel.textContent = headerSection;
    els.chapterTitle.textContent = heading.title || `Chapter ${id}`;
    els.chapterSubtitle.textContent = headerSubtitle;
    els.chapterSubtitle.hidden = !headerSubtitle;
    els.chapterIndex.textContent = `CHAPTER ${id} · ${chapterIndex.get(id) + 1} OF ${chapterIds.length}`;
    els.chapterContent.innerHTML = renderContent(lines.join("\n"));
    els.chapterContent.setAttribute("aria-busy", "false");
    document.title = `${activeTitle} · re:read zero`;
    els.saveButton.classList.remove("saved");
    updateNav();

    requestAnimationFrame(() => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const target = restoreRatio && maxScroll > 0 ? maxScroll * restoreRatio : 0;
      window.scrollTo({ top: target, behavior: "auto" });
      updatePageProgress();
      if (isInitialLoad && restoreRatio > 0.01) showToast(`Welcome back · Chapter ${id}`);
      isInitialLoad = false;
    });
  } catch (error) {
    if (requestId !== loadRequest) return;
    els.chapterContent.setAttribute("aria-busy", "false");
    els.chapterContent.innerHTML = `<div class="reader-loading"><p>We couldn’t open Chapter ${escapeHtml(id)}.<br><br><small>Serve this folder through a local web server, then try again.</small></p></div>`;
    console.error(error);
  }
}

function updatePageProgress() {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const percent = maxScroll > 0 ? Math.max(0, Math.min(100, (window.scrollY / maxScroll) * 100)) : 0;
  els.pageProgress.style.width = `${percent}%`;
}

function openLibrary() {
  els.body.classList.add("library-open");
  els.openLibrary.setAttribute("aria-expanded", "true");
}

function closeLibrary() {
  els.body.classList.remove("library-open");
  els.openLibrary.setAttribute("aria-expanded", "false");
}

function applyPreferences() {
  const preferences = getPreferences();
  const fontSize = Math.max(0.94, Math.min(1.46, preferences.fontSize || 1.16));
  document.documentElement.style.setProperty("--reader-size", `${fontSize}rem`);
  document.documentElement.dataset.theme = preferences.theme || "dark";
}

function changeFontSize(delta) {
  const preferences = getPreferences();
  const nextSize = Math.max(0.94, Math.min(1.46, Number((preferences.fontSize || 1.16) + delta).toFixed(2)));
  preferences.fontSize = nextSize;
  localStorage.setItem(preferencesKey, JSON.stringify(preferences));
  applyPreferences();
  showToast(`Text size ${Math.round((nextSize / 1.16) * 100)}%`);
}

function toggleTheme() {
  const preferences = getPreferences();
  preferences.theme = (preferences.theme || "dark") === "dark" ? "light" : "dark";
  localStorage.setItem(preferencesKey, JSON.stringify(preferences));
  applyPreferences();
  showToast(`${preferences.theme === "light" ? "Paper" : "Night"} theme`);
}

function searchChapters() {
  const query = els.chapterSearch.value.trim().toLowerCase().replace(/^chapter\s*/i, "").replace(/^ch\.??\s*/i, "");
  document.querySelectorAll(".arc-group").forEach((group) => {
    const matches = [...group.querySelectorAll(".chapter-link")].filter((button) => {
      const match = !query || button.dataset.search.includes(query);
      button.classList.toggle("search-hidden", !match);
      return match;
    });
    group.classList.toggle("search-hidden", Boolean(query && !matches.length));
    group.classList.toggle("search-match", Boolean(query && matches.length));
  });
}

function initialize() {
  applyPreferences();
  const saved = getSavedProgress();
  const requestedId = new URLSearchParams(window.location.search).get("chapter");
  const initialId = chapterIndex.has(requestedId) ? requestedId : chapterIndex.has(saved?.chapterId) ? saved.chapterId : "1";
  const shouldRestore = !requestedId && saved?.chapterId === initialId ? Number(saved.scrollRatio) || 0 : 0;
  activeId = initialId;
  renderLibrary();
  updateSavedUi(saved);
  loadChapter(initialId, { fromHistory: true, restore: shouldRestore });
}

els.openLibrary.addEventListener("click", openLibrary);
els.closeLibrary.addEventListener("click", closeLibrary);
els.panelScrim.addEventListener("click", closeLibrary);
els.previous.addEventListener("click", () => loadChapter(navigatorChapterIds[navigatorChapterIndex.get(activeId) - 1]));
els.next.addEventListener("click", () => loadChapter(navigatorChapterIds[navigatorChapterIndex.get(activeId) + 1]));
els.saveButton.addEventListener("click", () => saveProgress(true));
els.decreaseText.addEventListener("click", () => changeFontSize(-0.06));
els.increaseText.addEventListener("click", () => changeFontSize(0.06));
els.themeToggle.addEventListener("click", toggleTheme);
els.backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
els.chapterSearch.addEventListener("input", searchChapters);

window.addEventListener("scroll", () => {
  updatePageProgress();
  window.clearTimeout(scrollSaveTimer);
  scrollSaveTimer = window.setTimeout(() => saveProgress(), 450);
}, { passive: true });
window.addEventListener("pagehide", () => saveProgress());
window.addEventListener("popstate", () => {
  const id = new URLSearchParams(window.location.search).get("chapter");
  if (chapterIndex.has(id) && id !== activeId) loadChapter(id, { fromHistory: true });
});
window.addEventListener("keydown", (event) => {
  if (event.target.matches("input, textarea, select")) return;
  if (event.key === "Escape") closeLibrary();
  if (event.key === "ArrowLeft" && !els.previous.disabled) loadChapter(navigatorChapterIds[navigatorChapterIndex.get(activeId) - 1]);
  if (event.key === "ArrowRight" && !els.next.disabled) loadChapter(navigatorChapterIds[navigatorChapterIndex.get(activeId) + 1]);
});

initialize();
