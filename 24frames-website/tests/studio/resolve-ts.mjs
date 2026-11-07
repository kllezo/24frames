// Lets Node's built-in TypeScript support resolve the app's extensionless
// imports and the "@/..." alias. Used only by the studio unit tests.
import { registerHooks } from "node:module";
import { pathToFileURL } from "node:url";
import path from "node:path";

const src = path.resolve(import.meta.dirname, "../../src");
registerHooks({
  resolve(specifier, context, next) {
    if (specifier.startsWith("@/")) specifier = pathToFileURL(path.join(src, specifier.slice(2))).href;
    try {
      return next(specifier, context);
    } catch (err) {
      if (/^(\.|file:)/.test(specifier)) return next(specifier + ".ts", context);
      throw err;
    }
  },
});
