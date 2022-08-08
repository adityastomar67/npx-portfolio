#!/usr/bin/env node

const chalk = require('chalk');
const boxen = require('boxen');

const fs = require('fs');
const path = require('path');

const styledDataFilename = 'personal-info.json';

try {
  const res = fs.readFileSync(
    path.resolve(__dirname, `../${styledDataFilename}`)
  );
  const infoData = JSON.parse(res);

  const {
    first_name,
    last_name,
    job_title,
    github_link,
    twitter_link,
    linkedin_link,
    website_link,
  } = infoData;

  const styledData = {
    firstName: chalk.yellowBright.bold.italic.underline(first_name),
    lastName: chalk.yellow.bold.italic.underline(last_name),

    labelWork: chalk.white.bold('Work:'),
    work: chalk.magenta(job_title),

    labelGitHub: chalk.white.bold('GitHub:'),
    gitHub: chalk.cyan(github_link),

    labelTwitter: chalk.white.bold('Twitter:'),
    twitter: chalk.cyan(twitter_link),

    labelLinkedIn: chalk.white.bold('LinkedIn:'),
    linkedIn: chalk.cyan(linkedin_link),

    labelWebsite: chalk.white.bold('Website:'),
    website: chalk.cyan(website_link),

    labelCard: chalk.white.bold('Card:'),
    npxCard: chalk.white.underline('npx biolinks'),
  };

  const newline = '\n';
  const output =
    newline +
    `${styledData.firstName} ${styledData.lastName}` +
    newline +
    newline +
    `${styledData.labelWork}  ${styledData.work}` +
    newline +
    `${styledData.labelGitHub}  ${styledData.gitHub}` +
    newline +
    `${styledData.labelTwitter}  ${styledData.twitter}` +
    newline +
    `${styledData.labelLinkedIn}  ${styledData.linkedIn}` +
    newline +
    `${styledData.labelWebsite}  ${styledData.website}` +
    newline +
    `${styledData.labelCard}  ${styledData.npxCard} `;

  // The Boxen options
  const options = {
    padding: 1,
    margin: 1,
    borderStyle: 'round',
    textAlignment: 'center',
  };

  console.log(chalk.green(boxen(output, options)));
} catch (err) {
  console.log(chalk.bgRed.bold(`Cannot read "${styledDataFilename}" file!`));
  console.log(chalk.italic(err.message));
}
