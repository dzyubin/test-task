import React from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory from 'react-bootstrap-table2-filter'

const data = {
  columns: [{ // has N elements (N columns)
    type: ["string"/"number"],
    filtering: [true/false], // has filtering input
    sorting: [true/false], // has sorting arrows
    style: {} // css styles
  }],
  cells: [{  // has M*N elements (M rows)
    value: 'any_value', // any value
    style: {} // total cell style is merge with column style and cell (style = {...columns[i].style, ...cells[i*j].style})
  }]
};

export default (tableData) => {
  const { columns, cells } = tableData.data;

  const products = formatProductsArray(cells)

  return <BootstrapTable keyField='id' data={ products } columns={ columns } filter={ filterFactory() } />
}

const formatProductsArray = cells => {
  let products = []
  let product = {}
  let index = 0

  cells.forEach((c, k) => {
    if ( (k + 1) === cells.length ) {
      product.price = c.price
      products.push(product)
      return
    }

    if ( index === 3 ) {
      index = 0
      products.push(product)
      product = {}
    }

    if (c.id) product.id = c.id
    else if (c.name) product.name = c.name
    else product.price = c.price

    index++
  })

  return products
}
