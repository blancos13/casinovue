const adminCheckGetStatsListData = (data) => {
    if(data === undefined || data === null) {
        throw new Error('Something went wrong. Please try again in a few seconds.');
    } else if(data.page === undefined || data.page === null || isNaN(data.page) === true || data.page <= 0) {
        throw new Error('Your entered page is invalid.');
    }
}

const adminFormatStats = (statsDatabase) => {
    let formated = {
        daily: { start: new Date(), profit: 0 },
        weekly: { start: new Date(new Date().getTime() - (1000 * 60 * 60 * 24 * 7)), end: new Date(), profit: 0 },
        monthly: { start: new Date(new Date().getTime() - (1000 * 60 * 60 * 24 * 30)), end: new Date(), profit: 0 },
        total: { start: statsDatabase.length > 0 ? new Date(statsDatabase[statsDatabase.length - 1].createdAt) : new Date(), end: new Date(), profit: 0 },
    };

    for(let report of statsDatabase) {
        formated.total.profit = formated.total.profit + Math.floor(report.stats.total.deposit - report.stats.total.withdraw);

        if(new Date(report.createdAt).getTime() > new Date(new Date().toISOString().slice(0, 10)).getTime() - (1000 * 60 * 60 * 24 * 30)) {
            formated.monthly.profit = formated.monthly.profit + Math.floor(report.stats.total.deposit - report.stats.total.withdraw);

            if(new Date(report.createdAt).getTime() > new Date(new Date().toISOString().slice(0, 10)).getTime() - (1000 * 60 * 60 * 24 * 7)) {
                formated.weekly.profit = formated.weekly.profit + Math.floor(report.stats.total.deposit - report.stats.total.withdraw);

                if(new Date(report.createdAt).toISOString().slice(0, 10) === new Date().toISOString().slice(0, 10)) { formated.daily.profit = Math.floor(report.stats.total.deposit - report.stats.total.withdraw); }
            }
        }
    }

    return formated;
}

module.exports = {
    adminCheckGetStatsListData,
    adminFormatStats
}
