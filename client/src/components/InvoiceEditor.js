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
  Form,
  FormGroup,
} from 'reactstrap';

import InvoiceEditorModal from './InvoiceEditorModal';

class InvoiceEditor extends Component {
  state = {
    customersModalOpen: false,
    productsModalOpen: false,
    customers: [],
    products: [],
    invoice: null,
    invoiceItems: [],
    invoiceItem: null
  }

  componentWillMount() {
    const invoiceId = parse(this.props.location.search);
    this.getCustomersAndProducts().then(() => {
      getInvoice(invoiceId.id)
        .then(invoice => this.setState({ invoice }))

      getInvoiceItems(invoiceId.id)
        .then(invoiceItems => this.setState({ invoiceItems }));
    });
  }

  getCustomersAndProducts = () => {
    const customersReady = new Promise((resolve, reject) => {
      getCustomers()
        .then(customers => this.setState({ customers }, () => resolve()));
    });
    const productsReady = new Promise((resolve, reject) => {
      getProducts()
        .then(products => this.setState({ products }, () => resolve()));
    });
    return Promise.all([customersReady, productsReady]);
  }

  deleteInvoice = () => {
    deleteInvoice(this.state.invoice.id)
      .then(() => {
        this.props.history.push('/');
      });
  }

  selectCustomer = customer => {
    if (customer) {
      this.setState({
        invoice: {
          ...this.state.invoice,
          customer_id: customer.id
        },
        customer: customer
      });
      this.toggleModal('customers');
    } else {
      this.setState({
        invoice: {
          ...this.state.invoice,
          customer_id: null
        },
        customer: null
      });
    }
    const customerId = (customer && customer.id) ? customer.id : null;
    const updatedInvoice = {
      'customer_id': customerId
    }
    updateInvoice(this.state.invoice.id, updatedInvoice);
  }

  selectProduct = product => {
    const newInvoiceItem = {
      invoice_id: this.state.invoice.id,
      product_id: product.id,
      quantity: 1
    }
    createInvoiceItem(this.state.invoice.id, newInvoiceItem)
      .then(res => {
        newInvoiceItem.id = res.id;
        this.setState({
          invoiceItem: {
            id: newInvoiceItem.id,
            invoice_id: newInvoiceItem.invoice_id,
            product_id: newInvoiceItem.product_id,
            quantity: newInvoiceItem.quantity
          }
        }, () => {
          const s = this.state;
          const updatedInvoiceItems =
            s.invoiceItems.concat([s.invoiceItem]);

          this.setState({
            invoiceItem: null,
            invoiceItems: null
          }, () => {
            this.setState({ invoiceItems: updatedInvoiceItems })
          });
        });
      });
    this.toggleModal('products');
  }

  deleteProduct = id => {
    const invoiceItems = this.state.invoiceItems;
    const invoiceItemIndex =
      invoiceItems
        .findIndex(invoiceItem => invoiceItem.id === id);

    if (invoiceItemIndex !== -1) {
      const updatedInvoiceItems =
        invoiceItems.slice(0, invoiceItemIndex)
          .concat(invoiceItems
            .slice(invoiceItemIndex + 1, invoiceItems.length)
          );

      this.setState({
        invoiceItems: null
      }, () => {
        this.setState({ invoiceItems: updatedInvoiceItems })
        deleteInvoiceItem(this.state.invoice.id, id)
      });
    }
  }

  changeQuantity = (data, action) => {
    const invoiceItemIndex = this.state.invoiceItems
      .findIndex(invoiceItem => invoiceItem.id === data.id);
    let invoiceItem = Object.assign({}, this.state.invoiceItems[invoiceItemIndex]);
    let invoiceItemQuantity = invoiceItem.quantity;
    if (action === 'increase') {
      invoiceItemQuantity += 1;
    }
    if (action === 'decrease') {
      invoiceItemQuantity -= 1;
      invoiceItemQuantity = Math.max(invoiceItemQuantity, 1);
    }
    invoiceItem.quantity = invoiceItemQuantity;

    const updatedInvoiceItems =
      this.state.invoiceItems.slice(0, invoiceItemIndex)
        .concat([invoiceItem], this.state.invoiceItems
          .slice(invoiceItemIndex + 1, this.state.invoiceItems.length)
        );

    this.setState({ invoiceItems: null }, () => {
      this.setState({ invoiceItems: updatedInvoiceItems})
    });

    updateInvoiceItem(this.state.invoice.id, invoiceItem.id, invoiceItem);
  }

  inputQuantity = (data, e) => {
    const newValue = +e.target.value;
    const invoiceItemIndex = this.state.invoiceItems
      .findIndex(invoiceItem => invoiceItem.id === data.id);
    let invoiceItem = Object.assign({}, this.state.invoiceItems[invoiceItemIndex]);
    let invoiceItemQuantity = +newValue;
    invoiceItem.quantity = Math.max(invoiceItemQuantity, 1);
    const updatedInvoiceItems =
      this.state.invoiceItems.slice(0, invoiceItemIndex)
        .concat([invoiceItem], this.state.invoiceItems
          .slice(invoiceItemIndex + 1, this.state.invoiceItems.length)
        );

    this.setState({ invoiceItems: updatedInvoiceItems });

    updateInvoiceItem(this.state.invoice.id, invoiceItem.id, invoiceItem);
  }

  onblurQuantity = e => {
    e.target.value = Math.max(+e.target.value, 1);
  }

