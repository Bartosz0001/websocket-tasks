import React from 'react';
import io from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';

class App extends React.Component {

  componentDidMount() {
    const connectionOptions =  {
      "force new connection" : true,
      "reconnectionAttempts": "Infinity", //avoid having user reconnect manually in order to prevent dead clients after a server restart
      "timeout" : 10000, //before connect_error and connect_timeout are emitted.
      "transports" : ["websocket"]
    };

    this.socket = io("http://localhost:8000", connectionOptions);

    this.socket.on('updateData', tasks => {
      this.setState({tasks: [...tasks]});
    });

    this.socket.on('addTask', task => {
      this.addTask(task.id, task.name);
    });

    this.socket.on('removeTask', index => {
      this.state.tasks.splice(index, 1);
      this.setState({tasks: [...this.state.tasks]});
    });
  }

  state = {
    tasks: [],
    taskName: '',
  };

  removeTask(index) {
    this.state.tasks.splice(index, 1);
    this.setState({tasks: [...this.state.tasks]});
    this.socket.emit('removeTask', index);
  }

  submitForm = (event) => {
    event.preventDefault();
    this.id = uuidv4();
    this.addTask(this.id, this.state.taskName);
    this.socket.emit('addTask', {id: this.id, name: this.state.taskName});
  }

  addTask(id, task) {
    this.setState({tasks: [...this.state.tasks, {id: id, name: task}]});
  }

  render() {
    return (
      <div className="App">

        <header>
          <h1>ToDoList.app</h1>
        </header>

        <section className="tasks-section" id="tasks-section">
          <h2>Tasks</h2>

          <ul className="tasks-section__list" id="tasks-list">
            {this.state.tasks.map(item => (
              <li className="task">{item.name}<button className="btn btn--red" onClick={() => {this.removeTask(this.state.tasks.findIndex(index => item.id === index.id))}}>Remove</button></li>
            ))}
          </ul>

          <form id="add-task-form" onSubmit={this.submitForm}>
            <input className="text-input" autoComplete="off" type="text"
              placeholder="Type your description" id="task-name"
              onChange={(event) => this.setState({taskName: event.target.value})} />
            <button className="btn" type="submit">Add</button>
          </form>

        </section>
      </div>
    );
  };

};

export default App;


