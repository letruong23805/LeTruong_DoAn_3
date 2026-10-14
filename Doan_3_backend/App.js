const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const Theater = require("./Routes/theaters.routes");
const Room = require("./Routes/Room.routes");
const seats = require("./Routes/Seats.routes");
const genres = require("./Routes/Genres.routes");
const movies = require("./Routes/Movies.routes");
const UserProfiles = require("./Routes/UserProfiles.routes");
const User = require("./Routes/Users.routes");
const Bookings = require("./Routes/Bookings.routes");
const bookingsdetails = require("./Routes/Bookingdetails.routes");
const showtimes = require("./Routes/Showtimes.routes");
const Payments = require("./Routes/Payments.routes");
const moviestats = require("./Routes/MovieStats.routes");
const moviesdetail = require("./Routes/MovieDetails.routes");

app.use("/uploads", express.static("uploads"));
app.use("/theater", Theater);
app.use("/rooms", Room);
app.use("/seats", seats);
app.use("/genres", genres);
app.use("/movies", movies);
app.use("/Userprofiles", UserProfiles);
app.use("/User", User);
app.use("/Booking", Bookings);
app.use("/bookingsdetails", bookingsdetails);
app.use("/showtimes", showtimes);
app.use("/payments", Payments);
app.use("/api/moviestats", moviestats);
app.use("/MovieDetails", moviesdetail);

const port = Number(process.env.PORT) || 3000;

app.listen(port, () => {
  console.log(`Backend server is running at http://localhost:${port}`);
});
