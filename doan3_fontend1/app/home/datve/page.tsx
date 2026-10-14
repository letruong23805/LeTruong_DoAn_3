"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
type DecodedToken = {
  user_id: number;
  role_id?: number;
  exp?: number;
};
type Movie = {
  movie_id: number;
  title: string;
  poster: string;
  status: string;
};

type Theater = {
  theater_id: number;
  name: string;
};

type Showtime = {
  // showtime_id: number;
  // movie_id: number;
  // room_id: number;
  // start_time: string;
  // theater_id: number;
  showtime_id: number;
  movie_id: number;
  room_id: number;
  show_date: string;
  start_time: string;
  end_time: string;
  format: string;
  price: number;
};

type Seat = {
  seat_id: number;
  seat_number: string;
  room_id: number;
};

type Room = {
  room_id: number;
  theater_id: number;
};
type BookedSeat = {
  seat_id: number;
};

export default function Datve() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [theaters, setTheaters] = useState<Theater[]>([]);
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<number | null>(null);
  const [bookedSeats, setBookedSeats] = useState<number[]>([]);

  const [selectedMovie, setSelectedMovie] = useState<number | null>(null);
  const [selectedTheater, setSelectedTheater] = useState<number | null>(null);
  const [selectedShowtime, setSelectedShowtime] = useState<number | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);

  // LOAD DATA
  useEffect(() => {
    fetch("http://localhost:3000/movies/all")
      .then((res) => res.json())
      .then(setMovies);

    fetch("http://localhost:3000/theater/all")
      .then((res) => res.json())
      .then(setTheaters);

    fetch("http://localhost:3000/showtimes/all")
      .then((res) => res.json())
      .then(setShowtimes);
    fetch("http://localhost:3000/rooms/all")
      .then((res) => res.json())
      .then(setRooms);

    fetch("http://localhost:3000/seats/all")
      .then((res) => res.json())
      .then(setSeats);
  }, []);

  useEffect(() => {
    if (!selectedShowtime) return;

    fetch(`http://localhost:3000/bookingsdetails/showtime/${selectedShowtime}`)
      .then((res) => res.json())
      .then((data: BookedSeat[]) => {
        const ids = data.map((item) => item.seat_id);
        setBookedSeats(ids);
      });
  }, [selectedShowtime]);

  const toggleSeat = (id: number) => {
    if (bookedSeats.includes(id)) return;

    if (selectedSeats.includes(id)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== id));
    } else {
      setSelectedSeats([...selectedSeats, id]);
    }
  };

  // lọc
  const showmovies = movies.filter((m) => m.status === "showing");

  const roomsOfTheater = rooms.filter(
    (r) => Number(r.theater_id) === Number(selectedTheater),
  );

  const filteredShowtimes = showtimes.filter(
    (st) =>
      Number(st.movie_id) === Number(selectedMovie) &&
      Number(st.room_id) === Number(selectedRoom),
  );
  const selectedShowtimeData = showtimes.find(
    (st) => st.showtime_id === selectedShowtime,
  );

  const seatsOfRoom = seats.filter(
    (s) => s.room_id === selectedShowtimeData?.room_id,
  );

  const router = useRouter();
  const handleBooking = async () => {
    if (!selectedShowtime || selectedSeats.length === 0) {
      alert("Vui lòng chọn suất chiếu và ghế");
      return;
    }

    const data = {
      movie: movies.find((m) => m.movie_id === selectedMovie),
      theater: theaters.find((t) => t.theater_id === selectedTheater),
      room: rooms.find((r) => r.room_id === selectedRoom),
      showtime: showtimes.find((st) => st.showtime_id === selectedShowtime),
      seats: seats.filter((s) => selectedSeats.includes(s.seat_id)),
    };

    localStorage.setItem("bookingData", JSON.stringify(data));

    router.push("/home/chitietdatve");
  };
  return (
    <div className="w-[1000px] m-auto text-black pt-10 pb-10">
      <div className="h-10 w-40 bg-red-500 flex items-center pl-2 rounded-lg  ">
        <h2 className="uppercase text-white font-bold">Đặt vé xem phim</h2>
      </div>
      <div className="mt-10 max-h-[750px] overflow-y-auto">
        <h3>trọn phim</h3>
        <div className="grid grid-cols-4 gap-4 mt-5 max-h-[360px] overflow-y-auto">
          {showmovies.map((m) => (
            <div
              key={m.movie_id}
              className={`w-[200px] border rounded-lg overflow-hidden cursor-pointer
              ${selectedMovie === m.movie_id ? "border-red-500 border-4" : ""}`}
              onClick={() => {
                setSelectedMovie(m.movie_id);
                setSelectedTheater(null); // reset
                setSelectedRoom(null);
                setSelectedShowtime(null);
                setSelectedSeats([]);
              }}
            >
              <div>
                <img
                  src={`http://localhost:3000${m.poster}`}
                  alt={m.title}
                  className="w-full h-[230px]"
                />
              </div>
              <div className="w-full h-[100px]">
                <h3 className="uppercase flex justify-center mt-2 font-bold">
                  {m.title}
                </h3>
                <div className="w-full flex justify-center mt-4">
                  <button
                    onClick={() => setSelectedMovie(m.movie_id)}
                    className="w-[100px] bg-red-500 font-bold text-white rounded-lg cursor-pointer hover:bg-red-600"
                  >
                    Chọn phim
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3">
          <h3 className="capitalize ">trọn rạp</h3>
          <select
            value={selectedTheater || ""}
            onChange={(e) => {
              const value = e.target.value;
              setSelectedTheater(value ? Number(value) : null);
              setSelectedRoom(null);
              setSelectedShowtime(null);
              setSelectedSeats([]);
            }}
            className="w-[300px] mt-3 border p-1 rounded-lg"
          >
            <option value="">-- Chọn rạp --</option>
            {theaters.map((t) => (
              <option key={t.theater_id} value={t.theater_id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>
        {selectedTheater && (
          <div className="mt-3">
            <h3>Chọn phòng</h3>

            <select
              value={selectedRoom || ""}
              onChange={(e) => {
                const value = e.target.value;
                setSelectedRoom(value ? Number(value) : null);
                setSelectedShowtime(null);
                setSelectedSeats([]);
              }}
              className="w-[300px] mt-3 border p-1 rounded-lg"
            >
              <option value="">-- Chọn phòng --</option>

              {roomsOfTheater.map((r) => (
                <option key={r.room_id} value={r.room_id}>
                  Phòng {r.room_id}
                </option>
              ))}
            </select>
          </div>
        )}
        {selectedMovie && selectedTheater && selectedRoom && (
          <div className="mt-3">
            <h3>Chọn suất chiếu</h3>

            {filteredShowtimes.length === 0 && (
              <p className="text-red-500">Không có suất chiếu phù hợp</p>
            )}

            <select
              value={selectedShowtime || ""}
              onChange={(e) => {
                const value = e.target.value;
                setSelectedShowtime(value ? Number(value) : null);
                setSelectedSeats([]);
              }}
              className="w-[300px] mt-3 border p-1 rounded-lg"
            >
              <option value="">-- Chọn suất chiếu --</option>

              {filteredShowtimes.map((st) => (
                <option key={st.showtime_id} value={st.showtime_id}>
                  {st.start_time}
                </option>
              ))}
            </select>
          </div>
        )}
        {selectedShowtime && (
          <div className="mt-5">
            <h3>Chọn ghế</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              {seatsOfRoom.map((s) => (
                <button
                  key={s.seat_id}
                  onClick={() => toggleSeat(s.seat_id)}
                  disabled={bookedSeats.includes(s.seat_id)}
                  className={`p-2 border rounded
                  ${
                    bookedSeats.includes(s.seat_id)
                      ? "bg-yellow-400 cursor-not-allowed"
                      : selectedSeats.includes(s.seat_id)
                        ? "bg-green-500 text-white"
                        : "bg-white hover:bg-gray-200"
                  }`}
                >
                  {s.seat_number}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-5 text-center">
          <button
            onClick={handleBooking}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 cursor-pointer"
          >
            Đặt vé
          </button>
        </div>
      </div>
    </div>
  );
}
