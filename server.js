const express = require('express');
const cookieParser = require('cookie-parser');
const checkCookies = require('./middleware/checkCookies'); 
const mysql = require('mysql');
const app = express();
const PORT = 5000;

const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'sistema_minadora'
});

con.connect((err) => {
    if (err) {
        console.log('Error connecting to Database');
        return
    }

    console.log("Connection Established");
});

app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(express.urlencoded({
    extended: true
}));
app.use(cookieParser());

app.get('/', (req, res) => {
    res.render('view/template_login', {
        page: '../index'
    });
});

app.get('/register', (req, res) => {
    res.render('view/template_login', {
        page: './register_form'
    })
})

app.get('/home', checkCookies, function(req, res) {   
    let { nombre, minadoras, nombre_usuario } = req.cookies;
    

    con.query(`SELECT * FROM minadora WHERE nombre_usuario = '${nombre_usuario}'`, (err, result) => {        
        if (err) throw err;

        const countActiveMiner = () => {
            let count = 0;

            result.forEach(element => {
                if (element.estado_encendido == 1) {
                    count++;
                }
            });

            return count;
        }

        res.render('view/template', {
            miner: result,
            minadorasActivas: countActiveMiner(),
            minadoras: minadoras,
            fullname: nombre,
            minadora: 'side__active',
            active: 'Minadoras',
            page: './home',
            filter: true
        });
    });    
});

app.get('/toggle/:miner', checkCookies, function(req, res) {
    let id = req.params.miner;
    con.query(`SELECT estado_encendido FROM minadora WHERE codigo = '${id}'`, (err, result) => {
        if (err) throw err;

        result[0].estado_encendido ^= 1;

        con.query(`UPDATE minadora SET estado_encendido = '${result[0].estado_encendido}' WHERE codigo = '${id}'`, (err, resultado) => {
            res.redirect('/home');
        });
    });
});

app.get('/renta', checkCookies,(req, res) => {
    let { nombre, minadoras, nombre_usuario } = req.cookies;

    con.query(`SELECT * FROM renta INNER JOIN minadora ON renta.codigo_minadora = minadora.codigo WHERE codigo_usuario = '${nombre_usuario}'`, (err, result) => {
        if (err) throw err;

        con.query(`SELECT tasa_cambio.nombre, tasa_cambio.valor, usuario.nombre_usuario FROM usuario INNER JOIN tasa_cambio ON usuario.codigo_tasacambio = tasa_cambio.codigo WHERE usuario.nombre_usuario = '${nombre_usuario}'`, (err, resultado) => {
            if (err) throw err;
            
            const calcularTotalRentas = () => {
                let total = 0;
                result.forEach(element => {
                    total = total + element.consumo_acumulado * resultado[0].valor;
                });

                return total.toFixed(2);
            };

            res.render('view/template', {
                totalRentas: {
                    nombre: resultado[0].nombre,
                    valor: calcularTotalRentas(),
                },
                rentas: result,
                minadoras: minadoras,
                fullname: nombre,
                renta: 'side__active',
                active: 'Rentas',
                page: './renta'
            });
        });
    });

    
})

app.get('/tasacambio', checkCookies,(req, res) => {
    let { nombre, minadoras, nombre_usuario } = req.cookies;

    con.query(`SELECT * FROM tasa_cambio`, (err, result) => {
        if (err) throw err;

        con.query(`SELECT codigo_tasacambio FROM usuario WHERE nombre_usuario = '${nombre_usuario}'`, (err, resultado) => {
            if (err) throw err;
            
            res.render('view/template', {
                tasaActiva: resultado,
                tasas: result,
                minadoras: minadoras,
                fullname: nombre,
                tasacambio: 'side__active',
                active: 'Tasa de cambio',
                page: './tasa_cambio'
            });
        });
    });
})

app.get('/change_tasa/:id', checkCookies, (req, res) => {
    let id = req.params.id;
    let { nombre_usuario } = req.cookies;

    con.query(`UPDATE usuario SET codigo_tasacambio = '${id}' WHERE nombre_usuario = '${nombre_usuario}'`, (err, result) => {
        if (err) throw err;

        res.redirect('/tasacambio');
    });
});

// Login Form request handle
app.post('/login', (req, res) => {
    let { username, password } = req.body;

    con.query(`SELECT * FROM usuario WHERE nombre_usuario = '${username}' && password = '${password}'`, (err, result) => {
        if (err) throw err;
        if (result.length < 1) {
            res.render('view/template_login', {
                page: '../index',
                statement: 'Usuario o contraseña no válido, intente de nuevo'
            });            
        } else {
            let sentence = `SELECT minadora.codigo AS codigo FROM minadora WHERE nombre_usuario = 'ricky88'`;
            let expireTime = 86400 * 1000;

            
            con.query(sentence, (err, resultminadora) => {
                if (err) throw err;          
                
                res.cookie('minadoras', resultminadora.length, {
                    maxAge: expireTime
                });
                res.cookie('nombre', result[0].nombre_completo, {
                    maxAge: expireTime
                });
                res.cookie('nombre_usuario', result[0].nombre_usuario, {
                    maxAge: expireTime
                });
                res.redirect('/home'); 
            });              
        }        
    });
});

app.listen(PORT, console.log('Se ha iniciado el servidor'));