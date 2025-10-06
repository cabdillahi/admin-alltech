// utils/slug.ts
export function createSlug(name: string): string {
  return name
    .toLowerCase() // dhammaan lowercase
    .replace(/[^a-z0-9]+/g, "-") // spaces & special chars → "-"
    .replace(/(^-|-$)+/g, ""); // remove leading/trailing dashes
}
