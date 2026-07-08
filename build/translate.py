import sys
import requests
from pathlib import Path
from google import genai

def getDir(relPath: str) -> str:
	"""
	Get the absolute path given a relative path
	"""
	path = str(Path(__file__).resolve().parent.parent)
	path += "/" + relPath
	return path

def buildIndex():
	"""
	Rebuilds src/chapters/index.txt
	"""
	output = ""
	filenames: list[int] = []
	folderPath = Path(getDir("src/chapters"))
	for file in folderPath.rglob("*.txt"):
		if file.stem == "index":
			continue
		filenames.append(int(file.stem))
	
	filenames.sort(reverse = True)
	for file in filenames:
		output += str(file) + "|"
		with Path(getDir("src/chapters/" + str(file) + ".txt")).open("r", encoding="utf-8") as fin:
			output += fin.readline().strip()
		output += "\n"
	with open(getDir("src/chapters/index.txt"), "w", encoding="utf-8") as fout:
		fout.write(output)

def buildProperNounMap():
	"""
	Rebuilds build/nouns.tsv
	This file is a list of proper nouns used in Re:Zero in Japanese and English. This is used to improve the accuracy of spelling for names & related nouns.
	"""
	headers = {
		"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
	}
	params = {
		"action": "parse",
		"page": "Terminology",
		"format": "json"
	}
	resp = requests.get("https://rezero.fandom.com/api.php", headers=headers, params=params)
	html: str = resp.json()["parse"]["text"]["*"]

	idx1 = 0
	idx2 = 0
	nounMap: dict[str, str] = {}
	while True:
		idx1 = html.find("<b>", idx2) + 3
		if idx1 == 2:
			break
		idx2 = html.find("</b>", idx1)
		if idx2 == -1:
			break
		noun = html[idx1:idx2]

		while True:
			idxBeg = noun.find("<")
			if idxBeg == -1:
				break
			idxEnd = noun.find(">", idxBeg)
			if idxEnd == -1:
				break
			noun = noun[:idxBeg] + noun[idxEnd + 1:]

		idx1 = html.find("(", idx2) + 1
		if idx1 == 0:
			break
		if idx1 > idx2 + 20:
			continue
		idx2 = html.find(",", idx1)
		if idx2 == -1 or idx2 > idx1 + 20:
			idx2 = html.find(")", idx1)
		if html.find(")", idx1) < idx2:
			idx2 = html.find(")", idx1)
		if idx2 == -1:
			break
		jpNoun = html[idx1:idx2]
		if jpNoun.find(" <") != -1:
			jpNoun = jpNoun[:jpNoun.find(" <")]
		nounMap[jpNoun] = noun

	params["page"] = "Characters"
	resp = requests.get("https://rezero.fandom.com/api.php", headers=headers, params=params)
	charLinks: list[dict[str, str | int]] = resp.json()["parse"]["links"]
	for link in charLinks:
		params["page"] = str(link["*"])
		resp = requests.get("https://rezero.fandom.com/api.php", headers=headers, params=params)
		html = resp.json()["parse"]["text"]["*"]

		idx = html.find("data-source=\"Name\"")
		if idx == -1:
			continue
		idx = html.find(">", idx) + 1
		name = html[idx:html.find("<", idx)]
		idx = html.find("data-source=\"Kanji\"", idx)
		if idx == -1:
			continue
		idx = html.find("<div", idx)
		idx = html.find(">", idx) + 1
		jpName = html[idx:html.find("<", idx)]
		nounMap[jpName] = name
		print(jpName + ": " + name)

	with open(getDir("build/nouns.tsv"), "w", encoding="utf-8") as fout:
		for jp, en in nounMap.items():
			fout.write(jp + "\t" + en + "\n")

def loadNounMap() -> dict[str, str]:
	"""
	Loads the nouns from build/nouns.tsv
	The key is the Japanese noun & the value is the English translation
	"""
	nounMap: dict[str, str] = {}
	with open(getDir("build/nouns.tsv"), "r", encoding="utf-8") as fin:
		for line in fin:
			parts = line.split("\t")
			if parts[0] == "" or parts[1] == "":
				continue
			partsJp = parts[0].split("・")
			partsEn = parts[1].split(" ")
			if len(partsJp) == 1 or len(partsJp) != len(partsEn):
				nounMap[parts[0]] = parts[1]
				continue

			for i in range(0, len(partsJp)):
				nounMap[partsJp[i]] = partsEn[i]
	return nounMap

def getNewestChapter() -> str:
	"""
	Returns the most recent chapter id
	"""
	headers = {
		"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
	}
	resp = requests.get("https://ncode.syosetu.com/n2267be/", headers=headers)
	idx = resp.text.find("c-pager__item--next")
	idx = resp.text.find("?p=", idx) + 3
	lastPage = resp.text[idx:resp.text.find("\"", idx)]
	
	resp = requests.get("https://ncode.syosetu.com/n2267be/?p=" + lastPage, headers=headers)
	idx = resp.text.find("c-pager__result-stats")
	idx = resp.text.find("&nbsp;", idx) + 6
	idx = resp.text.find("&nbsp;", idx) + 6
	idx = resp.text.find("&nbsp;", idx) + 6
	chapter = resp.text[idx:resp.text.find("&nbsp;", idx)]
	return chapter

def getChapterText(chapter: str) -> str:
	"""
	Returns the raw Japanese text of a given chapter
	"""
	headers = {
		"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
	}
	resp = requests.get("https://ncode.syosetu.com/n2267be/" + chapter, headers=headers)
	idx = resp.text.find("p-novel__title")
	idx = resp.text.find(">", idx) + 1
	text = resp.text[idx:resp.text.find("<", idx)] + "\n"

	while True:
		idx = resp.text.find("id=\"L", idx)
		if idx == -1:
			break
		idx = resp.text.find(">", idx) + 1
		text += resp.text[idx:resp.text.find("<", idx)] + "\n"
	return text

