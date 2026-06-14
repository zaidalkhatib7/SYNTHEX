import assert from "node:assert/strict";
import test from "node:test";
import {
  companyForTarget,
  createInitialState,
  experienceReducer,
  normalizeTarget,
} from "../lib/experience-state";

test("restores company state from a top-level hash", () => {
  const state = createInitialState("ar", "#industrial");

  assert.equal(state.locale, "ar");
  assert.equal(state.activeSection, "industrial");
  assert.equal(state.activeCompany, "industrial");
  assert.equal(state.source, "initial");
});

test("nested targets resolve to their parent company", () => {
  assert.equal(
    companyForTarget("industrial-capabilities"),
    "industrial",
  );
  assert.equal(companyForTarget("al-maria-network"), "al-maria");
});

test("holding-owned sections use the holding theme", () => {
  assert.equal(companyForTarget("story"), "holding");
  assert.equal(companyForTarget("network"), "holding");
});

test("explicit navigation and passive observation record their source", () => {
  const initial = createInitialState("en");
  const explicit = experienceReducer(initial, {
    type: "NAVIGATE",
    target: "jollaq",
  });
  const observed = experienceReducer(explicit, {
    type: "OBSERVE",
    target: "shamco",
  });

  assert.equal(explicit.activeCompany, "jollaq");
  assert.equal(explicit.source, "explicit");
  assert.equal(observed.activeCompany, "shamco");
  assert.equal(observed.source, "scroll");
});

test("unknown hashes fall back to holding", () => {
  assert.equal(normalizeTarget("#not-a-section"), "holding");
});
