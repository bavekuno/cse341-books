import {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  authorExists,
} from '../models/books.js';

const isNonEmptyString = (value) => {
  return typeof value === 'string' && value.trim().length > 0;
};

const isValidPublicationDate = (value) => {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
};

const hasOnlyKeys = (obj, allowedKeys) => {
  return Object.keys(obj).every((key) => {
    return allowedKeys.includes(key);
  });
};

const getBooksHandler = async (req, res) => {
  try {
    const books = await getAllBooks();
    return res.status(200).json(books);
  } catch (error) {
    console.error('Failed to retrieve books:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const getBookByIdHandler = async (req, res) => {
  try {
    const book = await getBookById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    return res.status(200).json(book);
  } catch (error) {
    console.error('Failed to retrieve book:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const createBookHandler = async (req, res) => {
  try {
    if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
      return res.status(400).json({ message: 'Request body must be a JSON object' });
    }

    if (!hasOnlyKeys(req.body, ['id', 'authorId', 'title', 'publicationDate'])) {
      return res.status(400).json({ message: 'Unsupported field supplied' });
    }

    const { id, authorId, title, publicationDate } = req.body;

    if (
      !isNonEmptyString(id) ||
      !isNonEmptyString(authorId) ||
      !isNonEmptyString(title) ||
      publicationDate === undefined
    ) {
      return res.status(400).json({ message: 'id, authorId, title, and publicationDate are required' });
    }

    if (!isValidPublicationDate(publicationDate)) {
      return res.status(400).json({ message: 'publicationDate must be a real date in YYYY-MM-DD format' });
    }

    const existing = await getBookById(id);
    if (existing) {
      return res.status(409).json({ message: 'Book ID already exists' });
    }

    const validAuthor = await authorExists(authorId);
    if (!validAuthor) {
      return res.status(400).json({ message: 'authorId does not match an existing author' });
    }

    const book = await createBook({ id, authorId, title, publicationDate });
    return res.status(201).json(book);
  } catch (error) {
    console.error('Failed to create book:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const updateBookHandler = async (req, res) => {
  try {
    if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
      return res.status(400).json({ message: 'Request body must be a JSON object' });
    }

    if (!hasOnlyKeys(req.body, ['authorId', 'title', 'publicationDate'])) {
      return res.status(400).json({ message: 'Request body must contain only authorId, title, and publicationDate' });
    }

    const { authorId, title, publicationDate } = req.body;

    if (!isNonEmptyString(authorId) || !isNonEmptyString(title) || publicationDate === undefined) {
      return res.status(400).json({ message: 'authorId, title, and publicationDate are required' });
    }

    if (!isValidPublicationDate(publicationDate)) {
      return res.status(400).json({ message: 'publicationDate must be a real date in YYYY-MM-DD format' });
    }

    const existing = await getBookById(req.params.id);
    if (!existing) {
      return res.status(404).json({ message: 'Book not found' });
    }

    const validAuthor = await authorExists(authorId);
    if (!validAuthor) {
      return res.status(400).json({ message: 'authorId does not match an existing author' });
    }

    const updated = await updateBook(req.params.id, { authorId, title, publicationDate });
    return res.status(200).json(updated);
  } catch (error) {
    console.error('Failed to update book:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const deleteBookHandler = async (req, res) => {
  try {
    const existing = await getBookById(req.params.id);
    if (!existing) {
      return res.status(404).json({ message: 'Book not found' });
    }

    await deleteBook(req.params.id);
    return res.status(204).send();
  } catch (error) {
    console.error('Failed to delete book:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export {
  getBooksHandler,
  getBookByIdHandler,
  createBookHandler,
  updateBookHandler,
  deleteBookHandler,
};
