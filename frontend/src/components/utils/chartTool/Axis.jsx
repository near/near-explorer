import * as d3 from "d3";

export default (config) => {
  const { margin, width, height, svgRef, xScale, yScale } = config;

  const svg = d3.select(svgRef.current).select("g");

  svg
    .append("g")
    .style("color", "#9B9B9B")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(xScale));

  svg.append("g").style("color", "#9B9B9B").call(d3.axisLeft(yScale));

  svg
    .append("g")
    .style("color", "#FFFFFF")
    .attr("stroke-width", "2")
    .call(d3.axisLeft(yScale).tickSize(-width).tickFormat(""));
};
