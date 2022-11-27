import React, { Component } from "react";
import { Form } from "react-bootstrap";
import DatePicker from "react-datepicker";
import bsCustomFileInput from "bs-custom-file-input";
import withRouter from "../withRouter";
import Button from "@mui/material/Button";
import { Stack, IconButton, InputAdornment } from "@mui/material";
import api from "../../http-commn"
import Avatar from "@mui/material/Avatar";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

class AddDomain extends Component {
  constructor(props) {
    super(props);
    this.state = {
      files: [],
      domainName: "",
      isFail: false,
      message: "",
      issuccess: false,
      isFileChange: false,
      ads_code: null,
    };
  }

  handleChange = (date) => {
    this.setState({
      fromdate: date,
    });
  };
  handleDomainChange = (e) => {
    this.setState({
      domainName: e.target.value,
    });
  };

  handleIsSuccessOpen = () => this.setState({ issuccess: true });
  handleIsSuccessClose = () => this.setState({ issuccess: false });
  handleIsFailOpen = () => this.setState({ isFail: true });
  handleIsFailClose = () => this.setState({ isFail: false });

  componentDidMount() {
    const { id } = this.props.params;
    bsCustomFileInput.init();
    let config = {
      method: "get",
      url: `/domains/${id}`,
      headers: {},
    };
    api(config)
      .then((response) => {
        console.log(JSON.parse(JSON.stringify(response.data.data)));
        const Domain = JSON.parse(JSON.stringify(response.data.data));
        this.setState({
          domainName: Domain?.domainname,
          ads_code: Domain?.ads_code,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  updateDomain = () => {
    const { id } = this.props.params;
    var newData = new FormData();
    newData.append("domainName", this.state.domainName);
    newData.append(
      "ads_code",
      this.state.isFileChange ? this.state.files[0] : this.state.ads_code
    );
    newData.append("isFileChange", this.state.isFileChange);

    var config = {
      method: "put",
      url: `/domain/update/${id}`,
      headers: {},
      data: newData,
    };

    api(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        this.setState({ message: response?.data?.message }, () => {
          this.handleIsSuccessOpen();
        });
      })
      .catch((error) => {
        console.log(error);
        this.setState({ message: "Something goes wrong!" }, () => {
          this.handleIsSuccessOpen();
        });
      });
  };

  setUserImage = (e) => {
    this.setState({
      files: e.target.files,
      isFileChange:true
    });
  };

  render() {
    return (
      <div>
        <div className="page-header">
          <h3 className="page-title"> Update Domain </h3>
        </div>
        <div className="row">
          <div className="col-12 grid-margin">
            <div className="card">
              <div className="card-body">
                <form className="form-sample">
                  <p className="card-description"> Domain info </p>

                  <div className="row">
                    <div className="col-md-6">
                      <Form.Group>
                        <label>Domain Name</label>
                        <div>
                          <Form.Control
                            type="text"
                            value={this.state?.domainName}
                            onChange={this.handleDomainChange}
                          />
                        </div>
                      </Form.Group>
                    </div>
                    <div className="col-md-6">
                      <Form.Group>
                        <label>Select Ads Code File</label>
                        <div className="custom-file">
                          <Form.Control
                            onChange={(e) => {
                              // Prevents React from resetting its properties:
                              e.persist();

                              setTimeout(() => {
                                this.setUserImage(e);
                              }, 100);
                            }}
                            type="file"
                            className="form-control visibility-hidden"
                            id="customFileLang"
                            lang="es"
                          />
                          <label
                            className="custom-file-label"
                            htmlFor="customFileLang"
                          >
                            Select Ads Code File
                          </label>
                        </div>
                      </Form.Group>
                    </div>
                  </div>
                  <div className="row"></div>

                  <button
                    type="button"
                    className="btn btn-outline-primary btn-icon-text"
                    onClick={this.updateDomain}
                  >
                    Update Domain
                    <i className="mdi mdi-file-check btn-icon-append"></i>
                  </button>
                </form>
                <Snackbar
                  open={this.state.issuccess}
                  autoHideDuration={6000}
                  onClose={this.state.handleIsSuccessClose}
                >
                  <Alert
                    onClose={this.state.handleIsSuccessClose}
                    severity="success"
                    sx={{ width: "100%" }}
                  >
                    {this.state.message}
                  </Alert>
                </Snackbar>
                <Snackbar
                  open={this.state.isFail}
                  autoHideDuration={6000}
                  onClose={this.state.handleIsFailClose}
                >
                  <Alert
                    onClose={this.state.handleIsFailClose}
                    severity="error"
                    sx={{ width: "100%" }}
                  >
                    {this.state.message}
                  </Alert>
                </Snackbar>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(AddDomain);
