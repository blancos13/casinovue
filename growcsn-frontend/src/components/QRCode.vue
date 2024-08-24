<template>
    <canvas ref="qrcode"></canvas>
</template>

<script>
    import { toCanvas } from 'qrcode';

    export default {
        name: 'Qrcode',
        props: ['value', 'options'],
        methods: {
            generateQrcode: function() {
                toCanvas(this.$refs.qrcode, this.value, this.options, function (err) {
                    if (err) { throw err; }
                });
            }
        },
        mounted() {
            this.generateQrcode();
        }
    }
</script>
