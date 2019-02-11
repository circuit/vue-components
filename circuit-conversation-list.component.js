import Vue from 'vue';

export default Vue.component('circuitConversationList', {
  props: {
    client: Object,
    amount: {
      default: 10,
      type: Number
    },
    size: {
      default: 5,
      type: Number
    },
    type: {
      default: null, // Default is both. Other values: 'DIRECT', 'GROUP'
      type: String
    }
  },
  template: `
    <div>
      <select class="select-wide" :size="size">
        <option v-for="conversation in conversations" @click="conversationSelected(conversation)">{{ conversation.topic || conversation.topicPlaceholder }}</option>
      </select>
    </div>`,
  data: function () {
    return {
      conversations: [],
      usersHashtable: {}
    }
  },
  created: async function () {
    this.getConversations();
  },
  methods: {
    conversationSelected: function (conversation) {
      this.$emit('change', conversation);
    },
    getConversations: async function () {
      let convs = [];
      if (this.type) {
        convs = await this.client.getConversationsByType(this.type, {numberOfConversations: this.amount});
      } else {
        convs = await this.client.getConversations({numberOfConversations: this.amount});
      }
      const userIdsNeeded = [];
      convs.reverse().forEach(conversation => {
        if (conversation.type === 'DIRECT') {
          const peerUser = conversation.participants.filter(id => id !== this.client.loggedOnUser.userId)[0];
          conversation.peerUser = peerUser;
          userIdsNeeded.push(peerUser);
        }
        this.conversations.push(conversation);
      });
      this.conversations = this.conversations.reverse();
      this.client.getUsersById(userIdsNeeded)
        .then(users => {
          users.forEach(user => {
            this.usersHashtable[user.userId] = user;
          });
          this.conversations.forEach(conv => conv.topic = conv.topic || conv.topicPlaceholder || this.usersHashtable[conv.peerUser].displayName);
          this.$emit('loaded', this.conversations);
        })
        .catch(console.error);
    }
  }
});
