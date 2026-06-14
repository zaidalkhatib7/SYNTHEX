import assert from "node:assert/strict";
import test from "node:test";
import { selectGraphicsTier } from "../lib/graphics-tier";

const desktopProfile = {
  coarsePointer: false,
  deviceMemory: 8,
  hardwareConcurrency: 8,
  reducedMotion: false,
  viewportWidth: 1440,
  webglAvailable: true,
};

test("selects the full tier for a capable desktop", () => {
  assert.equal(selectGraphicsTier(desktopProfile), 2);
});

test("selects the lightweight tier for constrained or mobile devices", () => {
  assert.equal(
    selectGraphicsTier({ ...desktopProfile, viewportWidth: 390 }),
    1,
  );
  assert.equal(
    selectGraphicsTier({ ...desktopProfile, deviceMemory: 4 }),
    1,
  );
  assert.equal(
    selectGraphicsTier({ ...desktopProfile, coarsePointer: true }),
    1,
  );
});

test("selects the static tier for reduced motion or missing WebGL", () => {
  assert.equal(
    selectGraphicsTier({ ...desktopProfile, reducedMotion: true }),
    0,
  );
  assert.equal(
    selectGraphicsTier({ ...desktopProfile, webglAvailable: false }),
    0,
  );
});
