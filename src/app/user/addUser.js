import React, { Component } from "react";
import { Form } from "react-bootstrap";
import DatePicker from "react-datepicker";
import bsCustomFileInput from "bs-custom-file-input";
import withRouter from "../withRouter";
import Button from "@mui/material/Button";
import { Stack, IconButton, InputAdornment } from "@mui/material";
import api from "../../http-commn"
import Avatar from "@mui/material/Avatar";

class ViewUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user_photo_url: null,
      startDate: new Date(),
      first_name: "",
      last_name: "",
      password: "",
      photo: null,
      email: "",
      bank_name: "",
      bank_address: "",
      bank_ac_holder_name: "",
      bank_account_holder_address: "",
      bank_account_number: "",
      IFSC_code: "",
      swift_bic_code: "",
      paypal_email_address: "",
      upi: "",
      isChangedPassword: false,
      isFileChange: false,
      files: [],
    };
  }

  handleChange = (date) => {
    this.setState({
      startDate: date,
    });
  };
  handleFirstNameChange = (e) => {
    this.setState({
      first_name: e.target.value,
    });
  };
  handleLastNameChange = (e) => {
    this.setState({
      last_name: e.target.value,
    });
  };
  handleEmailChange = (e) => {
    this.setState({
      email: e.target.value,
    });
  };

  handlePasswordChange = (e) => {
    this.setState({
      password: e.target.value,
      isChangedPassword: true,
    });
  };

  handlePaypalEmailAddressChange = (e) => {
    this.setState({
      paypal_email_address: e.target.value,
    });
  };
  handleBankAccountHolderAddressChange = (e) => {
    this.setState({
      bank_account_holder_address: e.target.value,
    });
  };
  handleUPIChange = (e) => {
    this.setState({
      upi: e.target.value,
    });
  };

  handleSwiftBicCodeChange = (e) => {
    this.setState({
      swift_bic_code: e.target.value,
    });
  };

  handleIFSCCodeChange = (e) => {
    this.setState({
      IFSC_code: e.target.value,
    });
  };

  handleBankAddressChange = (e) => {
    this.setState({
      bank_address: e.target.value,
    });
  };

  handleBankNameChange = (e) => {
    this.setState({
      bank_name: e.target.value,
    });
  };

  handleBankACHolderNameChange = (e) => {
    this.setState({
      bank_ac_holder_name: e.target.value,
    });
  };

  handleBankAccountNumberChange = (e) => {
    this.setState({
      bank_account_number: e.target.value,
    });
  };

  componentDidMount() {
    bsCustomFileInput.init();
  }

  AddUser = () => {
    // const { id } = this.props.params;

    // if (this.state.files.length > 0) {
      var newData = new FormData();
      newData.append("firstName", this.state.first_name);
      newData.append("lastName", this.state.last_name);
      newData.append("email", this.state.email);
      newData.append("password", this.state.password);
      newData.append("avatar", this.state.files[0]);

      newData.append("banck_name", this.state.bank_name);
      newData.append("bank_address", this.state.bank_address);
      newData.append("bank_ac_holder_name", this.state.bank_ac_holder_name);
      newData.append("account_number", this.state.bank_account_number);
      newData.append("IFSC_code", this.state.IFSC_code);
      newData.append(
        "bank_account_holder_address",
        this.state.bank_account_holder_address
      );
      newData.append("swift_bic_code", this.state.swift_bic_code);
      newData.append("paypal_email_address", this.state.paypal_email_address);
      newData.append("upi", this.state.upi);

      var config = {
        method: "post",
        url: "/user/add",
        headers: {},
        data: newData,
      };

      api(config)
        .then(function (response) {
          console.log(JSON.stringify(response.data));
          alert("User Added Successfully!");
        })
        .catch(function (error) {
          if (error.response) {
            // Request made and server responded
            alert(error.response?.data?.message);
          } else if (error.request) {
            // The request was made but no response was received
            alert("Something is Wrong!");
            console.log(error.request);
          } else {
            // Something happened in setting up the request that triggered an Error
            alert("Something is Wrong!");
            console.log("Error", error.message);
          }
        });
    // } else {
    //   alert("Please select image!");
    // }
  };

  fileToDataUri = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        resolve(event.target.result);
      };
      reader.readAsDataURL(file);
    });

  setUserImage = (e) => {
    this.setState(
      {
        files: e.target.files,
      },
      () => {
        this.fileToDataUri(e.target.files[0]).then((dataUri) => {
          console.log("==========dataUri==========================");
          console.log(dataUri);
          console.log("====================================");
          this.setState({
            isFileChange: true,
            user_photo_url: dataUri,
          });
        });
      }
    );
  };

  render() {
    return (
      <div>
        <div className="page-header">
          <h3 className="page-title"> Add New User </h3>
        </div>
        <div className="row">
          <div className="col-12 grid-margin">
            <div className="card">
              <div className="card-body">
                <form className="form-sample">
                  <div className="d-flex justify-content-center mb-3">
                    <input
                      accept="image/*"
                      style={{
                        display: "none",
                      }}
                      disabled={true}
                      id="icon-button-file"
                      type="file"
                      onChange={(e) => {
                        this.setUserImage(e);
                      }}
                    />
                    <label htmlFor="icon-button-file">
                      <IconButton
                        color="primary"
                        aria-label="upload picture"
                        component="span"
                      >
                        <Avatar
                          src={this.state.user_photo_url}
                          sx={{ width: 100, height: 100 }}
                        />
                      </IconButton>
                    </label>
                  </div>
                  <p className="card-description"> Personal info </p>

                  <div className="row">
                    <div className="col-md-4">
                      <Form.Group>
                        <label>First Name</label>
                        <div>
                          <Form.Control
                            type="text"
                            value={this.state?.first_name}
                            onChange={this.handleFirstNameChange}
                          />
                        </div>
                      </Form.Group>
                    </div>
                    <div className="col-md-4">
                      <Form.Group>
                        <label>Last Name</label>
                        <div>
                          <Form.Control
                            type="text"
                            value={this.state?.last_name}
                            onChange={this.handleLastNameChange}
                          />
                        </div>
                      </Form.Group>
                    </div>
                    <div className="col-md-4">
                      <Form.Group>
                        <label>Email</label>
                        <div>
                          <Form.Control
                            type="email"
                            value={this.state?.email}
                            onChange={this.handleEmailChange}
                          />
                        </div>
                      </Form.Group>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <Form.Group>
                        <label>Password</label>
                        <div>
                          <Form.Control
                            type="password"
                            value={this.state?.password}
                            onChange={this.handlePasswordChange}
                            onFocus={(e) => {
                              this.setState({ password: "" });
                            }}
                          />
                        </div>
                      </Form.Group>
                    </div>
                    <div className="col-md-6">
                      <Form.Group>
                        <label>Image</label>
                        <div>
                          <Form.Control
                            accept="image/*"
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
                        </div>
                      </Form.Group>
                    </div>
                  </div>

                  <p className="card-description"> Payment Details</p>
                  <div className="row">
                    <div className="col-md-4">
                      <Form.Group>
                        <label>Bank Name</label>
                        <div>
                          <Form.Control
                            type="text"
                            value={this.state?.bank_name}
                            onChange={this.handleBankNameChange}
                          />
                        </div>
                      </Form.Group>
                    </div>
                    <div className="col-md-4">
                      <Form.Group>
                        <label>Account Holder Name</label>
                        <div>
                          <Form.Control
                            type="text"
                            value={this.state?.bank_ac_holder_name}
                            onChange={this.handleBankACHolderNameChange}
                          />
                        </div>
                      </Form.Group>
                    </div>
                    <div className="col-md-4">
                      <Form.Group>
                        <label>Account Number</label>
                        <div>
                          <Form.Control
                            type="text"
                            value={this.state?.bank_account_number}
                            onChange={this.handleBankAccountNumberChange}
                          />
                        </div>
                      </Form.Group>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-10">
                      <Form.Group>
                        <label>Bank Address</label>
                        <div>
                          <Form.Control
                            type="text"
                            value={this.state?.bank_address}
                            onChange={this.handleBankAddressChange}
                          />
                        </div>
                      </Form.Group>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-4">
                      <Form.Group>
                        <label>IFSCCode</label>
                        <div>
                          <Form.Control
                            type="text"
                            value={this.state?.IFSC_code}
                            onChange={this.handleIFSCCodeChange}
                          />
                        </div>
                      </Form.Group>
                    </div>
                    <div className="col-md-4">
                      <Form.Group>
                        <label>SWIFT/BIC Code</label>
                        <div>
                          <Form.Control
                            type="text"
                            value={this.state?.swift_bic_code}
                            onChange={this.handleSwiftBicCodeChange}
                          />
                        </div>
                      </Form.Group>
                    </div>

                    <div className="col-md-4">
                      <Form.Group>
                        <label>UPI</label>
                        <div>
                          <Form.Control
                            type="text"
                            value={this.state?.upi}
                            onChange={this.handleUPIChange}
                          />
                        </div>
                      </Form.Group>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-10">
                      <Form.Group>
                        <label>Account Holder Address</label>
                        <div>
                          <Form.Control
                            type="text"
                            value={this.state?.bank_account_holder_address}
                            onChange={this.handleBankAccountHolderAddressChange}
                          />
                        </div>
                      </Form.Group>
                    </div>
                  </div>
                  <p className="card-description"> PayPal</p>
                  <div className="row">
                    <div className="col-md-12">
                      <Form.Group>
                        <label>PayPal Email</label>
                        <div>
                          <Form.Control
                            type="text"
                            value={this.state?.paypal_email_address}
                            onChange={this.handlePaypalEmailAddressChange}
                          />
                        </div>
                      </Form.Group>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn btn-outline-primary btn-icon-text"
                    onClick={this.AddUser}
                  >
                    Add User
                    <i className="mdi mdi-file-check btn-icon-append"></i>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(ViewUser);
