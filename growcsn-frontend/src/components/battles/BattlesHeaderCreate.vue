<template>
    <div class="battles-header-create">
        <router-link to="/battles" class="link-back">
            <div class="link-inner">
                <svg width="14" height="12" viewBox="0 0 14 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M0.519893 4.88899C-0.173298 5.40596 -0.173297 6.69838 0.519893 7.21535L5.97877 11.2865C6.67196 11.8035 7.53845 11.1573 7.53845 10.1233V9.06113H14V3.04304H7.53845V1.98103C7.53845 0.947086 6.67196 0.300873 5.97877 0.817844L0.519893 4.88899Z" />
                </svg>
                GO BACK
            </div>
        </router-link>
        <div class="create-title">
            <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.05531 11.2261L8.94249 15.0407L7.38828 16.5662L8.94469 18.0927L7.38938 19.6181L4.66703 16.9481L1.55531 20L0 18.4746L3.11172 15.4215L0.389378 12.7526L1.94469 11.2271L3.5 12.7515L5.05531 11.2261ZM0.600566 0L4.50094 0.00323644L17.4989 12.7526L19.0553 11.2271L20.6106 12.7526L17.8894 15.4226L21 18.4746L19.4447 20L16.333 16.9481L13.6106 19.6181L12.0553 18.0927L13.6106 16.5662L0.603866 3.80927L0.600566 0ZM16.5024 0L20.3994 0.00323644L20.4016 3.80387L15.9436 8.1752L12.0542 4.36162L16.5024 0Z" fill="white"/>
                <path d="M5.05531 11.2261L8.94249 15.0407L7.38828 16.5662L8.94469 18.0927L7.38938 19.6181L4.66703 16.9481L1.55531 20L0 18.4746L3.11172 15.4215L0.389378 12.7526L1.94469 11.2271L3.5 12.7515L5.05531 11.2261ZM0.600566 0L4.50094 0.00323644L17.4989 12.7526L19.0553 11.2271L20.6106 12.7526L17.8894 15.4226L21 18.4746L19.4447 20L16.333 16.9481L13.6106 19.6181L12.0553 18.0927L13.6106 16.5662L0.603866 3.80927L0.600566 0ZM16.5024 0L20.3994 0.00323644L20.4016 3.80387L15.9436 8.1752L12.0542 4.36162L16.5024 0Z" fill="url(#paint0_linear_3319_16458)"/>
                <defs>
                    <linearGradient id="paint0_linear_3319_16458" x1="60.7566" y1="-0.804659" x2="8.70414" y2="31.7497" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#00FFC2"/>
                        <stop offset="1" stop-color="#00AA6D"/>
                    </linearGradient>
                </defs>
            </svg>
            BATTLES CREATION
        </div>
        <div class="create-info">
            <div class="info-cases">
                <svg width="18" height="16" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.45068 15.9972L2.16185 12.8528C1.97571 12.7597 1.85815 12.5695 1.85815 12.3614V9.53443L4.84386 11.0273C5.38519 11.298 6.02234 11.298 6.56367 11.0273L6.60687 11.0057L8.45065 9.87141L8.45068 15.9972ZM9.54942 15.9972V9.87138L11.3932 11.0057L11.4364 11.0273C11.9777 11.2979 12.6149 11.2979 13.1562 11.0273L16.1419 9.53439V12.3614C16.1419 12.5695 16.0244 12.7597 15.8382 12.8528L9.54942 15.9972ZM1.72848 4.94487L0.455711 4.3085C0.0486506 4.10497 -0.116355 3.60999 0.0871747 3.20293C0.166916 3.04345 0.296229 2.91414 0.455711 2.83439L5.33523 0.394654C5.56723 0.278654 5.8403 0.278654 6.07227 0.394654L8.52419 1.62061C8.3503 1.65917 8.17994 1.71916 8.01724 1.80053L1.72848 4.94487ZM9.47584 1.62058L11.9278 0.394617C12.1598 0.278617 12.4328 0.278617 12.6648 0.394617L17.5443 2.83436C17.7038 2.9141 17.8331 3.04342 17.9129 3.2029C18.1164 3.60996 17.9514 4.10494 17.5443 4.30847L16.2715 4.94483L9.98275 1.80042C9.82005 1.71912 9.64973 1.65914 9.47584 1.62058ZM6.07234 10.0445C5.84034 10.1605 5.56727 10.1605 5.3353 10.0445L0.455746 7.60475C0.296264 7.52501 0.16695 7.3957 0.0872093 7.23621C-0.116321 6.82915 0.0486498 6.33417 0.455746 6.13061L1.72852 5.49424L8.20501 8.73249L6.07234 10.0445ZM17.5444 6.13061C17.9514 6.33414 18.1164 6.82912 17.9129 7.23621C17.8331 7.3957 17.7038 7.52501 17.5444 7.60475L12.6648 10.0445C12.4328 10.1605 12.1598 10.1605 11.9278 10.0445L9.79512 8.73249L16.2716 5.49424L17.5444 6.13061ZM14.3641 5.21957L9.00005 7.90158L3.63599 5.21957L8.50868 2.78323C8.81801 2.62856 9.18209 2.62856 9.49145 2.78323L14.3641 5.21957Z" fill="black"/>
                    <path d="M8.45068 15.9972L2.16185 12.8528C1.97571 12.7597 1.85815 12.5695 1.85815 12.3614V9.53443L4.84386 11.0273C5.38519 11.298 6.02234 11.298 6.56367 11.0273L6.60687 11.0057L8.45065 9.87141L8.45068 15.9972ZM9.54942 15.9972V9.87138L11.3932 11.0057L11.4364 11.0273C11.9777 11.2979 12.6149 11.2979 13.1562 11.0273L16.1419 9.53439V12.3614C16.1419 12.5695 16.0244 12.7597 15.8382 12.8528L9.54942 15.9972ZM1.72848 4.94487L0.455711 4.3085C0.0486506 4.10497 -0.116355 3.60999 0.0871747 3.20293C0.166916 3.04345 0.296229 2.91414 0.455711 2.83439L5.33523 0.394654C5.56723 0.278654 5.8403 0.278654 6.07227 0.394654L8.52419 1.62061C8.3503 1.65917 8.17994 1.71916 8.01724 1.80053L1.72848 4.94487ZM9.47584 1.62058L11.9278 0.394617C12.1598 0.278617 12.4328 0.278617 12.6648 0.394617L17.5443 2.83436C17.7038 2.9141 17.8331 3.04342 17.9129 3.2029C18.1164 3.60996 17.9514 4.10494 17.5443 4.30847L16.2715 4.94483L9.98275 1.80042C9.82005 1.71912 9.64973 1.65914 9.47584 1.62058ZM6.07234 10.0445C5.84034 10.1605 5.56727 10.1605 5.3353 10.0445L0.455746 7.60475C0.296264 7.52501 0.16695 7.3957 0.0872093 7.23621C-0.116321 6.82915 0.0486498 6.33417 0.455746 6.13061L1.72852 5.49424L8.20501 8.73249L6.07234 10.0445ZM17.5444 6.13061C17.9514 6.33414 18.1164 6.82912 17.9129 7.23621C17.8331 7.3957 17.7038 7.52501 17.5444 7.60475L12.6648 10.0445C12.4328 10.1605 12.1598 10.1605 11.9278 10.0445L9.79512 8.73249L16.2716 5.49424L17.5444 6.13061ZM14.3641 5.21957L9.00005 7.90158L3.63599 5.21957L8.50868 2.78323C8.81801 2.62856 9.18209 2.62856 9.49145 2.78323L14.3641 5.21957Z" fill="url(#paint0_linear_3353_20937)"/>
                    <defs>
                        <linearGradient id="paint0_linear_3353_20937" x1="18.0001" y1="-0.790655" x2="-2.15569" y2="5.69019" gradientUnits="userSpaceOnUse">
                            <stop stop-color="#3B7EB7"/>
                            <stop offset="1" stop-color="#145081"/>
                        </linearGradient>
                    </defs>
                </svg>
                <span>{{ battlesGetCount }}</span>
                CASES
            </div>
            <div class="info-cost">
                TOTAL COST
                <img src="@/assets/img/icons/coin.svg" alt="icon" />
                <div class="cost-value">
                    <span>{{ battlesFormatValue(battlesGetCost).split('.')[0] }}</span>.{{ battlesFormatValue(battlesGetCost).split('.')[1] }}
                </div>
            </div>
        </div>
        <button v-on:click="battlesCreateButton()" class="button-create" v-bind:disabled="socketSendLoading !== null">
            <div class="button-inner">
                <transition name="fade" mode="out-in">
                    <ButtonLoading v-if="socketSendLoading === 'BattlesCreate'" />
                    <div v-else class="inner-content">
                        <svg width="15" height="14" viewBox="0 0 15 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3.47861 7.85824L6.15342 10.5285L5.08395 11.5963L6.15493 12.6649L5.08471 13.7327L3.21144 11.8636L1.07023 14L0 12.9322L2.14121 10.7951L0.267935 8.9268L1.33816 7.859L2.40839 8.92605L3.47861 7.85824ZM0.413256 0L3.09715 0.00226551L12.0412 8.9268L13.1122 7.859L14.1824 8.9268L12.3099 10.7958L14.4503 12.9322L13.3801 14L11.2389 11.8636L9.36561 13.7327L8.29539 12.6649L9.36561 11.5963L0.415526 2.66649L0.413256 0ZM11.3554 0L14.0371 0.00226551L14.0386 2.66271L10.971 5.72264L8.29463 3.05313L11.3554 0Z" />
                        </svg>
                        CREATE
                    </div>
                </transition>
            </div>
        </button>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';
    import ButtonLoading from '@/components/ButtonLoading';

    export default {
        name: 'BattlesHeaderCreate',
        components: {
            ButtonLoading
        },
        methods: {
            ...mapActions([
                'battlesSendCreateSocket'
            ]),
            battlesFormatValue(value) {
                return parseFloat(Math.floor(value / 10) / 100).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            },
            battlesCreateButton() {
                let boxes = [];

                for(let selected of this.battlesSelected) {
                    let index = boxes.findIndex((element) => element._id === selected._id);

                    if(index !== -1) { boxes[index].count = boxes[index].count + 1; }
                    else { boxes.push({ _id: selected._id, count: 1 }); }
                }

                const mode = this.battlesFilterMode === '2v2' ? 'team' : this.battlesFilterType;

                const data = { boxes: boxes, playerCount: this.battlesGetCountPlayer, mode: mode, levelMin: this.battlesFilterLevel, funding: this.battlesFilterFunding, private: this.battlesFilterPrivate, affiliateOnly: this.battlesFilterAffiliate, cursed: this.battlesFilterCursed, terminal: this.battlesFilterTerminal };
                this.battlesSendCreateSocket(data);
            }
        },
        computed: {
            ...mapGetters([
                'socketSendLoading',
                'battlesSelected',
                'battlesFilterMode',
                'battlesFilterType',
                'battlesFilterLevel',
                'battlesFilterFunding',
                'battlesFilterPrivate',
                'battlesFilterAffiliate',
                'battlesFilterCursed',
                'battlesFilterTerminal'
            ]),
            battlesGetCount() {
                return this.battlesSelected.length;
            },
            battlesGetCountPlayer() {
                let count = 2;

                if(this.battlesFilterMode === '2v2' || this.battlesFilterMode === '1v1v1v1') { count = 4; }
                else if(this.battlesFilterMode === '1v1v1') { count = 3; }

                return count;
            },
            battlesGetCost() {
                let cost = 0;

                for(let box of this.battlesSelected) {
                    cost = Math.floor(cost + box.amount);
                }

                cost = Math.floor(cost + (cost * this.battlesGetCountPlayer * Math.floor(this.battlesFilterFunding) / 100));

                return cost;
            }
        }
    }
