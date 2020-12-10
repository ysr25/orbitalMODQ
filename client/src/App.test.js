import React from "react";
import { MemoryRouter } from "react-router-dom";
import renderer from "react-test-renderer";
import App from "./App";

test("renders app", () => {
  const tree = renderer
    .create(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
