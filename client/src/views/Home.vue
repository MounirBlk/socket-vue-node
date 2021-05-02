<template>
  <div id="home">
    <div class="header">
      <h1>Chatroom</h1>
      <p class="username">Username: {{ username }}</p>
      <p class="online">Online: {{ users.length }}</p>
    </div>
    <ChatRoom :messages="messages" @sendMessage="this.sendMessage"/>
  </div>
</template>

<script>
// @ is an alias to /src
import io from 'socket.io-client';
import ChatRoom from '../components/ChatRoom.vue';

export default {
  name: 'Home',
  components: {
    ChatRoom
  },
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
    if(!this.username) this.username = 'Anonymous'+parseInt(Math.floor(Math.random() * Math.floor(9))+1);//this.username = !this.username ? 'Anonymous' : this.username
    this.joinServer();
  },
  methods: {
    joinServer: function(){
      this.socket.on('loggedIn', data => {
        this.messages = data.messages;
        this.users = data.users;
        this.socket.emit('newuser',this.username);
      });
      this.listen();
    },
    listen: function(){
      this.socket.on('userOnline', user => {
        this.users.push(user);
      });
      this.socket.on('userLeft',user => {
        this.users.splice(this.users.indexOf(user), 1);
      });
      this.socket.on('msg', message =>{
        this.messages.push(message)
      });
    },
    sendMessage:function(message){
      this.socket.emit('msg', message);
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
  padding:15px;
  box-sizing:border-box;
}
</style>
