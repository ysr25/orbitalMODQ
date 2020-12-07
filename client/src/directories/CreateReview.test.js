import React from "react";
import { MemoryRouter } from "react-router-dom";
import renderer from "react-test-renderer";
import CreateReview from "./CreateReview";

it("renders create module review page", () => {
  const tree = renderer
    .create(
      <MemoryRouter>
        <CreateReview />
      </MemoryRouter>
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
