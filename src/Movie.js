import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Box from "@mui/material/Box";
import { Stack } from "@mui/material";
import useAuth from "./hooks/useAuth";
import axios from "./api/axios";
import { Button, Dropdown, Icon } from "semantic-ui-react";
import MovieCredit from "./MovieCredit";
import Reviews from "./Reviews";
import "./Movie.css";
import "./style.css";

function Movie() {
  const { auth } = useAuth();
  const params = useParams();
  const [watchlists, setWatchlists] = useState([]);

  const fetchWatchlist = async () => {
    try {
      const watchlists = await axios.get(`/api/watchlist/?id=${auth?.id}`, {
        headers: { "Content-Type": "application/json" },
      });
      setWatchlists([
        ...watchlists.data.map((x) => {
          return { key: x.id, text: x.name, value: x.id };
        }),
      ]);

      // navigate("/");
    } catch (err) {}
  };
  useEffect(() => {
    if (auth?.username) {
      fetchWatchlist();
      console.log(watchlists);
    }
  }, [auth]);
  const handleAddMovie = async (e, { value }) => {
    try {
      const response = await axios.post(
        `/api/watchlist/add`,
        JSON.stringify({
          watchlistId: value,
          movieId: "tt0113845",
        }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
    } catch (err) {}
  };

  function timeConvert(n) {
    var num = n;
    var hours = num / 60;
    var rhours = Math.floor(hours);
    var minutes = (hours - rhours) * 60;
    var rminutes = Math.round(minutes);
    return rhours + "h " + rminutes + "min";
  }
  const movieData = {
    title: "Money Train",
    imdb_id: "tt0113845",
    budget: 60000000,
    genres:
      "[{'id': 28, 'name': 'Action'}, {'id': 35, 'name': 'Comedy'}, {'id': 80, 'name': 'Crime'}]",
    overview:
      "A vengeful New York transit cop decides to steal a trainload of subway fares; his foster brother, a fellow cop, tries to protect him.",
    popularity: 7.337906,
    poster_path: "/jSozzzVOR2kfXgTUuGnbgG2yRFi.jpg",
    release_date: "1995-11-21",
    revenue: 35431113,
    runtime: 103,
    spoken_languages: "[{'iso_639_1': 'en', 'name': 'English'}]",
    vote_average: 5.4,
    vote_count: 224,
    cast: "[{'cast_id': 1, 'character': 'John', 'credit_id': '52fe44509251416c7503059b', 'gender': 2, 'id': 10814, 'name': 'Wesley Snipes', 'order': 0, 'profile_path': '/hQ6EBa6vgu7HoZpzms8Y10VL5Iw.jpg'}, {'cast_id': 3, 'character': 'Charlie', 'credit_id': '52fe44509251416c750305a5', 'gender': 2, 'id': 57755, 'name': 'Woody Harrelson', 'order': 1, 'profile_path': '/1ecdooAHICUhCZKKEKlFtccEmTU.jpg'}, {'cast_id': 4, 'character': 'Grace Santiago', 'credit_id': '52fe44509251416c750305a9', 'gender': 1, 'id': 16866, 'name': 'Jennifer Lopez', 'order': 2, 'profile_path': '/mxBDIyt8u4q5eJcQkGipNYTtlvz.jpg'}, {'cast_id': 5, 'character': 'Donald Patterson', 'credit_id': '52fe44509251416c750305ad', 'gender': 2, 'id': 9287, 'name': 'Robert Blake', 'order': 3, 'profile_path': '/fA9Zg9OprSMxjy54KuH1WDiCMvq.jpg'}, {'cast_id': 17, 'character': 'Torch', 'credit_id': '532ad10fc3a3681fe3001a2b', 'gender': 2, 'id': 2955, 'name': 'Chris Cooper', 'order': 4, 'profile_path': '/ytZY7YofdiAZyiyr4NyiB77lwwQ.jpg'}, {'cast_id': 18, 'character': 'Riley', 'credit_id': '54d677c5c3a3683b890027be', 'gender': 2, 'id': 4887, 'name': 'Joe Grifasi', 'order': 5, 'profile_path': '/cesXbWZaKHeOhsSdfbF9mB9750w.jpg'}, {'cast_id': 19, 'character': 'Mr. Brown', 'credit_id': '54d677d79251416b93002891', 'gender': 2, 'id': 32287, 'name': 'Scott Sowers', 'order': 6, 'profile_path': None}, {'cast_id': 20, 'character': 'Kowalski', 'credit_id': '54d677e99251416b9f00290d', 'gender': 2, 'id': 33658, 'name': 'Skipp Sudduth', 'order': 7, 'profile_path': '/oUECAyIm2D0PZ22K27MArXarwWI.jpg'}, {'cast_id': 21, 'character': 'Woman on Platform', 'credit_id': '54d677ff9251415f75002694', 'gender': 0, 'id': 106791, 'name': 'Aida Turturro', 'order': 8, 'profile_path': '/hvQKy8ZdeWWVBgLbeczkm0kyAgU.jpg'}, {'cast_id': 22, 'character': 'Gambler', 'credit_id': '54d6780e9251415f75002696', 'gender': 2, 'id': 47774, 'name': 'Vincent Pastore', 'order': 9, 'profile_path': '/4SlzY9TtgQKDVu2GIYu3M73MxeP.jpg'}, {'cast_id': 23, 'character': 'Dooley', 'credit_id': '54d67824c3a368439a0027aa', 'gender': 2, 'id': 15029, 'name': 'Enrico Colantoni', 'order': 10, 'profile_path': '/wBk8AhIceVDdnH6CnBaapz8A7aa.jpg'}, {'cast_id': 24, 'character': 'Crash Train Motorman', 'credit_id': '54d678459251415f7500269b', 'gender': 2, 'id': 5502, 'name': 'Bill Nunn', 'order': 11, 'profile_path': '/dcZWC2iGjHasKwdYSwpHcWFQX5a.jpg'}, {'cast_id': 59, 'character': 'Crosswalk Child', 'credit_id': '56dade879251417a4e001cab', 'gender': 1, 'id': 203801, 'name': 'Katie Gill', 'order': 12, 'profile_path': '/e02cb7gv1N68BRe6ohr58SKPeXg.jpg'}, {'cast_id': 60, 'character': 'Guard', 'credit_id': '57265b7ac3a3681c26003f1e', 'gender': 2, 'id': 15372, 'name': 'Jeremy Roberts', 'order': 13, 'profile_path': '/pa0Svikgm2bQI3u6C0r7vg7yRSY.jpg'}, {'cast_id': 61, 'character': 'Decoy Cop', 'credit_id': '593569f0c3a3685a4503487b', 'gender': 2, 'id': 1811956, 'name': 'Joe Bacino', 'order': 14, 'profile_path': '/p1V6C3xcZ9R0U6uEfu3eDwEfKhF.jpg'}]",
  };

  const genres = JSON.parse(
    movieData.genres.replace(/'/g, '"').replace(/"s/g, "'")
  );
  const cast = JSON.parse(
    movieData.cast
      .replace(/'/g, '"')
      .replace(/"s/g, "'")
      .replaceAll("None", '"None"')
  );

  return (
    <div style={{ padding: "2em", paddingTop: 0 }}>
      <div className="movie-section">
        <div className="section-left">
          <img
            style={{ maxWidth: 300 }}
            src={
              `https://image.tmdb.org/t/p/w500/` +
              "/obpPQskaVpSiC9RcJRB6iWDTCXS.jpg"
            }
          />
        </div>
        <div className="section-right">
          <div className="movie-title">
            <Box m={3} style={{ marginLeft: 0 }}>
              <Stack direction="row" justifyContent="space-between">
                <span>{"Heat (2011)"}</span>

                <div>
                  {auth?.username && (
                    <Dropdown
                      button
                      className="icon"
                      labeled
                      icon="bookmark"
                      defaultValue=""
                      options={watchlists}
                      text="Add To Watchlist"
                      onChange={handleAddMovie}
                    />
                  )}

                  {auth?.roles?.includes("Admin") && (
                    <Button
                      style={{ marginLeft: "0.7em" }}
                      color="red"
                      icon
                      labelPosition="left"
                    >
                      <Icon name="delete" />
                      Delete Movie
                    </Button>
                  )}
                </div>
              </Stack>
            </Box>
          </div>
          <div className="movie-rating">
            <span>
              <span style={{ color: "white" }}>IMDB Rating </span>
              <Icon name="star" />
              <span style={{ color: "white" }}> : {7.3}</span>
            </span>
            <span>
              <span style={{ color: "white" }}>Total Votes </span>
              <Icon name="thumbs up" />
              <span style={{ color: "white" }}> : {8503}</span>
            </span>
            <span>
              <span style={{ color: "white" }}>Runtime </span>
              <Icon name="time" />{" "}
              <span style={{ color: "white" }}> : {timeConvert(170)}</span>
            </span>
            <span>
              <span style={{ color: "white" }}>Release Date </span>
              <Icon name="calendar" />
              <span style={{ color: "white" }}> : {2011}</span>
            </span>
          </div>
          <div className="movie-plot">
            {
              "Obsessive master thief, Neil McCauley leads a top-notch crew on various insane heists throughout Los Angeles while a mentally unstable detective, Vincent Hanna pursues him without rest. Each man recognizes and respects the ability and the dedication of the other even though they are aware their cat-and-mouse game may end in violence."
            }
          </div>
          <div className="movie-info">
            <div>
              <span>Generes :</span>
              {genres.map((index) => {
                return (
                  <Button color="teal" size="mini">
                    {index.name}
                  </Button>
                );
              })}
            </div>
            <div>
              <span>Stars :</span>
              <span>{"Tom Hanks, Al Pacino"}</span>
            </div>

            <div>
              <span>Languages :</span>
              <span>English</span>
            </div>
            <div>
              <span>Budget :</span>
              <span>
                {(60000000).toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                })}
              </span>
            </div>
            <div>
              <span>Revenues :</span>
              <span>
                {(187436818).toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                })}
              </span>
            </div>
          </div>
        </div>
      </div>
      <MovieCredit id={949} />
      <Reviews />

      {/* {genres.map((index) => {
        return (
          <Button color="teal" size="mini">
            {index.name}
          </Button>
        );
      })} */}
    </div>
  );
}
export default Movie;
