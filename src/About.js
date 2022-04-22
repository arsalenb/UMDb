import React from "react";
import { Container } from "semantic-ui-react";
import { Divider, Avatar, Grid, Paper, Stack } from "@mui/material";
import { Image, Menu, Dropdown } from "semantic-ui-react";

function About() {
  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      style={{ minHeight: "90vh", overflow: "hidden" }}
    >
      <Grid item xs={3}>
        <Container text>
          <div
            style={{
              color: "white",
              textAlign: "left",
              fontWeight: 600,
              fontSize: "1.03em",
            }}
          >
            <Image
              centered
              size="small"
              src="/logo.png"
              style={{ marginBottom: "1.5em" }}
            />

            <p>
              UMDb is a platform meant to provide users with a social experience
              as they share their ratings and reviews on movies.{" "}
            </p>

            <p>
              It is part of a project under a graduate class in University of
              Pisa: "Large-Scale and Multi-structured Databases", and aims to
              demonstrate our understanding of the course material by creating a
              fully functioning application using different notions and
              technologies covered.
            </p>

            <p>
              The platform is supplied with a large collection of movies for
              users to browse and review, and also create watch-lists to
              organize their activity on the application. Moreover, it promotes
              the social aspect by allowing users to interact amongst themselves
              by following each other and/or their preferred watch-lists.
            </p>
            <div style={{ textAlign: "center" }}>
              <span
                style={{
                  textAlign: "right",
                  color: "grey",
                }}
              >
                Arsalen Bidani, Aida Himmiche, Tesfaye Yimam Mohamamd
              </span>
            </div>
          </div>
        </Container>
      </Grid>
    </Grid>
  );
}
export default About;
