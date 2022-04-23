import React, { useState, useEffect } from "react";
import {
  Image,
  Menu,
  Modal,
  Button,
  Header,
  Icon,
  Pagination,
  Dropdown,
} from "semantic-ui-react";
import "./Catalog.css";
import { useSearchParams, useNavigate } from "react-router-dom";
import useAuth from "./hooks/useAuth";
import axios from "./api/axios";
function SearchMovie() {
  const posterBaseUrl = "https://image.tmdb.org/t/p/w300";
  const { auth } = useAuth();
  const navigate = useNavigate();

  const [searchResults, setSearchResults] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();

  const movieSearchString = searchParams.get("title");
  const genre = searchParams.get("genre");
  const minRuntime = searchParams.get("minRuntime");
  const maxRuntime = searchParams.get("maxRuntime");
  const minDate = searchParams.get("minDate");
  const maxDate = searchParams.get("maxDate");
  const language = searchParams.get("language");

  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchSearch();
  }, [auth, page]);

  const fetchSearch = async () => {
    try {
      const Search = await axios.get(
        `/api/search/movie?title=${movieSearchString}&genre=${genre}&minRuntime=${minRuntime}&maxRuntime=${maxRuntime}&minDate=${minDate}&maxDate=${maxDate}&language=${language}`,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      setSearchResults([...searchResults, ...Search.data.movies]);
    } catch (err) {}
  };

  return (
    <div style={{ padding: "2em" }}>
      <Header inverted size={"huge"} style={{ fontSize: "2em" }}>
        <Header.Content>Movie Search Results :</Header.Content>
      </Header>
      <div className="catalogContainer">
        {searchResults.map((movie) => (
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
    </div>
  );
}
export default SearchMovie;
