# AEGIS Real Codebase Scan Report
> Generated: 2026-11-20T23:40:14.514Z | Repos: White-Caves-Frontend, White-Caves-Server, White-Caves-Web, Aegis-Sterling | Files Scanned: 8620 | Findings: 1505

## Summary by Rule
- **PHOENIX-TS-STRICT**: 975
- **AEG-042**: 457
- **WC-UI-ALERT**: 34
- **AEGIS-TS-MIGRATION**: 39

## Top 30 Concrete Findings
| ID | Repo | Rule | Severity | File | Detail |
| :--- | :--- | :--- | :--- | :--- | :--- |
| SCAN-0001 | White-Caves-Frontend | PHOENIX-TS-STRICT | MEDIUM | `src/adapters/BasePortalAdapter.helpers.ts` | Contains @ts-ignore or @ts-nocheck suppression. |
| SCAN-0002 | White-Caves-Frontend | PHOENIX-TS-STRICT | MEDIUM | `src/adapters/BasePortalAdapter.ts` | Contains @ts-ignore or @ts-nocheck suppression. |
| SCAN-0003 | White-Caves-Frontend | PHOENIX-TS-STRICT | MEDIUM | `src/adapters/bayutAdapter.helpers.ts` | Contains @ts-ignore or @ts-nocheck suppression. |
| SCAN-0004 | White-Caves-Frontend | PHOENIX-TS-STRICT | MEDIUM | `src/adapters/BayutAdapter.ts` | Contains @ts-ignore or @ts-nocheck suppression. |
| SCAN-0005 | White-Caves-Frontend | PHOENIX-TS-STRICT | MEDIUM | `src/adapters/DubizzleAdapter.helpers.ts` | Contains @ts-ignore or @ts-nocheck suppression. |
| SCAN-0006 | White-Caves-Frontend | PHOENIX-TS-STRICT | MEDIUM | `src/adapters/DubizzleAdapter.ts` | Contains @ts-ignore or @ts-nocheck suppression. |
| SCAN-0007 | White-Caves-Frontend | PHOENIX-TS-STRICT | MEDIUM | `src/adapters/PropertyFinderAdapter.helpers.ts` | Contains @ts-ignore or @ts-nocheck suppression. |
| SCAN-0008 | White-Caves-Frontend | PHOENIX-TS-STRICT | MEDIUM | `src/adapters/PropertyFinderAdapter.ts` | Contains @ts-ignore or @ts-nocheck suppression. |
| SCAN-0009 | White-Caves-Frontend | PHOENIX-TS-STRICT | MEDIUM | `src/adapters/SkyloovAdapter.helpers.ts` | Contains @ts-ignore or @ts-nocheck suppression. |
| SCAN-0010 | White-Caves-Frontend | PHOENIX-TS-STRICT | MEDIUM | `src/adapters/SkyloovAdapter.ts` | Contains @ts-ignore or @ts-nocheck suppression. |
| SCAN-0011 | White-Caves-Frontend | AEG-042 | HIGH | `src/aegis-protocols/CANONICAL_108_DIVISIONS_MATRIX.ts` | 1014 lines exceeds 350-line Single Purpose File ceiling. |
| SCAN-0012 | White-Caves-Frontend | AEG-042 | HIGH | `src/components/admin/AdminDashboard.styles.ts` | 865 lines exceeds 350-line Single Purpose File ceiling. |
| SCAN-0013 | White-Caves-Frontend | AEG-042 | MEDIUM | `src/components/admin/AdminDashboardPanels.tsx` | 414 lines exceeds 350-line Single Purpose File ceiling. |
| SCAN-0014 | White-Caves-Frontend | AEG-042 | MEDIUM | `src/components/auth/Auth.tsx` | 440 lines exceeds 350-line Single Purpose File ceiling. |
| SCAN-0015 | White-Caves-Frontend | AEG-042 | MEDIUM | `src/components/auth/AuthModal.tsx` | 595 lines exceeds 350-line Single Purpose File ceiling. |
| SCAN-0016 | White-Caves-Frontend | AEG-042 | MEDIUM | `src/components/ClickToChat.tsx` | 569 lines exceeds 350-line Single Purpose File ceiling. |
| SCAN-0017 | White-Caves-Frontend | AEG-042 | MEDIUM | `src/components/common/CommandPalette.tsx` | 491 lines exceeds 350-line Single Purpose File ceiling. |
| SCAN-0018 | White-Caves-Frontend | WC-UI-ALERT | LOW | `src/components/compliance/AMLPolicyScreeningWidget/AMLPolicyScreeningWidget.tsx` | Uses native alert() instead of AlertBanner / ToastContainer. |
| SCAN-0019 | White-Caves-Frontend | WC-UI-ALERT | LOW | `src/components/compliance/ComplianceArchitectureWidget/ComplianceArchitectureWidget.logic.ts` | Uses native alert() instead of AlertBanner / ToastContainer. |
| SCAN-0020 | White-Caves-Frontend | WC-UI-ALERT | LOW | `src/components/compliance/DETLicenseMonitorWidget/DETLicenseMonitorWidget.logic.ts` | Uses native alert() instead of AlertBanner / ToastContainer. |
| SCAN-0021 | White-Caves-Frontend | WC-UI-ALERT | LOW | `src/components/compliance/HQEjariRenewalWidget/HQEjariRenewalWidget.logic.ts` | Uses native alert() instead of AlertBanner / ToastContainer. |
| SCAN-0022 | White-Caves-Frontend | WC-UI-ALERT | LOW | `src/components/compliance/ICPEstablishmentCardWidget/ICPEstablishmentCardWidget.logic.ts` | Uses native alert() instead of AlertBanner / ToastContainer. |
| SCAN-0023 | White-Caves-Frontend | WC-UI-ALERT | LOW | `src/components/compliance/RERACertificateTrackerWidget/RERACertificateTrackerWidget.logic.ts` | Uses native alert() instead of AlertBanner / ToastContainer. |
| SCAN-0024 | White-Caves-Frontend | WC-UI-ALERT | LOW | `src/components/compliance/RERAORNAutoRenewalWidget/RERAORNAutoRenewalWidget.logic.ts` | Uses native alert() instead of AlertBanner / ToastContainer. |
| SCAN-0025 | White-Caves-Frontend | WC-UI-ALERT | LOW | `src/components/compliance/UAE_PDPL_DataPrivacyWidget/UAE_PDPL_DataPrivacyWidget.logic.ts` | Uses native alert() instead of AlertBanner / ToastContainer. |
| SCAN-0026 | White-Caves-Frontend | AEG-042 | MEDIUM | `src/components/crm/AICommandCenter/AiAssistantCrudTable.tsx` | 428 lines exceeds 350-line Single Purpose File ceiling. |
| SCAN-0027 | White-Caves-Frontend | AEG-042 | MEDIUM | `src/components/crm/AICommandCenter/AICommandCenter.tsx` | 453 lines exceeds 350-line Single Purpose File ceiling. |
| SCAN-0028 | White-Caves-Frontend | PHOENIX-TS-STRICT | MEDIUM | `src/components/crm/ArcherCRM.data.ts` | Contains @ts-ignore or @ts-nocheck suppression. |
| SCAN-0029 | White-Caves-Frontend | AEG-042 | HIGH | `src/components/crm/AtlasProjectsCRM.tsx` | 1036 lines exceeds 350-line Single Purpose File ceiling. |
| SCAN-0030 | White-Caves-Frontend | AEG-042 | MEDIUM | `src/components/crm/CadenceRuleAdmin.tsx` | 689 lines exceeds 350-line Single Purpose File ceiling. |