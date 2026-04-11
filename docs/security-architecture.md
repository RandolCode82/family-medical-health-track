# Security Architecture (Medical + Genetic Data)

## 1) Threat Model Focus

Primary risks:
- Unauthorized access to PHI/genetic data.
- Credential stuffing/account takeover.
- Insider misuse.
- Data exfiltration from backups/logging pipelines.
- Improper third-party DNA integration.

## 2) Data Classification

- **Level 1 (Critical)**: Genetic variants, medical diagnoses, medications, clinician notes.
- **Level 2 (Sensitive)**: Contact details, relationship graph.
- **Level 3 (Operational)**: Telemetry with no direct identifiers.

Controls scale by classification.

## 3) Encryption Standards

- **In transit**: TLS 1.3 only.
- **At rest (DB + blobs)**: AES-256.
- **Field-level**: Encrypt L1 fields using envelope encryption and per-tenant DEKs.
- **Key management**: KMS/HSM-backed CMKs, annual rotation minimum.

## 4) Identity and Access

- OIDC with PKCE for mobile clients.
- Required MFA for all users.
- Step-up authentication for exports, DNA linking, and clinician sharing.
- Role model:
  - `OWNER` (primary account)
  - `FAMILY_EDITOR`
  - `READ_ONLY_FAMILY`
  - `CLINICIAN_TEMP`
- Short-lived JWT access tokens + rotating refresh tokens.

## 5) Secure DNA Provider Integration

- Provider allowlist and contractual medical-use attestation.
- Signed webhook verification where applicable.
- Store provider token references in vault; never plaintext in DB.
- Import pipeline validates:
  - schema,
  - source integrity,
  - medical relevance filter.

## 6) Auditability

Log every sensitive action:
- view/edit/delete medical record,
- DNA import/export,
- permission/consent changes,
- clinician share actions.

Audit logs should be immutable and tamper-evident.

## 7) Privacy Controls

- Explicit consent per category: family history, genetic insights, sharing.
- Consent revocation at any time.
- Data retention policy and secure deletion workflow.
- Data export package for user portability.

## 8) Incident Response Baseline

- Automated anomaly detection (impossible travel, unusual export spikes).
- 24/7 alerting for high-severity access anomalies.
- Key compromise playbook with rapid rotation and session revocation.
- Breach notification workflow aligned with jurisdictional rules.

## 9) Secure Development Lifecycle

- Mandatory peer review.
- SAST/DAST and dependency scanning in CI.
- Secrets scanning + commit signing.
- Regular penetration tests and threat-model refresh.

## 10) Family Linking and Sharing Controls

- Invite links must be short-lived, single-use, and token-hashed at rest.
- Require re-authentication before changing family sharing permissions.
- Apply least-privilege defaults (`READ_ONLY_FAMILY`) for new links.
- Enforce explicit expiry for clinician and external share permissions.
- Record complete audit events for invite creation, acceptance, revocation, and scope changes.
