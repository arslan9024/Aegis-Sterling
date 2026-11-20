---
name: listing-web-crawler
description: Crawls public real-estate listing pages or parses raw listing copy to extract Dubai property specs, synthesize 100% original SEO-optimized White Caves Real Estate LLC listings with AI, attach verified Google Drive unit photos (via Henry's Area/Project/Unit formula), and publish directly to White-Caves-Web.
---

# Listing Web Crawler & AI Listing Generator Skill (Daisy `MGR-05-2`)

## Purpose
Enable **Daisy** (Residential Leasing & Web Publishing) and **Mary** (Inventory Vault) to research comparable online Dubai listings (especially **DAMAC Hills 2 / Akoya Oxygen** clusters: Camelia, Albizia, Basswood, Pacifica, Clivia, Amargo, Vardon, Zinnia, Mimosa, Juniper), extract structured property specifications, and generate **100% original, SEO-optimized, RERA-ready White Caves listings** paired with verified Google Drive photos from `Inventory Areas / <Area> / <Project> / <Unit>`.

## Compliance & Safety Rules (Mandatory)
1. **Never bypass anti-bot walls or CAPTCHAs:** If a portal returns HTTP 403/429, Cloudflare Turnstile, or a CAPTCHA gate, stop immediately, return `blockedByPortal: true`, and prompt the user to paste the listing text or public brochure copy into `rawText`.
2. **Zero Plagiarism / Copyright-Safe Synthesis:** Never copy competitor descriptions verbatim. Extract factual specs (bedrooms, bathrooms, BUA/plot sqft, rent AED, cheques, furnishing, layout type, cluster amenities) and generate original White Caves copy.
3. **Verified Media Priority:** Always prefer verified photos from Henry's Google Drive formula (`Inventory Areas / <Area> / <Project> / <Unit Number> / House Pictures`) over external portal images.

## Workflow Steps
1. **Acquire Source Spec:**
   - Call `POST /api/daisy/crawler/generate-listing` with either `{ url }` (public listing/developer page) or `{ rawText }` (pasted listing/broker blast) plus optional `{ area, project, unitNumber, attachDrivePhotos: true }`.
2. **Extract Structured Fields:**
   - Community (`DAMAC Hills 2`), Cluster/Project (`Pacifica`, `Camelia`, etc.), Bedrooms, Bathrooms, BUA/Plot sq.ft, Annual Rent AED, Cheques, Furnished status, Amenities, RERA/Trakheesi reference if present.
3. **Link Verified Drive Photos (Henry Formula):**
   - When `area`, `project`, and `unitNumber` are provided (e.g., `Damac Hills 2 / Pacifica / 343`), query `queryPropertyUnit()` to attach verified unit photos from `House Pictures`.
4. **AI Listing Synthesis:**
   - Uses local Ollama (`llama3.1:8b-instant`) when available, with a deterministic Dubai luxury leasing copywriter fallback.
   - Outputs:
     - `seoTitle` & `metaDescription` (tuned for Google Dubai rental search)
     - `slug` (e.g., `damac-hills-2-pacifica-3br-villa-for-rent-unit-343`)
     - `headline`, `description`, `highlights[]`
     - `whatsappCtaUrl` (direct link to Linda `+971505760056` pre-filled with cluster & unit)
     - `jsonLd` (`RealEstateListing` schema for `White-Caves-Web`)
5. **Publish to White-Caves-Web:**
   - Sync into Mary's Inventory Vault (`/api/properties`) and Daisy's SEO cluster pages (`/rent/damac-hills-2/<cluster>`).
