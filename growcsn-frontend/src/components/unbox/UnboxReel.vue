<template>
    <div  class="unbox-reel">
        <div v-for="(item, index) in reel" v-bind:key="index" class="reel-element" v-bind:class="[
            'element-' + item.color, 
            { 'element-active': index === pos },
            {'bg-active': index === 60 && running === false}
        ]">
            <div class="element-image">
                <img v-bind:src="item.item.image" />
            </div>
            <div v-if="index === 60 && running === false" class="element-info">
                <span>{{item.item.name}}</span>
                <div class="info-amount">
                    <img src="@/assets/img/icons/coin.svg" alt="icon" />
                    <div class="amount-value">
                        <span>{{ unboxFormatValue(item.item.amountFixed).split('.')[0] }}</span>.{{ unboxFormatValue(item.item.amountFixed).split('.')[1] }}
                    </div>
                </div>
            </div>
            <div v-bind:class="[{'test-active': index === 60 && running === false}]"></div>
        </div>
    </div>
</template>

<script>
    import IconItemBlue from '@/components/icons/IconItemBlue';
    import IconItemPurple from '@/components/icons/IconItemPurple';
    import IconItemGreen from '@/components/icons/IconItemGreen';
    import IconItemRed from '@/components/icons/IconItemRed';
    import IconItemYellow from '@/components/icons/IconItemYellow';

    export default {
        name: 'UnboxReel',
        components: {
            IconItemBlue,
            IconItemPurple,
            IconItemGreen,
            IconItemRed,
            IconItemYellow
        },
        props: [
            'reel', 
            'pos', 
            'running'
        ],
        methods: {
            unboxFormatValue(value) {
                return parseFloat(Math.floor(value / 10) / 100).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            }
        }
    }
</script>

