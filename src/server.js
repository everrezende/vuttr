const app = require('express')();
const cors = require('cors');
const bodyParser = require('body-parser');
const routes = require('./routes');
const expressValidator = require('express-validator');
const swaggerDefinitions = require('./config/swagger-definition');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(expressValidator());

swaggerDefinitions(app);

app.get('/', (req, res) => {
	return res.send('OK');
});

app.use('/api', routes);

app.listen(3000, () => {
	console.log('Servidor rodando na porta 3000');
});
