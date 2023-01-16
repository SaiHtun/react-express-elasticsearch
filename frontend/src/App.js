import React, { useState } from "react";
import axios from "axios";

const App = () => {
  const [chosenType, setChosenType] = useState("");
  const [chosenMag, setChosenMag] = useState("");
  const [chosenLocation, setChosenLocation] = useState("");
  const [chosenDateRange, setChosenDateRange] = useState("");
  const [chosenSortOption, setchosenSortOption] = useState("");
  const [documents, setDocuments] = useState("");

  const sendSearchRequest = () => {
    const results = {
      method: "GET",
      url: "http://localhost:4000/results",
      params: {
        type: chosenType,
        mag: chosenMag,
        location: chosenLocation,
        dateRange: chosenDateRange,
        sortOption: chosenSortOption,
      },
    };
    axios
      .request(results)
      .then((response) => {
        console.log(response.data);
        setDocuments(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <>
      <div className="">
        <nav>
          <ul className="">
            <li className="text-red-800 text-3xl">Earthquake Watch</li>
          </ul>
        </nav>
        <p className="">
          {" "}
          Search for earthquakes using the following criteria:
        </p>
        <div className="">
          <div className="">
            <ul>
              <li>
                <select
                  name="types"
                  id="types"
                  value={chosenType}
                  onChange={(e) => setChosenType(e.target.value)}
                >
                  <option value={null}>Select a Type</option>
                  <option value="earthquake">Earthquake</option>
                  <option value="quarry blast">Quarry Blast</option>
                  <option value="ice quake">Ice Quake</option>
                  <option value="explosion">Explosion</option>
                </select>
              </li>
              <li>
                <select
                  name="mag"
                  id="mag"
                  value={chosenMag}
                  onChange={(e) => setChosenMag(e.target.value)}
                >
                  <option value={""}>Select magnitude level</option>
                  <option value="2.5">2.5+</option>
                  <option value="5.5">5.5+</option>
                  <option value="6.1">6.1+</option>
                  <option value="7">7+</option>
                  <option value="8">8+</option>
                </select>
              </li>
              <li>
                <form>
                  <label>
                    <input
                      className=""
                      type="text"
                      placeholder="Enter city, state, country"
                      value={chosenLocation}
                      onChange={(e) => setChosenLocation(e.target.value)}
                    />
                  </label>
                </form>
              </li>
              <li>
                <select
                  name="dateRange"
                  id="dateRange"
                  value={chosenDateRange}
                  onChange={(e) => setChosenDateRange(e.target.value)}
                >
                  <option value={null}>Select date range</option>
                  <option value="7">Past 7 Days</option>
                  <option value="14">Past 14 Days</option>
                  <option value="21">Past 21 Days</option>
                  <option value="30">Past 30 Days</option>
                </select>
              </li>
              <li>
                <select
                  name="sortOption"
                  id="sortOption"
                  value={chosenSortOption}
                  onChange={(e) => setchosenSortOption(e.target.value)}
                >
                  <option value={null}>Sort by</option>
                  <option value="desc">Largest Magnitude First</option>
                  <option value="asc">Smallest Magnitude First</option>
                </select>
              </li>
              <li>
                <button onClick={sendSearchRequest}>Search</button>
              </li>
            </ul>
          </div>
          {documents && (
            <div className="">
              {documents.length > 0 ? (
                <p> Number of hits: {documents.length}</p>
              ) : (
                <p> No results found. Try broadening your search criteria.</p>
              )}
              <div className="flex bg-slate-400">
                {documents.map((document, index) => (
                  <div key={index} className="">
                    <div className="">
                      <p>Type: {document._source.type}</p>
                      <p>Time: {document._source["@timestamp"]}</p>
                      <p>Location: {document._source.place}</p>
                      <p>Latitude: {document._source.coordinates.lat}</p>
                      <p>Longitude: {document._source.coordinates.lon}</p>
                      <p>Magnitude: {document._source.mag}</p>
                      <p>Depth: {document._source.depth}</p>
                      <p>Significance: {document._source.sig}</p>
                      <p>Event URL: {document._source.url}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default App;
