from pathlib import Path
import markdown
import sys

class Chapter:
	id: str
	section: str
	title: str

sections: list[str] = [ \
	"Arc 1", "Arc 1 Side", "Arc 1 IF", \
	"Arc 2", "One Day I", "Arc 2 Side", "Arc 2 IF", \
	"Arc 3", "Arc 3 Side", "Arc 3 IF", \
	"Arc 4", "One Day II", "Arc 4 Side", "Arc 4 IF", \
	"Arc 5", "Arc 5 Side", \
	"Arc 6", "Scorpion Tale", "Arc 6 Side", "Arc 6 IF", \
	"Arc 7", "Arc 7 Side", "Arc 7 IF", \
	"Arc 8", "Iris and the King of Thorns", "Arc 8 Side", "Arc 8 IF", \
	"Arc 9", "Arc 9 Side", "Arc 9 IF", \
	"Arc 10", "Extra IF", "Unknown" \
]

def getSection(title: str, id: str) -> str:
	if id == "434":
		return "Arc 1 IF"
	if id == "443":
		return "Arc 2 IF"
	if id == "269" or id == "269.1":
		return "Arc 3 IF"
	if id == "427":
		return "Arc 4 IF"
	if id == "473":
		return "Arc 6 IF"
	if id == "719":
		return "Arc 7 IF"
	if id == "676" or id == "677":
		return "Iris and the King of Thorns"
	if id == "771":
		return "Arc 9 IF"
	if id == "372" or id == "398" or id == "486" or id == "511" or id == "556" or id == "616":
		return "Extra IF"

	for section in reversed(sections):
		if section == "Unkown" or section == "Iris and the King of Thorns":
			continue
		if title.find(section) != -1:
			return section

	print("Unknown section for chapter: " + title)
	return "Unknown"

def getSectionTitle(section: str) -> str:
	if section == "Arc 1":
		return "A Tumultuous First Day"
	if section == "Arc 2":
		return "The Chaotic Week"
	if section == "Arc 3":
		return "Return to the Royal Capital"
	if section == "Arc 4":
		return "Everlasting Contract"
	if section == "Arc 5":
		return "Stars What Make History"
	if section == "Arc 6":
		return "Hall of Memories"
	if section == "Arc 7":
		return "The Land of Wolves"
	if section == "Arc 8":
		return "Vincent Vollachia"
	if section == "Arc 9":
		return "Light of a Nameless Star"
	if section == "Arc 10":
		return "The Land of the Lion Kings"
	return ""

def getTitle(section: str, line: str) -> str:
	line = line.strip()
	if line.find("Re:Zero EX") != -1:
		title = line[1 + len("Re:Zero EX"):-1]
	else:
		title = line[1 + len(section):-1]
	return title.replace("\"", "", 1)

def getChapters() -> list[Chapter]:
	chapters: list[Chapter] = []
	for file in Path("chapters").rglob("*.txt"):
		if file.stem == "index" or file.stem == "temp":
			continue

		with file.open("r", encoding="utf-8") as fin:
			titleStr = fin.readline()

		chapter = Chapter()
		chapter.id = file.stem
		chapter.section = getSection(titleStr, file.stem)
		chapter.title = getTitle(chapter.section, titleStr)
		chapters.append(chapter)

	chapters.sort(key=lambda c: sections.index(c.section) * 1000 + float(c.id))
	return chapters

def makeChapterPage(prev: Chapter | None, chapter: Chapter, next: Chapter | None, template: str) -> None:
	prevID = "" if prev is None else prev.id
	nextID = "" if next is None else next.id
	fullText = Path("chapters/" + chapter.id + ".txt").read_text(encoding="utf-8")
	splitText = fullText.split("\n", 1)
	title = splitText[0]
	text = splitText[1]
	text = text.replace("<notes>", "***").replace("</notes>", "***")
	text = markdown.markdown(text, extensions=["nl2br"])

	with open("pages/" + chapter.id + ".html", "w", encoding="utf-8") as fout:
		fout.write(template.format(prev=prevID, id=chapter.id, next=nextID, title=title, text=text))

def makeTOC(chapters: list[Chapter]) -> None:
	html = Path("resources/templateTOC.html").read_text(encoding="utf-8")
	section: str = ""
	innerHtml: str = ""

	for chapter in chapters:
		if section != chapter.section:
			if innerHtml != "":
				innerHtml += "</div>"

			section = chapter.section
			sectionTitle = getSectionTitle(section)
			if sectionTitle != "":
				innerHtml += f'<h5 id="{section}">{section}: {sectionTitle}</h5><div style="margin-bottom: 18px;">'
			else:
				innerHtml += f'<h6 id="{section}">{section}</h6><div style="margin-bottom: 18px;">'

		innerHtml += f'<a id="{chapter.id}" href="pages/{chapter.id}.html" style="display: block;">{chapter.title}</a>'
	innerHtml += "</div>"

	with open("index.html", "w", encoding="utf-8") as fout:
		fout.write(html.format(data = innerHtml))

def makeChapters(chapters: list[Chapter]) -> None:
	html = Path("resources/templateChapter.html").read_text(encoding="utf-8")
	for i in range(0, len(chapters)):
		makeChapterPage(chapters[i - 1], chapters[i], None if i == len(chapters) - 1 else chapters[i + 1], html)

if len(sys.argv) < 2 or sys.argv[1] == "all":
	chapters = getChapters()
	makeTOC(chapters)
	makeChapters(chapters)

elif sys.argv[1] == "toc":
	chapters = getChapters()
	makeTOC(chapters)
