#!/usr/bin/env node

'use strict'

const boxen = require("boxen");
const chalk = require("chalk");
const inquirer = require("inquirer");
const clear = require("clear");
const open = require("open");
const fs = require('fs');
const request = require('request');
const path = require('path');
const ora = require('ora');
const cliSpinners = require('cli-spinners');
clear();

const prompt = inquirer.createPromptModule();

// const fs = require('fs')
// const path = require('path');

const styledDataFilename = 'personal-info.json';

try {
    const res = fs.readFileSync(
        path.resolve(__dirname, `../${styledDataFilename}`)
    );
    const infoData = JSON.parse(res);

    const {
        full_name,
        job_title,
        handle,
        github_link,
        twitter_link,
        linkedin_link,
        github_handle,
        twitter_handle,
        linkedin_handle,
        email,
        website_link,
    } = infoData;

    const questions = [
        {
            type: "list",
            name: "action",
            message: "What you want to do?",
            choices: [
                {
                    name: `Send me an ${chalk.green.bold("email")}?`,
                    value: () => {
                        open(`mailto:${email}`);
                        console.log("\nDone, see you soon at inbox.\n");
                    }
                },
                // For downloading and showing the resume as html file
                // {
                //     name: `Download my ${chalk.magentaBright.bold("Resume")}?`,
                //     value: () => {
                //         // cliSpinners.dots;
                //         const loader = ora({
                //             text: ' Downloading Resume',
                //             spinner: cliSpinners.material,
                //         }).start();
                //         let pipe = request('https://#/api/resume').pipe(fs.createWriteStream('./aditya-resume.html'));
                //         pipe.on("finish", function () {
                //             let downloadPath = path.join(process.cwd(), 'anmol-resume.html')
                //             console.log(`\nResume Downloaded at ${downloadPath} \n`);
                //             open(downloadPath)
                //             loader.stop();
                //         });
                //     }
                // },
                {
                    name: `Schedule a ${chalk.redBright.bold("Meeting")}?`,
                    value: () => {
                        open('https://calendly.com/adityastomar67/30min');
                        console.log("\n See you at the meeting \n");
                    }
                },
                {
                    name: "Just quit.",
                    value: () => {
                        console.log("Hasta la vista.\n");
                    }
                }
            ]
        }
    ];

    const data = {
        name: chalk.bold.green(`                 ${full_name} `),
        handle: chalk.white(`@${handle}`),
        work: `${chalk.white(`${job_title}`)} ${chalk
            .hex("#0F3460")
            .bold("Nagarro")}`,
        twitter: chalk.gray(`${twitter_link}`) + chalk.cyan(`${twitter_handle}`),
        github: chalk.gray(`${github_link}`) + chalk.green(`${github_handle}`),
        linkedin: chalk.gray(`${linkedin_link}`) + chalk.blue(`${linkedin_handle}`),
        web: chalk.cyan(`${website_link}`),
        npx: chalk.red("npx") + " " + chalk.white(`${handle}`),
        separator: chalk.hex("#E94560")(":"),
        labelWork: chalk.white.bold("       Work"),
        labelTwitter: chalk.white.bold("    Twitter"),
        labelGitHub: chalk.white.bold("     GitHub"),
        labelLinkedIn: chalk.white.bold("   LinkedIn"),
        labelWeb: chalk.white.bold("        Web"),
        labelCard: chalk.white.bold("       Card")
    };

    const me = boxen(
        [
            `                  ${data.name}`,
            ``,
            `                   ${data.labelWork}${data.separator}  ${data.work}`,
            ``,
            `                   ${data.labelTwitter}${data.separator}  ${data.twitter}`,
            `                   ${data.labelGitHub}${data.separator}  ${data.github}`,
            `                   ${data.labelLinkedIn}${data.separator}  ${data.linkedin}`,
            `                   ${data.labelWeb}${data.separator}  ${data.web}`,
            ``,
            `                   ${data.labelCard}${data.separator}  ${data.npx}`,
            ``,
            `${chalk.italic(
                "I am currently looking for new opportunities, my inbox is always open. Whether you have a"
            )}`,
            `${chalk.italic(
                "        question or just want to say hi, I will try my best to get back to you!"
            )}`,
        ].join("\n"),
        {
            margin: 1,
            float: 'center',
            padding: 1,
            borderStyle: "single",
            borderColor: "green"
        }
    );

    console.log(me);
    const tip = [
        `Tip: Try ${chalk.cyanBright.bold(
            "cmd/ctrl + click"
        )} on the links above`,
        '',
    ].join("\n");
    console.log(tip);

    prompt(questions).then(answer => answer.action());
} catch (err) {
    console.log(chalk.bgRed.bold(`Cannot read "${styledDataFilename}" file!`));
    console.log(chalk.italic(err.message));
}
