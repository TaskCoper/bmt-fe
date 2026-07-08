# BMT Decor AI — Nâng cấp Studio theo bản mockup (multi-route)

## Bối cảnh

Bạn đã viết bản mockup chi tiết (`~/Downloads/bmt-decor-ai-ui-mockup-plan.md`) cho luồng thiết kế 6 bước của BMT Decor AI: brand token, thanh stepper "mặt cắt tầng nhà" làm nhận diện, spec từng màn, inventory component, data model TS, và các state bắt buộc.

Repo **đã có sẵn một bản UI-mock chạy được** của luồng này — feature `studio`: một wizard single-page dùng Zustand tại `/dashboard/projects/new` (`create → space → design → result → render → export`), 292 key i18n đồng bộ cả `vi` lẫn `en`, một `studio.service` thuần để tính ngân sách/dự toán, và donut/uploader/floor-plan tự vẽ tay (không dùng thư viện chart/upload ngoài).

**Quyết định đã chốt:**

1. **Kiến trúc — multi-route.** Mỗi bước là **một route riêng** dưới `/dashboard/projects/[projectId]/{requirements,layouts,results,renders,export}`, deep-link được, refresh không mất chỗ. Chuyển từ wizard single-page hiện tại sang mô hình này (tái dụng phần lớn body component sẵn có, thay lớp shell + điều hướng).
2. **Bảng màu — amber/ink/paper toàn app** trong `globals.css`.
3. **Phạm vi — làm đầy đủ, chia phase tuần tự.**

Vì **frontend-only, không backend**, phần "autosave theo projectId" được hiện thực bằng **Zustand `persist` → localStorage, keyed theo `projectId`** (mỗi dự án một entry). State sống qua điều hướng route + refresh; đây cũng là "source of truth" cho mock cho tới khi có API .NET thật.

Kết quả mong muốn: luồng studio khớp spec mockup (route map, brand identity, thứ tự bước, upload theo từng tầng dựa trên số tầng, màn Bước 4 giàu thông tin, viewer/lightbox/QR thật, trang chia sẻ, đầy đủ state) trong khi vẫn frontend-only + mock-driven, tuân đúng các luật trong `CLAUDE.md` (import theo lớp, barrel, không hardcode text UI, chỉ semantic token, CVA).

## Kiến trúc route

```
src/app/[locale]/(dashboard)/dashboard/projects/
├── page.tsx                         # Dashboard danh sách dự án (đã có) + StepDots + CTA "Tiếp tục Bước N"
├── new/page.tsx                     # Bước 1 — Tạo dự án (form ngắn) → sinh projectId → redirect requirements
└── [projectId]/
    ├── layout.tsx                   # Shell: StepperSidebar (đọc step status) + GUARD (bước chưa mở → redirect)
    ├── requirements/page.tsx        # Bước 2 — Yêu cầu & ngân sách
    ├── layouts/page.tsx             # Bước 3 — Upload layout từng tầng → submit → generate → redirect results
    ├── results/
    │   ├── page.tsx                 # Bước 4 — Bản vẽ 2D + dự toán + chọn gói + diện tích
    │   └── estimate/[section]/[tier]/page.tsx   # Bảng chi tiết gói (mở tab mới, target=_blank)
    ├── renders/page.tsx             # Bước 5 — Gallery render 3D
    └── export/page.tsx              # Bước 6 — Xuất PDF + chia sẻ

src/app/[locale]/share/[token]/page.tsx   # Xem PDF online, KHÔNG cần login (ngoài (dashboard))
```

- **Route base** đặt dưới `/dashboard/projects/[projectId]/...` (không phải `/projects/...` trần) để nhất quán với app hiện tại và tự động được auth-gate bởi `PROTECTED_ROUTE_PREFIXES = [/dashboard]`. `share/[token]` nằm top-level ngoài `(dashboard)` nên public.
- **`[projectId]/layout.tsx`** giữ `StepperSidebar` + guard + header tên dự án (mockup §1, §2). Vì state ở localStorage (client), layout dùng client guard component đọc store: bước bị khoá (chưa đủ tiền đề) → redirect về bước xa nhất được phép; `projectId` không tồn tại → về danh sách dự án.

## Store & điều hướng (thay lõi single-page)

