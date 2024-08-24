<template>
    <div class="admin-prize-element">
        <input v-model="prize.amount" v-on:input="adminValidateInput()" type="text" placeholder="ENTER PRICE..." />
        <button v-on:click="$parent.adminRemoveButton(pos)" class="button-remove">
            <IconClose />
        </button>
    </div>
</template>

<script>
    import IconClose from '@/components/icons/IconClose';

    export default {
        name: 'AdminPrizeElement',
        components: {
            IconClose,
        },
        props: [
            'pos',
            'prize'
        ],
        methods: {
            adminValidateInput() {
                this.prize.amount = this.prize.amount.replace(',', '.').replace(/[^\d.]/g, '');
                this.prize.amount = this.prize.amount.indexOf('.') >= 0 ? this.prize.amount.substr(0, this.prize.amount.indexOf('.')) + '.' + this.prize.amount.substr((this.prize.amount.indexOf('.') + 1), 2).replace('.', '') : this.prize.amount;
            }
        }
    }
</script>

<style scoped>

    .admin-prize-element {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        margin-top: 8px;
    }

    .admin-prize-element input {
        width: calc(100% - 52px);
        height: 47px;
        display: flex;
        align-items: center;
        margin-top: 5px;
        margin-right: 5px;
        padding: 0 15px;
        border-radius: 5px;
        font-size: 16px;
        font-weight: 600;
        color: #ffffff;
        background: rgba(19, 66, 88, 0.25);
        border: 1px dashed rgba(46, 93, 119, 0.5);
    }

    .admin-prize-element input::placeholder {
        color: #49687d;
    }

    .admin-prize-element button.button-remove {
        width: 47px;
        height: 47px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 5px;
        border-radius: 5px;
        background: #f24034;
    }

    .admin-prize-element button.button-remove svg {
        fill: #ffffff;
    }

</style>