import React, { useState, useEffect } from "react";
import { Divider, Stack, Box } from "@mui/material";
import { Button, Icon, Input, Message, Container } from "semantic-ui-react";
import useAuth from "./hooks/useAuth";
import "./watchlist.css";
import { useParams, useNavigate } from "react-router-dom";
import axios from "./api/axios";

function Watchlist() {
  const { id } = useParams();
  const { auth } = useAuth();
  const navigate = useNavigate();

  const [data, setData] = useState({});
  const [movies, setMovies] = useState([]);
  const [edit, setEdit] = useState(false);
  const [search, setSearch] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [updateLoading, setUpdateLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [watchlistName, setWatchlistName] = useState("");
  const [followed, setFollowed] = useState(false);

  useEffect(() => {
    fetchData(id);
    fetchIfFollowed(id);
  }, [auth]);
  const handleFollow = async () => {
    try {
      const response = await axios.post(
        `/api/watchlist/${id}/follow`,

        {
          headers: { "Content-Type": "application/json" },
        }
      );
      fetchIfFollowed(id);
    } catch (err) {}
  };

  const handleUnfollow = async () => {
    try {
      const response = await axios.delete(
        `/api/watchlist/${id}/follow`,

        {
          headers: { "Content-Type": "application/json" },
        }
      );
      fetchIfFollowed(id);
    } catch (err) {}
  };
  const fetchIfFollowed = async (id) => {
    try {
      const response = await axios.get(`/api/watchlist/followed`, {
        headers: { "Content-Type": "application/json" },
      });
      console.log("id", id);
      if (response?.data?.filter((o) => o.id == id).length !== 0)
        setFollowed(true);
      else setFollowed(false);
    } catch (err) {}
  };
  const fetchData = async (id) => {
    try {
      const response = await axios.get(`/api/watchlist/${id}`, {
        headers: { "Content-Type": "application/json" },
      });
      setData({ ...response.data });
      setMovies([...response.data.movies]);

      // navigate("/");
    } catch (err) {}
  };

  const posterBaseUrl = "https://image.tmdb.org/t/p/w300";
  const handleSearch = (e) => {
    search !== ""
      ? setMovies([
          ...data.movies?.filter((o) =>
            o.title.toLowerCase().includes(search.toLowerCase())
          ),
        ])
      : setMovies([...data.movies]);
  };
  const handleWatchlistUpdate = async () => {
    try {
      setUpdateLoading(true);
      const response = await axios.put(
        `/api/watchlist/${data.id}`,
        JSON.stringify({ name: watchlistName }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      fetchData(id);
      setUpdateLoading(false);
      setEdit(false);
      setWatchlistName("");
      setErrorMessage("");
    } catch (err) {
      if (!err?.response) {
        setErrorMessage("No Server Response");
      } else if (err.response?.status === 400) {
        setErrorMessage("Watchlist Name Is Missing.");
      } else {
        setErrorMessage("Updating Watchlist Has Failed");
      }
      setUpdateLoading(false);
    }
  };

  const handleWatchlistDelete = async () => {
    try {
      setDeleteLoading(true);
      const response = await axios.delete(`/api/watchlist/${data.id}`, {
        headers: { "Content-Type": "application/json" },
      });
      navigate("/");
    } catch (err) {
      if (!err?.response) {
        setErrorMessage("No Server Response");
      } else if (err.response?.status === 400) {
        setErrorMessage("Invalid Watchlist Id.");
      } else {
        setErrorMessage("Deleting Watchlist Has Failed");
      }
      setDeleteLoading(false);
    }
  };

  const handleRemoveMovie = async (movieId) => {
    try {
      const response = await axios.post(
        `/api/watchlist/remove`,
        JSON.stringify({
          watchlistId: data.id,
          movieId: movieId,
        }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      fetchData(id);
    } catch (err) {}
  };
  return (
    <div style={{ padding: "0 2em", color: "white" }}>
      {errorMessage && (
        <Message
          error
          header="There was some errors with your submission"
          content={errorMessage}
        />
      )}

      <Box m={3} style={{ marginLeft: 0 }}>
        <Stack direction="row" justifyContent="space-between">
          <div
            style={{
              marginTop: "1.5em",
              color: "#e6b91e",
              fontSize: "1.4em",
              paddingLeft: "2em",
            }}
          >
            <Icon name="user" size="small"></Icon>
            <span>Author </span>

            <span
              style={{ fontSize: "0.85em", fontWeight: 200, color: "white" }}
            >
              {data?.owner}
            </span>
          </div>
          {auth?.id == data?.owner_id ? (
            <div>
              {edit ? (
                <div>
                  <Button
                    onClick={handleWatchlistUpdate}
                    color="teal"
                    icon
                    labelPosition="left"
                    size="medium"
                    loading={updateLoading}
                  >
                    <Icon name="save outline" />
                    Save Rename
                  </Button>

                  <Button
                    onClick={handleWatchlistDelete}
                    color="red"
                    loading={deleteLoading}
                    icon
                    labelPosition="left"
                    size="medium"
                  >
                    <Icon name="delete" />
                    Delete Watchlist
                  </Button>
                  <Button
                    onClick={() => {
                      setEdit(false);
                      setErrorMessage("");
                    }}
                    color="grey"
                    size="medium"
                  >
                    Cancel
                  </Button>
                </div>
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
          ) : (
            <div>
              {!followed ? (
                <Button
                  onClick={handleFollow}
                  icon
                  color="teal"
                  labelPosition="left"
                  size="medium"
                >
                  <Icon name="edit" />
                  Follow Watchlist
                </Button>
              ) : (
                <Button
                  onClick={handleUnfollow}
                  icon
                  color="red"
                  labelPosition="left"
                  size="medium"
                >
                  <Icon name="bookmark outline" />
                  Unfollow Watchlist
                </Button>
              )}
            </div>
          )}
          {auth?.roles?.includes("Admin") && !edit ? (
            <Button
              style={{ height: "2.5em" }}
              color="red"
              icon
              labelPosition="left"
              loading={deleteLoading}
              size="medium"
              onClick={handleWatchlistDelete}
            >
              <Icon name="delete" />
              Delete Watchlist
            </Button>
          ) : (
            <></>
          )}
        </Stack>
      </Box>

      <div style={{ fontSize: "1.4em", paddingLeft: "2em" }}>
        {" "}
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
              onChange={(e) => {
                setWatchlistName(e.target.value);
              }}
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
                action={{
                  color: "#e6b91e",
                  content: "Search",
                  onClick: handleSearch,
                }}
                icon="search"
                iconPosition="left"
                placeholder="Search a movie ..."
                size="small"
                style={{ fontSize: "0.7em" }}
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
              />
            </Stack>
          </Box>
        </div>
      </div>

      <Divider style={{ margin: "2em 0px" }} variant="fullWidth" />
      <div className="catalogContainer">
        {movies?.map((movie) => (
          <div className="catalog__item" key={movie.movie_id}>
            <div className="catalog__item__img">
              <img
                src={`${posterBaseUrl}${movie.poster_path}`}
                alt={movie.title}
                onError={(e) => (
                  (e.target.onerror = null), (e.target.src = "/imageError.png")
                )}
              />
              <div className="catalog__item__resume">{movie.overview}</div>
            </div>
            <div className="catalog__item__footer">
              <div className="catalog__item__footer__name">{movie.title}</div>
              {edit ? (
                <Button
                  onClick={() => {
                    handleRemoveMovie(movie.movie_id);
                  }}
                  size="tiny"
                  icon
                  color="red"
                >
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
