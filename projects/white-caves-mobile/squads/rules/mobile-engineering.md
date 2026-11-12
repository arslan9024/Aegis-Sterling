# 📱 Mobile Team — Aegis Engineering Rules
# Project: White-Caves-Mobile | Team Lead: @Iris (Dept 03 Mobile)

## Context
This is the React Native cross-platform mobile app for White Caves Real Estate.

## Mandatory Rules
1. **Cross-Platform Parity:** Every screen must render on both iOS (Expo) and Android without conditional platform hacks where avoidable.
2. **Secure Storage:** Auth tokens and biometric session tokens go into `expo-secure-store` (Keychain/KeyStore). Never AsyncStorage for sensitive data.
3. **Offline-First:** Property listings, client contact cards, and notifications must have offline fallbacks using React Query `staleTime`/`cacheTime`.
4. **LTR/RTL:** Use `I18nManager.forceRTL()` and Arabic locale bundles for UAE users.
5. **Native Performance:** Avoid inline anonymous functions in `FlatList` renders. Memoize with `React.memo` and `useCallback` for list items.
6. **Deep Linking:** Every CRM action (view property, open contract) must be reachable via a registered deep link scheme.

## Assigned Agents
- **@Iris** — Cross-Platform Mobile Engineering Lead
- **@Invoice** — i18n/RTL, Arabic localization, FinTech formatting
- **@Rachel_QA** — Mobile E2E, Detox test suites
