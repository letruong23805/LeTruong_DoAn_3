"use client";

export type Movie = {
  movie_id: number;
  title: string;
  poster: string;
  status: string;
  duration?: number;
  genres?: string;
};

export type Theater = {
  theater_id: number;
  name: string;
  address?: string;
};

export type Room = {
  room_id: number;
  theater_id: number;
  room_name: string;
};

export type Showtime = {
  showtime_id: number;
  movie_id: number;
  room_id: number;
  show_date: string;
  start_time: string;
  end_time: string;
  format: string;
  price: number;
};

export type Seat = {
  seat_id: number;
  seat_number: string;
  room_id: number;
  seat_type: string;
};

const posterBaseUrl = "http://localhost:3000";
const currency = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  maximumFractionDigits: 0,
});

export function MovieSelector({
  movies,
  selectedMovieId,
  onSelect,
}: {
  movies: Movie[];
  selectedMovieId: number | null;
  onSelect: (movieId: number) => void;
}) {
  return (
    <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 xl:grid-cols-4">
      {movies.map((movie) => {
        const selected = Number(movie.movie_id) === selectedMovieId;
        return (
          <button
            key={movie.movie_id}
            type="button"
            aria-pressed={selected}
            onClick={() => onSelect(Number(movie.movie_id))}
            className={`group relative overflow-hidden rounded-xl border-2 text-left transition duration-200 hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-red-100 ${
              selected
                ? "border-red-700 shadow-md shadow-red-950/10"
                : "border-transparent bg-stone-100 hover:border-stone-200"
            }`}
          >
            <div className="relative aspect-[2/3] overflow-hidden bg-stone-200">
              {movie.poster ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={`${posterBaseUrl}${movie.poster}`}
                  alt={`Poster phim ${movie.title}`}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                />
              ) : (
                <div className="flex h-full items-center justify-center px-4 text-center text-sm text-stone-500">
                  Chưa có poster
                </div>
              )}
              <span className="absolute left-2 top-2 rounded-md bg-black/65 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white backdrop-blur">
                Đang chiếu
              </span>
              {selected && (
                <span className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-red-700 text-sm font-bold text-white shadow">
                  ✓
                </span>
              )}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent p-3 pt-12">
                <h3 className="line-clamp-2 text-sm font-bold leading-5 text-white sm:text-base">
                  {movie.title}
                </h3>
                <p className="mt-1 text-xs text-white/75">
                  {movie.duration ? `${movie.duration} phút` : "Phim điện ảnh"}
                </p>
              </div>
            </div>
            <div
              className={`px-3 py-2 text-center text-xs font-bold transition ${
                selected ? "bg-red-700 text-white" : "bg-white text-stone-600"
              }`}
            >
              {selected ? "Đang chọn" : "Chọn phim"}
            </div>
          </button>
        );
      })}
    </div>
  );
}

