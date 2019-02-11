# vue-components

This repo contains vue.js components for Circuit that are used in Circuit SDK examples, specificially in https://stackblitz.com example apps that allow ES6 imports using webpack.

The components circuit-logon.js and conversation-template.js are legacy components. Don't use those.

## Components

### circuit-logon.component.js
Login/logout functionality. Show a header with username and avatar when logged in.

```html
<circuit-logon
  :client="client"
  @logon="onLogon"
  @logout="onLogout"
  title="Template">
</circuit-logon>
```

### circuit-conversation-list.component.js
Listview of conversations. Raises change event when conversation is selected.

```html
<circuit-conversation-list
  :client="client"
  :type="'GROUP'"
  @change="selectedConversation=$event">
</circuit-conversation-list>
```

## Usage

See https://stackblitz.com/edit/circuitsdk-template
<iframe src="https://stackblitz.com/edit/circuitsdk-template?embed=1&file=index.html"></iframe>

