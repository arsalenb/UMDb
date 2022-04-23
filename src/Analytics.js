import React, { useEffect, useState } from "react";
import { Divider, Avatar, Paper, Grid, Stack, Box } from "@mui/material";
import { Header, Icon, Button, Form, Input, Select } from "semantic-ui-react";
import { useNavigate, Link } from "react-router-dom";
import useAuth from "./hooks/useAuth";
import axios from "./api/axios";

function Analytics() {
  const { auth } = useAuth();
  const navigate = useNavigate();

  const options = [
    { key: "Comedy", text: "Comedy", value: "Comedy" },
    { key: "Adventure", text: "Adventure", value: "Adventure" },
    { key: "Animation", text: "Animation", value: "Animation" },
    { key: "Crime", text: "Crime", value: "Crime" },
    { key: "Documentary", text: "Documentary", value: "Documentary" },
    { key: "Drama", text: "Drama", value: "Drama" },
    { key: "Family", text: "Family", value: "Family" },
    { key: "Fantasy", text: "Fantasy", value: "Fantasy" },
    { key: "History", text: "History", value: "History" },
    { key: "Horror", text: "Horror", value: "Horror" },
    { key: "Romance", text: "Romance", value: "Romance" },
    { key: "Science Fiction", text: "Sci-Fi", value: "Science Fiction" },
    { key: "Thriller", text: "Thriller", value: "Thriller" },
    { key: "TV Movie", text: "TV Movie", value: "TV Movie" },
    { key: "War", text: "War", value: "War" },
    { key: "War", text: "War", value: "War" },
    { key: "Western", text: "Western", value: "Western" },
  ];
  const [mostActive, setMostActive] = useState([]);
  const [mostFollowed, setMostFollowed] = useState([]);
  const [numReviews, setNumReviews] = useState([]);
  const [mostPopGenres, setMostPopGenres] = useState([]);
  const [mostPopMovie, setMostPopMovies] = useState([]);
  const [mostRatedMovies, setMostRatedMovies] = useState([]);
  const [genreMostPop, setGenreMostPop] = useState("Family");
  const [genreMostPop_2, setGenreMostPop_2] = useState("Comedy");
  const [year, setYear] = useState(2010);

  const fetchmostRatedMovies = async () => {
    try {
      const results = await axios.get(
        `/api/movie/topyg?page=1&year=${year}&genre=${genreMostPop_2}`,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      setMostRatedMovies([...results.data.movies]);
    } catch (err) {}
  };
  const fetchmostPopMovie = async () => {
    try {
      const results = await axios.get(
        `/api/movie/popg?page=1&genre=${genreMostPop}`,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      setMostPopMovies([...results.data.movies]);
    } catch (err) {}
  };
  const fetchmostPopGenres = async () => {
    try {
      const results = await axios.get(`/api/movie/popg/y`, {
        headers: { "Content-Type": "application/json" },
      });
      setMostPopGenres([...results.data.Result]);
    } catch (err) {}
  };
  const fetchNumReviews = async () => {
    try {
      const results = await axios.get(`/api/review/totalrev/year`, {
        headers: { "Content-Type": "application/json" },
      });
      setNumReviews([...results.data.reviews]);
    } catch (err) {}
  };
  const fetchMostActive = async () => {
    try {
      const results = await axios.get(`/api/user/mostactive`, {
        headers: { "Content-Type": "application/json" },
      });
      setMostActive([...results.data]);
    } catch (err) {}
  };
  const fetchMostFollowed = async () => {
    try {
      const results = await axios.get(`/api/watchlist/mostfollowed`, {
        headers: { "Content-Type": "application/json" },
      });
      setMostFollowed([...results.data]);
    } catch (err) {}
  };
  useEffect(() => {
    fetchmostRatedMovies();
  }, [genreMostPop_2]);
  useEffect(() => {
    fetchmostPopMovie();
  }, [genreMostPop]);
  useEffect(() => {
    fetchMostActive();
    fetchMostFollowed();
    fetchNumReviews();
    fetchmostPopGenres();
  }, []);
  return (
    <div style={{ padding: "2em" }}>
      <Grid container style={{ color: "white" }}>
        <Grid xs item style={{ textAlign: "center" }}>
          <Header
            inverted
            as="h3"
            dividing
            style={{ color: "#e6b91e", fontSize: "1.75em" }}
          >
            Top 10 Active Users In The Plateform
          </Header>
          <ol>
            {mostActive.map((e) => {
              return (
                <>
                  <li
                    style={{
                      fontSize: "1.5em",
                      marginBottom: "1em",
                    }}
                  >
                    <Link to={`/user/${e?.user_id}`} style={{ color: "white" }}>
                      {e?.username}
                    </Link>{" "}
                  </li>
                </>
              );
            })}
          </ol>
          <Divider className="ReviewDivider" variant="fullWidth" />{" "}
          <Header
            inverted
            as="h3"
            dividing
            style={{ color: "#e6b91e", fontSize: "1.75em", marginTop: "2em" }}
          >
            Total Number of Reviews Per Year
          </Header>
          <ul>
            {numReviews.slice(0, 10).map((e) => {
              return (
                <>
                  <li
                    style={{
                      listStyle: "none",
                      fontSize: "1.5em",
                      marginBottom: "1em",
                    }}
                  >
                    {e.review_per_year} reviews(s) in {e._id}
                  </li>
                </>
              );
            })}
          </ul>
          <Divider className="ReviewDivider" variant="fullWidth" />{" "}
          <Header
            inverted
            as="h3"
            dividing
            style={{ color: "#e6b91e", fontSize: "1.75em", marginTop: "2em" }}
          >
            Top 10 Popular Movies Per Genre
          </Header>
          <Form.Group>
            <Form.Select
              placeholder="Genres"
              options={options}
              defaultValue={"Family"}
              onChange={(e, { value }) => {
                setGenreMostPop(value);
              }}
              style={{ marginLeft: "3em" }}
            />
          </Form.Group>
          <ul>
            {mostPopMovie.slice(0, 10).map((e) => {
              return (
                <>
                  <ol
                    style={{
                      fontSize: "1.5em",
                      marginBottom: "1em",
                    }}
                  >
                    <Link to={`/movie/${e?._id}`} style={{ color: "white" }}>
                      {" "}
                      {e.title}{" "}
                    </Link>
                  </ol>
                </>
              );
            })}
          </ul>
          <Divider className="ReviewDivider" variant="fullWidth" />{" "}
        </Grid>
        <Divider
          orientation="vertical"
          flexItem
          style={{ backgroundColor: "white", height: "90vh", margin: "0 4em" }}
        />

        <Grid item xs style={{ textAlign: "center" }}>
          <Header
            inverted
            as="h3"
            dividing
            style={{ color: "#e6b91e", fontSize: "1.75em" }}
          >
            Most Followed Watchlists
          </Header>
          <ul>
            {mostFollowed.map((e) => {
              return (
                <>
                  <ol
                    style={{
                      fontSize: "1.5em",
                      marginBottom: "1em",
                    }}
                  >
                    <Link to={`/watchlist/${e?.id}`} style={{ color: "white" }}>
                      {e?.name}
                    </Link>{" "}
                    <span
                      style={{
                        listStyle: "none",
                        color: "grey",
                      }}
                    >
                      Followers : {e.numFollowers}
                    </span>
                  </ol>
                </>
              );
            })}
          </ul>
          <Divider className="ReviewDivider" variant="fullWidth" />
          <Header
            inverted
            as="h3"
            dividing
            style={{ color: "#e6b91e", fontSize: "1.75em", marginTop: "2em" }}
          >
            Most Popular Genres Per Year
          </Header>
          <ul>
            {mostPopGenres.slice(0, 10).map((e) => {
              return (
                <>
                  <li
                    style={{
                      listStyle: "none",
                      fontSize: "1.5em",
                      marginBottom: "1em",
                    }}
                  >
                    {e.Most_Popular_Genre} in {e.Year}
                  </li>
                </>
              );
            })}
          </ul>
          <Divider className="ReviewDivider" variant="fullWidth" />
          <Header
            inverted
            as="h3"
            dividing
            style={{ color: "#e6b91e", fontSize: "1.75em", marginTop: "2em" }}
          >
            Highest Voted Movies Per Year And Genre
          </Header>
          <Input
            placeholder="Year"
            width={2}
            onChange={(e, { value }) => {
              setYear(value);
            }}
            type="number"
          />
          <Select
            placeholder="Genres"
            options={options}
            defaultValue={"Comedy"}
            onChange={(e, { value }) => {
              setGenreMostPop_2(value);
            }}
            style={{ marginLeft: "3em" }}
            width={4}
          />
          <ul>
            {mostRatedMovies.slice(1, 11).map((e) => {
              return (
                <>
                  <ol
                    style={{
                      fontSize: "1.5em",
                      marginBottom: "1em",
                    }}
                  >
                    <Link to={`/movie/${e?._id}`} style={{ color: "white" }}>
                      {" "}
                      {e.title}{" "}
                    </Link>
                  </ol>
                </>
              );
            })}
          </ul>
          <Divider className="ReviewDivider" variant="fullWidth" />{" "}
        </Grid>
      </Grid>
    </div>
  );
}
export default Analytics;
