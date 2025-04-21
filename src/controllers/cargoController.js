import Cargo from '../models/Cargo.js';

export const createCargo = async (req, res) => {

    try {
        const { id, nombre, tipo } = req.body;
        const newCargo = await Cargo.create({ id, nombre, tipo });
        res.status(201).json(newCargo);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
    }

    export const getAllCargos = async (req, res) => {
    try {
        const cargos = await Cargo.findAll();
        res.status(200).json(cargos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}



