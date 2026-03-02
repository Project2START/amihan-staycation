# Polymorphism usage

This file captures the current polymorphism examples across the repo since it
is the only documentation file in the project today.

## Backend

- `src/shared/helpers/appErrors.ts`: `AppError` extends the built-in `Error`, and
  specialized errors (`BadRequestError`, `ConflictError`, `NotFoundError`,
  `ForbiddenError`, `UnauthorizedError`) extend `AppError` so error handlers can
  treat them polymorphically through the base type.
- `src/modules/product/controllers/product.controller.ts` and
  `src/modules/paymentMethod/controllers/paymentMethod.controller.ts`:
  `RequestWithFiles` extends Express `Request`, allowing controller methods to
  accept a richer request shape while still using the `Request` API.

## Frontend

- `src/app/shared/ui/CustomToast.tsx`: `CustomToastOptions` extends
  `ToastOptions` to reuse the base toast configuration while adding app-specific
  fields.
- `src/app/(user)/units/[slug]/components/Product.tsx` and
  `src/app/(admin)/spaces/[slug]/components/Product.tsx`: each file defines a
  local `Product` interface that extends `IProductItemProps`, reusing the base
  product fields with additional attributes.
