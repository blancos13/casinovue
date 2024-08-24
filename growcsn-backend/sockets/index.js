module.exports = (io) => {

    require('./general')(io);
    require('./crash')(io);
    require('./roll')(io);
    require('./blackjack')(io);
    require('./duels')(io);
    require('./mines')(io);
    require('./towers')(io);
    require('./unbox')(io);
    require('./battles')(io);
    require('./upgrader')(io);
    require('./cashier')(io);
    require('./admin')(io);

}
