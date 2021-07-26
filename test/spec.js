const Application = require("spectron").Application;
const assert = require("assert");
const electronPath = require("electron");
const path = require("path");

// Sample code taken from:
// https://github.com/electron-userland/spectron
describe("Application launch", function () {
  this.timeout(10000);

  it("Simple test", function () {
    assert.strictEqual(1, 1);
  });
});