- Refactor `store/wizard.store.ts` thành **store keyed theo projectId + `persist` (localStorage)**: `projects: Record<projectId, ProjectState>` với `ProjectState = { data, result, selection, exportOptions, steps, regenCount, updatedAt }`. Mọi mutation ghi localStorage ngay ⇒ autosave thật.
- **Điều hướng theo route** thay cho `stepIndex`: định nghĩa `STEP_ROUTES` (thứ tự bước → hàm dựng path theo `projectId`); `next()/back()` dùng `useRouter` từ `@/i18n/navigation` để `push` route; `StepperSidebar` dùng `Link` locale-aware. Bỏ dispatch theo `STEP_COMPONENTS`/`stepIndex` trong `project-wizard.tsx` (component này tách thành `layout.tsx` + các page).
- **Step status** suy từ entry store (field đã điền / có `result` chưa) → `done/active/locked` cho stepper + guard + StepDots ở dashboard.
- Giữ edit-guard "sửa input sau khi có kết quả" (`pendingNav`/confirm) — nay là dialog trước khi điều hướng ngược về `requirements`/`layouts` khi đã có `result` (huỷ result + regen).

## Các điểm dung hòa (doc ⇄ code hiện có)

- **Thứ tự bước.** `create → requirements → layouts → result → render → export` (yêu cầu/ngân sách **trước** upload, vì số tầng quyết định số dropzone). Body `steps/step-design.tsx` → trang `requirements`; `steps/step-space.tsx` → trang `layouts` (đổi theo hướng upload từng tầng). Di trú key i18n `steps.space`/`steps.design` sang `steps.layouts`/`steps.requirements`.
- **Bước 1 sinh projectId.** `new/page.tsx` là form ngắn (tên, loại công trình, ghi chú) → submit sinh `projectId` (mock, `crypto.randomUUID()`), seed entry store, redirect `/dashboard/projects/[id]/requirements`. Có thể đồng bộ meta tối thiểu (id/tên/loại/steps/updatedAt) để dashboard liệt kê.
- **Chọn gói dời vào Bước 4.** Doc chọn tier hoàn thiện/nội thất bằng radio-row **trên bảng dự toán** + recalc realtime; phần thô 1 dòng. → Thay `data.packageId` bằng `selection: { finishing: PackageTier; interior: PackageTier }`; `calcBudget` nhận `selection`. Slider ngân sách ở Bước 2 là **mốc mục tiêu** để so ở Bước 4.
- **Model phong cách.** Radio đơn (`roof_thai|roof_japanese|roof_traditional|modern_townhouse|neoclassical`) + toggle điều kiện `hasTum`. → Thay `styles[]` + `toggleStyle` bằng `style` đơn + `hasTum` (+ `setStyle`).
- **"Xem chi tiết"** giờ là **route lồng thật** `results/estimate/[section]/[tier]` (mở tab mới) — tab mới tự rehydrate từ localStorage theo `projectId`, không cần truyền state.
- **Chưa có dữ liệu tỉnh/vùng** trong repo. → Thêm dataset tĩnh offline map tỉnh VN → `north|central|south` trong `studio/constants`.
- **Giữ donut tự vẽ** (`cost-donut.tsx`) thay vì thêm recharts. Chỉ thêm thư viện nâng chất lượng: `react-zoom-pan-pinch` (viewer 2D), `qrcode.react` (QR), shadcn `sheet` (drawer vật liệu).

## Các phase

### Phase A — Design token & typography (`globals.css`)

- Viết lại biến màu `:root`/`.dark` sang hệ amber/ink/paper (map vào role semantic: amber→`--primary`, paper→`--background`, ink→`--foreground`, amber-soft→`--accent`/`--secondary`, line→`--border`; đổi hex sang OKLCH). Giữ `--success/--warning/--destructive`, cho counterpart dark hợp lý. `--radius` giữ `0.625rem` (10px).
- Thêm **Be Vietnam Pro** (subset `vietnamese`) qua `next/font` trong `src/app/[locale]/layout.tsx`, expose `--font-display`, map vào `@theme inline`; giữ body sans.
- Chỉ dùng semantic token, không hex thô.

### Phase B — Route scaffold + `[projectId]` shell + StepperSidebar + store refactor (xương sống)

