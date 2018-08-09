import React, { Component } from 'react';
import PropTypes from 'prop-types';
import $ from 'jquery';
import { EWOULDBLOCK } from 'constants';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rows: [],
      val : 'hello',
      finished: []
    }
  }

  componentDidMount() {
    this.fetch(); 
    this.fetch2();
  }

  fetch() {
    $.get('/1', (dat) => {
      dat.forEach((el) => {
        var arr = this.state.rows;
        arr.unshift(<h2 id='item'>{el.value}</h2>);
        this.setState({
          rows: arr
        });
      });
    });
  }

  fetch2() {
    $.get('/2', (dat) => {
      dat.forEach((el) => {
        var arr = this.state.finished;
        arr.unshift(<h2 id='item'>{el.value}</h2>);
        this.setState({
          finished: arr
        });
      });
    });
  }

  add(event) {
    event.preventDefault();
    var arr = this.state.rows;
    var saver = this.state.val;
    arr.unshift(<h2 id='item'>{this.state.val}</h2>);
    this.setState({
      rows: arr,
      val: ''
    })
    
    $.post('/1', {'Content-Type': 'application/json', data: saver }, (data) => {
      console.log('succ')
    });
  }

  texter(event) {
    var item = event.target.value;
    event.preventDefault();
    this.setState({
      val: item
    })
  }

  remove(event) {
    event.preventDefault();
    var arr = this.state.rows;
    var removed = arr.shift();
    var arr2 = this.state.finished;
    arr2.unshift(removed);

    this.setState({
      rows: arr,
      finished: arr2
    });

    $.post('/2', {'Content-Type': 'application/json', data: removed.props.children }, (data) => {
      console.log('succ')
    });
  }

  add2(event) {
    event.preventDefault();
    var arr = this.state.rows;
    arr.push(<h2 id='item'>{this.state.val}</h2>);
    this.setState({
      rows: arr,
      val: ''
    });

    $.post('/1', {'Content-Type': 'application/json', data: saver }, (data) => {
      console.log('succ')
    });



  }

  clear(event) {
    event.preventDefault();
    var arr = [];
    this.setState({
      rows: arr,
      finished: []
    });

    $.ajax({
      url: '/1',
      type: 'DELETE'
    });

  }



  
  render() {
    return (
      <div id='main'>
        <img src='https://s3.us-east-2.amazonaws.com/stacktodo/stackTodo.png' />
        <div id='todo'>
          {this.state.rows}
        </div>
        <div id='theforms'>
        <form>
          <label>
          <input type='text' value ={this.state.val} onChange={this.texter.bind(this)} id='inn'/>
          <input type='submit' onClick={this.add.bind(this)}  id='sub'/>
          <input type='submit' value ='Enqueue' onClick={this.add2.bind(this)} id='sub' />
          </label>
        </form>
        <div id='buttons'>
          <button onClick={this.remove.bind(this)} id='fin'> Finished </button>
          <button onClick={this.clear.bind(this)} id='clear'> Clear </button>
        </div>
        </div>
        <div id='todo'>
          {this.state.finished}
        </div>
      </div>
    
    )
  }
}

export default App;
