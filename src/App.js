import React, { Component, Fragment } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.css';
import About from './components/pages/About';
import Navbar from './components/layout/Navbar';
import Users from './components/users/Users';
import User from './components/users/User';
import Search from './components/users/Search';
import Alert from './components/layout/Alert';

class App extends Component {
  state = {
    users: [],
    user: {},
    repos: [],
    loading: false,
    alert: null,
  };

  searchUsers = async (text) => {
    this.setState({ loading: true });
    try {
      const response = await fetch(
        `https://api.github.com/search/users?q=${text}&client_id=
      ${process.env.REACT_APP_GITHUB_CLIENT_ID}&client_secret=
      ${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`
      );
      if (!response.ok) throw new Error(response.statusText);

      const { items, errors, message } = await response.json();
      if (items.length === 0) throw new Error('No users found with that name.');
      if (errors) throw new Error(message);
      this.setState({ users: items, loading: false });
    } catch (e) {
      this.setAlert(e.message, 'light');
      this.setState({ users: [], loading: false });
    }
  };

  getUser = async (login) => {
    this.setState({ loading: true });
    try {
      const response = await fetch(
        `https://api.github.com/users/${login}
      ?client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}
      &client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`
      );
      if (!response.ok) throw new Error(response.statusText);

      const responseData = await response.json();
      const { errors, message } = responseData;
      console.log(responseData);
      if (message === 'Not Found') throw new Error('User Not Found');
      if (errors) throw new Error(message);
      this.setState({ user: responseData, loading: false });
    } catch (e) {
      this.setAlert(e.message, 'light');
      this.setState({ user: {}, loading: false });
    }
  };

  getUserRepos = async (login) => {
    this.setState({ loading: true });
    try {
      const response = await fetch(
        `https://api.github.com/users/${login}/repos?per_page=5&sort=created:asc
      &client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}
      &client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`
      );
      if (!response.ok) throw new Error(response.statusText);

      const responseData = await response.json();
      const { errors, message } = responseData;
      console.log(responseData);
      if (message === 'Not Found') throw new Error('User Not Found');
      if (errors) throw new Error(message);
      this.setState({ repos: responseData, loading: false });
    } catch (e) {
      this.setAlert(e.message, 'light');
      this.setState({ repos: [], loading: false });
    }
  };

  clearUsers = async () => {
    this.setState({ users: [], loading: false });
  };

  setAlert = (msg, type) => {
    this.setState({ alert: { msg, type } });

    setTimeout(this.closeAlert, 5000);
  };

  closeAlert = () => {
    this.setState({ alert: null });
  };
  render() {
    const { loading, repos, users, user } = this.state;
    return (
      <Router>
        <div className="App">
          <Navbar />
          <div className="container">
            <Alert alert={this.state.alert} closeAlert={this.closeAlert} />
            <Switch>
              <Route
                exact
                path="/"
                render={(props) => (
                  <Fragment>
                    <Search
                      searchUsers={this.searchUsers}
                      clearUsers={this.clearUsers}
                      showClear={users.length > 0 ? true : false}
                      setAlert={this.setAlert}
                    />
                    <Users loading={loading} users={users} />
                  </Fragment>
                )}
              />
              <Route exact path="/about" component={About} />
              <Route
                exact
                path="/user/:login"
                render={(props) => (
                  <User
                    {...props}
                    getUser={this.getUser}
                    getUserRepos={this.getUserRepos}
                    repos={repos}
                    user={user}
                    loading={loading}
                  />
                )}
              />
            </Switch>
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
