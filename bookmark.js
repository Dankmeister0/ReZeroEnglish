
const readChapters = document.cookie.split("|");
for (let i = 0; i < readChapters.length; ++i) {
	if (readChapters.at(i) == "") continue;
	const aElem = document.getElementById(readChapters.at(i));
	aElem.className = "secondary";
}

const list = document.getElementById("list").children;
for (let i = 0; i < list.length; ++i) {
	const aElem = list.item(i).firstChild;
	if (aElem == null) continue;
	aElem.onclick = () => {
		document.cookie = document.cookie + "|" + aElem.id;
	};
}