import RegistroHorario from '../models/RegistroHorario.js';
import Persona from '../models/Persona.js';

export const createRecord = async (req, res) => {
  try {
    const { persona_id, tipo, fecha_hora } = req.body;

    // Verificar si la persona existe
    const persona = await Persona.findByPk(persona_id);
    if (!persona) {
      return res.status(404).json({ error: 'La persona no existe' });
    }

    // Crear el registro de horario
    const nuevoRegistro = await RegistroHorario.create({ persona_id, tipo, fecha_hora });
    res.status(201).json(nuevoRegistro);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getAllRecords = async (req, res) => {
  try {
    // Obtener todos los registros de horario, incluyendo la información de la persona asociada
    const registros = await RegistroHorario.findAll({
      include: {
        model: Persona,
        as: 'persona', // Asegúrate de que la relación esté configurada correctamente en el modelo
      },
    })
    res.status(200).json(registros)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}


export const getRecordById = async (req, res) => {
  try {
    const { id } = req.params

    // Buscar el registro por ID
    const registro = await RegistroHorario.findByPk(id, {
      include: {
        model: Persona,
        as: 'persona', // Asegúrate de que la relación esté configurada correctamente en el modelo
      },
    })

    if (!registro) {
      return res.status(404).json({ error: 'Registro no encontrado' })
    }

    res.status(200).json(registro)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}