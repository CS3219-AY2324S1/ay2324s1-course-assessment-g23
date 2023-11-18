const functions = require("@google-cloud/functions-framework");
const cheerio = require("cheerio");
const fetch = require("node-fetch");
const TurndownService = require('turndown');

// Define the HTTP function
functions.http("fetchLeetCodeQuestions", async (req, res) => {
  try {
    const turndownService = new TurndownService();
    const response = await fetch("https://bishalsarang.github.io/Leetcode-Questions/out.html");
    const body = await response.text();
    const $ = cheerio.load(body);
    const questions = [];

    $('[id^="title"]').each((index, element) => {
      const title = $(element).text().trim().replace(/^[0-9]+\.\s+/, '');
      const description = $(element).next('.content__u3I1.question-content__JfgR').html();

      if (title && description)
        questions.push({
          title,
          description: turndownService.turndown(description.replaceAll('\n', '')),
        });
    });

    res.status(200).json(questions);
  } catch (error) {
    res.status(500).send(error.message);
  }
});
