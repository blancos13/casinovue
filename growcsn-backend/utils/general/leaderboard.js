const generalGetLeaderboardTimeLeft = (dataLeaderboard) => {
    return new Date(new Date(dataLeaderboard.updatedAt).setHours(0,0,0,0)).getTime() + (1000 * 60 * 60 * 24 * Number(dataLeaderboard.duration)) - new Date().getTime();
}

module.exports = {

    

    generalGetLeaderboardTimeLeft
}