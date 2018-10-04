import React, { Component } from 'react';
import logo from './logo-white.svg';
import './App.css';
import { Col, Grid, Row } from "react-bootstrap";
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import { textFilter } from 'react-bootstrap-table2-filter';

import Table from "./Table";

class App extends Component {
  render() {
    const data = {
      columns: [
        {
          dataField: 'id',
          text: 'Product ID',
          sort: true
        }, {
          dataField: 'name',
          text: 'Product Name',
          filter: textFilter()
        }, {
          dataField: 'price',
          text: 'Product Price',
          style: {
            backgroundColor: "#11E29B",
            color: "white"
          },
          sort: true,
          sortFunc: (a, b, order) => {
            if (order === 'asc') {
              return parseFloat(b) - parseFloat(a);
            }

            return parseFloat(a) - parseFloat(b);
          }
        }
      ],
      cells: generateProductsArray()
    };

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
        </header>
        <Grid>
          <Row>
            <Col xs={12}>
              <Table data={data} />
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default App;

const generateProductsArray = () => {
  let products = []
  for ( let i = 1; i < 51; i++ ) {
    products.push({
      id: i
    })
    products.push({
      name: `Product ${i}`,
    })
    products.push({
      price: (Math.ceil(Math.random() * 100) * 10).toFixed(2)
    })
  }

  return products
}