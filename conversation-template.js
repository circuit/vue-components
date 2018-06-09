Vue.component('conversation-list', {
    props: {
      client: Object,
      amount: { // defines the amount of conversations searched by the API, defaulted to 10
        default : 10,
        type: Number
      },
      size: { // defines the amount of conversations displayed in the list, defaulted to 5
        default: 5,
        type: Number
      }
    },
    template: `<div>
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
        this.$emit('on-change', conversation);
      },
      getConversations: async function () {
        const convs = await this.client.getConversations({ numberOfConversations: this.amount });
        const userIdsNeeded = []; // userIds to be added, from direct conversations
        convs.forEach(conversation => {
          // if this is a direct conversation pushes userId, else sets the title
          if (conversation.type === Circuit.Enums.ConversationType.DIRECT) {
            const peerUser = conversation.participants.filter(id => id !== this.client.loggedOnUser.userId)[0];
            conversation.peerUser = peerUser;
            userIdsNeeded.push(peerUser);
          }
          this.conversations.push(conversation);
        });
        this.conversations = this.conversations.reverse();
        // gets all the user information of direct conversations early
        this.client.getUsersById(userIdsNeeded)
          .then(users => {
            users.forEach(user => { 
              this.usersHashtable[user.userId] = user;
            });
            // goes through the conversations setting the title for direct conversations
            this.conversations.forEach(conv => conv.topic = conv.topic || conv.topicPlaceholder || this.usersHashtable[conv.peerUser].displayName);
            this.$emit('on-loaded', this.conversations); 
          })
          .catch(console.error);
      }
    }
  });