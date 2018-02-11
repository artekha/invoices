import React, { Component } from 'react';
import { getProducts } from '../utils/api.js';

import { Badge, Table } from 'reactstrap';

const ProductItem = ({ data }) => (
  <tr>
    <td>{data.id}</td>
    <td>{data.name}</td>
    <td>{data.price}</td>
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

  render() {
    return (
      <div>
        <h5>Products <Badge color="secondary">{this.state ? this.state.products.length : '0'}</Badge></h5>
        {
          this.state && this.state.products && this.state.products.length > 0
          ? <Table size="sm" bordered className="text-center">
            <thead>
              <tr>
                <th>Id</th>
                <th>Name</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {this.state.products.map(product => (
                <ProductItem
                  key={product.id}
                  data={product}
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
