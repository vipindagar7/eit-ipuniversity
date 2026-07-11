/**
 * Recursively strips any object key that starts with "$" or contains a "."
 * from user-supplied input before it's used anywhere near a Mongoose query,
 * filter, or update. This is the standard defense against NoSQL injection —
 * without it, a JSON body like { "email": { "$ne": null } } sent to an
 * endpoint that does `Model.findOne(req.body)` could bypass the intended
 * filter entirely.
 *
 * Run this on every request body before passing it to Mongoose, even when
 * Zod validation already runs — Zod validates shape/types, not whether a
 * nested key happens to be a Mongo operator, so both layers matter.
 */
export function sanitizeMongoInput<T>(input: T): T {
  if (Array.isArray(input)) {
    return input.map((item) => sanitizeMongoInput(item)) as unknown as T;
  }

  if (input && typeof input === "object" && !(input instanceof Date)) {
    const clean: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(input as Record<string, unknown>)) {
      if (key.startsWith("$") || key.includes(".")) continue; // drop operator-like keys
      clean[key] = sanitizeMongoInput(value);
    }
    return clean as T;
  }

  return input;
}

/** True if a string looks like a valid Mongo ObjectId (24 hex chars). */
export function isValidObjectId(id: string): boolean {
  return /^[a-f0-9]{24}$/i.test(id);
}
