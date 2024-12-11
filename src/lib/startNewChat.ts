import client from '@/graphql/apolloClient';
import {
  INSERT_CHAT_SESSION,
  INSERT_GUEST,
  INSERT_MESSAGE,
} from '@/graphql/mutations/mutations';

async function startNewChat(
  guestName: string,
  guestEmail: string,
  chatbotId: number
) {
  try {
    const guestResult = await client.mutate({
      mutation: INSERT_GUEST,
      variables: {
        name: guestName,
        email: guestEmail,
        created_at: new Date(),
      },
    });
    const guestId = guestResult.data.insertGuests.id;
    const chatSessionResult = await client.mutate({
      mutation: INSERT_CHAT_SESSION,
      variables: {
        chatbot_id: chatbotId,
        guest_id: guestId,
        created_at: new Date(),
      },
    });
    const chatSessionId = chatSessionResult.data.insertChat_sessions.id;

    await client.mutate({
      mutation: INSERT_MESSAGE,
      variables: {
        chat_session_id: chatSessionId,
        created_at: new Date(),
        content: `Welcome ${guestName}!\n How can I assist you today? 😁`,
        sender: 'ai',
      },
    });
    console.log('new chat has started successfully');
    return chatSessionId;
  } catch (error) {
    console.error('error starting a new chat session!', error);
  }
}

export default startNewChat;
