"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  MovieSelector,
  SeatMap,
  ShowtimeSelector,
  type Movie,
  type Seat,
  type Showtime,
  type Theater,
  type Room,
} from "./components";

const API_URL = "http://localhost:3000";
const currency = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  maximumFractionDigits: 0,
});

type BookedSeat = { seat_id: number };

async function fetchJson<T>(url: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(url, { signal });
  if (!response.ok) {
    throw new Error(`Máy chủ trả về lỗi ${response.status} khi tải dữ liệu.`);
  }
  return response.json() as Promise<T>;
}

function formatDate(date: string) {
  const parsed = new Date(`${date.slice(0, 10)}T00:00:00`);
  return new Intl.DateTimeFormat("vi-VN", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
  }).format(parsed);
}

function isUpcoming(showtime: Showtime) {
  const showDate = showtime.show_date.slice(0, 10);
  const now = new Date();
  const today = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("-");

  if (showDate !== today) return showDate > today;
  return showtime.start_time.slice(0, 8) > now.toTimeString().slice(0, 8);
}

export default function Datve() {
  const router = useRouter();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [theaters, setTheaters] = useState<Theater[]>([]);
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<number | null>(null);
  const [selectedTheater, setSelectedTheater] = useState<number | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedShowtime, setSelectedShowtime] = useState<number | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [bookedSeatsForShowtime, setBookedSeatsForShowtime] = useState<{
    showtimeId: number;
    seatIds: number[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingSeats, setLoadingSeats] = useState(false);
  const [seatError, setSeatError] = useState<string | null>(null);
  const bookedSeats =
    bookedSeatsForShowtime?.showtimeId === selectedShowtime
      ? bookedSeatsForShowtime.seatIds
      : [];
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    Promise.all([
      fetchJson<Movie[]>(`${API_URL}/movies/all`),
      fetchJson<Theater[]>(`${API_URL}/theater/all`),
      fetchJson<Showtime[]>(`${API_URL}/showtimes/all`),
      fetchJson<Room[]>(`${API_URL}/rooms/all`),
      fetchJson<Seat[]>(`${API_URL}/seats/all`),
    ])
      .then(([movieData, theaterData, showtimeData, roomData, seatData]) => {
        if (!active) return;
        setMovies(movieData);
        setTheaters(theaterData);
        setShowtimes(showtimeData);
        setRooms(roomData);
        setSeats(seatData);
        setError(null);
      })
      .catch((loadError: unknown) => {
        if (!active) return;
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Không thể tải dữ liệu đặt vé.",
        );
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedShowtime) {
      return;
    }

    const controller = new AbortController();
    fetchJson<BookedSeat[]>(
      `${API_URL}/bookingsdetails/showtime/${selectedShowtime}`,
      controller.signal,
    )
      .then((data) =>
        setBookedSeatsForShowtime({
          showtimeId: selectedShowtime,
          seatIds: data.map((seat) => Number(seat.seat_id)),
        }),
      )
      .catch((loadError: unknown) => {
        if (!controller.signal.aborted) {
          setSeatError(
            loadError instanceof Error
              ? loadError.message
              : "Không thể tải tình trạng ghế.",
          );
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoadingSeats(false);
      });

    return () => controller.abort();
  }, [selectedShowtime]);

  const showingMovies = useMemo(
    () =>
      movies.filter((movie) => movie.status?.toLowerCase() === "showing"),
    [movies],
  );
  const selectedMovieData = showingMovies.find(
    (movie) => movie.movie_id === selectedMovie,
  );

  const movieShowtimes = showtimes.filter(
    (showtime) =>
      Number(showtime.movie_id) === selectedMovie && isUpcoming(showtime),
  );
  const theaterIds = new Set(
    movieShowtimes
      .map((showtime) => {
        return rooms.find(
          (room) => Number(room.room_id) === Number(showtime.room_id),
        )?.theater_id;
      })
      .filter((id): id is number => id !== undefined)
      .map(Number),
  );
  const availableTheaters = theaters.filter((theater) =>
    theaterIds.has(Number(theater.theater_id)),
  );
  const theaterRooms = rooms.filter(
    (room) => Number(room.theater_id) === selectedTheater,
  );
  const availableRooms = theaterRooms.filter((room) =>
    movieShowtimes.some(
      (showtime) => Number(showtime.room_id) === Number(room.room_id),
    ),
  );
  const roomShowtimes = movieShowtimes.filter(
    (showtime) =>
      Number(showtime.room_id) === selectedRoom &&
      availableRooms.some((room) => Number(room.room_id) === selectedRoom),
  );
  const availableDates = [
    ...new Set(roomShowtimes.map((showtime) => showtime.show_date.slice(0, 10))),
  ].sort();
  const dateShowtimes = roomShowtimes
    .filter((showtime) => showtime.show_date.slice(0, 10) === selectedDate)
    .sort((a, b) => a.start_time.localeCompare(b.start_time));
  const selectedShowtimeData = showtimes.find(
    (showtime) => Number(showtime.showtime_id) === selectedShowtime,
  );
  const selectedTheaterData = theaters.find(
    (theater) => Number(theater.theater_id) === selectedTheater,
  );
  const selectedRoomData = rooms.find(
    (room) => Number(room.room_id) === selectedRoom,
  );
  const seatsOfRoom = seats
    .filter((seat) => Number(seat.room_id) === selectedRoom)
    .sort((a, b) => a.seat_number.localeCompare(b.seat_number, "vi", {
      numeric: true,
    }));
  const chosenSeats = seatsOfRoom.filter((seat) =>
    selectedSeats.includes(Number(seat.seat_id)),
  );
  const total = chosenSeats.reduce((sum, seat) => {
    const price = Number(selectedShowtimeData?.price) || 0;
    return sum + (seat.seat_type?.toLowerCase() === "vip" ? price * 1.2 : price);
  }, 0);

  const toggleSeat = (seatId: number) => {
    if (bookedSeats.includes(seatId) || loadingSeats) return;
    setSelectedSeats((current) =>
      current.includes(seatId)
        ? current.filter((id) => id !== seatId)
        : [...current, seatId],
    );
  };

  const chooseMovie = (movieId: number) => {
    setLoadingSeats(false);
    setSelectedMovie(movieId);
    setSelectedTheater(null);
    setSelectedRoom(null);
    setSelectedDate(null);
    setSelectedShowtime(null);
    setSelectedSeats([]);
  };

  const chooseTheater = (theaterId: number | null) => {
    setLoadingSeats(false);
    setSelectedTheater(theaterId);
    setSelectedRoom(null);
    setSelectedDate(null);
    setSelectedShowtime(null);
    setSelectedSeats([]);
  };

  const chooseRoom = (roomId: number | null) => {
    setLoadingSeats(false);
    setSelectedRoom(roomId);
    setSelectedDate(null);
    setSelectedShowtime(null);
    setSelectedSeats([]);
  };

  const chooseDate = (date: string) => {
    setLoadingSeats(false);
    setSelectedDate(date);
    setSelectedShowtime(null);
    setSelectedSeats([]);
  };

  const chooseShowtime = (showtimeId: number) => {
    setLoadingSeats(true);
    setSeatError(null);
    setSelectedShowtime(showtimeId);
    setSelectedSeats([]);
  };

  const handleBooking = () => {
    if (
      !selectedMovieData ||
      !selectedTheaterData ||
      !selectedRoomData ||
      !selectedShowtimeData ||
      chosenSeats.length === 0
    ) {
      return;
    }

    localStorage.setItem(
      "bookingData",
      JSON.stringify({
        movie: selectedMovieData,
        theater: selectedTheaterData,
        room: selectedRoomData,
        showtime: selectedShowtimeData,
        seats: chosenSeats,
      }),
    );
    router.push("/home/chitietdatve");
  };

  const bookingSummary = (
    <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-700">
        Vé của bạn
      </p>
      <h2 className="mt-2 text-lg font-bold text-stone-900">
        {selectedMovieData?.title || "Chưa chọn phim"}
      </h2>
      <div className="mt-4 space-y-2 border-t border-dashed border-stone-200 pt-4 text-sm text-stone-600">
        <p>{selectedTheaterData?.name || "Chưa chọn rạp"}</p>
        <p>
          {selectedRoomData?.room_name || "Chưa chọn phòng"}
          {selectedShowtimeData && selectedDate
            ? ` · ${formatDate(selectedDate)} · ${selectedShowtimeData.start_time.slice(0, 5)}`
            : ""}
        </p>
        <p className="min-h-5 text-stone-800">
          {chosenSeats.length
            ? chosenSeats
                .map((seat) => seat.seat_number)
                .sort((a, b) => a.localeCompare(b, "vi", { numeric: true }))
                .join(", ")
            : "Chưa chọn ghế"}
        </p>
      </div>
      <div className="mt-4 flex items-end justify-between border-t border-stone-100 pt-4">
        <span className="text-sm text-stone-500">
          Tạm tính ({chosenSeats.length} ghế)
        </span>
        <strong className="text-xl font-extrabold text-red-700">
          {currency.format(total)}
        </strong>
      </div>
      <button
        type="button"
        onClick={handleBooking}
        disabled={!selectedShowtimeData || chosenSeats.length === 0}
        className="mt-5 w-full rounded-xl bg-red-700 px-5 py-3 font-bold text-white transition hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-200 disabled:cursor-not-allowed disabled:bg-stone-300"
      >
        Tiếp tục đặt vé
      </button>
      <p className="mt-3 text-center text-xs text-stone-400">
        Ghế VIP có phụ thu 20% theo giá suất chiếu
      </p>
    </div>
  );

  return (
    <main className="min-h-screen bg-[#f7f6f3] pb-28 text-stone-900 lg:pb-12">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <header className="mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-red-700">
            Movie ticket booking
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
            Đặt vé xem phim
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-stone-500 sm:text-base">
            Chọn phim, chọn suất chiếu và giữ chỗ yêu thích của bạn.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-2 text-xs font-semibold sm:gap-3 sm:text-sm">
            {["Chọn phim", "Chọn suất", "Chọn ghế"].map((step, index) => {
              const complete =
                index === 0
                  ? Boolean(selectedMovie)
                  : index === 1
                    ? Boolean(selectedShowtime)
                    : chosenSeats.length > 0;
              return (
                <div key={step} className="flex items-center gap-2">
                  <span
                    className={`flex h-7 w-7 items-center justify-center rounded-full ${
                      complete
                        ? "bg-red-700 text-white"
                        : "bg-white text-stone-500 ring-1 ring-stone-200"
                    }`}
                  >
                    {index + 1}
                  </span>
                  <span className={complete ? "text-stone-900" : "text-stone-400"}>
                    {step}
                  </span>
                  {index < 2 && (
                    <span className="mx-1 h-px w-5 bg-stone-300 sm:mx-2 sm:w-10" />
                  )}
                </div>
              );
            })}
          </div>
        </header>

        {error && (
          <div
            role="alert"
            className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"
          >
            <span>{error} Hãy kiểm tra backend và kết nối cơ sở dữ liệu.</span>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="font-bold underline underline-offset-2"
            >
              Tải lại trang
            </button>
          </div>
        )}

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="min-w-0 space-y-6">
            <section
              aria-labelledby="movie-heading"
              className="min-w-0 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-7"
            >
              <SectionHeading
                number="01"
                title="Chọn phim"
                subtitle="Phim đang chiếu tại rạp"
                id="movie-heading"
              />
              {loading ? (
                <p className="mt-6 text-sm text-stone-500">Đang tải danh sách phim…</p>
              ) : showingMovies.length === 0 ? (
                <p className="mt-6 rounded-xl bg-stone-50 p-4 text-sm text-stone-500">
                  Hiện chưa có phim đang chiếu.
                </p>
              ) : (
                <MovieSelector
                  movies={showingMovies}
                  selectedMovieId={selectedMovie}
                  onSelect={chooseMovie}
                />
              )}
            </section>

            <section
              aria-labelledby="showtime-heading"
              className={`min-w-0 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm transition sm:p-7 ${
                !selectedMovie ? "opacity-70" : ""
              }`}
            >
              <SectionHeading
                number="02"
                title="Chọn rạp & suất chiếu"
                subtitle="Tìm địa điểm và khung giờ phù hợp"
                id="showtime-heading"
              />
              <ShowtimeSelector
                enabled={Boolean(selectedMovie)}
                theaters={availableTheaters}
                rooms={availableRooms}
                dates={availableDates}
                showtimes={dateShowtimes}
                selectedTheaterId={selectedTheater}
                selectedRoomId={selectedRoom}
                selectedDate={selectedDate}
                selectedShowtimeId={selectedShowtime}
                onTheaterChange={chooseTheater}
                onRoomChange={chooseRoom}
                onDateChange={chooseDate}
                onShowtimeChange={chooseShowtime}
              />
            </section>

            <section
              aria-labelledby="seat-heading"
              className={`min-w-0 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm transition sm:p-7 ${
                !selectedShowtime ? "opacity-70" : ""
              }`}
            >
              <SectionHeading
                number="03"
                title="Chọn ghế ngồi"
                subtitle={
                  selectedShowtimeData
                    ? `${selectedRoomData?.room_name || "Phòng chiếu"} · ${selectedShowtimeData.format || "2D"}`
                    : "Sơ đồ ghế sẽ hiện sau khi chọn suất chiếu"
                }
                id="seat-heading"
              />
              {selectedShowtime ? (
                loadingSeats ? (
                  <p className="mt-6 text-center text-sm text-stone-500">
                    Đang kiểm tra tình trạng ghế…
                  </p>
                ) : seatError ? (
                  <div
                    role="alert"
                    className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"
                  >
                    Không thể xác nhận ghế trống: {seatError} Vui lòng tải lại
                    trang trước khi chọn ghế.
                  </div>
                ) : (
                  <SeatMap
                    seats={seatsOfRoom}
                    bookedSeatIds={bookedSeats}
                    selectedSeatIds={selectedSeats}
                    onToggleSeat={toggleSeat}
                  />
                )
              ) : (
                <div className="mt-6 rounded-xl border border-dashed border-stone-200 bg-stone-50 px-4 py-10 text-center text-sm text-stone-400">
                  Vui lòng chọn phim và suất chiếu để xem sơ đồ ghế.
                </div>
              )}
            </section>
          </div>

          <aside className="sticky top-6 hidden lg:block">{bookingSummary}</aside>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-stone-200 bg-white/95 p-4 shadow-[0_-8px_30px_rgba(28,25,23,0.08)] backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="truncate text-xs text-stone-500">
              {chosenSeats.length
                ? `${chosenSeats.length} ghế · ${chosenSeats.map((seat) => seat.seat_number).join(", ")}`
                : "Chọn ghế để tiếp tục"}
            </p>
            <p className="text-lg font-extrabold text-red-700">
              {currency.format(total)}
            </p>
          </div>
          <button
            type="button"
            onClick={handleBooking}
            disabled={!selectedShowtimeData || chosenSeats.length === 0}
            className="shrink-0 rounded-xl bg-red-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-red-800 disabled:cursor-not-allowed disabled:bg-stone-300"
          >
            Tiếp tục
          </button>
        </div>
      </div>
    </main>
  );
}

function SectionHeading({
  number,
  title,
  subtitle,
  id,
}: {
  number: string;
  title: string;
  subtitle: string;
  id: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-50 text-xs font-extrabold text-red-700">
        {number}
      </span>
      <div>
        <h2 id={id} className="text-lg font-bold tracking-tight sm:text-xl">
          {title}
        </h2>
        <p className="mt-1 text-sm text-stone-500">{subtitle}</p>
      </div>
    </div>
  );
}
