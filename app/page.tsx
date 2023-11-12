'use client';

import Chat from '@/components/Chat';

export default function Home() {
  return (
    <main className='flex min-h-screen flex-col items-center justify-between pt-12 pb-24 px-24'>
      <div className='flex items-center mb-3'>
        <img
          src='../../../chatbot.png'
          width={45}
          className='filter-white mr-2'
        ></img>
        <h1 className='text-5xl'>章鱼工作室</h1>
      </div>
      <Chat />
    </main>
  );
}
