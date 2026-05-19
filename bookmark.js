

if (document.cookie == "") document.cookie = "chapters=|";
const listEntries = [];
initListEntries();
grayOutReadChapters();
setupHandlers();
setupArcFilters();

function initListEntries() {
	const list = document.getElementById("list").children;
	for (let i = 0; i < list.length; ++i) {
		const aElem = list.item(i).firstChild;
		if (aElem == null) continue;
		listEntries.push(aElem);
	}
}

function grayOutReadChapters() {
	const readChapters = document.cookie.split("|");
	for (let i = 1; i < readChapters.length; ++i) {
		if (readChapters.at(i) == "") continue;
		const aElem = document.getElementById(readChapters.at(i));
		aElem.className = "secondary";
	}
}

function setupHandlers() {
	for (const elem of listEntries) {
		elem.onclick = () => { readChapter(elem.id); }
	}

	const readAllButton = document.getElementById("readAll");
	readAllButton.onclick = () => {
		for (const elem of listEntries) {
			if (elem.parentNode.getAttribute("style") == "display: none;") continue;
			readChapter(elem.id);
			elem.className = "secondary";
		}
	}

	const unreadAllButton = document.getElementById("readNone");
	unreadAllButton.onclick = () => {
		for (const elem of listEntries) {
			if (elem.parentNode.getAttribute("style") == "display: none;") continue;
			document.cookie = document.cookie.replace(`|${elem.id}|`, "|");
			elem.className = "";
		}
	}
}

function setupArcFilters() {
	const list = document.getElementById("filters").children;
	for (let i = 0; i < list.length; ++i) {
		const aElem = list.item(i).firstChild;
		if (aElem == null) continue;
		if (aElem.id == "allFilter") {
			aElem.onclick = () => {
				for (const elem of listEntries) {
					elem.parentNode.removeAttribute("style");
				}
			}
			continue;
		}

		aElem.onclick = () => {
			const filterText = aElem.textContent;
			for (const elem of listEntries) {
				if (elem.textContent.indexOf(filterText) > -1) {
					elem.parentNode.removeAttribute("style");
				}
				else {
					elem.parentNode.setAttribute("style", "display: none;");
				}
			}
		};
	}
}

function readChapter(chapter) {
	if (document.cookie.indexOf(`|${chapter}|`) > -1) return;
	document.cookie = document.cookie + chapter + "|";
}