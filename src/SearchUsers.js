import React, { useState, useEffect } from "react";
import { Button, Header, Icon } from "semantic-ui-react";
import "./Catalog.css";
import { Avatar, Grid, Paper, Stack, Box } from "@mui/material";
import { useSearchParams, useNavigate } from "react-router-dom";
import useAuth from "./hooks/useAuth";
import axios from "./api/axios";

function SearchUser() {
  const { auth } = useAuth();
  const navigate = useNavigate();

  const [searchResults, setSearchResults] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const min = searchParams.get("min");
  const max = searchParams.get("max");
  const searchString = searchParams.get("string");

  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchSearch();
  }, [auth, page]);

  const fetchSearch = async () => {
    if (!min || !max) {
      try {
        const Search = await axios.get(
          `/api/search/user?string=${searchString}&page=${page}`,
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        setSearchResults([...searchResults, ...Search.data]);
      } catch (err) {}
    } else {
      try {
        const Search = await axios.get(
          `/api/search/user?string=${searchString}&page=${page}&min=${min}&max=${max}`,
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        setSearchResults([...searchResults, ...Search.data]);
      } catch (err) {}
    }
  };
  return (
    <div style={{ padding: "2em" }}>
      <Header inverted size={"huge"} style={{ fontSize: "2em" }}>
        <Header.Content>User Search Results :</Header.Content>
      </Header>

      <div style={{ padding: "0 37.8em" }}>
        {searchResults.map((x) => {
          return (
            <Paper
              style={{
                padding: "1em",
                textAlign: "left",
                marginTop: "2em",
              }}
            >
              <Grid container wrap="nowrap" spacing={2}>
                <Grid item>
                  <Avatar
                    alt="Remy Sharp"
                    src={`https://ui-avatars.com/api/?name=${x?.user_name}&background=5a5f61&color=fff`}
                  />
                </Grid>
                <Grid justifyContent="left" item xs zeroMinWidth>
                  <div style={{ fontSize: "1.14em" }}>
                    <Box m={3} style={{ margin: "unset", marginTop: "0.5em" }}>
                      <Stack direction="row" justifyContent="space-between">
                        <div>
                          {" "}
                          <span
                            style={{
                              margin: 0,
                              textAlign: "left",
                              fontWeight: 600,
                              fontSize: "1.03em",
                            }}
                          >
                            {x.user_name}
                          </span>
                        </div>
                        <div>
                          {" "}
                          <Button
                            color="grey"
                            icon
                            labelPosition="left"
                            size="medium"
                            onClick={() => {
                              navigate(`/user/${x.user_id}`);
                            }}
                          >
                            <Icon name="angle double right" />
                            Details
                          </Button>
                        </div>
                      </Stack>
                    </Box>
                  </div>
                </Grid>
              </Grid>
            </Paper>
          );
        })}
      </div>
      <Button
        style={{
          display: "flex",
          margin: "0 auto",
          marginTop: "2em",
          backgroundColor: "#e6b91e",
        }}
        onClick={() => {
          setPage(page + 1);
        }}
      >
        Load More
      </Button>
    </div>
  );
}
export default SearchUser;