</script>

<style scoped>
    .battles-header-create {
        width: 100%;
        display: grid;
        grid-template-columns: 110px auto auto 118px;
        padding-bottom: 20px;
    }

    .battles-header-create a.link-back {
        width: 110px;
        height: 44px;
        position: relative;
        grid-column: 1 / 1;
        margin-right: 19px;
        padding: 1px;
        transition: all .2s;
    }

    .battles-header-create a.link-back:active {
        transition-duration: .2s;
        scale: .9;
    }


    .battles-header-create a.link-back::before {
        content: '';
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background: #0f3759;
        clip-path: polygon(8px 0, calc(100% - 8px) 0, 100% 25%, 100% 75%, calc(100% - 8px) 100%, 8px 100%, 0 75%, 0 25%);
    }

    .battles-header-create a.link-back .link-inner {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 14px;
        font-weight: 700;
        color: #6e95b6;
        background: #0b2d49;
        clip-path: polygon(8px 0, calc(100% - 8px) 0, 100% 25%, 100% 75%, calc(100% - 8px) 100%, 8px 100%, 0 75%, 0 25%);
        transition: color 0.3s ease;
    }

    .battles-header-create a.link-back:hover .link-inner {
        color: #ffffff;
    }

    .battles-header-create a.link-back .link-inner svg {
        margin-right: 8px;
        fill: #557b9b;
        transition: fill 0.3s ease;
    }

    .battles-header-create a.link-back:hover .link-inner svg {
        fill: #ffffff;
    }

    .battles-header-create .create-title {
        grid-column: 2 / 2;
        display: flex;
        align-items: center;
        margin-left: 15px;
        font-size: 18px;
        font-weight: 800;
        color: #ffffff;
    }

    .battles-header-create .create-title svg {
        margin-right: 10px;
    }

    .battles-header-create .create-info {
        display: flex;
        grid-column: 3 / 3;
        justify-content: flex-end;
        align-items: center;
    }

    .battles-header-create .info-cases,
    .battles-header-create .info-cost {
        position: relative;
        display: flex;
        align-items: center;
        margin-right: 20px;
        padding-right: 20px;
        font-size: 15px;
        font-weight: 800;
        color: #5e768e;
    }

    .battles-header-create .info-cases:after,
    .battles-header-create .info-cost:after {
        content: '';
        width: 1px;
        height: 27px;
        position: absolute;
        top: 50%;
        right: 0;
        transform: translate(0, -50%);
        background: linear-gradient(0deg, rgba(97, 112, 241, 0) 0%, rgb(64, 92, 212, 0.5) 50%, rgba(28, 71, 182, 0) 100%);
    }

    .battles-header-create .info-cases svg {
        margin-right: 8px;
    }

    .battles-header-create .info-cases span {
        margin-right: 5px;
        color: #ffffff;
    }

    .battles-header-create .info-cost img {
        width: 18px;
        height: 18px;
        margin: 0 8px;
    }

    .battles-header-create .cost-value {
        font-size: 12px;
        font-weight: 600;
        color: #bbbfd0;
    }

    .battles-header-create .cost-value span {
        font-size: 15px;
        font-weight: 800;
        color: #ffffff;
    }

    .battles-header-create button.button-create {
        width: 118px;
        height: 47px;
        position: relative;
        padding: 1px;
        transition: all .2s;
    }

    .battles-header-create button.button-create:hover {
        transition-duration: .2s; 
        opacity: .8;
    }
    .battles-header-create button.button-create:active {
        transition-duration: .2s;
        scale: .9;
    }


    .battles-header-create button.button-create:before {
        content: '';
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background: linear-gradient(180deg, rgba(0, 170, 109, 0) 0%, #00ffc2 100%);
        clip-path: polygon(7px 0, calc(100% - 7px) 0, 100% 25%, 100% 75%, calc(100% - 7px) 100%, 7px 100%, 0 75%, 0 25%);
    }

    .battles-header-create button.button-create .button-inner {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        background: linear-gradient(255deg, #00ffc2 0%, #00aa6d 100%);
        clip-path: polygon(7px 0, calc(100% - 7px) 0, 100% 25%, 100% 75%, calc(100% - 7px) 100%, 7px 100%, 0 75%, 0 25%);
    }

    .battles-header-create button.button-create .button-loading.fade-leave-active {
        transition: opacity 0.1s;
    }

    .battles-header-create button.button-create .button-loading.fade-leave-to {
        opacity: 0;
    }

    .battles-header-create button.button-create .inner-content.fade-enter-active {
        transition: opacity 0.1s;
    }

    .battles-header-create button.button-create .inner-content.fade-enter {
        opacity: 0;
    }

    .battles-header-create button.button-create .inner-content {
        display: flex;
        align-items: center;
        font-size: 14px;
        font-weight: 800;
        color: #ffffff;
    }

    .battles-header-create button.button-create .inner-content svg {
        margin-right: 8px;
        fill: #ffffff;
    }

    @media only screen and (max-width: 1000px) {

        .battles-header-create {
            grid-template-columns: auto auto;
        }

        .battles-header-create a.link-back {
            grid-row: 1 / 1;
            margin-bottom: 20px;
        }

        .battles-header-create .create-title {
            grid-column: 1 / 1;
            grid-row: 2 / 2;
            margin-left: 0;
        }

        .battles-header-create .create-info {
            grid-column: 2 / 2;
            grid-row: 2 / 2;
        }

        .battles-header-create .info-cost {
            margin-right: 0;
            padding-right: 0;
        }

        .battles-header-create .info-cost:after {
            display: none;
        }

        .battles-header-create button.button-create {
            grid-column: 2 / 2;
            grid-row: 1 / 1;
            justify-self: flex-end;
            margin-bottom: 20px;
        }

    }

    @media only screen and (max-width: 650px) {

        .battles-header-create .create-title {
            grid-column: 1 / 3;
            margin-bottom: 15px;
        }

        .battles-header-create .create-info {
            grid-column: 1 / 3;
            grid-row: 3 / 3;
            justify-content: flex-start;
        }

    }
</style>