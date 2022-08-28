#!/usr/bin/env node

import arg from "arg"
import childProcess from "child_process"
import path from "path"

import packageJson from "../package.json"
import { docsToProse } from "./docsToProse"

// ---- Setup CLI ----

function help({ message, usage, commands, options }) {
  let indent = 2

  // Render header
  console.log()
  console.log(`${packageJson.name} v${packageJson.version}`)

  // Render message
  if (message) {
    console.log()
    for (let msg of message.split("\n")) {
      console.log(msg)
    }
  }

  // Render usage
  if (usage && usage.length > 0) {
    console.log()
    console.log("Usage:")
    for (let example of usage) {
      console.log(" ".repeat(indent), example)
    }
  }

  // Render commands
  if (commands && commands.length > 0) {
    console.log()
    console.log("Commands:")
    for (let command of commands) {
      console.log(" ".repeat(indent), command)
    }
  }

  // Render options
  if (options) {
    let groupedOptions = {}
    for (let [key, value] of Object.entries(options)) {
      if (typeof value === "object") {
        groupedOptions[key] = { ...value, flags: [key] }
      } else {
        groupedOptions[value].flags.push(key)
      }
    }

    console.log()
    console.log("Options:")
    for (let { flags, description, deprecated } of Object.values(
      groupedOptions,
    )) {
      if (deprecated) continue

      if (flags.length === 1) {
        console.log(
          " ".repeat(indent + 4 /* 4 = "-i, ".length */),
          flags.slice().reverse().join(", ").padEnd(20, " "),
          description,
        )
      } else {
        console.log(
          " ".repeat(indent),
          flags.slice().reverse().join(", ").padEnd(24, " "),
          description,
        )
      }
    }
  }

  console.log()
}

let commands = {
  build: {
    run: build,
    args: {
      "--input": { type: String, description: "Input directory path" },
      "--output": { type: String, description: "Output directory path" },
      "-i": "--input",
      "-o": "--output",
    },
  },
}

const sharedFlags = {
  "--help": { type: Boolean, description: "Display usage information" },
  "-h": "--help",
}

if (
  process.stdout.isTTY /* Detect redirecting output to a file */ &&
  (process.argv[2] === undefined ||
    process.argv.slice(2).every(flag => sharedFlags[flag] !== undefined))
) {
  help({
    usage: ["docstoprose [--input input/] [--output output/]"],
    options: { ...commands.build.args, ...sharedFlags },
  })
  process.exit(0)
}

// ---- Execute Command ----

const command = "build"

const { args: flags, run } = commands[command]

const buildArgs = () => {
  try {
    const result = arg(
      Object.fromEntries(
        Object.entries({ ...flags, ...sharedFlags })
          .filter(([_key, value]) => !value?.type?.manualParsing)
          .map(([key, value]) => [
            key,
            typeof value === "object" ? value.type : value,
          ]),
      ),
      { permissive: true },
    )
    return result
  } catch (err) {
    if (err.code === "ARG_UNKNOWN_OPTION") {
      help({
        message: err.message,
        usage: ["docstoprose --input input_dir --output output_dir"],
        options: sharedFlags,
      })
      process.exit(1)
    }
    throw err
  }
}

const args = buildArgs()

run()

// ---- Define Commands ----

async function build() {
  let start = process.hrtime.bigint()
  const inputDir = path.resolve(args["--input"])
  const outputDir = path.resolve(args["--output"])

  console.log("Converting docs to prose...")
  docsToProse(inputDir, outputDir)

  let end = process.hrtime.bigint()
  console.log("Done in", (end - start) / BigInt(1e6) + "ms.")
}
