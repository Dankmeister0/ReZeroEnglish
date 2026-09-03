import sys
import requests
import anyio
from pathlib import Path
from google import genai
from claude_agent_sdk import query, ClaudeAgentOptions, AssistantMessage, ResultMessage, TextBlock

def readChapterFile(chapter: str):
	return open(Path("chapters/" + chapter + ".txt"), "r", encoding="utf-8")

def writeChapterFile(chapter: str):
	return open(Path("chapters/" + chapter + ".txt"), "w", encoding="utf-8")

def buildGlossary():
	"""
	Removes duplicates & sorts glossary.tsv
	"""
	glossary: dict[str, str] = loadGlossary()
	glossary = dict(sorted(glossary.items(), key=lambda item: item[1]))

	with open(Path("resources/glossary.tsv"), "w", encoding="utf-8") as fout:
		for jp, en in glossary.items():
			fout.write(jp + "\t" + en + "\n")

def loadGlossary() -> dict[str, str]:
	"""
	Loads the glossary from glossary.tsv
	The key is the Japanese noun & the value is the English translation
	"""
	glossary: dict[str, str] = {}
	with open(Path("resources/glossary.tsv"), "r", encoding="utf-8") as fin:
		for line in fin:
			parts = line.strip().split("\t")
			if len(parts) < 2 or parts[0] == "" or parts[1] == "":
				continue
			if parts[0] in glossary:
				print("[Error] Duplicate glossary entries found:")
				print("\t" + parts[0] + " → " + parts[1])
				print("\t" + parts[0] + " → " + glossary[parts[0]])
			glossary[parts[0]] = parts[1]
	return glossary

def getGlossaryEntries(jpText: str) -> str:
	"""
	Compiles the relevant glossary entries for a given chapter
	"""
	glossary = loadGlossary()
	relevantEntries: str = ""

	for jp, en in glossary.items():
		if jpText.find(jp) > -1:
			relevantEntries += "\t- " + jp + " → " + en + "\n"

	if relevantEntries == "":
		relevantEntries = "<NULL>\n"
	return relevantEntries

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
	if chapter == "temp":
		return Path(chapter + ".txt").read_text(encoding="utf-8")

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

def promptClaude(prompt: str) -> str:
	"""
	Prompts Claude using the Claude Code installation
	"""
	async def _run() -> str:
		chunks: list[str] = []
		final_result: str = ""
		options = ClaudeAgentOptions(model="claude-sonnet-5")
		async for message in query(prompt=prompt, options=options):
			if isinstance(message, AssistantMessage):
				for block in message.content:
					if isinstance(block, TextBlock):
						chunks.append(block.text)
			elif isinstance(message, ResultMessage):
				usage = message.usage or {}
				print("Tokens Used: " + str(usage.get("input_tokens", 0) + usage.get("output_tokens", 0)) + " ($" + str(message.total_cost_usd) + ")")
				final_result = message.result or ""
		accumulated = "".join(chunks)
		return accumulated if accumulated else final_result
	return anyio.run(_run)

def promptGemini(prompt: str, apiKey: str) -> str:
	"""
	Prompts Gemini using the given API key
	"""
	geminiClient = genai.Client(api_key=apiKey)
	resp = geminiClient.models.generate_content(model="gemini-3.8-flash", contents=prompt) #type: ignore
	return resp.text if resp.text is not None else ""

def translateChapter(model: str, chapter: str, apiKey: str):
	"""
	Translates a single chapter
	"""
	jpText = getChapterText(chapter)
	glossary = getGlossaryEntries(jpText)
	prompt = Path("resources/prompt.txt").read_text(encoding="utf-8")
	prompt = prompt.format(glossary=glossary, text=jpText)

	if model == "claude":
		resp = promptClaude(prompt)
	elif model == "gemini":
		resp = promptGemini(prompt, apiKey)
	else:
		print("Unknown model: " + model)
		return

	with writeChapterFile(chapter) as fout:
		fout.write(resp)

def translateChapters(model: str, beginChapter: str, endChapter: str, apiKey: str):
	"""
	Translates a range of chapters. Can use "gemini" or "claude" as models
	"""
	if beginChapter == "temp":
		print("Translating temp.txt")
		translateChapter(model, beginChapter, apiKey)
		print("Translation saved to chapters/temp.txt")
		return

	chapter1 = int(beginChapter)
	chapter2 = int(endChapter) if endChapter != "" else chapter1
	maxChapter = int(getNewestChapter())
	chapter1 = maxChapter + chapter1 + 1 if chapter1 < 0 else 1 if chapter1 == 0 else maxChapter if chapter1 > maxChapter else chapter1
	chapter2 = maxChapter + chapter2 + 1 if chapter2 < 0 else 1 if chapter2 == 0 else maxChapter if chapter2 > maxChapter else chapter2
	if chapter2 < chapter1:
		tmpChp = chapter1
		chapter1 = chapter2
		chapter2 = tmpChp

	for i in range(chapter1, chapter2 + 1, 1):
		if Path("chapters/" + str(i) + ".txt").is_file():
			print("Chapter " + str(i) + " is already translated. Skipping.")
			continue

		print("Translating chapter " + str(i))
		translateChapter(model, str(i), apiKey)
		print("Translation saved to chapters/" + str(i) + ".txt")

def printUsage():
	"""
	Prints the usage of this script
	"""
	print("\nUsage: " + sys.argv[0] + " [command]\n")
	print("\tclaude <start chapter> [end chapter]")
	print("\tgemini <api key> <start chapter> [end chapter]")
	print("\tglossary (Rebuilds the glossary)")
	print("\tmodels <api key> (Prints available Gemini models)")

if len(sys.argv) < 2:
	printUsage()
	sys.exit()

if sys.argv[1] == "claude":
	if len(sys.argv) < 3:
		printUsage()
		sys.exit()
	translateChapters("claude", sys.argv[2], sys.argv[3] if len(sys.argv) > 3 else "", "")

if sys.argv[1] == "gemini":
	if len(sys.argv) < 4:
		printUsage()
		sys.exit()
	translateChapters("gemini", sys.argv[3], sys.argv[4] if len(sys.argv) > 4 else "", sys.argv[2])


if sys.argv[1] == "glossary":
	buildGlossary()

if sys.argv[1] == "models":
	if len(sys.argv) < 3:
		printUsage()
		sys.exit()
	apiKey = sys.argv[2]
	printGeminiModels(apiKey)

if sys.argv[1] == "latest":
	print(getNewestChapter())