'use client';
import { REMOVE_CHARACTERISTIC } from '@/graphql/mutations/mutations';
import { ChatbotCharacteristic } from '@/types/types';
import { useMutation } from '@apollo/client';
import { OctagonX } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from './ui/button';

function Characteristic({
  characteristic,
}: {
  characteristic: ChatbotCharacteristic;
}) {
  const [removeCharacteristic] = useMutation(REMOVE_CHARACTERISTIC, {
    refetchQueries: ['GetChatbotById'],
  });
  const handleRemoveCharacteristic = async (characteristicId: number) => {
    try {
      await removeCharacteristic({
        variables: {
          id: characteristicId,
        },
      });
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <li className="p-10 m-2 bg-white border rounded-md relative">
      {characteristic.content}
      <Button
        variant="destructive"
        className="w-2 h-6 text-white fill-red-500 absolute top-1 right-1 cursor-pointer hover:opacity-50"
        onClick={() => {
          const promise = handleRemoveCharacteristic(characteristic.id);
          toast.promise(promise, {
            loading: 'Removing...',
            success: 'Characteristic removed',
            error: 'failed to removed characteristic',
          });
        }}
      >
        X{' '}
      </Button>
    </li>
  );
}
export default Characteristic;
