<template>
    <div class="admin-user-addresses-element">
        <div class="element-section section-date">
            <div class="section-title">DATE</div>
            <div class="section-content">
                {{ new Date(address.createdAt).toLocaleString('en-US', { hour12: true, year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute:'2-digit' }) }}
            </div>
        </div>
        <div class="element-section section-address">
            <div class="section-title">ADDRESS</div>
            <div class="section-content">
                {{address.address}}
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'AdminUserAddressElement',
        props: [
            'address'
        ]
    }
</script>

<style scoped>
    .admin-user-addresses-element {
        width: 100%;
        height: 47px;
        display: flex;
        align-items: center;
        padding: 0 20px;
        border-radius: 5px;
    }

    .admin-user-addresses-element:nth-child(odd) {
        background-color: rgba(19, 66, 88, 0.25);
    }

    .admin-user-addresses-element .element-section {
        display: flex;
        flex-direction: column;
    }

    .admin-user-addresses-element .element-section.section-date,
    .admin-user-addresses-element .element-section.section-address {
        width: 50%;
    }

    .admin-user-addresses-element .section-title {
        display: none;
        font-size: 13px;
        font-weight: 600;
        color: #8bacc8;
    }

    .admin-user-addresses-element .section-content {
        display: flex;
        align-items: center;
    }

    .admin-user-addresses-element .element-section.section-date .section-content,
    .admin-user-addresses-element .element-section.section-address .section-content {
        font-size: 14px;
        font-weight: 400;
        color: #bbbfd0;
    }

    .admin-user-addresses-element .element-section.section-address .section-content {
        justify-content: flex-end;
    }

    @media only screen and (max-width: 725px) {

        .admin-user-addresses-element {
            height: auto;
            flex-direction: column;
            align-items: flex-start;
            padding: 10px 20px;
        }

        .admin-user-addresses-element .element-section {
            width: 100%!important;
            margin-top: 10px;
        }

        .admin-user-addresses-element .element-section.section-date {
            margin-top: 0;
        }

        .admin-user-addresses-element .element-section.section-address {
            align-items: flex-start;
        }

        .admin-user-addresses-element .section-title {
            display: block;
        }

        .admin-user-addresses-element .section-content {
            margin-top: 5px;
        }

    }
</style>