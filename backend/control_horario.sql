DROP DATABASE IF EXISTS control_horario;
CREATE DATABASE control_horario CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE control_horario;

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

-- Tabla Cargos
CREATE TABLE `Cargos` (
  `id` char(36) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `tipo` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `Cargos` (`id`, `nombre`, `tipo`) VALUES
('c1', 'Maestro/a', 'docente'),
('c2', 'Preceptora', 'apoyo'),
('c3', 'Directivo/a', 'directivo'),
('c4', 'Psicóloga', 'eoi');

-- Tabla Personas
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
  `cargo_id` char(36) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `dni` (`dni`),
  UNIQUE KEY `legajo` (`legajo`),
  KEY `cargo_id` (`cargo_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `Personas` (`id`, `nombre`, `apellido`, `dni`, `email`, `celular`, `fecha_nac`, `direccion`, `legajo`, `cargo_id`) VALUES
('p1', 'Juan', 'Pérez', '12345678', 'juan.perez@example.com', '111111111', '1990-01-01', 'Calle 1', 'L001', 'c1'),
('p2', 'Ana', 'García', '87654321', 'ana.garcia@example.com', '222222222', '1985-05-05', 'Calle 2', 'L002', 'c2'),
('p3', 'Luis', 'Martínez', '11223344', 'luis.martinez@example.com', '333333333', '1980-10-10', 'Calle 3', 'L003', 'c3'),
('p4', 'Sofía', 'López', '44332211', 'sofia.lopez@example.com', '444444444', '1995-12-12', 'Calle 4', 'L004', 'c4');

-- Tabla Usuarios
CREATE TABLE `Usuarios` (
  `id` char(36) NOT NULL,
  `username` varchar(50) NOT NULL UNIQUE,
  `nombre` varchar(100) NOT NULL,
  `apellido` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL UNIQUE,
  `password` varchar(255) NOT NULL,
  `rol` enum('admin','supervisor','usuario') NOT NULL DEFAULT 'usuario',
  `persona_id` char(36) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`),
  KEY `persona_id` (`persona_id`),
  CONSTRAINT `Usuarios_ibfk_1` FOREIGN KEY (`persona_id`) REFERENCES `Personas` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `Usuarios` (`id`, `username`, `nombre`, `apellido`, `email`, `password`, `rol`, `persona_id`) VALUES
('u1', 'admin', 'Admin', 'Principal', 'admin@example.com', '$2b$10$hashadmin', 'admin', 'p1'),
('u2', 'supervisor', 'Supervisor', 'Secundario', 'supervisor@example.com', '$2b$10$hashsupervisor', 'supervisor', 'p2'),
('u3', 'usuario', 'Usuario', 'Normal', 'usuario@example.com', '$2b$10$hashusuario', 'usuario', 'p3'),
('u4', 'sofia', 'Sofía', 'López', 'sofia.lopez@example.com', '$2b$10$hashsofia', 'usuario', 'p4');

-- Tabla RegistrosHorario
CREATE TABLE `RegistrosHorario` (
  `id` char(36) NOT NULL,
  `persona_id` char(36) NOT NULL,
  `tipo` enum('ingreso','egreso') NOT NULL,
  `fecha_hora` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `persona_id` (`persona_id`),
  CONSTRAINT `RegistrosHorario_ibfk_1` FOREIGN KEY (`persona_id`) REFERENCES `Personas` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `RegistrosHorario` (`id`, `persona_id`, `tipo`, `fecha_hora`) VALUES
('r1', 'p1', 'ingreso', '2025-05-20 08:00:00'),
('r2', 'p1', 'egreso', '2025-05-20 16:00:00'),
('r3', 'p2', 'ingreso', '2025-05-20 08:15:00'),
('r4', 'p3', 'ingreso', '2025-05-20 09:00:00');

COMMIT;
