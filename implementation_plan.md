# Refactor: Server → Client Components for `auth_token` Cookie Access

## Problem

All cookies (`auth_token`, `user_id`, `registree_id`) are set with `httpOnly: true`. In deployment, Next.js Server Components cannot access these cross-origin cookies. Client Components also cannot read them via `document.cookie`.

## Strategy

Two complementary approaches:

| Concern | Approach |
|---|---|
| **Data fetching** (ProductList, AgentsList, etc.) | Convert to Client Components. Call backend directly via [fetch](file:///c:/Users/Arjohn%20Banado/Documents/mainProject/Main-SE101-/frontend/src/app/%28user%29/bookings/guard/BookingsGuard.tsx#18-36) with `credentials: "include"` — browser sends httpOnly cookies automatically |
| **Layout guards** (need `user_id`) | Middleware already decodes JWT → inject `user_id` into a custom **request header** (`x-user-id`) so layouts can read it without `cookies()` |
| **Verify-code page** (needs `registree_id`) | Same header injection approach via middleware |

## User Review Required

> [!IMPORTANT]
> **Security**: `x-user-id` header is set by trusted Next.js middleware only, never from the client. Layouts read it via `headers()` from `next/headers` (server-side). This is a standard Next.js pattern for middleware→layout communication.

> [!WARNING]
> **Proxy module changes**: [verifyUser](file:///c:/Users/Arjohn%20Banado/Documents/mainProject/Main-SE101-/frontend/src/proxyModules/verifyUser.ts#4-37), [verifyGuest](file:///c:/Users/Arjohn%20Banado/Documents/mainProject/Main-SE101-/frontend/src/proxyModules/verifyGuest.ts#4-47), and [verifyAdmin](file:///c:/Users/Arjohn%20Banado/Documents/mainProject/Main-SE101-/frontend/src/proxyModules/verifyAdmin.ts#4-25) will inject `x-user-id` into the request headers. The `user_id` cookie is kept for backward compatibility but will no longer be the primary source for layouts.

> [!IMPORTANT]
> **Suspense boundaries**: Since data-fetching moves into Client Components (via `useEffect`), the `<Suspense>` wrappers in parent pages will be removed. The same skeleton JSX moves into each component's own `loading` state.

---

## Proposed Changes

### Proxy Modules (inject headers)

#### [MODIFY] [verifyUser.ts](file:///c:/Users/Arjohn%20Banado/Documents/mainProject/Main-SE101-/frontend/src/proxyModules/verifyUser.ts)

Add `x-user-id` request header alongside existing `user_id` cookie:

```diff
 if ((role === "user" || role === "agent") && userId) {
-  const response = NextResponse.next();
+  const requestHeaders = new Headers(req.headers);
+  requestHeaders.set("x-user-id", `${userId}`);
+  const response = NextResponse.next({
+    request: { headers: requestHeaders },
+  });
```

#### [MODIFY] [verifyGuest.ts](file:///c:/Users/Arjohn%20Banado/Documents/mainProject/Main-SE101-/frontend/src/proxyModules/verifyGuest.ts)

Same header injection for both user and admin branches.

#### [MODIFY] [verifyAdmin.ts](file:///c:/Users/Arjohn%20Banado/Documents/mainProject/Main-SE101-/frontend/src/proxyModules/verifyAdmin.ts)

Inject `x-user-id` header when role is admin:

```diff
 if (role === "admin") {
-  return NextResponse.next();
+  const userId = payload.user_id;
+  const requestHeaders = new Headers(req.headers);
+  requestHeaders.set("x-user-id", `${userId}`);
+  return NextResponse.next({ request: { headers: requestHeaders } });
 }
```

#### [MODIFY] [verifyAuthenticated.ts](file:///c:/Users/Arjohn%20Banado/Documents/mainProject/Main-SE101-/frontend/src/proxyModules/verifyAuthenticated.ts)

Inject `x-user-id` header for all authenticated roles.

#### [MODIFY] [verifyRegistree.ts](file:///c:/Users/Arjohn%20Banado/Documents/mainProject/Main-SE101-/frontend/src/proxyModules/verifyRegistree.ts)

Inject `x-registree-id` header:

```diff
+  const requestHeaders = new Headers(req.headers);
+  requestHeaders.set("x-registree-id", registree_id ?? "");
-  return NextResponse.next();
+  return NextResponse.next({ request: { headers: requestHeaders } });
```

---

### Shared Utility (new)

#### [NEW] [fetchWithAuthClient.ts](file:///c:/Users/Arjohn%20Banado/Documents/mainProject/Main-SE101-/frontend/src/app/shared/lib/fetchWithAuthClient.ts)

Client-side fetch that sends cookies automatically via `credentials: "include"`:

```typescript
import { HOST } from "@/app/shared/constants/config";

export async function fetchWithAuthClient(
  path: string,
  options: RequestInit = {},
) {
  const url = `${HOST}${path.startsWith("/") ? "" : "/"}${path}`;
  return fetch(url, { ...options, credentials: "include" });
}
```

---

### Layout Refactors (3 files) — Read `x-user-id` header instead of cookie

#### [MODIFY] [(user)/layout.tsx](file:///c:/Users/Arjohn%20Banado/Documents/mainProject/Main-SE101-/frontend/src/app/(user)/layout.tsx)

```diff
-import { cookies } from "next/headers";
+import { headers } from "next/headers";
 ...
-  const cookieStore = await cookies();
-  const userId = cookieStore.get("user_id")?.value;
+  const headersList = await headers();
+  const userId = headersList.get("x-user-id") ?? undefined;
```

#### [MODIFY] [(shared)/layout.tsx](file:///c:/Users/Arjohn%20Banado/Documents/mainProject/Main-SE101-/frontend/src/app/(shared)/layout.tsx)

Same pattern — `headers()` instead of `cookies()`.

#### [MODIFY] [(admin)/layout.tsx](file:///c:/Users/Arjohn%20Banado/Documents/mainProject/Main-SE101-/frontend/src/app/(admin)/layout.tsx)

Same pattern.

---

### Auth Page — Read `x-registree-id` header

#### [MODIFY] [(auth)/verify-code/page.tsx](file:///c:/Users/Arjohn%20Banado/Documents/mainProject/Main-SE101-/frontend/src/app/(auth)/verify-code/page.tsx)

```diff
-import { cookies } from "next/headers";
+import { headers } from "next/headers";
 ...
-  const cookieStore = await cookies();
-  const registree_id = cookieStore.get("registree_id")?.value;
+  const headersList = await headers();
+  const registree_id = headersList.get("x-registree-id") ?? undefined;
```

---

### Data-Fetching Components → Client Components (9 files)

Each follows this conversion pattern:

1. Add `"use client"` directive
2. Replace [fetchWithAuth](file:///c:/Users/Arjohn%20Banado/Documents/mainProject/Main-SE101-/frontend/src/app/shared/lib/fetchWithAuth.ts#7-34) / direct [fetch](file:///c:/Users/Arjohn%20Banado/Documents/mainProject/Main-SE101-/frontend/src/app/%28user%29/bookings/guard/BookingsGuard.tsx#18-36) with `fetchWithAuthClient` (uses `credentials: "include"`)
3. Use `useEffect` + `useState` for data fetching (`loading`, `data`, [error](file:///c:/Users/Arjohn%20Banado/Documents/mainProject/Main-SE101-/frontend/src/app/shared/lib/errorHandler.ts#13-31))
4. Move skeleton JSX from parent `<Suspense fallback>` into the component's `if (loading)` branch
5. Use [ErrorClient](file:///c:/Users/Arjohn%20Banado/Documents/mainProject/Main-SE101-/frontend/src/app/shared/components/ErrorClient.tsx#5-39) or `NotFoundClient` for error states
6. For pages with `params`/`searchParams`, use `useParams()` / `useSearchParams()`

**Files to convert:**

| File | Notes |
|---|---|
| [(user)/units/components/ProductList.tsx](file:///c:/Users/Arjohn%20Banado/Documents/mainProject/Main-SE101-/frontend/src/app/(user)/units/components/ProductList.tsx) | Use `useSearchParams()` for filters |
| [(admin)/spaces/components/ProductList.tsx](file:///c:/Users/Arjohn%20Banado/Documents/mainProject/Main-SE101-/frontend/src/app/(admin)/spaces/components/ProductList.tsx) | Simple conversion |
| [(admin)/payment-methods/components/PaymentMethods.tsx](file:///c:/Users/Arjohn%20Banado/Documents/mainProject/Main-SE101-/frontend/src/app/(admin)/payment-methods/components/PaymentMethods.tsx) | Simple conversion |
| [(admin)/payment-methods/[slug]/components/EditFormFiller.tsx](file:///c:/Users/Arjohn%20Banado/Documents/mainProject/Main-SE101-/frontend/src/app/(admin)/payment-methods/[slug]/components/EditFormFiller.tsx) | Use [EditFormSkeleton](file:///c:/Users/Arjohn%20Banado/Documents/mainProject/Main-SE101-/frontend/src/app/%28admin%29/payment-methods/%5Bslug%5D/components/EditFormSkeleton.tsx#1-52) for loading |
| [(admin)/agents/components/AgentsList.tsx](file:///c:/Users/Arjohn%20Banado/Documents/mainProject/Main-SE101-/frontend/src/app/(admin)/agents/components/AgentsList.tsx) | Simple conversion |
| [(admin)/agents/[slug]/components/AgentView.tsx](file:///c:/Users/Arjohn%20Banado/Documents/mainProject/Main-SE101-/frontend/src/app/(admin)/agents/[slug]/components/AgentView.tsx) | Use [AgentDetailsLoading](file:///c:/Users/Arjohn%20Banado/Documents/mainProject/Main-SE101-/frontend/src/app/%28admin%29/agents/%5Bslug%5D/loading.tsx#3-55) skeleton |
| [(user)/units/booking/history/[slug]/page.tsx](file:///c:/Users/Arjohn%20Banado/Documents/mainProject/Main-SE101-/frontend/src/app/(user)/units/booking/history/[slug]/page.tsx) | Use `useParams()` + [HistoryLoading](file:///c:/Users/Arjohn%20Banado/Documents/mainProject/Main-SE101-/frontend/src/app/%28user%29/units/booking/history/%5Bslug%5D/loading.tsx#3-94) |
| [(user)/my-bookings-history/page.tsx](file:///c:/Users/Arjohn%20Banado/Documents/mainProject/Main-SE101-/frontend/src/app/(user)/my-bookings-history/page.tsx) | Inline skeleton from layout |
| [(admin)/my-bookings/history/[slug]/page.tsx](file:///c:/Users/Arjohn%20Banado/Documents/mainProject/Main-SE101-/frontend/src/app/(admin)/my-bookings/history/[slug]/page.tsx) | Use `useParams()` + [AdminHistoryLoading](file:///c:/Users/Arjohn%20Banado/Documents/mainProject/Main-SE101-/frontend/src/app/%28admin%29/my-bookings/history/%5Bslug%5D/loading.tsx#3-87) |

---

### Parent Pages — Remove Suspense Wrappers

These files lose their `<Suspense>` wrappers since loading is now inside each Client Component:

| File | Change |
|---|---|
| [(user)/units/page.tsx](file:///c:/Users/Arjohn%20Banado/Documents/mainProject/Main-SE101-/frontend/src/app/(user)/units/page.tsx) | Remove Suspense, remove async searchParams resolution |
| [(admin)/spaces/page.tsx](file:///c:/Users/Arjohn%20Banado/Documents/mainProject/Main-SE101-/frontend/src/app/(admin)/spaces/page.tsx) | Remove Suspense wrapper |
| [(admin)/payment-methods/page.tsx](file:///c:/Users/Arjohn%20Banado/Documents/mainProject/Main-SE101-/frontend/src/app/(admin)/payment-methods/page.tsx) | Remove Suspense wrapper |
| [(admin)/payment-methods/[slug]/page.tsx](file:///c:/Users/Arjohn%20Banado/Documents/mainProject/Main-SE101-/frontend/src/app/(admin)/payment-methods/[slug]/page.tsx) | Remove Suspense wrapper |
| [(admin)/agents/components/Agents.tsx](file:///c:/Users/Arjohn%20Banado/Documents/mainProject/Main-SE101-/frontend/src/app/(admin)/agents/components/Agents.tsx) | Remove Suspense wrapper |
| [(user)/units/booking/history/[slug]/layout.tsx](file:///c:/Users/Arjohn%20Banado/Documents/mainProject/Main-SE101-/frontend/src/app/(user)/units/booking/history/[slug]/layout.tsx) | Remove Suspense wrapper |
| [(user)/my-bookings-history/layout.tsx](file:///c:/Users/Arjohn%20Banado/Documents/mainProject/Main-SE101-/frontend/src/app/(user)/my-bookings-history/layout.tsx) | Remove Suspense wrapper |
| [(admin)/my-bookings/history/[slug]/layout.tsx](file:///c:/Users/Arjohn%20Banado/Documents/mainProject/Main-SE101-/frontend/src/app/(admin)/my-bookings/history/[slug]/layout.tsx) | Remove Suspense wrapper |

---

### Cleanup

#### [DELETE or DEPRECATE] [fetchWithAuth.ts](file:///c:/Users/Arjohn%20Banado/Documents/mainProject/Main-SE101-/frontend/src/app/shared/lib/fetchWithAuth.ts)

No longer needed — replaced by `fetchWithAuthClient.ts`. Will be deleted after all consumers are migrated.

---

## Verification Plan

### Automated Tests

```bash
cd frontend && npx jest --passWithNoTests
```

### Manual Browser Verification

1. **Units page** — products load with skeleton, search works
2. **Admin spaces** — product list loads
3. **Payment methods** — list loads, edit page pre-fills form
4. **Agents** — list loads, detail view works
5. **Booking history** — timeline renders (both user/admin sides)
6. **Verify code** — registree ID passes through correctly
7. **Error states** — stop backend, confirm error UI shows
8. **Guard protection** — unauthenticated access → not-found page
