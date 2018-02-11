import React, { Component } from 'react';
import { parse } from 'query-string';

import {
  getCustomer,
  updateCustomer,
} from '../utils/api.js';

import {
  Form,
  FormGroup,
  Input,
  Button,
  Label
} from 'reactstrap';

class CustomerEditor extends Component {
  state = {
    customer: null
  }

  componentWillMount() {
    const customerId = parse(this.props.location.search);
    getCustomer(customerId.id)
      .then(customer => this.setState({ customer }))
  }

  changeCustomer = (value, key, e) => {
    const newValue = e.target.value;
    this.setState({
      customer: {
        ...this.state.customer,
        [key]: newValue
      }
    });
  }

  updateCustomer = () => {
    const s = this.state;
    updateCustomer(s.customer.id, s.customer)
      .then(() => this.props.history.push(`/customers`))
  }

  render() {
    const customer = this.state.customer;
    if (!customer) return null;
    return (
      <div>
        <h4>Edit customer</h4>
        <Form>
          <FormGroup>
            <Label>Name</Label>
            <Input
              onChange={this.changeCustomer.bind(this, customer.name, 'name')}
              value={customer.name || ''}
            ></Input>
          </FormGroup>
          <FormGroup>
            <Label>Address</Label>
            <Input
              onChange={this.changeCustomer.bind(this, customer.address, 'address')}
              value={customer.address || ''}
            ></Input>
          </FormGroup>
          <FormGroup>
            <Label>Phone</Label>
            <Input
              onChange={this.changeCustomer.bind(this, customer.phone, 'phone')}
              value={customer.phone || ''}
            ></Input>
          </FormGroup>
          <Button onClick={this.updateCustomer} color="success">Save</Button>
        </Form>
      </div>
    )
  }
}

export default CustomerEditor;
