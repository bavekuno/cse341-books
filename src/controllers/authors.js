import {
  getAllAuthors as getAllAuthorsFromDb,
  getAuthorById as getAuthorByIdFromDb,
  createAuthor as createAuthorFromDb,
  updateAuthor as updateAuthorFromDb,
  deleteAuthor as deleteAuthorFromDb,
  authorHasBooks,
} from '../models/authors.js';

const getAuthorsHandler = async (req, res) => {
  try {
    const authors = await getAllAuthorsFromDb();
    return res.status(200).json(authors);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const getAuthorByIdHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const author = await getAuthorByIdFromDb(id);

    if (!author) {
      return res.status(404).json({ message: 'Author not found' });
    }

    return res.status(200).json(author);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const createAuthorHandler = async (req, res) => {
  try {
    const { id, name, birthYear } = req.body;

    if (!id || !name || birthYear === undefined) {
      return res.status(400).json({ message: 'Missing required author fields' });
    }

    const existingAuthor = await getAuthorByIdFromDb(id);
    if (existingAuthor) {
      return res.status(409).json({ message: 'Author ID already exists' });
    }

    const createdAuthor = await createAuthorFromDb({ id, name, birthYear });
    return res.status(201).json(createdAuthor);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const updateAuthorHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, birthYear } = req.body;

    if (!name || birthYear === undefined) {
      return res.status(400).json({ message: 'Missing required author fields' });
    }

    const existingAuthor = await getAuthorByIdFromDb(id);
    if (!existingAuthor) {
      return res.status(404).json({ message: 'Author not found' });
    }

    const updatedAuthor = await updateAuthorFromDb(id, { name, birthYear });
    return res.status(200).json(updatedAuthor);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const deleteAuthorHandler = async (req, res) => {
  try {
    const { id } = req.params;

    const existingAuthor = await getAuthorByIdFromDb(id);
    if (!existingAuthor) {
      return res.status(404).json({ message: 'Author not found' });
    }

    const hasBooks = await authorHasBooks(id);
    if (hasBooks) {
      return res.status(409).json({ message: 'Author cannot be deleted because books still reference this author' });
    }

    await deleteAuthorFromDb(id);
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export {
  getAuthorsHandler,
  getAuthorByIdHandler,
  createAuthorHandler,
  updateAuthorHandler,
  deleteAuthorHandler,
};