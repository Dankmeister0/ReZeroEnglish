const EXTRA_CHAPTERS_AFTER = {
  24: ["24.1", "24.2"],
  76: ["76.1", "76.16", "76.2", "76.3", "76.5", "76.7"],
  269: ["269.1"],
  497: ["497.1", "497.2", "497.3", "497.4", "497.5", "497.6", "497.7"],
};

const SPECIAL_STORIES = {
  "24.1": { title: "Emilia's Royal Capital Sightseeing Record", collection: "Side Stories", targetArc: 1 },
  "24.2": { title: "Ram's Refusal of Pickup Attempts", collection: "Side Stories", targetArc: 1 },
  "75": { collection: "One Day I", targetArc: 2, partLabel: "Part 1" },
  "76": { collection: "One Day I", targetArc: 2, partLabel: "Part 2" },
  "76.1": { title: "Rem Meets Subaru", collection: "Side Stories", targetArc: 2 },
  "76.16": { title: "Rem's Maiden Heart Is Super Complicated", collection: "Side Stories", targetArc: 2 },
  "76.2": { title: "Emilia's Starry Sky Classroom", collection: "Side Stories", targetArc: 2 },
  "76.3": { title: "Ram and the Night Study Session", collection: "Side Stories", targetArc: 2 },
  "76.5": { title: "Emilia's First Date", collection: "Side Stories", targetArc: 2 },
  "76.7": { title: "The Best Day of Rem's Life", collection: "Side Stories", targetArc: 2 },
  "269": { title: "The Butterfly Dream", collection: "Arc 3 IF Story", targetArc: 3 },
  "269.1": { title: "The Butterfly Dream (Original)", collection: "Arc 3 IF Story", targetArc: 3 },
  "308": { collection: "One Day II", targetArc: 4, partLabel: "Part 1" },
  "309": { collection: "One Day II", targetArc: 4, partLabel: "Part 2" },
  "310": { collection: "One Day II", targetArc: 4, partLabel: "Part 3" },
  "311": { collection: "One Day II", targetArc: 4, partLabel: "Part 4" },
  "312": { collection: "One Day II", targetArc: 4, partLabel: "Part 5" },
  "313": { collection: "One Day II", targetArc: 4, partLabel: "Part 6" },
  "314": { collection: "One Day II", targetArc: 4, partLabel: "Finale" },
  "315": { collection: "One Day II", targetArc: 4, partLabel: "Special 1" },
  "316": { collection: "One Day II", targetArc: 4, partLabel: "Special 2" },
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

// These entries appear in the arc sequence without advancing its chapter number.
const INSERTED_CHAPTER_LABELS = {
  "1": "Prologue",
  "24": "Interlude",
  "74": "Interlude",
  "102": "Interlude",
  "162": "Interlude",
  "163": "Interlude",
  "164": "Interlude",
  "165": "Interlude",
  "166": "Extra",
  "238": "Interlude",
  "247": "Interlude",
  "293": "Ch. 123B",
  "300": "Ch. 124B",
  "301": "Ch. 125B",
  "302": "Ch. 126B",
  "303": "Ch. 127B",
  "305": "Interlude",
  "306": "Interlude",
  "307": "Addendum",
  "372": "Re:Zero EX",
  "398": "Re:Zero EX",
  "400": "Interlude",
  "401": "Interlude",
  "402": "Interlude",
  "486": "Re:Zero EX",
  "511": "Re:Zero EX",
  "556": "Re:Zero EX",
  "560": "Ch. 54B",
  "561": "Ch. 55B",
  "562": "Ch. 56B",
  "563": "Ch. 57B",
  "564": "Ch. 58B",
  "565": "Ch. 59B",
  "616": "Re:Zero EX",
  "660": "Interlude",
  "694": "Finale",
  "701": "Interlude",
  "756": "Interlude",
  "757": "Finale",
  "765": "Interlude",
  "788": "Interlude",
};

const NUMBERED_CHAPTER_LABEL_OVERRIDES = {
  "292": "Ch. 123A",
};

const chapterIds = Array.from({ length: 804 }, (_, index) => String(index + 1)).flatMap((id) => [
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
  { number: 10, name: "The Dragon Kingdom of Lugunica", start: "758", end: "804" },
];

const chapterIndex = new Map(chapterIds.map((id, index) => [id, index]));

function specialCollectionsForArc(arcNumber) {
  const stories = Object.keys(SPECIAL_STORIES).filter((id) => SPECIAL_STORIES[id].targetArc === arcNumber);
  const collections = stories.reduce((grouped, id) => {
    const collection = SPECIAL_STORIES[id].collection;
    (grouped[collection] ||= []).push(id);
    return grouped;
  }, {});
  return Object.entries(collections).sort(([, storiesA], [, storiesB]) => (
    Number(Boolean(SPECIAL_STORIES[storiesB[0]].partLabel))
    - Number(Boolean(SPECIAL_STORIES[storiesA[0]].partLabel))
  ));
}

function regularChaptersForArc(arc) {
  return chapterIds
    .slice(chapterIndex.get(arc.start), chapterIndex.get(arc.end) + 1)
    .filter((id) => !SPECIAL_STORIES[id]);
}

function navigatorChaptersForArc(arc) {
  const specialChapters = specialCollectionsForArc(arc.number).flatMap(([, stories]) => stories);
  return [...regularChaptersForArc(arc), ...specialChapters];
}

const regularChapterLabels = new Map(arcs.flatMap((arc) => {
  let chapterNumber = 0;
  return regularChaptersForArc(arc).map((id) => {
    const insertedLabel = INSERTED_CHAPTER_LABELS[id];
    if (insertedLabel) return [id, insertedLabel];
    chapterNumber += 1;
    return [id, NUMBERED_CHAPTER_LABEL_OVERRIDES[id] || `Ch. ${chapterNumber}`];
  });
}));

const navigatorChapterIds = arcs.flatMap(navigatorChaptersForArc);
const READ_THRESHOLD = 0.95;
const CHAPTER_STATUSES = {
  started: { keyPrefix: "rezero-reader-opened-v1:", icon: "◐", label: "in progress" },
  read: { keyPrefix: "rezero-reader-read-v1:", icon: "✓", label: "read" },
};
const progressKey = "rezero-reader-progress-v1";
const preferencesKey = "rezero-reader-preferences-v1";
const navigatorChapterIndex = new Map(navigatorChapterIds.map((id, index) => [id, index]));
const chapterStatuses = getChapterStatuses();
const els = {
  body: document.body,
  title: document.title,
  panel: document.querySelector("#libraryPanel"),
  openLibrary: document.querySelector("#openLibrary"),
  closeLibrary: document.querySelector("#closeLibrary"),
  panelScrim: document.querySelector("#panelScrim"),
  chapterList: document.querySelector("#chapterList"),
  libraryContextMenu: document.querySelector("#libraryContextMenu"),
  markLibraryRead: document.querySelector("#markLibraryRead"),
  markLibraryUnread: document.querySelector("#markLibraryUnread"),
  chapterSearch: document.querySelector("#chapterSearch"),
  arcLabel: document.querySelector("#arcLabel"),
  chapterTitle: document.querySelector("#chapterTitle"),
  chapterSubtitle: document.querySelector("#chapterSubtitle"),
  chapterContent: document.querySelector("#chapterContent"),
  previous: document.querySelector("#previousChapter"),
  next: document.querySelector("#nextChapter"),
  previousLabel: document.querySelector("#previousLabel"),
  nextLabel: document.querySelector("#nextLabel"),
  pageProgress: document.querySelector("#pageProgress"),
  saveStatus: document.querySelector("#saveStatus"),
  decreaseText: document.querySelector("#decreaseText"),
  increaseText: document.querySelector("#increaseText"),
  themeToggle: document.querySelector("#themeToggle"),
  backToTop: document.querySelector("#backToTop"),
  toast: document.querySelector("#toast"),
};

let activeId = "1";
let activeTitle = "";
let chapterReady = false;
let lastSavedProgress;
let scrollSaveTimer;
let toastTimer;
let loadRequest = 0;
let resumeUnreadOnLoad = false;

function getSavedProgress() {
  try {
    return JSON.parse(localStorage.getItem(progressKey)) || null;
  } catch {
    return null;
  }
}

function getChapterStatuses() {
  const statuses = new Map();
  try {
    for (const id of chapterIds) {
      const readStatus = localStorage.getItem(`${CHAPTER_STATUSES.read.keyPrefix}${id}`);
      if (readStatus === "1") statuses.set(id, "read");
      else if (readStatus === "unread") statuses.set(id, "unread");
      else if (localStorage.getItem(`${CHAPTER_STATUSES.started.keyPrefix}${id}`) === "1") statuses.set(id, "started");
    }
  } catch {
    // The reader can track status for the current session when storage is unavailable.
  }
  return statuses;
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

function updateSavedUi(progress) {
  els.saveStatus.textContent = progress ? relativeTime(progress.updatedAt) : "Your place is saved automatically.";
}

function getScrollRatio() {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  return maxScroll > 0 ? Math.max(0, Math.min(1, window.scrollY / maxScroll)) : 0;
}

function chapterStatusMarkup(status) {
  if (!CHAPTER_STATUSES[status]) return "";
  const { icon, label } = CHAPTER_STATUSES[status];
  return `<span class="chapter-status" data-status="${status}"><span aria-hidden="true">${icon}</span><span class="sr-only"> (${label})</span></span>`;
}

function updateChapterStatus(id, scrollRatio) {
  const status = chapterStatuses.get(id);
  if (status === "read" || status === "unread") return;
  setChapterStatus(id, scrollRatio >= READ_THRESHOLD ? "read" : "started");
}

function setChapterStatus(id, status) {
  const previous = chapterStatuses.get(id);
  if (previous === status) return;
  chapterStatuses.set(id, status);
  const button = els.chapterList.querySelector(`.chapter-link[data-chapter="${id}"]`);
  button?.querySelector(".chapter-status")?.remove();
  const markup = chapterStatusMarkup(status);
  if (markup) button?.insertAdjacentHTML("beforeend", markup);
  try {
    const readKey = `${CHAPTER_STATUSES.read.keyPrefix}${id}`;
    if (status === "started") {
      localStorage.setItem(`${CHAPTER_STATUSES.started.keyPrefix}${id}`, "1");
      if (previous === "unread") localStorage.removeItem(readKey);
    } else {
      // An explicit unread value takes precedence over earlier opened status.
      localStorage.setItem(readKey, status === "read" ? "1" : "unread");
    }
  } catch {
    // Keep the marker visible for this session if storage is unavailable.
  }
}

function saveProgress() {
  if (!chapterReady) return;
  const scrollRatio = getScrollRatio();
  updateChapterStatus(activeId, scrollRatio);
  if (lastSavedProgress?.chapterId === activeId && lastSavedProgress.scrollRatio === scrollRatio) return;
  const progress = { chapterId: activeId, scrollRatio, updatedAt: Date.now() };
  try {
    localStorage.setItem(progressKey, JSON.stringify(progress));
  } catch {
    return;
  }
  lastSavedProgress = progress;
  updateSavedUi(progress);
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
    const regularChapters = regularChaptersForArc(arc);
    const sideStoryCollections = specialCollectionsForArc(arc.number);
    const isOpen = navigationArcForChapter(activeId) === arc.number;
    const chapterButton = (id) => {
      const specialStory = SPECIAL_STORIES[id];
      const label = specialStory?.partLabel || specialStory?.title || regularChapterLabels.get(id);
      const searchText = [specialStory?.collection, label, id].filter(Boolean).join(" ").toLowerCase();
      const status = chapterStatuses.get(id);
      return `<button class="chapter-link${specialStory ? " side-story" : ""}${specialStory?.partLabel ? " in-order-chapter" : ""}${id === activeId ? " active" : ""}" type="button" data-chapter="${id}" data-search="${escapeHtml(searchText)}" aria-current="${id === activeId ? "page" : "false"}" title="${escapeHtml(label)}"><span class="chapter-link-label">${escapeHtml(label)}</span>${chapterStatusMarkup(status)}</button>`;
    };
    return `
      <section class="arc-group" data-arc="${arc.number}" data-open="${isOpen}">
        <button class="arc-summary" type="button" aria-expanded="${isOpen}">
          <span><b>ARC ${arc.number}</b>${arc.name}</span>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
        </button>
        <div class="arc-chapters">
          <div class="numbered-chapters">${regularChapters.map(chapterButton).join("")}</div>
          ${sideStoryCollections.map(([collection, stories]) => `
            <section class="side-stories${SPECIAL_STORIES[stories[0]].partLabel ? " in-order-section" : ""}" aria-label="${escapeHtml(collection)}">
              <p class="side-stories-label">${escapeHtml(collection)}</p>
              <div class="side-story-chapters">${stories.map(chapterButton).join("")}</div>
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

function openLibraryContextMenu(event) {
  const target = event.target.closest(".chapter-link, .arc-summary");
  const menu = els.libraryContextMenu;
  if (!target || !menu.showPopover) return;
  event.preventDefault();

  const label = target.dataset.chapter ? "Mark" : "Mark all";
  els.markLibraryRead.textContent = `${label} as read`;
  els.markLibraryUnread.textContent = `${label} as unread`;
  els.markLibraryRead.onclick = () => markLibraryEntryStatus(target, "read");
  els.markLibraryUnread.onclick = () => markLibraryEntryStatus(target, "unread");
  menu.showPopover();

  const { left, bottom } = target.getBoundingClientRect();
  const { clientWidth, clientHeight } = document.documentElement;
  const edgePadding = 8;
  const x = Math.min(event.clientX ?? left, clientWidth - menu.offsetWidth - edgePadding);
  const y = Math.min(event.clientY ?? bottom, clientHeight - menu.offsetHeight - edgePadding);
  menu.style.left = `${Math.max(edgePadding, x)}px`;
  menu.style.top = `${Math.max(edgePadding, y)}px`;
  els.markLibraryRead.focus({ preventScroll: true });
}

function closeLibraryContextMenu() {
  els.libraryContextMenu.hidePopover?.();
}

function markLibraryEntryStatus(target, status) {
  const chapterId = target.dataset.chapter;
  const chapters = chapterId ? [target] : target.closest(".arc-group").querySelectorAll(".chapter-link");
  for (const chapter of chapters) {
    const id = chapter.dataset.chapter;
    if (id === activeId) resumeUnreadOnLoad = false;
    setChapterStatus(id, status);
  }
  closeLibraryContextMenu();
  target.focus({ preventScroll: true });
  showToast(`${chapterId ? "Chapter" : "Arc"} marked as ${status}`);
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
  if (specialStory) {
    return specialStory.partLabel || SPECIAL_NAVIGATION_NAMES[id] || specialStory.collection;
  }
  return regularChapterLabels.get(id);
}

async function loadChapter(id, options = {}) {
  if (!chapterIndex.has(id)) return;
  const { fromHistory = false, restore = 0, initialLoad = false } = options;
  if (id !== activeId) saveProgress();
  window.clearTimeout(scrollSaveTimer);
  const requestId = ++loadRequest;
  resumeUnreadOnLoad = !initialLoad && chapterStatuses.get(id) === "unread";
  chapterReady = false;
  activeId = id;
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
    els.chapterContent.innerHTML = renderContent(lines.join("\n"));
    els.chapterContent.setAttribute("aria-busy", "false");
    document.title = `${activeTitle} · re:read zero`;
    updateNav();

    requestAnimationFrame(() => {
      if (requestId !== loadRequest) return;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const target = restore && maxScroll > 0 ? maxScroll * restore : 0;
      window.scrollTo({ top: target, behavior: "instant" });
      if (resumeUnreadOnLoad) setChapterStatus(id, "started");
      chapterReady = true;
      updatePageProgress();
      saveProgress();
      if (restore > 0.01) showToast(`Welcome back · Chapter ${id}`);
    });
  } catch (error) {
    if (requestId !== loadRequest) return;
    els.chapterContent.setAttribute("aria-busy", "false");
    els.chapterContent.innerHTML = `<div class="reader-loading"><p>We couldn’t open Chapter ${escapeHtml(id)}.<br><br><small>Serve this folder through a local web server, then try again.</small></p></div>`;
    console.error(error);
  }
}

function updatePageProgress(scrollRatio = getScrollRatio()) {
  els.pageProgress.style.width = `${scrollRatio * 100}%`;
}

function openLibrary() {
  els.body.classList.add("library-open");
  els.openLibrary.setAttribute("aria-expanded", "true");
}

function closeLibrary() {
  closeLibraryContextMenu();
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
  const query = els.chapterSearch.value.trim().toLowerCase().replace(/^(?:chapter|ch\.?)\s*(?=\d)/, "");
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
  const savedId = chapterIndex.has(saved?.chapterId) ? saved.chapterId : null;
  const savedRatio = savedId ? Math.max(0, Math.min(1, Number(saved.scrollRatio) || 0)) : 0;
  const initialId = chapterIndex.has(requestedId) ? requestedId : savedId || "1";
  activeId = initialId;
  window.history.scrollRestoration = "manual";
  window.history.replaceState({ chapter: initialId }, "");
  renderLibrary();
  if (savedId) updateChapterStatus(savedId, savedRatio);
  updateSavedUi(saved);
  loadChapter(initialId, { fromHistory: true, restore: initialId === savedId ? savedRatio : 0, initialLoad: true });
}

els.openLibrary.addEventListener("click", openLibrary);
els.closeLibrary.addEventListener("click", closeLibrary);
els.panelScrim.addEventListener("click", closeLibrary);
els.previous.addEventListener("click", () => loadChapter(navigatorChapterIds[navigatorChapterIndex.get(activeId) - 1]));
els.next.addEventListener("click", () => loadChapter(navigatorChapterIds[navigatorChapterIndex.get(activeId) + 1]));
els.decreaseText.addEventListener("click", () => changeFontSize(-0.06));
els.increaseText.addEventListener("click", () => changeFontSize(0.06));
els.themeToggle.addEventListener("click", toggleTheme);
els.backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
els.chapterSearch.addEventListener("input", searchChapters);
els.chapterList.addEventListener("contextmenu", openLibraryContextMenu);
els.chapterList.addEventListener("keydown", (event) => {
  if (event.key === "ContextMenu" || (event.shiftKey && event.key === "F10")) openLibraryContextMenu(event);
});
els.chapterList.addEventListener("scroll", closeLibraryContextMenu);
window.addEventListener("resize", closeLibraryContextMenu);

window.addEventListener("scroll", () => {
  const scrollRatio = getScrollRatio();
  updatePageProgress(scrollRatio);
  if (!chapterReady) return;
  updateChapterStatus(activeId, scrollRatio);
  window.clearTimeout(scrollSaveTimer);
  scrollSaveTimer = window.setTimeout(saveProgress, 450);
}, { passive: true });
window.addEventListener("pagehide", saveProgress);
document.addEventListener("visibilitychange", () => {
  if (document.hidden) saveProgress();
});
window.addEventListener("popstate", (event) => {
  const id = event.state?.chapter || new URLSearchParams(window.location.search).get("chapter");
  if (chapterIndex.has(id) && id !== activeId) loadChapter(id, { fromHistory: true });
});
window.addEventListener("keydown", (event) => {
  if (els.libraryContextMenu.showPopover && els.libraryContextMenu.matches(":popover-open")) return;
  if (event.target.matches("input, textarea, select")) return;
  if (event.key === "Escape") closeLibrary();
  if (event.key === "ArrowLeft" && !els.previous.disabled) loadChapter(navigatorChapterIds[navigatorChapterIndex.get(activeId) - 1]);
  if (event.key === "ArrowRight" && !els.next.disabled) loadChapter(navigatorChapterIds[navigatorChapterIndex.get(activeId) + 1]);
});

initialize();
