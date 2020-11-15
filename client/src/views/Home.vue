<template>
  <div id="home">
    <div class="header">
      <h1>Chatroom</h1>
      <p class="username">Username: {{ username }}</p>
      <p class="online">Online: {{ users.length }}</p>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import io from 'socket.io-client';

export default {
  name: 'Home',
  components: {},
  data: () => {
    return{
      username: null,
      socket: io("http://localhost:4000"),
      messages: [],
      users: []
    }
  },
  created() {},
  mounted() {
    //this.username = prompt('Quel est votre pseudo ?', 'Anonymous');
    if(!this.username) this.username = 'Anonymous';//this.username = !this.username ? 'Anonymous' : this.username
    this.joinServer();
  },
  methods: {
    joinServer: function(){
      this.socket.on('loggedIn', data => {
        this.messages = data.messages;
        this.users = data.users;
        this.socket.emit('newuser',this.username);
      });
    }
  },
}
</script>
<style lang="scss">
body{
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  color: #2C3E50;
  margin:0;
  padding:0;
}

#home{
  display:flex;
  flex-direction:column;
  height: 100vh;
  width: 100%;
  max-width: 768px;
  margin:0 auto;
}
</style>
