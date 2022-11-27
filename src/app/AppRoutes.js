import React, { Component, Suspense, lazy } from "react";
import { Switch, Route, Redirect } from "react-router-dom";

import Spinner from "../app/shared/Spinner";
import ProtectedRoute from "./ProtectedRoute";

const Dashboard = lazy(() => import("./dashboard/Dashboard"));
const Stats = lazy(() => import("./dashboard/stats"));

const CustomerDashboard = lazy(() =>
  import("./customerDashboard/customerDashboard")
);
const CustomerStats = lazy(() => import("./customerDashboard/customerStats"));
const FinalPayableCustomer = lazy(() =>
  import("./customerDashboard/finalPayableCustomer")
);

const User = lazy(() => import("./user/user"));
const AddUser = lazy(() => import("./user/addUser"));
const ViewUser = lazy(() => import("./user/viewUser"));
const EditUser = lazy(() => import("./user/editUser"));

const Reports = lazy(() => import("./reports/reports"));
const AddReport = lazy(() => import("./reports/addReport"));

const FinalPayAbles = lazy(() => import("./finalPayable/finalPayable"));
const AddFinalPayAbles = lazy(() => import("./finalPayable/addFinalAble"));

const Domains = lazy(() => import("./domain/domain"));
const AddDomain = lazy(() => import("./domain/addDomain"));
const EditDomain = lazy(() => import("./domain/editDomain"));

const UsersDomains = lazy(() => import("./usersDomains/usersdomain"));
const AddUsersDomain = lazy(() => import("./usersDomains/addUsersDomain"));
const EditUsersDomain = lazy(() => import("./usersDomains/editusersDomain"));

const Profile = lazy(() => import("./profile/profile"));

const DomainCustomers = lazy(() => import("./domainCustomers/domain"));

const Login = lazy(() => import("./user-pages/Login"));

class AppRoutes extends Component {
  state = {
    roleIs: "",
    isAuth: true,
  };
  componentDidMount() {
    if (localStorage.getItem("token")) {
      console.log(localStorage.getItem("token"));
      this.setState({
        roleIs: localStorage.getItem("type"),
        isAuth: true,
      });
    } else {
      this.setState({
        roleIs: localStorage.getItem("type"),
      });
    }
  }
  render() {
    return (
      <Suspense fallback={<Spinner />}>
        <Switch>
          {localStorage.getItem("type") === "admin" && (
            <ProtectedRoute
              path="/home"
              component={Dashboard}
              isAuth={this.state?.isAuth}
              roleIs={this.state?.roleIs}
            />
          )}

          {localStorage.getItem("type") === "admin" && (
            <ProtectedRoute
              path="/stats"
              component={Stats}
              isAuth={this.state.isAuth}
              roleIs={this.state?.roleIs}
            />
          )}

          {localStorage.getItem("type") === "admin" && (
            <ProtectedRoute
              path="/users"
              component={User}
              isAuth={this.state.isAuth}
              roleIs={this.state?.roleIs}
            />
          )}

          {localStorage.getItem("type") === "admin" && (
            <ProtectedRoute
              path="/reports"
              component={Reports}
              isAuth={this.state.isAuth}
              roleIs={this.state?.roleIs}
            />
          )}

          {localStorage.getItem("type") === "admin" && (
            <ProtectedRoute
              path="/addReport"
              component={AddReport}
              isAuth={this.state.isAuth}
              roleIs={this.state?.roleIs}
            />
          )}

          {localStorage.getItem("type") === "admin" && (
            <ProtectedRoute
              path="/finalPayAbles"
              component={FinalPayAbles}
              isAuth={this.state.isAuth}
              roleIs={this.state?.roleIs}
            />
          )}

          {localStorage.getItem("type") === "admin" && (
            <ProtectedRoute
              path="/addFinalPayAbles"
              component={AddFinalPayAbles}
              isAuth={this.state.isAuth}
              roleIs={this.state?.roleIs}
            />
          )}

          {localStorage.getItem("type") === "admin" && (
            <ProtectedRoute
              path="/domains"
              component={Domains}
              isAuth={this.state.isAuth}
              roleIs={this.state?.roleIs}
            />
          )}

          {localStorage.getItem("type") === "admin" && (
            <ProtectedRoute
              path="/addDomain"
              component={AddDomain}
              isAuth={this.state.isAuth}
              roleIs={this.state?.roleIs}
            />
          )}

          {localStorage.getItem("type") === "admin" && (
            <ProtectedRoute
              path="/editDomain/:id"
              component={EditDomain}
              isAuth={this.state.isAuth}
              roleIs={this.state?.roleIs}
            />
          )}

          {localStorage.getItem("type") === "admin" && (
            <ProtectedRoute
              path="/usersDomains"
              component={UsersDomains}
              isAuth={this.state.isAuth}
              roleIs={this.state?.roleIs}
            />
          )}

          {localStorage.getItem("type") === "admin" && (
            <ProtectedRoute
              path="/addUsersDomain"
              component={AddUsersDomain}
              isAuth={this.state.isAuth}
              roleIs={this.state?.roleIs}
            />
          )}

          {localStorage.getItem("type") === "admin" && (
            <ProtectedRoute
              path="/editUsersDomain/:id"
              component={EditUsersDomain}
              isAuth={this.state.isAuth}
              roleIs={this.state?.roleIs}
            />
          )}

          {localStorage.getItem("type") === "admin" && (
            <ProtectedRoute
              path="/addUser"
              component={AddUser}
              isAuth={this.state.isAuth}
              roleIs={this.state?.roleIs}
            />
          )}

          {localStorage.getItem("type") === "admin" && (
            <ProtectedRoute
              path="/viewUser/:id"
              component={ViewUser}
              isAuth={this.state.isAuth}
              roleIs={this.state?.roleIs}
            />
          )}

          {localStorage.getItem("type") === "admin" && (
            <ProtectedRoute
              path="/editUser/:id"
              component={EditUser}
              isAuth={this.state.isAuth}
              roleIs={this.state?.roleIs}
            />
          )}

          {localStorage.getItem("type") === "user" && (
            <ProtectedRoute
              path="/home"
              component={CustomerDashboard}
              isAuth={this.state.isAuth}
              roleIs={this.state?.roleIs}
            />
          )}

          {localStorage.getItem("type") === "user" && (
            <ProtectedRoute
              path="/stats"
              component={CustomerStats}
              isAuth={this.state.isAuth}
              roleIs={this.state?.roleIs}
            />
          )}
          {localStorage.getItem("type") === "user" && (
            <ProtectedRoute
              path="/finalPayable"
              component={FinalPayableCustomer}
              isAuth={this.state.isAuth}
              roleIs={this.state?.roleIs}
            />
          )}

          <ProtectedRoute
            path="/profile"
            component={Profile}
            isAuth={this.state.isAuth}
            roleIs={this.state?.roleIs}
          />

          {localStorage.getItem("type") === "user" && (
            <ProtectedRoute
              path="/sites"
              component={DomainCustomers}
              isAuth={this.state.isAuth}
              roleIs={this.state?.roleIs}
            />
          )}

          <Route path="/login" component={Login} />
          <Redirect to="/login" />
        </Switch>
      </Suspense>
    );
  }
}

export default AppRoutes;
