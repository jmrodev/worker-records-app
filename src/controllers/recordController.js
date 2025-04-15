// Obtener todos los registros
export const getAllRecords = (req, res) => {
  res.send('Obtener todos los registros')
}

// Obtener uno por ID
export const getRecordById = (req, res) => {
  const { id } = req.params
  res.send(`Obtener el registro con ID: ${id}`)
}

// Crear nuevo registro
export const createRecord = (req, res) => {
  const nuevoRegistro = req.body
  res.send(`Nuevo registro creado: ${JSON.stringify(nuevoRegistro)}`)
}

// Actualizar registro
export const updateRecord = (req, res) => {
  const { id } = req.params
  const datosActualizados = req.body
  res.send(
    `Actualizar el registro ${id} con datos: ${JSON.stringify(
      datosActualizados
    )}`
  )
}

// Eliminar registro
export const deleteRecord = (req, res) => {
  const { id } = req.params
  res.send(`Registro con ID ${id} eliminado`)
}