- Refactor store thành keyed-by-projectId + `persist` + điều hướng theo route (mục "Store & điều hướng").
- Tạo `[projectId]/layout.tsx`: header tên dự án + `StepperSidebar` + client guard. Tạo 5 route page (`requirements/layouts/results/renders/export`) mount lại body component sẵn có làm bước tạm để luồng chạy được sớm.
- `StepperSidebar` = signature **"mặt cắt tầng" xếp từ dưới lên** (Bước 1 dưới cùng như tầng trệt; active tô amber; `done/active/locked`; locked có tooltip "Hoàn thành Bước N trước"); dùng `Link`. Mobile: thu thành progress ngang sticky.

### Phase C — Dashboard + StepDots + Bước 1 (tạo dự án)

- `StepDots` + type `StepStatus` đặt ở `shared/components/common` (tránh cross-feature import).
- Nâng dashboard `projects/page.tsx` (+ `features/project` card): StepDots, badge trạng thái, ngày cập nhật, CTA "Tiếp tục ở Bước N", empty state mời gọi (§3.1, §6.2). Nguồn dự án đang làm dở lấy từ store persisted (projection nhẹ).
- `new/page.tsx`: form Bước 1 (RadioCardGroup loại công trình, non-MVP disabled + badge "Sắp ra mắt") → sinh `projectId` → redirect `requirements`.

### Phase D — Bước 2 `requirements/page.tsx` (delta input lớn nhất)

- **Model** (`types`, `constants`, `store`): thêm `region`, `address`, `floors` (0=trệt), `style: HouseStyle`, `hasTum?`, `budget` (mốc), `primaryColors: string[]`; thay `packageId`/`styles`/`toggleStyle`; thêm `setStyle`; cập nhật khởi tạo entry.
- **Component mới** (`features/studio/components/`): `AddressRegionField` (select tỉnh → badge vùng), `FloorSegmented` (Trệt / +1 / +2 / +3+ → set `floors`, quyết định số dropzone Bước 3), `StyleRadioCard` (single + roof subtype), `TumToggle` (điều kiện modern/neoclassical, animate), `CompassPicker` (4 hướng), `PaletteSwatches`, `BudgetSlider` (slider + input VNĐ phân tách nghìn — dùng shadcn `slider` + `formatCurrency`). Thay `Segmented`/native color cũ.
- **Dataset tỉnh**: `features/studio/constants/provinces.ts` (63 tỉnh → vùng).
- Anchor-scroll 1 trang (A. công trình · B. phong cách · C. thêm · D. ngân sách — §3.3). Guard cho next: đã có area + budget + style.

### Phase E — Bước 3 `layouts/page.tsx` + overlay AI

- Tổng quát `image-uploader.tsx` → `FloorDropzone`, render **N dropzone theo `data.floors`** (thứ tự cố định Trệt → Tầng 1 → …). `UploadProgressRing`, thay/xoá từng tầng, header hướng dẫn + ảnh mẫu đúng/sai (§3.4). Giữ native drag+drop. Gating: mọi tầng có ≥1 ảnh mới enable "AI tạo kết quả".
- `AIGeneratingOverlay` (full-screen skeleton + dòng trạng thái xoay vòng) trong lúc `generate()`; xong → `steps.result = done` + redirect `results`. Thêm key i18n dòng trạng thái.

### Phase F — Bước 4 `results/page.tsx` (phức tạp nhất)

**F1 — layout + dự toán + chọn gói + recalc**

- `DrawingViewer2D`: thay mock CSS-scale bằng **`react-zoom-pan-pinch`** (zoom/pan/reset/fullscreen) + **tab theo tầng**.
- `EstimateTable` + `PackageRadioRow`: hoàn thiện & nội thất mỗi phần 3 dòng tier radio-row; chọn tier cập nhật `store.selection` + recalc cột tổng & donut **client-side realtime**. Phần thô 1 dòng. `tabular-nums`.
- `AreaSummaryTable`: giữ, làm card dính cạnh viewer.
- `BudgetProgressBar` (mới): tổng đã chọn vs `data.budget`, 3 màu success/warn/danger + **số chênh cụ thể** (§3.5, §6.3).

**F2 — route chi tiết gói + drawer vật liệu + donut**

