import React, { Component } from 'react';
import SortingVisualizer from './SortingVisualizer/SortingVisualizer';
import styled from 'styled-components';
import Slider from './SortingVisualizer/SortingVisualizer';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { render } from 'react-dom';

const Styles = styled.div`
  .App {
    display: flex;
    justify-content: center;
  }
  .wrapper {
    margin-top: 20vh;
    width: 50%;
  }
`;


class App extends Component {
  render() {
    return (
      <div className="App">
        <SortingVisualizer></SortingVisualizer>
        <Styles>
        </Styles>
      </div>
    );
  }
}

export default App;
