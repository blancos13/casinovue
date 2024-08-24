<template>
    <div class="battles-create-footer">
        <div class="footer-left">
            <div class="left-private" v-bind:class="{ 'private-active': battlesFilterPrivate === true }">
                PRIVATE
                <button v-on:click="battlesPrivateToggle()"></button>
            </div>
            <div v-if="battlesFilterPrivate === true" class="left-affiliate" v-bind:class="{ 'affiliate-active': battlesFilterAffiliate === true }">
                AFFILIATES ONLY
                <button v-on:click="battlesSetFilterAffiliate(!battlesFilterAffiliate)"></button>
            </div>
        </div>
        <div class="footer-right">
            <div class="right-cursed" v-bind:class="{ 'cursed-active': battlesFilterCursed === true }">
                <IconCursedGradient />
                <span>CURSED MODE</span>
                <button v-on:click="battlesCursedToggle(!battlesFilterCursed)"></button>
            </div>
            <div class="right-terminal" v-bind:class="{ 'terminal-active': battlesFilterTerminal === true }">
                <IconTerminalGradient />
                <span>TERMINAL MODE</span>
                <button v-on:click="battlesTerminalToggle(!battlesFilterTerminal)"></button>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';
    import IconTerminalGradient from '@/components/icons/IconTerminalGradient';
    import IconCursedGradient from '@/components/icons/IconCursedGradient';

    export default {
        name: 'BattlesCreateFooter',
        components: {
            IconTerminalGradient,
            IconCursedGradient
        },
        methods: {
            ...mapActions([
                'modalsSetShow',
                'modalsSetData',
                'battlesSetFilterPrivate',
                'battlesSetFilterAffiliate',
                'battlesSetFilterCursed',
                'battlesSetFilterTerminal'
            ]),
            battlesPrivateToggle() {
                if(this.battlesFilterPrivate === true) { this.battlesSetFilterAffiliate(false); }
                this.battlesSetFilterPrivate(!this.battlesFilterPrivate);
            },
            battlesCursedToggle(value) {
                if(value === true && localStorage.getItem('battlesInfoCursed') === null) {
                    this.modalsSetData({ mode: 'cursed' });
                    this.modalsSetShow('BattlesModes');
                    localStorage.setItem('battlesInfoCursed', 1);
                }

                this.battlesSetFilterCursed(value);
            },
            battlesTerminalToggle(value) {
                if(value === true && localStorage.getItem('battlesInfoTerminal') === null) {
                    this.modalsSetData({ mode: 'terminal' });
                    this.modalsSetShow('BattlesModes');
                    localStorage.setItem('battlesInfoTerminal', 1);
                }

                this.battlesSetFilterTerminal(value);
            }
        },
        computed: {
            ...mapGetters([
                'battlesFilterPrivate',
                'battlesFilterAffiliate',
                'battlesFilterCursed',
                'battlesFilterTerminal'
            ]) 
        }
    }
</script>

