import React, { Component } from "react";
import { ProgressBar } from "react-bootstrap";
import Chart from "react-apexcharts";

import DatePicker from "react-datepicker";

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

import CanvasJSReact from "../shared/canvasjs.react";
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

const columns = [
  { id: "Domain_name", label: "Domain Name", alignRight: false, width: 130 },
  {
    id: "Ad_Requests",
    label: "Total Ad Requests",
    alignRight: false,
    width: 130,
  },
  {
    id: "Ad_Impressions",
    label: "Total Ad Impressions",
    alignRight: false,
  },
  { id: "Revenue", label: "Total Revenue", alignRight: false },
  { id: "eCPM", label: "eCPM", alignRight: false },
  { id: "Calculated_Ad_Requests", label: "Ad Requests", alignRight: false },
  {
    id: "Calculated_Ad_Impressions",
    label: "Ad Impressions",
    alignRight: false,
  },
  { id: "Calculated_Revenue", label: "Revenue", alignRight: false },
];

export class Dashboard extends Component {
  handleChange = (date) => {
    this.setState({
      startDate: date,
    });
  };
  constructor(props) {
    super(props);
    this.toggleDataSeries = this.toggleDataSeries.bind(this);
    this.state = {
      homeStatsFixed: null,
      filterTableData: [],
      monthwiseData: null,
      page: 0,
      rowsPerPage: 5,
      domainSelected: "",
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
    this.getHomeFixedStats();
    this.getLastWeekAllDomainsStats();
  }

  toggleDataSeries(e) {
    if (typeof e.dataSeries.visible === "undefined" || e.dataSeries.visible) {
      e.dataSeries.visible = false;
    } else {
      e.dataSeries.visible = true;
    }
    this.chart.render();
  }

  handleChangePage = (event, newPage) => {
    this.setState({
      page: newPage,
    });
  };

  getHomeFixedStats = () => {
    let config = {
      method: "get",
      url: "/homeStatsFixed",
      headers: {},
    };
    api(config)
      .then((response) => {
        console.log(
          "==============JSON.parse(JSON.stringify(response.data.data))======================"
        );
        console.log(JSON.parse(JSON.stringify(response.data)));
        console.log("====================================");
        this.setState(
          {
            homeStatsFixed: JSON.parse(JSON.stringify(response.data.data)),
            monthwiseData: JSON.parse(
              JSON.stringify(response.data.monthwiseData)
            ),
          },
          () => {
            this.chartData(
              JSON.parse(JSON.stringify(response.data.monthwiseData))
            );
          }
        );
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  chartData = (dataSeries) => {
    let chartRevenue = [];
    let chartImpressions = [];
    let charteCPM = [];
    let monthList = [
      "jan",
      "feb",
      "mar",
      "apr",
      "may",
      "jun",
      "jul",
      "aug",
      "sep",
      "oct",
      "nov",
      "dec",
    ];

    monthList.map((month, index) => {
      let { Ad_Impressions, Revenue } = dataSeries[month];
      chartRevenue.push({
        x: new Date(new Date().getFullYear(), index, 1),
        y: Revenue.toFixed(2),
      });
      chartImpressions.push({
        x: new Date(new Date().getFullYear(), index, 1),
        y: Ad_Impressions.toFixed(2),
      });
      if (Revenue == 0 || Ad_Impressions == 0) {
        charteCPM.push({
          x: new Date(new Date().getFullYear(), index, 1),
          y: 0,
        });
      } else {
        charteCPM.push({
          x: new Date(new Date().getFullYear(), index, 1),
          y: ((Revenue / Ad_Impressions) * 1000).toFixed(2),
        });
      }
    });

    console.log("============Chart Data final========================");
    console.log({
      chartRevenue: chartRevenue,
      chartImpressions: chartImpressions,
      charteCPM: charteCPM,
    });
    console.log("====================================");

    this.setState({
      chartRevenue: chartRevenue,
      chartImpressions: chartImpressions,
      charteCPM: charteCPM,
    });
  };

  getLastWeekAllDomainsStats = () => {
    let config = {
      method: "get",
      url: `/homeStats?domain_name=${
        this.state.domainSelected
      }&start_date=${
        new Date(this.state.fromdate)
          .toISOString()
          .slice(0, 19)
          .replace("T", " ")
          .split(" ")[0]
      }&end_date=${
        new Date(this.state.todate)
          .toISOString()
          .slice(0, 19)
          .replace("T", " ")
          .split(" ")[0]
      }`,
      headers: {},
    };
    api(config)
      .then((response) => {
        console.log(
          "==============JSON.parse(JSON.stringify(response.data.data))======================"
        );
        console.log(JSON.parse(JSON.stringify(response.data.data)));
        console.log("====================================");
        this.setState({
          filterTableData: JSON.parse(
            JSON.stringify(response.data.data.response)
          ),
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  handleChangeRowsPerPage = (event) => {
    this.setState({
      page: 0,
      rowsPerPage: +event.target.value,
    });
  };

  fShortenNumber = (number) => {
    return replace(numeral(number).format("0.00a"), ".00", "");
  };

  render() {
    const series = [
      {
        name: "Revenue",
        type: "line",
        data: this.state.chartRevenue,
      },
      {
        name: "Ads Impressions",
        type: "line",
        data: this.state.chartImpressions,
      },
      {
        name: "eCPM",
        type: "line",
        data: this.state.charteCPM,
      },
    ];

    const options = {
      chart: {
        height: 400,
        type: "line",
        stacked: false,
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        width: [1, 1, 4],
      },
      title: {
        text: "Current Year Data",
        align: "left",
        offsetX: 110,
      },
      xaxis: {
        type: "datetime",

        tickAmount: "dataPoints",
        tickPlacement: "between",
        categories: [
          "jan",
          "feb",
          "mar",
          "apr",
          "may",
          "jun",
          "jul",
          "aug",
          "sep",
          "oct",
          "nov",
          "dec",
        ],
      },
      yaxis: [
        {
          axisTicks: {
            show: true,
          },
          axisBorder: {
            show: true,
            color: "#008FFB",
          },
          labels: {
            style: {
              colors: "#008FFB",
            },
          },
          title: {
            text: "Revenue",
            style: {
              color: "#008FFB",
            },
          },
          tooltip: {
            enabled: true,
          },
        },
        {
          seriesName: "Revenue",
          opposite: true,
          axisTicks: {
            show: true,
          },
          axisBorder: {
            show: true,
            color: "#00E396",
          },
          labels: {
            style: {
              colors: "#00E396",
            },
          },
          title: {
            text: "Ads Impressions",
            style: {
              color: "#00E396",
            },
          },
        },
        {
          seriesName: "Ads Impressions",
          opposite: true,
          axisTicks: {
            show: true,
          },
          axisBorder: {
            show: true,
            color: "#FEB019",
          },
          labels: {
            style: {
              colors: "#FEB019",
            },
          },
          title: {
            text: "eCPM",
            style: {
              color: "#FEB019",
            },
          },
        },
      ],

      legend: {
        horizontalAlign: "left",
        offsetX: 40,
      },
    };
    return (
      <div>
        <div className="page-header">
          <h3 className="page-title">
            <span className="page-title-icon bg-gradient-primary text-white mr-2">
              <i className="mdi mdi-home"></i>
            </span>{" "}
            Dashboard{" "}
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

        <div className="row justify-content-center d-flex align-items-start">
          <div className="col-md-3">
            <div
              className="card  bg-gradient-primary card-img-holder text-white"
              style={{ marginTop: 8 }}
            >
              <div className="">
                <img
                  src={require("../../assets/images/dashboard/circle.svg")}
                  className="card-img-absolute"
                  alt="circle"
                />
                <h5 className="font-weight-normal mt-2 ml-2 mb-0">
                  Yesterday Revenue{" "}
                </h5>
                <h4 className="ml-3 font-weight-bold">
                  {this.fShortenNumber(
                    this.state.homeStatsFixed?.yesterdayStats?.revenue
                  )}
                </h4>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div
              className="card  bg-gradient-warning card-img-holder text-white"
              style={{ marginTop: 8 }}
            >
              <div className="">
                <img
                  src={require("../../assets/images/dashboard/circle.svg")}
                  className="card-img-absolute"
                  alt="circle"
                />
                <h5 className="font-weight-normal mt-2 ml-2 mb-0">
                  Last Week Revenue{" "}
                </h5>
                <h4 className="ml-3 font-weight-bold">
                  {this.fShortenNumber(
                    this.state.homeStatsFixed?.lastWeekStats?.revenue
                  )}
                </h4>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div
              className="card  bg-gradient-secondary card-img-holder text-white"
              style={{ marginTop: 8 }}
            >
              <div className="">
                <img
                  src={require("../../assets/images/dashboard/circle.svg")}
                  className="card-img-absolute"
                  alt="circle"
                />
                <h5 className="font-weight-normal mt-2 ml-2 mb-0">
                  Current Month Revenue{" "}
                </h5>
                <h4 className="ml-3 font-weight-bold">
                  {this.fShortenNumber(
                    this.state.homeStatsFixed?.currentMonthStats?.revenue
                  )}
                </h4>
              </div>
            </div>
          </div>

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
                <h5 className="font-weight-normal mt-2 ml-2 mb-0">
                  Last Month Revenue{" "}
                </h5>
                <h4 className="ml-3 font-weight-bold">
                  {this.fShortenNumber(
                    this.state.homeStatsFixed?.lastMonthStats?.revenue
                  )}
                </h4>
              </div>
            </div>
          </div>
        </div>

        <div className="row ">
          <div className="col-12 grid-margin">
             <div className="card mt-4">
             {/* <div className="card-body p-2"> */}
                {/* <h4 className="card-title">Last Week Stats</h4> */}
                {/* <div className="table-responsive"> */}
                <Chart
                options={options}
                series={series}
                type="line"
                height={400}
              />
                {/* </div>
              </div> */}
            </div>
          </div>
        </div>

        {/* <nav aria-label="breadcrumb">
          <ul className="breadcrumb">
            <li className="breadcrumb-item active" aria-current="page">
              <span></span>Today Stats{" "}
              <i className="mdi mdi-alert-circle-outline icon-sm text-primary align-middle"></i>
            </li>
          </ul>
        </nav>

        <div className="row justify-content-center d-flex align-items-start">
          <div className="col-md-3">
            <div
              className="card  bg-gradient-primary card-img-holder text-white"
              style={{  marginTop: 8 }}
            >
              <div className="">
                <img
                  src={require("../../assets/images/dashboard/circle.svg")}
                  className="card-img-absolute"
                  alt="circle"
                />
                <h5 className="font-weight-normal mt-2 ml-2 mb-0">
                  Total Requests{" "}
                </h5>
                <h4 className="ml-3 font-weight-bold">
                  {this.fShortenNumber(
                    this.state.homeStatsFixed?.todayStats?.Ad_Requests
                  )}
                </h4>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div
              className="card  bg-gradient-warning card-img-holder text-white"
              style={{  marginTop: 8 }}
            >
              <div className="">
                <img
                  src={require("../../assets/images/dashboard/circle.svg")}
                  className="card-img-absolute"
                  alt="circle"
                />
                <h5 className="font-weight-normal mt-2 ml-2 mb-0">
                  Total Impressions{" "}
                </h5>
                <h4 className="ml-3 font-weight-bold">
                  {this.fShortenNumber(
                    this.state.homeStatsFixed?.todayStats?.Ad_Impressions
                  )}
                </h4>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div
              className="card  bg-gradient-secondary card-img-holder text-white"
              style={{  marginTop: 8 }}
            >
              <div className="">
                <img
                  src={require("../../assets/images/dashboard/circle.svg")}
                  className="card-img-absolute"
                  alt="circle"
                />
                <h5 className="font-weight-normal mt-2 ml-2 mb-0">
                  Total Revenue{" "}
                </h5>
                <h4 className="ml-3 font-weight-bold">
                  {this.fShortenNumber(
                    this.state.homeStatsFixed?.todayStats?.revenue
                  )}
                </h4>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div
              className="card  bg-gradient-danger card-img-holder text-white"
              style={{  marginTop: 8 }}
            >
              <div className="">
                <img
                  src={require("../../assets/images/dashboard/circle.svg")}
                  className="card-img-absolute"
                  alt="circle"
                />
                <h5 className="font-weight-normal mt-2 ml-2 mb-0">Requests </h5>
                <h4 className="ml-3 font-weight-bold">
                  {this.fShortenNumber(
                    this.state.homeStatsFixed?.todayStats
                      ?.Calculated_Ad_Requests
                  )}
                </h4>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div
              className="card  bg-gradient-success card-img-holder text-white"
              style={{  marginTop: 8 }}
            >
              <div className="">
                <img
                  src={require("../../assets/images/dashboard/circle.svg")}
                  className="card-img-absolute"
                  alt="circle"
                />
                <h5 className="font-weight-normal mt-2 ml-2 mb-0">
                  Impressions{" "}
                </h5>
                <h4 className="ml-3 font-weight-bold">
                  {this.fShortenNumber(
                    this.state.homeStatsFixed?.todayStats
                      ?.Calculated_Ad_Impressions
                  )}
                </h4>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div
              className="card  bg-gradient-dark card-img-holder text-white"
              style={{  marginTop: 8 }}
            >
              <div className="">
                <img
                  src={require("../../assets/images/dashboard/circle.svg")}
                  className="card-img-absolute"
                  alt="circle"
                />
                <h5 className="font-weight-normal mt-2 ml-2 mb-0">Revenue</h5>
                <h4 className="ml-3 font-weight-bold">
                  {this.fShortenNumber(
                    this.state.homeStatsFixed?.todayStats?.calculatedRevenue
                  )}
                </h4>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div
              className="card  bg-gradient-info card-img-holder text-white"
              style={{  marginTop: 8 }}
            >
              <div className="">
                <img
                  src={require("../../assets/images/dashboard/circle.svg")}
                  className="card-img-absolute"
                  alt="circle"
                />
                <h5 className="font-weight-normal mt-2 ml-2 mb-0">eCPM </h5>
                <h4 className="ml-3 font-weight-bold">
                  {this.fShortenNumber(
                    (this.state.homeStatsFixed?.todayStats?.calculatedRevenue /
                      this.state.homeStatsFixed?.todayStats
                        ?.Calculated_Ad_Impressions) *
                      1000
                  )}
                </h4>
              </div>
            </div>
          </div>
        </div> */}

        <nav aria-label="breadcrumb">
          <ul className="breadcrumb">
            <li className="breadcrumb-item active" aria-current="page">
              <span></span>Yesterday Stats{" "}
              <i className="mdi mdi-alert-circle-outline icon-sm text-primary align-middle"></i>
            </li>
          </ul>
        </nav>

        <div className="row justify-content-center d-flex align-items-start">
          <div className="col-md-3">
            <div
              className="card  bg-gradient-primary card-img-holder text-white"
              style={{ marginTop: 8 }}
            >
              <div className="">
                <img
                  src={require("../../assets/images/dashboard/circle.svg")}
                  className="card-img-absolute"
                  alt="circle"
                />
                <h5 className="font-weight-normal mt-2 ml-2 mb-0">
                  Total Requests{" "}
                </h5>
                <h4 className="ml-3 font-weight-bold">
                  {this.fShortenNumber(
                    this.state.homeStatsFixed?.yesterdayStats?.Ad_Requests
                  )}
                </h4>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div
              className="card  bg-gradient-warning card-img-holder text-white"
              style={{ marginTop: 8 }}
            >
              <div className="">
                <img
                  src={require("../../assets/images/dashboard/circle.svg")}
                  className="card-img-absolute"
                  alt="circle"
                />
                <h5 className="font-weight-normal mt-2 ml-2 mb-0">
                  Total Impressions{" "}
                </h5>
                <h4 className="ml-3 font-weight-bold">
                  {this.fShortenNumber(
                    this.state.homeStatsFixed?.yesterdayStats?.Ad_Impressions
                  )}
                </h4>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div
              className="card  bg-gradient-secondary card-img-holder text-white"
              style={{ marginTop: 8 }}
            >
              <div className="">
                <img
                  src={require("../../assets/images/dashboard/circle.svg")}
                  className="card-img-absolute"
                  alt="circle"
                />
                <h5 className="font-weight-normal mt-2 ml-2 mb-0">
                  Total Revenue{" "}
                </h5>
                <h4 className="ml-3 font-weight-bold">
                  {this.fShortenNumber(
                    this.state.homeStatsFixed?.yesterdayStats?.revenue
                  )}
                </h4>
              </div>
            </div>
          </div>

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
                <h5 className="font-weight-normal mt-2 ml-2 mb-0">Requests </h5>
                <h4 className="ml-3 font-weight-bold">
                  {this.fShortenNumber(
                    this.state.homeStatsFixed?.yesterdayStats
                      ?.Calculated_Ad_Requests
                  )}
                </h4>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div
              className="card  bg-gradient-success card-img-holder text-white"
              style={{ marginTop: 8 }}
            >
              <div className="">
                <img
                  src={require("../../assets/images/dashboard/circle.svg")}
                  className="card-img-absolute"
                  alt="circle"
                />
                <h5 className="font-weight-normal mt-2 ml-2 mb-0">
                  Impressions{" "}
                </h5>
                <h4 className="ml-3 font-weight-bold">
                  {this.fShortenNumber(
                    this.state.homeStatsFixed?.yesterdayStats
                      ?.Calculated_Ad_Impressions
                  )}
                </h4>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div
              className="card  bg-gradient-dark card-img-holder text-white"
              style={{ marginTop: 8 }}
            >
              <div className="">
                <img
                  src={require("../../assets/images/dashboard/circle.svg")}
                  className="card-img-absolute"
                  alt="circle"
                />
                <h5 className="font-weight-normal mt-2 ml-2 mb-0">Revenue</h5>
                <h4 className="ml-3 font-weight-bold">
                  {this.fShortenNumber(
                    this.state.homeStatsFixed?.yesterdayStats?.calculatedRevenue
                  )}
                </h4>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div
              className="card  bg-gradient-info card-img-holder text-white"
              style={{ marginTop: 8 }}
            >
              <div className="">
                <img
                  src={require("../../assets/images/dashboard/circle.svg")}
                  className="card-img-absolute"
                  alt="circle"
                />
                <h5 className="font-weight-normal mt-2 ml-2 mb-0">eCPM </h5>
                <h4 className="ml-3 font-weight-bold">
                  {this.fShortenNumber(
                    (this.state.homeStatsFixed?.yesterdayStats
                      ?.calculatedRevenue /
                      this.state.homeStatsFixed?.yesterdayStats
                        ?.Calculated_Ad_Impressions) *
                      1000
                  )}
                </h4>
              </div>
            </div>
          </div>
        </div>

        {/* <nav aria-label="breadcrumb">
          <ul className="breadcrumb">
            <li className="breadcrumb-item active" aria-current="page">
              <span></span>Current Week Stats{" "}
              <i className="mdi mdi-alert-circle-outline icon-sm text-primary align-middle"></i>
            </li>
          </ul>
        </nav>

        <div className="row justify-content-center d-flex align-items-start">
          <div className="col-md-3">
            <div
              className="card  bg-gradient-primary card-img-holder text-white"
              style={{  marginTop: 8 }}
            >
              <div className="">
                <img
                  src={require("../../assets/images/dashboard/circle.svg")}
                  className="card-img-absolute"
                  alt="circle"
                />
                <h5 className="font-weight-normal mt-2 ml-2 mb-0">
                  Total Requests{" "}
                </h5>
                <h4 className="ml-3 font-weight-bold">
                  {this.fShortenNumber(
                    this.state.homeStatsFixed?.thisWeekStats?.Ad_Requests
                  )}
                </h4>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div
              className="card  bg-gradient-warning card-img-holder text-white"
              style={{  marginTop: 8 }}
            >
              <div className="">
                <img
                  src={require("../../assets/images/dashboard/circle.svg")}
                  className="card-img-absolute"
                  alt="circle"
                />
                <h5 className="font-weight-normal mt-2 ml-2 mb-0">
                  Total Impressions{" "}
                </h5>
                <h4 className="ml-3 font-weight-bold">
                  {this.fShortenNumber(
                    this.state.homeStatsFixed?.thisWeekStats?.Ad_Impressions
                  )}
                </h4>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div
              className="card  bg-gradient-secondary card-img-holder text-white"
              style={{  marginTop: 8 }}
            >
              <div className="">
                <img
                  src={require("../../assets/images/dashboard/circle.svg")}
                  className="card-img-absolute"
                  alt="circle"
                />
                <h5 className="font-weight-normal mt-2 ml-2 mb-0">
                  Total Revenue{" "}
                </h5>
                <h4 className="ml-3 font-weight-bold">
                  {this.fShortenNumber(
                    this.state.homeStatsFixed?.thisWeekStats?.revenue
                  )}
                </h4>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div
              className="card  bg-gradient-danger card-img-holder text-white"
              style={{  marginTop: 8 }}
            >
              <div className="">
                <img
                  src={require("../../assets/images/dashboard/circle.svg")}
                  className="card-img-absolute"
                  alt="circle"
                />
                <h5 className="font-weight-normal mt-2 ml-2 mb-0">Requests </h5>
                <h4 className="ml-3 font-weight-bold">
                  {this.fShortenNumber(
                    this.state.homeStatsFixed?.thisWeekStats
                      ?.Calculated_Ad_Requests
                  )}
                </h4>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div
              className="card  bg-gradient-success card-img-holder text-white"
              style={{  marginTop: 8 }}
            >
              <div className="">
                <img
                  src={require("../../assets/images/dashboard/circle.svg")}
                  className="card-img-absolute"
                  alt="circle"
                />
                <h5 className="font-weight-normal mt-2 ml-2 mb-0">
                  Impressions{" "}
                </h5>
                <h4 className="ml-3 font-weight-bold">
                  {this.fShortenNumber(
                    this.state.homeStatsFixed?.thisWeekStats
                      ?.Calculated_Ad_Impressions
                  )}
                </h4>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div
              className="card  bg-gradient-dark card-img-holder text-white"
              style={{  marginTop: 8 }}
            >
              <div className="">
                <img
                  src={require("../../assets/images/dashboard/circle.svg")}
                  className="card-img-absolute"
                  alt="circle"
                />
                <h5 className="font-weight-normal mt-2 ml-2 mb-0">Revenue</h5>
                <h4 className="ml-3 font-weight-bold">
                  {this.fShortenNumber(
                    this.state.homeStatsFixed?.thisWeekStats?.calculatedRevenue
                  )}
                </h4>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div
              className="card  bg-gradient-info card-img-holder text-white"
              style={{  marginTop: 8 }}
            >
              <div className="">
                <img
                  src={require("../../assets/images/dashboard/circle.svg")}
                  className="card-img-absolute"
                  alt="circle"
                />
                <h5 className="font-weight-normal mt-2 ml-2 mb-0">eCPM </h5>
                <h4 className="ml-3 font-weight-bold">
                  {this.fShortenNumber(
                    (this.state.homeStatsFixed?.thisWeekStats
                      ?.calculatedRevenue /
                      this.state.homeStatsFixed?.thisWeekStats
                        ?.Calculated_Ad_Impressions) *
                      1000
                  )}
                </h4>
              </div>
            </div>
          </div>
        </div> */}

        <nav aria-label="breadcrumb">
          <ul className="breadcrumb">
            <li className="breadcrumb-item active" aria-current="page">
              <span></span>Last Week Stats{" "}
              <i className="mdi mdi-alert-circle-outline icon-sm text-primary align-middle"></i>
            </li>
          </ul>
        </nav>

        <div className="row justify-content-center d-flex align-items-start">
          <div className="col-md-3">
            <div
              className="card  bg-gradient-primary card-img-holder text-white"
              style={{ marginTop: 8 }}
            >
              <div className="">
                <img
                  src={require("../../assets/images/dashboard/circle.svg")}
                  className="card-img-absolute"
                  alt="circle"
                />
                <h5 className="font-weight-normal mt-2 ml-2 mb-0">
                  Total Requests{" "}
                </h5>
                <h4 className="ml-3 font-weight-bold">
                  {this.fShortenNumber(
                    this.state.homeStatsFixed?.lastWeekStats?.Ad_Requests
                  )}
                </h4>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div
              className="card  bg-gradient-warning card-img-holder text-white"
              style={{ marginTop: 8 }}
            >
              <div className="">
                <img
                  src={require("../../assets/images/dashboard/circle.svg")}
                  className="card-img-absolute"
                  alt="circle"
                />
                <h5 className="font-weight-normal mt-2 ml-2 mb-0">
                  Total Impressions{" "}
                </h5>
                <h4 className="ml-3 font-weight-bold">
                  {this.fShortenNumber(
                    this.state.homeStatsFixed?.lastWeekStats?.Ad_Impressions
                  )}
                </h4>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div
              className="card  bg-gradient-secondary card-img-holder text-white"
              style={{ marginTop: 8 }}
            >
              <div className="">
                <img
                  src={require("../../assets/images/dashboard/circle.svg")}
                  className="card-img-absolute"
                  alt="circle"
                />
                <h5 className="font-weight-normal mt-2 ml-2 mb-0">
                  Total Revenue{" "}
                </h5>
                <h4 className="ml-3 font-weight-bold">
                  {this.fShortenNumber(
                    this.state.homeStatsFixed?.lastWeekStats?.revenue
                  )}
                </h4>
              </div>
            </div>
          </div>

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
                <h5 className="font-weight-normal mt-2 ml-2 mb-0">Requests </h5>
                <h4 className="ml-3 font-weight-bold">
                  {this.fShortenNumber(
                    this.state.homeStatsFixed?.lastWeekStats
                      ?.Calculated_Ad_Requests
                  )}
                </h4>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div
              className="card  bg-gradient-success card-img-holder text-white"
              style={{ marginTop: 8 }}
            >
              <div className="">
                <img
                  src={require("../../assets/images/dashboard/circle.svg")}
                  className="card-img-absolute"
                  alt="circle"
                />
                <h5 className="font-weight-normal mt-2 ml-2 mb-0">
                  Impressions{" "}
                </h5>
                <h4 className="ml-3 font-weight-bold">
                  {this.fShortenNumber(
                    this.state.homeStatsFixed?.lastWeekStats
                      ?.Calculated_Ad_Impressions
                  )}
                </h4>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div
              className="card  bg-gradient-dark card-img-holder text-white"
              style={{ marginTop: 8 }}
            >
              <div className="">
                <img
                  src={require("../../assets/images/dashboard/circle.svg")}
                  className="card-img-absolute"
                  alt="circle"
                />
                <h5 className="font-weight-normal mt-2 ml-2 mb-0">Revenue</h5>
                <h4 className="ml-3 font-weight-bold">
                  {this.fShortenNumber(
                    this.state.homeStatsFixed?.lastWeekStats?.calculatedRevenue
                  )}
                </h4>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div
              className="card  bg-gradient-info card-img-holder text-white"
              style={{ marginTop: 8 }}
            >
              <div className="">
                <img
                  src={require("../../assets/images/dashboard/circle.svg")}
                  className="card-img-absolute"
                  alt="circle"
                />
                <h5 className="font-weight-normal mt-2 ml-2 mb-0">eCPM </h5>
                <h4 className="ml-3 font-weight-bold">
                  {this.fShortenNumber(
                    (this.state.homeStatsFixed?.lastWeekStats
                      ?.calculatedRevenue /
                      this.state.homeStatsFixed?.lastWeekStats
                        ?.Calculated_Ad_Impressions) *
                      1000
                  )}
                </h4>
              </div>
            </div>
          </div>
        </div>
        <nav aria-label="breadcrumb">
          <ul className="breadcrumb">
            <li className="breadcrumb-item active" aria-current="page">
              <span></span>Current Month Stats{" "}
              <i className="mdi mdi-alert-circle-outline icon-sm text-primary align-middle"></i>
            </li>
          </ul>
        </nav>

        <div className="row justify-content-center d-flex align-items-start">
          <div className="col-md-3">
            <div
              className="card  bg-gradient-primary card-img-holder text-white"
              style={{ marginTop: 8 }}
            >
              <div className="">
                <img
                  src={require("../../assets/images/dashboard/circle.svg")}
                  className="card-img-absolute"
                  alt="circle"
                />
                <h5 className="font-weight-normal mt-2 ml-2 mb-0">
                  Total Requests{" "}
                </h5>
                <h4 className="ml-3 font-weight-bold">
                  {this.fShortenNumber(
                    this.state.homeStatsFixed?.currentMonthStats?.Ad_Requests
                  )}
                </h4>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div
              className="card  bg-gradient-warning card-img-holder text-white"
              style={{ marginTop: 8 }}
            >
              <div className="">
                <img
                  src={require("../../assets/images/dashboard/circle.svg")}
                  className="card-img-absolute"
                  alt="circle"
                />
                <h5 className="font-weight-normal mt-2 ml-2 mb-0">
                  Total Impressions{" "}
                </h5>
                <h4 className="ml-3 font-weight-bold">
                  {this.fShortenNumber(
                    this.state.homeStatsFixed?.currentMonthStats?.Ad_Impressions
                  )}
                </h4>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div
              className="card  bg-gradient-secondary card-img-holder text-white"
              style={{ marginTop: 8 }}
            >
              <div className="">
                <img
                  src={require("../../assets/images/dashboard/circle.svg")}
                  className="card-img-absolute"
                  alt="circle"
                />
                <h5 className="font-weight-normal mt-2 ml-2 mb-0">
                  Total Revenue{" "}
                </h5>
                <h4 className="ml-3 font-weight-bold">
                  {this.fShortenNumber(
                    this.state.homeStatsFixed?.currentMonthStats?.revenue
                  )}
                </h4>
              </div>
            </div>
          </div>

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
                <h5 className="font-weight-normal mt-2 ml-2 mb-0">Requests </h5>
                <h4 className="ml-3 font-weight-bold">
                  {this.fShortenNumber(
                    this.state.homeStatsFixed?.currentMonthStats
                      ?.Calculated_Ad_Requests
                  )}
                </h4>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div
              className="card  bg-gradient-success card-img-holder text-white"
              style={{ marginTop: 8 }}
            >
              <div className="">
                <img
                  src={require("../../assets/images/dashboard/circle.svg")}
                  className="card-img-absolute"
                  alt="circle"
                />
                <h5 className="font-weight-normal mt-2 ml-2 mb-0">
                  Impressions{" "}
                </h5>
                <h4 className="ml-3 font-weight-bold">
                  {this.fShortenNumber(
                    this.state.homeStatsFixed?.currentMonthStats
                      ?.Calculated_Ad_Impressions
                  )}
                </h4>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div
              className="card  bg-gradient-dark card-img-holder text-white"
              style={{ marginTop: 8 }}
            >
              <div className="">
                <img
                  src={require("../../assets/images/dashboard/circle.svg")}
                  className="card-img-absolute"
                  alt="circle"
                />
                <h5 className="font-weight-normal mt-2 ml-2 mb-0">Revenue</h5>
                <h4 className="ml-3 font-weight-bold">
                  {this.fShortenNumber(
                    this.state.homeStatsFixed?.currentMonthStats
                      ?.calculatedRevenue
                  )}
                </h4>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div
              className="card  bg-gradient-info card-img-holder text-white"
              style={{ marginTop: 8 }}
            >
              <div className="">
                <img
                  src={require("../../assets/images/dashboard/circle.svg")}
                  className="card-img-absolute"
                  alt="circle"
                />
                <h5 className="font-weight-normal mt-2 ml-2 mb-0">eCPM </h5>
                <h4 className="ml-3 font-weight-bold">
                  {this.fShortenNumber(
                    (this.state.homeStatsFixed?.currentMonthStats
                      ?.calculatedRevenue /
                      this.state.homeStatsFixed?.currentMonthStats
                        ?.Calculated_Ad_Impressions) *
                      1000
                  )}
                </h4>
              </div>
            </div>
          </div>
        </div>

        <nav aria-label="breadcrumb">
          <ul className="breadcrumb">
            <li className="breadcrumb-item active" aria-current="page">
              <span></span>Last Month Stats{" "}
              <i className="mdi mdi-alert-circle-outline icon-sm text-primary align-middle"></i>
            </li>
          </ul>
        </nav>

        <div className="row justify-content-center d-flex align-items-start">
          <div className="col-md-3">
            <div
              className="card  bg-gradient-primary card-img-holder text-white"
              style={{ marginTop: 8 }}
            >
              <div className="">
                <img
                  src={require("../../assets/images/dashboard/circle.svg")}
                  className="card-img-absolute"
                  alt="circle"
                />
                <h5 className="font-weight-normal mt-2 ml-2 mb-0">
                  Total Requests{" "}
                </h5>
                <h4 className="ml-3 font-weight-bold">
                  {this.fShortenNumber(
                    this.state.homeStatsFixed?.lastMonthStats?.Ad_Requests
                  )}
                </h4>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div
              className="card  bg-gradient-warning card-img-holder text-white"
              style={{ marginTop: 8 }}
            >
              <div className="">
                <img
                  src={require("../../assets/images/dashboard/circle.svg")}
                  className="card-img-absolute"
                  alt="circle"
                />
                <h5 className="font-weight-normal mt-2 ml-2 mb-0">
                  Total Impressions{" "}
                </h5>
                <h4 className="ml-3 font-weight-bold">
                  {this.fShortenNumber(
                    this.state.homeStatsFixed?.lastMonthStats?.Ad_Impressions
                  )}
                </h4>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div
              className="card  bg-gradient-secondary card-img-holder text-white"
              style={{ marginTop: 8 }}
            >
              <div className="">
                <img
                  src={require("../../assets/images/dashboard/circle.svg")}
                  className="card-img-absolute"
                  alt="circle"
                />
                <h5 className="font-weight-normal mt-2 ml-2 mb-0">
                  Total Revenue{" "}
                </h5>
                <h4 className="ml-3 font-weight-bold">
                  {this.fShortenNumber(
                    this.state.homeStatsFixed?.lastMonthStats?.revenue
                  )}
                </h4>
              </div>
            </div>
          </div>

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
                <h5 className="font-weight-normal mt-2 ml-2 mb-0">Requests </h5>
                <h4 className="ml-3 font-weight-bold">
                  {this.fShortenNumber(
                    this.state.homeStatsFixed?.lastMonthStats
                      ?.Calculated_Ad_Requests
                  )}
                </h4>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div
              className="card  bg-gradient-success card-img-holder text-white"
              style={{ marginTop: 8 }}
            >
              <div className="">
                <img
                  src={require("../../assets/images/dashboard/circle.svg")}
                  className="card-img-absolute"
                  alt="circle"
                />
                <h5 className="font-weight-normal mt-2 ml-2 mb-0">
                  Impressions{" "}
                </h5>
                <h4 className="ml-3 font-weight-bold">
                  {this.fShortenNumber(
                    this.state.homeStatsFixed?.lastMonthStats
                      ?.Calculated_Ad_Impressions
                  )}
                </h4>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div
              className="card  bg-gradient-dark card-img-holder text-white"
              style={{ marginTop: 8 }}
            >
              <div className="">
                <img
                  src={require("../../assets/images/dashboard/circle.svg")}
                  className="card-img-absolute"
                  alt="circle"
                />
                <h5 className="font-weight-normal mt-2 ml-2 mb-0">Revenue</h5>
                <h4 className="ml-3 font-weight-bold">
                  {this.fShortenNumber(
                    this.state.homeStatsFixed?.lastMonthStats?.calculatedRevenue
                  )}
                </h4>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div
              className="card  bg-gradient-info card-img-holder text-white"
              style={{ marginTop: 8 }}
            >
              <div className="">
                <img
                  src={require("../../assets/images/dashboard/circle.svg")}
                  className="card-img-absolute"
                  alt="circle"
                />
                <h5 className="font-weight-normal mt-2 ml-2 mb-0">eCPM </h5>
                <h4 className="ml-3 font-weight-bold">
                  {this.fShortenNumber(
                    (this.state.homeStatsFixed?.lastMonthStats
                      ?.calculatedRevenue /
                      this.state.homeStatsFixed?.lastMonthStats
                        ?.Calculated_Ad_Impressions) *
                      1000
                  )}
                </h4>
              </div>
            </div>
          </div>
        </div>

        <div className="row ">
          <div className="col-12 grid-margin">
            <div className="card mt-4">
              <div className="card-body p-2">
                <h4 className="card-title">This Week Stats</h4>
                <div className="table-responsive">
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
                                        {column.id === "Domain_name" ? (
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Dashboard;
