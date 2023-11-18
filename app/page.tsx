'use client';

import Chat from '@/components/Chat';

export default function Home() {
  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-5 sm:pt-12 sm:pb-24 sm:px-24'>
      <div className='flex items-center mb-3'>
        <img
          src='../../../chatbot.png'
          // width={45}
          className='filter-white mr-2 w-12 sm:w-14'
        ></img>
        <h1 className='text-center text-4xl sm:text-5xl'>章鱼工作室</h1>
      </div>
      <Chat />
    </main>
  );
}
