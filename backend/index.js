const express = require("express");
const client = require("./elasticsearch/client");
require("time-stamp");
const cors = require("cors");
const data_router = require("./data_management/retrieve_and_ingest_data.js");

const app = express();
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/data", data_router);

app.get("/results", (req, res) => {
  const passedType = req.query.type;
  const passedMag = req.query.mag;
  const passedLocation = req.query.location;
  const passedDateRange = req.query.dateRange;
  const passedSortOption = req.query.sortOption;

  async function sendESRequest() {
    try {
      const { body } = await client.search({
        index: "earthquakes",
        body: {
          sort: [
            {
              mag: {
                order: passedSortOption,
              },
            },
          ],
          size: 300,
          query: {
            bool: {
              filter: [
                {
                  term: { type: passedType },
                },
                {
                  range: {
                    mag: {
                      gte: passedMag,
                    },
                  },
                },
                {
                  match: { place: passedLocation },
                },
                {
                  range: {
                    "@timestamp": {
                      gte: `now-${passedDateRange}d/d`,
                      lt: "now/d",
                    },
                  },
                },
              ],
            },
          },
        },
      });
      res.json(body.hits.hits);
    } catch (error) {
      console.log(error);
    }
  }
  sendESRequest();
});

app.listen(4000, () => {
  console.log("Server running on port 400");
});
