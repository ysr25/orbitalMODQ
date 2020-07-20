import React from 'react';
import { MemoryRouter } from "react-router-dom";
import renderer from 'react-test-renderer';
import CreateModReview from './CreateModReview';

it("renders create module review page", () => {
  const tree = renderer
    .create(
      <MemoryRouter>
        <CreateModReview />
      </MemoryRouter>
    )
    .toJSON()
  expect(tree).toMatchSnapshot()
});