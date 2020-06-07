/* eslint-disable no-console */
import fs from "fs";

const { stat, rmdir } = fs.promises;
const dirs = process.argv.slice(2);
const statResults = [];

// Check that each dir exists. An error will be thrown for any dir that doesn't exist, but we need
// all the promises to be resolved for Promise.all, so we must intercept the error.
dirs.forEach((dir) => {
  statResults.push(
    stat(dir)
      .then((dirStat) => ({ dir, stat: dirStat }))
      .catch(() => null)
  );
});

// Remove the dirs that exist and are directories
Promise.all(statResults)
  .then((stats) => stats.filter((dirStat) => dirStat && dirStat.stat.isDirectory()))
  .then((existingDirStats) => {
    const rmdirResults = [];

    existingDirStats.forEach(({ dir }) => {
      rmdirResults.push(rmdir(dir, { recursive: true }));
    });

    return Promise.all(rmdirResults);
  })
  .then(() => {
    process.exit();
  })
  .catch((reason) => {
    console.log(reason.message);
    process.exit(1);
  });
