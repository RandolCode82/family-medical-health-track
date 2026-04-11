# Initial Data Model

## Entities

## `users`
- `id` (uuid, pk)
- `email` (unique)
- `password_hash`
- `mfa_enabled`
- `created_at`

## `families`
- `id` (uuid, pk)
- `owner_user_id` (fk -> users.id)
- `name`
- `created_at`

## `family_members`
- `id` (uuid, pk)
- `family_id` (fk -> families.id)
- `full_name`
- `relationship_to_owner`
- `birth_year`
- `sex_at_birth`
- `is_living`

## `medical_conditions`
- `id` (uuid, pk)
- `member_id` (fk -> family_members.id)
- `condition_code` (SNOMED/ICD mapping where possible)
- `condition_name`
- `age_at_onset`
- `status` (active/resolved)
- `notes_encrypted`

## `genetic_findings`
- `id` (uuid, pk)
- `member_id` (fk -> family_members.id)
- `provider`
- `gene`
- `variant`
- `clinical_significance`
- `risk_summary_encrypted`
- `source_document_ref`
- `imported_at`

## `consents`
- `id` (uuid, pk)
- `user_id` (fk -> users.id)
- `category` (dna_link, clinician_share, export)
- `granted` (bool)
- `timestamp`
- `expires_at` (nullable)

## `access_audit_log`
- `id` (bigserial, pk)
- `actor_user_id` (fk -> users.id)
- `action`
- `resource_type`
- `resource_id`
- `ip_hash`
- `created_at`



## `medical_issue_catalog`
- `id` (uuid, pk)
- `category` (cancer, cardiovascular, endocrine, etc.)
- `display_name`
- `snomed_code` (nullable)
- `icd10_code` (nullable)
- `is_active`

## `member_medical_issues`
- `id` (uuid, pk)
- `member_id` (fk -> family_members.id)
- `catalog_issue_id` (fk -> medical_issue_catalog.id, nullable)
- `custom_issue_name` (nullable, preserves user input)
- `age_at_onset`
- `status` (active/resolved/remission/unknown)
- `severity` (mild/moderate/severe/unknown)
- `family_side` (maternal/paternal/unknown)
- `verification_level` (self_reported/clinician_verified/lab_verified)
- `notes_encrypted`
- `created_by_user_id` (fk -> users.id)

## `family_account_links`
- `id` (uuid, pk)
- `family_id` (fk -> families.id)
- `linked_user_id` (fk -> users.id)
- `role` (OWNER/FAMILY_EDITOR/READ_ONLY_FAMILY)
- `status` (pending/active/revoked)
- `invited_by_user_id` (fk -> users.id)
- `linked_at` (nullable)

## `share_permissions`
- `id` (uuid, pk)
- `family_id` (fk -> families.id)
- `grantee_user_id` (fk -> users.id, nullable for clinician external invite)
- `scope` (full_history/selected_members/selected_conditions)
- `permission` (view/export/comment)
- `expires_at`
- `created_by_user_id` (fk -> users.id)

## `share_invites`
- `id` (uuid, pk)
- `family_id` (fk -> families.id)
- `email_or_phone_hash`
- `invite_token_hash`
- `intended_role`
- `expires_at`
- `accepted_at` (nullable)

## Notes

- Encrypt high-risk free-text columns (notes, summaries).
- Add row-level security policies by `family_id`.
- Keep DNA raw files out of primary DB; store encrypted object references only.
- Preserve user-entered condition text even when mapped to standard codes later.
- Require explicit consent records before creating non-family clinician sharing permissions.
