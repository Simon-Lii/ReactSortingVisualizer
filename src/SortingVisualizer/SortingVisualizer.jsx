import React from 'react';
import { Nav, Navbar, NavDropdown, Container } from 'react-bootstrap';
import { getMergeSortAnimations } from '../sortingAlgorithms/sortingAlgorithms.js';
import { ChromePicker } from 'react-color';
import './SortingVisualizer.css';
import styled from 'styled-components';

// Change this value for the number of bars (value) in the array.
const NUMBER_OF_ARRAY_BARS = 310;

// This is the main color of the array bars.
const PRIMARY_COLOR = '#77E9DC';

// This is the color of array bars that are being compared throughout the animations.
const SECONDARY_COLOR = 'red';

const MAX_SPEED = 100;

const SPEED_SCALING_FACTOR = 1.5;

const STARTING_DISPLAY_SPEED = 30;

const STARTING_ARRAY_BARS_VALUE = 30;

const sliderThumbStyles = (props) => (`
  width: 5px;
  height: 5px;
  background: ${props.color};
  cursor: pointer;
  outline: 5px solid #333;
  opacity: ${props.opacity};
  -webkit-transition: .2s;
  transition: opacity .2s;
`);

const Styles = styled.div`
  display: flex;
  align-items: center;
  color: #888;
  margin-top: 0.01rem;
  margin-bottom: 0.01rem;
  .value {
    flex: 1;
    font-size: 1rem;
  }
  .slider {
    flex: 6;
    -webkit-appearance: none;
    width: 100%;
    height: 15px;
    border-radius: 15px;
    background: #efefef;
    outline: none;
    &::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      ${props => sliderThumbStyles(props)}
    }
    &::-moz-range-thumb {
      ${props => sliderThumbStyles(props)}
    }
  }
`;

export default class SortingVisualizer extends React.Component {

  state = {
    array: [],
    sliderValue: STARTING_ARRAY_BARS_VALUE,
    speed: (MAX_SPEED - STARTING_DISPLAY_SPEED) / SPEED_SCALING_FACTOR,
    displaySpeed: STARTING_DISPLAY_SPEED,
    theme: PRIMARY_COLOR
  };

  handleChangeComplete = (color) => {
    this.setState({ theme: color.hex });
  };


  componentDidMount() {
    this.resetArray();
  }

  resetArray() {
    var size = this.state.sliderValue
    const array = [];
    for (let i = 0; i < size; i++) {
      array.push(randomIntFromInterval(5, 730));
    }
    array.push(730)
    this.setState({ array, size });
  }

  mergeSort() {
    const animations = getMergeSortAnimations(this.state.array);
    for (let i = 0; i < animations.length; i++) {
      const arrayBars = document.getElementsByClassName('array-bar');
      const isColorChange = i % 3 !== 2;
      if (isColorChange) {
        const [barOneIdx, barTwoIdx] = animations[i];
        const barOneStyle = arrayBars[barOneIdx].style;
        const barTwoStyle = arrayBars[barTwoIdx].style;
        const color = i % 3 === 0 ? SECONDARY_COLOR : this.state.theme;
        setTimeout(() => {
          barOneStyle.backgroundColor = color;
          barTwoStyle.backgroundColor = color;
        }, i * this.state.speed);
      } else {
        setTimeout(() => {
          const [barOneIdx, newHeight] = animations[i];
          const barOneStyle = arrayBars[barOneIdx].style;
          barOneStyle.height = `${newHeight}px`;
        }, i * this.state.speed);
      }
    }
  }

  quickSort() {
    // We leave it as an exercise to the viewer of this code to implement this method.
  }

  heapSort() {
    // We leave it as an exercise to the viewer of this code to implement this method.
  }

  bubbleSort() {
    // We leave it as an exercise to the viewer of this code to implement this method.
  }

  play() {

  }

  stop() {

  }

  // NOTE: This method will only work if your sorting algorithms actually return
  // the sorted arrays; if they return the animations (as they currently do), then
  // this method will be broken.
  testSortingAlgorithms() {
    for (let i = 0; i < 100; i++) {
      const array = [];
      const length = randomIntFromInterval(1, 1000);
      for (let i = 0; i < length; i++) {
        array.push(randomIntFromInterval(-1000, 1000));
      }
      const javaScriptSortedArray = array.slice().sort((a, b) => a - b);
      const mergeSortedArray = getMergeSortAnimations(array.slice());
      console.log(arraysAreEqual(javaScriptSortedArray, mergeSortedArray));
    }
  }

