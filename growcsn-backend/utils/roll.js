/** @format */

const crypto = require("crypto");
// Load database models
const RollGame = require("../database/models/RollGame");
const RollSeed = require("../database/models/RollSeed");

const rollCheckSendBetData = (data) => {
  if (data === undefined || data === null) {
    throw new Error("Something went wrong. Please try again in a few seconds.");
  } else if (
    data.amount === undefined ||
    data.amount === null ||
    isNaN(data.amount) === true ||
    Math.floor(data.amount) <= 0
  ) {
    throw new Error("You’ve entered an invalid bet amount.");
  } else if (
    data.multiplier === undefined ||
    data.multiplier === null ||
    isNaN(data.multiplier) === true ||
    Math.floor(data.multiplier) <= 100
  ) {
    throw new Error("Your entered bet multiplier is invalid.");
  } else if (
    Math.floor(data.amount) < Math.floor(process.env.ROLL_MIN_AMOUNT * 1000)
  ) {
    throw new Error(
      `You can only bet a min amount of DL${parseFloat(
        process.env.ROLL_MIN_AMOUNT
      )
        .toFixed(2)
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")} per game.`
    );
  }
};

const rollCheckSendBetUser = (data, user, userStats) => {
  if (data === undefined || user === undefined) {
    throw new Error("Something went wrong. Please try again in a few seconds.");
  } else if (user.balance < Math.floor(data.amount)) {
    throw new Error("You don’t have enough balance for this action.");
  } else if (
    Math.floor(data.amount + userStats.bet) >
    Math.floor(process.env.ROLL_MAX_AMOUNT * 1000)
  ) {
    throw new Error(
      `You can only bet a total max amount of DL${parseFloat(
        process.env.ROLL_MAX_AMOUNT
      )
        .toFixed(2)
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")} per game.`
    );
  } else if (
    Math.floor(data.amount * (data.multiplier / 100) + userStats.winnings) >
    Math.floor(process.env.ROLL_MAX_PROFIT * 1000)
  ) {
    throw new Error(
      `You can only have a total max win amount of DL${parseFloat(
        process.env.ROLL_MAX_PROFIT
      )
        .toFixed(2)
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")} per game.`
    );
  }
};

const rollCheckSendBetGame = (rollGame) => {
  if (rollGame === undefined || rollGame === null) {
    throw new Error("Something went wrong. Please try again in a few seconds.");
  } else if (rollGame.state !== "created") {
    throw new Error("You need to wait for the next round before you can bet.");
  }
};

const rollGetUserGameStats = (user, rollBets) => {
  let stats = { bet: 0, winnings: 0 };

  for (const bet of rollBets) {
    if (bet.user._id.toString() === user._id.toString()) {
      stats.bet = Math.floor(stats.bet + bet.amount);
      stats.winnings = Math.floor(
        stats.winnings + bet.amount * (bet.multiplier / 100)
      );
    }
  }

  return stats;
};

const rollGenerateGame = () => {
  return new Promise(async (resolve, reject) => {
    try {
      // Generate random user client seed
      const seedClient = crypto.randomBytes(8).toString("hex");

      // Generate new user server seed
      const seedServer = crypto.randomBytes(24).toString("hex");

      // Hash new generated user server seed
      const hash = crypto.createHash("sha256").update(seedServer).digest("hex");

      // Get server seed from database
      console.log("Jimmy roll");

      const seedDatabase = await RollSeed.findOne({ state: "created" })
        .sort({ _id: -1 })
        .lean();

      console.log("seedDatabase", seedDatabase);

      if (seedDatabase !== null && seedDatabase !== undefined) {
        // Continue with your further operations here
        console.log("seedDatabase._id", seedDatabase._id);
      } else {
        console.error("No RollSeed document found with state 'created'");
      }

      // Create new crash game and update used server seed in database
      let dataDatabase = await Promise.all([
        RollGame.create({
          fair: {
            seed: seedDatabase._id,
          },
          state: "created",
        }),
        RollSeed.findByIdAndUpdate(
          seedDatabase._id,
          {
            state: "completed",
          },
          {}
        ),
        // Create new server seed for new game
        RollSeed.create({
          seedPublic: seedClient,
          seedServer: seedServer,
          hash: hash,
          state: "created",
        }),
      ]);
      dataDatabase[0] = await dataDatabase[0].populate({
        path: "fair.seed",
        select: "seedServer hash",
      });
      dataDatabase[0] = dataDatabase[0].toObject();

      resolve(dataDatabase[0]);
    } catch (err) {
      reject(err);
    }
  });
};

const rollGetOutcome = (combined) => {
  const mod = parseInt(100 / (0.05 * 100));
  if (rollIsHashDivisible(combined, mod) === true) {
    return 100;
  }

  const h = parseInt(combined.slice(0, 52 / 4), 16);
  const e = Math.pow(2, 52);

  return Math.floor((100 * e - h) / (e - h));
};

const rollIsHashDivisible = (combined, mod) => {
  let val = 0;

  let o = combined.length % 4;
  for (let i = o > 0 ? o - 4 : 0; i < combined.length; i += 4) {
    val = ((val << 16) + parseInt(combined.substring(i, i + 4), 16)) % mod;
  }

  return val === 0;
};

const rollSanitizeGame = (game) => {
  let sanitized = JSON.parse(JSON.stringify(game));

  if (sanitized.state !== "rolling" && sanitized.state !== "completed") {
    delete sanitized.outcome;
    delete sanitized.fair;
  }

  return sanitized;
};

const rollSanitizeBets = (bets) => {
  let sanitized = [];

  for (const bet of bets) {
    sanitized.push({
      ...bet,
      user: {
        _id: bet.user._id,
        roblox: bet.user.roblox,
        username: bet.user.username,
        avatar: bet.user.avatar,
        rank: bet.user.rank,
        level: bet.user.level,
        rakeback: bet.user.rakeback.name,
        stats: bet.user.stats,
        createdAt: bet.user.createdAt,
      },
    });
  }

  return sanitized;
};

const rollSanitizeBet = (bet) => {
  let sanitized = JSON.parse(JSON.stringify(bet));

  sanitized.user = {
    _id: sanitized.user._id,
    roblox: sanitized.user.roblox,
    username: sanitized.user.username,
    avatar: sanitized.user.avatar,
    rank: sanitized.user.rank,
    level: sanitized.user.level,
    rakeback: sanitized.user.rakeback.name,
    stats: sanitized.user.stats,
    createdAt: sanitized.user.createdAt,
  };

  return sanitized;
};

module.exports = {
  rollCheckSendBetData,
  rollCheckSendBetUser,
  rollCheckSendBetGame,
  rollGetUserGameStats,
  rollGenerateGame,
  rollGetOutcome,
  rollSanitizeGame,
  rollSanitizeBets,
  rollSanitizeBet,
};