export function ShowtimeSelector({
  enabled,
  theaters,
  rooms,
  dates,
  showtimes,
  selectedTheaterId,
  selectedRoomId,
  selectedDate,
  selectedShowtimeId,
  onTheaterChange,
  onRoomChange,
  onDateChange,
  onShowtimeChange,
}: {
  enabled: boolean;
  theaters: Theater[];
  rooms: Room[];
  dates: string[];
  showtimes: Showtime[];
  selectedTheaterId: number | null;
  selectedRoomId: number | null;
  selectedDate: string | null;
  selectedShowtimeId: number | null;
  onTheaterChange: (id: number | null) => void;
  onRoomChange: (id: number | null) => void;
  onDateChange: (date: string) => void;
  onShowtimeChange: (id: number) => void;
}) {
  return (
    <div className="mt-6 space-y-5">
      {enabled && theaters.length === 0 && (
        <p className="rounded-xl bg-stone-50 p-4 text-sm text-stone-500">
          Hiện chưa có suất chiếu sắp tới cho phim này.
        </p>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-stone-500">
            Rạp chiếu
          </span>
          <select
            value={selectedTheaterId ?? ""}
            disabled={!enabled}
            onChange={(event) =>
              onTheaterChange(
                event.target.value ? Number(event.target.value) : null,
              )
            }
            className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-800 outline-none transition focus:border-red-500 focus:ring-4 focus:ring-red-50 disabled:cursor-not-allowed disabled:bg-stone-50"
          >
            <option value="">
              {enabled ? "Chọn rạp gần bạn" : "Chọn phim trước"}
            </option>
            {theaters.map((theater) => (
              <option key={theater.theater_id} value={theater.theater_id}>
                {theater.name}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-stone-500">
            Phòng chiếu
          </span>
          <select
            value={selectedRoomId ?? ""}
            disabled={!selectedTheaterId}
            onChange={(event) =>
              onRoomChange(event.target.value ? Number(event.target.value) : null)
            }
            className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-800 outline-none transition focus:border-red-500 focus:ring-4 focus:ring-red-50 disabled:cursor-not-allowed disabled:bg-stone-50"
          >
            <option value="">
              {selectedTheaterId ? "Chọn phòng chiếu" : "Chọn rạp trước"}
            </option>
            {rooms.map((room) => (
              <option key={room.room_id} value={room.room_id}>
                {room.room_name || `Phòng ${room.room_id}`}
              </option>
            ))}
          </select>
        </label>
      </div>

      {enabled && selectedTheaterId && selectedRoomId && (
        <>
          {dates.length > 0 ? (
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-stone-500">
                Ngày chiếu
              </p>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {dates.map((date) => (
                  <button
                    key={date}
                    type="button"
                    aria-pressed={selectedDate === date}
                    onClick={() => onDateChange(date)}
                    className={`shrink-0 rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${
                      selectedDate === date
                        ? "border-red-700 bg-red-700 text-white shadow-sm"
                        : "border-stone-200 bg-white text-stone-600 hover:border-red-300 hover:text-red-700"
                    }`}
                  >
                    {formatDate(date)}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <p className="rounded-xl bg-stone-50 p-4 text-sm text-stone-500">
              Chưa có suất chiếu cho phim và phòng này.
            </p>
          )}

          {selectedDate && (
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-stone-500">
                Suất chiếu
              </p>
              {showtimes.length ? (
                <div className="flex flex-wrap gap-2">
                  {showtimes.map((showtime) => {
                    const selected =
                      Number(showtime.showtime_id) === selectedShowtimeId;
                    return (
                      <button
                        key={showtime.showtime_id}
                        type="button"
                        aria-pressed={selected}
                        onClick={() =>
                          onShowtimeChange(Number(showtime.showtime_id))
                        }
                        className={`min-w-28 rounded-xl border px-3 py-2.5 text-left transition ${
                          selected
                            ? "border-red-700 bg-red-50 text-red-800 ring-2 ring-red-100"
                            : "border-stone-200 bg-white text-stone-700 hover:border-red-300"
                        }`}
                      >
                        <span className="block text-base font-extrabold">
                          {showtime.start_time.slice(0, 5)}
                        </span>
                        <span className="mt-0.5 block text-[11px] text-stone-500">
                          {showtime.format || "2D"} ·{" "}
                          {currency.format(Number(showtime.price) || 0)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-stone-500">
                  Không có suất chiếu trong ngày này.
                </p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export function SeatMap({
  seats,
  bookedSeatIds,
  selectedSeatIds,
  onToggleSeat,
}: {
  seats: Seat[];
  bookedSeatIds: number[];
  selectedSeatIds: number[];
  onToggleSeat: (seatId: number) => void;
}) {
  const rows = new Map<string, Seat[]>();
  for (const seat of seats) {
    const row = seat.seat_number.match(/^([a-z]+)/i)?.[1]?.toUpperCase() ?? "?";
    rows.set(row, [...(rows.get(row) ?? []), seat]);
  }
  const sortedRows = [...rows.entries()].sort(([a], [b]) =>
    a.localeCompare(b, "vi", { numeric: true }),
  );

  return (
    <div className="mt-6">
      <div className="mx-auto max-w-xl px-4">
        <div className="h-2 rounded-[50%] bg-gradient-to-r from-transparent via-red-300 to-transparent shadow-[0_7px_16px_rgba(185,28,28,0.2)]" />
        <p className="mt-3 text-center text-[10px] font-bold uppercase tracking-[0.35em] text-stone-400">
          Màn chiếu
        </p>
      </div>

      <div className="mt-7 flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs text-stone-600">
        <SeatLegend className="bg-emerald-100 ring-emerald-200" label="Ghế thường" />
        <SeatLegend className="bg-violet-100 ring-violet-200" label="Ghế VIP" />
        <SeatLegend className="bg-amber-300 ring-amber-400" label="Đang chọn" />
        <SeatLegend className="bg-red-700 ring-red-800" label="Đã đặt" />
      </div>

      {seats.length ? (
        <div className="mt-6 overflow-x-auto pb-2">
          <div className="mx-auto w-max min-w-full space-y-2 px-2 sm:px-8">
            {sortedRows.map(([row, rowSeats]) => (
              <div key={row} className="flex items-center justify-center gap-2">
                <span className="w-5 shrink-0 text-center text-xs font-bold text-stone-400">
                  {row}
                </span>
                <div className="flex gap-1.5">
                  {rowSeats
                    .sort((a, b) =>
                      a.seat_number.localeCompare(b.seat_number, "vi", {
                        numeric: true,
                      }),
                    )
                    .map((seat, index) => {
                      const seatId = Number(seat.seat_id);
                      const booked = bookedSeatIds.includes(seatId);
                      const selected = selectedSeatIds.includes(seatId);
                      const vip = seat.seat_type?.toLowerCase() === "vip";
                      return (
                        <button
                          key={seat.seat_id}
                          type="button"
                          aria-label={`Ghế ${seat.seat_number}, ${
                            booked ? "đã đặt" : selected ? "đang chọn" : vip ? "VIP, còn trống" : "còn trống"
                          }`}
                          aria-pressed={selected}
                          disabled={booked}
                          onClick={() => onToggleSeat(seatId)}
                          className={`relative flex h-9 w-9 shrink-0 items-center justify-center rounded-t-lg rounded-b-md text-[10px] font-bold transition hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-stone-400 focus:ring-offset-2 sm:h-10 sm:w-10 ${
                            booked
                              ? "cursor-not-allowed bg-red-700 text-white opacity-75"
                              : selected
                                ? "bg-amber-300 text-amber-950 shadow-sm"
                                : vip
                                  ? "bg-violet-100 text-violet-800 hover:bg-violet-200"
                                  : "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                          } ${index === Math.ceil(rowSeats.length / 2) - 1 ? "mr-4 sm:mr-7" : ""}`}
                        >
                          {seat.seat_number.match(/\d+/)?.[0] ?? seat.seat_number}
                        </button>
                      );
                    })}
                </div>
                <span className="w-5 shrink-0 text-center text-xs font-bold text-stone-400">
                  {row}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="mt-6 text-center text-sm text-stone-500">
          Phòng chiếu này chưa có sơ đồ ghế.
        </p>
      )}
      <p className="mt-4 text-center text-xs text-stone-400">
        Chọn một hoặc nhiều ghế · Nhấn lại ghế để bỏ chọn
      </p>
    </div>
  );
}

function SeatLegend({
  className,
  label,
}: {
  className: string;
  label: string;
}) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className={`h-3.5 w-3.5 rounded-t-md rounded-b-sm ring-1 ${className}`} />
      {label}
    </span>
  );
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("vi-VN", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
  }).format(new Date(`${date.slice(0, 10)}T00:00:00`));
}
