import { useState } from 'react';
import ReactDOM from 'react-dom';

import './App.css';

const Book = ({ book, onClick }) => {
  const handleClick = () => {
    onClick(book.id);
  };

  return (
    <div className={`book ${book.open ? 'open' : ''}`} onClick={handleClick}>
      <div className="front">
        <h3>{book.volumeInfo.title}</h3>
        <p>{book.volumeInfo.authors && book.volumeInfo.authors.join(', ')}</p>
      </div>
      <div className="details">
        <p>{book.volumeInfo.publishedDate}</p>
        <p>{book.volumeInfo.description}</p>
      </div>
    </div>
  );
};

const BooksList = ({ books, onBookClick }) => {
  return (
    <div className="books-list">
      {books.map((book) => (
        <Book key={book.id} book={book} onClick={onBookClick} />
      ))}
    </div>
  );
};

const App = () => {
  const [books, setBooks] = useState([]);
  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);

  const fetchData = async () => {
    try {
      const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}`);
      const data = await response.json();
      const booksData = data.items.map((item) => ({
        id: item.id,
        volumeInfo: item.volumeInfo,
        open: false,
      }));
      setBooks(booksData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setSearching(false);
    }
  };

  const handleSearch = () => {
    setSearching(true);
    fetchData();
  };

  const handleBookClick = (bookId) => {
    setBooks((prevBooks) =>
      prevBooks.map((book) =>
        book.id === bookId ? { ...book, open: !book.open } : book
      )
    );
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="app">
      <header>
      <button className="refresh-button" onClick={handleRefresh}>
        <h1>Google Books App</h1>
      </button>
      </header>

      <main>
        <div className="search-container">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Search for books..."
          />
          <button onClick={handleSearch} disabled={searching}>
            {searching ? 'Searching...' : 'Search'}
          </button>
        </div>

        {books.length > 0 ? (
          <BooksList books={books} onBookClick={handleBookClick} />
        ) : (
          searching ? null : <p>No books found.</p>
        )}
      </main>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));

export default App;
