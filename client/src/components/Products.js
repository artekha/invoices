import React, { Component } from 'react';
import {
  getProducts,
  createProduct,
  deleteProduct
} from '../utils/api.js';

import {
  Badge,
  Table,
  Button,
} from 'reactstrap';

const ProductItem = ({ product, redirect, deleteProduct }) => (
  <tr>
    <td>{product.id}</td>
    <td>{product.name}</td>
    <td>{product.price}</td>
    <td>
      <Button onClick={redirect} size="sm" color="info">Edit</Button>{' '}
      <Button onClick={deleteProduct} size="sm" color="danger">Delete</Button>
    </td>
  </tr>
);

class Products extends Component {
  state = {
    products: []
  }

  componentDidMount() {
    getProducts()
      .then(products => this.setState({ products }))
  }

  createProduct = () => {
    createProduct()
      .then(res => this.redirect(res.id));
  }

  deleteProduct = id => {
    deleteProduct(id)
      .then(res => {
        getProducts()
          .then(products => this.setState({ products }))
      })
  }

  redirect = id => {
    this.props.history.push(`/product?id=${id}`)
  }

  render() {
    return (
      <div>
        <h4>
          Products <Badge color="secondary">{this.state ? this.state.products.length : '0'}</Badge>
          {' '}
          <Button size="sm" onClick={this.createProduct.bind(this)} color="success">Create Product</Button>
        </h4>
        {
          this.state && this.state.products && this.state.products.length > 0
          ? <Table size="sm" bordered className="text-center">
            <thead>
              <tr>
                <th>Id</th>
                <th>Name</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {this.state.products.map(product => (
                <ProductItem
                  key={product.id}
                  product={product}
                  redirect={this.redirect.bind(this, product.id)}
                  deleteProduct={this.deleteProduct.bind(this, product.id)}
                ></ProductItem>
              ))}
            </tbody>
          </Table>
          : <div>Nothing yet</div>
        }
      </div>
    );
  }
}

export default Products;
