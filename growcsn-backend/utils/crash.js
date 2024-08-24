/** @format */

const crypto = require("crypto");

// Load database models
const CrashGame = require("../database/models/CrashGame");
const CrashSeed = require("../database/models/CrashSeed");

const crashCheckSendBetData = (data) => {
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
    data.autoCashout === undefined ||
    data.autoCashout === null ||
    isNaN(data.autoCashout) === true ||
    Math.floor(data.autoCashout) < 0
  ) {
    throw new Error("Your entered auto cashout is invalid.");
  } else if (
    Math.floor(data.amount) < Math.floor(process.env.CRASH_MIN_AMOUNT * 1000)
  ) {
    throw new Error(
      `You can only bet a min amount of DL${parseFloat(
        process.env.CRASH_MIN_AMOUNT
      )
        .toFixed(2)
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")} per game.`
    );
  } else if (
    Math.floor(data.amount) > Math.floor(process.env.CRASH_MAX_AMOUNT * 1000)
  ) {
    throw new Error(
      `You can only bet a max amount of DL${parseFloat(
        process.env.CRASH_MAX_AMOUNT
      )
        .toFixed(2)
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")} per game.`
    );
  }
};

const crashCheckSendBetUser = (data, user, crashBets) => {
  if (user.balance < Math.floor(data.amount)) {
    throw new Error("You don’t have enough balance for this action.");
  } else if (
    crashBets.some(
      (element) => element.user._id.toString() === user._id.toString()
    ) === true
  ) {
    throw new Error("You can only bet one time per round.");
  }
};

const crashCheckSendBetGame = (crashGame) => {
  if (crashGame === undefined || crashGame === null) {
    throw new Error("Something went wrong. Please try again in a few seconds.");
  } else if (crashGame.state !== "created") {
    throw new Error("You need to wait for the next round before you can bet.");
  }
};

const crashCheckSendCashoutGame = (crashGame, gameMultiplier) => {
  if (crashGame === undefined || crashGame === null) {
    throw new Error("Something went wrong. Please try again in a few seconds.");
  } else if (crashGame.state !== "rolling" || gameMultiplier <= 100) {
    throw new Error(
      "You need to wait for the start of the round before you can cashout."
    );
  }
};

const crashCheckSendCashoutBet = (crashGame, gameMultiplier, userBet) => {
  if (crashGame === undefined || userBet === undefined) {
    throw new Error("Something went wrong. Please try again in a few seconds.");
  }
  if (
    userBet === null ||
    userBet.multiplier !== undefined ||
    (userBet.autoCashout >= 101 && userBet.autoCashout <= gameMultiplier)
  ) {
    throw new Error("Your bet is not available or was already cashed out.");
  } else if (crashGame.outcome < gameMultiplier) {
    throw new Error(
      "Your are not allowed to cashout your bet because the game already completed."
    );
  }
};

const crashGenerateGame = () => {
  return new Promise(async (resolve, reject) => {
    try {
      // Generate random user client seed
      const seedClient = crypto.randomBytes(8).toString("hex");

      // Generate new user server seed
      const seedServer = crypto.randomBytes(24).toString("hex");

      // Hash new generated user server seed
      const hash = crypto.createHash("sha256").update(seedServer).digest("hex");

      // Get server seed from database
      console.log("jimmy");
      const seedDatabase = await CrashSeed.findOne({ state: "created" })
        .sort({ _id: -1 })
        .lean();
      console.log("seedDatabase", seedDatabase);
      // Create new crash game and update used server seed in database
      let dataDatabase = await Promise.all([
        CrashGame.create({
          fair: {
            seed: seedDatabase._id,
          },
          state: "created",
        }),
        CrashSeed.findByIdAndUpdate(
          seedDatabase._id,
          {
            state: "completed",
          },
          {}
        ),
        // Create new server seed for new game
        CrashSeed.create({
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

const crashGetGameMultiplier = (elapsed) => {
  return Math.floor(100 * Math.pow(Math.E, 0.00006 * elapsed));
};

const crashGetOutcome = (combined) => {
  const mod = parseInt(100 / (0.05 * 100));
  if (crashIsHashDivisible(combined, mod) === true) {
    return 100;
  }

  const h = parseInt(combined.slice(0, 52 / 4), 16);
  const e = Math.pow(2, 52);

  return Math.floor((100 * e - h) / (e - h));
};

const crashIsHashDivisible = (combined, mod) => {
  let val = 0;

  let o = combined.length % 4;
  for (let i = o > 0 ? o - 4 : 0; i < combined.length; i += 4) {
    val = ((val << 16) + parseInt(combined.substring(i, i + 4), 16)) % mod;
  }

  return val === 0;
};

const crashSanitizeGame = (game) => {
  let sanitized = JSON.parse(JSON.stringify(game));

  if (sanitized.state !== "completed") {
    delete sanitized.outcome;
    delete sanitized.fair;
  }

  return sanitized;
};

const crashSanitizeBets = (bets) => {
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
        rakeback: bet.user.rakeback,
        stats: bet.user.stats,
        createdAt: bet.user.createdAt,
      },
    });
  }

  return sanitized;
};

const crashSanitizeBet = (bet) => {
  let sanitized = JSON.parse(JSON.stringify(bet));

  sanitized.user = {
    _id: sanitized.user._id,
    roblox: sanitized.user.roblox,
    username: sanitized.user.username,
    avatar: sanitized.user.avatar,
    rank: sanitized.user.rank,
    level: sanitized.user.level,
    rakeback: sanitized.user.rakeback,
    stats: sanitized.user.stats,
    createdAt: sanitized.user.createdAt,
  };

  return sanitized;
};

module.exports = {
  crashCheckSendBetData,
  crashCheckSendBetUser,
  crashCheckSendBetGame,
  crashCheckSendCashoutGame,
  crashCheckSendCashoutBet,
  crashGetGameMultiplier,
  crashGenerateGame,
  crashGetOutcome,
  crashSanitizeGame,
  crashSanitizeBets,
  crashSanitizeBet,
};
