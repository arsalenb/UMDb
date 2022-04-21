import React from "react";
import { Routes, Route } from "react-router-dom";
import About from "./About";
import Analytics from "./Analytics";
import FollowedUsers from "./FollowedUsers";
import FollowedWatchlists from "./FollowedWatchlists";
import Nav from "./Header";
import Home from "./Home";
import Login from "./Login";
import Movie from "./Movie";
import Profile from "./Profile";
import Search from "./Search";
import SearchMovie from "./SearchMovie";
import Signup from "./Signup";
import Watchlist from "./Watchlist";
import User from "./User";
import SearchUser from "./SearchUsers";
import SuggestedMovies from "./SuggestedMovies";
const App = () => {
  const login = true;
  return (
    <>
      <Nav />

      {login ? (
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/Analytics" element={<Analytics />} />
          <Route path="/About" element={<About />} />
          <Route path="/Search" element={<Search />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Signup" element={<Signup />} />
          <Route path="/Movie/:id" element={<Movie />} />
          <Route path="/Watchlist/:id" element={<Watchlist />} />
          <Route path="/Followed/Watchlists" element={<FollowedWatchlists />} />
          <Route path="/Followed/Users" element={<FollowedUsers />} />
          <Route path="/Search/Movie" element={<SearchMovie />} />
          <Route path="/Search/User/" element={<SearchUser />} />
          <Route path="/Movie/Suggested" element={<SuggestedMovies />} />

          <Route path="/Profile" element={<Profile />} />
          <Route path="/User/:id" element={<User />} />
        </Routes>
      ) : (
        <Routes>
          <Route exact path="/" element={<Home />} />
        </Routes>
      )}
    </>
  );
};

export default App;
