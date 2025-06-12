/**
 *
 *  This module will display a map with a symbol encoding for a set of geographical elements
 */

import * as d3 from 'd3';

export default function MapWithLayers() {
  let projection = null;  // теперь проекция может быть задана извне
  let scale = 700; // default value for scale
  let center = [-10, 60]; // default value for centering the map
  let path;

  function me(selection) {
    console.log('MapWithLayers', selection.datum());

    const boundaries = selection.node().getBoundingClientRect();
    console.log('dimensions', boundaries);

    // Если проекция не задана, создаём её с дефолтными параметрами
    if (!projection) {
      projection = d3.geoMercator()
        .scale(scale)
        .center(center)
        .translate([boundaries.width / 2, boundaries.height / 2]);
    } else {
      // Если проекция задана, убедимся, что у неё правильный translate
      projection.translate([boundaries.width / 2, boundaries.height / 2]);
    }

    path = d3.geoPath().projection(projection);

    const paths = selection.selectAll('path')
      .data(selection.datum().features);

    paths.exit().remove();

    paths.enter()
      .append('path')
      .attr('fill', '#69b3a2')
      .attr('stroke', '#333')
      .attr('stroke-width', 0.5);

    selection.selectAll('path')
      .attr('d', path)
      .attr('fill', '#ccc')
      .attr('stroke', '#333');
  }

  // setter/getter для проекции
  me.setProjection = function(p) {
    if (!arguments.length) return projection;
    projection = p;
    return me;
  };

  // getter/setter для scale (если нужно менять отдельно)
  me.scale = function (_) {
    if (!arguments.length) return scale;
    scale = _;
    if (projection) projection.scale(scale);
    return me;
  };

  // getter/setter для center (если нужно менять отдельно)
  me.center = function (_) {
    if (!arguments.length) return center;
    center = _;
    if (projection) projection.center(center);
    return me;
  };

  return me;
}
