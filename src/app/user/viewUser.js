import React, { Component } from "react";
import { Form } from "react-bootstrap";
import DatePicker from "react-datepicker";
import bsCustomFileInput from "bs-custom-file-input";
import withRouter from "../withRouter";
import Button from '@mui/material/Button';
import { Stack, IconButton, InputAdornment } from '@mui/material';
import api from "../../http-commn"
import Avatar from '@mui/material/Avatar';

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
    };
  }

  handleChange = (date) => {
    this.setState({
      startDate: date,
    });
  };
  handleFirstNameChange = (first_name) => {
    this.setState({
      first_name: first_name,
    });
  };
  handleLastNameChange = (last_name) => {
    this.setState({
      last_name: last_name,
    });
  };
  handleEmailChange = (email) => {
    this.setState({
      email: email,
    });
  };

  handlePasswordChange = (password) => {
    this.setState({
      password: password,
    });
  };

  handlePaypalEmailAddressChange = (email) => {
    this.setState({
      paypal_email_address: email,
    });
  };
  handleBankAccountHolderAddressChange = (bank_account_holder_address) => {
    this.setState({
      bank_account_holder_address: bank_account_holder_address,
    });
  }; 
  handleUPIChange = (upi) => {
    this.setState({
      upi: upi,
    });
  }; 
  
  handleSwiftBicCodeChange = (swift_bic_code) => {
    this.setState({
      swift_bic_code: swift_bic_code,
    });
  }; 
  
  handleIFSCCodeChange = (IFSC_code) => {
    this.setState({
      IFSC_code: IFSC_code,
    });
  }; 

  handleBankAddressChange = (bank_address) => {
    this.setState({
      bank_address: bank_address,
    });
  };

  handleBankNameChange = (bank_name) => {
    this.setState({
      bank_name: bank_name,
    });
  }; 
  
  handleBankACHolderNameChange = (bank_ac_holder_name) => {
    this.setState({
      bank_ac_holder_name: bank_ac_holder_name,
    });
  };

  handleBankAccountNumberChange = (bank_account_number) => {
    this.setState({
      bank_account_number: bank_account_number,
    });
  };

  componentDidMount() {
    const { id } = this.props.params;

    bsCustomFileInput.init();
    let config = {
      method: "get",
      url: `/users/${id}`,
      headers: {},
    };
    api(config)
      .then( (response)=> {
        const User = JSON.parse(JSON.stringify(response.data.data));
        this.setState({
          first_name: User?.first_name,
          last_name: User?.last_name,
          password: User?.password,
          photo: User?.photo,
          email: User?.email,
          bank_name: User?.banck_name,
          bank_address: User?.bank_address,
          bank_ac_holder_name: User?.bank_ac_holder_name,
          bank_account_holder_address: User?.bank_account_holder_address,
          bank_account_number: User?.account_number,
          IFSC_code: User?.IFSC_code,
          swift_bic_code: User?.swift_bic_code,
          paypal_email_address: User?.paypal_email_address,
          upi: User?.upi,
          user_photo_url: `https://api.adxfire.com/${User?.photo}`,
        });
      })
      .catch( (error) =>{
        console.log(error);
      });
  }

  setUserImage = (e) => {
    // fileToDataUri(e.target.files[0]).then((dataUri) => {
    //   isEdit ? setIsFileChange(true) : null;
    //   setURL(dataUri);
    //   setFiles(e.target.files);
    // });
  };



  render() {
    return (
      <div>
        <div className="page-header">
          <h3 className="page-title"> View User </h3>
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
                      id="icon-button-file"
                      type="file"
                      disabled={true}
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
                        <Avatar src={this.state.user_photo_url} sx={{ width:100, height: 100 }} />
                      </IconButton>
                    </label>
                  </div>
                  <p className="card-description"> Personal info </p>
                 
                  <div className="row">
                    <div className="col-md-6">
                      <Form.Group >
                        <label>
                          First Name
                        </label>
                        <div >
                          <Form.Control
                            type="text"
                            value={this.state?.first_name}
                            disabled={true}
                            onChange={this.handleFirstNameChange}
                          />
                        </div>
                      </Form.Group>
                    </div>
                    <div className="col-md-6">
                      <Form.Group >
                        <label>
                          Last Name
                        </label>
                        <div >
                          <Form.Control
                            type="text"
                            value={this.state?.last_name}
                            disabled={true}
                            onChange={this.handleLastNameChange}
                          />
                        </div>
                      </Form.Group>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <Form.Group >
                        <label>Email</label>
                        <div >
                          <Form.Control
                            type="email"
                            value={this.state?.email}
                            disabled={true}
                            onChange={this.handleEmailChange}
                          />
                        </div>
                      </Form.Group>
                    </div>
                    <div className="col-md-6">
                      <Form.Group >
                        <label>
                          Password
                        </label>
                        <div >
                          <Form.Control
                            type="password"
                            value={this.state?.password}
                            disabled={true}
                            onChange={this.handlePasswordChange}
                          />
                        </div>
                      </Form.Group>
                    </div>
                  </div>
                  
                  <p className="card-description"> Payment Details</p>
                  <div className="row">
                    <div className="col-md-4">
                      <Form.Group >
                        <label >
                        Bank Name 
                        </label>
                        <div >
                          <Form.Control
                            type="text"
                            value={this.state?.bank_name}
                            disabled={true}
                            onChange={this.handleBankNameChange}
                          />
                        </div>
                      </Form.Group>
                    </div>
                    <div className="col-md-4">
                      <Form.Group>
                        <label >
                        Account Holder Name
                        </label>
                        <div >
                          <Form.Control
                            type="text"
                            value={this.state?.bank_ac_holder_name}
                            disabled={true}
                            onChange={this.handleBankACHolderNameChange}
                          />
                        </div>
                      </Form.Group>
                    </div>
                    <div className="col-md-4">
                      <Form.Group >
                        <label >
                        Account Number
                        </label>
                        <div >
                          <Form.Control
                            type="text"
                            value={this.state?.bank_account_number}
                            disabled={true}
                            onChange={this.handleBankAccountNumberChange}
                          />
                        </div>
                      </Form.Group>
                    </div>
                    
                  </div>
                  <div className="row">
                    
                    <div className="col-md-10">
                      <Form.Group >
                        <label >
                        Bank Address
                        </label>
                        <div >
                          <Form.Control
                            type="text"
                            value={this.state?.bank_address}
                            disabled={true}
                            onChange={this.handleBankAddressChange}
                          />
                        </div>
                      </Form.Group>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-4">
                      <Form.Group >
                        <label >
                        IFSCCode
                        </label>
                        <div >
                          <Form.Control
                            type="text"
                            value={this.state?.IFSC_code}
                            disabled={true}
                            onChange={this.handleIFSCCodeChange}
                          />
                        </div>
                      </Form.Group>
                    </div>
                    <div className="col-md-4">
                      <Form.Group>
                        <label >
                        SWIFT/BIC Code
                        </label>
                        <div >
                          <Form.Control
                            type="text"
                            value={this.state?.swift_bic_code}
                            disabled={true}
                            onChange={this.handleSwiftBicCodeChange}
                          />
                        </div>
                      </Form.Group>
                    </div>
                    
                    <div className="col-md-4">
                      <Form.Group >
                        <label >
                        UPI
                        </label>
                        <div >
                          <Form.Control
                            type="text"
                            value={this.state?.upi}
                            disabled={true}
                            onChange={this.handleUPIChange}
                          />
                        </div>
                      </Form.Group>
                    </div>
                    
                  </div>
                  <div className="row">
                    
                    <div className="col-md-10">
                      <Form.Group >
                        <label >
                        Account Holder Address
                        </label>
                        <div >
                          <Form.Control
                            type="text"
                            value={this.state?.bank_account_holder_address}
                            disabled={true}
                            onChange={this.handleBankAccountHolderAddressChange}
                          />
                        </div>
                      </Form.Group>
                    </div>
                  </div>
                  <p className="card-description"> PayPal</p>
                  <div className="row">
                    
                    <div className="col-md-12">
                      <Form.Group >
                        <label >
                        PayPal Email
                        </label>
                        <div >
                          <Form.Control
                            type="text"
                            value={this.state?.paypal_email_address}
                            disabled={true}
                            onChange={this.handlePaypalEmailAddressChange}
                          />
                        </div>
                      </Form.Group>
                    </div>
                  </div>
                 
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
