export type RouteResult = {
  geometry: GeoJSON.LineString | GeoJSON.MultiLineString | any;
  distance: number;
  duration: number;
};

export type SegmentKey = {
  start: [number, number];
  end: [number, number];
};