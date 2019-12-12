import React, { memo, useCallback, useRef, useEffect, useState } from "react";
import { isEqual } from "lodash";
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
import { GeneralEvent } from "../Events/event.types";
// docs -> https://react-google-maps-api-docs.netlify.com/

const GoogMap = ({
  markerLocs = [],
  gigs = [],
  boundsPoints = [],
  polyLines,
  flights,
  initialZoom
}: {
  boundsPoints?: { lat: number; lng: number }[];
  markerLocs?: { lat: number; lng: number }[];
  gigs?: GeneralEvent[];
  flights?: GeneralEvent[];
  polyLines?: any[];
  initialZoom?: number;
}) => {
  console.log("rendering map");
  return (
    <GoogMapContainer
      points={[...markerLocs, ...boundsPoints]}
      initialZoom={initialZoom}
    >
      {gigs &&
        gigs.map(gig => {
          return (
            <FlexMarker
              event={gig}
              loc={gig.startLoc}
              position={gig.startLoc}
              key={gig.id}
            />
          );
        })}
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
            return (
              <FlexMarker
                loc={loc}
                position={loc}
                key={`${loc.lat}${loc.lng}`}
              />
            );
          })}

      {polyLines &&
        polyLines.map(path => {
          return (
            <FlexPolyline
              key={JSON.stringify(path)}
              eventId={path.eventId}
              path={path}
            />
          );
        })}
      {flights &&
        flights.map(flight => {
          return (
            flight.startLoc &&
            flight.endLoc &&
            flight.id && (
              <FlexPolyline
                key={flight.id}
                eventId={flight.id}
                path={[flight.startLoc, flight.endLoc]}
              />
            )
          );
        })}
    </GoogMapContainer>
  );
};

const GoogMapContainer = ({
  children,
  points,
  initialZoom
}: {
  children?: any;
  points: { lat: number; lng: number }[];
  initialZoom?: number;
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
      setZoom(initialZoom || 7);
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
          minHeight: "275px",
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

const propsEqual = (prev: any, next: any) => {
  const yesEqual = isEqual(prev, next);
  return yesEqual;
};
export default memo(GoogMap, propsEqual);