<style scoped>
    .unbox-reel {
        height: 100%;
        display: flex;
        align-items: center;
    }

    .unbox-spinner.spinner-2 .unbox-reel,
    .unbox-spinner.spinner-3 .unbox-reel,
    .unbox-spinner.spinner-4 .unbox-reel {
        width: 100%;
        flex-direction: column;
    }

    .unbox-reel .reel-element {
        width: 105px;
        height: 105px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin-right: 25px;
        opacity: 0.25;
        position: relative;
    }

    .unbox-spinner.spinner-2 .unbox-reel .reel-element,
    .unbox-spinner.spinner-3 .unbox-reel .reel-element,
    .unbox-spinner.spinner-4 .unbox-reel .reel-element {
        width: 100%;
        /* flex-direction: row; */
        margin-right: 0;
        margin-bottom: 10px;
        margin-top: 10px;        
    }

    .unbox-reel .reel-element:last-child {
        margin-right: 0;
        margin-bottom: 0;
    }

    .unbox-reel .reel-element.element-active {
        opacity: 1;
    }

    .unbox-reel .element-image {
        width: 105px;
        height: 105px;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
    }

    .unbox-reel .element-image svg {
        flex-shrink: 0;
    }

    .unbox-reel .element-image img {
        width: 75px;
        image-rendering: pixelated;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        transition: transform 0.3s ease;
    }

    @media only screen and (max-width: 500px) {
        .unbox-reel .element-image img {
            width: 70px;           
        }
        .unbox-reel .element-image svg {
            width: 80px;
            height: 80px;
        }
    }
    @media only screen and (max-width: 400px) {
        .unbox-reel .element-image img {
            width: 60px;           
        }
    }
    .unbox-reel .reel-element.element-active .element-image img {
        /* transform: translate(-50%, -50%) scale(1.2); */
    }

    .unbox-reel .element-info {
        /* position: absolute;
        bottom: 5px;
        left: 50%; */
        /* transform: translateX(-50%); */
        margin-top: 5px;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    .unbox-spinner.spinner-2 .unbox-reel .element-info,
    .unbox-spinner.spinner-3 .unbox-reel .element-info,
    .unbox-spinner.spinner-4 .unbox-reel .element-info {
        width: auto;
        /* max-width: calc(100% - 115px); */
        align-items: center;
        /* margin-left: 10px; */
    }
 

    .unbox-reel .element-info span {
        width: auto;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        text-align: center;
        font-size: 14px;
        font-weight: 600;
        color: #dee5ec;
    }
    
    @media only screen and (max-width: 500px) {
        .unbox-reel .element-info {       
            margin-top: 0px;      
        }
        .unbox-reel .element-info span {       
            font-size: 11px;          
        }
        .unbox-reel .amount-value {
            font-size: 9px;    
        }

        .unbox-reel .amount-value span {
            font-size: 11px !important;      
        }
        .unbox-reel .info-amount img {
            width: 10px !important;
            height: 10px !important;
            margin-right: 4px !important;
        }
    }
    .unbox-spinner.spinner-2 .unbox-reel .element-info span,
    .unbox-spinner.spinner-3 .unbox-reel .element-info span,
    .unbox-spinner.spinner-4 .unbox-reel .element-info span {
        width: 100%;
    }

    .unbox-reel .info-amount {
        display: flex;
        align-items: center;
        margin-top: 1px;
    }

    .unbox-reel .info-amount img {
        width: 12px;
        height: 12px;
        margin-right: 8px;
    }

    .unbox-reel .amount-value {
        font-size: 11px;
        font-weight: 600;
        color: #bbbfd0;
    }

    .unbox-reel .amount-value span {
        font-size: 14px;
        font-weight: 800;
        color: #ffffff;
    }

    .unbox-spinner.spinner-1 .unbox-reel .bg-active {
        width: 200px !important;
        height: 90% !important;
        background: rgba(13, 49, 78, 0.36);
        /* z-index: 9999 !important; */
        border-radius: 7px;
        transition: all .3s;
        background: #66b2334f;
        border: 2px solid #66b233;
        border-radius: .25rem;
        position: relative;
        top: -1px;
        transform: scale(1.05);
        transition: all .4s;
        z-index: 1

    }   

    .unbox-spinner.spinner-4 .test-active
     {
        position: absolute;
        top: 0px;
        bottom: 25px;
        border-radius: 7px;
        margin-top: auto;
        margin-bottom: auto;
        left: 0px;
        right: 0px;
        margin-left: auto;
        margin-right: auto;
        width: 90%;
        height: 180%;
        background: rgba(13, 49, 78, 0.36);
        transition: all .3s;
        z-index: -1;
        /* z-index: 9999 !important; */
        border-radius: 7px;
        transition: all .3s;
        background: #66b2334f;
        border: 2px solid #66b233;
        border-radius: .25rem;
        transform: scale(1.05);
        transition: all .4s;
    }
    .unbox-spinner.spinner-2 .test-active
     {
        position: absolute;
        top: 0px;
        bottom: 10px;
        border-radius: 7px;
        margin-top: auto;
        margin-bottom: auto;
        left: 0px;
        right: 0px;
        margin-left: auto;
        margin-right: auto;
        width: 50%;
        height: 160%;
        background: rgba(13, 49, 78, 0.36);
        transition: all .3s;
        z-index: -1;
    }   
    .unbox-spinner.spinner-3 .test-active
     {
        position: absolute;
        top: 0px;
        bottom: 10px;
        border-radius: 7px;
        margin-top: auto;
        margin-bottom: auto;
        left: 0px;
        right: 0px;
        margin-left: auto;
        margin-right: auto;
        width: 60%;
        height: 160%;
        background: rgba(13, 49, 78, 0.36);
        transition: all .3s;
        z-index: -1;
    }   
    @media only screen and (max-width: 500px) {
        .unbox-spinner.spinner-2 .test-active,
        .unbox-spinner.spinner-3 .test-active,
        .unbox-spinner.spinner-4 .test-active
        {           
            width: 95%;
            height: 130%;  
        }       
    }
</style>