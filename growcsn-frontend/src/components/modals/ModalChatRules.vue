<template>
    <div class="modal-chat-rules">
        <div class="rules-title">
            <span class="gradient-green">CHAT RULES</span>
        </div>
        <div class="rules-list">

            <div class="list-element">
                <span class="gradient-green">1.</span>
                <div class="element-info">
                    <span class="gradient-green">Advertising competitor sites is not allowed.</span>
                    Do not advertise competiting websites, discord servers, affiliate links or anything non-relating to growcsn.
                </div>
            </div>
            <div class="list-element">
                <span class="gradient-green">2.</span>
                <div class="element-info">
                    <span class="gradient-green">Spamming is not allowed.</span>
                    Do not spam or post duplicate messages in any channel.
                </div>
            </div>
            <div class="list-element">
                <span class="gradient-green">3.</span>
                <div class="element-info">
                    <span class="gradient-green">Toxicity is not allowed.</span>
                    Refrain from instigiating or starting drama with any user in the chat.
                </div>
            </div>
            <div class="list-element">
                <span class="gradient-green">4.</span>
                <div class="element-info">
                    <span class="gradient-green">Threatening is not allowed.</span>
                    Any type of threats that are used against someone or towards a particular situation will be moderated. Death threats, threats of hacking, or just any threats in general, are prohibited.
                </div>
            </div>
            <div class="list-element">
                <span class="gradient-green">5.</span>
                <div class="element-info">
                    <span class="gradient-green">Discrimination is not allowed.</span>
                    Discrimination regarding anyone's race, ethnicity, gender, sexual orientation, or any biological factors is not allowed.
                </div>
            </div>
            <div class="list-element">
                <span class="gradient-green">6.</span>
                <div class="element-info">
                    <span class="gradient-green">Slurs are not allowed.</span>
                    Slurring will not be allowed in the chat. If you are caught using or bypassing a slur you will be permanently muted.
                </div>
            </div>
            <div class="list-element">
                <span class="gradient-green">7.</span>
                <div class="element-info">
                    <span class="gradient-green">Promoting your affiliate code in chat is not allowed.</span>
                    Any affiliate code or link that redirects you to your affiliate code is not allowed.
                </div>
            </div>
            <div class="list-element">
                <span class="gradient-green">8.</span>
                <div class="element-info">
                    <span class="gradient-green">You are able to report support & moderators.</span>
                    Create a ticket in the discord or direct message an administrator with proof of a moderator or support member breaking the rules.
                </div>
            </div>

        </div>
    </div>
</template>

<script>
    export default {
        name: 'ModalChatRules'
    }
</script>

<style scoped>
    .modal-chat-rules {
        width: 970px;
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 35px 36px 0 0;
        border-radius: 15px;
        background: radial-gradient(100% 100% at 50% -31.45%, rgba(0, 255, 194, 0.2) 0%, rgba(0, 0, 0, 0) 100%), linear-gradient(255deg, #07263d 0%, #07243a 100%);
    }

    .modal-chat-rules::after {
        content: '';
        width: 100%;
        height: 50px;
        position: absolute;
        bottom: 0;
        left: 0;
        border-radius: 0 0 15px 15px;
        background: linear-gradient(0deg, #07263d 0%, rgba(7, 36, 58, 0) 100%);
    }

    .modal-chat-rules .rules-title {
        text-align: center;
        text-transform: uppercase;
        font-size: 32px;
        font-weight: 900;
    }

    .modal-chat-rules .rules-list {
        width: 100%;
        height: 570px;
        margin-top: 45px;
        padding: 0 37px 60px 78px;
        overflow-x: hidden;
        overflow-y: scroll;
    }

    .modal-chat-rules .rules-list::-webkit-scrollbar {
        width: 5px;
        height: 0;
    }

    .modal-chat-rules .rules-list::-webkit-scrollbar-track {
        margin-bottom: 60px;
        background-color: #062234;
    }

    .modal-chat-rules .rules-list::-webkit-scrollbar-thumb {
        background-color: #1e5164;
    }

    .modal-chat-rules .list-element {
        display: flex;
        align-items: center;
        margin-top: 14px;
    }

    .modal-chat-rules .list-element:first-child {
        margin-top: 0;
    }

    .modal-chat-rules .list-element span {
        /* font-family: 'Rubik'; */
        font-size: 64px;
        font-weight: 900;
    }

    .modal-chat-rules .element-info {
        width: 100%;
        display: flex;
        flex-direction: column;
        padding-left: 15px;
        font-size: 16px;
        font-weight: 700;
        color: #bbbfd0;
    }

    .modal-chat-rules .element-info span {
        font-size: 20px;
        font-weight: 800;
    }

    @media only screen and (max-width: 990px) {

        .modal-chat-rules {
            width: calc(100vw - 20px);
            padding: 85px 20px 0 0;
        }

    }
</style>