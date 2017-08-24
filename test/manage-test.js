require("babel-polyfill");
import React from "react";
import { expect } from "chai";
import { shallow } from "enzyme";
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store'
// import manage from './src/manage';
// import { Score, Provider } from "../src/webextension/manage";


describe("The math should be right", () => {
  it("1 + 1 should equal 2", () => {
    expect(1 + 1).to.equal(2);
  })
});
