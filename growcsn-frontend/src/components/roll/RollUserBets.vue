<template>
    <div class="roll-user-bets">

        <RollUserBetsElement v-for="bet of rollGetUserBets" v-bind:key="bet._id" v-bind:bet="bet" />

    </div>
</template>

<script>
    import { mapGetters } from 'vuex';
    import RollUserBetsElement from '@/components/roll/RollUserBetsElement';

    export default {
        name: 'RollUserBets',
        components: {
            RollUserBetsElement
        },
        computed: {
            ...mapGetters(['authUser', 'rollBets']),
            rollGetUserBets() {
                let bets = [];

                for(let bet of (this.authUser.user !== null ? this.rollBets.filter((element) => element.user._id === this.authUser.user._id) : [])) {
                    const index = bets.findIndex((element) => element.baseAmount === bet.amount && element.multiplier === bet.multiplier);
                    
                    if(index !== -1) { 
                        bets[index].amount = bets[index].amount + bet.amount; 
                    } else { 
                        bet = { ...bet, baseAmount: bet.amount } 
                        bets.push(bet); 
                    }
                }

                bets.sort(function(a, b) { return +b.amount - +a.amount; });

                return bets;
            }
        }
    }
</script>

<style scoped>
    .roll-user-bets {
        width: 100%;
        min-height: 125px;
        display: flex;
        flex-wrap: wrap;
        margin-top: 25px;
    }
</style>
