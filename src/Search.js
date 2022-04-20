import React, { useState } from "react";
import {
  Divider,
  Segment,
  Header,
  Grid,
  Input,
  Icon,
  Dropdown,
} from "semantic-ui-react";
import "./search.css";
import { DateInput } from "semantic-ui-calendar-react-yz";
import useAuth from "./hooks/useAuth";
import { useParams, useNavigate } from "react-router-dom";

function Search() {
  const [minFollowers, setMinFollowers] = useState();
  const [maxFollowers, setMaxFollowers] = useState();
  const [userSearchString, setUserSearchString] = useState("");

  const { auth } = useAuth();
  const navigate = useNavigate();

  const options = [
    { key: "Comedy", text: "Comdey", value: "Comdey" },
    { key: "Horror", text: "Horror", value: "Horror" },
    { key: "Thriller", text: "Thriller", value: "Thriller" },
  ];
  const handleUserSearch = () => {
    if (!minFollowers || !maxFollowers)
      navigate(`/Search/User?string=${userSearchString}`);
    else
      navigate(
        `/Search/User?string=${userSearchString}&min=${minFollowers}&max=${maxFollowers}`
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
              action="Search"
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
              <Dropdown
                placeholder="Genres"
                style={{ marginTop: "1em", marginLeft: "1em" }}
                multiple
                selection
                options={options}
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
                />
                {"  -  "}
                <DateInput
                  style={{ width: "9em", marginLeft: "5px" }}
                  name="date"
                  placeholder="To"
                  iconPosition="left"
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
                Rating{" "}
              </span>
              <Input
                style={{ marginLeft: "1em", width: "9em" }}
                icon="star"
                iconPosition="left"
                placeholder="From"
              />
              {"  -  "}
              <Input
                style={{ width: "9em" }}
                icon="star"
                iconPosition="left"
                placeholder="To"
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
                Runtime{" "}
              </span>
              <Input
                style={{ marginLeft: "1em", width: "9em" }}
                icon="time"
                iconPosition="left"
                placeholder="From"
              />
              {"  -  "}
              <Input
                style={{ width: "9em" }}
                icon="time"
                iconPosition="left"
                placeholder="To"
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
              <Dropdown
                placeholder="Languages"
                style={{ marginLeft: "1em" }}
                multiple
                selection
                options={options}
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
