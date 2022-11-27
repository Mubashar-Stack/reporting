import React, { Component } from "react";
import { ProgressBar } from "react-bootstrap";
import { Dropdown, ButtonGroup } from "react-bootstrap";


import DatePicker from "react-datepicker";
import { Form } from "react-bootstrap";

import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
// import "react-datepicker/dist/react-datepicker.css";
import api from "../../http-commn"
import { replace } from "lodash";
import numeral from "numeral";

const columns = [
  { id: "domain", label: "Domain Name", alignRight: false },
  { id: "gross_revenue", label: "Gross Revenue", alignRight: false },
  { id: "deductions", label: "Deductions", alignRight: false },
  { id: "net_revenue", label: "Net Revenue", alignRight: false },
  // { id: "created_at", label: "Created At", alignRight: false },
];

export class Dashboard extends Component {
  handleChange = (date) => {
    this.setState({
      startDate: date,
    });
  };
  constructor(props) {
    super(props);
    this.state = {
      page: 0,
      rowsPerPage: 5,
      domainSelected: "",
      allDomainList: [],
      filterTableData: [],
      filterData: null,
      show: false,
      filter: "Weekly",
      fromdate: new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate() - 7
      )
        .toISOString()
        .slice(0, 19)
        .replace("T", " "),

      todate: new Date().toISOString().slice(0, 19).replace("T", " "),
    };
  }

  componentDidMount() {
    if (!localStorage.getItem("token")) {
      window.location.replace("/login");
    }

    this.getStats();
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

  getStats = () => {
    let config = {
      method: "get",
      url: `/user-monthly-payable?domain_name=${
        this.state.domainSelected
      }&month=${
        new Date(this.state.fromdate)
          .toISOString()
          .slice(0, 19)
          .replace("T", " ")
          .split(" ")[0]
      }`,
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem("token")}`,
      },
    };
    api(config)
      .then((response) => {
        console.log(JSON.parse(JSON.stringify(response.data.data)));
        this.setState({
          filterTableData: JSON.parse(JSON.stringify(response.data.data)),
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  fShortenNumber = (number) => {
    return replace(numeral(number).format("0.00a"), ".00", "");
  };

  handleDomainChange = (domain) => {
    this.setState(
      {
        domainSelected: domain,
      },
      () => {
        this.getStats();
      }
    );
  };

  calculateNetRevenue = () => {
    let totalNetRevenue = 0;
    this.state.filterTableData.map((data) => {
      let { net_revenue } = data;
      totalNetRevenue += net_revenue;
    });

    return totalNetRevenue;
  };

  render() {
    return (
      <div>
        <div className="page-header">
          <h3 className="page-title">
            <span className="page-title-icon bg-gradient-primary text-white mr-2">
              <i className="mdi mdi-chart-bar"></i>
            </span>{" "}
            Final Payment Details{" "}
          </h3>
          <nav aria-label="breadcrumb">
            <ul className="breadcrumb">
              <li className="breadcrumb-item active" aria-current="page">
                <span></span>Overview{" "}
                <i className="mdi mdi-alert-circle-outline icon-sm text-primary align-middle"></i>
              </li>
            </ul>
          </nav>
        </div>

        <div className="col-lg-12 grid-margin">
          <div className="d-flex justify-content-start mt-3">
            <DatePicker
              className="custom-select w-50 btn btn-outline-primary text-dark "
              style={{ width: "121px" }}
              selected={new Date(this.state.fromdate)}
              dateFormat="MM/yyyy"
              showMonthYearPicker
              showFullMonthYearPicker
              showTwoColumnMonthYearPicker
              onChange={(date) => {
                this.setState(
                  {
                    fromdate: date,
                  },
                  () => {
                    this.getStats();
                  }
                );
              }}
            />
          </div>
        </div>

        <div className="row justify-content-start d-flex align-items-start">
          <div className="col-md-3">
            <div
              className="card  bg-gradient-danger card-img-holder text-white"
              style={{ marginTop: 8 }}
            >
              <div className="">
                <img
                  src={require("../../assets/images/dashboard/circle.svg")}
                  className="card-img-absolute"
                  alt="circle"
                />
                <h5 className="font-weight-normal mt-2 ml-2 mb-0">Net Revenue </h5>
                <h4 className="ml-3 font-weight-bold">
                  {this.fShortenNumber(
                    this.calculateNetRevenue()
                  )}
                </h4>
              </div>
            </div>
          </div>
        </div>

        <div className="row ">
          <div className="col-12 grid-margin">
            <div className="card mt-4">
              <div className="card-body">
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
                          {this.state.filterTableData
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
                                        {column.id === "domain" ? (
                                          <TableCell
                                            key={column.id}
                                            align={column.align}
                                          >
                                            {column.format &&
                                            typeof value === "number"
                                              ? column.format(
                                                  this.fShortenNumber(value)
                                                )
                                              : value}
                                          </TableCell>
                                        ) : column.id === "created_at" ? (
                                          <TableCell
                                            key={column.id}
                                            align={column.align}
                                          >
                                            {column.format &&
                                            typeof value === "number"
                                              ? column.format(
                                                  this.fShortenNumber(value)
                                                )
                                              : value}
                                          </TableCell>
                                        ) : (
                                          <TableCell
                                            key={column.id}
                                            align={column.align}
                                          >
                                            {column.format &&
                                            typeof value === "number"
                                              ? column.format(
                                                  this.fShortenNumber(value)
                                                )
                                              : this.fShortenNumber(value)}
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
                      count={this.state.filterTableData.length}
                      rowsPerPage={this.state.rowsPerPage}
                      page={this.state.page}
                      onPageChange={this.handleChangePage}
                      onRowsPerPageChange={this.handleChangeRowsPerPage}
                    />
                  </Paper>
                {/* </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Dashboard;
