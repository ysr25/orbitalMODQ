import React from "react";
import { MemoryRouter } from "react-router-dom";
import renderer from "react-test-renderer";
import LogIn from "./LogIn";

it("renders login page", () => {
  const tree = renderer
    .create(
      <MemoryRouter>
        <LogIn />
      </MemoryRouter>
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
