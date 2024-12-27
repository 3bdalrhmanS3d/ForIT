import re
import json

# Read the file content
file_path = "C:\Users\Concept D\OneDrive - Assuit University\Desktop\Lec78.txt"
with open(file_path, 'r', encoding='utf-8') as file:
    content = file.read()

# Regex pattern to parse the questions, options, and answers
pattern = re.compile(r"""\d+\.\s\*\*What\sis\sthe\soutput\sof\sthe\sfollowing\scode\?\*\*
\s+```c
(?P<code>[\s\S]*?)
\s+```
\s+(?P<options>(?:- [a-d]\)\s[\s\S]*?)+)
\s+\*\*Answer\*\*:\s(?P<answer>[a-d]\))""", re.MULTILINE)

# Extract matches
matches = pattern.finditer(content)

# Parse each question into the desired JSON structure
questions = []
for match in matches:
    code_snippet = match.group("code").strip()
    options_text = match.group("options").strip()
    options = re.findall(r"- [a-d]\)\s(.*)", options_text)
    answer = match.group("answer").strip()
    
    question_json = {
        "Question": "What is the output of the following code?",
        "Options": options,
        "Answer": answer,
        "CodeOption": code_snippet
    }
    questions.append(question_json)

# Output JSON data to a file
output_path = '"C:\Users\Concept D\OneDrive - Assuit University\Desktop/Questions.json'
with open(output_path, 'w', encoding='utf-8') as json_file:
    json.dump(questions, json_file, ensure_ascii=False, indent=4)

output_path
