import React from "react";
import { MemoryRouter } from "react-router-dom";
import renderer from "react-test-renderer";
import Register from "./Register";

const mockUpdateUser = jest.fn(() => false);

it("renders login page", () => {
  const tree = renderer
    .create(
      <MemoryRouter>
        <Register updateUser={mockUpdateUser} />
      </MemoryRouter>
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
