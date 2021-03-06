import React, { Component } from 'react'
import { select } from "d3-selection";
import { json } from "d3-fetch";
import { scaleLinear } from "d3-scale";
import { max } from "d3-array";
import { axisBottom, axisLeft } from "d3-axis";
import { format } from "d3-format";
import { line } from "d3-shape";

const d3 = {
    select,
    json,
    scaleLinear,
    max,
    axisBottom,
    axisLeft,
    format,
    line
};



export class DrawChart extends Component {
    constructor(props){
        super(props)
        this.createChart = this.createChart.bind(this)
        
    }

    componentDidMount(){
       
        this.createChart()
    }

    componentDidUpdate(){
        this.createChart()
    }

    createChart(){
        
        if(this.props.data.length != 0){
            const margin = { top: 20, right: 55, bottom: 50, left: 95 };
            const width = this.props.width;
            const height = this.props.height;
            const chartWidth = this.props.width - margin.right - margin.left;        
            const chartHeight = this.props.height - margin.top - margin.bottom;
                        
            const node = d3.select(this.node)
                .html("")
                .attr("xmlns", "http://www.w3.org/2000/svg")
                .attr("id", "svg" + country)
                .attr("width", width)// + margin.right + margin.left)
                .attr("height", height)// + margin.top + margin.bottom)
                .style("background-color", "#282C34");
            
            const country = this.props.country;

            const variables = ["ImportsOfServices_1", "ExportsOfServices_2"];
            const labels = ["Import", "Export"];
            const xLabel = "Quarters"
            const yLabel = "Euro(Millions)"
           
            const colours = ["#005EB8", "#ff7f00"]
            const Year = this.props.data.map(d => d.Periods.substring(0,4) );
            
            let maxValueArray = [];
            for (let i = 0; i < variables.length; i++) {
                maxValueArray[i] = d3.max(this.props.data, (d) => d[variables[i]]);
            };
            const maxValue = d3.max(maxValueArray, (d) => d) * 1.10;
            let fontSize = "0.65rem";
            if(width>500) {
                fontSize = "0.9rem";
            }
            const fontFamily = "BlinkMacSystemFont,Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,Fira Sans,Droid Sans,'Helvetica Neue',sans-serif"

            const xScale = d3.scaleLinear()
                .domain([Year[0], Year[Year.length - 1]])
                .range([0, chartWidth]);

            const yScale = d3.scaleLinear()
                .domain([maxValue, 0])
                .range([0, chartHeight])

            const xAxis = d3.axisBottom(xScale)
                .tickValues(Year.filter((d, i) => !((Year.length - 1 - i) % 1)))
                .tickFormat(d3.format("1000"));

            const formatValue = d3.format("~s");

            const yAxis = d3.axisLeft(yScale);

            const chart = node
                .append('g')
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            for (let i = 0; i < variables.length; i++) {

                const linedata = d3.line()
                    .x((d, i) => xScale(Year[i]))
                    .y(d => yScale(d[variables[i]]));


                chart.append("path")
                    .data([this.props.data])
                    .attr("class", "line " + country + " " + i)
                    .style("stroke", colours[i])
                    .style("stroke-width", "4px")
                    .style("fill", "none")
                    .attr("d", linedata);

                chart.append("text")
                    .attr("transform", "translate(" + (chartWidth + 5) + "," + (yScale(this.props.data[this.props.data.length - 1][variables[i]] ) + 3) + ")")
                    .style("font-size", fontSize)
                    .style("font-family", fontFamily)
                    .attr("text-anchor", "start")
                    .style("fill", "white")
                    .text(labels[i]);
            }

            chart.append('g')
                .attr("class", "x-axis " + country)
                .style("color", "white")
                .style("font-size", fontSize)
                .style("font-family", fontFamily)
                .attr("transform", "translate(0," + (chartHeight) + ")")
                .call(xAxis);

             chart.append('g')
                .attr("class", "y-axis " + country)
                .style("color", "white")
                .style("font-size", fontSize)
                .style("font-family", fontFamily)
                .call(yAxis);

            chart.append("text")
                .attr("x", (chartWidth / 2))
                .attr("y", (chartHeight + margin.bottom * 0.75))
                .style("fill", "white")
                .style("font-size", fontSize)
                .style("font-family", fontFamily)
                .text(xLabel)

            chart.append("text")
                .attr("y", 0 - (margin.left * 0.65))
                .attr("x", 0 - ((chartHeight+ margin.top + margin.bottom)/ 2))
                .attr("transform", "rotate(-90)")
                .style("fill", "white")
                .style("font-size", fontSize)
                .style("font-family", fontFamily)
                .text(yLabel)
        }
        
    
    }

  render() {
    return (
        
        <React.Fragment>
            <h3>Dutch import and export in Services - {this.props.title} <button className="remove-chart" id={this.props.title} onClick={this.props.remove.bind(this, {title:this.props.title, code: this.props.code})} style={removeStyle}>X</button></h3>
            <svg ref={node => this.node = node}
                width={this.props.width} height={this.props.height}>
            </svg>
        </React.Fragment>
       
    )
  }
}

const removeStyle = {
    backgroundColor: "#282C34",
    fontSize: "1.5rem",
    border: 'none',
    padding: '5px 9px',
    cursor: 'pointer',
    float: 'right'
}

export default DrawChart



