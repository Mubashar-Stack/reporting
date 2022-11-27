import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { Collapse } from "react-bootstrap";
import { Trans } from "react-i18next";

const userProfile = `https://api.adxfire.com/${localStorage.getItem("photo")}`;
class Sidebar extends Component {
  state = {
    userProfile: "",
    roleIs: localStorage.getItem("type"),
  };

  toggleMenuState(menuState) {
    if (this.state[menuState]) {
      this.setState({ [menuState]: false });
    } else if (Object.keys(this.state).length === 0) {
      this.setState({ [menuState]: true });
    } else {
      Object.keys(this.state).forEach((i) => {
        this.setState({ [i]: false });
      });
      this.setState({ [menuState]: true });
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      this.onRouteChanged();
    }
  }

  onRouteChanged() {
    document.querySelector("#sidebar").classList.remove("active");
    Object.keys(this.state).forEach((i) => {
      this.setState({ [i]: false });
    });

    const dropdownPaths = [
      { path: "/apps", state: "appsMenuOpen" },
      { path: "/basic-ui", state: "basicUiMenuOpen" },
      { path: "/advanced-ui", state: "advancedUiMenuOpen" },
      { path: "/form-elements", state: "formElementsMenuOpen" },
      { path: "/tables", state: "tablesMenuOpen" },
      { path: "/maps", state: "mapsMenuOpen" },
      { path: "/icons", state: "iconsMenuOpen" },
      { path: "/charts", state: "chartsMenuOpen" },
      { path: "/user-pages", state: "userPagesMenuOpen" },
      { path: "/error-pages", state: "errorPagesMenuOpen" },
      { path: "/general-pages", state: "generalPagesMenuOpen" },
      { path: "/ecommerce", state: "ecommercePagesMenuOpen" },
    ];

    dropdownPaths.forEach((obj) => {
      if (this.isPathActive(obj.path)) {
        this.setState({ [obj.state]: true });
      }
    });
  }

