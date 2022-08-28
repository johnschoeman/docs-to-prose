import fs from "fs"
import path from "path"
import { exec } from "child_process"

import { updateHtmlFilesIn } from "./buildHtml"

export const docsToProse = (inputDir, outputDir) => {
  fs.rmSync(outputDir, { recursive: true, force: true }, error => {
    if (error) {
      console.error(error)
    }
  })

  fs.mkdir(outputDir, error => {
    if (error) {
      console.error(error)
    }
  })

  fs.cpSync(inputDir, outputDir, { recursive: true }, error => {
    if (error) {
      console.error(error)
    }
  })

  const publicAssetsDir = path.join(__dirname, "public")
  fs.cpSync(
    publicAssetsDir,
    `${outputDir}/public`,
    { recursive: true },
    error => {
      if (error) {
        console.error(error)
      }
    },
  )

  updateHtmlFilesIn(outputDir)
}
