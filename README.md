# Family Medical Health Track

A privacy-first cross-platform mobile app concept for recording family medical history, with optional integration to DNA data providers for **medical use only**.

## Vision

Build a secure mobile app that helps families:

- Record multi-generational medical history.
- Identify inherited risk patterns.
- Securely import and link DNA insights from approved providers.
- Share clinically relevant summaries with healthcare professionals.

## Core Principles

1. **Medical purpose only**: No ancestry marketing features; no non-medical profiling.
2. **User-controlled consent**: Explicit, revocable consent for every data-sharing action.
3. **High security by design**: Encryption, strong authentication, and auditable access.
4. **Data minimization**: Collect only what is necessary for care and risk assessment.
5. **Compliance-ready architecture**: Design for HIPAA/GDPR-style controls from day one.

## Proposed Features

### Family Medical History
- Add family members and relationship mapping (parents, siblings, grandparents, etc.).
- Record diagnoses, age at onset, treatment notes, allergies, and major procedures.
- Track hereditary conditions (e.g., diabetes, cancer clusters, cardiovascular risk).
- Timeline view of major events.

### DNA Medical Integration (Optional)
- Link DNA reports from approved providers via secure APIs/files.
- Store only medically relevant findings where possible (e.g., variant + interpretation).
- Map DNA risk flags to family history trends.
- Display confidence level and source provenance for each genetic insight.

### Security and Access
- Multi-factor authentication (MFA).
- Biometric unlock on device.
- Role-based access controls for family members and invited clinicians.
- Immutable audit logs for all sensitive data access/export.


### Family Account Linking and Sharing
- Link multiple adult family accounts into one shared family graph.
- Invite members by email/phone with expiring invite tokens.
- Let each member choose granular permissions (view-only vs editor).
- Support clinician-limited and time-bounded sharing access.
- Keep a full audit trail of every sharing action and permission change.

### Clinical Interoperability
- Export standardized summaries (PDF + FHIR-ready JSON).
- Share temporary, expiring access links with clinicians.
- Consent ledger indicating what was shared, when, and with whom.

## Suggested Tech Stack

- **Mobile**: Flutter or React Native.
- **Backend API**: Node.js (NestJS) or Python (FastAPI).
- **Database**: PostgreSQL with row-level security.
- **Sensitive fields**: Envelope encryption with KMS-managed keys.
- **Auth**: OAuth 2.1 / OpenID Connect + MFA.
- **Infra**: Zero-trust network model, private subnets, WAF, SIEM logging.

## Repository Structure (initial)

- `README.md` – Project overview and roadmap.
- `docs/security-architecture.md` – Security-first technical design.
- `docs/data-model.md` – Initial schema for family history + DNA medical data.

- `docs/medical-issues-catalog.md` – Built-in medical issues plus user-defined entry model.

## Disclaimer

This project handles highly sensitive health and genetic data. Any production deployment should be reviewed by legal, compliance, and clinical governance teams before use.
