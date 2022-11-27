import React, { Component } from "react";
import { ProgressBar } from "react-bootstrap";
import { Dropdown, ButtonGroup } from "react-bootstrap";
import { Link, withRouter } from "react-router-dom";

import DatePicker from "react-datepicker";
import Button from "@mui/material/Button";

import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
// import "react-datepicker/dist/react-datepicker.css";
import { Stack, IconButton, InputAdornment } from "@mui/material";
import api from "../../http-commn"
import Avatar from "@mui/material/Avatar";

const columns = [
  { id: "domainname", label: "Name", alignRight: false },
  { id: "ads_code", label: "Ads Code", alignRight: false },
  { id: "created_at", label: "Created At", alignRight: false },
  { id: "action", label: "Actions", alignRight: false },
];

export class Reports extends Component {
  handleChange = (date) => {
    this.setState({
      startDate: date,
    });
  };
  constructor(props) {
    super(props);
    this.state = {
      allDomainList: [],
      page: 0,
      rowsPerPage: 5,
    };
  }

  componentDidMount() {
    if (!localStorage.getItem("token")) {
      window.location.replace("/login");
    }
    let config = {
      method: "get",
      url: "/domains",
      headers: {},
    };
    api(config)
      .then((response) => {
        console.log(JSON.parse(JSON.stringify(response.data.data)));
        this.setState({
          allDomainList: JSON.parse(JSON.stringify(response.data.data)),
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  handleChangePage = (event, newPage) => {
    this.setState({
      page: newPage,
    });
  };

  handleChangeRowsPerPage = (event) => {
    this.setState({
      page: 0,
      rowsPerPage: +event.target.value,
    });
  };

  handleEdit = (values) => {
    console.log("The Values that you wish to edit ", values);
  };

  render() {
    return (
      <div>
        <div className="page-header">
          <h3 className="page-title">
            <span className="page-title-icon bg-gradient-primary text-white mr-2">
              <i className="mdi mdi-contacts"></i>
            </span>{" "}
            Domains{" "}
          </h3>
          <nav aria-label="breadcrumb">
            <ul className="breadcrumb">
              <li className="breadcrumb-item active" aria-current="page">
                <Link className="nav-link" to="/addDomain">
                  <button
                    type="button"
                    className="btn btn-inverse-primary btn-fw"
                  >
                    Add Domain
                  </button>
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <div className="row ">
          <div className="col-12 grid-margin">
            <div className="card mt-4">
              {/* <div className="card-body"> */}
                {/* <h4 className="card-title">Last Week Stats</h4> */}
                {/* <div className="table-responsive"> */}
                  <Paper sx={{ width: "100%", overflow: "hidden" }}>
                    <TableContainer sx={{ maxHeight: 440 }}>
                      <Table
                        stickyHeader
                        aria-label="sticky table"
                        size={"small"}
                      >
                        <TableHead>
                          <TableRow>
                            {columns.map((column) => (
                              <TableCell
                                key={column.id}
                                align={column.align}
                                style={{ minWidth: column.minWidth }}
                              >
                                {column.label}
                              </TableCell>
                            ))}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {this.state.allDomainList
                            .slice(
                              this.state.page * this.state.rowsPerPage,
                              this.state.page * this.state.rowsPerPage +
                                this.state.rowsPerPage
                            )
                            .map((row, index) => {
                              return (
                                <TableRow
                                  hover
                                  role="checkbox"
                                  tabIndex={-1}
                                  key={index}
                                  style={
                                    index % 2
                                      ? { background: "#fff" }
                                      : { background: "#f2edf3" }
                                  }
                                >
                                  {columns.map((column) => {
                                    const value = row[column.id];

                                    return (
                                      <>
                                        {column.id == "action" ? (
                                          <>
                                            <TableCell>
                                              {row["ads_code"] != undefined ||
                                              row["ads_code"] != null ? (
                                                <button
                                                  onClick={() => {
                                                    const link = `https://api.adxfire.com/${row["ads_code"]}`;
                                                    window.open(link);
                                                  }}
                                                  style={{
                                                    width: "2rem",
                                                    height: "2rem",
                                                  }}
                                                  type="button"
                                                  className="btn btn-outline-dark btn-rounded btn-icon"
                                                >
                                                  <i className="mdi mdi-download"></i>
                                                </button>
                                              ) : null}
                                              <Link
                                                // className="nav-link"
                                                to={`/editDomain/${row["_id"]}`}
                                              >
                                                <button
                                                  style={{
                                                    width: "2rem",
                                                    height: "2rem",
                                                  }}
                                                  type="button"
                                                  className="btn btn-outline-dark btn-rounded btn-icon"
                                                >
                                                  <i className="mdi mdi-border-color"></i>
                                                </button>
                                              </Link>

                                              <button
                                                style={{
                                                  width: "2rem",
                                                  height: "2rem",
                                                }}
                                                onClick={() => {
                                                  var config = {
                                                    method: "delete",
                                                    url: `/domain/delete/${row["_id"]}`,
                                                    headers: {},
                                                  };
                                                  api(config)
                                                    .then(function (response) {
                                                      window.location.reload();
                                                    })
                                                    .catch(function (error) {
                                                      console.log(error);
                                                    });
                                                }}
                                                type="button"
                                                className="btn btn-outline-danger btn-rounded btn-icon"
                                              >
                                                <i className="mdi mdi-delete"></i>
                                              </button>
                                            </TableCell>
                                          </>
                                        ) : (
                                          <TableCell
                                            key={column.id}
                                            align={column.align}
                                          >
                                            {column.format &&
                                            typeof value === "number"
                                              ? column.format(value)
                                              : value}
                                          </TableCell>
                                        )}
                                      </>
                                    );
                                  })}
                                </TableRow>
                              );
                            })}
                        </TableBody>
                      </Table>
                    </TableContainer>
                    <TablePagination
                      rowsPerPageOptions={[5, 25, 100]}
                      component="div"
                      count={this.state.allDomainList.length}
                      rowsPerPage={this.state.rowsPerPage}
                      page={this.state.page}
                      onPageChange={this.handleChangePage}
                      onRowsPerPageChange={this.handleChangeRowsPerPage}
                    />
                  </Paper>
                {/* </div>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Reports;
