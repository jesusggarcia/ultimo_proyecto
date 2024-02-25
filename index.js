const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 8181;

// Configuración de la base de datos MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'proyecto'
});

// Conexión a la base de datos
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Conexión establecida con la base de datos MySQL');
});



// Middleware para analizar solicitudes
app.use(bodyParser.urlencoded({ extended: false }));

// Ruta para servir la página principal
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

// Ruta para servir la página de inicio de sesión
app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/views/login.html');
});
app.get('/cuerpo', (req, res) => {
  res.sendFile(__dirname + '/views/cuerpo.html');
});

// Ruta para manejar el envío del formulario de inicio de sesión
// Ruta para manejar el envío del formulario de inicio de sesión
// Ruta para manejar el envío del formulario de inicio de sesión
// Ruta para manejar el envío del formulario de inicio de sesión
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (email && password) {
    const query = "SELECT nombre FROM usuarios WHERE email = ? AND password = ?";
    db.query(query, [email, password], (err, result) => {
      if (err) {
        console.error("Error al consultar en la base de datos:", err);
        res.status(500).send("Error interno del servidor");
      } else {
        if (result.length > 0) {
          console.log("Inicio de sesión exitoso");
          const nombreUsuario = result[0].nombre;
          // Almacenar el nombre de usuario en una cookie o sesión
          // Ejemplo con cookie:
          res.cookie('usuario', nombreUsuario);
          res.redirect('/cuerpo');
        } else {
          console.log("Correo electrónico o contraseña incorrectos");
          res.send('<script>alert("Correo electrónico o contraseña incorrectos"); window.location.href = "/login";</script>');
        }
      }
    });
  } else {
    res.status(400).send("Por favor, complete todos los campos");
  }
});

// Ruta para servir la página de registro
// Ruta para manejar el envío del formulario de registro
app.post('/register', (req, res) => {
  const { nombre, email, password } = req.body; // Obtener datos del cuerpo del formulario

  // Verificar si los campos no están vacíos
  if (nombre && email && password) {
    // Insertar datos en la base de datos
    const query = "INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)";
    db.query(query, [nombre, email, password], (err, result) => {
      if (err) {
        console.error("Error al insertar en la base de datos:", err);
        res.status(500).send("Error interno del servidor");
      } else {
        console.log("Datos insertados correctamente en la base de datos");
        res.redirect('/'); // Redirigir al usuario a la página principal (index.html)
      }
    });
  } else {
    res.status(400).send("Por favor, complete todos los campos");
  }
});
app.get('/register', (req, res) => {
  res.sendFile(__dirname + '/views/register.html');
});

// Ruta para manejar el cierre de sesión
app.get('/logout', (req, res) => {
  // Aquí puedes agregar la lógica para cerrar la sesión, por ejemplo:
  // req.session.destroy(); // Si estás utilizando sesiones
  res.redirect('/login'); // Redirigir al usuario a la página de inicio de sesión
});

app.get('/cuerpo', (req, res) => {
  // Obtener el nombre de usuario de la cookie o sesión
  const nombreUsuario = req.cookies.usuario; // Si estás utilizando cookies

  // Renderizar la página de cuerpo con el nombre de usuario
  res.render('cuerpo', { nombreUsuario });
});




// Ruta para servir archivos estáticos (CSS, imágenes, etc.)
app.use(express.static('public'));

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}..`);
});



