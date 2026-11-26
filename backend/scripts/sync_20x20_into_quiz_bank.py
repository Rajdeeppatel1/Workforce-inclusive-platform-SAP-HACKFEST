"""
Syncs the 20 skills x 20 questions (400 MCQs) into backend/data/quiz_bank.json
and backend/data/fresher_catalog.json.
"""

import json
import os
import sys

# Add script dir to sys.path
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
if SCRIPT_DIR not in sys.path:
    sys.path.insert(0, SCRIPT_DIR)

from generate_all_20_skills import build_complete_20_quizzes

QUIZ_BANK_PATH = os.path.abspath(os.path.join(SCRIPT_DIR, "..", "data", "quiz_bank.json"))
CATALOG_PATH = os.path.abspath(os.path.join(SCRIPT_DIR, "..", "data", "fresher_catalog.json"))

SKILL_AWARDS = {
    "sql-basics": ["SQL basics", "SQL"],
    "http-rest": ["HTTP & REST", "REST APIs"],
    "relational-vs-nosql": ["Databases (relational vs NoSQL)", "Database Design"],
    "cloud-basics": ["Cloud basics (IaaS/PaaS/SaaS)", "Cloud Basics"],
    "cloud-storage-scaling": ["Cloud storage & scaling", "Cloud Architecture"],
    "linux-basics": ["Linux basics", "Linux"],
    "git-version-control": ["Git & version control", "Git"],
    "python-basics": ["Python basics", "Python"],
    "javascript-basics": ["JavaScript basics", "JavaScript"],
    "data-structures": ["Data structures (arrays, stacks, queues)", "Data Structures"],
    "algorithms-big-o": ["Algorithms & complexity (Big-O)", "Algorithms"],
    "machine-learning-basics": ["Machine learning basics", "Machine Learning"],
    "supervised-unsupervised": ["Supervised vs unsupervised learning", "AI/ML"],
    "overfitting-train-test": ["Overfitting & train/test split", "Model Validation"],
    "ml-evaluation-metrics": ["ML evaluation metrics", "Data Science"],
    "excel-spreadsheet-analytics": ["Excel & spreadsheet analytics", "Data Analysis"],
    "data-visualisation-basics": ["Data visualisation basics", "Data Visualization"],
    "business-communication": ["Business communication (email, reports)", "Communication"],
    "basic-accounting": ["Basic accounting (debit/credit, GST basics)", "Accounting Basics"],
    "project-management-agile": ["Project management basics (Agile, Scrum)", "Agile / Scrum"],
}

SKILL_GROUPS = {
    "sql-basics": "Databases & Backend",
    "http-rest": "Databases & Backend",
    "relational-vs-nosql": "Databases & Backend",
    "cloud-basics": "Cloud & Infrastructure",
    "cloud-storage-scaling": "Cloud & Infrastructure",
    "linux-basics": "Cloud & Infrastructure",
    "git-version-control": "Core Engineering",
    "python-basics": "Programming Languages",
    "javascript-basics": "Programming Languages",
    "data-structures": "DSA & Problem Solving",
    "algorithms-big-o": "DSA & Problem Solving",
    "machine-learning-basics": "AI / ML & Data Science",
    "supervised-unsupervised": "AI / ML & Data Science",
    "overfitting-train-test": "AI / ML & Data Science",
    "ml-evaluation-metrics": "AI / ML & Data Science",
    "excel-spreadsheet-analytics": "Data & Analytics",
    "data-visualisation-basics": "Data & Analytics",
    "business-communication": "Professional Skills",
    "basic-accounting": "Professional Skills",
    "project-management-agile": "Professional Skills",
}

def sync():
    quizzes_20 = build_complete_20_quizzes()
    assert len(quizzes_20) == 20, f"Expected 20 skills, got {len(quizzes_20)}"

    for q in quizzes_20:
        qid = q["id"]
        assert len(q["questions"]) == 20, f"{qid} has {len(q['questions'])} questions"
        q["group"] = SKILL_GROUPS.get(qid, q.get("category", "General"))
        q["skills_awarded"] = SKILL_AWARDS.get(qid, [q["name"]])
        q["estimated_minutes"] = 20
        # Ensure distinct options and correct format
        for item in q["questions"]:
            assert len(item["options"]) == 4, f"{qid} Q{item['id']} has != 4 options"
            assert len(set(item["options"])) == 4, f"{qid} Q{item['id']} has duplicate options: {item['options']}"
            assert 0 <= item["correctIndex"] < 4, f"{qid} Q{item['id']} invalid correctIndex"
            assert item["explanation"].strip(), f"{qid} Q{item['id']} missing explanation"

    print("All 20 skills x 20 questions (400 questions) passed strict validation!")

    # Load quiz_bank.json
    with open(QUIZ_BANK_PATH, "r", encoding="utf-8") as f:
        bank = json.load(f)

    existing_quizzes = bank.get("quizzes", [])
    
    # We will prioritize our 20 comprehensive quizzes
    # Check existing quiz IDs
    new_bank_quizzes = list(quizzes_20)
    existing_by_id = {q["id"]: q for q in existing_quizzes}
    
    # Keep other tracks (e.g., backend, cloud, aiml, embedded, sap-btp, sap-hana, etc.) if not replaced
    for eq in existing_quizzes:
        if eq["id"] not in [q["id"] for q in quizzes_20] and eq["name"] not in [q["name"] for q in quizzes_20]:
            new_bank_quizzes.append(eq)

    bank["quizzes"] = new_bank_quizzes
    bank["skills_20"] = [q["name"] for q in quizzes_20]

    with open(QUIZ_BANK_PATH, "w", encoding="utf-8") as f:
        json.dump(bank, f, indent=2)

    print(f"Saved {len(new_bank_quizzes)} quizzes into {QUIZ_BANK_PATH}")

    # Also sync into fresher_catalog.json
    with open(CATALOG_PATH, "r", encoding="utf-8") as f:
        catalog = json.load(f)

    catalog["skill_quizzes_20"] = quizzes_20
    catalog["skill_quizzes"] = quizzes_20
    with open(CATALOG_PATH, "w", encoding="utf-8") as f:
        json.dump(catalog, f, indent=2)

    print(f"Saved 20 skills into {CATALOG_PATH}")

if __name__ == "__main__":
    sync()
