import Datamaps from 'datamaps';
import * as d3 from 'd3';

import React from 'react';

interface Props {
  arc: any[];
  arcOptions: object;
  bubbleOptions: object;
  bubbles: any[];
  pinOptions: object;
  pins: any[];
  data: object;
  graticule: boolean;
  height: any;
  labels: boolean;
  responsive: boolean;
  style: object;
  updateChoroplethOptions: object;
  width: any;
}

export default class Datamap extends React.Component<Props> {


  constructor(props: Props) {
    super(props);
    this.resizeMap = this.resizeMap.bind(this);
  }

  componentDidMount() {
    if (this.props.responsive) {
      window.addEventListener('resize', this.resizeMap);
    }
    this.drawMap();
  }

  UNSAFE_componentWillReceiveProps() {
    this.clear();
  }

  componentDidUpdate() {
    this.drawMap();
  }

  componentWillUnmount() {
    this.clear();
    if (this.props.responsive) {
      window.removeEventListener('resize', this.resizeMap);
    }
  }

  clear() {
    const { container } = this.refs;

    for (const child of Array.from(container.childNodes)) {
      container.removeChild(child);
    }

    delete this.map;
  }

  drawMap() {
    const {
      arc,
      arcOptions,
      bubbles,
      bubbleOptions,
      pins,
      pinOptions,
      data,
      graticule,
      labels,
      updateChoroplethOptions,
      ...props
    } = this.props;

    let map = this.map;

    if (!map) {
      map = this.map = new Datamaps({
        ...props,
        data,
        element: this.refs.container
      });
      map.addPlugin('pins', (layer, data, options) => {

        if (!data || (data && !data.slice)) {
          throw "Datamaps Error - bubbles must be an array";
        }

        const pins = layer.selectAll('image.datamaps-pins').data(data, JSON.stringify);

        const svgPins = pins.enter().append('g');

        svgPins.append('svg')
          .attr('x', (datum) => {
            let latLng;
            if (datumHasCoords(datum)) {
              latLng = map.latLngToXY(datum.latitude, datum.longitude);
            }
            if (latLng) return latLng[0] - 8;
          })
          .attr('y', (datum) => {
            let latLng;
            if (datumHasCoords(datum)) {
              latLng = map.latLngToXY(datum.latitude, datum.longitude);
            }
            if (latLng) return latLng[1] - 72;
          })
          .attr('class', 'coin')
          .attr('viewBox', '0 -48 16 128')
          .attr('height', '128px')
          .attr('width', '16px')

        d3.selectAll('.coin').append('g')
          .attr('class', 'group1')

        d3.selectAll('.group1').append('circle')
          .attr('fill', '#F0EC74')
          .attr('class', 'coinCircle')
          .attr('cx', 8)
          .attr('cy', 8)
          .attr('r', 8);

        d3.selectAll('.group1').append('path')
          .attr('class', 'nLetter')
          .attr('fill', '#24272A')
          .attr('fill-rule', 'nonzero')
          .attr('d', 'M5.33333193,5.84218471 L10.1911107,11.6710748 C10.3637224,11.8783688 10.6191403,11.9987569 10.8888887,11.9999746 L11.082222,11.9999746 C11.3252223,12.0011463 11.5586757,11.9054426 11.7309214,11.734031 C11.9031671,11.5626194 11.9999978,11.3296334 11.9999978,11.0866303 L11.9999978,4.91329562 C11.9999978,4.74221782 11.9506022,4.57477865 11.8577777,4.4310733 C11.8202587,4.37295822 11.7762743,4.31928237 11.7266666,4.27107327 L11.6955555,4.24662882 C11.6549822,4.20842407 11.6102592,4.17488182 11.5622221,4.1466288 L11.5044443,4.11551768 C11.4597805,4.09172407 11.412889,4.07237202 11.3644443,4.05773989 L11.3044443,4.03996211 C11.2319672,4.02058032 11.1572456,4.01086652 11.082222,4.01107321 C11.0133643,4.01139297 10.9447696,4.01959451 10.8777775,4.03551766 C10.8555553,4.03551766 10.8377775,4.048851 10.8155553,4.05551767 C10.7706872,4.0685023 10.7268598,4.08484474 10.6844442,4.10440656 L10.6666664,4.10440656 C10.5628221,4.15557295 10.4699724,4.22653124 10.393333,4.3132955 L8.83777711,6.82662936 L10.6666664,5.81329581 L10.6666664,10.1577412 L5.80888759,4.32885106 C5.63627589,4.12155703 5.38085798,4.00116897 5.11110967,3.99995127 L4.91777629,3.99995127 C4.67477604,3.9987796 4.44132267,4.09448326 4.26907695,4.26589485 C4.09683123,4.43730645 3.99999784,4.67029249 3.99999784,4.91329562 L3.99999784,11.0866303 C3.99983852,11.2422274 4.03962705,11.3952602 4.1155539,11.5310748 C4.1155539,11.5488526 4.13555391,11.5644081 4.14666502,11.5821859 L4.16666502,11.6155193 C4.19681871,11.6567409 4.22947263,11.696074 4.26444282,11.7332971 L4.28666505,11.7532971 C4.31795555,11.7830987 4.35137751,11.810579 4.38666507,11.8355193 L4.41999841,11.8577415 C4.46343511,11.8872215 4.50956717,11.9125197 4.55777622,11.9332971 L4.57333178,11.9332971 C4.61816719,11.9507106 4.66421591,11.9648223 4.71110958,11.9755193 L4.75333181,11.9755193 C4.80687883,11.9852096 4.86114133,11.9904129 4.91555407,11.9910749 C4.98513652,11.9906194 5.05445212,11.9824208 5.12222078,11.9666304 C5.14222078,11.9666304 5.16222079,11.9510749 5.18222079,11.9444082 C5.22824499,11.9327947 5.27293149,11.9164097 5.31555415,11.8955193 L5.33333193,11.8955193 C5.43835559,11.8404216 5.53129142,11.764864 5.60666533,11.673297 L7.36888792,9.22885208 L5.33333193,10.1177412 L5.33333193,5.84218471 Z')

        d3.selectAll('.nLetter')
          .attr('stroke', '#24272A')
          .attr('strokeWidth', 0)

        d3.selectAll('.coin').append('ellipse')
          .attr('class', 'lake')
          .attr('stroke', '#F0EC74')
          .attr('strokeWidth', 1)
          .attr('fill', 'none')
          .attr('cx', 8)
          .attr('cy', 16)
          .attr('rx', 0)
          .attr('ry', 0)
          .attr('opacity', 1)

        d3.selectAll('.coin').append('line')
          .attr('class', 'leftLine')
          .attr('x1', 6)
          .attr('y1', 14)
          .attr('x2', 6)
          .attr('y2', 0)
          .attr('stroke', '#F0EC74')
          .attr('strokeLinecap', 'round')
          .attr('strokeWidth', 3)

        d3.selectAll('.coin').append('line')
          .attr('class', 'rightLine')
          .attr('x1', 11)
          .attr('y1', 10)
          .attr('x2', 11)
          .attr('y2', -4)
          .attr('stroke', '#F0EC74')
          .attr('strokeLinecap', 'round')
          .attr('strokeWidth', 3)

        pins.exit()
          .remove();

        function datumHasCoords(datum) {
          return typeof datum !== 'undefined' && typeof datum.latitude !== 'undefined' && typeof datum.longitude !== 'undefined';
        }

      });
    } else {
      map.updateChoropleth(data, updateChoroplethOptions);
    }

    if (arc) {
      map.arc(arc, arcOptions);
    }

    if (bubbles) {
      map.bubbles(bubbles, bubbleOptions);
    }

    if (pins) {
      map.pins(pins, pinOptions);
    }

    if (graticule) {
      map.graticule();
    }

    if (labels) {
      map.labels();
    }

    d3.selectAll('.group1')
      .transition()
      .delay(0)
      .duration(2000)
      .attr('transform', 'translate(0, -40)')

    d3.selectAll('.lake')
      .transition()
      .delay(0)
      .duration(1600)
      .attr('rx', 8)
      .attr('ry', 4)
      .attr('opacity', 0)
      .attr('strokeWidth', 2)  

  }

    resizeMap() {
      this.map.resize();
    }

  render() {
    const style = {
      ...this.props.style,
    };

    return <div ref="container" style = { style } />;
  }

}
