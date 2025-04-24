import Persona from '../models/Persona.js'
import Cargo from '../models/Cargo.js'
import sequelize, { Op } from 'sequelize'
import { validationResult } from 'express-validator'

export const createPerson = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const { dni, cargo_id } = req.body

  try {
    const personaExistente = await Persona.findOne({ where: { dni } })
    const cargoExistente = await Cargo.findByPk(cargo_id)

    if (!cargoExistente) {
      return res.status(400).json({ error: 'El cargo no existe' })
    }

    if (personaExistente) {
      return res.status(400).json({ error: 'La persona ya existe' })
    }

    const nuevaPersona = await Persona.create(req.body)

    if (!nuevaPersona) {
      return res.status(400).json({ error: 'Error al crear la persona' })
    }

    const personaConCargo = await Persona.findByPk(nuevaPersona.id, {
      include: [{ model: Cargo, as: 'cargo' }],
    })
    res.status(201).json(personaConCargo)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const getAllPersons = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query
    const offset = (page - 1) * limit

    const personas = await Persona.findAndCountAll({
      include: [{ model: Cargo, as: 'cargo' }],
      order: [['apellido', 'ASC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
    })

    res.status(200).json({
      total: personas.count,
      pages: Math.ceil(personas.count / limit),
      data: personas.rows,
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const getPersonById = async (req, res) => {
  try {
    const { id } = req.params
    const persona = await Persona.findByPk(id, {
      include: [{ model: Cargo, as: 'cargo' }],
    })
    if (!persona) {
      return res.status(404).json({ error: 'Persona no encontrada' })
    }
    res.status(200).json(persona)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const updatePerson = async (req, res) => {
  try {
    const { id } = req.params
    const { nombre, apellido, dni, fecha_nacimiento } = req.body

    const persona = await Persona.findByPk(id, {
      include: [{ model: Cargo, as: 'cargo' }],
    })
    if (!persona) {
      return res.status(404).json({ error: 'Persona no encontrada' })
    }

    await persona.update({ nombre, apellido, dni, fecha_nacimiento })
    res.status(200).json(persona)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

export const deletePerson = async (req, res) => {
  try {
    const { id } = req.params
    const persona = await Persona.findByPk(id)
    if (!persona) {
      return res.status(404).json({ error: 'Persona no encontrada' })
    }
    await persona.destroy()
    res.status(204).send()
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const getPersonByDni = async (req, res) => {
  try {
    const { dni } = req.params
    const persona = await Persona.findOne({
      where: { dni },
      include: [{ model: Cargo, as: 'cargo' }],
    })
    if (!persona) {
      return res.status(404).json({ error: 'Persona no encontrada' })
    }
    res.status(200).json(persona)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const getPersonByName = async (req, res) => {
  try {
    const { nombre } = req.params
    const personas = await Persona.findAll(
      { where: { nombre } },
      {
        include: [{ model: Cargo, as: 'cargo' }],
      }
    )
    if (personas.length === 0) {
      return res.status(404).json({ error: 'Persona no encontrada' })
    }
    res.status(200).json(personas)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const getPersonByLastName = async (req, res) => {
  try {
    const { apellido } = req.params
    const personas = await Persona.findAll(
      { where: { apellido } },
      {
        include: [{ model: Cargo, as: 'cargo' }],
      }
    )
    if (personas.length === 0) {
      return res.status(404).json({ error: 'Persona no encontrada' })
    }
    res.status(200).json(personas)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const getPersonByBirthdate = async (req, res) => {
  try {
    const { fecha_nac } = req.params
    const personas = await Persona.findAll({
      where: sequelize.where(
        sequelize.fn('DATE', sequelize.col('fecha_nac')),
        fecha_nac
      ),
      include: [{ model: Cargo, as: 'cargo' }],
    })
    if (personas.length === 0) {
      return res.status(404).json({ error: 'Persona no encontrada' })
    }
    res.status(200).json(personas)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const getPersonByAge = async (req, res) => {
  try {
    const { edad } = req.params
    const personas = await Persona.findAll({
      where: sequelize.where(
        sequelize.literal('TIMESTAMPDIFF(YEAR, fecha_nac, CURDATE())'),
        edad
      ),
      include: [{ model: Cargo, as: 'cargo' }],
    })
    if (personas.length === 0) {
      return res.status(404).json({ error: 'Persona no encontrada' })
    }
    res.status(200).json(personas)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const getPersonByEmail = async (req, res) => {
  try {
    const { email } = req.params
    const personas = await Persona.findAll(
      { where: { email } },
      {
        include: [{ model: Cargo, as: 'cargo' }],
      }
    )
    if (personas.length === 0) {
      return res.status(404).json({ error: 'Persona no encontrada' })
    }
    res.status(200).json(personas)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// Filtrar por cargo
export const getPersonsByCargo = async (req, res) => {
  try {
    const { cargo_id } = req.params
    const personas = await Persona.findAll({
      where: { cargo_id },
      include: [{ model: Cargo, as: 'cargo' }],
    })
    if (personas.length === 0) {
      return res
        .status(404)
        .json({ error: 'No se encontraron personas con el cargo especificado' })
    }
    res.status(200).json(personas)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// Filtrar por tipo de cargo
export const getPersonsByCargoType = async (req, res) => {
  try {
    const { tipo } = req.params
    const personas = await Persona.findAll({
      include: [
        {
          model: Cargo,
          as: 'cargo',
          where: { tipo },
        },
      ],
    })
    if (personas.length === 0) {
      return res.status(404).json({
        error: 'No se encontraron personas con el tipo de cargo especificado',
      })
    }
    res.status(200).json(personas)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// Filtrar por cargo y tipo
export const getPersonsByCargoAndType = async (req, res) => {
  try {
    const { cargo_id, tipo } = req.params
    const personas = await Persona.findAll({
      where: { cargo_id },
      include: [
        {
          model: Cargo,
          as: 'cargo',
          where: { tipo },
        },
      ],
    })
    if (personas.length === 0) {
      return res
        .status(404)
        .json({
          error: 'No se encontraron personas con el cargo y tipo especificados',
        })
    }
    res.status(200).json(personas)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
