
/// <reference path="RatchetReact.ts" />

const gHandlers = {
	openTOC: () => {},
	openChapter: (chapter: string) => {},
	markAllRead: () => {},
	markAllUnread: () => {},
	filterTOC: (filter: string) => {},
}

function addChapterToCookie(chapter: string) {
	if (isChapterInCookie(chapter)) return;
	if (!document.cookie.includes("|")) document.cookie = "chapters=|";
	document.cookie += chapter + "|";
}

function removeChapterFromCookie(chapter: string) {
	if (!isChapterInCookie(chapter)) return;
	document.cookie = document.cookie.replace(`|${chapter}|`, "|");
}

function isChapterInCookie(chapter: string) {
	return document.cookie.includes(`|${chapter}|`);
}

RatchetReact.Root = main();

function main(): RatchetReact<HTMLElement> {
	const articleRef = RatchetReact.New("article");

	gHandlers.openTOC = () => {
		articleRef.elem().replaceChildren();
		articleRef.open();
		articleRef.addRef(tocNavBar());
		articleRef.addAsync(tableOfContents());
		articleRef.close();
	};

	gHandlers.openChapter = (chapter: string) => {
		addChapterToCookie(chapter);
		articleRef.elem().replaceChildren();
		articleRef.open();
		articleRef.addAsync(readerNavBar(chapter));
		articleRef.addAsync(readerContent(chapter));
		articleRef.close();
	};

	gHandlers.openTOC();
	return (
		RatchetReact.New("main").set("className", "container").open()
			.addRef(articleRef)
		.close()
	);
}


function tocNavBar(): RatchetReact<HTMLElement> {
	const dropdownRef = RatchetReact.New("select");

	const onFilter = () => {
		gHandlers.filterTOC(dropdownRef.get("value"));
	};

	return (
		RatchetReact.New("nav").open()
			.add("ul").open()
				.add("li").open()
					.add("a").set("href", "#").set("textContent", "Mark All Read").set("onclick", () => gHandlers.markAllRead())
				.close()
				.add("li").open()
					.add("a").set("href", "#").set("textContent", "Mark All Unread").set("onclick", () => gHandlers.markAllUnread())
				.close()
			.close()
			.add("ul").open()
				.add("li").open()
					.addRef(dropdownRef).set("onchange", onFilter).open()
						.add("option").set("textContent", "All")
						.add("option").set("textContent", "Arc 10")
						.add("option").set("textContent", "Arc 9")
						.add("option").set("textContent", "EX")
					.close()
				.close()
			.close()
			
		.close()
	);
}

async function tableOfContents(): Promise<RatchetReact<HTMLElement>> {
	const tocRef = RatchetReact.New("ul");
	let aRef: RatchetReact<HTMLAnchorElement>;

	const resp = await fetch("./src/chapters/index.txt");
	const text = await resp.text();
	const chapters = text.split("\n").reverse();
	for (const chapterStr of chapters) {
		const chapter = chapterStr.split("|", 2)[0];
		const chapterTitle = chapterStr.split("|", 2)[1];

		if (chapter.trim().length === 0) continue;
		const onClick = () => {
			gHandlers.openChapter(chapter);
		}

		aRef = RatchetReact.New("a");
		tocRef.open()
			.add("li").open()
				.addRef(aRef).set("id", chapter).set("textContent", chapterTitle).set("href", "#").set("onclick", onClick)
			.close()
		.close();

		if (isChapterInCookie(chapter)) {
			aRef.get("classList").add("secondary");
		}
	}

	gHandlers.markAllRead = () => {
		for (const liElem of tocRef.elem().childNodes) {
			if (!liElem.firstChild) continue;
			const aElem = liElem.firstChild as HTMLAnchorElement;
			if ((liElem as HTMLElement).classList.contains("hidden")) continue;
			aElem.classList.add("secondary");
			addChapterToCookie(aElem.id);
		}
	};

	gHandlers.markAllUnread = () => {
		for (const liElem of tocRef.elem().childNodes) {
			if (!liElem.firstChild) continue;
			const aElem = liElem.firstChild as HTMLAnchorElement;
			if ((liElem as HTMLElement).classList.contains("hidden")) continue;
			aElem.classList.remove("secondary");
			removeChapterFromCookie(aElem.id);
		}
	}

	gHandlers.filterTOC = (filter: string) => {
		for (const liElem of tocRef.elem().childNodes) {
			if (!liElem.firstChild) continue;
			const aElem = liElem.firstChild as HTMLAnchorElement;
			if (filter === "All" || aElem.textContent.includes(filter)) (liElem as HTMLElement).classList.remove("hidden");
			else (liElem as HTMLElement).classList.add("hidden");
		}
	}

	return (
		RatchetReact.New("div").open()
			.add("h1").set("textContent", "Table of Contents")
			.addRef(tocRef)
		.close()
	);
}

async function readerNavBar(chapter: string): Promise<RatchetReact<HTMLElement>> {
	const chapterNum = Number(chapter);
	let prevButtonRef: RatchetReact<HTMLElement> = RatchetReact.New("span");
	let nextButtonRef: RatchetReact<HTMLElement> = RatchetReact.New("span");
	const homeButtonRef = RatchetReact.New("a").set("href", "#").set("onclick", () => gHandlers.openTOC());

	let resp = await fetch(`./src/chapters/${chapterNum - 1}.txt`);
	if (resp.ok) {
		prevButtonRef = RatchetReact.New("a").set("href", "#").set("onclick", () => gHandlers.openChapter(`${chapterNum - 1}`))
	}
	resp = await fetch(`./src/chapters/${chapterNum + 1}.txt`);
	if (resp.ok) {
		nextButtonRef = RatchetReact.New("a").set("href", "#").set("onclick", () => gHandlers.openChapter(`${chapterNum + 1}`))
	}

	return (
		RatchetReact.New("nav").open()
			.add("ul").open()
				.add("li").open()
					.addRef(prevButtonRef).set("textContent", "Previous")
				.close()
				.add("li").open()
					.addRef(homeButtonRef).set("textContent", "Home")
				.close()
				.add("li").open()
					.addRef(nextButtonRef).set("textContent", "Next")
				.close()
			.close()
		.close()
	);
}

async function readerContent(chapter: string): Promise<RatchetReact<HTMLElement>> {
	const divRef = RatchetReact.New("div");

	const resp = await fetch(`./src/chapters/${chapter}.txt`);
	if (!resp.ok) return divRef;
	const text = await resp.text();
	const lines = text.split("\n");

	let firstLine = true;
	divRef.open();
	for (const line of lines) {
		if (firstLine) {
			divRef.add("h1").set("textContent", line);
			firstLine = false;
			continue;
		}
		divRef.add("p").set("textContent", line);
	}
	divRef.close();

	return divRef;
}