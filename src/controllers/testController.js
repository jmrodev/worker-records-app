let records = []
let nextId = 1

export const getAllRecords = (req, res) => {
  res.json(records)
}

export const getRecordById = (req, res) => {
  const record = records.find((r) => r.id === parseInt(req.params.id))
  if (!record)
    return res.status(404).json({ message: 'Registro no encontrado' })
  res.json(record)
}

export const createRecord = (req, res) => {
  const nuevo = { id: nextId++, ...req.body }
  records.push(nuevo)
  res.status(201).json(nuevo)
}

export const updateRecord = (req, res) => {
  const index = records.findIndex((r) => r.id === parseInt(req.params.id))
  if (index === -1)
    return res.status(404).json({ message: 'Registro no encontrado' })

  records[index] = { ...records[index], ...req.body }
  res.json(records[index])
}

export const deleteRecord = (req, res) => {
  const index = records.findIndex((r) => r.id === parseInt(req.params.id))
  if (index === -1)
    return res.status(404).json({ message: 'Registro no encontrado' })

  const eliminado = records.splice(index, 1)
  res.json({ message: 'Registro eliminado', data: eliminado[0] })
}
