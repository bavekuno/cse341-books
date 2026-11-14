import {
  getAllAuthors,
  getAuthorById,
  createAuthor,
  updateAuthor,
  deleteAuthor,
  authorHasBooks,
} from '../models/authors.js';

const isNonEmptyString = (value) => {
  return typeof value === 'string' && value.trim().length > 0;
};

const isValidBirthYear = (value) => {
  const currentYear = new Date().getFullYear();
  return Number.isInteger(value) && value >= 1000 && value <= currentYear;
};

const hasOnlyKeys = (obj, allowedKeys) => {
  return Object.keys(obj).every((key) => {
    return allowedKeys.includes(key);
  });
};

const getAuthorsHandler = async (req, res) => {
  try {
    const authors = await getAllAuthors();
    return res.status(200).json(authors);
  } catch (error) {
    console.error('Failed to retrieve authors:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const getAuthorByIdHandler = async (req, res) => {
  try {
    const author = await getAuthorById(req.params.id);
    if (!author) {
      return res.status(404).json({ message: 'Author not found' });
    }
    return res.status(200).json(author);
  } catch (error) {
    console.error('Failed to retrieve author:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const createAuthorHandler = async (req, res) => {
  try {
    if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
      return res.status(400).json({ message: 'Request body must be a JSON object' });
    }

    if (!hasOnlyKeys(req.body, ['id', 'name', 'birthYear'])) {
      return res.status(400).json({ message: 'Unsupported field supplied' });
    }

    const { id, name, birthYear } = req.body;

    if (!isNonEmptyString(id) || !isNonEmptyString(name) || birthYear === undefined) {
      return res.status(400).json({ message: 'id, name, and birthYear are required' });
    }

    if (!isValidBirthYear(birthYear)) {
      return res.status(400).json({ message: 'birthYear must be an integer from 1000 through the current year' });
    }

    const existing = await getAuthorById(id);
    if (existing) {
      return res.status(409).json({ message: 'Author ID already exists' });
    }

    const author = await createAuthor({ id, name, birthYear });
    return res.status(201).json(author);
  } catch (error) {
    console.error('Failed to create author:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const updateAuthorHandler = async (req, res) => {
  try {
    if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
      return res.status(400).json({ message: 'Request body must be a JSON object' });
    }

    if (!hasOnlyKeys(req.body, ['name', 'birthYear'])) {
      return res.status(400).json({ message: 'Request body must contain only name and birthYear' });
    }

    const { name, birthYear } = req.body;

    if (!isNonEmptyString(name) || birthYear === undefined) {
      return res.status(400).json({ message: 'name and birthYear are required' });
    }

    if (!isValidBirthYear(birthYear)) {
      return res.status(400).json({ message: 'birthYear must be an integer from 1000 through the current year' });
    }

    const existing = await getAuthorById(req.params.id);
    if (!existing) {
      return res.status(404).json({ message: 'Author not found' });
    }

    const updated = await updateAuthor(req.params.id, { name, birthYear });
    return res.status(200).json(updated);
  } catch (error) {
    console.error('Failed to update author:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const deleteAuthorHandler = async (req, res) => {
  try {
    const existing = await getAuthorById(req.params.id);
    if (!existing) {
      return res.status(404).json({ message: 'Author not found' });
    }

    const hasBooks = await authorHasBooks(req.params.id);
    if (hasBooks) {
      return res.status(409).json({ message: 'Author cannot be deleted because books still reference this author' });
    }

    await deleteAuthor(req.params.id);
    return res.status(204).send();
  } catch (error) {
    console.error('Failed to delete author:', error.message);
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
