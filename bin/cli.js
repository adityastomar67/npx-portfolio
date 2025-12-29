#!/usr/bin/env node

"use strict";

const fs = require("fs");
const path = require("path");
const https = require("https");
const boxen = require("boxen");
const chalk = require("chalk");
const inquirer = require("inquirer");
const clear = require("clear");
const open = require("open");
const ora = require("ora");

// Clear the terminal on start
clear();

const prompt = inquirer.createPromptModule();
const styledDataFilename = "personal-info.json";

// Helper to resolve paths relative to this script
const resolvePath = (file) => path.join(__dirname, "..", file);

/**
 * Downloads a file from a URL to a local path
 */
const downloadResume = (url, fileName) => {
  return new Promise((resolve, reject) => {
    const downloadPath = path.join(process.cwd(), fileName);
    const file = fs.createWriteStream(downloadPath);

    const spinner = ora("Downloading Resume...").start();

    https
      .get(url, (response) => {
        if (response.statusCode !== 200) {
          spinner.fail("Download failed");
          return reject(
            new Error(`Failed to download: ${response.statusCode}`)
          );
        }

        response.pipe(file);

        file.on("finish", () => {
          file.close(() => {
            spinner.succeed(
              `Resume downloaded to ${chalk.greenBright(downloadPath)}`
            );
            open(downloadPath);
            resolve();
          });
        });
      })
      .on("error", (err) => {
        fs.unlink(downloadPath, () => {}); // Delete partial file
        spinner.fail("Error downloading file");
        reject(err);
      });
  });
};

/**
 * Handles the "Connect with Me" sub-menu
 */
const handleSocials = async () => {
  const { socialAction } = await prompt([
    {
      type: "list",
      name: "socialAction",
      message: "Where do you want to connect?",
      choices: [
        {
          // Facebook Blue
          name: `Check Me Out on ${chalk.hex("#1877F2").bold("Facebook")}`,
          value: "facebook",
        },
        {
          // GitHub White/Grey
          name: `Latest Pushes on ${chalk.white.bold("GitHub")}`,
          value: "github",
        },
        {
          // LinkedIn Blue
          name: `Professional Connect on ${chalk
            .hex("#0077B5")
            .bold("LinkedIn")}`,
          value: "linkedin",
        },
        {
          // Twitter Blue
          name: `My Thoughts on ${chalk.hex("#1DA1F2").bold("Twitter")}`,
          value: "twitter",
        },
        {
          // LinkTree Green
          name: `Everything else on ${chalk.hex("#43E660").bold("LinkTree")}`,
          value: "linktree",
        },
        { name: chalk.redBright.bold("Go Back"), value: "back" },
      ],
    },
  ]);

  // TODO: Replace empty strings with your actual URLs
  const urls = {
    facebook: "https://facebook.com/your-id", // Update this
    github: "https://github.com/adityastomar67/",
    linkedin: "https://linkedin.com/in/your-id", // Update this
    twitter: "https://twitter.com/your-id", // Update this
    linktree: "https://linktr.ee/your-id", // Update this
  };

  if (socialAction === "back") {
    return handleMainPrompt(); // Go back to main menu
  }

  if (urls[socialAction]) {
    open(urls[socialAction]);
    console.log(`\nOpening ${socialAction}...`);
  } else {
    console.log(
      chalk.red(`\nLink for ${socialAction} is missing in the configuration.`)
    );
  }
};

/**
 * Main Action Handler
 */
