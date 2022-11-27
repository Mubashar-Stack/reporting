import React, { Component } from "react";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

import TextField from "@mui/material/TextField";

import { Stack } from "@mui/material";

import Typography from "@mui/material/Typography";
import Autocomplete from "@mui/material/Autocomplete";
import { Form } from "react-bootstrap";
import DatePicker from "react-datepicker";
import bsCustomFileInput from "bs-custom-file-input";
import withRouter from "../withRouter";
import Button from "@mui/material/Button";

import api from "../../http-commn"
import Avatar from "@mui/material/Avatar";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

class EditUsersDomain extends Component {
  constructor(props) {
    super(props);
    this.state = {
      usersList: [],
      domainList: [],
      user_id: null,
      domain_id: null,
      domainName: "",
      userName: "",
      isFail: false,
      message: "",
      issuccess: false,
      linkedDetails:null
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
    let config = {
      method: "get",
      url: "/users",
      headers: {},
    };
    api(config)
      .then((response) => {
        console.log(JSON.parse(JSON.stringify(response.data.data)));
        this.setState({
          usersList: JSON.parse(JSON.stringify(response.data.data)),
        });
      })
      .catch((error) => {
        console.log(error);
      });
    let configDomain = {
      method: "get",
      url: "/domains",
      headers: {},
    };
    api(configDomain)
      .then((response) => {
        console.log(JSON.parse(JSON.stringify(response.data.data)));
        this.setState({
          domainList: JSON.parse(JSON.stringify(response.data.data)),
        });
      })
      .catch((error) => {
        console.log(error);
      });

    api({
      method: "get",
      url: `/users_domains/${id}`,
      headers: {},
    })
      .then( (response)=> {
        console.log(JSON.parse(JSON.stringify(response.data.data)));
        const Domain = JSON.parse(JSON.stringify(response.data.data));
        this.setState({
          domainName: Domain?.first_name,
          userName: Domain?.domainname,
          linkedDetails: Domain
        });
      })
      .catch( (error)=> {
        console.log(error);
      });
    bsCustomFileInput.init();
  }

  linkUserDomain = () => {
    const { id } = this.props.params;
    var newData = new FormData();
    newData.append("user_id", this.state.user_id);

    newData.append("domain_id", this.state.domain_id);

    var config = {
      method: "put",
      url: `/user_domain/update/${id}`,
      headers: {},
      data: newData,
    };
    api(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        this.setState({ message: response?.data?.message }, () => {
          this.handleIsSuccessOpen();
        });
      }) .catch( (error)=> {
        if (error.response) {
          // Request made and server responded
          console.log(error.response.data);
          this.setState({ message:error.response.data.message }, () => {
            this.handleIsFailOpen();
          });
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', error.message);
        }
    
      });
     
  };

  setUserImage = (e) => {
    this.setState({
      files: e.target.files,
    });
  };

  render() {
    return (
      <div>
        <div className="page-header">
          <h3 className="page-title"> Update Link of Domain with User </h3>
        </div>
        <div className="row">
          <div className="col-12 grid-margin">
            <div className="card">
              <div className="card-body">
                <form className="form-sample">
                  <p className="card-description"> Users Domains Lists</p>
                  <React.Fragment>
                    <Grid container spacing={0}>
                      <Stack
                        direction={{ xs: "column", sm: "row" }}
                        spacing={3}
                      >
                        <Autocomplete
                          id="country-select-demo"
                          sx={{ width: 220 }}
                          options={this.state.domainList}
                          autoHighlight
                          inputValue={this.state.domainName}
                          value={this.state.linkedDetails}
                          onChange={(event, newValue) => {
                            this.setState({
                              domainName: newValue.domainname,
                              domain_id: newValue._id,
                            });
                          }}
                          onInputChange={(event, newInputValue) => {
                            this.setState({
                              domainName: newInputValue,
                            });
                          }}
                          getOptionLabel={(option) => option.domainname}
                          renderOption={(props, option) => (
                            <Box
                              component="li"
                              sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
                              {...props}
                            >
                              {option.domainname}
                            </Box>
                          )}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Choose a Domain"
                              inputProps={{
                                ...params.inputProps,
                                autoComplete: "new-password", // disable autocomplete and autofill
                              }}
                            />
                          )}
                        />
                        <Autocomplete
                          id="country-select-demo"
                          sx={{ width: 220 }}
                          options={this.state.usersList}
                          inputValue={this.state.userName}
                          value={this.state.linkedDetails}
                          autoHighlight
                          onChange={(event, newValue) => {
                            this.setState({
                              userName: newValue.first_name,
                              user_id: newValue._id,
                            });
                          }}
                          onInputChange={(event, newInputValue) => {
                            this.setState({
                              userName: newInputValue,
                            });
                          }}
                          getOptionLabel={(option) => option.first_name}
                          renderOption={(props, option) => (
                            <Box
                              component="li"
                              sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
                              {...props}
                            >
                              <img
                                loading="lazy"
                                width="20"
                                src={`https://api.adxfire.com/${option?.photo}`}
                                srcSet={`https://api.adxfire.com/${option?.photo}.png 2x`}
                                alt=""
                              />
                              {option.first_name} {option.last_name}
                            </Box>
                          )}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Choose a User"
                              inputProps={{
                                ...params.inputProps,
                                autoComplete: "new-password", // disable autocomplete and autofill
                              }}
                            />
                          )}
                        />
                      </Stack>
                    </Grid>
                  </React.Fragment>

                  <div className="row"></div>

                  <button
                    type="button"
                    className="btn btn-outline-primary btn-icon-text mt-3"
                    onClick={this.linkUserDomain}
                  >
                    Update Link
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

export default withRouter(EditUsersDomain);
