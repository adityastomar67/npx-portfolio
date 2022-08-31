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

const questions = [
    {
        type: "list",
        name: "action",
        message: "What you want to do?",
        choices: [
            {
                name: `Send me an ${chalk.green.bold("email")}?`,
                value: () => {
                    open("mailto:adityastomar67@gmail.com");
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
    name: chalk.bold.green("                 Aditya Singh Tomar "),
    handle: chalk.white("@adityastomar67"),
    work: `${chalk.white("Software Engineer Intern")} ${chalk
        .hex("#2b82b2")
        .bold("Nagarro")}`,
    twitter: chalk.gray("https://twitter.com/") + chalk.cyan("singhhhx"),
    github: chalk.gray("https://github.com/") + chalk.green("adityastomar67"),
    linkedin: chalk.gray("https://linkedin.com/in/") + chalk.blue("adityastomar67"),
    web: chalk.cyan("#"),
    npx: chalk.red("npx") + " " + chalk.white("adityastomar67"),

    labelWork: chalk.white.bold("       Work:"),
    labelTwitter: chalk.white.bold("    Twitter:"),
    labelGitHub: chalk.white.bold("     GitHub:"),
    labelLinkedIn: chalk.white.bold("   LinkedIn:"),
    labelWeb: chalk.white.bold("        Web:"),
    labelCard: chalk.white.bold("       Card:")
};

const me = boxen(
    [
        `                  ${data.name}`,
        ``,
        `                   ${data.labelWork}  ${data.work}`,
        ``,
        `                   ${data.labelTwitter}  ${data.twitter}`,
        `                   ${data.labelGitHub}  ${data.github}`,
        `                   ${data.labelLinkedIn}  ${data.linkedin}`,
        `                   ${data.labelWeb}  ${data.web}`,
        ``,
        `                   ${data.labelCard}  ${data.npx}`,
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

