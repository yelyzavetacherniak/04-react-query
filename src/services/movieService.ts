import axios from "axios";
import type { Movie } from "../types/movie";

const API_URL = "https://api.themoviedb.org/3/search/movie";
const TMDB_TOKEN = import.meta.env.VITE_TMDB_TOKEN;

interface MoviesResponse {
  results: Movie[];
  total_pages: number;
  page: number;
}

export async function fetchMovies(
  query: string,
  page: number
): Promise<MoviesResponse> {
  try {
    const response = await axios.get<MoviesResponse>(API_URL, {
      params: {
        query,
        language: "en-US",
        page,
        include_adult: false,
      },
      headers: {
        Authorization: `Bearer ${TMDB_TOKEN}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching movies:", error);
    throw error;
  }
}
