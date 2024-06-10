import { useContext, useState } from "react";

import { MapContext, PlacesContext, UiContext } from "../contexts";

export const SearchResults = () => {
  const { isResultsBoxVisible, handleResultsBoxVisibility } = useContext(UiContext);
  const { map, getDirections } = useContext(MapContext);
  const { places, isLoadingPlaces, userLocation } = useContext(PlacesContext);

  const [activePlace, setActivePlace] = useState("");

  const handlePlaceClick = (coords: number[], placeId: string) => {
    handleResultsBoxVisibility(false);

    const [lng, lat] = coords;

    map?.flyTo({ zoom: 14, center: [lng, lat] });

    setActivePlace(placeId);
  };

  const handleDirections = (coords: number[]) => {
    if (!userLocation) return;

    const [lng, lat] = coords;

    getDirections(userLocation, [lng, lat]);
  };

  if (isLoadingPlaces)
    return (
      <div className="pico" style={{ marginTop: 16 }}>
        <article
          aria-busy="true"
          style={{ backgroundColor: "transparent" }}
        ></article>
      </div>
    );

  return (
    <div
      className={`results-container ${!isResultsBoxVisible ? "hidden" : ""}`}
    >
      <ul className="results-list">
        {places.map(({ id, properties, geometry }) => (
          <li
            key={id}
            className={`result-item ${activePlace === id ? "active" : ""}`}
            onClick={() => handlePlaceClick(geometry.coordinates, id)}
          >
            <div>
              <h3>{properties.name}</h3>
              <p>{properties.full_address}</p>
            </div>

            <div>
              <button onClick={() => handleDirections(geometry.coordinates)}>
                <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                  <g stroke-width="0"></g>
                  <g stroke-linecap="round" stroke-linejoin="round"></g>
                  <g>
                    <path d="M502.61 233.32L278.68 9.39c-12.52-12.52-32.83-12.52-45.36 0L9.39 233.32c-12.52 12.53-12.52 32.83 0 45.36l223.93 223.93c12.52 12.53 32.83 12.53 45.36 0l223.93-223.93c12.52-12.53 12.52-32.83 0-45.36zm-100.98 12.56l-84.21 77.73c-5.12 4.73-13.43 1.1-13.43-5.88V264h-96v64c0 4.42-3.58 8-8 8h-32c-4.42 0-8-3.58-8-8v-80c0-17.67 14.33-32 32-32h112v-53.73c0-6.97 8.3-10.61 13.43-5.88l84.21 77.73c3.43 3.17 3.43 8.59 0 11.76z"></path>
                  </g>
                </svg>
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
