<template>
    <div class="modal-faq">
        <div class="faq-header">
            <span class="gradient-green">QUESTIONS AND ANSWERS</span>
            <p>Here are some answers to frequently asked questions we have collected for you. New content is added on 
            a regular basis to help you quickly overcome any difficulties. Of course you can also contact our support 
            or ask questions directly in our Discord.</p>
        </div>
        <div class="faq-list">

            <FaqElement title="What is growcsn?" text="growcsn is a virtual arcade designed for Growtopia players to multiply their Robux or Limiteds! We are the most innovative arcade, and we strive to bring you the best experiences." />
            <FaqElement title="Why do you need my Growtopia credentials?" text="In order for us to automate our deposit and withdraw system, we utilize our P2P system to facilitate seamless transactions for depositors & withdrawers. growcsn ensures user security and we do not store your password. In any circumstances you feel unsafe with us having your credentials, you can simply invalidate them by changing your password on Growtopia.com." />
            <FaqElement title="What are the coins?" text="Our balance is displayed as a coin, but it has a conversion rate of 1 coin to 1 Robux. We allow you to withdraw these coins to Growtopia.com at a 1-to-1 rate." />
            <FaqElement title="Can I transfer coins to another account?" text="Yes, you can transfer coins to another account by simplifying clicking on a user's profile and clicking the Tip User button." />
            <FaqElement title="I am missing coins, what now?" text="Please ensure you've not given access to your growcsn account or your Growtopia account. In the case you are compromised, we will assist you with regaining access to your account. Although, we do not issue balance adjustments to compensate for the loss, as your account security is your responsibility. If this involves a game issue, open a ticket in the discord." />
            <FaqElement title="I deposited with cryptocurrency and I still have not received my deposit." text="If you’ve still not received your deposit after 3 confirmations, please open a ticket inside our discord explaining the situation and providing transaction IDs." />
            <FaqElement title="I have discovered a vulnerability or an exploit, what now?" text="Join our discord and create a ticket. You will be rewarded for reporting any vulnerability or exploit." />
            <FaqElement title="What is &quot;Rain Abuse	&quot;?" text="The rain coins distributed throughout the 30-minute rain feature are intended to be played with on the games provided on our site exclusively. Saving up free rain coins over an extended period of time and/or not using them to genuinely participate in the games provided is considered rain abuse and will result in a ban. Please note, all rain bans are permanent and will not be lifted." />
            <FaqElement title="How much commission do I get when my referrals place a bet?" text="Every time someone you've referred places a bet, you receive 1% of that overall wager. In the instance that someone wagers 1,000,000 coins, you'd receive 10,000." />
            <FaqElement title="How does the deposit and withdrawal system work?" text="We use a Peer-to-Peer (P2P) system to facilitate the transactions on our site. In this case, there may be extended wait times for limited deposits and/or Robux deposits. In order to deposit, someone must withdraw, and vice versa. growcsn will subsidize long queue times to ensure user satisfaction." />
            <FaqElement title="Is there a maximum bet or profit?" text="Yes, each game has a maximum bet and a maximum profit allotted for each round. You can find it located inside each game." />
            <FaqElement title="What happens if my internet disconnects during a Crash round?" text="Whether your client is connected or disconnected, the auto-cashout feature will work as intended. We highly recommend you use this feature if your internet connection is faulty or if you have poor internet reliability." />
            <FaqElement title="Does the Crash game have a maximum multiplier?" text="Our Crash game has no limit! Although, you will be automatically cashed out if you hit our maximum profit." />
            <FaqElement title="How do I know that growcsn is fair & doesn't rig results?" text="growcsn is a provably fair casino. You can check all game results with our provably fair system, found at the bottom of our website." />
            <FaqElement title="Can I make money by promoting the website?" text="If you're an influencer who is looking to be sponsored by us, please join our Discord server and open a ticket. You can link your discord in the 'Settings' page, inside your profile." />

        </div>
    </div>
</template>

<script>
    import FaqElement from '@/components/faq/FaqElement';

    export default {
        name: 'ModalFaq',
        components: {
            FaqElement
        }
    }
</script>

<style scoped>
    .modal-faq {
        width: 1000px;
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 30px 30px 0 30px;
        border-radius: 15px;
        background: radial-gradient(100% 100% at 50% -30%, rgba(0, 255, 194, 0.2) 0%, rgba(0, 0, 0, 0) 100%), 
                    linear-gradient(255deg, #07263d 0%, #07243a 100%);
    }

    .modal-faq .faq-header {
        width: 100%;
        padding-bottom: 30px;
        border-bottom: 1px solid #335361;
    }

    .modal-faq .faq-header span  {
        font-size: 32px;
        font-weight: 900;
    }

    .modal-faq .faq-header p  {
        margin-top: 10px;
        font-size: 14px;
        font-weight: 600;
        color: #bbbfd0;
    }

    .modal-faq .faq-list {
        width: 100%;
        height: 600px;
        padding: 30px 10px 30px 0;
        overflow-x: hidden;
        overflow-y: scroll;
    }

    .modal-faq .faq-list::-webkit-scrollbar {
        width: 5px;
        height: 0;
    }

    .modal-faq .faq-list::-webkit-scrollbar-track {
        margin: 30px 0;
        background-color: #062234;
    }

    .modal-faq .faq-list::-webkit-scrollbar-thumb {
        background-color: #1e5164;
    }

    @media only screen and (max-width: 1190px) {

        .modal-faq {
            width: calc(100vw - 20px);
        }

    }

    @media only screen and (max-width: 700px) {

        .modal-faq {
            padding: 80px 15px 0 15px;
        }

    }
</style>
