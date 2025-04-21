import { v4 as uuidv4 } from 'uuid'
import Persona from '../models/Persona.js'

export const createPerson = async (req, res) => {
  //verificar por dni
  const { dni } = req.body
  const personaExistente = await Persona.findOne({ where: { dni } })

  const id = uuidv4()

    const { cargo_id } = req.body
    const cargoExistente = await Persona.findOne({ where: { cargo_id } })
    if (!cargoExistente) {
        return res.status(400).json({ error: 'El cargo no existe' })
    }

  if (personaExistente) {
    return res.status(400).json({ error: 'La persona ya existe' })
  }
  try {
    const { nombre, apellido, dni, email, celular, fecha_nac, direccion, legajo, cargo_id } = req.body
    const nuevaPersona = await Persona.create({
        id,
      nombre,
      apellido,
      dni,
      email,
      celular,
      fecha_nac,
      direccion,
      legajo,
      cargo_id,
    })
    res.status(201).json(nuevaPersona)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

export const getAllPersons = async (req, res) => {
  try {
    const personas = await Persona.findAll()
    res.status(200).json(personas)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const getPersonById = async (req, res) => {
  try {
    const { id } = req.params
    const persona = await Persona.findByPk(id)
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

    const persona = await Persona.findByPk(id)
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
    const persona = await Persona.findOne({ where: { dni } })
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
    const personas = await Persona.findAll({ where: { nombre } })
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
    const personas = await Persona.findAll({ where: { apellido } })
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
    const { fecha_nacimiento } = req.params
    const personas = await Persona.findAll({ where: { fecha_nacimiento } })
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
    const personas = await Persona.findAll({ where: { edad } })
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
    const personas = await Persona.findAll({ where: { email } })
    if (personas.length === 0) {
      return res.status(404).json({ error: 'Persona no encontrada' })
    }
    res.status(200).json(personas)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
