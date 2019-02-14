import Vue from 'vue';

export default Vue.component('circuit-logon', {
  props: {
    client: {
      type: Object,
      default: function() {
        return {}
      }
    },
    title: {
      type: String,
      default: 'Circuit SDK example'
    },
    description: {
      type: String,
      default: 'Build amazing real-time apps using Circuit APIs'
    }
  },
  template: `
    <div class="d-flex align-items-center pb-2 mb-2 border-bottom">
      <img class="ml-2" width="40px" src="https://storage.googleapis.com/circuit-assets/circuit-api.png">
      <div class="ml-2" style="line-height:1.2">
        <h6 class="mb-0">{{title}}</h6>
        <small class="mt-0">{{description}}</small><br>
        <small class="text-secondary mt-0">Running on {{client.domain}}. Fork at
          <a :href="stackblitzEditUrl">stackblitz</a>.
        </small>
      </div>
      <button type="button" class="btn btn-outline-primary btn-sm ml-auto mr-2"
        v-on:click="logon"
        v-if="!user">Logon
      </button>
      <div v-if="user" class="ml-auto d-flex mr-2">
        <div class="d-flex flex-column">
          <div v-if="user" style="line-height:1.3">{{user.displayName}}</div>
          <a class="align-self-end" style="line-height:1" type="link" href="#"
            v-on:click="logout"
            v-if="user"><small>Logout</small>
          </a>
        </div>
        <img class="rounded ml-2" style="width:34px;height:34px" :src="user.avatar">
      </div>
    </div>`,
  data: function() {
    return {
      connectionState: 'Disconnected',
      user: null,
      stackblitzEditUrl: null
    }
  },
  created: function() {
    this.stackblitzEditUrl = `https://stackblitz.com/edit/${window.location.host.split('.')[0]}`;

    // Check if token is present, and if so auto-logon
    this.client.logonCheck()
      .then(this.logon)
      .catch(console.log);

    // Listen for connection changes to Circuit server
    this.client.addEventListener('connectionStateChanged', evt => {
      this.connectionState = evt.state;
      if (evt.state === 'Disconnected') {
        this.user = null;
      }
    });
  },
  methods: {
    logon: function() {
      this.client.logon()
        .then(user => {
          this.user = user;
          this.$emit('logon', user);
        })
        .catch(console.error);
    },
    logout: function() {
      this.client.logout()
        .then(() => this.$emit('logout', { success: true }))
        .catch(err => {
          console.error(err);
          this.$emit({ error: err });
        });
    }
  }
})

