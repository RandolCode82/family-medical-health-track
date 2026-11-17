import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("familyMedicalHistory.db");

const sampleMembers = [
  {
    id: "1",
    name: "Maria Jones",
    relationship: "Self",
    conditions: [
      { name: "Hypertension", category: "Cardiovascular" },
      { name: "Asthma", category: "Respiratory" },
    ],
    medications: ["Lisinopril", "Albuterol"],
    notes: "Keep annual cardiology check-ups and track blood pressure daily.",
    rareDiseases: ["Ehlers-Danlos syndrome"],
    generation: 0,
  },
  {
    id: "2",
    name: "David Jones",
    relationship: "Father",
    conditions: [
      { name: "Type 2 Diabetes", category: "Endocrine" },
      { name: "High cholesterol", category: "Cardiovascular" },
    ],
    medications: ["Metformin", "Atorvastatin"],
    notes: "Family history of diabetes and stroke. Encourage diet and exercise.",
    rareDiseases: ["Fabry disease"],
    generation: -1,
  },
  {
    id: "3",
    name: "Evelyn Smith",
    relationship: "Mother",
    conditions: [{ name: "Osteoarthritis", category: "Musculoskeletal" }],
    medications: ["Ibuprofen"],
    notes: "Monitor joint pain and mobility. Schedule yearly bone density scan.",
    rareDiseases: ["Gaucher disease"],
    generation: -1,
  },
];

const sampleRareDiseases = [
  {
    name: "Ehlers-Danlos syndrome",
    description:
      "A genetic connective tissue disorder that can affect joints, skin and blood vessels.",
    category: "Genetic Disorders",
    isRare: 1,
    memberIds: ["1"],
  },
  {
    name: "Fabry disease",
    description:
      "An inherited disorder that can lead to kidney failure, heart disease, and stroke.",
    category: "Metabolic Disorders",
    isRare: 1,
    memberIds: ["2"],
  },
  {
    name: "Gaucher disease",
    description:
      "A genetic condition caused by insufficient enzyme activity, leading to organ enlargement.",
    category: "Enzyme Deficiency",
    isRare: 1,
    memberIds: ["3"],
  },
];

const sampleFamilyTree = [
  { memberId: "1", relativeId: "2", relation: "Father" },
  { memberId: "1", relativeId: "3", relation: "Mother" },
  { memberId: "2", relativeId: "3", relation: "Spouse" },
];

function serialize(value) {
  return JSON.stringify(value);
}

function deserialize(value) {
  try {
    return value ? JSON.parse(value) : [];
  } catch {
    return [];
  }
}

function executeSqlAsync(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          sql,
          params,
          (_, result) => resolve(result),
          (_, error) => {
            reject(error);
            return false;
          }
        );
      },
      reject
    );
  });
}

function formatMember(record) {
  return {
    ...record,
    conditions: deserialize(record.conditions),
    medications: deserialize(record.medications),
    rareDiseases: deserialize(record.rareDiseases),
  };
}

export async function initDatabase() {
  await executeSqlAsync(
    `CREATE TABLE IF NOT EXISTS members (
      id TEXT PRIMARY KEY,
      name TEXT,
      relationship TEXT,
      conditions TEXT,
      medications TEXT,
      notes TEXT,
      rareDiseases TEXT,
      generation INTEGER DEFAULT 0
    );`
  );

  await executeSqlAsync(
    `CREATE TABLE IF NOT EXISTS family_tree (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      member_id TEXT,
      relative_id TEXT,
      relation TEXT
    );`
  );

  await executeSqlAsync(
    `CREATE TABLE IF NOT EXISTS rare_diseases (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      description TEXT,
      category TEXT,
      isRare INTEGER,
      memberIds TEXT
    );`
  );

  const countResult = await executeSqlAsync("SELECT COUNT(*) AS count FROM members;");
  const count = countResult.rows.item(0).count;

  if (count === 0) {
    await seedSampleData();
  }
}

