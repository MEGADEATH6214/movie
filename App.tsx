import React, { useState } from 'react';
import { SafeAreaView, Text, TextInput, Button, FlatList, View, StyleSheet, Image, Alert, TouchableOpacity } from 'react-native';
import axios from 'axios';

const API_KEY = '7fe741f0'; // Replace with your OMDB API key

type Movie = {
  Title: string;
  Year: string;
  imdbID: string;
  Poster: string;
};

type MovieDetails = {
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Poster: string;
  Ratings: { Source: string; Value: string }[];
  imdbRating: string;
  imdbVotes: string;
};

export default function App() {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<MovieDetails | null>(null);

  // Function to search for movies
  const searchMovies = async () => {
    if (!query.trim()) return; // Avoid search if query is empty

    setLoading(true);
    try {
      const encodedQuery = encodeURIComponent(query.trim());
      const response = await axios.get(`http://www.omdbapi.com/?s=${encodedQuery}&apikey=${API_KEY}`);

      // Check if no movies found
      if (response.data.Response === 'False') {
        Alert.alert('No movies found!');
        setMovies([]);
      } else {
        setMovies(response.data.Search);
      }
    } catch (error) {
      console.error('Error fetching data: ', error);
      Alert.alert('Error fetching data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch movie details by IMDb ID
  const getMovieDetails = async (imdbID: string) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://www.omdbapi.com/?i=${imdbID}&apikey=${API_KEY}`);
      
      // Handle response when the movie data is returned successfully
      if (response.data.Response === 'False') {
        Alert.alert('Error fetching movie details!');
      } else {
        setSelectedMovie(response.data);
      }
    } catch (error) {
      console.error('Error fetching movie details: ', error);
      Alert.alert('Error fetching movie details. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Function to go back to search results
  const goBackToSearch = () => {
    setSelectedMovie(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Movie Search</Text>

      <TextInput
        style={styles.input}
        placeholder="Search for a movie..."
        value={query}
        onChangeText={setQuery}
      />

      <Button title="Search" onPress={searchMovies} disabled={loading} />
      {loading && <Text>Loading...</Text>}

      {selectedMovie ? (
        // Show detailed view for selected movie
        <View style={styles.movieDetails}>
          <Button title="Back to Search" onPress={goBackToSearch} />
          <Text style={styles.movieTitle}>{selectedMovie.Title} ({selectedMovie.Year})</Text>
          <Text>Rating: {selectedMovie.imdbRating}</Text>
          <Text>Plot: {selectedMovie.Plot}</Text>
          <Text>Actors: {selectedMovie.Actors}</Text>
          <Image source={{ uri: selectedMovie.Poster }} style={styles.poster} />
        </View>
      ) : (
        // Show search results
        <FlatList
          data={movies}
          keyExtractor={(item) => item.imdbID}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => getMovieDetails(item.imdbID)}>
              <View style={styles.movieItem}>
                <Text style={styles.movieTitle}>
                  {item.Title} ({item.Year})
                </Text>
                {item.Poster && item.Poster !== 'N/A' && (
                  <Image source={{ uri: item.Poster }} style={styles.poster} />
                )}
              </View>
            </TouchableOpacity>
          )}
          style={styles.list}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
  },
  list: {
    width: '100%',
    marginTop: 20,
  },
  movieItem: {
    marginBottom: 15,
    alignItems: 'center',
  },
  movieTitle: {
    fontSize: 18,
    fontWeight: '500',
  },
  poster: {
    width: 100,
    height: 150,
    marginTop: 10,
  },
  movieDetails: {
    padding: 20,
    alignItems: 'center',
  },
});
