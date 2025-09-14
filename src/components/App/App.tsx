import { useState } from "react";
import { useEffect } from "react";

import { useQuery } from "@tanstack/react-query";
import toast, { Toaster } from "react-hot-toast";
import type { Movie } from "../../types/movie";
import { fetchMovies } from "../../services/movieService";

import ReactPaginate from "react-paginate";

import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";

import css from "./App.module.css";

export default function App() {
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ["movies", query, currentPage],
    queryFn: () => fetchMovies(query, currentPage),
    enabled: query.length > 0,
    placeholderData: (previousData) => previousData,
  });

  const totalPages = data?.total_pages ?? 0;
  const movies = data?.results ?? [];

  useEffect(() => {
    if (isSuccess && data?.results?.length === 0) {
      toast.error("No movies found for your request.");
    }
  }, [isSuccess, data]);

  const handleSearch = async (searchQuery: string) => {
    setQuery(searchQuery);
    setCurrentPage(1);
  };

  const handleSelectMovie = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const handleCloseModal = () => {
    setSelectedMovie(null);
  };

  return (
    <div className={css.app}>
      <Toaster />

      <SearchBar onSubmit={handleSearch} />

      {isSuccess && totalPages > 1 && (
        <ReactPaginate
          pageCount={totalPages}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          onPageChange={({ selected }) => setCurrentPage(selected + 1)}
          forcePage={currentPage - 1}
          containerClassName={css.pagination}
          activeClassName={css.active}
          nextLabel="→"
          previousLabel="←"
        />
      )}

      {isLoading && <Loader />}
      {isError && <ErrorMessage />}

      {!isLoading && !isError && movies.length > 0 && (
        <>
          <MovieGrid
            movies={movies}
            onSelect={handleSelectMovie}
          />
        </>
      )}

      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
