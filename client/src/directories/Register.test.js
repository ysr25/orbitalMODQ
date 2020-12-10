import React from "react";
import { MemoryRouter } from "react-router-dom";
import renderer from "react-test-renderer";
import Register from "./Register";

it("renders register page", () => {
  const tree = renderer
    .create(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
