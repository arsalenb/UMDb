import React, { useState, useEffect } from "react";
import { Divider, Stack, Box } from "@mui/material";
import { Button, Icon, Input } from "semantic-ui-react";
import useAuth from "./hooks/useAuth";
import "./watchlist.css";
import { useParams, useNavigate } from "react-router-dom";
import axios from "./api/axios";
function Watchlist() {
  let { id } = useParams();

  const { auth } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState({});
  const [movies, setMovies] = useState([]);
  const fetchData = async (id) => {
    try {
      const response = await axios.get(`/api/watchlist/${id}`, {
        headers: { "Content-Type": "application/json" },
      });
      setData({ ...response.data });

      // navigate("/");
    } catch (err) {}
  };
  useEffect(() => {
    fetchData(id);
    console.log(data);
  }, []);
  const posterBaseUrl = "https://image.tmdb.org/t/p/w300";
  const [edit, setEdit] = useState(false);

  return (
    <div style={{ padding: "0 2em", color: "white" }}>
      <Box m={3} style={{ marginLeft: 0 }}>
        <Stack direction="row" justifyContent="end">
          <div>
            {edit ? (
              <Button
                onClick={() => {
                  setEdit(false);
                }}
                color="teal"
                icon
                labelPosition="left"
                size="medium"
              >
                <Icon name="save outline" />
                Save Changes
              </Button>
            ) : (
              <Button
                onClick={() => {
                  setEdit(true);
                }}
                icon
                color="teal"
                labelPosition="left"
                size="medium"
              >
                <Icon name="edit" />
                Edit Watchlist
              </Button>
            )}
          </div>
          {edit ? (
            <Button color="red" icon labelPosition="left" size="medium">
              <Icon name="delete" />
              Delete Watchlist
            </Button>
          ) : (
            <></>
          )}
        </Stack>
      </Box>

      <Divider variant="fullWidth" />

      <div style={{ fontSize: "1.4em", paddingLeft: "2em" }}>
        {" "}
        <div style={{ marginTop: "1.5em", color: "#e6b91e" }}>
          <Icon name="user" size="small"></Icon>
          <span>Author </span>

          <span style={{ fontSize: "0.85em", fontWeight: 200, color: "white" }}>
            {data?.owner}
          </span>
        </div>
        <div style={{ marginTop: "1.5em", color: "#e6b91e" }}>
          <Icon name=" bookmark" size="small"></Icon>

          <span>Watchlist's Name </span>
          {edit ? (
            <Input
              style={{ fontSize: "0.7em" }}
              icon="edit"
              iconPosition="left"
              size="small"
              placeholder="Watchlist name"
            />
          ) : (
            <span
              style={{ fontSize: "0.85em", fontWeight: 200, color: "white" }}
            >
              {data?.name}
            </span>
          )}
        </div>
        <div style={{ marginTop: "1.5em", color: "#e6b91e" }}>
          <Icon name=" users" size="small"></Icon>
          <span>Number of Followers </span>
          <span style={{ fontSize: "0.85em", fontWeight: 200, color: "white" }}>
            {data?.num_followers}
          </span>
        </div>
        <div style={{ marginTop: "1.5em", color: "#e6b91e" }}>
          <Icon size="small" name=" numbered list"></Icon>
          <span>Number of Movies </span>
          <span style={{ fontSize: "0.85em", fontWeight: 200, color: "white" }}>
            {data?.movies?.length}
          </span>
        </div>
        <div style={{ marginTop: "1.3em", color: "#e6b91e" }}>
          <Box m={3} style={{ marginLeft: 0 }}>
            <Stack direction="row" justifyContent="space-between">
              <div>
                <Icon name="calendar" size="small"></Icon>

                <span>Creation Date </span>
                <span
                  style={{
                    fontSize: "0.85em",
                    fontWeight: 200,
                    color: "white",
                  }}
                >
                  {data?.created_date}
                </span>
              </div>
              <Input
                action={{ color: "#e6b91e", content: "Search" }}
                icon="search"
                iconPosition="left"
                placeholder="Search a movie ..."
                size="small"
                style={{ fontSize: "0.7em" }}
              />
            </Stack>
          </Box>
        </div>
      </div>

      <Divider style={{ margin: "2em 0px" }} variant="fullWidth" />
      <div className="catalogContainer">
        {data?.movies?.map((movie) => (
          <div className="catalog__item" key={movie.id}>
            <div className="catalog__item__img">
              <img
                src={`${posterBaseUrl}${movie.poster_path}`}
                alt={movie.title}
              />
              <div className="catalog__item__resume">{movie.overview}</div>
            </div>
            <div className="catalog__item__footer">
              <div className="catalog__item__footer__name">{movie.title}</div>
              {edit ? (
                <Button size="tiny" icon color="red">
                  <Icon name="remove" />
                </Button>
              ) : (
                <div className="catalog__item__footer__rating">
                  {movie.vote_average}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Watchlist;
