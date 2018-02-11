import React, { Component } from 'react';
import {
  getCustomers,
  createCustomer,
  deleteCustomer
} from '../utils/api.js';

import {
  Badge,
  Table,
  Button,
} from 'reactstrap';


const CustomerItem = ({ customer, redirect, deleteCustomer }) => (
  <tr>
    <td>{customer.id}</td>
    <td>{customer.name}</td>
    <td>{customer.address}</td>
    <td>{customer.phone}</td>
    <td>
      <Button onClick={redirect} size="sm" color="info">Edit</Button>{' '}
      <Button onClick={deleteCustomer} size="sm" color="danger">Delete</Button>
    </td>
  </tr>
);

class Customers extends Component {
  state = {
    customers: []
  }

  componentDidMount() {
    getCustomers()
      .then(customers => this.setState({ customers }))
  }

  createCustomer = () => {
    const newCustomer = {
      discount: 0,
      total: 0
    }
    createCustomer(newCustomer)
      .then(res => this.redirect(res.id));
  }

  deleteCustomer = id => {
    deleteCustomer(id)
      .then(res => {
        getCustomers()
          .then(customers => this.setState({ customers }))
      })
  }

  redirect = (id) => {
    this.props.history.push(`/customer?id=${id}`)
  }

  render() {
    return (
      <div>
        <h4>
          Customers <Badge color="secondary">{this.state ? this.state.customers.length : '0'}</Badge>
          {' '}
          <Button size="sm" onClick={this.createCustomer.bind(this)} color="success">Create Customer</Button>
        </h4>
        {
          this.state && this.state.customers && this.state.customers.length > 0
          ? <Table size="sm" bordered className="text-center">
            <thead>
              <tr>
                <th>Id</th>
                <th>Name</th>
                <th>Address</th>
                <th>Phone</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {this.state.customers.map(customer => (
                <CustomerItem
                  key={customer.id}
                  customer={customer}
                  redirect={this.redirect.bind(this, customer.id)}
                  deleteCustomer={this.deleteCustomer.bind(this, customer.id)}
                ></CustomerItem>
              ))}
            </tbody>
          </Table>
          : <div>No customers yet.</div>
        }
      </div>
    );
  }
}

export default Customers;
