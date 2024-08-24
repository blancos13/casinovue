<template>
    <nav id="navbar">
        <div class="navbar-left">
            <button v-on:click="generalSetSidebarMobile(generalSidebarMobile === 'Chat' ? null : 'Chat')" class="button-chat">
                <div class="button-inner">
                    <IconChatGradient />
                </div>
            </button>
            <router-link to="/" class="link-logo">
                <img src="@/assets/img/logo.webp" />
            </router-link>
            <router-link to="/" class="link-home">
                <div class="link-inner">
                    <svg width="22" height="18" viewBox="0 0 22 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11 3.78027L3.15384 10.2486C3.15384 10.2578 3.15155 10.2712 3.14696 10.2895C3.14247 10.3077 3.14008 10.3209 3.14008 10.3302V16.8801C3.14008 17.1166 3.22654 17.3216 3.39941 17.4942C3.57224 17.6668 3.7769 17.7537 4.01344 17.7537H9.25322V12.5137H12.7469V17.7539H17.9866C18.2231 17.7539 18.4281 17.6672 18.6007 17.4942C18.7735 17.3218 18.8603 17.1167 18.8603 16.8801V10.3302C18.8603 10.2939 18.8553 10.2665 18.8465 10.2486L11 3.78027Z" />
                        <path d="M21.8482 8.77487L18.86 6.29133V0.723807C18.86 0.596528 18.8191 0.491857 18.737 0.409936C18.6555 0.32811 18.5508 0.287198 18.4233 0.287198H15.8033C15.6759 0.287198 15.5713 0.32811 15.4893 0.409936C15.4075 0.491857 15.3667 0.596576 15.3667 0.723807V3.38471L12.0372 0.600878C11.7464 0.364339 11.4006 0.246094 11.0003 0.246094C10.6 0.246094 10.2543 0.364339 9.96325 0.600878L0.151633 8.77487C0.0606786 8.84751 0.0108283 8.9453 0.00155609 9.06814C-0.00766837 9.19088 0.0241154 9.29808 0.0970029 9.38899L0.943024 10.3988C1.01591 10.4806 1.11131 10.5307 1.2296 10.549C1.33882 10.5582 1.44803 10.5262 1.55724 10.4535L11 2.5796L20.4429 10.4534C20.5158 10.5169 20.6112 10.5486 20.7295 10.5486H20.7705C20.8886 10.5306 20.9838 10.4802 21.0571 10.3986L21.9032 9.38894C21.9759 9.29784 22.0078 9.19083 21.9984 9.06795C21.989 8.94545 21.939 8.84766 21.8482 8.77487Z" />
                    </svg>
                </div>
            </router-link>
            <NavbarHomeDropdown />
        </div>

        <div class="navbar-mid">
            <AuthButton v-if="authUser.user === null" />
            <NavbarCashier v-else />
        </div>

        <div class="navbar-right">
            <AuthButton v-if="authUser.user === null" />
            <div v-else class="right-auth">
                <router-link to="/rewards" class="link-rewards">
                    <img src="@/assets/img/chest_coins.png" />
                    <span>CLAIM YOUR</span>
                    <span>REWARDS</span>
                </router-link>
                <NavbarUserDropdown />
            </div>
            <button v-on:click="generalSetSidebarMobile(generalSidebarMobile === 'Navbar' ? null : 'Navbar')" class="button-toggle">
                <div class="button-inner">
                    <svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="-0.000976562" y="0.889648" width="12.0008" height="1.62403" />
                        <rect x="-0.000976562" y="4.1377" width="12.0008" height="1.62403" />
                        <rect x="-0.000976562" y="7.38574" width="12.0008" height="1.62403" />
                    </svg>
                </div>
            </button>
        </div>

        <div class="navbar-mobile" v-bind:class="{ 'mobile-open': generalSidebarMobile === 'Navbar' }">
            <router-link v-on:click.native="generalSetSidebarMobile(null)" to="/">
                <IconHome />
                <span class="text-green-gradient-exact">Home</span>
            </router-link>
            <div v-if="authUser.user !== null" class="mobile-user">
                <router-link v-on:click.native="generalSetSidebarMobile(null)" to="/profile">
                    <IconUser />
                    Profile
                </router-link>
                <button v-on:click="navbarVaultButton()">
                    <IconVault />
                    Vault
                </button>
                <router-link  v-on:click.native="generalSetSidebarMobile(null)" to="/rewards">
                    <IconRakeback />
                    Rewards
                </router-link>
                <router-link v-on:click.native="generalSetSidebarMobile(null)" to="/affiliates">
                    <IconAffiliates />
                    <span class="text-green-gradient-exact">Affiliates</span>
                </router-link>
                <router-link v-on:click.native="generalSetSidebarMobile(null)" to="/leaderboard">
                    <IconLeaderboard />
                    <span class="text-green-gradient-exact">Leaderboard</span>
                </router-link>
                <router-link v-if="authUser.user.rank === 'admin'" v-on:click.native="generalSetSidebarMobile(null)" to="/admin">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                        <path d="M144 144v48H304V144c0-44.2-35.8-80-80-80s-80 35.8-80 80zM80 192V144C80 64.5 144.5 0 224 0s144 64.5 144 144v48h16c35.3 0 64 28.7 64 64V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V256c0-35.3 28.7-64 64-64H80z"/>
                    </svg>
                    Admin
                </router-link>
                <button v-on:click="authLogoutUser">
                    <IconSignOut />
                    Sign Out
                </button>
            </div>
            <div class="mobile-games">
                ALL GAMES
                <router-link v-on:click.native="generalSetSidebarMobile(null)" to="/battles">
                    <svg width="16" height="15" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3.85167 8.41955L6.81332 11.2805L5.62916 12.4246L6.815 13.5695L5.63 14.7136L3.55583 12.711L1.185 15L0 13.8559L2.37084 11.5662L0.296669 9.56443L1.48167 8.42036L2.66667 9.56362L3.85167 8.41955ZM0.457574 0L3.42929 0.00242733L13.3325 9.56443L14.5183 8.42036L15.7033 9.56443L13.63 11.567L16 13.8559L14.815 15L12.4442 12.711L10.37 14.7136L9.185 13.5695L10.37 12.4246L0.460088 2.85695L0.457574 0ZM12.5732 0L15.5424 0.00242733L15.5441 2.8529L12.1475 6.1314L9.18416 3.27121L12.5732 0Z" />
                    </svg>
                    <span class="text-green-gradient-exact">Battles</span>
                </router-link>
                <router-link v-on:click.native="generalSetSidebarMobile(null)" to="/unbox">
                    <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7.98114 15.5613L2.04173 12.5916C1.86593 12.5037 1.75491 12.324 1.75491 12.1275V9.45755L4.57473 10.8675C5.08598 11.1231 5.68772 11.1231 6.19898 10.8675L6.23978 10.8471L7.98111 9.77582L7.98114 15.5613ZM9.01883 15.5613V9.77578L10.7602 10.847L10.801 10.8674C11.3122 11.1231 11.914 11.1231 12.4252 10.8674L15.245 9.45752V12.1275C15.245 12.324 15.134 12.5036 14.9582 12.5915L9.01883 15.5613ZM1.63244 5.12301L0.430391 4.522C0.0459475 4.32977 -0.10989 3.8623 0.0823311 3.47785C0.157641 3.32723 0.27977 3.2051 0.430391 3.12979L5.03879 0.825609C5.2579 0.716054 5.5158 0.716054 5.73488 0.825609L8.05056 1.98345C7.88633 2.01987 7.72545 2.07652 7.57178 2.15337L1.63244 5.12301ZM8.94934 1.98342L11.265 0.825574C11.4841 0.71602 11.742 0.71602 11.9611 0.825574L16.5695 3.12976C16.7201 3.20507 16.8423 3.3272 16.9176 3.47782C17.1098 3.86226 16.954 4.32974 16.5695 4.52196L15.3675 5.12297L9.42809 2.15327C9.27442 2.07649 9.11357 2.01984 8.94934 1.98342ZM5.73494 9.93928C5.51584 10.0488 5.25794 10.0488 5.03886 9.93928L0.430423 7.63509C0.279803 7.55978 0.157674 7.43766 0.0823638 7.28704C-0.109858 6.90259 0.0459467 6.43512 0.430423 6.24286L1.63248 5.64185L7.74912 8.70017L5.73494 9.93928ZM16.5695 6.24286C16.954 6.43508 17.1098 6.90256 16.9176 7.28704C16.8423 7.43766 16.7202 7.55978 16.5695 7.63509L11.9611 9.93928C11.742 10.0488 11.4841 10.0488 11.2651 9.93928L9.25088 8.70017L15.3675 5.64185L16.5695 6.24286ZM13.566 5.38244L8.49999 7.91544L3.43397 5.38244L8.03592 3.08147C8.32806 2.9354 8.67191 2.9354 8.96409 3.08147L13.566 5.38244Z" />
                    </svg>
                    <span class="text-green-gradient-exact">Unbox</span>
                </router-link>
                <router-link v-on:click.native="generalSetSidebarMobile(null)" to="/crash">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4.15019 10.1486C3.90571 9.90426 3.81363 10.0271 3.75926 10.0815C2.35141 11.4893 1.10155 14.8862 1.7623 14.5545C4.16769 13.3467 4.56847 13.7063 5.97627 12.2985C6.0307 12.2441 6.15585 12.1544 5.90425 11.9028L4.15019 10.1486Z" />
                        <path d="M11.7397 10.1298C11.6759 9.92678 11.8096 9.82894 11.8658 9.76821C14.9731 6.41355 16.9479 1.94409 15.4844 0.480563C14.0287 -0.975075 9.69708 1.05741 6.34334 4.14226C6.27699 4.20336 6.14621 4.31909 5.91226 4.27024L4.86736 4.02143C4.57725 3.95244 4.16733 4.06841 3.95646 4.27928L0.122402 8.11329C-0.0884723 8.32421 -0.0199598 8.53465 0.274668 8.5809L3.04772 9.01669C3.34235 9.06304 3.75592 8.92837 3.96675 8.71745C3.96675 8.71745 4.10983 8.57398 4.25359 8.71769C5.0467 9.5107 6.52051 10.9845 7.27612 11.7402C7.42632 11.8903 7.28246 12.0332 7.28246 12.0332C7.07154 12.2441 6.93692 12.6576 6.98327 12.9522L7.41901 15.7252C7.46531 16.02 7.67575 16.0885 7.88662 15.8776L11.7207 12.0435C11.9316 11.8326 12.0476 11.4228 11.9785 11.1326L11.7397 10.1298ZM10.8813 5.17648C10.2319 4.52708 10.2319 3.47429 10.8813 2.82499C11.5307 2.17559 12.5835 2.17559 13.2329 2.82499C13.8822 3.47425 13.8822 4.52708 13.2329 5.17643C12.5835 5.82584 11.5306 5.82584 10.8813 5.17648Z" />
                    </svg>
                    <span class="text-green-gradient-exact">Crash</span>
                </router-link>
                <router-link v-on:click.native="generalSetSidebarMobile(null)" to="/roll" class="link-blackjack">
                    <svg width="12" height="15" viewBox="0 0 12 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0.425753 3.49374L5.74397 5.70944C5.82495 5.74366 5.91198 5.7613 5.99991 5.7613C6.08783 5.7613 6.17486 5.74366 6.25584 5.70944L11.5741 3.49374C11.695 3.44314 11.7982 3.35793 11.8709 3.24882C11.9435 3.1397 11.9822 3.01155 11.9822 2.88048C11.9822 2.74941 11.9435 2.62126 11.8709 2.51214C11.7982 2.40303 11.695 2.31782 11.5741 2.26722L6.25584 0.0508576C6.09196 -0.0169525 5.90785 -0.0169525 5.74397 0.0508576L0.425753 2.26722C0.304837 2.31782 0.201576 2.40303 0.128951 2.51214C0.0563261 2.62126 0.0175781 2.74941 0.0175781 2.88048C0.0175781 3.01155 0.0563261 3.1397 0.128951 3.24882C0.201576 3.35793 0.304837 3.44314 0.425753 3.49374ZM5.99991 1.3844L9.5897 2.88015L5.99991 4.37589L2.41011 2.88015L5.99991 1.3844Z" />
                        <path d="M11.9319 5.57883C11.8983 5.49824 11.8492 5.42507 11.7873 5.36349C11.7254 5.3019 11.652 5.25311 11.5712 5.2199C11.4905 5.18669 11.404 5.1697 11.3167 5.16992C11.2294 5.17014 11.143 5.18756 11.0624 5.22118L6.00013 7.33051L0.937857 5.22118C0.775123 5.1533 0.592089 5.15284 0.429021 5.21992C0.265953 5.28699 0.136208 5.41609 0.0683288 5.57883C0.000449583 5.74156 -3.71784e-06 5.92459 0.0670686 6.08766C0.134141 6.25073 0.263245 6.38048 0.425979 6.44835L5.74419 8.66406C5.82528 8.69788 5.91227 8.7153 6.00013 8.7153C6.08799 8.7153 6.17498 8.69788 6.25607 8.66406L11.5743 6.44835C11.6549 6.41475 11.728 6.3656 11.7896 6.30371C11.8512 6.24183 11.9 6.16842 11.9332 6.08767C11.9664 6.00693 11.9834 5.92043 11.9832 5.83312C11.983 5.74581 11.9655 5.6594 11.9319 5.57883Z" />
                        <path d="M11.0624 8.17624L6.00013 10.2849L0.937857 8.17624C0.775123 8.10836 0.592089 8.10791 0.429021 8.17498C0.265953 8.24205 0.136208 8.37116 0.0683288 8.53389C0.000449583 8.69662 -3.71784e-06 8.87966 0.0670686 9.04272C0.134141 9.20579 0.263245 9.33554 0.425979 9.40342L5.74419 11.6198C5.82528 11.6536 5.91227 11.671 6.00013 11.671C6.08799 11.671 6.17498 11.6536 6.25607 11.6198L11.5743 9.40342C11.737 9.33554 11.8661 9.20579 11.9332 9.04272C12.0003 8.87966 11.9998 8.69662 11.9319 8.53389C11.8641 8.37116 11.7343 8.24205 11.5712 8.17498C11.4082 8.10791 11.2251 8.10836 11.0624 8.17624Z" />
                        <path d="M0.425848 12.3574L5.74406 14.5738C5.82515 14.6076 5.91214 14.625 6 14.625C6.08786 14.625 6.17485 14.6076 6.25594 14.5738L11.5742 12.3574C11.6571 12.3255 11.7327 12.2772 11.7967 12.2156C11.8606 12.1539 11.9116 12.08 11.9465 11.9983C11.9814 11.9166 11.9996 11.8287 12 11.7399C12.0004 11.651 11.9829 11.563 11.9487 11.481C11.9145 11.399 11.8642 11.3247 11.8008 11.2625C11.7373 11.2003 11.6621 11.1514 11.5794 11.1187C11.4968 11.0861 11.4085 11.0704 11.3196 11.0724C11.2308 11.0745 11.1433 11.0944 11.0623 11.1309L6 13.2402L0.937726 11.1309C0.856709 11.0944 0.769202 11.0745 0.680375 11.0724C0.591549 11.0704 0.503205 11.0861 0.420567 11.1187C0.337928 11.1514 0.262671 11.2003 0.199244 11.2625C0.135816 11.3247 0.0855051 11.399 0.0512843 11.481C0.0170635 11.563 -0.000372755 11.651 6.04194e-06 11.7399C0.000384839 11.8287 0.018571 11.9166 0.0534897 11.9983C0.0884085 12.08 0.139351 12.1539 0.203307 12.2156C0.267263 12.2772 0.342934 12.3255 0.425848 12.3574Z" />
                    </svg>
                    <span class="text-green-gradient-exact">Roll</span>
                </router-link>
                <router-link v-on:click.native="generalSetSidebarMobile(null)" to="/blackjack" class="link-blackjack">
                    <svg width="11" height="16" viewBox="0 0 11 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8.94516 13.5723H8.3042L8.60583 12.7756L8.94516 13.5723ZM2.59212 1.26538C2.96915 2.15583 3.34619 3.04628 3.73265 3.93673C3.83633 4.20855 3.44045 4.37727 3.32734 4.10545L2.97858 3.29936H1.86632C1.78149 3.53368 1.67781 3.843 1.57412 4.07733C1.42331 4.41476 1.06512 4.18981 1.14996 3.9461C1.49871 3.04628 1.83805 2.15583 2.17738 1.256C2.25278 1.06854 2.52614 1.06854 2.59212 1.26538ZM10.1517 0H0.838903C0.377035 0 0 0.374927 0 0.843585V15.1564C0 15.6157 0.377035 16 0.838903 16H10.1517C10.623 16 11 15.6157 11 15.1564V0.843585C11 0.374927 10.623 0 10.1517 0ZM6.32476 4.89279C6.51328 4.89279 6.61697 5.10838 6.49443 5.24897C6.32476 5.49268 6.21165 6.17692 6.17395 6.43937C6.85261 6.43937 7.38046 6.6362 7.74807 7.24546C8.5587 8.61394 6.79606 10.1886 5.80634 10.9291C5.42931 11.2197 5.43873 11.126 5.10883 10.8448C4.36418 10.2168 2.94087 8.91388 3.02571 7.9297C3.11054 7.01113 3.92117 6.36438 4.82605 6.43937L4.81662 6.41125C4.8072 6.33626 4.64696 5.5208 4.54327 5.29584C4.49614 5.18336 4.32648 4.94903 4.62811 4.89279C4.92031 4.84593 5.95716 4.89279 6.32476 4.89279ZM7.44644 14.5847C7.76692 13.7598 8.07798 12.935 8.38903 12.1101C8.46444 11.9227 8.73779 11.9227 8.80377 12.1195C9.15253 12.9443 9.50129 13.7598 9.85004 14.5753C9.96315 14.8377 9.55784 15.0064 9.44473 14.744L9.13368 14.0129H8.13453C8.0497 14.2378 7.95544 14.5284 7.86118 14.744C7.7575 15.0064 7.34276 14.8565 7.44644 14.5847ZM2.79006 2.85882H2.03599L2.39417 1.9215L2.79006 2.85882Z" />
                    </svg>
                    <span class="text-green-gradient-active">Blackjack</span>
                </router-link>
                <router-link v-on:click.native="generalSetSidebarMobile(null)" to="/duels">
                    <svg width="16" height="15" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3.85167 8.41955L6.81332 11.2805L5.62916 12.4246L6.815 13.5695L5.63 14.7136L3.55583 12.711L1.185 15L0 13.8559L2.37084 11.5662L0.296669 9.56443L1.48167 8.42036L2.66667 9.56362L3.85083 8.41955H3.85167ZM0.457574 0L3.42929 0.00242733L13.3325 9.56443L14.5183 8.42036L15.7033 9.56443L13.63 11.567L16 13.8559L14.815 15L12.4442 12.711L10.37 14.7136L9.185 13.5695L10.37 12.4246L0.460088 2.85695L0.457574 0ZM12.5732 0L15.5424 0.00242733L15.5441 2.8529L12.1475 6.1314L9.18416 3.27121L12.5732 0Z" />
                    </svg>
                    <span class="text-green-gradient-exact">Dice Duels</span>
                </router-link>
                <router-link v-on:click.native="generalSetSidebarMobile(null)" to="/mines">
                    <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13.469 3.32317C13.3233 3.61196 13.0761 3.82791 12.7717 3.92938C12.4647 4.03085 12.1395 4.00743 11.8507 3.86173L10.3417 3.10722C10.2142 3.04218 10.0685 3.03437 9.93322 3.08121C9.79793 3.12544 9.69126 3.2191 9.62621 3.34658L9.43368 3.73425L8.83008 3.43244L9.02261 3.04999C9.16831 2.76119 9.41287 2.54525 9.71988 2.44378C10.0269 2.34231 10.3521 2.36572 10.6383 2.50882L12.1499 3.26593C12.2774 3.32577 12.4179 3.33878 12.5532 3.29195C12.6885 3.24772 12.7977 3.15406 12.8628 3.02657C12.9434 2.86266 13.149 2.78981 13.3129 2.87567C13.482 2.95632 13.5497 3.15666 13.469 3.32317Z" />
                        <path d="M7.90897 4.73864C7.948 4.75425 7.98702 4.76986 8.02605 4.78547C8.16394 4.84271 8.30183 4.90255 8.43973 4.9702C8.63746 5.06906 8.82219 5.17834 9.00431 5.29281C9.05374 5.32403 9.10057 5.35525 9.1474 5.38648C9.19944 5.4203 9.25408 5.45412 9.30611 5.49055L9.44921 5.20175C9.60531 4.88694 9.47783 4.50188 9.16301 4.34838L8.50477 4.01795C8.35387 3.9425 8.17955 3.9295 8.01824 3.98413C7.85694 4.03877 7.72685 4.15064 7.6514 4.30415L7.5083 4.59554C7.52911 4.60335 7.55253 4.61115 7.57334 4.61896C7.68522 4.65278 7.7971 4.69441 7.90897 4.73864Z" />
                        <path d="M9.20995 6.2685C9.20735 6.26589 9.20735 6.26589 9.20995 6.2685C9.05125 6.13581 8.88213 6.01352 8.70261 5.89645C8.52309 5.77937 8.33577 5.67269 8.13803 5.57123C7.75037 5.3787 7.3471 5.233 6.94643 5.13673C6.49893 5.03006 6.05143 4.97803 5.60913 4.97803C3.51732 4.97803 1.56861 6.14621 0.592955 8.09232C-0.793778 10.8632 0.335382 14.2481 3.10885 15.6374C5.88231 17.0241 9.26719 15.8924 10.6539 13.1189C11.8351 10.7643 11.2419 7.94662 9.20995 6.2685ZM2.05254 8.82081C1.52698 9.86932 1.49056 11.0921 1.95107 12.1719C2.02392 12.3436 1.94326 12.5413 1.77415 12.6142C1.72992 12.6324 1.68569 12.6402 1.64146 12.6402C1.51137 12.6402 1.38649 12.5621 1.33185 12.4346C0.79329 11.1728 0.83752 9.74443 1.45153 8.51901C1.53479 8.3525 1.73773 8.28485 1.90424 8.36811C2.06815 8.45136 2.13579 8.6543 2.05254 8.82081Z" />
                        <path d="M3.83992 14.175C3.39503 13.9539 3.00216 13.6573 2.67174 13.293C2.54685 13.1551 2.33351 13.1447 2.19562 13.2696C2.05773 13.3945 2.04732 13.6078 2.1722 13.7457C2.55986 14.1698 3.01777 14.5185 3.53552 14.776C3.58495 14.7994 3.63439 14.8125 3.68642 14.8125C3.8087 14.8125 3.92838 14.7448 3.98822 14.6277C4.07148 14.4612 4.00383 14.2583 3.83992 14.175Z" />
                        <path d="M13.0423 0.495126C12.8575 0.469109 12.6858 0.593993 12.6572 0.776115L12.5167 1.68413C12.4881 1.86885 12.6156 2.04057 12.7977 2.06919C12.8159 2.07179 12.8315 2.07439 12.8497 2.07439C13.0136 2.07439 13.1567 1.95471 13.1828 1.7882L13.3233 0.880185C13.3519 0.695461 13.2244 0.523745 13.0423 0.495126Z" />
                        <path d="M14.7128 1.23925C14.5619 1.12997 14.3511 1.1664 14.2445 1.3173L13.7215 2.05359C13.6148 2.2045 13.6487 2.41524 13.7996 2.52191C13.8594 2.56354 13.9271 2.58435 13.9947 2.58435C14.0988 2.58435 14.2028 2.53492 14.2679 2.44386L14.7908 1.70756C14.8975 1.55666 14.8637 1.34852 14.7128 1.23925Z" />
                        <path d="M15.9614 2.57377C15.8756 2.40986 15.67 2.34742 15.5061 2.43328L14.6944 2.86257C14.5305 2.94842 14.468 3.15396 14.5539 3.31787C14.6137 3.43235 14.7308 3.49739 14.8531 3.49739C14.9051 3.49739 14.9598 3.48438 15.0092 3.45837L15.8209 3.02908C15.9848 2.94062 16.0473 2.73768 15.9614 2.57377Z" />
                    </svg>
                    <span class="text-green-gradient-exact">Mines</span>
                </router-link>
                <router-link v-on:click.native="generalSetSidebarMobile(null)" to="/towers">
                    <svg width="11" height="15" viewBox="0 0 11 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10.7526 0H8.72751C8.59087 0 8.48009 0.110779 8.48009 0.247413V1.48448H6.82861V0.247413C6.82861 0.110779 6.71783 0 6.5812 0H4.41757C4.28093 0 4.17015 0.110779 4.17015 0.247413V1.48448H2.51991V0.247413C2.51991 0.110779 2.40913 0 2.27249 0H0.247413C0.110779 0 0 0.110779 0 0.247413V2.9034C0.00136077 3.57305 0.543908 4.1156 1.21356 4.11696H1.21851H9.78644C10.4561 4.1156 10.9986 3.57305 11 2.9034V0.247413C11 0.110779 10.8892 0 10.7526 0Z" />
                        <path d="M9.58606 4.48682H1.42141L1.07132 12.43V12.5067C1.06894 12.8843 1.19648 13.2512 1.43255 13.5459C1.64925 13.8246 1.97469 13.9974 2.32694 14.0209H8.68176C9.03401 13.9974 9.35946 13.8246 9.57616 13.5459C9.81222 13.2512 9.93976 12.8843 9.93738 12.5067C9.93738 12.4919 9.93738 12.4659 9.93738 12.43L9.58606 4.48682ZM7.38036 13.5384H3.62463V10.0549C3.62463 9.01671 4.4662 8.17513 5.50435 8.17513C6.5425 8.17513 7.38408 9.01671 7.38408 10.0549L7.38036 13.5384Z" />
                    </svg>
                    <span class="text-green-gradient-exact">Towers</span>
                </router-link>
            </div>
        </div>
    </nav>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';
    import IconChatGradient from '@/components/icons/IconChatGradient';
    import IconNavbarGradient from '@/components/icons/IconNavbarGradient';
    import IconHome from '@/components/icons/IconHome';
    import IconUser from '@/components/icons/IconUser';
    import IconVault from '@/components/icons/IconVault';
    import IconRakeback from '@/components/icons/IconRakeback';
    import IconAffiliates from '@/components/icons/IconAffiliates';
    import IconLeaderboard from '@/components/icons/IconLeaderboard';
    import IconSignOut from '@/components/icons/IconSignOut';
    import IconCrash from '@/components/icons/IconCrash';
    import IconBlackjack from '@/components/icons/IconBlackjack';
    import IconRoll from '@/components/icons/IconRoll';
    import IconDuels from '@/components/icons/IconDuels';
    import AuthButton from '@/components/AuthButton';
    import NavbarHomeDropdown from '@/components/navbar/NavbarHomeDropdown';
    import NavbarCashier from '@/components/navbar/NavbarCashier';
    import NavbarUserDropdown from '@/components/navbar/NavbarUserDropdown';

    export default {
        name: 'Navbar',
        components: {
            IconChatGradient,
            IconNavbarGradient,
            IconHome,
            IconUser,
            IconVault,
            IconRakeback,
            IconAffiliates,
            IconLeaderboard,
            IconSignOut,
            IconCrash,
            IconBlackjack,
            IconRoll,
            IconDuels,
            AuthButton,
            NavbarHomeDropdown,
            NavbarCashier,
            NavbarUserDropdown
        },
        methods: {
            ...mapActions([
                'notificationShow', 
                'modalsSetShow', 
                'generalSetSidebarMobile', 
                'authLogoutUser'
            ]),
            navbarVaultButton() {
                this.modalsSetShow('Vault');
                this.generalSetSidebarMobile(null);
            }
        },
        computed: {
            ...mapGetters([
                'generalSidebarMobile', 
                'authUser'
            ])
        }
    }
