import React, { useState } from "react";
import {
  Divider,
  Segment,
  Header,
  Grid,
  Input,
  Icon,
  Select,
  Dropdown,
} from "semantic-ui-react";
import "./search.css";
import { DateInput } from "semantic-ui-calendar-react-yz";
import useAuth from "./hooks/useAuth";
import { useParams, useNavigate } from "react-router-dom";
import { Language } from "@mui/icons-material";

function Search() {
  const [minFollowers, setMinFollowers] = useState();
  const [maxFollowers, setMaxFollowers] = useState();
  const [userSearchString, setUserSearchString] = useState("");
  const [movieSearchString, setMovieSearchString] = useState("");

  const [minDate, setMinDate] = useState("");
  const [maxDate, setMaxDate] = useState("");

  const [minRuntime, setMinRuntime] = useState("");
  const [maxRuntime, setMaxRuntime] = useState("");
  const [language, setLanguage] = useState("");
  const [genre, setGenre] = useState("");
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
  const Languages = [
    { key: "English", text: "English", value: "English" },
    { key: "Italian", text: "Italian", value: "Italian" },
    { key: "Spanish", text: "Spanish", value: "Spanish" },
    { key: "Deutsch", text: "Deutsch", value: "Deutsch" },
    { key: "Russian", text: "Russian", value: "Russian" },
    { key: "Latin", text: "Latin", value: "Latin" },
    { key: "Chinese", text: "Chinese", value: "Chinese" },
  ];

  const handleUserSearch = () => {
    if (!minFollowers || !maxFollowers)
      navigate(`/Search/User?string=${userSearchString}`);
    else
      navigate(
        `/Search/User?string=${userSearchString}&min=${minFollowers}&max=${maxFollowers}`
      );
  };
  const handleMovieSearch = () => {
    navigate(
      `/Search/movie?title=${movieSearchString}&genre=${genre}&minRuntime=${minRuntime}&maxRuntime=${maxRuntime}&minDate=${minDate}&maxDate=${maxDate}&language=${language}`
    );
  };

  return (
    <div className="v-wrap">
      <Segment className="v-box" placeholder textAlign="center">
        <Grid columns={2} relaxed="very" stackable>
          <Grid.Column>
            <Header style={{ marginLeft: "1em" }} centered as="h1" icon>
              <Icon name="film" />
              Search Movies
              <Header.Subheader>
                Search for your prefered movies using multiple filters.
              </Header.Subheader>
            </Header>{" "}
            <Input
              centered
              style={{ marginLeft: "-1em" }}
              action={{
                content: "Search",
                onClick: handleMovieSearch,
              }}
              onChange={(e) => {
                setMovieSearchString(e.target.value);
              }}
              placeholder="Search Movies ..."
              size="large"
            />
            <Divider />
            <Header style={{ marginLeft: "8em" }} as="h3">
              <Icon name="filter" />
              <Header.Content>Movie Filters</Header.Content>
            </Header>
            <div>
              {" "}
              <span
                style={{
                  margin: 0,
                  marginBottom: "1em",
                  textAlign: "left",
                  fontWeight: 700,
                  fontSize: "1.05em",
                  color: "black",
                }}
              >
                Genres{" "}
              </span>
              <Select
                placeholder="Genres"
                style={{ marginTop: "1em", marginLeft: "1em" }}
                options={options}
                onChange={(e, { value }) => {
                  setGenre(value);
                }}
              />
            </div>
            <div style={{ marginTop: "1em" }}>
              {" "}
              <span
                style={{
                  margin: 0,
                  marginBottom: "1em",
                  textAlign: "left",
                  fontWeight: 700,
                  fontSize: "1.05em",
                  color: "black",
                }}
              >
                Release Year{" "}
              </span>
              <div style={{ display: "inline-flex" }}>
                {" "}
                <DateInput
                  style={{
                    marginLeft: "1em",
                    width: "9em",
                    marginRight: "5px",
                  }}
                  name="date"
                  placeholder="From"
                  iconPosition="left"
                  dateFormat={"YYYY-MM-DD"}
                  value={minDate}
                  onChange={(e, { value }) => {
                    setMinDate(value);
                  }}
                />
                {"  -  "}
                <DateInput
                  style={{ width: "9em", marginLeft: "5px" }}
                  name="date"
                  placeholder="To"
                  iconPosition="left"
                  dateFormat={"YYYY-MM-DD"}
                  value={maxDate}
                  onChange={(e, { value }) => {
                    setMaxDate(value);
                  }}
                />
              </div>
            </div>
            <div style={{ marginTop: "1em" }}>
              {" "}
              <span
                style={{
                  margin: 0,
                  marginBottom: "1em",
                  textAlign: "left",
                  fontWeight: 700,
                  fontSize: "1.05em",
                  color: "black",
                }}
              >
                Runtime{" "}
              </span>
              <Input
                style={{ marginLeft: "1em", width: "9em" }}
                icon="time"
                iconPosition="left"
                placeholder="From"
                onChange={(e, { value }) => {
                  setMinRuntime(value);
                }}
              />
              {"  -  "}
              <Input
                style={{ width: "9em" }}
                icon="time"
                iconPosition="left"
                placeholder="To"
                onChange={(e, { value }) => {
                  setMaxRuntime(value);
                }}
              />
            </div>
            <div style={{ marginTop: "1em" }}>
              {" "}
              <span
                style={{
                  margin: 0,
                  marginBottom: "1em",
                  textAlign: "left",
                  fontWeight: 700,
                  fontSize: "1.05em",
                  color: "black",
                }}
              >
                Languages{" "}
              </span>
              <Select
                placeholder="Languages"
                style={{ marginLeft: "1em" }}
                options={Languages}
                onChange={(e, { value }) => {
                  setLanguage(value);
                }}
              />
            </div>
          </Grid.Column>

          <Grid.Column>
            <Header centered as="h1" icon>
              <Icon name="users" />
              Search Users
              <Header.Subheader>
                Your favourite friends are just a click away.{" "}
              </Header.Subheader>
            </Header>{" "}
            <Input
              centered
              style={{ marginLeft: "-3em" }}
              action={{
                content: "Search",
                onClick: handleUserSearch,
              }}
              placeholder="Search Users ..."
              size="large"
              onChange={(e) => {
                setUserSearchString(e.target.value);
              }}
            />
            <Divider />
            <Header style={{ marginLeft: "8em" }} as="h3">
              <Icon name="filter" />
              <Header.Content>User Filters</Header.Content>
            </Header>
            <div style={{ marginTop: "2.5em" }}>
              {" "}
              <span
                style={{
                  margin: 0,
                  marginBottom: "1em",
                  textAlign: "left",
                  fontWeight: 700,
                  fontSize: "1.05em",
                  color: "black",
                }}
              >
                Number of Followers{" "}
              </span>
              <Input
                style={{ marginLeft: "1em", width: "9em" }}
                icon="user circle outline"
                iconPosition="left"
                placeholder="From"
                onChange={(e, { value }) => {
                  setMinFollowers(value);
                }}
              />
              {"  -  "}
              <Input
                style={{ width: "9em" }}
                icon="user circle outline"
                iconPosition="left"
                placeholder="To"
                onChange={(e, { value }) => {
                  setMaxFollowers(value);
                }}
              />
            </div>
          </Grid.Column>
        </Grid>

        <Divider vertical>Or</Divider>
      </Segment>
    </div>
  );
}
export default Search;
