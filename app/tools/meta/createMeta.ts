interface MetaOptions {
  title?: string;
  description?: string;
}

/**
 * Generates a standardized meta array for react-router.
 * Automatically prefixes the site name to the title.
 */
export function createMeta({ title = "", description = "" }: MetaOptions) {
  const siteName = "Cribbage Ninja";
  const fullTitle = title ? `${title} – ${siteName}` : siteName;

  return [{ title: fullTitle }, { name: "description", content: description }];
}
