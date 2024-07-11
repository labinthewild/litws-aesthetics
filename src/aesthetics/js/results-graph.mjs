// Depends on 'd3'
// import d3 from 'd3';
// window.d3 = d3;
// OR: add it to your index.html

let canvas = {
  size: {
    width: 0,
    height:0,    
  },
  margin: {
    top: 30,
    bottom: 30,
    left: 30,
    right: 30,
  }
}
let svg = null;
const colors1 = ['rgb(0,80,27)', 'rgb(204,236,230)'];
const colors2 = ['rgb(253,212,158)', 'rgb(239,101,72)'];


let init = (div_name) => {
  let base_measure = document.getElementById(div_name).clientWidth;
  //TODO: better calculate margin
  canvas.size.width = base_measure;
  canvas.size.height = base_measure;
  svg = d3.select(`#${div_name}`)
    .append("svg")
    .attr("width", canvas.size.width)
    .attr("height", canvas.size.height);
}


const _calculateMarkX = function (score) {
  if (score > MAX_SCORE - offset) {
    return (width / MAX_SCORE) * score - offset;
  }
  return (width / MAX_SCORE) * score;
  };

  const _addMark = function (context) {
  context.moveTo(barHeight / 2, barHeight);
  context.lineTo(0, 0);
  context.lineTo(barHeight, 0);
  context.closePath();
  return context;
};

const drawMark = function (score, legend, fill = false) {
  const mark = svg.append("g");
  const fill_color = fill ? "black" : "none";
  mark.append("path")
    .style("stroke", "black")
    .style("fill", fill_color)
    .attr('d', _addMark(d3.path()));

  mark.append("text")
    .attr('x', barHeight / 2)
    .attr('y', -5)
    .attr('text-anchor', 'middle')
    .attr('font-size', '1.5em')
    .text(legend);

  mark.attr('transform', `translate(${_calculateMarkX(score)}, ${height / 2 - (3 / 2 * barHeight)})`);
};

const drawGraphic = function () {
  if (svg) {
    svg.append("g")
    .attr("transform", "translate(" + canvas.margin.left + "," + canvas.margin.top + ")");
    var x_axis = d3.scaleLinear()
    .domain([0, 100])
    .range([0, canvas.size.width-canvas.margin.left-canvas.margin.right]);
    svg.append('g')
    .attr("transform", `translate(${canvas.margin.left},${canvas.size.height - canvas.margin.bottom})`)
    .call(d3.axisBottom(x_axis));

    var y_axis = d3.scaleLinear()
    .domain([0, 100])
    .range([canvas.size.height-canvas.margin.top-canvas.margin.bottom, 0]);
    svg.append('g')
    .attr("transform", `translate( ${canvas.margin.left}, ${canvas.margin.bottom})`)
    .call(d3.axisLeft(y_axis));


  } else {
    console.error('Graphic was not initialized. Try init() first!');
  }
};

export{ init, drawGraphic, drawMark }