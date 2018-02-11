import React, { Component } from 'react';
import { parse } from 'query-string';

import {
  getCustomer,
} from '../utils/api.js';

import {
  Form,
  Input,
  Button,
  Label
} from 'reactstrap';

class CustomerEditor extends Component {
  state = {
    customer: null
  }

  componentWillMount() {
    // getCustomer()
    //   .then(customers)
  }

  render() {
    return (
      <div>
        <h4>Edit customer</h4>
        <Form>
        <Label>
          Name
          <Input></Input>
        </Label>
        <Label>
          Address
          <Input></Input>
        </Label>
        <Label>
          Phone
          <Input></Input>
        </Label>
        <Button>Save</Button>
        </Form>
      </div>
    )
  }
}

export default CustomerEditor;
