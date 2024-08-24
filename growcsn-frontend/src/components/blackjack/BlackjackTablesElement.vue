<template>
    <router-link v-bind:to="'/blackjack/table/' + (table.table + 1)" class="blackjack-tables-element">
        <div class="element-inner">
            <div class="inner-info">
                <div class="info-name">LOBBY {{table.table + 1}}</div>
                <IconUsers />
                <span class="gradient-green">{{table.players.length}} / 5</span>
            </div>
        </div>
    </router-link>
</template>

<script>
    import IconUsers from '@/components/icons/IconUsers';

    export default {
        name: 'BlackjackTablesElement',
        props: ['table'],
        components: {
            IconUsers
        }
    }
</script>

<style scoped>
    a.blackjack-tables-element {
        width: calc(20% - 8px);
        height: 150px;
        position: relative;
        margin-top: 10px;
        margin-right: 10px;
    }

    a.blackjack-tables-element:nth-child(1),
    a.blackjack-tables-element:nth-child(2),
    a.blackjack-tables-element:nth-child(3),
    a.blackjack-tables-element:nth-child(4),
    a.blackjack-tables-element:nth-child(5) {
        margin-top: 0;
    }

    a.blackjack-tables-element:nth-child(5n) {
        margin-right: 0;
    }

    a.blackjack-tables-element::before {
        content: '';
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background: linear-gradient(180deg, #051827 0%, #102a3e 50%, #2e516c 100%);
        box-shadow: inset 0px 0px 25px rgba(0, 0, 0, 0.37);
        clip-path: polygon(25px 0, calc(100% - 25px) 0, 100% 25%, 100% 75%, calc(100% - 25px) 100%, 25px 100%, 0 75%, 0 25%);
        transition: all 0.3s ease;
    }

    a.blackjack-tables-element:hover::before {
        background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #01e0a3 100%);
    }

    a.blackjack-tables-element::after {
        content: '';
        width: calc(100% - 2px);
        height: calc(100% - 2px);
        position: absolute;
        top: 1px;
        left: 1px;
        background-image: url('~@/assets/img/blackjack/preview.webp');
        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;
        background-color: #031d32;
        clip-path: polygon(25px 0, calc(100% - 25px) 0, 100% 25%, 100% 75%, calc(100% - 25px) 100%, 25px 100%, 0 75%, 0 25%);
    }

    a.blackjack-tables-element .element-inner {
        width: calc(100% - 2px);
        height: calc(100% - 2px);
        position: absolute;
        top: 1px;
        left: 1px;
        background: none;
        clip-path: polygon(25px 0, calc(100% - 25px) 0, 100% 25%, 100% 75%, calc(100% - 25px) 100%, 25px 100%, 0 75%, 0 25%);
        transition: all 0.3s ease;
        z-index: 1;
    }

    a.blackjack-tables-element:hover .element-inner {
        background: radial-gradient(140% 80% at 85% 50%, rgba(0, 255, 194, 0.2) 0%, rgba(0, 0, 0, 0) 100%), linear-gradient(255deg, rgba(0, 255, 194, 0.05) -50%, rgba(0, 170, 109, 0.05) 100%);
    }

    a.blackjack-tables-element .inner-info {
        position: absolute;
        display: flex;
        flex-direction: column;
        align-items: center;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }

    a.blackjack-tables-element .info-name {
        white-space: nowrap;
        /* font-family: 'Rubik', sans-serif; */
        font-size: 28px;
        font-weight: 900;
        color: #ffffff;
    }

    a.blackjack-tables-element .inner-info svg {
        width: 22px;
        height: 19px;
        margin-top: 10px;
    }

    a.blackjack-tables-element .inner-info span {
        margin-top: 1px;
        font-size: 18px;
        font-weight: 800;
    }

    @media only screen and (max-width: 1050px) {

        a.blackjack-tables-element {
            width: calc(25% - 7.5px);
        }

        a.blackjack-tables-element:nth-child(5) {
            margin-top: 10px;
        }

        a.blackjack-tables-element:nth-child(5n) {
            margin-right: 10px;
        }

        a.blackjack-tables-element:nth-child(4n) {
            margin-right: 0;
        }

    }

    @media only screen and (max-width: 900px) {

        a.blackjack-tables-element {
            width: calc(33.33% - 6.66px);
        }

        a.blackjack-tables-element:nth-child(4) {
            margin-top: 10px;
        }

        a.blackjack-tables-element:nth-child(4n) {
            margin-right: 10px;
        }

        a.blackjack-tables-element:nth-child(3n) {
            margin-right: 0;
        }

    }

    @media only screen and (max-width: 700px) {

        a.blackjack-tables-element {
            width: calc(50% - 5px);
        }

        a.blackjack-tables-element:nth-child(3) {
            margin-top: 10px;
        }

        a.blackjack-tables-element:nth-child(3n) {
            margin-right: 10px;
        }

        a.blackjack-tables-element:nth-child(2n) {
            margin-right: 0;
        }

    }
</style>
