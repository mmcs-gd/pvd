import { expect } from "chai";
import { StateTableRow, StateTable } from "../src/ai/behaviour/state-table.js";

describe("StateTableRow", () => {
  describe("constructor", () => {
    it("should create a StateTableRow object with specified initial state, condition, final state, and onStateChanged", () => {
      const condition = () => true;
      const onStateChanged = () => {};
      const row = new StateTableRow("start", condition, "end", onStateChanged);
      expect(row.inState).to.equal("start");
      expect(row.condition).to.equal(condition);
      expect(row.outState).to.equal("end");
      expect(row.onStateChanged).to.equal(onStateChanged);
    });

    it("should create a StateTableRow object with default onStateChanged to null", () => {
      const condition = () => true;
      const row = new StateTableRow("start", condition, "end");
      expect(row.onStateChanged).to.be.null;
    });
  });
});

describe("StateTable", () => {
  describe("constructor", () => {
    it("should create a StateTable object with an empty states array and specified context", () => {
      const context = { some: "context" };
      const table = new StateTable(context);
      expect(table.stateRows).to.be.an("array").that.is.empty;
      expect(table.context).to.equal(context);
    });
  });

  describe("addState", () => {
    it("should add a StateTableRow object to the states array", () => {
      const context = { some: "context" };
      const table = new StateTable(context);
      const condition = () => true;
      const row = new StateTableRow("start", condition, "end");
      table.addState(row);
      expect(table.stateRows).to.include(row);
    });
  });

  describe("getNextState", () => {
    it("should return the final state if condition is met", () => {
      const context = { some: "context" };
      const table = new StateTable(context);
      const condition = () => true;
      const row = new StateTableRow("start", condition, "end");
      table.addState(row);
      const nextState = table.getNextState("start");
      expect(nextState).to.equal("end");
    });

    it("should call onStateChanged if condition is met and onStateChanged is provided", () => {
      const context = { some: "context" };
      const table = new StateTable(context);
      const condition = () => true;
      let stateChangedCalled = false;
      const onStateChanged = () => {
        stateChangedCalled = true;
      };
      const row = new StateTableRow("start", condition, "end", onStateChanged);
      table.addState(row);
      table.getNextState("start");
      expect(stateChangedCalled).to.be.true;
    });

    it("should return the current state if no condition is met", () => {
      const context = { some: "context" };
      const table = new StateTable(context);
      const condition = () => false;
      const row = new StateTableRow("start", condition, "end");
      table.addState(row);
      const nextState = table.getNextState("start");
      expect(nextState).to.equal("start");
    });
  });
});
