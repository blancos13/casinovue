const generalCheckSendVaultDepositData = (data) => {
    if(data === undefined || data === null) {
        throw new Error('Something went wrong! Please try again in a few seconds.');
    } else if(data.amount === undefined || data.amount === null || isNaN(data.amount) === true || Math.floor(data.amount) <= 0) {
        throw new Error('You’ve entered an invalid deposit amount.');
    }
}

const generalCheckSendVaultDepositUser = (data, user) => {
    if(user.balance < Math.floor(data.amount)) {
        throw new Error('You don’t have enough balance for this action.');
    } else if(new Date(user.vault.expireAt).getTime() >= new Date().getTime()) {
        throw new Error('You can’t deposit because your vault is locked.');
    }
}

const generalCheckSendVaultWithdrawData = (data) => {
    if(data === undefined || data === null) {
        throw new Error('Something went wrong! Please try again in a few seconds.');
    } else if(data.amount === undefined || data.amount === null || isNaN(data.amount) === true || Math.floor(data.amount) <= 0) {
        throw new Error('You’ve entered an invalid withdraw amount.');
    }
}

const generalCheckSendVaultWithdrawUser = (data, user) => {
    if(user.vault.amount < Math.floor(data.amount)) {
        throw new Error('You don’t have enough balance in the vault for this action.');
    } else if(new Date(user.vault.expireAt).getTime() >= new Date().getTime()) {
        throw new Error('You can’t withdraw because your vault is locked.');
    }
}

const generalCheckSendVaultLockData = (data) => {
    if(data === undefined || data === null) {
        throw new Error('Something went wrong! Please try again in a few seconds.');
    } else if(data.time === undefined || data.time === null || isNaN(data.time) === true || Math.floor(data.time) <= 0) {
        throw new Error('You’ve entered an invalid lock time.');
    }
}

const generalCheckSendVaultLockUser = (user) => {
    if(new Date(user.vault.expireAt).getTime() >= new Date().getTime()) {
        throw new Error('You can’t lock because your vault is already locked.');
    }
}

module.exports = {
    generalCheckSendVaultDepositData,
    generalCheckSendVaultDepositUser,
    generalCheckSendVaultWithdrawData,
    generalCheckSendVaultWithdrawUser,
    generalCheckSendVaultLockData,
    generalCheckSendVaultLockUser
}