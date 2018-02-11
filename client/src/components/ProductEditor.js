import React, { Component } from 'react';
import { parse } from 'query-string';

import {
  getInvoice,
  deleteInvoice,
  getCustomers,
  getProducts,
  updateInvoice,
  getInvoiceItems,
  createInvoiceItem,
  updateInvoiceItem,
  deleteInvoiceItem
} from '../utils/api.js';

import {
  Row,
  Col,
  Button,
  Input,
  InputGroup,
  InputGroupAddon,
  Table,
} from 'reactstrap';

class ProductEditor extends Component {
  render() {
    return (
      <h1>ProductEditor</h1>
    )
  }
}

export default ProductEditor;
