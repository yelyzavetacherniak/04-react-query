import css from "./MovieGrid.module.css";
import type { Movie } from "../../types/movie";

interface MovieGridProps {
  onSelect: (movie: Movie) => void;
  movies: Movie[];
}

export default function MovieGrid({ onSelect, movies }: MovieGridProps) {
  if (movies.length === 0) return null;

  return (
    <ul className={css.grid}>
      {movies
        .filter((movie) => movie.poster_path || movie.backdrop_path)
        .map((movie) => {
          const imageUrl = movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : `https://image.tmdb.org/t/p/w500${movie.backdrop_path}`;

          return (
            <li
              key={movie.id}
              onClick={() => onSelect(movie)}
            >
              <div className={css.card}>
                <img
                  className={css.image}
                  src={imageUrl}
                  alt={movie.title}
                  loading="lazy"
                />
                <h2 className={css.title}>{movie.title}</h2>
              </div>
            </li>
          );
        })}
    </ul>
  );
}
