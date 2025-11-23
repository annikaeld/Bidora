import { describe, it, expect } from "vitest";
import { validateEmail } from "../js/ui/validation/userValidation.js";

describe("validateEmail", () => {
  it("accepts a valid stud.noroff.no address", () => {
    expect(validateEmail("ole@stud.noroff.no")).toBe(true);
  });

  it("is case-insensitive and trims whitespace", () => {
    expect(validateEmail(" OLE@STUD.NOROFF.NO ")).toBe(true);
  });

  it("rejects other domains", () => {
    expect(validateEmail("ole@example.com")).toBe(false);
  });

  it("rejects missing local part", () => {
    expect(validateEmail("@stud.noroff.no")).toBe(false);
  });

  it("rejects empty and non-string values", () => {
    expect(validateEmail("")).toBe(false);
    expect(validateEmail(null)).toBe(false);
    expect(validateEmail(undefined)).toBe(false);
  });
});
