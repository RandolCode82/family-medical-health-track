# Medical Issues Catalog and User-Defined Entries

This catalog gives the app a strong default list of trackable hereditary and chronic conditions while still allowing users to add custom medical information.

## 1) Built-in Medical Issue Categories

## Cancer History
- Breast cancer
- Ovarian cancer
- Prostate cancer
- Colorectal cancer
- Pancreatic cancer
- Melanoma
- Leukemia / lymphoma

## Cardiovascular
- Hypertension
- Coronary artery disease
- Stroke / TIA
- Atrial fibrillation
- Cardiomyopathy
- Hyperlipidemia
- Aortic aneurysm

## Endocrine / Metabolic
- Type 1 diabetes
- Type 2 diabetes
- Thyroid disease (hypo/hyperthyroidism)
- Obesity
- Metabolic syndrome
- PCOS

## Neurologic / Neurodegenerative
- Epilepsy
- Migraine
- Multiple sclerosis
- Parkinson's disease
- Alzheimer's disease / dementia
- Peripheral neuropathy

## Mental and Behavioral Health
- Major depressive disorder
- Bipolar disorder
- Anxiety disorders
- ADHD
- Substance use disorder
- Schizophrenia spectrum disorders

## Respiratory / Immunology
- Asthma
- COPD
- Sleep apnea
- Autoimmune disease (RA, lupus, etc.)
- Severe allergies / anaphylaxis

## Gastrointestinal / Liver / Kidney
- Celiac disease
- Inflammatory bowel disease
- Chronic liver disease
- Chronic kidney disease
- Gallbladder disease

## Reproductive / Pregnancy
- Endometriosis
- Recurrent pregnancy loss
- Gestational diabetes history
- Preeclampsia history
- Fertility-related conditions

## Rare / Genetic Syndromes
- Cystic fibrosis
- Sickle cell disease
- Thalassemia
- Hemophilia
- Huntington's disease
- BRCA-related hereditary cancer syndrome
- Lynch syndrome

## 2) Data Fields Per Medical Issue

Each condition record should support:
- Diagnosis name (catalog or custom)
- Code system + code (SNOMED CT/ICD-10 where available)
- Age at diagnosis/onset
- Severity (mild/moderate/severe)
- Status (active/resolved/remission)
- Family side (maternal/paternal/unknown)
- Evidence source (patient report, clinician-confirmed, lab/genetic report)
- Notes (encrypted)

## 3) User-Defined Condition Entry

Users must be able to add issues not found in the built-in list:
- Free-text condition name
- Optional synonym/common name
- Optional document attachment reference
- Optional code mapping by clinician/admin later

Validation rules:
- Must preserve original user-entered text.
- Must not overwrite user content when later mapped to standardized codes.
- Should flag ambiguous terms for optional review.

## 4) Safety and UX Recommendations

- Show plain-language explanations for medical terms.
- Mark entries as "unverified" until confirmed by a clinician or report.
- Separate personal diagnosis from family-reported history.
- Provide emergency note field for clinically important conditions/allergies.