<style scoped>
    .battles-create-footer {
        width: 100%;
        display: flex;
        justify-content: space-between;
        margin-top: 25px;
        padding-top: 25px;
        border-top: 1px solid rgba(28, 71, 182, 0.15);
    }

    .battles-create-footer .footer-left,
    .battles-create-footer .footer-right {
        display: flex;
        align-items: center;
    }

    .battles-create-footer .left-private,
    .battles-create-footer .left-affiliate {
        display: flex;
        align-items: center;
        font-size: 14px;
        font-weight: 800;
        color: #3f617e;
    }

    .battles-create-footer .left-affiliate {
        position: relative;
        margin-left: 20px;
        padding-left: 20px;
    }

    .battles-create-footer .left-affiliate:before {
        content: '';
        width: 1px;
        height: 27px;
        position: absolute;
        top: 50%;
        left: 0;
        transform: translate(0, -50%);
        background: linear-gradient(0deg, rgba(97, 112, 241, 0) 0%, rgba(64, 92, 212, 0.35) 48.86%, rgba(28, 71, 182, 0) 100%);
    }

    .battles-create-footer .left-private button,
    .battles-create-footer .left-affiliate button {
        width: 45px;
        height: 15px;
        position: relative;
        margin-left: 12px;
        filter: drop-shadow(0px 4px 25px rgba(15, 41, 63, 0.35));
    }

    .battles-create-footer .left-private button:before,
    .battles-create-footer .left-affiliate button:before {
        content: '';
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background-color: #031523;
        clip-path: polygon(4px 0, calc(100% - 4px) 0, 100% 25%, 100% 75%, calc(100% - 4px) 100%, 4px 100%, 0 75%, 0 25%);
    }

    .battles-create-footer .left-private button:after,
    .battles-create-footer .left-affiliate button:after {
        content: '';
        width: 25px;
        height: 19px;
        position: absolute;
        top: -2px;
        left: 0;
        background: #0a2f4b;
        clip-path: polygon(3px 0, calc(100% - 3px) 0, 100% 25%, 100% 75%, calc(100% - 3px) 100%, 3px 100%, 0 75%, 0 25%);
        transition: all 0.3s ease;
    }

    .battles-create-footer .left-private.private-active button:after,
    .battles-create-footer .left-affiliate.affiliate-active button:after {
        transform: translate(20px, 0);
        background: linear-gradient(255deg, #00ffc2 0%, #00aa6d 100%);
    }

    .battles-create-footer .right-cursed,
    .battles-create-footer .right-terminal {
        display: flex;
        align-items: center;
    }

    .battles-create-footer .right-terminal {
        position: relative;
        margin-left: 20px;
        padding-left: 20px;
    }

    .battles-create-footer .right-terminal:before {
        content: '';
        width: 1px;
        height: 27px;
        position: absolute;
        top: 50%;
        left: 0;
        transform: translate(0, -50%);
        background: linear-gradient(0deg, rgba(97, 112, 241, 0) 0%, rgba(64, 92, 212, 0.35) 48.86%, rgba(28, 71, 182, 0) 100%);
    }

    .battles-create-footer .right-cursed svg,
    .battles-create-footer .right-terminal svg {
        margin-right: 6px;
    }

    .battles-create-footer .right-cursed span,
    .battles-create-footer .right-terminal span {
        margin-right: 12px;
        font-size: 14px;
        font-weight: 800;
        color: #3f617e;
    }

    .battles-create-footer .right-cursed.cursed-active span {
        color: #f24034;
    }

    .battles-create-footer .right-terminal.terminal-active span {
        background: linear-gradient(216deg, #ead621 0%, #ff8e26 100%);
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }

    .battles-create-footer .right-cursed button,
    .battles-create-footer .right-terminal button {
        width: 45px;
        height: 15px;
        position: relative;
        filter: drop-shadow(0px 4px 25px rgba(15, 41, 63, 0.35));
    }

    .battles-create-footer .right-cursed button:before,
    .battles-create-footer .right-terminal button:before {
        content: '';
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background-color: #031523;
        clip-path: polygon(4px 0, calc(100% - 4px) 0, 100% 25%, 100% 75%, calc(100% - 4px) 100%, 4px 100%, 0 75%, 0 25%);
    }

    .battles-create-footer .right-cursed button:after,
    .battles-create-footer .right-terminal button:after {
        content: '';
        width: 25px;
        height: 19px;
        position: absolute;
        top: -2px;
        left: 0;
        background: #0a2f4b;
        clip-path: polygon(3px 0, calc(100% - 3px) 0, 100% 25%, 100% 75%, calc(100% - 3px) 100%, 3px 100%, 0 75%, 0 25%);
        transition: all 0.3s ease;
    }

    .battles-create-footer .right-cursed.cursed-active button:after,
    .battles-create-footer .right-terminal.terminal-active button:after {
        transform: translate(20px, 0);
        background: linear-gradient(255deg, #00ffc2 0%, #00aa6d 100%);
    }

    @media only screen and (max-width: 850px) {

        .battles-create-footer {
            flex-direction: column;
        }

        .battles-create-footer .footer-right {
            margin-top: 25px;
        }

    }

    @media only screen and (max-width: 500px) {

        

    }
</style>