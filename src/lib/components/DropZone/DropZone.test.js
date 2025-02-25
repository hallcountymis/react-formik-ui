import React from 'react'
import { shallow, mount } from 'enzyme'
import WithLabel from '../WithLabel'
import { DropZone } from './DropZone'

describe('<DropZone />', () => {
  const baseProps = {
    name: 'DropZoneTest',
    formik: {
      handleChange: jest.fn(),
      handleBlur: jest.fn(),
      setFieldValue: jest.fn(),
      setFieldTouched: jest.fn(),
      touched: {},
      errors: {},
      values: {
        files: [],
      },
    },
  }

  const WrappedComponent = WithLabel('dropzone')(DropZone)

  it('should render', () => {
    const wrapper = shallow(<WrappedComponent {...baseProps} />)

    expect(wrapper).toBeDefined()
  })

  it('should have a label', () => {
    const props = {
      ...baseProps,
      label: 'Custom',
    }

    const wrapper = mount(<WrappedComponent {...props} />)

    expect(wrapper.find('.label').length).toBe(1)
  })

  it('should have a hint', () => {
    const props = {
      ...baseProps,
      hint: 'hintTest',
    }
    const wrapper = mount(<WrappedComponent {...props} />)

    expect(wrapper.find('.hint').length).toBe(1)
    expect(wrapper.find('.hint').text()).toBe(props.hint)
  })
})
