<template>
    <div class="admin-item-element">
        <div class="element-info">
            <img v-bind:src="item.item.image" />
            <div class="info-text">
                {{ item.item.name }}
                <div class="text-amount">
                    <img src="@/assets/img/icons/coin.svg" alt="icon" />
                    <div class="amount-value">
                        <span>{{ adminFormatValue(item.item.amountFixed).split('.')[0] }}</span>.{{ adminFormatValue(item.item.amountFixed).split('.')[1] }}
                    </div>
                </div>
            </div>
        </div>
        <input v-model="item.percentage" type="number" min="0.001" max="100" placeholder="Enter item percentage here..." />
        <button v-on:click="$parent.adminRemoveButton(item)" class="button-remove">
            <IconClose />
        </button>
    </div>
</template>

<script>
    import IconClose from '@/components/icons/IconClose';

    export default {
        name: 'AdminItemElement',
        components: {
            IconClose,
        },
        props: [
            'item'
        ],
        methods: {
            adminFormatValue(value) {
                return parseFloat(Math.floor(value / 10) / 100).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            }
        }
    }
</script>

<style scoped>

    .admin-item-element {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        margin-top: 8px;
    }

    .admin-item-element input {
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

    .admin-item-element input::placeholder {
        color: #49687d;
    }

    .admin-item-element .element-info {
        width: 100%;
        display: flex;
        align-items: center;
        padding: 5px;
        border-radius: 5px;
        font-size: 14px;
        font-weight: 800;
        color: #5e768e;
        background: rgba(19, 66, 88, 0.45);
    }

    .admin-item-element .element-info img {
        width: 60px;
        height: 60px;
        margin-right: 10px;
    }

    .admin-item-element .info-text {
        display: flex;
        flex-direction: column;
    }

    .admin-item-element .text-amount  {
        display: flex;
        align-items: center;
        margin-top: 3px;
    }

    .admin-item-element .text-amount img {
        width: 18px;
        height: 18px;
        margin-right: 10px;
    }

    .admin-item-element .amount-value {
        font-size: 10px;
        font-weight: 600;
        color: #bbbfd0;
    }

    .admin-item-element .amount-value span {
        font-size: 14px;
        font-weight: 800;
        color: #ffffff;
    }

    .admin-item-element button.button-remove {
        width: 47px;
        height: 47px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 5px;
        border-radius: 5px;
        background: #f24034;
    }

    .admin-item-element button.button-remove svg {
        fill: #ffffff;
    }

</style>