const generalCheckSendRakebackClaimUser = (user) => {
    if(user.rakeback.available < 10) {
        throw new Error(`You’ll need a minimum of 0.01 Robux in rakeback earnings to claim.`);
    }
}

module.exports = {
    generalCheckSendRakebackClaimUser

}