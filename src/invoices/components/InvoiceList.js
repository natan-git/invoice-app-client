import React from "react";
import InvoiceItem from "./InvoiceItem";
import "./InvoiceList.css";
import empty from "../../assets/illustration-empty.svg";
import { useSpring, animated } from "react-spring";

const InvoiceList = (props) => {
  const fade = useSpring({
    from: { opacity: 0, y: 50 },
    to: { opacity: 1, y: 0 },
  });
  console.log("data in InvoiceList CMP", props.items);
  if (props.items.length === 0 || props.items === undefined) {
    return (
      <div className="empty-list">
        <img src={empty} />
        <h2>
          No Invoices found.
          <br />
        </h2>
      </div>
    );
  }

  return (
    <animated.ul className="invoice-list" style={fade}>
      {props.items.map((invoice) => (
        <InvoiceItem
          key={invoice.id}
          id={invoice.id}
          description={invoice.description}
          paymentDue={invoice.paymentDue}
          clientName={invoice.clientName}
          total={invoice.total}
          status={invoice.status}
        />
      ))}
    </animated.ul>
  );
};

export default InvoiceList;
