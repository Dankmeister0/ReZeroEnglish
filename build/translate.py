import sys
import requests
import re
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

def get_kanji_names(nounMap: dict[str, str], characters: list[str]) -> None:
	url = "https://rezero.fandom.com/api.php"

	# MediaWiki allows fetching multiple pages at once by separating them with a pipe "|"
	# We loop through titles in chunks of 50 (the max limit for standard users)
	chunk_size = 50
	for i in range(0, len(characters), chunk_size):
		chunk = characters[i:i + chunk_size]
		titles_string = "|".join(chunk)
		
		params = {
			"action": "query",
			"prop": "revisions",
			"titles": titles_string,
			"rvprop": "content",
			"rvslots": "main",
			"format": "json"
		}
		
		try:
			response = requests.get(url, params=params)
			response.raise_for_status()
			data = response.json()
			
			pages = data.get("query", {}).get("pages", {})
			
			for _page_id, page_info in pages.items():
				title: str = page_info.get("title")
				
				# Extract raw wikitext content
				wikitext = page_info["revisions"][0]["slots"]["main"]["*"]
				
				# Use regex to search for the specific "ja_kanji" field in the infobox template
				# Matches patterns like "| Kanji = ナツキ・スバル" or "|Kanji=サテラ"
				match = re.search(r'\|\s*Kanji\s*=\s*([^|\}\(\n]+)', wikitext)

				# Fallback to getting from alias
				if match is None or match.group(1).strip() == "":
					match = re.search(r'\|\s*Alias\s*=\s*[^(]+.([^,\)\n]+)', wikitext)
				
				if match:
					# Strip away whitespace and any leftover template brackets
					kanji_name = match.group(1).strip()
					print(kanji_name + ": " + title)
					nounMap[kanji_name] = title
					continue

		except requests.exceptions.RequestException as e:
			print(f"Error fetching batch starting at index {i}: {e}")

def buildNounMap():
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
	nounMap: dict[str, str] = {}

	for match in re.finditer(r'<b>(<a.*?>)?([^<]+)(<\/a>)?<\/b>:?\s\(([^,\)\s]+)', html):
		eng: str = match.group(2)
		jp: str = match.group(4)
		nounMap[jp] = eng

	params = {
		"action": "query",
		"list": "categorymembers",
		"cmtitle": "Category:Characters",
		"cmlimit": "max",
		"cmtype": "page",
		"format": "json"
	}
	characters: list[str] = []

	while True:
		resp = requests.get("https://rezero.fandom.com/api.php", headers=headers, params=params)
		resp.raise_for_status()
		data = resp.json()
		members = data["query"]["categorymembers"]

		for member in members:
			characters.append(member["title"])

		if "continue" in resp.json():
			params["cmcontinue"] = data["continue"]["cmcontinue"]
		else:
			break

	get_kanji_names(nounMap, characters)

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
			line = line.rstrip('\n')
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

def getRelevantNouns(jpText: str) -> str:
	nounMap = loadNounMap()
	relevantNouns: str = ""

	for jpNoun, engNoun in nounMap.items():
		if jpText.find(jpNoun) > -1:
			relevantNouns += "\t- " + jpNoun + " → " + engNoun + "\n"

	if relevantNouns == "":
		relevantNouns = "<NULL>\n"
	return relevantNouns


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

def getNextChapter() -> str:
	chapter: str = getNewestChapter()
	if chapter == "":
		return ""

	filenames: set[str] = set()
	folderPath = Path(getDir("src/chapters"))
	for file in folderPath.rglob("*.txt"):
		if file.stem == "index":
			continue
		filenames.add(file.stem)

	while True:
		if int(chapter) < 1:
			return ""
		if chapter not in filenames:
			return chapter
		chapter = str(int(chapter) - 1)


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

def promptGemini(apiKey: str, prompt: str) -> str:
	"""
	Prompts Gemini using the given API key
	"""
	geminiClient = genai.Client(api_key=apiKey)
	try:
		resp = geminiClient.models.generate_content(model="gemini-3.6-flash", contents=prompt) #type: ignore
	except:
		geminiClient.close()
		return ""

	return resp.text if resp.text is not None else ""

def translateGemini(chapter: str, apiKey: str, backupApi: str):
	"""
	Uses Gemini to translate a given chapter
	"""
	if int(chapter) < 1:
		chapter = getNextChapter()

	jpText = getChapterText(chapter)
	nouns = getRelevantNouns(jpText)
	prompt = Path(getDir("build/systemPrompt.txt")).read_text(encoding="utf-8")
	prompt = prompt.format(nouns=nouns, text=jpText)
	print(prompt)

	resp = promptGemini(apiKey, prompt)
	if resp == "":
		print("Using backup API key")
		resp = promptGemini(backupApi, prompt)

	if resp == "":
		return


	with open(getDir("src/chapters/" + chapter + ".txt"), "w", encoding="utf-8") as fout:
		fout.write(resp)
		print("Translation saved to ../src/chapters/" + chapter + ".txt")
	buildIndex()

def printUsage():
	"""
	Prints the usage of this script
	"""
	print("\nUsage: " + sys.argv[0] + " [command]\n")
	print("\tchapter [number] [api key] [backup api] (Translates the given chapter using Gemini)")
	print("\tloop [number] [api key] [backup api] (Loops the given number of chapters, going from newest to oldest)")
	print("\tlatest (Prints the latest chapter id)")
	print("\tindex (Rebuilds the index)")
	print("\tnouns (Rebuilds the noun list)")
	print("\tmodels [api key] (Prints available Gemini models)")

if len(sys.argv) < 2:
	printUsage()
	sys.exit()

if sys.argv[1] == "chapter":
	if len(sys.argv) < 4:
		printUsage()
		sys.exit()
	apiKey = sys.argv[3]
	backupApi = ""

	if len(sys.argv) > 3:
		backupApi = sys.argv[3]

	translateGemini(sys.argv[2], apiKey, backupApi)

if sys.argv[1] == "loop":
	if len(sys.argv) < 4:
		printUsage()
		sys.exit()
	apiKey = sys.argv[3]
	backupApi = ""

	if len(sys.argv) > 3:
		backupApi = sys.argv[3]

	for i in range(int(sys.argv[2])):
		translateGemini("-1", apiKey, backupApi)

if sys.argv[1] == "models":
	if len(sys.argv) < 3:
		printUsage()
		sys.exit()
	apiKey = sys.argv[2]
	
	printGeminiModels(apiKey)

if sys.argv[1] == "index":
	buildIndex()

if sys.argv[1] == "latest":
	print(getNewestChapter())

if sys.argv[1] == "nouns":
	buildNounMap()