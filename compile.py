from pathlib import Path
import markdown

class Chapter:
	id: str
	arc: str
	title: str
	side: bool
	ex: bool

def getArc(id: str) -> str:
	ID = float(id)
	if ID < 25:
		return "1"
	elif ID < 75:
		return "2"
	elif ID < 77:
		return "oneday1"
	elif ID < 167:
		return "3"
	elif ID < 308:
		return "4"
	elif ID < 317:
		return "oneday2"
	elif ID < 403:
		return "5"
	elif ID < 498:
		return "6"
	elif ID < 617:
		return "7"
	elif ID < 695:
		return "8"
	elif ID < 758:
		return "9"
	else:
		return "10"

def getTitle(chapter: Chapter, line: str) -> str:
	title = ""
	line = line.strip()
	if chapter.ex:
		title = line[8:-1]
	elif chapter.side:
		title = line[:-1]
	elif chapter.arc == "oneday1":
		title = line[10:-1]
	elif chapter.arc == "oneday2":
		title = line[11:-1]
	elif chapter.id == "1":
		title = line[:-1]
	else:
		title = line[4 + len(chapter.arc):-1]
	return title.replace("\"", "", 1)

def makeChapterPage(prev: Chapter | None, chapter: Chapter, next: Chapter | None, template: str) -> None:
	prevID = "" if prev is None else prev.id
	nextID = "" if next is None else next.id
	fullText = Path("chapters/" + chapter.id + ".txt").read_text(encoding="utf-8")
	splitText = fullText.split("\n", 1)
	title = splitText[0]
	text = splitText[1]
	text = text.replace("<notes>", "***").replace("</notes>", "***")
	text = markdown.markdown(text)

	with open("pages/" + chapter.id + ".html", "w", encoding="utf-8") as fout:
		fout.write(template.format(prev=prevID, next=nextID, title=title, text=text))

def main():
	# Build list of chapters
	chapters: list[Chapter] = []
	for file in Path("chapters").rglob("*.txt"):
		if file.stem == "index" or file.stem == "temp":
			continue

		with file.open("r", encoding="utf-8") as fin:
			titleStr = fin.readline()

		chapter = Chapter()
		chapter.id = file.stem
		chapter.arc = getArc(file.stem)
		chapter.side = titleStr.find("Side Story") != -1
		chapter.ex = titleStr.find("EX") != -1
		chapter.title = getTitle(chapter, titleStr)
		chapters.append(chapter)

	chapters.sort(key=lambda c: float(c.id))

	# Build table of contents
	html = Path("resources/templateTOC.html").read_text(encoding="utf-8")
	arcHtmls: dict[str, str] = {}
	for chapter in chapters:
		arcHtmls.setdefault(chapter.arc, "")
		arcHtmls[chapter.arc] += "<a href=\"pages/" + chapter.id + ".html\" style=\"display: block;\">" + chapter.title + "</a>"
	html = html.format(arc1=arcHtmls["1"], arc2=arcHtmls["2"], arc3=arcHtmls["3"], oneday1=arcHtmls["oneday1"], arc4=arcHtmls["4"], oneday2=arcHtmls["oneday2"], arc5=arcHtmls["5"], arc6=arcHtmls["6"], arc7=arcHtmls["7"], arc8=arcHtmls["8"], arc9=arcHtmls["9"], arc10=arcHtmls["10"])

	with open("index.html", "w", encoding="utf-8") as fout:
		fout.write(html)

	# Build chapter pages
	html = Path("resources/templateChapter.html").read_text(encoding="utf-8")
	for i in range(0, len(chapters)):
		makeChapterPage(chapters[i - 1], chapters[i], None if i == len(chapters) - 1 else chapters[i + 1], html)

main()