  render() {
    return (
      <nav className="sidebar sidebar-offcanvas" id="sidebar">
        <ul className="nav">
          <li className="nav-item nav-profile">
            <a
              href="!#"
              className="nav-link"
              onClick={(evt) => evt.preventDefault()}
            >
              <div className="nav-profile-image">
                {localStorage.getItem("photo") && (
                  <img src={userProfile} alt="profile" />
                )}
                <span className="login-status online"></span>{" "}
                {/* change to offline or busy as needed */}
              </div>
              <div className="nav-profile-text">
                <span className="font-weight-bold mb-2">
                  <Trans>
                    {window.localStorage.getItem("first_name")?.toUpperCase()}{" "}
                    {window.localStorage.getItem("last_name")?.toUpperCase()}
                  </Trans>
                </span>
                <span className="text-secondary text-small">
                  <Trans>
                    {window.localStorage.getItem("type")?.toUpperCase()}
                  </Trans>
                </span>
              </div>
              <i className="mdi mdi-bookmark-check text-success nav-profile-badge"></i>
            </a>
          </li>
          {localStorage.getItem("type") === "admin" ? (
            <>
              <li
                className={
                  this.isPathActive("/home") ? "nav-item active" : "nav-item"
                }
              >
                <Link className="nav-link" to="/home">
                  <span className="menu-title">
                    <Trans>Dashboard</Trans>
                  </span>
                  <i className="mdi mdi-home menu-icon"></i>
                </Link>
              </li>
              <li
                className={
                  this.isPathActive("/stats") ? "nav-item active" : "nav-item"
                }
              >
                <Link className="nav-link" to="/stats">
                  <span className="menu-title">
                    <Trans>Stats</Trans>
                  </span>
                  <i className="mdi mdi-chart-bar menu-icon"></i>
                </Link>
              </li>
              <li
                className={
                  this.isPathActive("/users") ? "nav-item active" : "nav-item"
                }
              >
                <Link className="nav-link" to="/users">
                  <span className="menu-title">
                    <Trans>Users</Trans>
                  </span>
                  <i className="mdi mdi-contacts menu-icon"></i>
                </Link>
              </li>
              <li
                className={
                  this.isPathActive("/reports") ? "nav-item active" : "nav-item"
                }
              >
                <Link className="nav-link" to="/reports">
                  <span className="menu-title">
                    <Trans>Reports</Trans>
                  </span>
                  <i className="mdi mdi-crosshairs-gps menu-icon"></i>
                </Link>
              </li>
              <li
                className={
                  this.isPathActive("/domains") ? "nav-item active" : "nav-item"
                }
              >
                <Link className="nav-link" to="/domains">
                  <span className="menu-title">
                    <Trans>Domains</Trans>
                  </span>
                  <i className="mdi mdi-format-list-bulleted menu-icon"></i>
                </Link>
              </li>
              <li
                className={
                  this.isPathActive("/usersDomains")
                    ? "nav-item active"
                    : "nav-item"
                }
              >
                <Link className="nav-link" to="/usersDomains">
                  <span className="menu-title">
                    <Trans>Users Domains</Trans>
                  </span>
                  <i className="mdi mdi-medical-bag menu-icon"></i>
                </Link>
              </li>
              <li
                className={
                  this.isPathActive("/finalPayAbles")
                    ? "nav-item active"
                    : "nav-item"
                }
              >
                <Link className="nav-link" to="/finalPayAbles">
                  <span className="menu-title">
                    <Trans>Final Payable</Trans>
                  </span>
                  <i className="mdi mdi-file-document-box menu-icon"></i>
                </Link>
              </li>
            </>
          ) : (
            <>
              <li
                className={
                  this.isPathActive("/home") ? "nav-item active" : "nav-item"
                }
              >
                <Link className="nav-link" to="/home">
                  <span className="menu-title">
                    <Trans>Dashboard</Trans>
                  </span>
                  <i className="mdi mdi-home menu-icon"></i>
                </Link>
              </li>
              <li
                className={
                  this.isPathActive("/stats") ? "nav-item active" : "nav-item"
                }
              >
                <Link className="nav-link" to="/stats">
                  <span className="menu-title">
                    <Trans>Stats</Trans>
                  </span>
                  <i className="mdi mdi-chart-bar menu-icon"></i>
                </Link>
              </li>
              <li
                className={
                  this.isPathActive("/finalPayable")
                    ? "nav-item active"
                    : "nav-item"
                }
              >
                <Link className="nav-link" to="/finalPayable">
                  <span className="menu-title">
                    <Trans>Final Payable</Trans>
                  </span>
                  <i className="mdi mdi-crosshairs-gps menu-icon"></i>
                </Link>
              </li>

              <li
                className={
                  this.isPathActive("/profile") ? "nav-item active" : "nav-item"
                }
              >
                <Link className="nav-link" to="/profile">
                  <span className="menu-title">
                    <Trans>Profile</Trans>
                  </span>
                  <i className="mdi mdi-security menu-icon"></i>
                </Link>
              </li>

              <li
                className={
                  this.isPathActive("/sites") ? "nav-item active" : "nav-item"
                }
              >
                <Link className="nav-link" to="/sites">
                  <span className="menu-title">
                    <Trans>Domains</Trans>
                  </span>
                  <i className="mdi mdi-format-list-bulleted menu-icon"></i>
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    );
  }

  isPathActive(path) {
    return this.props.location.pathname.startsWith(path);
  }

  componentDidMount() {
    this.onRouteChanged();
    // add class 'hover-open' to sidebar navitem while hover in sidebar-icon-only menu
    const body = document.querySelector("body");
    document.querySelectorAll(".sidebar .nav-item").forEach((el) => {
      el.addEventListener("mouseover", function () {
        if (body.classList.contains("sidebar-icon-only")) {
          el.classList.add("hover-open");
        }
      });
      el.addEventListener("mouseout", function () {
        if (body.classList.contains("sidebar-icon-only")) {
          el.classList.remove("hover-open");
        }
      });
    });
  }
}

export default withRouter(Sidebar);
