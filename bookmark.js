
const readChapters = document.cookie.split("|");
for (let i = 1; i < readChapters.length; ++i) {
	if (readChapters.at(i) == "") continue;
	const aElem = document.getElementById(readChapters.at(i));
	aElem.className = "secondary";
}

if (document.cookie == "") document.cookie = "chapters=|";
const list = document.getElementById("list").children;
for (let i = 0; i < list.length; ++i) {
	const aElem = list.item(i).firstChild;
	if (aElem == null) continue;
	aElem.onclick = () => {
		if (document.cookie.indexOf(`|${aElem.id}|`) > -1) return;
		document.cookie = document.cookie + aElem.id + "|";
	};
}