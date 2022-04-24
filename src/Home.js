import React, { useState, useEffect } from "react";
import { Button, Header } from "semantic-ui-react";
import "./Catalog.css";
import useAuth from "./hooks/useAuth";
import axios from "./api/axios";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
function Home() {
  const posterBaseUrl = "https://image.tmdb.org/t/p/w300";
  const { auth } = useAuth();
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMovies();
  }, [auth, page]);

  const fetchMovies = async () => {
    try {
      const response = await axios.get(`/api/movie/pop/${page}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      setLoading(false);
      setMovies([...movies, ...response.data.movies]);
    } catch (err) {
      setLoading(false);
    }
  };

  return (
    <div>
      {loading ? (
        <div className="v-wrap">
          <CircularProgress style={{ color: "white" }} className="v-box" />
        </div>
      ) : (
        <div style={{ padding: "2em" }}>
          <Header inverted size={"huge"} style={{ fontSize: "2.5em" }}>
            <Header.Content>Most Popular</Header.Content>
          </Header>
          <div className="catalogContainer">
            {movies.map((movie) => (
              <div className="catalog__item" key={movie._id}>
                <div className="catalog__item__img">
                  <img
                    src={`${posterBaseUrl}${movie.poster_path}`}
                    alt={movie.title}
                  />
                  <div className="catalog__item__resume">{movie.overview}</div>
                </div>
                <div className="catalog__item__footer">
                  <div
                    className="catalog__item__footer__name"
                    onClick={() => {
                      navigate(`/movie/${movie._id}`);
                    }}
                  >
                    {movie.title}
                  </div>
                  <div className="catalog__item__footer__rating">
                    {movie.vote_average}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Button
            style={{
              display: "flex",
              margin: "0 auto",
              backgroundColor: "#e6b91e",
            }}
            onClick={() => {
              setPage(page + 1);
            }}
          >
            Load More
          </Button>
        </div>
      )}
    </div>
  );
}
export default Home;
