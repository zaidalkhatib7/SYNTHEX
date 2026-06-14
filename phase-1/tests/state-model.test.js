"use strict";

var assert = require("node:assert/strict");
var model = require("../prototype/state-model.js");

var state = model.createInitialState({ hash: "#industrial", locale: "ar" });
assert.equal(state.activeSection, "industrial");
assert.equal(state.activeCompany, "industrial");
assert.equal(state.locale, "ar");
assert.equal(state.navigationSource, "initial");

state = model.reduce(state, {
  type: "SECTION_BECAME_DOMINANT",
  section: "network"
});
assert.equal(state.activeSection, "network");
assert.equal(state.activeCompany, "holding");
assert.equal(state.navigationSource, "scroll");

state = model.reduce(state, {
  type: "SELECT_COMPANY",
  company: "jollaq"
});
assert.equal(state.activeSection, "jollaq");
assert.equal(state.activeCompany, "jollaq");
assert.equal(state.navigationSource, "explicit");

state = model.reduce(state, {
  type: "ESCAPE_TO_HOLDING"
});
assert.equal(state.activeSection, "companies");
assert.equal(state.activeCompany, "holding");

state = model.reduce(state, {
  type: "POPSTATE",
  hash: "#al-maria"
});
assert.equal(state.activeSection, "al-maria");
assert.equal(state.activeCompany, "al-maria");
assert.equal(state.navigationSource, "history");

assert.equal(model.normalizeId("#not-a-section"), "holding");
assert.equal(model.companyForSection("story"), "holding");
assert.equal(model.normalizeId("#industrial-capabilities"), "industrial-capabilities");
assert.equal(model.companyForSection("industrial-capabilities"), "industrial");
assert.equal(model.historyModeForEvent({ type: "SELECT_COMPANY" }), "push");
assert.equal(model.historyModeForEvent({ type: "SECTION_BECAME_DOMINANT" }), "replace");
assert.equal(model.historyModeForEvent({ type: "POPSTATE" }), "none");

console.log("state-model tests passed");
