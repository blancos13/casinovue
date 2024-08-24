<template>
    <div class="modal-privacy">
        <div class="privacy-header">
            <span class="gradient-green">PRIVACY POLICY</span>
            <p>growcsn is committed to protecting the privacy of its users. This privacy policy applies to the
                growcsn website and services, and explains how we collect, use, and disclose information
            about you.</p>
            <p>By using our website and services, you acknowledge and consent to the practices described in
            this privacy policy.</p>
        </div>
        <div class="privacy-list">

            <div class="list-element">
                <div class="element-title">1. Information We Collect</div>
                <div class="element-text">
                    <p>1.1 When you register for an account on our website and provide your Growtopia credentials or
                    authentication, we collect personal information such as your username, email address, and IP
                    address.</p>
                    <p>1.2 We may also collect information about your use of our website and services, such as your
                    browser type, the pages you visit, and the time and duration of your visits.</p>
                    <p>1.3 We may use cookies and other tracking technologies to collect information about you and
                    your use of our website and services. You can choose to disable cookies in your browser
                    settings, but please note that this may prevent you from using certain features of our website
                    and services.</p>
                    <p>1.4 We may collect information about your location based on your IP address or other
                    information provided by your device.</p>
                </div>
            </div>

            <div class="list-element">
                <div class="element-title">2. How We Use Your Information</div>
                <div class="element-text">
                    <p>2.1 We use the information we collect about you to provide, maintain, and improve our website
                    and services. This may include:
                        <ul>
                            <li>Verifying your identity and location</li>
                            <li>Processing your transactions and payments</li>
                            <li>Communicating with you about your account and our services</li>
                            <li>Providing customer support and responding to your inquiries</li>
                            <li>Analyzing and improving the performance and functionality of our website and services</li>
                        </ul>
                    </p>
                    <p>2.2 We may also use your information for marketing and promotional purposes, such as sending
                    you newsletters, offers, and other updates about growcsn and our services. You may opt out of
                    receiving these communications at any time by following the unsubscribe instructions provided
                    in the communication.</p>
                    <p>2.3 We may use your information for research and development purposes, such as creating and
                    testing new features and services.</p>
                    <p>2.4 We may use your information for compliance and legal purposes, such as detecting and
                    preventing fraud, enforcing our terms of service, and complying with legal and regulatory
                    requirements.</p>
                </div>
            </div>

            <div class="list-element">
                <div class="element-title">3. Sharing Your Information</div>
                <div class="element-text">
                    <p>3.1 We may share your information with third-party service providers who assist us in operating
                    our website and providing our services. These service providers are bound by confidentiality
                    agreements and are only permitted to use your information in connection with the services they
                    provide to us.</p>
                    <p>3.2 We may share your information with third-party payment processors and gateways to
                    process your transactions and payments. These third parties may have their own privacy
                    policies, and we encourage you to review them before providing any personal information.</p>
                    <p>3.3 We may share your information as required by law, such as in response to a subpoena or
                    court order, or to comply with other legal and regulatory obligations.</p>
                    <p>3.4 We may share your information in the event of a sale, merger, acquisition, or other change
                    of control of growcsn.</p>
                </div>
            </div>

            <div class="list-element">
                <div class="element-title">4. Security of Your Information</div>
                <div class="element-text">
                    <p>4.1 We take reasonable measures to protect your information from unauthorized access, use, or
                    disclosure. However, no security measures are perfect, and we cannot guarantee the security of
                    your information.</p>
                    <p>4.2 You are responsible for maintaining the security of your account and for any activities that
                    occur under your account. You should choose a strong password and keep it confidential. You
                    should also log out of your account and close your browser when you are finished using our
                    website and services.</p>
                </div>
            </div>

            <div class="list-element">
                <div class="element-title">5. Children's Privacy</div>
                <div class="element-text">
                    <p>5.1 Our website and services are not intended for children under the age of 18. We do not
                    knowingly collect personal information from children under the age of 18. If we become aware
                    that a child under the age of 18 has provided personal information to us, we will delete such
                    information from our records.</p>
                </div>
            </div>

            <div class="list-element">
                <div class="element-title">6. Changes to Our Privacy Policy</div>
                <div class="element-text">
                    <p>6.1 We may update this privacy policy from time to time, and will post the most current version
                    on our website. By continuing to use our website and services after any changes have been
                    made, you are agreeing to be bound by the modified privacy policy.</p>
                </div>
            </div>

            <div class="list-element">
                <div class="element-title">Contact Us</div>
                <div class="element-text">
                    <p>If you have any questions about these Terms of Service, please contact us at
                    support@growcsn.com.</p>
                </div>
            </div>

        </div>
    </div>
</template>

<script>
    export default {
        name: 'ModalPrivacy'
    }
</script>

<style scoped>
    .modal-privacy {
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

    .modal-privacy .privacy-header {
        width: 100%;
        padding-bottom: 30px;
        border-bottom: 1px solid #335361;
    }

    .modal-privacy .privacy-header span  {
        font-size: 32px;
        font-weight: 900;
    }

    .modal-privacy .privacy-header p  {
        margin-top: 10px;
        font-size: 14px;
        font-weight: 600;
        color: #bbbfd0;
    }

    .modal-privacy .privacy-list {
        width: 100%;
        height: 600px;
        padding: 30px 20px 30px 0;
        overflow-x: hidden;
        overflow-y: scroll;
    }

    .modal-privacy .privacy-list::-webkit-scrollbar {
        width: 5px;
        height: 0;
    }

    .modal-privacy .privacy-list::-webkit-scrollbar-track {
        margin: 30px 0;
        background-color: #062234;
    }

    .modal-privacy .privacy-list::-webkit-scrollbar-thumb {
        background-color: #1e5164;
    }

    .modal-privacy .list-element {
        width: 100%;
        display: flex;
        flex-direction: column;
        margin-top: 25px;
    }

    .modal-privacy .list-element:first-child {
        margin-top: 0;
    }

    .modal-privacy .element-title {
        font-size: 24px;
        font-weight: 800;
        color: #ffffff;
    }

    .modal-privacy .element-text {
        width: 100%;
        margin-top: 15px;
        padding-left: 30px;
    }

    .modal-privacy .element-text p {
        margin-top: 15px;
        font-size: 14px;
        font-weight: 600;
        color: #bbbfd0;
    }

    .modal-privacy .element-text p:first-child {
        margin-top: 0;
    }

    .modal-privacy .element-text ul {
        margin-top: 15px;
        padding-left: 50px;
    }

    @media only screen and (max-width: 1190px) {

        .modal-privacy {
            width: calc(100vw - 20px);
        }

    }

    @media only screen and (max-width: 700px) {

        .modal-privacy {
            padding: 80px 15px 0 15px;
        }

    }
</style>
