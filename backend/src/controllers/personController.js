import { Op, literal, fn, col, where as sequelizeWhere } from 'sequelize';
import Persona from '../models/Persona.js';
import Cargo from '../models/Cargo.js';
import {
  sendSuccess,
  sendNotFound,
  sendCreated,
  sendNoContent,
  sendPaginated,
} from '../utils/responseHandler.js';
import { validationResult } from 'express-validator';

export const createPerson = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return next(errors);
  try {
    const nuevaPersona = await Persona.create(req.body);
    const personaConCargo = await Persona.findByPk(nuevaPersona.id, {
      include: [{ model: Cargo, as: 'cargo' }]
    });
    return sendCreated(res, personaConCargo);
  } catch (error) {
    next(error);
  }
};

export const getAllPersons = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return next(errors);
  try {
    const { page = 1, limit = 10, nombre, apellido, dni, email, cargo_id, tipo_cargo, sort = 'apellido', order = 'ASC' } = req.query;
    const offset = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const whereClause = {};
    const includeCargoWhere = {};

    if (nombre) whereClause.nombre = { [Op.like]: `%${nombre}%` };
    if (apellido) whereClause.apellido = { [Op.like]: `%${apellido}%` };
    if (dni) whereClause.dni = { [Op.like]: `%${dni}%` };
    if (email) whereClause.email = { [Op.like]: `%${email}%` }; // Búsqueda exacta o like según se prefiera
    if (cargo_id) whereClause.cargo_id = cargo_id;
    if (tipo_cargo) includeCargoWhere.tipo = { [Op.like]: `%${tipo_cargo}%`};

    const { count, rows } = await Persona.findAndCountAll({
      where: whereClause,
      include: [{ model: Cargo, as: 'cargo', ...(Object.keys(includeCargoWhere).length && { where: includeCargoWhere }) }],
      order: [[sort, order.toUpperCase()]],
      limit: parseInt(limit, 10),
      offset: offset,
      distinct: true,
    });
    return sendPaginated(res, rows, count, page, limit, 'personas');
  } catch (error) {
    next(error);
  }
};

export const getPersonById = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return next(errors);
  try {
    const { id } = req.params;
    const persona = await Persona.findByPk(id, {
      include: [{ model: Cargo, as: 'cargo' }]
    });
    if (!persona) return sendNotFound(res, 'Persona no encontrada.');
    return sendSuccess(res, persona);
  } catch (error) {
    next(error);
  }
};

export const updatePerson = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return next(errors);
  try {
    const { id } = req.params;
    const persona = await Persona.findByPk(id);
    if (!persona) return sendNotFound(res, 'Persona no encontrada.');
    
    await persona.update(req.body);
    const personaActualizadaConCargo = await Persona.findByPk(id, {
      include: [{ model: Cargo, as: 'cargo' }]
    });
    return sendSuccess(res, personaActualizadaConCargo);
  } catch (error) {
    next(error);
  }
};

export const deletePerson = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return next(errors);
  try {
    const { id } = req.params;
    const persona = await Persona.findByPk(id);
    if (!persona) return sendNotFound(res, 'Persona no encontrada.');
    await persona.destroy();
    return sendNoContent(res);
  } catch (error) {
    next(error);
  }
};

// Métodos de búsqueda específicos (pueden ser redundantes si getAllPersons es flexible)
const getPersonByCustomFilter = async (req, res, next, filterField, filterParam) => {
    try {
        const whereClause = {};
        if (filterField === 'fecha_nac') {
            whereClause[filterField] = sequelizeWhere(fn('DATE', col(filterField)), '=', filterParam);
        } else if (filterField === 'edad') {
            whereClause[literal(`TIMESTAMPDIFF(YEAR, fecha_nac, CURDATE())`)] = filterParam;
        } else {
            whereClause[filterField] = (filterField === 'nombre' || filterField === 'apellido') 
                ? { [Op.like]: `%${filterParam}%` } 
                : filterParam;
        }
        const personas = await Persona.findAll({
            where: whereClause,
            include: [{ model: Cargo, as: 'cargo' }]
        });
        if (personas.length === 0) return sendNotFound(res, `No se encontraron personas.`);
        return sendSuccess(res, personas);
    } catch (error) {
        next(error);
    }
};
export const getPersonByDni = async (req, res, next) => getPersonByCustomFilter(req, res, next, 'dni', req.params.dni);
export const getPersonByName = async (req, res, next) => getPersonByCustomFilter(req, res, next, 'nombre', req.params.nombre);
export const getPersonByLastName = async (req, res, next) => getPersonByCustomFilter(req, res, next, 'apellido', req.params.apellido);
export const getPersonByBirthdate = async (req, res, next) => getPersonByCustomFilter(req, res, next, 'fecha_nac', req.params.fecha_nac);
export const getPersonByAge = async (req, res, next) => getPersonByCustomFilter(req, res, next, 'edad', req.params.edad);
export const getPersonByEmail = async (req, res, next) => getPersonByCustomFilter(req, res, next, 'email', req.params.email);