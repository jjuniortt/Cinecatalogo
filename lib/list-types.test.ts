import { describe, expect, it } from "vitest";
import { parseListParam } from "./list-types";

describe("parseListParam", () => {
  it("traduz os nomes da URL para o status da lista", () => {
    expect(parseListParam("quero")).toBe("quero_assistir");
    expect(parseListParam("assistido")).toBe("assistido");
  });

  it("ignora valores desconhecidos e ausentes (vira catálogo)", () => {
    expect(parseListParam(undefined)).toBeNull();
    expect(parseListParam(null)).toBeNull();
    expect(parseListParam("")).toBeNull();
    expect(parseListParam("quero_assistir")).toBeNull();
    expect(parseListParam("<script>")).toBeNull();
  });
});
