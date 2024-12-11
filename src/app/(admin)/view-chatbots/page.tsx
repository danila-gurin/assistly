import Avatar from '@/components/Avatar';
import { Button } from '@/components/ui/button';
import { GET_CHATBOTS_BY_USER } from '@/graphql/queries/queries';
import { serverClient } from '@/lib/server/serverClient';
import {
  GetChatbotsByUserData,
  GetChatbotsByUserDataVariables,
} from '@/types/types';
import { auth } from '@clerk/nextjs/server';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

async function ViewChatbots() {
  const { userId } = await auth();

  if (!userId) return null;

  // get chatbots for the user
  try {
    const response = await serverClient.query<
      GetChatbotsByUserData,
      GetChatbotsByUserDataVariables
    >({
      query: GET_CHATBOTS_BY_USER,
    });
    // Debug log to see what we're receiving
    console.log('GraphQL Response:', response);

    if (!response || !response.data || !response.data.chatbotsList) {
      console.error('Invalid response structure:', response);
      return <div>No chatbots found or error loading chatbots.</div>;
    }

    // Filter chatbots by clerk_user_id on the client side since we're having issues with the backend filter
    const userChatbots = response.data.chatbotsList.filter(
      (chatbot) => chatbot.clerk_user_id === userId
    );

    const sortedChatbots = [...userChatbots].sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    if (sortedChatbots.length === 0) {
      return <div>No chatbots found for this user.</div>;
    }

    return (
      <div className="flex-1 pb-20 p-10">
        <h1 className="text-xl lg:text-3xl font-semibold mb-5">
          Active Chatbots
        </h1>
        {sortedChatbots.length === 0 && (
          <div>
            <p>
              You have not created any chatbots yet, clickon the button below to
              create one.
            </p>
            <Link href="/create-chatbot">
              <Button className="bg-[#64B5F5] text-white p-3 rounded-md mt-5">
                Create Chatbot
              </Button>
            </Link>
          </div>
        )}

        <ul className="flex flex-col space-y-5">
          {sortedChatbots.map((chatbot) => (
            <Link
              key={chatbot.id}
              href={`/edit-chatbot/${chatbot.id}`}
              className=""
            >
              <li className="relative p-10 border roundeed-md max-w-3xl bg-white">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <Avatar seed={chatbot.name} />
                    <h2 className="text-xl font-semibold">{chatbot.name}</h2>
                  </div>
                  <p className="absolute top-5 right-5 text-xs text-gray-400">
                    Created: {new Date(chatbot.created_at).toLocaleString()}
                  </p>
                </div>
                <hr className="mt-2" />
                <div className="grid grid-cols-2 md:gap-5 p-5">
                  <h3 className="italic">Characteristics</h3>
                  <ul className="text-sm">
                    {!chatbot.chatbot_characteristics.length && (
                      <p>No characteristic added yet.</p>
                    )}
                    {chatbot.chatbot_characteristics.map((characteristic) => (
                      <li
                        className="list-disc break-words"
                        key={characteristic.id}
                      >
                        {characteristic.content}
                      </li>
                    ))}
                  </ul>

                  <h3 className="italic">No of Sessions:</h3>
                  <p>{chatbot.chat_sessions.length}</p>
                </div>
              </li>
            </Link>
          ))}
        </ul>
      </div>
    );
  } catch (error) {
    console.error('Error fetching chatbots:', error);
    return <div>Error loading chatbots. Please try again later.</div>;
  }
}

export default ViewChatbots;
