export const mode =
  process.env.NODE_ENV === "test" ? "development" : process.env.NODE_ENV;

export const isProductionMode = mode === "production";
