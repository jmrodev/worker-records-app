import Persona from '../models/Persona.js'
import Cargo from '../models/Cargo.js'

export const createPerson = async (req, res) => {
  //verificar por dni
  const { dni } = req.body
  const personaExistente = await Persona.findOne({ where: { dni } })

  const { cargo_id } = req.body
  const cargoExistente = await Cargo.findByPk(cargo_id)

  if (!cargoExistente) {
    return res.status(400).json({ error: 'El cargo no existe' })
  }

  if (personaExistente) {
    return res.status(400).json({ error: 'La persona ya existe' })
  }
  try {
    const {
      nombre,
      apellido,
      dni,
      email,
      celular,
      fecha_nac,
      direccion,
      legajo,
      cargo_id,
    } = req.body
    const nuevaPersona = await Persona.create({
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
    const personaConCargo = await Persona.findByPk(nuevaPersona.id, {
      include: [{ model: Cargo, as: 'cargo' }],
    })
    res.status(201).json(personaConCargo)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

export const getAllPersons = async (req, res) => {
  try {
    const personas = await Persona.findAll({
      include: [{ model: Cargo, as: 'cargo' }],
      order: [['apellido', 'ASC']],
    })
    res.status(200).json(personas)
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
    const persona = await Persona.findOne(
      { where: { dni } },
      {
        include: [{ model: Cargo, as: 'cargo' }],
      }
    )
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
    const { fecha_nacimiento } = req.params
    const personas = await Persona.findAll(
      { where: { fecha_nacimiento } },
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

export const getPersonByAge = async (req, res) => {
  try {
    const { edad } = req.params
    const personas = await Persona.findAll(
      { where: { edad } },
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