const handleMainPrompt = async (config) => {
  const questions = [
    {
      type: "list",
      name: "action",
      message: "What would you like to do?",
      choices: [
        {
          name: `Send me an ${chalk.greenBright.bold("email")}?`,
          value: "email",
        },
        {
          name: `Download my ${chalk.magentaBright.bold("Resume")}?`,
          value: "resume",
        },
        {
          // Bright Pink/Red for emphasis
          name: `Connect with ${chalk.hex("#FF6B6B").bold("Me")}!`,
          value: "socials",
        },
        {
          // Calendly Gold/Yellow
          name: `Schedule a ${chalk.hex("#F5A623").bold("Meeting")}?`,
          value: "meeting",
        },
        {
          name: "Just quit.",
          value: "quit",
        },
      ],
    },
  ];

  const { action } = await prompt(questions);

  switch (action) {
    case "email":
      open(`mailto:${config.email}`);
      console.log("\nOpening your email client...\n");
      break;

    case "resume":
      try {
        // Hardcoded Gist URL
        const resumeUrl =
          "https://gist.githubusercontent.com/adityastomar67/fc16674d8da9385b31808e8d0c599544/raw/1bb6a5923a498cfc6293ef81b1f6906626f06b5f/Resume.html";
        await downloadResume(resumeUrl, "aditya-resume.html");
      } catch (error) {
        console.error(
          chalk.red(
            "\nCould not download resume. Check your internet connection."
          )
        );
      }
      break;

    case "socials":
      await handleSocials();
      break;

    case "meeting":
      open("https://calendly.com/adityastomar67/30min");
      console.log("\nOpening Calendly...\n");
      break;

    case "quit":
      console.log("Hasta la vista.\n");
      process.exit(0);
  }
};

/**
 * Renders the Boxen Card
 */
const renderCard = (data) => {
  const {
    full_name,
    job_title,
    handle,
    github_handle,
    twitter_handle,
    linkedin_handle,
    website_link,
    twitter_link,
    github_link,
    linkedin_link,
  } = data;

  // Define labels and data with consistent padding
  const labelWork = chalk.white.bold("       Work:");
  const labelTwitter = chalk.white.bold("    Twitter:");
  const labelGitHub = chalk.white.bold("     GitHub:");
  const labelLinkedIn = chalk.white.bold("   LinkedIn:");
  const labelWeb = chalk.white.bold("        Web:");
  const labelCard = chalk.white.bold("       Card:");

  const output = [
    `                                    ${chalk.magentaBright.bold(
      full_name
    )}`,
    `                                      ${chalk.white.italic(handle)}`,
    ``,
    `                  ${labelWork}  ${chalk.white(job_title)} ${chalk
      .hex("#6495ED") // Cornflower Blue (Visible on dark backgrounds)
      .bold("Nagarro")}`,
    `                  ${labelTwitter}  ${chalk.dim.gray(twitter_link)}${chalk
      .hex("#1DA1F2")
      .bold(twitter_handle)}`,
    `                  ${labelGitHub}  ${chalk.dim.gray(
      github_link
    )}${chalk.white.bold(github_handle)}`,
    `                  ${labelLinkedIn}  ${chalk.dim.gray(linkedin_link)}${chalk
      .hex("#0077B5")
      .bold(linkedin_handle)}`,
    `                  ${labelWeb}  ${chalk.cyanBright.bold(website_link)}`,
    ``,
    `                  ${labelCard}  ${chalk.redBright("npx")} ${chalk.white(
      handle
    )}`,
    ``,
    chalk.hex("#8a8a8a").italic(
      // Subtle Grey for footer text
      "I am currently looking for new opportunities, my inbox is always open. Whether you have a"
    ),
    chalk
      .hex("#8a8a8a")
      .italic(
        "        question or just want to say hi, I will try my best to get back to you!"
      ),
  ].join("\n");

  const card = boxen(output, {
    margin: 1,
    float: "center",
    padding: 1,
    borderStyle: "round",
    borderColor: "cyan", // Changed from green to cyan for a modern look
  });

  console.log(card);
  console.log(
    `Tip: Try ${chalk.cyanBright.bold("cmd/ctrl + click")} on the links above\n`
  );
};

/**
 * Main entry point
 */
const main = async () => {
  try {
    const configPath = resolvePath(styledDataFilename);

    // Check if file exists before reading
    if (!fs.existsSync(configPath)) {
      throw new Error(`Config file not found at: ${configPath}`);
    }

    const infoData = JSON.parse(fs.readFileSync(configPath, "utf8"));

    renderCard(infoData);
    await handleMainPrompt(infoData);
  } catch (err) {
    console.log(chalk.bgRed.bold(` Error: `) + " " + chalk.red(err.message));
    process.exit(1);
  }
};

main();
