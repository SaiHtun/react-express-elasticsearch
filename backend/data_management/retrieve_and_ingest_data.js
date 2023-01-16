const express = require("express");
const router = express.Router();
const axios = require("axios");
const client = require("../elasticsearch/client");
require("time-stamp");

const URL = `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson`;

router.get("/retrieve_and_ingest", async (req, res) => {
  console.log("Loading Application...");
  res.json("Running Application...");

  indexData = async () => {
    console.log("Indexing data...");
    try {
      const EARTHQUAKES = await axios.get(URL, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      features = EARTHQUAKES.data.features;

      features.map(
        async (f) => (
          (earthquakeObject = {
            place: f.properties.place,
            time: f.properties.time,
            tz: f.properties.tz,
            url: f.properties.url,
            detail: f.properties.detail,
            felt: f.properties.felt,
            cdi: f.properties.cdi,
            alert: f.properties.alert,
            status: f.properties.status,
            tsunami: f.properties.tsunami,
            sig: f.properties.sig,
            net: f.properties.net,
            code: f.properties.code,
            sources: f.properties.sources,
            nst: f.properties.nst,
            dmin: f.properties.dmin,
            rms: f.properties.rms,
            mag: f.properties.mag,
            magType: f.properties.magType,
            type: f.properties.type,
            longitude: f.geometry.coordinates[0],
            latitude: f.geometry.coordinates[1],
            depth: f.geometry.coordinates[2],
          }),
          await client.index({
            index: "earthquakes",
            id: f.id,
            body: earthquakeObject,
            pipeline: "earthquake_data_pipeline",
          })
        )
      );

      if (EARTHQUAKES.data.length) {
        indexData();
      }

      console.log("Done indexing data.");
    } catch (e) {
      console.log(e);
    }
  };

  indexData();
});

module.exports = router;
