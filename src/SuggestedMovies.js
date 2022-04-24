import React, { useEffect, useState } from "react";
import { Button, Header, Icon } from "semantic-ui-react";
import { useNavigate } from "react-router-dom";
import useAuth from "./hooks/useAuth";
import axios from "./api/axios";
import "./Catalog.css";

function SuggestedMovies() {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    fetchMovies();
  }, [auth]);

  const fetchMovies = async () => {
    try {
      const response = await axios.get(`/api/movie/suggested`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth?.accessToken,
        },
      });
      setMovies([...response.data]);

      // navigate("/");
    } catch (err) {}
  };

  const posterBaseUrl = "https://image.tmdb.org/t/p/w300";

  return (
    <div style={{ padding: "2em" }}>
      <Header inverted size={"huge"} style={{ fontSize: "2em" }}>
        <Header.Content>Suggested Movies</Header.Content>
      </Header>
      <div className="catalogContainer">
        {movies?.map((movie) => (
          <div className="catalog__item" key={movie.id}>
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
              <div
                className="catalog__item__footer__name"
                onClick={() => {
                  navigate(`/movie/${movie.id}`);
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
    </div>
  );
}
export default SuggestedMovies;
