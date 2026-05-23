import { expect, test } from "@playwright/test";

import {
  getDefaultNoteDirection,
  resolveNoteIdentity,
} from "../src/util/noteIdentity";

test.describe("note identity helpers", () => {
  test("resolves noteID inputs without changing translation defaults", () => {
    const identity = resolveNoteIdentity({ noteID: "translation:1-2" });

    expect(identity).toEqual({
      id: "translation:1-2",
      type: "translation",
      key: "1-2",
    });
    expect(getDefaultNoteDirection(identity.type)).toBe("ltr");
  });

  test("resolves root note IDs from numeric root keys", () => {
    const identity = resolveNoteIdentity({ noteID: "root:42" });

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
});