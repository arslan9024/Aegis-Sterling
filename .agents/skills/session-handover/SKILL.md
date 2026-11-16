---
name: session-handover
description: Generates standardized, executable next-session handoff prompts with state auditing, git branch tracking, and interview questions.
---

# Session Handover Protocol

When concluding any session or when requested by the user, produce an authoritative, ready-to-run prompt for the next agent session.

## Core Rules
1. Never leave uncommitted changes on `main`.
2. Audit all tests and build status before emitting the handover.
3. Include an interactive decision matrix (`#grill-me` style) so the user controls architecture choices.
4. Always provide the exact next prompt in a dedicated code block for 1-click copy-paste.
