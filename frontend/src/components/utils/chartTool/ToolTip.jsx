import * as d3 from "d3";

export default (config) => {
  const {
    margin,
    width,
    height,
    data,
    svgRef,
    tooltipRef,
    xScale,
    yScale,
  } = config;

  const svg = d3.select(svgRef.current).select("g");
  const tooltip = d3.select(tooltipRef.current);

  const focus = svg
    .append("g")
    .attr("class", "focus")
    .append("circle")
    .attr("r", 5)
    .style("color", "#25272A")
    .style("opacity", 0);

  svg
    .append("rect")
    .attr("class", "overlay")
    .attr("width", width)
    .attr("height", height)
    .style("opacity", 0)
    .on("mouseover", () => {
      focus.style("opacity", 1);
      tooltip.transition().duration(300).style("opacity", 1);
    })
    .on("mouseout", () => {
      focus.style("opacity", 0);
      tooltip.style("opacity", 0);
    })
    .on("mousemove", mousemove);

  function mousemove() {
    const bisect = d3.bisector((d) => d.index).left;
    const xPos = d3.mouse(this)[0];
    const invertedPoint = xScale.invert(xPos);
    const x0 = bisect(data, invertedPoint);
    const d0 = data[x0];

    focus.style("opacity", 1);

    focus.attr(
      "transform",
      `translate(${xScale(d0.index)},${yScale(d0.value)})`
    );

    tooltip.transition().duration(100).style("opacity", 0.9);

    tooltip
      .html(d0.tooltipContent)
      .style("transform", "translate(-50%,-100%)")
      .style("left", `${xScale(d0.index) + margin.left}px`)
      .style("top", `${yScale(d0.value) + margin.top - 10}px`);
  }
};
