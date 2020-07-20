import React from 'react';
import { MemoryRouter } from "react-router-dom";
import renderer from 'react-test-renderer';
import Registration from './Registration';

const mockUpdateUser = jest.fn(() => false)

it("renders login page", () => {
  const tree = renderer
    .create(
      <MemoryRouter>
        <Registration updateUser={mockUpdateUser} />
      </MemoryRouter>
    )
    .toJSON()
  expect(tree).toMatchSnapshot()
});