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
    left: 40,
    right: 40,
  }
}
let svg = null;
let x_axis = null;
let y_axis = null;
const colors1 = ['rgb(0,80,27)', 'rgb(204,236,230)'];
const colors2 = ['rgb(253,212,158)', 'rgb(239,101,72)'];


let init = (div_name, canvas_width=null, canvas_height=null) => {
  //TODO: better calculate margin
  canvas.size.width = canvas_width || document.getElementById(div_name).clientWidth;
  canvas.size.height = canvas.size.width;
  svg = d3.select(`#${div_name}`)
    .append("svg")
    .attr("width", canvas.size.width)
    .attr("height", canvas.size.height);
}

// scores = array of {color:[0,10], complexity:[0.10], label: "string"}
const drawMarks = function (scores, color = "black", font_size = '1.2em', show_labels = true) {
  if (svg) {
    svg.append("g")
      .attr("stroke", color)
      .attr("stroke-width", 1.5)
      .attr("fill", color)
      .attr("fill-opacity", 0.1)
    .selectAll("circle")
    .data(scores)
    .join("circle")
      .attr("name", d => get_mark_name(d.label))
      .attr("cx", d => x_axis(d.color))
      .attr("cy", d => y_axis(d.complexity))
      .attr("r", 10);

  // Add a layer of labels.
  svg.append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", font_size)
    .selectAll("text")
    .data(scores)
    .join("text")
      .attr("style", "visibility:" + (show_labels ? "visible" : "hidden") )
      .attr("name", d => get_mark_name(d.label))
      .attr("text-anchor", "middle")
      .attr("dy", "1.4em")
      .attr("x", d => x_axis(show_labels ? d.color : 7))
      .attr("y", d => y_axis(show_labels ? d.complexity : 3))
      .text(d => d.label);
  }

  if(!show_labels) {
    for (let entry of scores) {
      let mark_name = get_mark_name(entry.label);
      let mark_circle_elem = document.querySelectorAll(`circle[name="${mark_name}"]`);
      let mark_text_elem = document.querySelectorAll(`text[name="${mark_name}"]`);
      if (mark_text_elem.length == 1 && mark_circle_elem.length == 1) {
        mark_circle_elem[0].addEventListener('click', () => {
          toggle_mark_visibility(mark_text_elem[0]);
        })
        mark_circle_elem[0].addEventListener('mouseover', () => {
          mark_text_elem[0].style.visibility = 'visible'
        })
        mark_circle_elem[0].addEventListener('mouseout', () => {
          mark_text_elem[0].style.visibility = 'hidden'
        })
      }
    }
  }

};


const get_mark_name = (identifier) => {
  return `mark_${identifier}`;
}


const toggle_mark_visibility = (mark_elem) => {
  mark_elem.style.visibility = (mark_elem.style.visibility === 'visible') ? 'hidden' : 'visible'
}


const drawGraphic = function () {
  if (svg) {
    svg.append("g")
    .attr("transform", "translate(" + canvas.margin.left + "," + canvas.margin.top + ")");
    x_axis = d3.scaleLinear()
    .domain([0, 10])
    .range([0, canvas.size.width-canvas.margin.left-canvas.margin.right]);
    svg.append('g')
    .attr("transform", `translate(${canvas.margin.left},${canvas.size.height - canvas.margin.bottom})`)
    .call(d3.axisBottom(x_axis))
    .append("text")
        .attr("x", canvas.size.width/2)
        .attr("y", canvas.margin.bottom)
        .attr("font-size", '1.6em')
        .attr("fill", "black")
        .attr("text-anchor", "middle")
        .text("Colorfulness");

    y_axis = d3.scaleLinear()
    .domain([0, 10])
    .range([canvas.size.height-canvas.margin.top-canvas.margin.bottom, 0]);

    let y_label_x = -canvas.margin.left/2;
    let y_label_y = canvas.size.height/2;
    svg.append('g')
    .attr("transform", `translate( ${canvas.margin.left}, ${canvas.margin.bottom})`)
    .call(d3.axisLeft(y_axis))
    .append("text")
        .attr("x", y_label_x)
        .attr("y", y_label_y)
        .attr("font-size", '1.6em')
        .attr("transform", `rotate(-90, ${y_label_x}, ${y_label_y})`)
        .attr("fill", "black")
        .attr("text-anchor", "middle")
        .text("Complexity");
  } else {
    console.error('Graphic was not initialized. Try init() first!');
  }
};

export{ init, drawGraphic, drawMarks }