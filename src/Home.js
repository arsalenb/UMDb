import React, {useEffect, useState} from "react";
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
import axios from "./api/axios";
import {useNavigate} from "react-router-dom";

function Home() {
    const navigate = useNavigate();
    var p = 0;
    const [movies, setPopMovies] = useState([]);
    const fetchData = async () => {

        try {
          const response = await axios.get(`/api/movie/pop/${p+1}`, {
            headers: { "Content-Type": "application/json" },
          });
          console.log(p+1)
          setPopMovies([...response.data.movies]);
        }catch (e) {
          console.log(e)
        }
    };
    useEffect(() => {
        fetchData()
    }, []);

  const posterBaseUrl = "https://image.tmdb.org/t/p/w300";
  return (
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
                  <div className="catalog__item__footer__name">
                      <a onClick={(e) => {
                          navigate(`/Movie/${movie._id}`);
                      }}>
                          {movie.title} ({new Date(movie.release_date).getFullYear()})
                      </a>
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
        >
          Load More
        </Button>
      </div>
  );
}
export default Home;