# AEGIS Real Codebase Scan Report
> Generated: 2026-11-22T23:58:37.017Z | Repos: White-Caves-Frontend, White-Caves-Server, White-Caves-Web, Aegis-Sterling | Files Scanned: 9391 | Findings: 1412

## Summary by Rule
- **PHOENIX-TS-STRICT**: 969
- **AEG-042**: 380
- **WC-UI-ALERT**: 24
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
| SCAN-0011 | White-Caves-Frontend | AEG-042 | MEDIUM | `src/components/admin/AdminDashboardPanels.tsx` | 414 lines exceeds 350-line Single Purpose File ceiling. |
| SCAN-0012 | White-Caves-Frontend | AEG-042 | MEDIUM | `src/components/auth/Auth.tsx` | 440 lines exceeds 350-line Single Purpose File ceiling. |
| SCAN-0013 | White-Caves-Frontend | AEG-042 | MEDIUM | `src/components/common/CommandPalette.tsx` | 491 lines exceeds 350-line Single Purpose File ceiling. |
| SCAN-0014 | White-Caves-Frontend | AEG-042 | MEDIUM | `src/components/crm/AICommandCenter/AiAssistantCrudTable.tsx` | 428 lines exceeds 350-line Single Purpose File ceiling. |
| SCAN-0015 | White-Caves-Frontend | AEG-042 | MEDIUM | `src/components/crm/AICommandCenter/AICommandCenter.tsx` | 453 lines exceeds 350-line Single Purpose File ceiling. |
| SCAN-0016 | White-Caves-Frontend | PHOENIX-TS-STRICT | MEDIUM | `src/components/crm/ArcherCRM.data.ts` | Contains @ts-ignore or @ts-nocheck suppression. |
| SCAN-0017 | White-Caves-Frontend | AEG-042 | MEDIUM | `src/components/crm/CipherMarketCRM/CipherMarketCRM.panels.tsx` | 530 lines exceeds 350-line Single Purpose File ceiling. |
| SCAN-0018 | White-Caves-Frontend | AEG-042 | MEDIUM | `src/components/crm/CRMShell/CRMShell.panels.tsx` | 442 lines exceeds 350-line Single Purpose File ceiling. |
| SCAN-0019 | White-Caves-Frontend | AEG-042 | MEDIUM | `src/components/crm/CrossIntegrationPanel/index.tsx` | 452 lines exceeds 350-line Single Purpose File ceiling. |
| SCAN-0020 | White-Caves-Frontend | AEG-042 | MEDIUM | `src/components/crm/DaisyLeasingCRM_NEW/data/leasing.ts` | 442 lines exceeds 350-line Single Purpose File ceiling. |
| SCAN-0021 | White-Caves-Frontend | AEG-042 | MEDIUM | `src/components/crm/DaisyLeasingCRM_NEW/tabs/AnalyticsTab.tsx` | 406 lines exceeds 350-line Single Purpose File ceiling. |
| SCAN-0022 | White-Caves-Frontend | AEG-042 | MEDIUM | `src/components/crm/data/features/ninaFeatures.tsx` | 507 lines exceeds 350-line Single Purpose File ceiling. |
| SCAN-0023 | White-Caves-Frontend | AEG-042 | MEDIUM | `src/components/crm/DealManager/DealEditDrawer.tsx` | 440 lines exceeds 350-line Single Purpose File ceiling. |
| SCAN-0024 | White-Caves-Frontend | AEG-042 | MEDIUM | `src/components/crm/DepartmentManager/DepartmentResearchedPool.data.ts` | 405 lines exceeds 350-line Single Purpose File ceiling. |
| SCAN-0025 | White-Caves-Frontend | AEG-042 | MEDIUM | `src/components/crm/DepartmentManager/DepartmentSubItemsModal.styles.ts` | 398 lines exceeds 350-line Single Purpose File ceiling. |
| SCAN-0026 | White-Caves-Frontend | AEG-042 | MEDIUM | `src/components/crm/DepartmentManager/SelectedDepartmentSquadsDeck.tsx` | 358 lines exceeds 350-line Single Purpose File ceiling. |
| SCAN-0027 | White-Caves-Frontend | WC-UI-ALERT | LOW | `src/components/crm/DocumentManager/DocumentDetailModal.tsx` | Uses native alert() instead of AlertBanner / ToastContainer. |
| SCAN-0028 | White-Caves-Frontend | WC-UI-ALERT | LOW | `src/components/crm/EvangelineLegalCRM/panels/NdaStudioPanel.tsx` | Uses native alert() instead of AlertBanner / ToastContainer. |
| SCAN-0029 | White-Caves-Frontend | AEG-042 | MEDIUM | `src/components/crm/HenryAuditCRM.tsx` | 455 lines exceeds 350-line Single Purpose File ceiling. |
| SCAN-0030 | White-Caves-Frontend | AEG-042 | MEDIUM | `src/components/crm/HenryDocumentStudio/components/HenryTenancyContractPreview.tsx` | 541 lines exceeds 350-line Single Purpose File ceiling. |