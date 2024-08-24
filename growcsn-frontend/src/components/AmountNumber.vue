<template>
    <div class="amount-number">
        <span>{{amountFormatValue(amountCurrent).split('.')[0]}}</span>.{{amountFormatValue(amountCurrent).split('.')[1]}}
    </div>
</template>

<script>
    export default {
        name: 'AmountNumber',
        props: ['amount'],
        data() {
            return {
                amountInterval: null,
                amountCurrent: 0
            }
        },
        methods: {
            amountFormatValue(value) {
                return parseFloat(Math.floor(value / 10) / 100).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            }
        },
        watch: {
            'amount': {
                handler() {
                    clearInterval(this.amountInterval);

                    const step = Math.floor(this.amount - this.amountCurrent) / 60;
                    this.amountInterval = setInterval(() => { 
                        this.amountCurrent = Math.floor(this.amountCurrent + step);
                        
                        if((step >= 0 && this.amountCurrent >= this.amount) || (step <= 0 && this.amountCurrent <= this.amount)) {
                            clearInterval(this.amountInterval); 
                            this.amountCurrent = this.amount;
                        }
                     }, 1000 / 60);
                }
            }
        },
        mounted() {
            this.amountCurrent = this.amount;
        }
    }
</script>

<style scoped>
    .amount-number {
        font-size: 12px;
        font-weight: 600;
        color: #c1c1c1;
    }

    .amount-number span {
        font-size: 16px;
        font-weight: 800;
        color: #ffffff;
    }

    @media only screen and (max-width: 1175px) {

        .amount-number {
            font-size: 10px;
        }

        .amount-number span {
            font-size: 14px;
        }
    }
</style>