  handleOnChangeSize = (e) => {
    this.setState({ sliderValue: e.target.value })
    this.resetArray()
  }

  handleOnChangeSpeed = (e) => {
    this.setState({ speed: (MAX_SPEED + 1 - e.target.value) / SPEED_SCALING_FACTOR })
    this.setState({ displaySpeed: e.target.value })
  }

  render() {
    const { array } = this.state;
    return (
      <div className="master-container">
        <div className="navbar-container">
          <Container>
            <Navbar bg="dark" expand="sm" fixed="top" variant="dark">
              <Navbar.Brand href="#home">React Bootstrap Visualizer</Navbar.Brand>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                  <Styles opacity={this.state.sliderValue > 0 ? (this.state.sliderValue) : .1} color={this.props.color}>
                    <input type="range" min={5} max={NUMBER_OF_ARRAY_BARS} value={this.state.sliderValue} className="slider" onChange={this.handleOnChangeSize} />
                    <div className="value">Size{this.state.sliderValue}</div>
                  </Styles>
                  <Styles opacity={this.state.displaySpeed > 0 ? (this.state.displaySpeed) : .1} color={this.props.color}>
                    <input type="range" min={1} max={100} value={this.state.displaySpeed} className="slider" onChange={this.handleOnChangeSpeed} />
                    <div className="value"> Speed {this.state.displaySpeed}</div>
                  </Styles>
                  <button className="btn btn-primary" onClick={() => this.resetArray()}>Generate New Array</button>
                  <button className="btn btn-success" onClick={() => this.bubbleSort()}>Play</button>
                  <button className="btn btn-danger" onClick={() => this.bubbleSort()}>Stop</button>
                  <NavDropdown title="Choose sorting algorithm" id="basic-nav-dropdown">
                    <button onClick={() => this.mergeSort()}>Merge Sort</button>
                    <button onClick={() => this.quickSort()}>Quick Sort</button>
                    <NavDropdown.Divider />
                    <button onClick={() => this.heapSort()}>Heap Sort</button>
                    <button onClick={() => this.bubbleSort()}>Bubble Sort</button>
                  </NavDropdown>
                  <NavDropdown title="Choose color theme" id="basic-nav-dropdown">
                    <ChromePicker 
                      color={ this.state.theme }
                      onChangeComplete={ this.handleChangeComplete }
                    />
                  </NavDropdown>
                </Nav>
              </Navbar.Collapse>
            </Navbar>
          </Container>
        </div>
        <div className="array-container">
          {array.map((value, idx) => (
            <div
              className="array-bar"
              key={idx}
              style={{
                backgroundColor: this.state.theme,
                height: `${value}px`,
              }}></div>
          ))}
          {/* <button onClick={() => this.resetArray()}>Generate New Array</button> */}
          {/* <button onClick={() => this.mergeSort()}>Merge Sort</button> */}
          {/* <button onClick={() => this.quickSort()}>Quick Sort</button>
        <button onClick={() => this.heapSort()}>Heap Sort</button>
          <button onClick={() => this.bubbleSort()}>Bubble Sort</button> */}
          {/* <button onClick={() => this.bubbleSort()}>Play</button>
        <button onClick={() => this.bubbleSort()}>Stop</button> */}

          {/* <Styles opacity={this.state.sliderValue > 10 ? (this.state.sliderValue / 255) : .1} color={this.props.color}>
          <input type="range" min={5} max={310} value={this.state.sliderValue} className="slider" onChange={this.handleOnChangeSize} />
          <div className="value">Array Size {this.state.sliderValue}</div>
        </Styles>
        <Styles opacity={this.state.displaySpeed > 10 ? (this.state.displaySpeed / 255) : .1} color={this.props.color}>
          <input type="range" min={1} max={100} value={this.state.displaySpeed} className="slider" onChange={this.handleOnChangeSpeed} />
          <div className="value"> Speed {this.state.displaySpeed}</div>
          </Styles> */}
        </div>
      </div>
    );
  }
}

// From https://stackoverflow.com/questions/4959975/generate-random-number-between-two-numbers-in-javascript
function randomIntFromInterval(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function arraysAreEqual(arrayOne, arrayTwo) {
  if (arrayOne.length !== arrayTwo.length) return false;
  for (let i = 0; i < arrayOne.length; i++) {
    if (arrayOne[i] !== arrayTwo[i]) {
      return false;
    }
  }
  return true;
}
