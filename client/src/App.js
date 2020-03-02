import React from 'react';
import io from 'socket.io-client';

class App extends React.Component {

  componentDidMount() {
    this.socket = io();
    this.socket.connect("http://localhost:8000");
  }

  state = {
    tasks: [],
    taskName: '',
  };

  removeTask(index) {
    console.log(this.state.tasks);
    this.state.tasks.splice(index, 1);
    this.socket.emit('removeTask', index);
    console.log('remove');
  }

  submitForm = (event) => {
    event.preventDefault();
    this.addTask(this.state.taskName);
    this.socket.emit('addTask', this.state.taskName);
    console.log(this.state.taskName);
    console.log(this.state.tasks);
  }

  addTask(task) {
    console.log(task);
    this.setState({tasks: [...this.state.tasks, task]});
    console.log(this.state.tasks);
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
              <li className="task">{item}<button className="btn btn--red" >Remove</button></li>
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


