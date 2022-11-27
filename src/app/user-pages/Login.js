import React, { Component } from "react";
import { Form } from "react-bootstrap";
import Alert from "react-bootstrap/Alert";
import api from "../../http-commn"
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  // width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export class Login extends Component {
  state = {
    roleIs: "",
    isAuth: false,
    email: "",
    password: "",
    isLoginFailure: false,
    isOpen: false,
  };
  componentDidMount() {
    if (localStorage.getItem("token")) {
      window.location.replace(
        localStorage.getItem("type") == "admin" ? "/home" : "/home"
      );
    }
  }

  handleOpen = () => this.setState({ isOpen: true });
  handleClose = () => this.setState({ isOpen: false });

  handleUserInput = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({ [name]: value });
  };

  onSubmit = async () => {
    const data = JSON.stringify({
      email: this.state.email,
      password: this.state.password,
    });

    const config = {
      method: "post",
      url: "/auth/login",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };
    console.log("====================================");
    console.log(config);
    console.log("====================================");
    api(config)
      .then(async (response) => {
        const result = JSON.parse(JSON.stringify(response.data));
        console.log(result?.data, result?.type);
        window.localStorage.setItem("token", result?.data);
        window.localStorage.setItem("type", result?.type);
        window.localStorage.setItem("first_name", result?.first_name);
        window.localStorage.setItem("last_name", result?.last_name);
        window.localStorage.setItem("email", result?.email);
        window.localStorage.setItem("photo", result?.photo);
        window.localStorage.setItem("id", result?.id);

        window.location.replace(result?.type == "admin" ? "/home" : "/home");
      })
      .catch((error) => {
        console.log(error);
        this.setState({ isLoginFailure: true });
      });
  };

  render() {
    return (
      <div>
        <div className="d-flex align-items-center auth px-0">
          <div className="row w-100 mx-0">
            <div className="col-lg-4 mx-auto">
              <div className="auth-form-light text-left py-5 px-4 px-sm-5">
                <h4>Hello! let's get started</h4>
                <h6 className="font-weight-light">Sign in to continue.</h6>
                {/* <Form className="pt-3" onSubmit={this.onSubmit}> */}
                <Form.Group className="d-flex search-field">
                  <Form.Control
                    type="email"
                    placeholder="Username"
                    size="lg"
                    className="h-auto"
                    onChange={(event) => this.handleUserInput(event)}
                    name="email"
                  />
                </Form.Group>
                <Form.Group className="d-flex search-field">
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    size="lg"
                    onChange={(event) => this.handleUserInput(event)}
                    className="h-auto"
                    name="password"
                  />
                </Form.Group>
                <div className="mt-3">
                  <button
                    className="btn btn-block btn-primary btn-lg font-weight-medium auth-form-btn"
                    type="submit"
                    onClick={this.onSubmit}
                  >
                    SIGN IN
                  </button>
                </div>
                <div className="my-2 d-flex justify-content-between align-items-center">
                  <div className="form-check">
                    <label className="form-check-label text-muted">
                      <input type="checkbox" className="form-check-input" />
                      <i className="input-helper"></i>
                      Keep me signed in
                    </label>
                  </div>
                  <a
                    
                    onClick={this.handleOpen}
                    className="auth-link text-black "
                   
                  >
                    Forgot password?
                  </a>
                  <Modal
                    aria-labelledby="transition-modal-title"
                    aria-describedby="transition-modal-description"
                    open={this.state.isOpen}
                    onClose={this.handleClose}
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{
                      timeout: 500,
                    }}
                  >
                    <Fade in={this.state.isOpen}>
                      <Box sx={style}>
                        <Typography
                          id="transition-modal-title"
                          variant="h6"
                          component="h2"
                        >
                         Contact Support
                        </Typography>
                        <Typography
                          id="transition-modal-description"
                          sx={{ mt: 2 }}
                        >
                         Email:- support@adxfire.com 
                        </Typography>
                      </Box>
                    </Fade>
                  </Modal>
                </div>
                {/* </Form> */}
                {this.state.isLoginFailure && (
                  <Alert variant={"danger"}>
                    Some Thing went wrong. Please try again!
                  </Alert>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
