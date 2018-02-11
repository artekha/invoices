import React, { Component } from 'react';

import {
  Container,
  Navbar,
  Nav,
  NavItem,
} from 'reactstrap';

import {
  BrowserRouter as Router,
  Route,
  NavLink
} from 'react-router-dom';

import Products from './Products';
import Customers from './Customers';
import Invoices from './Invoices';
import InvoiceEditor from './InvoiceEditor';
import CustomerEditor from './CustomerEditor';
import ProductEditor from './ProductEditor';

class App extends Component {

  render() {
    return (
      <div className="App">
        <Router>
          <Container>

            <Navbar>
              <NavLink to="/">Invoice App</NavLink>
              <Nav>
                <NavItem>
                  <NavLink to="/products">Products</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink to="/customers">Customers</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink to="/">Invoices</NavLink>
                </NavItem>
              </Nav>
            </Navbar>

            <Route exact path="/products" component={Products}/>
            <Route exact path="/customers" component={Customers}/>
            <Route exact path="/" component={Invoices}/>
            <Route exact path="/invoice" component={InvoiceEditor}/>
            <Route exact path="/customer" component={CustomerEditor}/>
            <Route exact path="/product" component={ProductEditor}/>
          </Container>
        </Router>
      </div>
    );
  }
}

export default App;
