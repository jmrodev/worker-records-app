-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost
-- Tiempo de generación: 15-04-2025 a las 10:50:53
-- Versión del servidor: 11.7.2-MariaDB
-- Versión de PHP: 8.4.5

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `control_horario`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Cargos`
--

CREATE TABLE `Cargos` (
  `id` char(36) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `tipo` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `Cargos`
--

INSERT INTO `Cargos` (`id`, `nombre`, `tipo`) VALUES
('800b7722-19ff-11f0-9c20-643150603666', 'Maestro/a', 'docente'),
('800b7b3c-19ff-11f0-9c20-643150603666', 'Preceptora', 'apoyo'),
('800bc031-19ff-11f0-9c20-643150603666', 'Directivo/a', 'directivo'),
('800bc0e8-19ff-11f0-9c20-643150603666', 'Psicóloga', 'eoi'),
('800bc17c-19ff-11f0-9c20-643150603666', 'Asistente Social', 'eoi'),
('800bc213-19ff-11f0-9c20-643150603666', 'Doctora', 'eoi'),
('800bc273-19ff-11f0-9c20-643150603666', 'Maestra de Arte', 'especialista'),
('800bc2bd-19ff-11f0-9c20-643150603666', 'Maestra de Música', 'especialista'),
('800bc311-19ff-11f0-9c20-643150603666', 'Maestra de Expresión Corporal', 'especialista');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Personas`
--

CREATE TABLE `Personas` (
  `id` char(36) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `apellido` varchar(100) NOT NULL,
  `dni` varchar(20) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `celular` varchar(50) DEFAULT NULL,
  `fecha_nac` date DEFAULT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `legajo` varchar(50) DEFAULT NULL,
  `cargo_id` char(36) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `RegistrosHorario`
--

CREATE TABLE `RegistrosHorario` (
  `id` char(36) NOT NULL,
  `persona_id` char(36) NOT NULL,
  `tipo` enum('ingreso','egreso') NOT NULL,
  `fecha_hora` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `Cargos`
--
ALTER TABLE `Cargos`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `Personas`
--
ALTER TABLE `Personas`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `dni` (`dni`),
  ADD UNIQUE KEY `legajo` (`legajo`),
  ADD KEY `cargo_id` (`cargo_id`);

--
-- Indices de la tabla `RegistrosHorario`
--
ALTER TABLE `RegistrosHorario`
  ADD PRIMARY KEY (`id`),
  ADD KEY `persona_id` (`persona_id`);

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `Personas`
--
ALTER TABLE `Personas`
  ADD CONSTRAINT `Personas_ibfk_1` FOREIGN KEY (`cargo_id`) REFERENCES `Cargos` (`id`) ON DELETE SET NULL;

--
-- Filtros para la tabla `RegistrosHorario`
--
ALTER TABLE `RegistrosHorario`
  ADD CONSTRAINT `RegistrosHorario_ibfk_1` FOREIGN KEY (`persona_id`) REFERENCES `Personas` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
