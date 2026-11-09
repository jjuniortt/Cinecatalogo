import { describe, expect, test } from "vitest";
import { discoverParams, parseRatingFilter } from "./tmdb";

describe("parseRatingFilter", () => {
  test("aceita as notas dos botões: 7, 8 e 9", () => {
    expect(parseRatingFilter("7")).toBe(7);
    expect(parseRatingFilter("8")).toBe(8);
    expect(parseRatingFilter("9")).toBe(9);
  });

  test("ignora notas fora do conjunto de botões", () => {
    expect(parseRatingFilter("6")).toBeNull();
    expect(parseRatingFilter("10")).toBeNull();
    expect(parseRatingFilter("8.5")).toBeNull();
  });

  test("ignora lixo e ausência de valor", () => {
    expect(parseRatingFilter("abc")).toBeNull();
    expect(parseRatingFilter("")).toBeNull();
    expect(parseRatingFilter(undefined)).toBeNull();
    expect(parseRatingFilter(null)).toBeNull();
  });
});

describe("discoverParams", () => {
  test("inclui o piso de nota quando minRating é passado", () => {
    const params = discoverParams({ minRating: 8, sortBy: "vote_average.desc" });
    expect(params["vote_average.gte"]).toBe(8);
    expect(params.sort_by).toBe("vote_average.desc");
  });

  test("não inclui piso de nota quando minRating é ausente", () => {
    const params = discoverParams({ sortBy: "popularity.desc" });
    expect(params["vote_average.gte"]).toBeUndefined();
  });

  test("sempre restringe ao provedor Netflix na região BR", () => {
    const params = discoverParams({});
    expect(params.with_watch_providers).toBe(8);
    expect(params.watch_region).toBe("BR");
  });
});
