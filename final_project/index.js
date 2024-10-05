const express = require('express');
const app = express();
const port = 3000;

// Middleware para parsear el cuerpo de las solicitudes JSON
app.use(express.json());

// Suponiendo que tienes un array de libros y reseñas
const books = [
  { isbn: '978-3-16-148410-0', author: 'Chinua Achebe', title: 'Things Fall Apart' },
  { isbn: '978-3-16-148410-1', author: 'Hans Christian Andersen', title: 'Fairy Tales' },
  { isbn: '978-3-16-148410-2', author: 'Dante Alighieri', title: 'The Divine Comedy' },
];

const reviews = [
  { isbn: '978-3-16-148410-0', review: 'Reseña del libro.' },
  { isbn: '978-3-16-148410-1', review: 'Una obra maestra.' },
];

// Ruta para la raíz
app.get('/', (req, res) => {
  res.send('¡Bienvenido a la API de libros!');
});

// Ruta para obtener todos los libros (función asíncrona)
app.get('/books', async (req, res) => {
  try {
    const allBooks = await new Promise((resolve) => {
      setTimeout(() => {
        resolve(books);
      }, 1000); // 1 segundo de espera
    });
    res.json(allBooks);
  } catch (error) {
    res.status(500).send('Error al obtener los libros');
  }
});

// Ruta para buscar libros por ISBN usando Promesas
app.get('/books/isbn/:isbn', (req, res) => {
  const { isbn } = req.params;

  new Promise((resolve, reject) => {
    const book = books.find(b => b.isbn === isbn);
    if (book) {
      resolve(book);
    } else {
      reject('Libro no encontrado');
    }
  })
    .then(book => {
      res.json(book);
    })
    .catch(error => {
      res.status(404).send(error);
    });
});

// Ruta para obtener todos los libros por autor
app.get('/books/author/:author', (req, res) => {
  const { author } = req.params;
  const authorBooks = books.filter(b => b.author.toLowerCase() === author.toLowerCase());
  
  if (authorBooks.length > 0) {
    res.json(authorBooks);
  } else {
    res.status(404).send('No se encontraron libros de este autor');
  }
});

// Ruta para buscar libros por título
app.get('/books/title/:title', (req, res) => {
  const { title } = req.params;
  const titleBooks = books.filter(b => b.title.toLowerCase().includes(title.toLowerCase()));
  
  if (titleBooks.length > 0) {
    res.json(titleBooks);
  } else {
    res.status(404).send('No se encontraron libros con este título');
  }
});

// Ruta para obtener reseñas de un libro por ISBN
app.get('/books/:isbn/review', (req, res) => {
  const { isbn } = req.params;
  const review = reviews.find(r => r.isbn === isbn);
  
  if (review) {
    res.json(review);
  } else {
    res.status(404).send('Reseña no encontrada');
  }
});

// Ruta para registrar un nuevo usuario
app.post('/register', (req, res) => {
  const { username, password } = req.body;
  res.status(201).json({ message: 'Usuario registrado exitosamente.' });
});

// Ruta para iniciar sesión
app.post('/customer/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'test' && password === 'test') {
    return res.status(200).json({ message: 'Customer Successfully Logged In' });
  } else {
    return res.status(401).json({ message: 'Credenciales incorrectas' });
  }
});

// Ruta para añadir/modificar una reseña de un libro por ISBN
app.put('/customer/auth/review/:isbn', (req, res) => {
  const { isbn } = req.params;
  const { review } = req.query;

  const existingReview = reviews.find(r => r.isbn === isbn);

  if (existingReview) {
    existingReview.review = review;
    res.json({ message: `La reseña para el libro con ISBN ${isbn} ha sido actualizada.` });
  } else {
    reviews.push({ isbn, review });
    res.status(201).json({ message: `La reseña para el libro con ISBN ${isbn} ha sido añadida.` });
  }
});

// Ruta para eliminar una reseña de un libro por ISBN
app.delete('/customer/auth/review/:isbn', (req, res) => {
  const { isbn } = req.params;
  const { review } = req.query;

  const index = reviews.findIndex(r => r.isbn === isbn && r.review === review);
  
  if (index !== -1) {
    reviews.splice(index, 1);
    return res.status(200).json({ message: `Reseña para el ISBN ${isbn} eliminada.` });
  } else {
    return res.status(404).send('Reseña no encontrada');
  }
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});

