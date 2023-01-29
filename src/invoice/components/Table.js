import React from "react";
import "./Table.css";

const Table = ({ items, columns }) => {
  return (
    <table>
      <thead>
        <tr>
          {/* <th>Item Name</th>
          <th>QTY.</th>
          <th>Price</th>
          <th>Total</th> */}
          {columns.map((item, index) => (
            <TableHeadItem key={index} item={item} />
          ))}
        </tr>
      </thead>
      <tbody>
        {items.map((item, index) => (
          <TableRow key={index} item={item} />
        ))}
      </tbody>
    </table>
  );
};

const TableHeadItem = ({ item }) => <th>{item.title}</th>;
const TableRow = ({ item }) => (
  <tr>
    <td>{item.name}</td>
    <td>{item.quantity}</td>
    <td>${item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
    <td>{item.total}</td>
  </tr>
);

export default Table;
