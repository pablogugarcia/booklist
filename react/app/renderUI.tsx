import React, { createContext, useContext, FunctionComponent, useEffect } from "react";
import { render } from "react-dom";

import "./styles.scss";

import styles from "./styles.module.scss";
const { list, ["list-item"]: listItem } = styles;

const Component = () => (
  <div className="pane">
    <span>Pane Content</span>
    <ul className={list}>
      <li className={listItem}>Item 1</li>
      <li className={listItem}>Item 2</li>
      <li className={listItem}>Item 3</li>
    </ul>
  </div>
);

export default () =>
  render(
    <div style={{ padding: "50px" }}>
      <br />
      <br />
      <br />
      <br />
      <Component />
    </div>,
    document.getElementById("home")
  );