</script>

<style scoped>
    nav#navbar {
        width: calc(100% - 325px);
        height: 100px;
        position: fixed;
        display: flex;
        justify-content: space-between;
        align-items: center;
        top: 0;
        left: 0;
        padding: 0 50px;
        background: rgba(13, 49, 78, 0.36);
        z-index: 50;
    }

    nav#navbar .navbar-left,
    nav#navbar .navbar-right  {
        width: calc(50% - 176px);
        display: flex;
        align-items: center;
        z-index: 1;
    }

    nav#navbar .navbar-right  {
        justify-content: flex-end;
    }

    nav#navbar .navbar-left button.button-chat {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background: rgba(41, 81, 113, 0.29);
        border: 1px solid rgba(41, 105, 158, 0.30);
        display: none;
    }

    nav#navbar .navbar-left button.button-chat .button-inner  {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    nav#navbar .navbar-left button.button-chat .button-inner svg {
        width: 14px;
        margin-top: 2px;
    }

    nav#navbar .navbar-left a.link-logo {
        display: flex;
        align-items: center;
        margin-right: 30px;
    }

    nav#navbar .navbar-left a.link-logo img {
        height: 45px;
    }

    nav#navbar .navbar-left a.link-home {
        width: 50px;
        height: 50px;
        position: relative;
        margin-right: 10px;
        padding: 1px;
        z-index: 1;
        transition: all .2s;
    }
    .link-home:active {
        transition-duration: .2s;
        scale: .9;
    }

    nav#navbar .navbar-left a.link-home::before {
        content: '';
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background: linear-gradient(180deg, rgba(0, 133, 255, 0) 0%, #328adb 100%);
        clip-path: polygon(8px 0, calc(100% - 8px) 0, 100% 25%, 100% 75%, calc(100% - 8px) 100%, 8px 100%, 0 75%, 0 25%);
        z-index: -1;
    }

    nav#navbar .navbar-left a.link-home::after {
        content: '';
        width: calc(100% - 2px);
        height: calc(100% - 2px);
        position: absolute;
        top: 1px;
        left: 1px;
        background: #061628;
        clip-path: polygon(8px 0, calc(100% - 8px) 0, 100% 25%, 100% 75%, calc(100% - 8px) 100%, 8px 100%, 0 75%, 0 25%);
        z-index: -1;
    }

    nav#navbar .navbar-left a.link-home .link-inner {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        background: linear-gradient(255deg, rgba(59, 126, 183, 0.5) -70%, rgba(20, 80, 129, 0.5) 90%);
        clip-path: polygon(8px 0, calc(100% - 8px) 0, 100% 25%, 100% 75%, calc(100% - 8px) 100%, 8px 100%, 0 75%, 0 25%);
        transition: background 0.3s ease;
    } 

    nav#navbar .navbar-left a.link-home:hover .link-inner {
        background: linear-gradient(255deg, #3b7eb7 -70%, #145081 90%);
    }

    nav#navbar .navbar-left a.link-home .link-inner svg {
        fill: #6e95b6;
        transition: fill 0.3s ease;
    }

    nav#navbar .navbar-left a.link-home:hover .link-inner svg {
        fill: #ffffff;
    }

    nav#navbar .navbar-mid button.auth-button {
        display: none;
    }

    nav#navbar .right-auth {
        display: flex;
        align-items: center;
    }

    nav#navbar a.link-rewards {
        width: 155px;
        height: 55px;
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-end;
        margin-right: 25px;
        padding: 0 15px 0 50px;
        border-radius: 5px;
        background: radial-gradient(220% 220% at 50% 15%, rgba(41, 186, 151, 0.4) 0%, rgba(6, 35, 60, 0.4) 100%);
        transition: all .2s;
    }
    nav#navbar a.link-rewards:hover {
        transition-duration: .2s;
        scale: 1.03;
    }

    nav#navbar a.link-rewards:active {
        transition-duration: .2s;
        scale: .9;
    }
    nav#navbar a.link-rewards img {
        width: 71px;
        position: absolute;
        top: 50%;
        left: -15px;
        transform: translate(0, -50%);
        filter: drop-shadow(0px 0px 4px rgba(255, 245, 59, 0.35));
    }

    nav#navbar a.link-rewards span {
        /* font-family: 'Rubik'; */
        font-size: 14px;
        font-weight: 900;
        background: linear-gradient(180deg, #ffffff 1.75%, rgba(108, 255, 211, 0.85) 35%, rgba(0, 255, 71, 0.55) 70.93%, #7bff90 95%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        filter: drop-shadow(0px 0px 10px rgba(255, 10, 10, 0.25));
    }

    nav#navbar .navbar-right button.button-toggle {
        width: 36px;
        height: 28px;
        display: none;
        filter: drop-shadow(0px 1.8px 1.8px rgba(0, 0, 0, 0.10));
    }

    nav#navbar .navbar-right button.button-toggle .button-inner {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        background: #214059;
        clip-path: polygon(4px 0, calc(100% - 4px) 0, 100% 25%, 100% 75%, calc(100% - 4px) 100%, 4px 100%, 0 75%, 0 25%);
    }

    nav#navbar .navbar-right button.button-toggle .button-inner svg {
        fill: #5b7b95;
        transition: fill 0.3s ease;
    }

    nav#navbar .navbar-right button.button-toggle:hover .button-inner svg {
        fill: #ffffff;
    }

    nav#navbar .navbar-mobile {
        width: 100vw;
        height: 100vh;
        position: fixed;
        top: 0;
        right: 0;
        transform: translate(100%, 0);
        padding: 95px 21px 0 21px;
        overflow-y: scroll;
        background-color: #021423;
        z-index: 0;
        transition: transform 0.3s ease;
    }

    nav#navbar .navbar-mobile a,
    nav#navbar .navbar-mobile button {
        width: 100%;
        position: relative;
        display: flex;
        align-items: center;
        padding-bottom: 8px;
        font-size: 16px;
        font-weight: 600;
        color: #bbbfd0;
        border-bottom: 1px solid #102b3f;
    }

    nav#navbar .navbar-mobile .mobile-user a,
    nav#navbar .navbar-mobile .mobile-games a,
    nav#navbar .navbar-mobile .mobile-user button {
        margin-top: 25px;
    }

    nav#navbar .navbar-mobile a.router-link-exact-active,
    nav#navbar .navbar-mobile a.link-blackjack.router-link-active {
        background: linear-gradient(250deg, #00ffc2 0%, #00aa6d 100%), #a6cae8;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        text-fill-color: transparent;
    }

    nav#navbar .navbar-mobile a::before,
    nav#navbar .navbar-mobile button::before {
        width: 100%;
        height: 1px;
        position: absolute;
        bottom: 0;
        left: 0;
        background-color: #102b3f;
    }

    nav#navbar .navbar-mobile a svg,
    nav#navbar .navbar-mobile button svg {
        width: 13px;
        margin-right: 8px;
        fill: #bbbfd0;
    }

    nav#navbar .navbar-mobile a.router-link-exact-active svg,
    nav#navbar .navbar-mobile a.link-blackjack.router-link-active svg {
        fill: #00ffc2;
    }

    nav#navbar .mobile-games {
        margin-top: 40px;
        font-size: 16px;
        font-weight: 800;
        color: #ffffff;
    }

    @media only screen and (max-width: 1750px) {

        nav#navbar {
            padding: 0 10px;
        }

    }

    @media only screen and (max-width: 1650px) {

        nav#navbar .left-rakeback,
        nav#navbar .right-links {
            display: none;
        }

    }

    @media only screen and (max-width: 1500px) {

        nav#navbar {
            width: 100%;
        }

    }

    @media only screen and (max-width: 1175px) {

        nav#navbar {
            height: 80px;
            padding: 0 20px;
            background: rgba(9, 40, 65, 0.48);
            border-bottom: 1px solid rgba(27, 64, 92, 0.35);
        }

        nav#navbar .navbar-left, 
        nav#navbar .navbar-right {
            width: auto;
        }

        nav#navbar .navbar-left button.button-chat,
        nav#navbar .navbar-right button.button-toggle {
            display: block;
        }

        nav#navbar .navbar-left a.link-logo,
        nav#navbar .navbar-left a.link-home,
        nav#navbar .navbar-left .navbar-home-dropdown,
        nav#navbar .navbar-right button.auth-button,
        nav#navbar .right-auth {
            display: none;
        }

        nav#navbar .navbar-mid button.auth-button {
            display: block;
        }

        nav#navbar .navbar-mobile.mobile-open {
            transform: translate(0, 0);
        }

    }
</style>
