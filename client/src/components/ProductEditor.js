import React, { Component } from 'react';
import { parse } from 'query-string';

import {
  getProduct,
  updateProduct,
} from '../utils/api.js';

import {
  Form,
  FormGroup,
  Input,
  Button,
  Label
} from 'reactstrap';

class ProductEditor extends Component {
  state = {
    product: null
  }

  componentWillMount() {
    const productId = parse(this.props.location.search);
    getProduct(productId.id)
      .then(product => this.setState({ product }))
  }

  changeProduct = (value, key, e) => {
    const newValue = e.target.value;
    this.setState({
      product: {
        ...this.state.product,
        [key]: newValue
      }
    });
  }

  updateProduct = () => {
    const s = this.state;
    updateProduct(s.product.id, s.product)
      .then(() => this.props.history.push(`/products`))
  }

  render() {
    const product = this.state.product;
    if (!product) return null;
    return (
      <div>
        <h4>Edit product</h4>
        <Form>
          <FormGroup>
            <Label>Name</Label>
            <Input
              onChange={this.changeProduct.bind(this, product.name, 'name')}
              value={product.name || ''}
            ></Input>
          </FormGroup>
          <FormGroup>
            <Label>Price</Label>
            <Input
              onChange={this.changeProduct.bind(this, product.price, 'price')}
              value={product.price || ''}
            ></Input>
          </FormGroup>
          <Button onClick={this.updateProduct} color="success">Save</Button>
        </Form>
      </div>
    )
  }
}

export default ProductEditor;
