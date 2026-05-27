import { expect, test } from "@playwright/test";

import {
  hasNoteType,
  parseVerseAddressKey,
  getDefaultNoteDirection,
  resolveNoteIdentity,
} from "../src/util/noteIdentity";

test.describe("note identity helpers", () => {
  test("resolves noteId inputs without changing translation defaults", () => {
    const identity = resolveNoteIdentity({ noteId: "translation:1-2" });

    expect(identity).toEqual({
      id: "translation:1-2",
      type: "translation",
      key: "1-2",
    });
    expect(getDefaultNoteDirection(identity.type)).toBe("ltr");
  });

  test("resolves root note IDs from numeric root keys", () => {
    const identity = resolveNoteIdentity({ noteId: "root:42" });

    expect(identity).toEqual({
      id: "root:42",
      type: "root",
      key: "42",
    });
    expect(getDefaultNoteDirection(identity.type)).toBe("");
  });

  test("builds note identity from note type and key for verse notes", () => {
    const identity = resolveNoteIdentity({
      noteType: "verse",
      noteKey: "1-2",
    });

    expect(identity).toEqual({
      id: "verse:1-2",
      type: "verse",
      key: "1-2",
    });
    expect(getDefaultNoteDirection(identity.type)).toBe("");
  });

  test("parses verse address keys used by verse and translation notes", () => {
    expect(parseVerseAddressKey("2-255")).toEqual({
      chapter: 2,
      verse: 255,
    });

    const translationIdentity = resolveNoteIdentity({
      noteId: "translation:36-58",
    });

    expect(parseVerseAddressKey(translationIdentity.key)).toEqual({
      chapter: 36,
      verse: 58,
    });
  });

  test("treats malformed note IDs as non-matching when filtering by type", () => {
    expect(hasNoteType("verse:2-255", "verse")).toBe(true);
    expect(hasNoteType("legacy-id", "verse")).toBe(false);
    expect(hasNoteType("unknown:2-255", "verse")).toBe(false);
  });
});