  inputDiscount = e => {
    let discount = +e.target.value;
    if (discount < 0) {
      discount = 0;
    }
    if (discount > 100) {
      discount = 100;
    }
    discount = +discount.toFixed(2);
    this.setState({
      invoice: {
        ...this.state.invoice,
        discount
      }
    }, () => {
      updateInvoice(this.state.invoice.id, this.state.invoice)
    });
  }

  onblurDiscount = e => {
    let discount = +e.target.value;
    e.target.value = +discount.toFixed(2);
    if (discount < 0) {
      e.target.value = 0;
    }
    if (discount > 100) {
      e.target.value = 100;
    }
  }

  calculateTotal = () => {
    let total = 0;
    const s = this.state;

    if (!s.invoiceItems || !s.invoice) return 0;

    s.invoiceItems.forEach(invoiceItem => {
      let invoiceItemPrice = s.products
        .find(product => product.id === invoiceItem.product_id).price;

      invoiceItemPrice *= invoiceItem.quantity;
      total += +invoiceItemPrice;
    });

    let discount = s.invoice.discount;
    let distract = 0;

    if (discount !== 0) {
      distract = total * discount / 100 ;
    }

    total = total - distract;

    total = +total.toFixed(2);

    if (s.invoice && s.invoice.id) {
      updateInvoice(s.invoice.id, { total, discount });
    }

    return total;
  }

  toggleModal = modalName => {
    const s = this.state;
    if (modalName === 'products') {
      this.setState({ productsModalOpen: !s.productsModalOpen });
    }
    if (modalName === 'customers') {
      this.setState({ customersModalOpen: !s.customersModalOpen });
    }
  }

  render() {
    const s = this.state;
    const { invoiceItems } = s;
    const customer = s.invoice && s.customers
      .find(customer => customer.id === s.invoice.customer_id);
    if (!s.invoice) return null;
    return (
      <div>
        <h1 className="text-center">New invoice</h1>
        <Row>
          <Col xs="2"><h4>Customer</h4></Col>
          <Col xs="10">
            <Button
              color="success"
              size="sm"
              onClick={this.toggleModal.bind(this, 'customers')}
            >
              Select customer
            </Button>
          </Col>
        </Row>
        {
          !customer
          ? <h5>Customer not selected</h5>
          : <div>
              <div>{customer.name} - {customer.phone}{' '}
                <Button
                  color="danger"
                  size="sm"
                  onClick={this.selectCustomer.bind(this, null)}
                >
                  Delete
                </Button>
              </div>
            </div>
        }
        <Row>
          <Col xs="2"><h4>Products</h4></Col>
          <Col xs="10">
            <Button
              color="success"
              size="sm"
              onClick={this.toggleModal.bind(this, 'products')}
            >
              Select product
            </Button>
          </Col>
        </Row>
        {
          invoiceItems && invoiceItems.length > 0
          ? <Table size="sm" bordered className="text-center">
            <thead>
              <tr>
                <th>Id</th>
                <th>Name</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {this.state.invoiceItems &&
              this.state.invoiceItems.length > 0 &&
              this.state.invoiceItems.map((invoiceItem, index) => {
                const s = this.state;

                const product = s.products && s.products.length > 0 && s.products
                  .find(product => product.id === invoiceItem.product_id);

                if (!product) return false;
                return (
                  <tr key={`invoice-item-${index}`}>
                    <td>{invoiceItem.product_id}</td>
                    <td>{product.name}</td>
                    <td>{product.price}</td>
                    <td>
                      <InputGroup style={{display: 'inline-flex', width: 'unset'}} size="sm">
                        <InputGroupAddon addonType="prepend">
                          <Button
                            onClick={this.changeQuantity.bind(this, invoiceItem, 'decrease')}>-</Button>
                        </InputGroupAddon>
                        <Input
                          defaultValue={invoiceItem.quantity}
                          onChange={this.inputQuantity.bind(this, invoiceItem)}
                          onBlur={this.onblurQuantity.bind(this)}
                          className="text-center"
                          type="number"
                        ></Input>
                        <InputGroupAddon addonType="append">
                          <Button
                            onClick={this.changeQuantity.bind(this, invoiceItem, 'increase')}>+</Button>
                        </InputGroupAddon>
                      </InputGroup>
                    </td>
                    <td>
                      <Button
                        color="danger"
                        size="sm"
                        onClick={this.deleteProduct.bind(this, invoiceItem.id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </Table>
          : <h5>Products not selected</h5>
        }
        <h4>Discount:</h4>
        <Input
          defaultValue={this.state.invoice.discount}
          onChange={this.inputDiscount.bind(this)}
          onBlur={this.onblurDiscount.bind(this)}
          type="number"></Input>
        <h1>Total: ${this.calculateTotal()}</h1>
        <Button onClick={this.deleteInvoice} color="danger" size="sm">Delete this invoice</Button>
        {this.state.customersModalOpen ?
          <InvoiceEditorModal
            headline='customer'
            isOpen={this.state.customersModalOpen}
            onToggleClick={this.toggleModal.bind(this, 'customers')}
            data={this.state.customers}
            selectedData={this.state.invoice}
            items={['id', 'name', 'address', 'phone']}
            selectItem={this.selectCustomer}
          ></InvoiceEditorModal> : null}
        {this.state.productsModalOpen ?
          <InvoiceEditorModal
            headline='products'
            isOpen={this.state.productsModalOpen}
            onToggleClick={this.toggleModal.bind(this, 'products')}
            data={this.state.products}
            selectedData={this.state.invoiceItems}
            items={['id', 'name', 'price']}
            selectItem={this.selectProduct}
          ></InvoiceEditorModal> : null}
      </div>
    )
  }
}

export default InvoiceEditor;
