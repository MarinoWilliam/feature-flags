# Feature Flags Configuration Dashboard (Angular 17+)

A **Feature Flags Management Dashboard** built with modern Angular practices, simulating how enterprise applications manage runtime configuration across multiple environments (development / staging / production).

**Demonstrates:** feature flag filtering, environment-based configuration, server-side pagination, optimistic UI updates, global HTTP loading interception, centralized error handling, and mocked REST API behaviour via `json-server`.

---

## Tech Stack

| Technology | Purpose |
|---|---|
| Angular 17+ Standalone | No NgModules – simplified structure |
| Angular Signals | Local reactive state management |
| HttpClient Interceptors | Global loader simulation |
| Bootstrap | Lightweight styling |
| json-server | Mock REST API |
| zone.js | Simpler change detection setup |

---

## Architectural Decisions

### Standalone Components
Uses Angular Standalone Components instead of NgModules to reduce boilerplate, improve encapsulation, and align with Angular's future direction.

### Signals for UI State
`HttpClient` Observables handle API calls while Angular Signals manage local UI state — keeping things simple without NgRx.

```ts
flags = signal<FeatureFlag[]>([]);
totalCount = signal<number>(0);
pageNumber = signal<number>(1);

totalPages = computed(() => Math.ceil(this.totalItems() / this.pageSize()));
```

### API-Driven Filtering & Pagination
Filtering happens via query params — not in memory — to reflect real backend-driven behaviour.

```ts
params = params.set('environment', environment);
params = params.set('status', status);
params = params.set('name_like', name);
```

### Optimistic UI Updates
Flags toggle instantly in the UI. If the API call fails (simulated 25% failure rate), the state rolls back and an error is shown globally.

```ts
this.flags.update(flags =>
  flags.map(f => f.id === flag.id ? { ...f, status: previousStatus } : f)
);
```

### Global HTTP Interceptor
A single `HttpClientInterceptor` handles loading state across all API calls — no per-component loading flags needed.

---

## Project Structure

```
src/app
│
├── components/
│   └── feature-flags/
│
├── core/
│   ├── interceptors/
│   └── state/
│       ├── loading.service.ts
│       └── error-handler.service.ts
│
├── models/
│   ├── feature-flag.model.ts
│   └── feature-flag.dto.ts
│
├── services/
│   └── feature-flags.service.ts
│
├── shared/
│   └── ui/
│       └── error-message/

```

---

## Getting Started

```bash
# Clone & install
git clone https://github.com/MarinoWilliam/feature-flags.git && cd feature-flags
npm install

# Run mock backend + app
npm start
```

App runs at `http://localhost:4200` — API at `http://localhost:3000/feature-flags`.