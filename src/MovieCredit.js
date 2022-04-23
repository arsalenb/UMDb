import React, { useEffect, useState } from "react";
import CastCard from "./CastCard";

function MovieCredit(props) {
  const theme = true;

  return (
    <>
      <div className={`container mt-5 ${theme ? "text-white" : "text-dark"}`}>
        <div className="row">
          <div className="col-md-8">
            <h5 style={{ color: "white", fontSize: "2.5em" }}>Cast</h5>
            <div className="container movie-card-group my-5">
              <div className="row text-center" id="scrollbar">
                {props.cast?.map((item) => (
                  <div className="col-md-3">
                    <CastCard
                      name={item.name}
                      character={item.character}
                      img={`https://image.tmdb.org/t/p/w500/${item.profile_path}`}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default MovieCredit;
