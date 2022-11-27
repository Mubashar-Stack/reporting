import React, { Component } from "react";
import { Dropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Trans } from "react-i18next";
const userProfile = `https://api.adxfire.com/${localStorage.getItem("photo")}`;

class Navbar extends Component {
  toggleOffcanvas() {
    document.querySelector(".sidebar-offcanvas").classList.toggle("active");
  }
  toggleRightSidebar() {
    document.querySelector(".right-sidebar").classList.toggle("open");
  }
  render() {
    return (
      <nav className="navbar default-layout-navbar col-lg-12 col-12 p-0 fixed-top d-flex flex-row">
        <div className="text-center navbar-brand-wrapper d-flex align-items-center justify-content-center">
          <Link className="navbar-brand brand-logo" to="/">
            <img
              src={require("../../assets/images/adxfire logo.png")}
              alt="logo"
            />
          </Link>
          <Link className="navbar-brand brand-logo-mini" to="/">
            <img
              src={require("../../assets/images/adxfire logo.png")}
              alt="logo"
            />
          </Link>
        </div>
        <div className="navbar-menu-wrapper d-flex align-items-stretch">
          <button
            className="navbar-toggler navbar-toggler align-self-center"
            type="button"
            onClick={() => document.body.classList.toggle("sidebar-icon-only")}
          >
            <span className="mdi mdi-menu"></span>
          </button>

          <ul className="navbar-nav navbar-nav-right">
            <li className="nav-item nav-profile">
              <Dropdown alignRight>
                <Dropdown.Toggle className="nav-link">
                  <div className="nav-profile-img">
                    {localStorage.getItem("photo") && (
                      <img src={userProfile} alt="profile" />
                    )}
                    <span className="availability-status online"></span>
                  </div>
                  <div className="nav-profile-text">
                    <p className="mb-1 text-black">
                      <Trans>
                        {window.localStorage
                          .getItem("first_name")
                          ?.toUpperCase()}{" "}
                        {window.localStorage
                          .getItem("last_name")
                          ?.toUpperCase()}
                      </Trans>
                    </p>
                  </div>
                </Dropdown.Toggle>

                <Dropdown.Menu className="navbar-dropdown">
                  <Dropdown.Item
                    onClick={(evt) => {
                      window.localStorage.removeItem("token");
                      window.localStorage.removeItem("type");
                      window.location.replace("/");
                    }}
                  >
                    <i className="mdi mdi-logout mr-2 text-primary"></i>
                    <Trans>Signout</Trans>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </li>
          </ul>
          <button
            className="navbar-toggler navbar-toggler-right d-lg-none align-self-center"
            type="button"
            onClick={this.toggleOffcanvas}
          >
            <span className="mdi mdi-menu"></span>
          </button>
        </div>
      </nav>
    );
  }
}

export default Navbar;