- Route `results/estimate/[section]/[tier]/page.tsx` (mở `target=_blank`, rehydrate từ localStorage theo `projectId`): bảng `hạng mục · khối lượng · vật liệu đề xuất · [chi tiết]` + drawer **`sheet`** (thêm shadcn `sheet`) vật liệu đề xuất/thay thế + biện pháp thi công; `BudgetProgressBar` đầu trang.
- Giữ `cost-donut.tsx` (3 phân khúc theo tier) + disclaimer + ngày lập; nút "Xác nhận → Render 3D" → `steps.render` + push `renders`.

### Phase G — Bước 5 `renders/page.tsx` + Bước 6 `export/page.tsx` + share

- **Bước 5**: `Lightbox` (dùng `Dialog`, prev/next), filter Tất cả/Yêu thích, masonry skeleton. Nâng body render (favorite/caption có sẵn).
- **Bước 6**: 2 cột `PdfSectionChecklist` + `PdfPreviewPane` (preview phân trang theo tick). `ShareModal`: copy link public `/share/[token]`, input nhiều email, **QR thật** `qrcode.react`. Thêm `ROUTES.SHARE`.
- **`share/[token]/page.tsx`** (public, ngoài `(dashboard)`): render preview PDF read-only, không login.

### Phase H — Pass các state (§6) + verify

- Error (upload sai định dạng/nặng → retry giữ input; generate fail → retry; vượt ngân sách → warn + gợi ý hạ gói), tooltip step locked, responsive Bước 4 (viewer full-width, AreaSummary → accordion, EstimateTable cuộn ngang cột "Thành tiền" sticky). Empty state dashboard + "chưa có ảnh yêu thích" khi vào Bước 6.

## Xuyên suốt (cross-cutting)

- **i18n**: chuỗi mới vào **cả** `messages/vi.json` + `messages/en.json` dưới `studio.*` (vùng/địa chỉ, số tầng, roof subtype + tum, la bàn, palette, budget slider, hướng dẫn upload + dòng AI, radio-row gói, trang chi tiết + drawer, số chênh budget, lightbox/filter, pdf preview, share modal, trang share). Di trú key `steps.space`/`steps.design`. Giữ vi/en đồng cấu trúc.
- **Dep mới**: `react-zoom-pan-pinch`, `qrcode.react`, shadcn `sheet`. Không thêm recharts / dnd-kit / react-dropzone.
- **Tái dụng**: math `studio.service` (`calcBudget`, `deriveArea`, `budgetShares`, `generateResult` — mở rộng cho `selection`/`floors`), `formatCurrency`/`formatNumber`, shadcn `slider/tabs/dialog/tooltip/badge/progress`, common `EmptyState`/`PageHeader`, các body `steps/step-*.tsx` (mount lại theo route), edit-guard `pendingNav`.
- **Luật kiến trúc**: mọi phần studio nằm trong `features/studio/*` sau barrel; chỉ `StepDots`/`StepStatus` dùng chung vào `shared`. Không cross-feature import. Route page mỏng — chỉ compose component feature.

## Kiểm chứng (verification)

- Cổng chất lượng (CI mirror): `pnpm typecheck && pnpm lint && pnpm format:check` (chú ý `noUncheckedIndexedAccess` + no-unused).
- Chạy `pnpm dev`, đi hết luồng:
  - Token: amber primary / paper background toàn app (kiểm landing + dashboard không vỡ).
  - Bước 1 `/vi/dashboard/projects/new` → tạo dự án → URL nhảy sang `/dashboard/projects/<id>/requirements`.
  - **Deep-link/refresh**: F5 giữa chừng ở `requirements`/`results` → không mất dữ liệu (persist). Mở thẳng URL bước bị khoá → guard redirect về bước hợp lệ.
  - Bước 2: chọn tỉnh → badge vùng; số tầng → Bước 3 hiện đúng số dropzone; kéo slider ngân sách.
  - Bước 3: upload đủ → submit → overlay AI → tự sang `results`.
  - Bước 4: zoom/pan + tab tầng; đổi tier → tổng/donut/budget bar recalc; vượt ngân sách → warn + số chênh; "Xem chi tiết" mở tab mới `results/estimate/...` với drawer, rehydrate đúng.
  - Bước 5: lightbox prev/next + filter. Bước 6: tick section → preview cập nhật; ShareModal → QR hiện; `/vi/share/<token>` ở trạng thái logout/ẩn danh → load, không redirect login.
- i18n: đổi `/vi` ↔ `/en`, console không thiếu key.
- Tùy chọn: skill `/run` để chạy & chụp màn.
