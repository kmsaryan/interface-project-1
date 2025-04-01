import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import "../styles/App.css"; // (Optional) If you have layout-specific styles.

const Layout = ({ children }) => {
  return (
    <div className="layout-container">
      <Header />
      <main className="main-content">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
