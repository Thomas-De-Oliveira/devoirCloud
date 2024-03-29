import dotenv from "dotenv"
import { resolve } from "node:path"

dotenv.config({ path: resolve(".env.local") })

const config = {
  port: 3000,  
}

export default config