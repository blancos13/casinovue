<template>
  <div class="admin-filter-type" v-bind:class="{ 'type-open': adminDropdown === true }">
      <button v-on:click="adminToggleDropdown" class="button-toggle">
          <div class="button-value">
              Type: <span>{{adminFilterType}}</span>
          </div>
          <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.5176 1.66411e-06L0.482354 8.43375e-08C0.0547936 9.58042e-09 -0.16302 0.516304 0.143533 0.822859L4.66115 5.34052C4.8467 5.52607 5.15325 5.52607 5.33888 5.34052L9.8565 0.822861C10.163 0.516306 9.94516 1.73887e-06 9.5176 1.66411e-06Z" />
          </svg>
      </button>
      <div class="type-menu">
          <div class="menu-inner">
              <button v-on:click="adminSetButton('Wager')">Wager</button>
              <button v-on:click="adminSetButton('Deposit')">Deposit</button>
          </div>
      </div>
  </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';

    export default {
        name: 'AdminFilterType',
        data() {
            return {
                adminDropdown: false
            }
        },
        methods: {
            ...mapActions([
                'adminSetFilterType'
            ]),
            adminToggleDropdown() {
                this.adminDropdown = !this.adminDropdown;
            },
            adminSetButton(value) {
                this.adminSetFilterType(value);
                this.adminToggleDropdown();
            }
        },
        computed: {
            ...mapGetters([
                'adminFilterType'
            ])
        },
        created() {
            let self = this;
            document.addEventListener('click', function(event) {
                if(!self.$el.contains(event.target) && self.adminDropdown == true) {
                    self.adminToggleDropdown();
                }
            });
        }
    }
</script>

<style scoped>
  .admin-filter-type {
      width: 100%;
      position: relative;
      z-index: 11;
  }

  .admin-filter-type button.button-toggle {
      width: 100%;
      height: 47px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 20px;
      border-radius: 5px;
      background: rgba(19, 66, 88, 0.25);
  }

  .admin-filter-type button.button-toggle svg {
      fill: #49687d;
      transition: all 0.3s ease;
  }

  .admin-filter-type.type-open button.button-toggle svg {
      transform: rotate(180deg);
  }

  .admin-filter-type button.button-toggle .button-value {
      font-size: 16px;
      font-weight: 600;
      color: #49687d;
  }

  .admin-filter-type button.button-toggle .button-value span {
      color: #ffffff;
  }

  .admin-filter-type .type-menu {
      width: 100%;
      height: 0;
      position: absolute;
      top: 52px;
      left: 0;
      overflow: hidden;
      transition: height 0.2s ease;
  }

  .admin-filter-type.type-open .type-menu {
      height: 100px;
  }

  .admin-filter-type .menu-inner {
      width: 100%;
      padding: 3px;
      border-radius: 5px;
      background: #022038;
  }

  .admin-filter-type .menu-inner button {
      width: 100%;
      height: 47px;
      display: flex;
      align-items: center;
      padding: 0 14px;
      border-radius: 5px;
      font-size: 14px;
      font-weight: 600;
      color: #8bacc8;
      transition: 0.3s ease;
  }

  .admin-filter-type .menu-inner button:hover {
      background: rgba(19, 66, 88, 0.15);
  }
</style>