async function seedSampleData() {
  for (const member of sampleMembers) {
    await executeSqlAsync(
      `INSERT INTO members (id, name, relationship, conditions, medications, notes, rareDiseases, generation)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        member.id,
        member.name,
        member.relationship,
        serialize(member.conditions),
        serialize(member.medications),
        member.notes,
        serialize(member.rareDiseases),
        member.generation,
      ]
    );
  }

  for (const relation of sampleFamilyTree) {
    await executeSqlAsync(
      `INSERT INTO family_tree (member_id, relative_id, relation) VALUES (?, ?, ?);`,
      [relation.memberId, relation.relativeId, relation.relation]
    );
  }

  for (const disease of sampleRareDiseases) {
    await executeSqlAsync(
      `INSERT INTO rare_diseases (name, description, category, isRare, memberIds) VALUES (?, ?, ?, ?, ?);`,
      [disease.name, disease.description, disease.category, disease.isRare, serialize(disease.memberIds)]
    );
  }
}

export async function getFamilyMembers() {
  const result = await executeSqlAsync("SELECT * FROM members ORDER BY name ASC;");
  return result.rows._array.map(formatMember);
}

export async function getRareDiseases() {
  const result = await executeSqlAsync("SELECT * FROM rare_diseases ORDER BY name ASC;");
  return result.rows._array.map((item) => ({
    ...item,
    memberIds: deserialize(item.memberIds),
  }));
}

export async function searchRareDiseases(query) {
  const normalized = `%${query.toLowerCase().trim()}%`;
  const result = await executeSqlAsync(
    `SELECT * FROM rare_diseases WHERE LOWER(name) LIKE ? OR LOWER(description) LIKE ? ORDER BY name ASC;`,
    [normalized, normalized]
  );
  return result.rows._array.map((item) => ({
    ...item,
    memberIds: deserialize(item.memberIds),
  }));
}

export async function getFamilyTree() {
  const query = `
    SELECT
      family_tree.id,
      family_tree.relation,
      family_tree.member_id,
      family_tree.relative_id,
      m1.name AS memberName,
      m2.name AS relativeName
    FROM family_tree
    JOIN members AS m1 ON m1.id = family_tree.member_id
    JOIN members AS m2 ON m2.id = family_tree.relative_id
    ORDER BY family_tree.id ASC;
  `;
  const result = await executeSqlAsync(query);
  return result.rows._array;
}

export async function addFamilyMember(member, relatedMemberId, relation) {
  let generation = 0;

  if (relatedMemberId && relation) {
    const relatedMember = await executeSqlAsync("SELECT generation FROM members WHERE id = ?;", [relatedMemberId]);
    if (relatedMember.rows.length > 0) {
      const relatedGen = relatedMember.rows.item(0).generation;
      const genOffset = getGenerationOffset(relation);
      generation = relatedGen + genOffset;

      if (Math.abs(generation) > 5) {
        throw new Error("Cannot add member: exceeds 5-generation limit.");
      }
    }
  }

  await executeSqlAsync(
    `INSERT INTO members (id, name, relationship, conditions, medications, notes, rareDiseases, generation)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
    [
      member.id,
      member.name,
      member.relationship,
      serialize(member.conditions || []),
      serialize(member.medications || []),
      member.notes || "",
      serialize(member.rareDiseases || []),
      generation,
    ]
  );

  if (relatedMemberId && relation) {
    await executeSqlAsync(
      `INSERT INTO family_tree (member_id, relative_id, relation) VALUES (?, ?, ?);`,
      [member.id, relatedMemberId, relation]
    );
  }
}

function getGenerationOffset(relation) {
  const offsets = {
    "Father": -1,
    "Mother": -1,
    "Son": 1,
    "Daughter": 1,
    "Brother": 0,
    "Sister": 0,
    "Grandfather": -2,
    "Grandmother": -2,
    "Grandson": 2,
    "Granddaughter": 2,
    "Uncle": -1,
    "Aunt": -1,
    "Nephew": 1,
    "Niece": 1,
    "Cousin": 0,
  };
  return offsets[relation] || 0;
}

export async function deleteFamilyMember(memberId) {
  await executeSqlAsync("DELETE FROM members WHERE id = ?;", [memberId]);
  await executeSqlAsync("DELETE FROM family_tree WHERE member_id = ? OR relative_id = ?;", [memberId, memberId]);
}

export async function deleteRareDisease(diseaseId) {
  await executeSqlAsync("DELETE FROM rare_diseases WHERE id = ?;", [diseaseId]);
}

export async function deleteFamilyRelation(relationId) {
  await executeSqlAsync("DELETE FROM family_tree WHERE id = ?;", [relationId]);
}

export async function addRareDisease(disease) {
  await executeSqlAsync(
    `INSERT INTO rare_diseases (name, description, category, isRare, memberIds) VALUES (?, ?, ?, ?, ?);`,
    [disease.name, disease.description, disease.category, disease.isRare ? 1 : 0, serialize(disease.memberIds || [])]
  );
}
