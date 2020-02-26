import React from 'react';
import { useQuery, useMutation, useSubscription } from '@apollo/react-hooks'
import { messagesQuery, addMessageMutation, messageAddedSubscription } from './graphql/queries';
import MessageInput from './MessageInput';
import MessageList from './MessageList';

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
  
  return { messages, addMessage}

}

const Chat = ({user}) => {

  const {addMessage, messages} = useChatMessages();
  
  const handleSend = async (text) => {
    await addMessage({variables: {input: {text}}})
  }

  return (
    <section className="section">
      <div className="container">
        <h1 className="title">Chatting as {user}</h1>
        <MessageList user={user} messages={messages} />
        <MessageInput onSend={handleSend} />
      </div>
    </section>
  );
}

export default Chat;
