import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import renderer from 'react-test-renderer'
import Navbar from './Navbar'

const mockUpdateUser = jest.fn(() => false)

it('renders navigation bar (logged in)', () => {
  const tree = renderer
    .create(
      <MemoryRouter>
        <Navbar loggedIn updateUser={mockUpdateUser} />
      </MemoryRouter>
    )
    .toJSON()
  expect(tree).toMatchSnapshot()
})

it('renders navigation bar (not logged in)', () => {
  const tree = renderer
    .create(
      <MemoryRouter>
        <Navbar loggedIn={false} updateUser={mockUpdateUser} />
      </MemoryRouter>
    )
    .toJSON()
  expect(tree).toMatchSnapshot()
})
