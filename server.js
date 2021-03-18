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
    

    con.query(`SELECT * FROM minadora ${ nombre_usuario != 'admin' ? `WHERE nombre_usuario = '${nombre_usuario}'` : '' }`, (err, result) => {        
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
            minadoras: nombre_usuario != 'admin' ? minadoras : result.length,
            fullname: nombre,
            minadora: 'side__active',
            active: 'Minadoras',
            page: './home',
            filter: true
        });
    });    
});

// Minadora operations
app.get('/toggle/:miner', checkCookies, function(req, res) {
    let id = req.params.miner;

    con.query(`SELECT * FROM minadora WHERE codigo = '${id}'`, (err, result) => {
        if (err) throw err;

        result[0].estado_encendido ^= 1;
        String.prototype.toHHMMSS = function () {
            var sec_num = parseInt(this, 10); // don't forget the second param
            var hours   = Math.floor(sec_num / 3600);
            var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
            var seconds = sec_num - (hours * 3600) - (minutes * 60);
        
            if (hours   < 10) {hours   = "0"+hours;}
            if (minutes < 10) {minutes = "0"+minutes;}
            if (seconds < 10) {seconds = "0"+seconds;}
            return hours+':'+minutes+':'+seconds;
        }

        let segundos_diferencia = Math.abs(result[0].ultima_hora_encendido - new Date()) / 1000;
        let horas_diferencias_fecha = (segundos_diferencia / 3600).toString().toHHMMSS();
        let consumo_acumulado = (segundos_diferencia / 3600) * result[0].consumo_electrico;
        let currentDate = new Date().toLocaleString();
        let fecha = currentDate.split(" ")[0];
        let hora = currentDate.split(" ")[1];
            fecha = fecha.split("/").reverse().join("-");
        let fechaConhora = fecha + " " + hora;

        con.query(`UPDATE minadora SET estado_encendido = '${result[0].estado_encendido}' ${ (result[0].estado_encendido == 1) ? `, ultima_hora_encendido = '${fechaConhora}'` : "" } ${ (result[0].estado_encendido == 0) ? `, duracion_ultima_hora_encendido = '${horas_diferencias_fecha}'` : "" } WHERE codigo = '${id}'`, (err, resultado) => {
            if (err) throw err;

            // calcular y generar la renta
            if (result[0].estado_encendido == 0) {   
                let fechaHoy = new Date().toLocaleDateString().split("/").reverse().join("-");
                let horaHoy = new Date().toLocaleString().split(" ")[1];
                
                con.query(`INSERT INTO renta (fecha, hora, consumo_acumulado, codigo_usuario, codigo_minadora) VALUES ('${fechaHoy}', '${horaHoy}', '${consumo_acumulado}', '${result[0].nombre_usuario}', '${id}')`, (err, resultados) => {
                    if (err) throw err;                    
                });
            }
            
            
            res.redirect('/home');
        });
    });
});

app.get('/vel/:miner/:vel/:porcentaje', checkCookies, function(req, res) {
    let { miner, porcentaje } = req.params;

    // calcular la velocidad por el porcentaje elegido
    let vel_max;
    let vel_elegida;
    con.query(`SELECT velocidad_procesamiento FROM minadora WHERE codigo = '${miner}'`, (err, result) => {
        if (err) throw err;
        
        vel_max = result[0].velocidad_procesamiento;
        vel_elegida = vel_max * (parseFloat(porcentaje) / 100);
    
        // cambiar la velocidad en la base de datos
        con.query(`UPDATE minadora SET vel_actual = '${vel_elegida}' WHERE codigo = '${miner}'`, (err, result) => {
            if (err) throw err;

            res.redirect('/home');
        });
    });    
    
});

app.get('/renta', checkCookies,(req, res) => {
    let { nombre, minadoras, nombre_usuario } = req.cookies;

    con.query(`SELECT * FROM renta INNER JOIN minadora ON renta.codigo_minadora = minadora.codigo ${ nombre_usuario != 'admin' ? `WHERE codigo_usuario = '${nombre_usuario}'` : ""}`, (err, result) => {
        if (err) throw err;

        con.query(`SELECT tasa_cambio.nombre, tasa_cambio.valor, usuario.nombre_usuario FROM usuario INNER JOIN tasa_cambio ON usuario.codigo_tasacambio = tasa_cambio.codigo ${ nombre_usuario != 'admin' ? `WHERE usuario.nombre_usuario = '${nombre_usuario}'` : "" }`, (err, resultado) => {
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
            let sentence = `SELECT minadora.codigo AS codigo FROM minadora WHERE nombre_usuario = '${username}'`;
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

// Register Form request handle 
app.post('/register', (req, res) => {
    let { username, password, com_password, name, address } = req.body;

    if (!username || !password || !com_password || !name || !address || (password != com_password)) {
        res.render('view/template_login', {
            page: './register_form',
            error: 'Error, Debe llenarse todos los campos obligatorio, o la confirmación de contraseña debe ser igual'
        })
    } else {
        con.query(`SELECT * FROM usuario WHERE nombre_usuario = '${username}'`, (err, result) => {
            if (err) throw err;
    
            if (result.length > 0) {
                res.render('view/template_login', {
                    page: './register_form',
                    error: 'Ya existe el nombre de usuario, por favor intente de nuevo'
                })
            } else {
                con.query(`INSERT INTO usuario (nombre_usuario, nombre_completo, direccion, password) VALUES ('${username}', '${name}', '${address}', '${password}')`, (err, resultado) => {
                    if (err) throw err; 

                    if (resultado) {
                        res.render('view/template_login', {
                            page: './register_form',
                            success: 'Se ha creado el usuario'
                        });
                    } else {
                        res.render('view/template_login', {
                            page: './register_form',
                            error: 'Ha ocurrido un error, por favor intente de nuevo'
                        })
                    }
                });
            }
        });
    }
});

// Logout request Handle
app.get('/logout', (req, res) => {
    res.cookie('minadora', "", {expire: new Date()});
    res.cookie('nombre', "", {expire: new Date()});
    res.cookie('nombre_usuario', "", {expire: new Date()});
    res.redirect('/'); 
});

app.listen(PORT, console.log('Se ha iniciado el servidor'));