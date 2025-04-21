import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import express from 'express'

const router = express.Router()


const routersDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)))
console.log(`Directorio de routers: ${routersDir}`);

fs.readdirSync(routersDir).forEach((file) => {
  if (file === 'index.js') return

  const filePath = path.join(routersDir, file)
  console.log(`Cargando router: ${filePath}`);

  if (path.extname(file) === '.js') {
    import(filePath).then((module) => {
      if (module.default) {
        const routePath = `/${path.basename(file, '.js')}`
        router.use(routePath, module.default)
        console.log(`Router cargado: ${routePath}`)
      }
    })
  }
})

export default router
