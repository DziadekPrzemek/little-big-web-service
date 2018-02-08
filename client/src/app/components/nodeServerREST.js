import React from 'react';
import axios from 'axios';
import BootstrapTable from 'react-bootstrap-table-next';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000'
});

class NodeServerREST extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      serverStatus: false,
      userId: '',
      user: {},
      users: []
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleReadUser = this.handleReadUser.bind(this);
  }

  componentDidMount() {
    this.checkServerStatus();
    this.readUsers();
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  checkServerStatus() {
    axiosInstance.get('users/').catch(error => {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log('error.response.data' + error.response.data);
        console.log('error.response.status' + error.response.status);
        console.log('error.response.headers' + error.response.headers);
        this.setState({ serverStatus: false });
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log('error.request' + error.request);
        this.setState({ serverStatus: false });
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Else error.message', error.message);
        this.setState({ serverStatus: false });
      }
      console.log('error.config' + error.config);
      this.setState({ serverStatus: false });
    });
  }

  readUsers() {
    axiosInstance.get('/users').then(response => {
      this.setState({ users: response.data, serverStatus: true });
    }).catch(error => {
      console.log(error);
    });
  }

  readUserById(id) {
    axiosInstance.get('/users/' + id).then(response => {
      this.setState({ user: response.data });
    }).catch(error => {
      console.log(error);
    });
  }

  handleReadUser(event) {
    this.readUserById(this.state.userId);
    event.preventDefault();
  }

  ServerStatus(props) {
    if (props.status === true) {
      return (
        <h6>Server status: OK</h6>
      );
    } else if (props.status === false) {
      return (
        <h6>Server status: Not Responding</h6>
      );
    }
  }

  UsersTable(data) {
    const columns = [{
      dataField: '_id',
      text: 'ID'
    }, {
      dataField: 'name',
      text: 'Name'
    }, {
      dataField: 'age',
      text: 'Age'
    }];
    return (
      <BootstrapTable keyField="_id" data={data.data} columns={columns} />
    );
  }

  ReadUserForm(props) {
    return (
      <form onSubmit={props.onSubmit}>
        <div className="row pb-2">
          <input
            name="userId" type="text" className="form-control"
            value={props.userId} onChange={props.onHandleChange}
            placeholder="Type User Id" />
        </div>
        <div className="pt-2 pb-2">
          <input type="submit" className="btn btn-danger" value="Show" />
        </div>
      </form>
    );
  }

  render() {
    return (
      <div className="text-center pt-5">
        <div className="col-md-8 mx-auto">
          <div className="pb-2">
            <h4>{'Read data from Node.JS RESTful API'}</h4>
            <this.ServerStatus status={this.state.serverStatus} />
            <h6>{'If not responding check readme on github'}</h6>
          </div>
          <div className="pb-2">
            <this.UsersTable data={this.state.users} />
          </div>
          <div className="pb-2">
            <h4>{'Read user by Id'}</h4>
          </div>
          <div>
            <this.ReadUserForm
              onSubmit={this.handleReadUser} userId={this.state.userId}
              onHandleChange={this.handleChange} />
            <div>
              <p>
                ID: {this.state.user._id}
              </p>
              <p>
                Name: {this.state.user.name}
              </p>
              <p>
                Age: {this.state.user.age}
              </p>
            </div>
          </div>
        </div>
      </div >
    );
  }
}

export default NodeServerREST;