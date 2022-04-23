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
  const { id } = useParams();
  const [watchlists, setWatchlists] = useState([]);
  const [movieData, setMovieData] = useState({});
  const [reviewData, setReviewData] = useState([]);
  const [fullReviews, setFullReviews] = useState(false);
  const [moreLoading, setMoreLoading] = useState(false);

  useEffect(() => {
    if (auth?.username) {
      fetchWatchlist();
      console.log(watchlists);
    }
    fetchMovieData(id);
  }, [auth]);

  const loadMoreReviews = async () => {
    setMoreLoading(true);
    try {
      const response = await axios.get(`/api/review/more/${id}`, {
        headers: { "Content-Type": "application/json" },
      });
      setReviewData([...reviewData, ...response.data.reviews]);
      setFullReviews(true);
      // navigate("/");
      setMoreLoading(false);
    } catch (err) {
      setMoreLoading(false);
    }
  };
  const fetchMovieData = async (id) => {
    try {
      const response = await axios.get(`/api/movie/${id}`, {
        headers: { "Content-Type": "application/json" },
      });
      setMovieData({ ...response.data.movie });
      setReviewData([...response.data.movie.reviews]);

      // navigate("/");
    } catch (err) {}
  };

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

  const handleAddMovie = async (e, { value }) => {
    const headers = {
      Authorization: "Bearer " + auth?.accessToken,
      "Content-Type": "application/json",
    };
    try {
      const response = await axios.post(
        `/api/watchlist/add`,
        JSON.stringify({
          watchlistId: value,
          movieId: id,
        }),
        {
          headers,
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

  return (
    <div style={{ padding: "2em", paddingTop: 0 }}>
      <div className="movie-section">
        <div className="section-left">
          <img
            style={{ maxWidth: 300 }}
            src={`https://image.tmdb.org/t/p/w500/` + movieData.poster_path}
          />
        </div>
        <div className="section-right">
          <div className="movie-title">
            <Box m={3} style={{ marginLeft: 0 }}>
              <Stack direction="row" justifyContent="space-between">
                <span>{movieData?.title}</span>

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
                </div>
              </Stack>
            </Box>
          </div>
          <div className="movie-rating">
            <span>
              <span style={{ color: "white" }}>IMDB Rating </span>
              <Icon name="star" />
              <span style={{ color: "white" }}>
                {" "}
                : {movieData?.vote_average}
              </span>
            </span>
            <span>
              <span style={{ color: "white" }}>Total Votes </span>
              <Icon name="thumbs up" />
              <span style={{ color: "white" }}> : {movieData?.vote_count}</span>
            </span>
            <span>
              <span style={{ color: "white" }}>Runtime </span>
              <Icon name="time" />{" "}
              <span style={{ color: "white" }}>
                {" "}
                : {timeConvert(movieData?.runtime)}
              </span>
            </span>
            <span>
              <span style={{ color: "white" }}>Release Date </span>
              <Icon name="calendar" />
              <span style={{ color: "white" }}>
                {" "}
                : {new Date(movieData?.release_date).toLocaleDateString()}
              </span>
            </span>
          </div>
          <div className="movie-plot">{movieData?.overview}</div>
          <div className="movie-info">
            <div>
              <span>Generes :</span>
              {movieData?.genres?.map((index) => {
                return (
                  <Button color="teal" size="mini">
                    {index}
                  </Button>
                );
              })}
            </div>
            <div>
              <span>Stars :</span>
              {movieData?.cast ? movieData.cast[0].name : <></>}
              {", "}
              {movieData?.cast ? movieData.cast[1].name : <></>}
              {", "}
              {movieData?.cast ? movieData.cast[2].name : <></>}
            </div>

            <div>
              <span>Languages :</span>
              {movieData?.spoken_languages?.map((index) => {
                return <span>{index} </span>;
              })}
            </div>
            <div>
              <span>Budget :</span>
              <span>
                {movieData?.budget?.toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                })}
              </span>
            </div>
            <div>
              <span>Revenues :</span>
              <span>
                {movieData?.revenue?.toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                })}
              </span>
            </div>
          </div>
        </div>
      </div>
      <MovieCredit cast={movieData?.cast} />
      <Reviews
        movie={{ id, title: movieData?.title }}
        reviews={reviewData}
        refetch={fetchMovieData}
      />
      {!fullReviews ? (
        <Button
          style={{
            marginLeft: "1em",
            backgroundColor: "#e6b91e",
          }}
          onClick={loadMoreReviews}
          loading={moreLoading}
        >
          Load More
        </Button>
      ) : (
        <></>
      )}
    </div>
  );
}
export default Movie;
