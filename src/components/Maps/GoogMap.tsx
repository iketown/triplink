import React, { useCallback, useRef, useEffect, useState } from "react";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  useGoogleMap,
  GoogleMapProps,
  LoadScript
} from "@react-google-maps/api";
import { CircularProgress } from "@material-ui/core";
import FlexMarker from "./FlexMarker";
import FlexPolyline from "./FlexPolyline";
// docs -> https://react-google-maps-api-docs.netlify.com/

const vegas = { lat: 36.1688268, lng: -115.15180859999998 };
const minn = { lat: 44.632468, lng: -92.649891 };

const GoogMap = ({
  markerLocs = [],
  boundsPoints = [],
  polyLines
}: {
  boundsPoints?: { lat: number; lng: number }[];
  markerLocs?: { lat: number; lng: number }[];
  polyLines?: { lat: number; lng: number }[][];
}) => {
  return (
    <GoogMapContainer points={[...markerLocs, ...boundsPoints]}>
      {markerLocs &&
        markerLocs
          // remove duplicates
          .filter(
            (loc, index, arr) =>
              arr.findIndex(
                _loc => _loc.lat === loc.lat && _loc.lng === _loc.lng
              ) === index
          )
          .map(loc => {
            return <FlexMarker position={loc} key={`${loc.lat}${loc.lng}`} />;
          })}

      {polyLines &&
        polyLines.map(path => {
          return <FlexPolyline path={path} />;
        })}
    </GoogMapContainer>
  );
};

const GoogMapContainer = ({
  children,
  points
}: {
  children?: any;
  points: { lat: number; lng: number }[];
}) => {
  // const { isLoaded, loadError } = useLoadScript({
  //   googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAP_API_KEY
  // });
  const mapRef = useRef<google.maps.Map>();
  const [zoom, setZoom] = useState(7);
  const options = {
    zoomControlOptions: {
      // ...otherOptopns
    }
  };
  const updateBounds = (map: google.maps.Map) => {
    const bounds = new google.maps.LatLngBounds();
    if (points.length > 1) {
      points.forEach(point => {
        bounds.extend(point);
      });
      map.fitBounds(bounds);
    }
    if (points.length <= 1) {
      setZoom(7);
    }
  };
  const onLoad = (map: google.maps.Map) => {
    // do something with mapinstance
    mapRef.current = map;
    updateBounds(map);
  };
  useEffect(() => {
    if (mapRef.current) {
      updateBounds(mapRef.current);
    }
  }, [points, mapRef]);
  const renderMap = () => {
    // wrapping to a function is useful in case you want to access `window.google`
    // to eg. setup options or create latLng object, it won't be available otherwise
    // feel free to render directly if you don't need that

    return (
      <GoogleMap
        mapContainerStyle={{
          width: "100%",
          minHeight: "200px",
          height: "100%"
        }}
        id="example-map"
        options={options}
        onLoad={onLoad}
        center={points[0]}
        zoom={zoom}
      >
        {children}
      </GoogleMap>
    );
  };
  // if (loadError) return <div>error loading map</div>;
  return true ? renderMap() : <CircularProgress />;
};

export default GoogMap;
