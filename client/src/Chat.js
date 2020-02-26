import React from 'react';
import { useQuery, useMutation, useSubscription } from '@apollo/react-hooks'
import { messagesQuery, addMessageMutation, messageAddedSubscription } from './graphql/queries';
import MessageInput from './MessageInput';
import MessageList from './MessageList';

//function should be moved somewhere else, 
//but is kept here for contextualizing the hook within the chat component
//in actual production code would be added to and imported from a separate hooks.js file

const useChatMessages = () => {

  const {data} = useQuery(messagesQuery);
  const messages = data ? data.messages : []
  useSubscription(messageAddedSubscription, {
  onSubscriptionData: ({client, subscriptionData})=> (
      client.writeData({data: {
        messages: [...messages, subscriptionData.data.messageAdded]
      }})
      )
  });
  const [addMessage] = useMutation(addMessageMutation);
  
  //in js you can modify an existing function in the way seen below to simplify things
  return { 
    messages, 
    addMessage: (text)=>addMessage({variables: {input: {text}}})
  }

}

const Chat = ({user}) => {

  const {addMessage, messages} = useChatMessages();
  
  const handleSend = async (text) => {
    await addMessage(text)
  }

  return (
    <section className="section">
      <div className="container">
        <h1 className="title">Chatting as {user}</h1>
        <MessageList user={user} messages={messages} />
        <MessageInput onSend={addMessage} />
      </div>
    </section>
  );
}

export default Chat;
