# AEGIS Real Codebase Scan Report
> Generated: 2026-11-27T08:37:44.735Z | Repos: White-Caves-Frontend, White-Caves-Server, White-Caves-Web, Aegis-Sterling | Files Scanned: 9004 | Findings: 1304

## Summary by Rule
- **PHOENIX-TS-STRICT**: 1064
- **WC-UI-ALERT**: 20
- **AEG-042**: 193
- **AEGIS-TS-MIGRATION**: 27

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
| SCAN-0011 | White-Caves-Frontend | PHOENIX-TS-STRICT | MEDIUM | `src/components/crm/ArcherCRM.data.ts` | Contains @ts-ignore or @ts-nocheck suppression. |
| SCAN-0012 | White-Caves-Frontend | WC-UI-ALERT | LOW | `src/components/crm/DocumentManager/DocumentDetailModal.tsx` | Uses native alert() instead of AlertBanner / ToastContainer. |
| SCAN-0013 | White-Caves-Frontend | WC-UI-ALERT | LOW | `src/components/crm/EvangelineLegalCRM/panels/NdaStudioPanel.tsx` | Uses native alert() instead of AlertBanner / ToastContainer. |
| SCAN-0014 | White-Caves-Frontend | WC-UI-ALERT | LOW | `src/components/crm/LindaWhatsAppCRM/LindaLeadContextActions.tsx` | Uses native alert() instead of AlertBanner / ToastContainer. |
| SCAN-0015 | White-Caves-Frontend | AEG-042 | MEDIUM | `src/components/crm/PropertySearchSidebar.tsx` | 363 lines exceeds 350-line Single Purpose File ceiling. |
| SCAN-0016 | White-Caves-Frontend | WC-UI-ALERT | LOW | `src/components/crm/TenantManager/TenantLeaseWidget.tsx` | Uses native alert() instead of AlertBanner / ToastContainer. |
| SCAN-0017 | White-Caves-Frontend | WC-UI-ALERT | LOW | `src/components/crm/vesta/VestaCertificateTab.tsx` | Uses native alert() instead of AlertBanner / ToastContainer. |
| SCAN-0018 | White-Caves-Frontend | AEG-042 | MEDIUM | `src/components/dashboard/cockpit/MdDailySummaryLiveStrip.tsx` | 363 lines exceeds 350-line Single Purpose File ceiling. |
| SCAN-0019 | White-Caves-Frontend | WC-UI-ALERT | LOW | `src/components/dashboard/QuickActionFabPanel/QuickActionFabPanel.tsx` | Uses native alert() instead of AlertBanner / ToastContainer. |
| SCAN-0020 | White-Caves-Frontend | WC-UI-ALERT | LOW | `src/components/documents/ContractTemplateLibrary/ContractTemplateLibrary.tsx` | Uses native alert() instead of AlertBanner / ToastContainer. |
| SCAN-0021 | White-Caves-Frontend | WC-UI-ALERT | LOW | `src/components/documents/DocumentGenerationHub/DocumentGenerationHub.tsx` | Uses native alert() instead of AlertBanner / ToastContainer. |
| SCAN-0022 | White-Caves-Frontend | WC-UI-ALERT | LOW | `src/components/documents/ESignatureCapturepad/logic/ESignatureCapturepad.logic.ts` | Uses native alert() instead of AlertBanner / ToastContainer. |
| SCAN-0023 | White-Caves-Frontend | WC-UI-ALERT | LOW | `src/components/documents/FormADigitalGenerator/logic/FormADigitalGenerator.logic.ts` | Uses native alert() instead of AlertBanner / ToastContainer. |
| SCAN-0024 | White-Caves-Frontend | WC-UI-ALERT | LOW | `src/components/finance/FinanceEngineProductionReleaseGateWidget/FinanceEngineProductionReleaseGateWidget.logic.ts` | Uses native alert() instead of AlertBanner / ToastContainer. |
| SCAN-0025 | White-Caves-Frontend | WC-UI-ALERT | LOW | `src/components/home/InteractiveMapDrawer/InteractiveMapDrawer.tsx` | Uses native alert() instead of AlertBanner / ToastContainer. |
| SCAN-0026 | White-Caves-Frontend | PHOENIX-TS-STRICT | MEDIUM | `src/components/layout/index.ts` | Contains @ts-ignore or @ts-nocheck suppression. |
| SCAN-0027 | White-Caves-Frontend | WC-UI-ALERT | LOW | `src/components/leads/BulkLeadActionToolbar/logic/BulkLeadActionToolbar.logic.ts` | Uses native alert() instead of AlertBanner / ToastContainer. |
| SCAN-0028 | White-Caves-Frontend | WC-UI-ALERT | LOW | `src/components/media/CloudinaryUploader/CloudinaryUploader.tsx` | Uses native alert() instead of AlertBanner / ToastContainer. |
| SCAN-0029 | White-Caves-Frontend | WC-UI-ALERT | LOW | `src/components/offplan/DeveloperDamPortal/DeveloperDamPortal.tsx` | Uses native alert() instead of AlertBanner / ToastContainer. |
| SCAN-0030 | White-Caves-Frontend | WC-UI-ALERT | LOW | `src/components/properties/PropertyHeroGalleryLightbox/PropertyHeroGalleryLightbox.tsx` | Uses native alert() instead of AlertBanner / ToastContainer. |