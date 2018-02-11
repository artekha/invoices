import React, { Component } from 'react';

import {
  getInvoices,
  createInvoice,
  deleteInvoice
} from '../utils/api.js';

import {
  Badge,
  Table,
  Button,
} from 'reactstrap';

const InvoiceItem = ({ invoice, redirect, deleteInvoice }) => (
  <tr>
    <td>{invoice.id}</td>
    <td>{invoice.customer_id}</td>
    <td>{invoice.discount} %</td>
    <td>${invoice.total}</td>
    <td>
      <Button onClick={redirect} size="sm" color="info">Edit</Button>{' '}
      <Button onClick={deleteInvoice} size="sm" color="danger">Delete</Button>
    </td>
  </tr>
);

class Invoices extends Component {
  state = {
    invoices: []
  }

  componentDidMount() {
    getInvoices()
      .then(invoices => this.setState({ invoices }));
  }

  createInvoice = () => {
    const newInvoice = {
      discount: 0,
      total: 0
    }
    createInvoice(newInvoice)
      .then(res => this.redirect(res.id));
  }

  deleteInvoice = id => {
    deleteInvoice(id)
      .then(res => {
        getInvoices()
          .then(invoices => this.setState({ invoices }));
      })
  }

  redirect = (id) => {
    this.props.history.push(`/invoice?id=${id}`)
  }

  render() {
    return (
      <div>
        <h4>
          Invoices <Badge color="secondary">{this.state ? this.state.invoices.length : '0'}</Badge>
          {' '}
          <Button size="sm" onClick={this.createInvoice.bind(this)} color="success">Create Invoice</Button>
        </h4>
        {
          this.state && this.state.invoices && this.state.invoices.length > 0
          ? <Table size="sm" bordered className="text-center">
            <thead>
              <tr>
                <th>Id</th>
                <th>Customer id</th>
                <th>Discount</th>
                <th>Total</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {this.state.invoices.map(invoice => (
                <InvoiceItem
                  key={invoice.id}
                  invoice={invoice}
                  redirect={this.redirect.bind(this, invoice.id)}
                  deleteInvoice={this.deleteInvoice.bind(this, invoice.id)}
                ></InvoiceItem>
              ))}
            </tbody>
          </Table>
          : <div>Nothing yet</div>
        }
      </div>
    );
  }
}

export default Invoices;