def replaceNounsJpText(text: str, nounMap: dict[str, str]) -> str:
	"""
	Replaces all the Japanese proper nouns with their English translation
	"""
	out = text
	for jp, en in nounMap.items():
		out = out.replace(jp, en)
	return out

def splitJpText(text: str, size: int) -> list[str]:
	"""
	Splits the input text into multiple peices of the given size
	"""
	sections: list[str] = []
	while len(text) > 0:
		idx = text.find("\n", size) + 1
		if idx == 0:
			idx = len(text)
		sections.append(text[:idx])
		text = text[idx:]
	return sections

def promptLocalModel(prompt: str, tokens: int) -> str:
	"""
	Prompts translategemma:12b using ollama
	"""
	payload: dict[str, str | bool | dict[str, int]] = {
		"model": "translategemma:12b",
		"stream": False,
		"prompt": prompt,
		"options": {
			"num_ctx": tokens
		}
	}

	while True:
		try:
			resp = requests.post("http://localhost:11434/api/generate", json=payload, timeout=180)
			return resp.json()["response"] + "\n"
		except requests.exceptions.Timeout:
			print("Request timed out, retrying.")

def printGeminiModels(apiKey: str) -> None:
	"""
	Prints a full list of Gemini models
	"""
	geminiClient = genai.Client(api_key=apiKey)

	for m in geminiClient.models.list():
		if m.supported_actions is not None:
			for action in m.supported_actions:
				if action == "generateContent":
					print(m.name)

def promptGemini(apiKey: str, sysPrompt: str, jpText: str) -> str:
	"""
	Prompts Gemini using the given API key
	"""
	geminiClient = genai.Client(api_key=apiKey)
	print(sysPrompt.format(text=jpText))
	resp = geminiClient.models.generate_content(model="gemini-3.5-flash", contents=sysPrompt.format(text=jpText)) #type: ignore
	return resp.text if resp.text is not None else ""

def summarizeLocal(txt: str, tokens: int) -> str:
	"""
	Uses the local model to summarize the given text
	"""
	sysPrompt = (
		"You are a part of a professional Japanese (ja) to English (en) translation team.\n"
		"Your goal is to summarize the context of the given Japanese text.\n"
		"The context will be given to the translator to help them translate the next section accurately.\n"
		"Describe the characters, setting, and tone as best as possible.\n"
		"Produce ONLY your summary in English, without any additional explanations or commentary.\n"
		"Please summarize the following Japanese text:\n\n"
	)
	return promptLocalModel(sysPrompt + txt, tokens)

def translateLocal(chapter: str, tokens: int):
	"""
	Uses a local model to translate a given chapter
	"""
	nounMap = loadNounMap()
	jpText = getChapterText(chapter)
	jpText = replaceNounsJpText(jpText, nounMap)
	jpText = splitJpText(jpText, int(tokens / 2))
	sysPrompt = Path(getDir("build/systemPromptLocal.txt")).read_text(encoding="utf-8")

	cnt = 0
	output = ""
	context = "<CONTEXT UNAVAILABLE>"
	for txt in jpText:
		cnt += 1
		print("Translating section " + str(cnt))
		output += promptLocalModel(sysPrompt.format(context=context, text=txt), tokens)
		context = summarizeLocal(txt, tokens)
		print(context)

	with open(getDir("src/chapters/" + chapter + ".txt"), "w", encoding="utf-8") as fout:
		fout.write(output)
		print("Translation saved to ../src/chapters/" + chapter + ".txt")
	buildIndex()

def translateGemini(chapter: str, apiKey: str):
	"""
	Uses Gemini to translate a given chapter
	"""
	jpText = getChapterText(chapter)
	sysPrompt = Path(getDir("build/systemPrompt.txt")).read_text(encoding="utf-8")

	with open(getDir("src/chapters/" + chapter + ".txt"), "w", encoding="utf-8") as fout:
		fout.write(promptGemini(apiKey, sysPrompt, jpText))
		print("Translation saved to ../src/chapters/" + chapter + ".txt")
	buildIndex()

def printUsage():
	"""
	Prints the usage of this script
	"""
	print("\nUsage: " + sys.argv[0] + " [command]\n")
	print("\tchapter [number] [api key] (Translates the given chapter using Gemini)")
	print("\tlocal [number] [max tokens] (Translates the given chapter using a local model)")
	print("\tindex (Rebuilds the index)")
	print("\tlatest (Prints the latest chapter id)")

if len(sys.argv) < 2:
	printUsage()
	sys.exit()

if sys.argv[1] == "chapter":
	if len(sys.argv) < 4:
		printUsage()
		sys.exit()
	apiKey = sys.argv[3]
	translateGemini(sys.argv[2], apiKey)

if sys.argv[1] == "models":
	if len(sys.argv) < 3:
		printUsage()
		sys.exit()
	apiKey = sys.argv[2]
	printGeminiModels(apiKey)

if sys.argv[1] == "local":
	if len(sys.argv) < 3:
		printUsage()
		sys.exit()
	if len(sys.argv) > 3:
		tokens = int(sys.argv[3])
	else:
		tokens = 4096
	translateLocal(sys.argv[2], tokens)

if sys.argv[1] == "index":
	buildIndex()

if sys.argv[1] == "latest":
	print(getNewestChapter())

if sys.argv[1] == "nouns":
	buildProperNounMap()