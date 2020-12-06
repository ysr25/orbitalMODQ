import React from 'react'
import renderer from 'react-test-renderer'
import ModuleInput from './ModuleInput'

const mock = jest.fn()

it('renders module input', () => {
  const tree = renderer
    .create(
      <ModuleInput value='' onChange={mock} />
    )
    .toJSON()
  expect(tree).toMatchSnapshot()
})

it('renders module input (options displayed)', () => {
  const component = renderer
    .create(
      <ModuleInput value='' onChange={mock} />
    )
  component.getInstance().onClickInput()
  expect(component.toJSON()).toMatchSnapshot()
})
