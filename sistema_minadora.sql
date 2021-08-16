-- phpMyAdmin SQL Dump
-- version 5.1.0
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 19-03-2021 a las 03:19:39
-- Versión del servidor: 10.4.18-MariaDB
-- Versión de PHP: 8.0.3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `sistema_minadora`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `minadora`
--

CREATE TABLE `minadora` (
  `codigo` int(11) NOT NULL,
  `marca` varchar(30) NOT NULL,
  `modelo` varchar(30) NOT NULL,
  `consumo_electrico` float NOT NULL,
  `temperatura` float NOT NULL,
  `velocidad_procesamiento` float NOT NULL,
  `vel_actual` float NOT NULL,
  `estado_encendido` tinyint(1) NOT NULL,
  `ultima_hora_encendido` datetime NOT NULL,
  `duracion_ultima_hora_encendido` time NOT NULL,
  `nombre_usuario` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `minadora`
--

INSERT INTO `minadora` (`codigo`, `marca`, `modelo`, `consumo_electrico`, `temperatura`, `velocidad_procesamiento`, `vel_actual`, `estado_encendido`, `ultima_hora_encendido`, `duracion_ultima_hora_encendido`, `nombre_usuario`) VALUES
(2, 'Antminer s13', 'profesional enterprise s13', 1.2, 37, 1.5, 1.5, 1, '2021-03-18 19:36:45', '00:00:00', 'ricky88'),
(3, 'Antminer s9', 'profesional', 0.8, 45, 1, 1, 1, '2021-03-18 18:56:22', '00:05:22', 'ricky88'),
(4, 'DBG 847', 'Pro Mining Machine 8GPU', 0.25, 70, 0.6, 0.6, 1, '2021-03-18 19:06:39', '00:00:00', 'ricky88'),
(5, 'Antminer T3', 'Special Edition', 2, 65, 2, 2, 1, '2021-03-19 00:07:43', '01:01:01', 'carlos1'),
(6, 'WhatsMiner M31S+', 'Dynamics Variables', 2.3, 70, 10, 10, 1, '2021-03-18 19:20:46', '00:00:00', 'carlos1'),
(7, 'AvalonMiner 1246', 'Miner Expert', 3.4, 45, 6.5, 6.5, 0, '2021-03-18 19:20:47', '00:00:00', 'carlos1'),
(8, 'Antminer S19 Pro', 'profesional enterprise s19', 3.2, 53.5, 12, 12, 1, '2021-03-19 00:15:36', '19:15:30', 'carlos1'),
(9, 'Innosilicon T3', 'PSU Edition', 2.35, 48.6, 5, 5, 0, '2021-03-18 19:19:50', '00:00:00', 'carlos1'),
(10, 'Antminer s13', 'profesional enterprise s13', 1.2, 46, 1.5, 1.5, 1, '2021-03-18 19:27:09', '00:00:00', 'elconejo99'),
(12, 'Antminer T3', 'Special Edition', 2, 39.24, 2, 2, 0, '2021-03-18 19:31:38', '00:00:00', 'elconejo99'),
(13, 'Antminer S19 Pro', 'profesional enterprise s19', 3.2, 75.29, 12, 12, 1, '2021-03-19 00:23:07', '12:00:00', 'ricky88');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `permiso`
--

CREATE TABLE `permiso` (
  `codigo` int(11) NOT NULL,
  `nombre` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `permiso`
--

INSERT INTO `permiso` (`codigo`, `nombre`) VALUES
(1, 'admin'),
(2, 'usuario');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `renta`
--

CREATE TABLE `renta` (
  `codigo` int(11) NOT NULL,
  `fecha` date NOT NULL,
  `hora` time NOT NULL,
  `consumo_acumulado` float NOT NULL,
  `codigo_usuario` varchar(50) NOT NULL,
  `codigo_minadora` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `renta`
--

INSERT INTO `renta` (`codigo`, `fecha`, `hora`, `consumo_acumulado`, `codigo_usuario`, `codigo_minadora`) VALUES
(1, '2021-03-17', '22:45:20', 2.4, 'ricky88', 2),
(2, '2021-03-17', '22:46:19', 0.8, 'ricky88', 3),
(3, '2021-03-18', '18:51:23', 1.47, 'ricky88', 2),
(5, '2021-03-18', '18:55:22', 0.000434333, 'ricky88', 2),
(6, '2021-03-18', '18:56:48', 0.00178528, 'ricky88', 4),
(7, '2021-03-18', '19:11:27', 0.0206463, 'carlos1', 6),
(8, '2021-03-18', '19:20:20', 16.4518, 'carlos1', 7),
(9, '2021-03-18', '19:20:46', 0.356527, 'carlos1', 6),
(10, '2021-03-18', '19:24:29', 9.92103, 'elconejo99', 12),
(11, '2021-03-18', '19:27:05', 0.0500967, 'elconejo99', 10),
(12, '2021-03-18', '19:31:46', 0.004885, 'elconejo99', 12),
(13, '2021-03-18', '19:32:19', 0.719115, 'ricky88', 2),
(14, '2021-03-18', '19:41:58', 1.20044, 'carlos1', 7),
(15, '2021-03-18', '19:42:02', 0.869584, 'carlos1', 9);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tasa_cambio`
--

CREATE TABLE `tasa_cambio` (
  `codigo` int(11) NOT NULL,
  `nombre` varchar(30) NOT NULL,
  `valor` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `tasa_cambio`
--

INSERT INTO `tasa_cambio` (`codigo`, `nombre`, `valor`) VALUES
(1, 'dolar', 10),
(2, 'euro', 8.4),
(3, 'yen', 1092.73),
(4, 'peso colombiano', 35758.4);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `nombre_usuario` varchar(20) NOT NULL,
  `nombre_completo` varchar(50) NOT NULL,
  `direccion` text NOT NULL,
  `codigo_tasacambio` int(11) NOT NULL DEFAULT 1,
  `codigo_permiso` int(11) NOT NULL DEFAULT 2,
  `password` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`nombre_usuario`, `nombre_completo`, `direccion`, `codigo_tasacambio`, `codigo_permiso`, `password`) VALUES
('admin', 'administrador', 'NULL', 1, 1, 'admin'),
('carlos1', 'carlos alvarez', 'Cabudare, Edo. lara', 2, 2, '123'),
('elconejo99', 'bad bunny bebe', 'Miami Florida', 1, 2, 'elconejito'),
('ricky88', 'ricky zheng', 'Cabudare, Edo. Lara', 1, 2, '123');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `minadora`
--
ALTER TABLE `minadora`
  ADD PRIMARY KEY (`codigo`),
  ADD KEY `nombre_usuario` (`nombre_usuario`);

--
-- Indices de la tabla `permiso`
--
ALTER TABLE `permiso`
  ADD PRIMARY KEY (`codigo`);

--
-- Indices de la tabla `renta`
--
ALTER TABLE `renta`
  ADD PRIMARY KEY (`codigo`),
  ADD KEY `codigo_usuario` (`codigo_usuario`),
  ADD KEY `codigo_minadora` (`codigo_minadora`);

--
-- Indices de la tabla `tasa_cambio`
--
ALTER TABLE `tasa_cambio`
  ADD PRIMARY KEY (`codigo`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`nombre_usuario`),
  ADD KEY `codigo_tasacambio` (`codigo_tasacambio`),
  ADD KEY `codigo_permiso` (`codigo_permiso`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `minadora`
--
ALTER TABLE `minadora`
  MODIFY `codigo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT de la tabla `permiso`
--
ALTER TABLE `permiso`
  MODIFY `codigo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `renta`
--
ALTER TABLE `renta`
  MODIFY `codigo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT de la tabla `tasa_cambio`
--
ALTER TABLE `tasa_cambio`
  MODIFY `codigo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `minadora`
--
ALTER TABLE `minadora`
  ADD CONSTRAINT `minadora_ibfk_1` FOREIGN KEY (`nombre_usuario`) REFERENCES `usuario` (`nombre_usuario`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `renta`
--
ALTER TABLE `renta`
  ADD CONSTRAINT `renta_ibfk_1` FOREIGN KEY (`codigo_usuario`) REFERENCES `usuario` (`nombre_usuario`) ON UPDATE CASCADE,
  ADD CONSTRAINT `renta_ibfk_2` FOREIGN KEY (`codigo_minadora`) REFERENCES `minadora` (`codigo`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD CONSTRAINT `usuario_ibfk_1` FOREIGN KEY (`codigo_permiso`) REFERENCES `permiso` (`codigo`) ON UPDATE CASCADE,
  ADD CONSTRAINT `usuario_ibfk_2` FOREIGN KEY (`codigo_tasacambio`) REFERENCES `tasa_cambio` (`codigo`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
